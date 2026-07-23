import assert from "node:assert/strict";
import test from "node:test";
import { publicQuestions } from "../lib/exam-store";

test("회차 원본 1,200문항은 보존하고 학습 기준으로 811개에 통합한다", () => {
  const questions = publicQuestions();
  assert.equal(questions.length, 1_200);
  assert.equal(new Set(questions.map((question) => question.id)).size, 1_200);
  assert.equal(new Set(questions.map((question) => question.canonicalId)).size, 811);
});

test("통합된 중복 문항 사이에 정답 내용 충돌이 없다", () => {
  const groups = new Map<string, ReturnType<typeof publicQuestions>>();
  for (const question of publicQuestions()) {
    const group = groups.get(question.canonicalId) ?? [];
    group.push(question);
    groups.set(question.canonicalId, group);
  }

  for (const [canonicalId, questions] of groups) {
    const answerTexts = new Set(
      questions.map((question) =>
        question.correctAnswer
          ? question.choices[question.correctAnswer]
              .normalize("NFKC")
              .replace(/[\s'"‘’“”]/g, "")
          : null,
      ),
    );
    assert.equal(
      answerTexts.size,
      1,
      `${canonicalId}의 중복 문항 정답 내용이 서로 다릅니다.`,
    );
  }
});
