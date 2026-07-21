import { NextResponse } from "next/server";
import { publicQuestions } from "@/lib/exam-store";

export const dynamic = "force-static";
export function GET() {
  return NextResponse.json({ questions: publicQuestions(), generatedAt: "2026-07-21", source: "uploaded_exam_pdf" }, { headers: { "Cache-Control": "no-cache, no-store, must-revalidate" } });
}
