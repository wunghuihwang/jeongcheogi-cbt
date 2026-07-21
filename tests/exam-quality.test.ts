import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { examSchema, subjectFor, type ExamData, type ExamQuestion } from "../lib/exam-schema";
import { publicQuestions } from "../lib/exam-store";

type LocatedQuestion = ExamQuestion & { id: string; year: number; round: number; sourcePages: number };

const exams: ExamData[] = [];
for (let year = 2022; year <= 2025; year++) {
  for (let round = 1; round <= 3; round++) {
    const file = path.join(process.cwd(), "data", "imported", String(year), String(round), "questions.json");
    exams.push(examSchema.parse(JSON.parse(fs.readFileSync(file, "utf8"))));
  }
}

const questions: LocatedQuestion[] = exams.flatMap((exam) => exam.questions.map((question) => ({
  ...question,
  id: `${exam.year}-${exam.round}-${question.questionNo}`,
  year: exam.year,
  round: exam.round,
  sourcePages: exam.sourcePages,
})));

const byId = new Map(questions.map((question) => [question.id, question]));
const getQuestion = (id: string) => {
  const question = byId.get(id);
  assert.ok(question, `${id} 문항이 없습니다.`);
  return question;
};
const compact = (value: string) => value.replace(/\s+/g, " ").trim();
const displayChoices = (question: ExamQuestion) => Object.values(question.choices).map((choice) => choice.normalized);

test("12회차와 1,200문항이 빠짐없이 존재한다", () => {
  assert.equal(exams.length, 12);
  assert.equal(questions.length, 1_200);
  assert.equal(byId.size, 1_200, "중복 문항 ID가 있습니다.");

  for (const exam of exams) {
    assert.equal(exam.questions.length, 100, `${exam.year}-${exam.round} 문항 수`);
    assert.deepEqual(exam.questions.map((question) => question.questionNo), Array.from({ length: 100 }, (_, index) => index + 1));
  }
});

test("문항·선택지·정답·과목·출처 메타데이터가 완전하다", () => {
  const errors: string[] = [];
  for (const question of questions) {
    if (!question.questionText.trim()) errors.push(`${question.id}: 빈 문제 본문`);
    if (question.subject !== subjectFor(question.questionNo)) errors.push(`${question.id}: 과목 불일치`);
    if (question.sourcePage > question.sourcePages) errors.push(`${question.id}: 출처 페이지 범위 초과`);
    if (JSON.stringify(Object.keys(question.choices).sort()) !== JSON.stringify(["A", "B", "C", "D"])) errors.push(`${question.id}: 선택지 키 누락`);
    if (displayChoices(question).some((choice) => !choice.trim())) errors.push(`${question.id}: 빈 선택지`);
    if (!question.correctAnswer || !question.choices[question.correctAnswer]) errors.push(`${question.id}: 정답 누락 또는 범위 오류`);
    if (question.needsReview !== (question.reviewReasons.length > 0)) errors.push(`${question.id}: 검토 플래그 불일치`);
  }
  assert.deepEqual(errors, []);
});

test("정규화 해시는 화면 표시 본문 및 선택지와 일치한다", () => {
  const errors = questions.flatMap((question) => {
    const source = `${question.questionText}|${displayChoices(question).join("|")}`;
    const actual = createHash("sha256").update(source).digest("hex");
    return actual === question.normalizedHash ? [] : [`${question.id}: 정규화 해시 불일치`];
  });
  assert.deepEqual(errors, []);
});

test("동일한 문제와 선택지 조합은 정답 내용도 동일하다", () => {
  const groups = new Map<string, LocatedQuestion[]>();
  for (const question of questions) {
    const key = `${compact(question.questionText)}|||${displayChoices(question).map(compact).sort().join("||")}`;
    groups.set(key, [...(groups.get(key) ?? []), question]);
  }

  const conflicts: string[] = [];
  for (const group of groups.values()) {
    if (group.length < 2) continue;
    const answers = new Set(group.map((question) => compact(question.choices[question.correctAnswer!].normalized)));
    if (answers.size > 1) {
      conflicts.push(group.map((question) => `${question.id}:${question.correctAnswer}=${question.choices[question.correctAnswer!].normalized}`).join(", "));
    }
  }
  assert.deepEqual(conflicts, []);
});

test("확정된 고위험 정답과 교정값이 유지된다", () => {
  const expectedAnswers: Record<string, "A" | "B" | "C" | "D"> = {
    "2023-1-62": "D",
    "2024-1-68": "D",
    "2025-1-5": "B",
    "2025-3-61": "D",
  };
  const errors: string[] = [];
  for (const [id, expected] of Object.entries(expectedAnswers)) {
    const actual = getQuestion(id).correctAnswer;
    if (actual !== expected) errors.push(`${id}: 기대 정답 ${expected}, 현재 ${actual ?? "없음"}`);
  }
  if (getQuestion("2025-1-21").choices.C.normalized !== "Valgrind") errors.push("2025-1-21: Valgrind 교정 누락");
  assert.deepEqual(errors, []);
});

