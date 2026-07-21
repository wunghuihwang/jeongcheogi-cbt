import { NextResponse } from "next/server";
import { z } from "zod";
import { getExams } from "@/lib/exam-store";

const bodySchema = z.object({ answers: z.record(z.string(), z.enum(["A", "B", "C", "D"])) });
export async function POST(request: Request) {
  const parsed = bodySchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "잘못된 답안 형식입니다." }, { status: 400 });
  const bank = new Map<string, ReturnType<typeof getExams>[number]["questions"][number]>(getExams().flatMap((exam) => exam.questions.map((q) => [`${exam.year}-${exam.round}-${q.questionNo}`, q])));
  const results = Object.entries(parsed.data.answers).flatMap(([id, selected]) => {
    const q = bank.get(id); if (!q) return [];
    return [{ id, selected, correctAnswer: q.correctAnswer, isCorrect: q.correctAnswer ? selected === q.correctAnswer : null, explanation: q.explanation, explanationStatus: q.explanationStatus, explanationSource: q.explanationSource }];
  });
  return NextResponse.json({ results, score: results.filter((r) => r.isCorrect).length, gradable: results.filter((r) => r.correctAnswer).length });
}
