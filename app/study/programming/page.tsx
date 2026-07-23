import type { Metadata } from "next";
import { ProgrammingStudyHome } from "@/components/programming-study";

export const metadata: Metadata = {
  title: "프로그래밍 핵심 정리 | 정보처리기사 CBT",
  description: "정보처리기사 필기·실기 C, Java, Python, SQL 핵심 정리",
};

export default function ProgrammingStudyPage() {
  return <ProgrammingStudyHome />;
}
