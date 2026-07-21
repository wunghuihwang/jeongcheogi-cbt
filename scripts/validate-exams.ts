import fs from "node:fs";
import path from "node:path";
import { examSchema, type ExamData } from "../lib/exam-schema";
import { sha256Text, walk } from "../lib/fs-utils";

export type ValidationRow = { year: number; round: number; questions: number; answers: number; images: number; review: number; missing: number[]; errors: string[] };

export async function validateAll(): Promise<ValidationRow[]> {
  const files = (await walk("data/imported")).filter((f) => f.endsWith("questions.json"));
  const rows: ValidationRow[] = [];
  for (const file of files) {
    const parsed = examSchema.safeParse(JSON.parse(fs.readFileSync(file, "utf8")));
    if (!parsed.success) {
      const [year, round] = path.dirname(file).split(path.sep).slice(-2).map(Number);
      rows.push({ year, round, questions: 0, answers: 0, images: 0, review: 0, missing: [], errors: parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`) }); continue;
    }
    const exam: ExamData = parsed.data;
    const numbers = new Set(exam.questions.map((q) => q.questionNo));
    const missing = Array.from({ length: 100 }, (_, i) => i + 1).filter((n) => !numbers.has(n));
    const errors: string[] = [];
    if (numbers.size !== exam.questions.length) errors.push("중복 문제 번호");
    for (const q of exam.questions) {
      if (Object.values(q.choices).some((choice) => !choice.normalized)) errors.push(`${q.questionNo}번: 빈 선택지`);
      for (const [key, choice] of Object.entries(q.choices)) {
        if (/기출문제\s*&\s*정답|저작권\s*안내|정보처리기사\s*필기\s*기출문제\s*\d+회\s*-/.test(choice.normalized)) errors.push(`${q.questionNo}번 ${key}: 페이지 머리말/꼬리말 유입`);
        if (/제\s*(?:(?:[1-5]\s*)?과목|과목\s*[1-5]?).*(?:소프트웨어|데이터베이스|프로그래밍|정보시스템)/s.test(choice.normalized)) errors.push(`${q.questionNo}번 ${key}: 과목 전환 머리말 유입`);
        if (/다음\s*(?:중|내용|설명|보기|코드).*?(?:것은|\?)[\s]*$/s.test(choice.normalized)) errors.push(`${q.questionNo}번 ${key}: 다음 문항 경계 유입 의심`);
      }
      if (q.normalizedHash !== sha256Text(`${q.questionText}|${Object.values(q.choices).map((c) => c.normalized).join("|")}`)) errors.push(`${q.questionNo}번: 정규화 해시 불일치`);
    }
    rows.push({ year: exam.year, round: exam.round, questions: exam.questions.length, answers: exam.questions.filter((q) => q.correctAnswer).length, images: exam.questions.filter((q) => q.hasImageReference).length, review: exam.questions.filter((q) => q.needsReview).length, missing, errors: [...new Set(errors)] });
  }
  return rows.sort((a, b) => a.year - b.year || a.round - b.round);
}

if (import.meta.url === `file://${process.argv[1]}`) validateAll().then((rows) => {
  let failed = false;
  for (const row of rows) { const ok = row.questions === 100 && row.missing.length === 0 && row.errors.length === 0; failed ||= !ok; console.log(`${ok ? "✓" : "✗"} ${row.year}-${row.round}: ${row.questions}문항, 정답 ${row.answers}, 검토 ${row.review}${row.errors.length ? ` / ${row.errors.join(", ")}` : ""}`); }
  if (rows.length !== 12) { console.error(`✗ 회차 수 ${rows.length}/12`); failed = true; }
  process.exitCode = failed ? 1 : 0;
});
