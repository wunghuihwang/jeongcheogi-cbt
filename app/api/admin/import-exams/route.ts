import { NextResponse } from "next/server";
import { examSchema } from "@/lib/exam-schema";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL, anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, service = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !anon || !service) return NextResponse.json({ error: "Supabase 서버 환경변수가 설정되지 않았습니다." }, { status: 503 });
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return NextResponse.json({ error: "관리자 인증이 필요합니다." }, { status: 401 });
  const authClient = createClient(url, anon, { global: { headers: { Authorization: `Bearer ${token}` } }, auth: { persistSession: false } });
  const { data: { user } } = await authClient.auth.getUser(token);
  if (!user) return NextResponse.json({ error: "유효하지 않은 인증입니다." }, { status: 401 });
  const admin = createClient(url, service, { auth: { persistSession: false } });
  const { data: profile } = await admin.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") return NextResponse.json({ error: "관리자 권한이 필요합니다." }, { status: 403 });
  const payload = await request.json();
  const exams = Array.isArray(payload) ? payload : [payload];
  const validated = exams.map((item) => examSchema.parse(item));
  return NextResponse.json({ documentsFound: validated.length, uniqueDocuments: validated.length, duplicateDocuments: 0, examSetsValidated: validated.length, questionsValidated: validated.reduce((n, e) => n + e.questions.length, 0), message: "관리자 인증 및 Zod 검증 완료. 대량 Storage/DB 적재는 pnpm import:exams로 수행하세요." });
}
