import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { examSchema, type ExamData } from "./exam-schema";

let cache: ExamData[] | null = null;
export function getExams(): ExamData[] {
  if (cache) return cache;
  cache = [];
  for (let year = 2022; year <= 2025; year++) for (let round = 1; round <= 3; round++) {
    const file = path.join(process.cwd(), "data", "imported", String(year), String(round), "questions.json");
    if (fs.existsSync(file)) cache.push(examSchema.parse(JSON.parse(fs.readFileSync(file, "utf8"))));
  }
  return cache;
}

export function publicQuestions() {
  return getExams().flatMap((exam) => exam.questions.map((q) => ({
    id: `${exam.year}-${exam.round}-${q.questionNo}`, year: exam.year, round: exam.round,
    questionNo: q.questionNo, subject: q.subject, questionText: q.questionText,
    choices: Object.fromEntries(Object.entries(q.choices).map(([k, v]) => [k, v.normalized])),
    sourcePage: q.sourcePage, sourceType: q.sourceType, hasImageReference: q.hasImageReference,
    assetAltText: q.assets[0]?.altText ?? null,
    assetUrl: q.assets.length ? (() => {
      const file = path.join(process.cwd(), "data", "imported", String(exam.year), String(exam.round), q.assets[0].path);
      const version = fs.existsSync(file)
        ? createHash("sha256").update(fs.readFileSync(file)).digest("hex").slice(0, 12)
        : q.normalizedHash.slice(0, 12);
      return `/api/question-assets/${exam.year}-${exam.round}-${q.questionNo}?v=${version}`;
    })() : null,
    isCode: q.isCode, isSql: q.isSql, needsReview: q.needsReview,
    correctAnswer: q.correctAnswer, explanation: q.explanation,
    explanationStatus: q.explanationStatus, explanationSource: q.explanationSource,
  })));
}
