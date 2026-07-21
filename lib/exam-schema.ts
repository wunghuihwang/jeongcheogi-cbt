import { z } from "zod";

export const SUBJECTS = [
  "소프트웨어 설계",
  "소프트웨어 개발",
  "데이터베이스 구축",
  "프로그래밍 언어 활용",
  "정보시스템 구축관리",
] as const;

export const choiceSchema = z.object({
  original: z.string(),
  normalized: z.string(),
});

export const assetSchema = z.object({
  type: z.enum(["source_page", "image", "diagram", "table", "code"]),
  path: z.string().regex(/^assets\/[A-Za-z0-9._-]+\.png$/, "문항 자산은 assets 폴더의 PNG 파일이어야 합니다."),
  pageNumber: z.number().int().positive(),
  altText: z.string(),
});

export const questionSchema = z.object({
  questionNo: z.number().int().min(1).max(100),
  subject: z.enum(SUBJECTS),
  questionText: z.string().min(1),
  originalQuestionText: z.string().min(1),
  choices: z.object({ A: choiceSchema, B: choiceSchema, C: choiceSchema, D: choiceSchema }),
  correctAnswer: z.enum(["A", "B", "C", "D"]).nullable(),
  originalAnswerText: z.string().nullable(),
  sourcePage: z.number().int().positive(),
  sourceType: z.literal("uploaded_exam_pdf"),
  sourceDocument: z.string(),
  normalizedHash: z.string(),
  assets: z.array(assetSchema),
  hasImageReference: z.boolean(),
  isCode: z.boolean(),
  isSql: z.boolean(),
  needsReview: z.boolean(),
  reviewReasons: z.array(z.string()),
  explanation: z.string().nullable(),
  explanationStatus: z.enum(["source", "missing", "draft", "verified", "needs_review"]),
  explanationSource: z.enum(["source_pdf", "authored"]).nullable(),
});

export const examSchema = z.object({
  schemaVersion: z.literal(1),
  year: z.number().int().min(2022).max(2025),
  round: z.number().int().min(1).max(3),
  title: z.string(),
  sourceDocument: z.string(),
  sourceSha256: z.string().length(64),
  sourcePages: z.number().int().positive(),
  extractedAt: z.string(),
  questions: z.array(questionSchema),
});

export type ExamData = z.infer<typeof examSchema>;
export type ExamQuestion = z.infer<typeof questionSchema>;

export function subjectFor(no: number): (typeof SUBJECTS)[number] {
  return SUBJECTS[Math.min(4, Math.floor((no - 1) / 20))];
}
