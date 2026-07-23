import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProgrammingLanguagePage } from "@/components/programming-study";
import {
  isLanguageId,
  LANGUAGE_ORDER,
  PROGRAMMING_STUDY_DATA,
} from "@/lib/programming-study-data";

type PageProps = { params: Promise<{ language: string }> };

export function generateStaticParams() {
  return LANGUAGE_ORDER.map((language) => ({ language }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { language } = await params;
  if (!isLanguageId(language)) return {};
  const data = PROGRAMMING_STUDY_DATA[language];
  return {
    title: `${data.name} 핵심 정리 | 정보처리기사 CBT`,
    description: data.description,
  };
}

export default async function LanguageStudyPage({ params }: PageProps) {
  const { language } = await params;
  if (!isLanguageId(language)) notFound();
  return <ProgrammingLanguagePage language={PROGRAMMING_STUDY_DATA[language]} />;
}
