import fs from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";
import { getExams } from "@/lib/exam-store";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const match = id.match(/^(202[2-5])-([1-3])-(100|[1-9]\d?)$/);
  if (!match) return NextResponse.json({ error: "잘못된 자산 ID" }, { status: 400 });
  const [, year, round, no] = match;
  const exam = getExams().find((item) => item.year === Number(year) && item.round === Number(round));
  const asset = exam?.questions.find((q) => q.questionNo === Number(no))?.assets[0];
  if (!asset) return NextResponse.json({ error: "자산 없음" }, { status: 404 });
  const assetRoot = path.resolve(process.cwd(), "data", "imported", year, round);
  const file = path.resolve(assetRoot, asset.path);
  if (file !== assetRoot && !file.startsWith(`${assetRoot}${path.sep}`)) return NextResponse.json({ error: "잘못된 자산 경로" }, { status: 400 });
  if (!fs.existsSync(file)) return NextResponse.json({ error: "자산 파일 없음" }, { status: 404 });
  const realRoot = fs.realpathSync(assetRoot);
  const realFile = fs.realpathSync(file);
  if (!realFile.startsWith(`${realRoot}${path.sep}`)) return NextResponse.json({ error: "잘못된 자산 경로" }, { status: 400 });
  const content = fs.readFileSync(realFile);
  const pngSignature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  if (content.length < 8 || !content.subarray(0, 8).equals(pngSignature)) return NextResponse.json({ error: "PNG 자산이 아님" }, { status: 415 });
  return new NextResponse(content, { headers: { "Content-Type": "image/png", "Cache-Control": "public, max-age=31536000, immutable", "X-Content-Type-Options": "nosniff" } });
}
