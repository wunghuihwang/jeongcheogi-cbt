import assert from "node:assert/strict";
import test from "node:test";
import {
  createEmptyProgress,
  getLanguageProgress,
  getOverallProgress,
  LANGUAGE_ORDER,
  PROGRAMMING_STUDY_DATA,
  PROGRAMMING_STUDY_STORAGE_KEY,
  type LanguageId,
} from "../lib/programming-study-data";

const requiredTerms: Record<LanguageId, string[]> = {
  c: [
    "자료형", "서식", "printf", "scanf", "정수", "산술", "비교", "논리", "비트",
    "우선순위", "전위", "후위", "조건문", "반복문", "break", "continue", "1차원",
    "2차원", "배열", "포인터", "이중 포인터", "널 문자", "strlen", "strcpy", "strcat",
    "strcmp", "함수", "매개변수", "주소 전달", "재귀", "구조체", "static", "시프트", "형 변환",
  ],
  java: [
    "기본 자료형", "참조 자료형", "형 변환", "연산자", "우선순위", "조건문", "반복문", "배열",
    "클래스", "객체", "필드", "메서드", "생성자", "this", "super", "상속", "오버로딩",
    "오버라이딩", "참조변수", "실제 객체", "String", "equals", "static", "final", "추상 클래스",
    "인터페이스", "접근 제어자", "예외 처리", "컬렉션", "ArrayList", "HashSet", "HashMap", "Stack", "Queue",
  ],
  python: [
    "들여쓰기", "int", "float", "str", "bool", "list", "tuple", "set", "dict", "산술", "비교", "논리",
    "//", "%", "**", "조건문", "for", "while", "range", "break", "continue", "문자열", "인덱싱",
    "슬라이싱", "음수 인덱스", "append", "extend", "remove", "pop", "참조", "얕은 복사", "깊은 복사",
    "가변", "불변", "기본 매개변수", "딕셔너리", "집합 연산", "함수", "클래스", "생성자", "상속", "오버라이딩",
  ],
  sql: [
    "DDL", "DML", "DCL", "TCL", "CREATE", "ALTER", "DROP", "TRUNCATE", "SELECT", "INSERT", "UPDATE", "DELETE",
    "GRANT", "REVOKE", "COMMIT", "ROLLBACK", "SAVEPOINT", "작성 순서", "실행 순서", "WHERE", "BETWEEN", "IN",
    "LIKE", "IS NULL", "집계", "COUNT(*)", "COUNT(column)", "GROUP BY", "HAVING", "ORDER BY", "DISTINCT", "INNER JOIN",
    "LEFT OUTER JOIN", "RIGHT OUTER JOIN", "FULL OUTER JOIN", "SELF JOIN", "서브쿼리", "EXISTS", "ANY", "ALL",
    "PRIMARY KEY", "FOREIGN KEY", "UNIQUE", "NOT NULL", "CHECK", "DEFAULT", "CASCADE", "SET NULL", "SET DEFAULT", "RESTRICT", "VIEW", "INDEX",
  ],
};

test("네 언어와 모든 필수 범위를 제공한다", () => {
  assert.deepEqual(LANGUAGE_ORDER, ["c", "java", "python", "sql"]);
  for (const id of LANGUAGE_ORDER) {
    const serialized = JSON.stringify(PROGRAMMING_STUDY_DATA[id]);
    const missing = requiredTerms[id].filter((term) => !serialized.includes(term));
    assert.deepEqual(missing, [], `${id} 누락 항목: ${missing.join(", ")}`);
  }
});

test("주제 ID가 언어 안에서 고유하고 모든 주제에 콘텐츠가 있다", () => {
  for (const id of LANGUAGE_ORDER) {
    const topics = PROGRAMMING_STUDY_DATA[id].topics;
    assert.equal(new Set(topics.map((topic) => topic.id)).size, topics.length);
    assert.ok(topics.every((topic) => topic.contents.length > 0));
    assert.ok(topics.every((topic) => topic.examTypes.length > 0));
  }
});

test("진행률은 유효한 완료 ID만 중복 없이 계산한다", () => {
  const language = PROGRAMMING_STUDY_DATA.c;
  assert.equal(getLanguageProgress(language, []), 0);
  assert.equal(getLanguageProgress(language, language.topics.map((topic) => topic.id)), 100);
  assert.equal(getLanguageProgress(language, [language.topics[0].id, language.topics[0].id, "invalid"]), Math.round(100 / language.topics.length));

  const full = createEmptyProgress();
  for (const id of LANGUAGE_ORDER) full.completed[id] = PROGRAMMING_STUDY_DATA[id].topics.map((topic) => topic.id);
  assert.equal(getOverallProgress(full), 100);
});

test("기존 CBT와 충돌하지 않는 버전 저장 키를 사용한다", () => {
  assert.equal(PROGRAMMING_STUDY_STORAGE_KEY, "jeongcheogi_programming_study_progress_v1");
  assert.notEqual(PROGRAMMING_STUDY_STORAGE_KEY, "jeongcheogi-progress");
});
