import fs from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";
import { examSchema } from "../lib/exam-schema";
import { walk } from "../lib/fs-utils";

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("NEXT_PUBLIC_SUPABASE_URL과 SUPABASE_SERVICE_ROLE_KEY가 필요합니다. .env.example을 참고하세요.");
  const db = createClient(url, key, { auth: { persistSession: false } });
  const files = (await walk("data/imported")).filter((f) => f.endsWith("questions.json"));
  let imported = 0;
  for (const file of files) {
    const exam = examSchema.parse(JSON.parse(fs.readFileSync(file, "utf8")));
    const source = path.join("source/past-exams", fs.readdirSync("source/past-exams").find((n) => n.normalize("NFC") === exam.sourceDocument)!);
    const storagePath = `${exam.year}/${exam.round}/${exam.sourceDocument.replace(/[^\p{L}\p{N}._-]+/gu, "_")}`;
    const { error: uploadError } = await db.storage.from("exam-source-pdfs").upload(storagePath, fs.readFileSync(source), { contentType: "application/pdf", upsert: false });
    if (uploadError && !/already exists|Duplicate/i.test(uploadError.message)) throw uploadError;
    const { data: doc, error: docError } = await db.from("source_documents").upsert({ original_filename: exam.sourceDocument, normalized_filename: path.basename(storagePath), storage_path: storagePath, mime_type: "application/pdf", file_size: fs.statSync(source).size, sha256: exam.sourceSha256, exam_year: exam.year, exam_round: exam.round, page_count: exam.sourcePages, extraction_method: "pdfjs_text_layer", extraction_status: "validated", question_count: exam.questions.length, is_duplicate: false }, { onConflict: "sha256" }).select("id").single();
    if (docError) throw docError;
    const { data: set, error: setError } = await db.from("exam_sets").upsert({ year: exam.year, round: exam.round, title: exam.title, total_questions: exam.questions.length, expected_questions: 100, source_document_id: doc.id, validation_status: "validated", is_published: true }, { onConflict: "year,round" }).select("id").single();
    if (setError) throw setError;
    for (const q of exam.questions) {
      const { data: question, error } = await db.from("questions").upsert({ exam_set_id: set.id, question_no: q.questionNo, question_text: q.questionText, source_text: q.originalQuestionText, source_page: q.sourcePage, normalized_hash: q.normalizedHash, needs_review: q.needsReview, is_published: true, source_type: q.sourceType, is_code: q.isCode, is_sql: q.isSql }, { onConflict: "exam_set_id,question_no" }).select("id").single();
      if (error) throw error;
      await db.from("question_choices").upsert(Object.entries(q.choices).map(([key, value], i) => ({ question_id: question.id, choice_key: key, choice_text: value.normalized, original_choice_text: value.original, display_order: i + 1 })), { onConflict: "question_id,choice_key" });
      await db.from("question_solutions").upsert({ question_id: question.id, correct_answer: q.correctAnswer, original_answer_text: q.originalAnswerText, explanation_status: q.explanationStatus, explanation_source: q.explanationSource, is_verified: !q.needsReview }, { onConflict: "question_id" });
      imported++;
    }
    console.log(`✓ ${exam.year}년 ${exam.round}회 적재`);
  }
  console.log(`총 ${imported}문항 멱등 적재 완료`);
}
main().catch((e) => { console.error(e.message); process.exitCode = 1; });