test("OCR 오타·문서 머리말·깨진 글자·문항 경계 손상이 없다", () => {
  const forbidden: Array<[RegExp, string]> = [
    [/기출문제\s*&\s*정답|저작권\s*안내|제\s*(?:(?:[1-5]\s*)?과목|과목\s*[1-5]?)/, "문서 머리말"],
    [/[\uE000-\uF8FF\uFFFD]/, "깨진 글자"],
    [/[０-９Ａ-Ｚａ-ｚ]/, "전각 영숫자"],
    [/\b(?:GUKGraphical|CLKCommand|valMeter|valance|Thrasing|Machine Leaming|ARO)\b/i, "확정 OCR 오타"],
    [/(?:스케쥴|맴리스터|Recog\s+nition|메타\s+데이터)/i, "확정 표기 오타"],
    [/(?:소\s+프\s*트웨어|데\s+이\s*터|시스\s+템|프로젝\s+트|산출\s+물|서비\s+스)/, "단어 내부 분절"],
    [/[①②③④]/, "선택지 번호 잔존"],
  ];
  const errors: string[] = [];

  for (const question of questions) {
    const fields = [["본문", question.questionText], ...Object.entries(question.choices).map(([key, choice]) => [`선택지 ${key}`, choice.normalized])] as const;
    for (const [field, value] of fields) {
      for (const [pattern, label] of forbidden) if (pattern.test(value)) errors.push(`${question.id} ${field}: ${label}`);
    }
    if (!question.questionText.includes("\n\n") && /\?\s+\S/s.test(question.questionText)) errors.push(`${question.id}: 메인/보조 텍스트 경계 누락`);
    if (!question.isCode && !question.isSql && /\n/.test(question.questionText) && !/\n\n/.test(question.questionText)) {
      errors.push(`${question.id}: 일반 문장 강제 줄바꿈`);
    }
  }
  assert.deepEqual(errors, []);
});

test("이미지 자산은 필요한 문항에만 연결되고 실제 파일이 존재한다", () => {
  const errors: string[] = [];
  for (const question of questions) {
    if (question.hasImageReference !== (question.assets.length > 0)) errors.push(`${question.id}: 이미지 플래그 불일치`);
    if ((question.isCode || question.isSql) && question.assets.length) errors.push(`${question.id}: 코드와 이미지 중복`);
    for (const asset of question.assets) {
      if (asset.type === "source_page") errors.push(`${question.id}: 전체 페이지 이미지 잔존`);
      const file = path.join(process.cwd(), "data", "imported", String(question.year), String(question.round), asset.path);
      if (!fs.existsSync(file)) errors.push(`${question.id}: 이미지 파일 누락 ${asset.path}`);
    }
  }
  assert.equal(getQuestion("2025-1-24").assets.length, 1, "2025-1-24 트리 이미지 누락");
  assert.equal(getQuestion("2025-1-93").assets.length, 0, "2025-1-93 불필요 이미지 잔존");
  assert.equal(getQuestion("2025-1-100").assets.length, 0, "2025-1-100 불필요 이미지 잔존");
  assert.deepEqual(errors, []);
});

test("사용자가 지적한 Python·SQL 문항은 코드로 복원되어 있고 이미지가 없다", () => {
  const codeCases = ["2022-1-77", "2023-1-80", "2023-2-63", "2023-3-75", "2025-2-76", "2025-3-65"];
  for (const id of codeCases) {
    const question = getQuestion(id);
    assert.equal(question.isCode, true, `${id}: 코드 플래그`);
    assert.equal(question.assets.length, 0, `${id}: 불필요 이미지`);
    assert.match(question.questionText, /\n\n/);
  }
  assert.match(getQuestion("2023-3-75").questionText, /while True:\n {4}print\('A'\)/);
  assert.match(getQuestion("2025-3-65").questionText, /for i in range\(n\):\n {8}t\.\(㉡\)/);

  for (const id of ["2022-1-57", "2023-1-46", "2025-2-56"]) {
    const question = getQuestion(id);
    assert.equal(question.isSql, true, `${id}: SQL 플래그`);
    assert.equal(question.assets.length, 0, `${id}: 불필요 이미지`);
    assert.match(question.questionText, /\| A \| B \|[\s\S]*SELECT A FROM R\nUNION ALL\nSELECT A FROM S;/);
  }
});

test("공개 API 모델에는 원문이 노출되지 않고 normalized만 제공된다", () => {
  const publicItems = publicQuestions();
  assert.equal(publicItems.length, 1_200);
  for (const item of publicItems) {
    assert.equal("originalQuestionText" in item, false, `${item.id}: 원문 본문 노출`);
    assert.ok(Object.values(item.choices).every((choice) => typeof choice === "string"), `${item.id}: 원문 선택지 구조 노출`);
    assert.equal(Object.values(item.choices).some((choice) => typeof choice === "object"), false, `${item.id}: original 선택지 노출`);
  }
});

test("전체 1,200문항에 직접 작성·검증 해설이 연결된다", () => {
  const explainedRounds = questions.filter((question) => [2022, 2023, 2024, 2025].includes(question.year));
  assert.equal(explainedRounds.length, 1_200);
  const errors = explainedRounds.flatMap((question) => {
    if (!question.explanation?.trim()) return [`${question.id}: 해설 누락`];
    if (question.explanationStatus !== "verified") return [`${question.id}: 검증 상태 오류`];
    if (question.explanationSource !== "authored") return [`${question.id}: 해설 출처 오류`];
    if (question.explanation.length < 35) return [`${question.id}: 해설이 지나치게 짧음`];
    if (/[\uE000-\uF8FF\uFFFD]|정n각형/.test(question.explanation)) return [`${question.id}: 해설 문자 손상`];
    return [];
  });
  assert.equal(getQuestion("2025-2-31").questionText, "스택(Stack)에 대한 설명으로 틀린 것은?");
  assert.equal(getQuestion("2023-2-25").questionText, "스택(Stack)에 대한 설명으로 틀린 것은?");
  assert.equal(getQuestion("2024-2-37").choices.D.normalized, "클라이언트-서버 방식");
  assert.deepEqual(errors, []);
});
