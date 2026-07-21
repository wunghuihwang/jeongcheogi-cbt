"use client";
import { useEffect, useMemo, useState } from "react";

type Key = "A" | "B" | "C" | "D";
type Question = {
  id: string;
  year: number;
  round: number;
  questionNo: number;
  subject: string;
  questionText: string;
  choices: Record<Key, string>;
  sourcePage: number;
  sourceType: string;
  hasImageReference: boolean;
  assetUrl: string | null;
  assetAltText: string | null;
  isCode: boolean;
  isSql: boolean;
  needsReview: boolean;
  correctAnswer: Key | null;
  explanation: string | null;
  explanationStatus: string;
  explanationSource: string | null;
};
type Result = {
  id: string;
  selected: Key | null;
  correctAnswer: Key | null;
  isCorrect: boolean | null;
  explanation: string | null;
  explanationStatus: string;
  explanationSource: string | null;
};
type Saved = {
  answers: Record<string, Key>;
  wrong: string[];
  bookmarks: string[];
  seen: string[];
};
const EMPTY: Saved = { answers: {}, wrong: [], bookmarks: [], seen: [] };
const SUBJECTS = [
  "전체 과목",
  "소프트웨어 설계",
  "소프트웨어 개발",
  "데이터베이스 구축",
  "프로그래밍 언어 활용",
  "정보시스템 구축관리",
];

function formatBraceCode(source: string) {
  let output = "";
  let indent = 0;
  let parenDepth = 0;
  let quote = "";
  const line = (text = "") => {
    output = output.trimEnd() + "\n" + "  ".repeat(indent) + text;
  };
  for (let i = 0; i < source.length; i++) {
    const char = source[i];
    const previous = source[i - 1];
    if ((char === '"' || char === "'") && previous !== "\\") quote = quote === char ? "" : quote || char;
    if (quote) { output += char; continue; }
    if (char === "(") parenDepth++;
    if (char === ")") parenDepth = Math.max(0, parenDepth - 1);
    if (char === "{") { output = output.trimEnd() + " {"; indent++; line(); }
    else if (char === "}") { indent = Math.max(0, indent - 1); line("}"); if (/\s*else\b/.test(source.slice(i + 1))) output += " "; else line(); }
    else if (char === ";" && parenDepth === 0) { output += ";"; line(); }
    else output += char;
  }
  return output.replace(/\n\s*#include/g, "\n#include").replace(/\n{3,}/g, "\n\n").trim();
}

function detectLanguage(context: string, code: string): string {
  if (/\b(?:Python|파이썬)\b/i.test(context)) return "Python";
  if (/\bJava\b/i.test(context)) return "Java";
  if (/\bC\+\+\b/i.test(context)) return "C++";
  if (/\bC\s*(?:언어|프로그램)/i.test(context)) return "C";
  if (/\bSQL\b/i.test(context) || /^(?:SELECT|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP|GRANT|REVOKE)\b/i.test(code)) return "SQL";
  if (/\b(?:public\s+class|System\.out|String\[|import\s+java)/.test(code)) return "Java";
  if (/\b(?:def|import)\b|while\s+[^\n]+:|for\s+\w+\s+in\s+/m.test(code)) return "Python";
  if (/\b(?:#include|printf|scanf|int\s+main)\b/.test(code)) return "C";
  return "Pseudocode";
}

function splitExecutableCode(text: string, forceCode = false): { prompt: string; code: string; language: string } | null {
  const markers = [/#include\s*</, /(?:^|\n)import\s+(?:\([^\n)]*\)|[A-Za-z_][\w.]*)[^\n;]*;/, /public\s+class\s+\w+/, /(?:^|\n)class\s+\w+\s*\{/, /(?:^|\n)int\s+main\s*\(/];
  let index = -1;
  for (const marker of markers) { const found = text.search(marker); if (found >= 0 && (index < 0 || found < index)) index = found; }
  if (index >= 0) {
    const rawCode = text.slice(index).trim();
    return {
      prompt: text.slice(0, index).trim(),
      code: rawCode.includes("\n") ? rawCode : formatBraceCode(rawCode),
      language: detectLanguage(text.slice(0, index), rawCode),
    };
  }
  const questionEnd = text.indexOf("?");
  if (questionEnd >= 0) {
    const remainder = text.slice(questionEnd + 1).trim();
    if (/^(?:import\s+\w+|[a-zA-Z_]\w*\s*=|[a-zA-Z_]\w*\s*,\s*[a-zA-Z_]\w*\s*=|for\s+\w+\s+in\s+|while\s+[^\n]+:)/.test(remainder)) return { prompt: text.slice(0, questionEnd + 1).trim(), code: remainder, language: detectLanguage(text.slice(0, questionEnd + 1), remainder) };
    if (/^(?:int|String|char)\b|^while\s*\(/.test(remainder)) return { prompt: text.slice(0, questionEnd + 1).trim(), code: remainder.includes("\n") ? remainder : formatBraceCode(remainder), language: detectLanguage(text.slice(0, questionEnd + 1), remainder) };
    if (/^(?:SELECT|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP)\b/.test(remainder)) return { prompt: text.slice(0, questionEnd + 1).trim(), code: remainder, language: "SQL" };
  }
  const python = text.search(/(?:^|\n\n)(?=(?:[a-zA-Z_]\w*\s*=|while\s+[^\n]+:|for\s+\w+\s+in\s+))/);
  if (python >= 0) return { prompt: text.slice(0, python).trim(), code: text.slice(python).trim(), language: "Python" };
  const sql = text.search(/\n\n(?=(?:SELECT|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP|GRANT|REVOKE)\b)/);
  if (sql >= 0) return { prompt: text.slice(0, sql).trim(), code: text.slice(sql).trim(), language: "SQL" };
  if (forceCode) {
    const separator = text.indexOf("\n\n");
    if (separator >= 0) {
      const code = text.slice(separator + 2).trim();
      const language = detectLanguage(text.slice(0, separator), code);
      return { prompt: text.slice(0, separator).trim(), code, language };
    }
  }
  return null;
}

function MarkdownTable({ source }: { source: string }) {
  const rows = source.trim().split("\n").map((line) => line.trim().replace(/^\||\|$/g, "").split("|").map((cell) => cell.trim()));
  const separator = rows.findIndex((row) => row.every((cell) => /^:?-{3,}:?$/.test(cell)));
  if (separator <= 0) return <pre className="dataPanel">{source}</pre>;
  return (
    <div className="tablePanel">
      <table>
        <thead><tr>{rows[separator - 1].map((cell, index) => <th key={index}>{cell}</th>)}</tr></thead>
        <tbody>{rows.slice(separator + 1).map((row, rowIndex) => <tr key={rowIndex}>{row.map((cell, cellIndex) => <td key={cellIndex}>{cell}</td>)}</tr>)}</tbody>
      </table>
    </div>
  );
}

function StructuredContent({ source }: { source: string }) {
  return <>{source.split(/\n{2,}/).filter(Boolean).map((block, index) => {
    const lines = block.split("\n").map((line) => line.trim()).filter(Boolean);
    if (lines.length >= 2 && lines.some((line) => /^\|.*\|$/.test(line)) && lines.some((line) => /^\|?\s*:?-{3,}/.test(line))) {
      return <MarkdownTable key={index} source={block} />;
    }
    if (lines.length && lines.every((line) => /^(?:•|ㆍ)\s*/.test(line))) {
      return <ul className="bulletPanel" key={index}>{lines.map((line, lineIndex) => <li key={lineIndex}>{line.replace(/^(?:•|ㆍ)\s*/, "")}</li>)}</ul>;
    }
    const dataLike = /\||(?:^|\n)\s*(?:㉠|ⓐ|\[.+\]|R$|S$|\d+(?:\s+\d+){2,})/m.test(block);
    return <pre className={dataLike ? "dataPanel" : "prosePanel"} key={index}>{block}</pre>;
  })}</>;
}

function splitQuestionDisplay(source: string): { title: string; supporting: string } {
  const blankLine = source.indexOf("\n\n");
  if (blankLine >= 0) {
    return {
      title: source.slice(0, blankLine).trim(),
      supporting: source.slice(blankLine + 2).trim(),
    };
  }
  return { title: source.trim(), supporting: "" };
}

function QuestionContent({ question }: { question: Question }) {
  const executable = splitExecutableCode(question.questionText, question.isCode);
  const prompt = executable?.prompt ?? question.questionText;
  const { title, supporting } = splitQuestionDisplay(prompt);
  return <>{<h1><em>{question.questionNo}.</em> {title}</h1>}{supporting && <div className="questionSubtext"><StructuredContent source={supporting} /></div>}{executable && <div className="codePanel"><span>{executable.language}</span><pre><code>{executable.code}</code></pre></div>}</>;
}

function shuffle<T>(input: T[]) {
  const a = [...input];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function CbtApp() {
  const [bank, setBank] = useState<Question[]>([]),
    [saved, setSaved] = useState<Saved>(EMPTY),
    [view, setView] = useState<"home" | "exam" | "result">("home");
  const [year, setYear] = useState("2025"),
    [round, setRound] = useState("1"),
    [subject, setSubject] = useState(SUBJECTS[0]),
    [mode, setMode] = useState("round"),
    [count, setCount] = useState(20);
  const [exam, setExam] = useState<Question[]>([]),
    [index, setIndex] = useState(0),
    [answers, setAnswers] = useState<Record<string, Key>>({}),
    [results, setResults] = useState<Result[]>([]),
    [loading, setLoading] = useState(true);
  const [pwaReady, setPwaReady] = useState(false);
  useEffect(() => {
      fetch("/api/questions?v=20260721-19", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setBank(d.questions))
      .finally(() => setLoading(false));
    try {
      const v = localStorage.getItem("jeongcheogi-progress");
      if (v) setSaved(JSON.parse(v));
    } catch {}
  }, []);
  useEffect(() => {
    let mounted = true;
    if (window.isSecureContext && "serviceWorker" in navigator) {
      navigator.serviceWorker.ready.then(() => {
        if (mounted) setPwaReady(true);
      });
    }
    return () => { mounted = false; };
  }, []);
  useEffect(() => {
    if (bank.length)
      localStorage.setItem("jeongcheogi-progress", JSON.stringify(saved));
  }, [saved, bank.length]);
  const stats = useMemo(
    () => ({
      solved: new Set(saved.seen).size,
      wrong: new Set(saved.wrong).size,
      bookmarks: new Set(saved.bookmarks).size,
    }),
    [saved],
  );
  function start() {
    let pool = [...bank];
    if (mode === "round")
      pool = pool
        .filter((q) => q.year === +year && q.round === +round)
        .sort((a, b) => a.questionNo - b.questionNo);
    else if (mode === "subject")
      pool = pool.filter(
        (q) => subject === SUBJECTS[0] || q.subject === subject,
      );
    else if (mode === "wrong")
      pool = pool.filter((q) => saved.wrong.includes(q.id));
    else if (mode === "unseen")
      pool = pool.filter((q) => !saved.seen.includes(q.id));
    else if (mode === "bookmark")
      pool = pool.filter((q) => saved.bookmarks.includes(q.id));
    else if (mode === "code") pool = pool.filter((q) => q.isCode);
    else if (mode === "sql") pool = pool.filter((q) => q.isSql);
    if (mode === "real") {
      const mixed = SUBJECTS.slice(1).flatMap((s) =>
        shuffle(pool.filter((q) => q.subject === s)).slice(0, 20),
      );
      pool = shuffle(mixed);
    } else if (mode !== "round") pool = shuffle(pool).slice(0, count);
    if (!pool.length) {
      alert("조건에 맞는 문제가 없습니다.");
      return;
    }
    setExam(pool);
    setAnswers({});
    setResults([]);
    setIndex(0);
    setView("exam");
    scrollTo(0, 0);
  }
  function submit() {
    if (
      !confirm(
        `${exam.length}문제 중 ${Object.keys(answers).length}문제에 답했습니다. 제출할까요?`,
      )
    )
      return;
    // 정답 데이터는 원문 OCR 필드 없이 공개 문항 데이터에 포함되어 있어,
    // 설치형 PWA가 오프라인인 경우에도 동일하게 채점할 수 있다.
    const graded: Result[] = exam.map((q) => {
      const selected = answers[q.id] ?? null;
      return {
        id: q.id,
        selected,
        correctAnswer: q.correctAnswer,
        isCorrect: q.correctAnswer ? selected === q.correctAnswer : null,
        explanation: q.explanation,
        explanationStatus: q.explanationStatus,
        explanationSource: q.explanationSource,
      };
    });
    setResults(graded);
    const wrong = graded
      .filter((x: Result) => x.isCorrect === false)
      .map((x: Result) => x.id);
    setSaved((s) => ({
      ...s,
      answers: { ...s.answers, ...answers },
      seen: [...new Set([...s.seen, ...exam.map((q) => q.id)])],
      wrong: [
        ...new Set([
          ...s.wrong.filter(
            (id) =>
              !graded.some((x: Result) => x.id === id && x.isCorrect),
          ),
          ...wrong,
        ]),
      ],
    }));
    setView("result");
    scrollTo(0, 0);
  }
  if (loading)
    return (
      <main className="loading">
        <span className="loader" />
        <p>1,200문항을 불러오는 중</p>
      </main>
    );
  if (view === "exam") {
    const q = exam[index];
    return (
      <main>
        <header className="examHead">
          <button
            onClick={() => confirm("풀이를 종료할까요?") && setView("home")}
          >
            ← 종료
          </button>
          <div>
            <b>{index + 1}</b> / {exam.length}
          </div>
          <button
            className={saved.bookmarks.includes(q.id) ? "marked" : ""}
            onClick={() =>
              setSaved((s) => ({
                ...s,
                bookmarks: s.bookmarks.includes(q.id)
                  ? s.bookmarks.filter((x) => x !== q.id)
                  : [...s.bookmarks, q.id],
              }))
            }
          >
            ★
          </button>
        </header>
        <div className="progress">
          <i style={{ width: `${((index + 1) / exam.length) * 100}%` }} />
        </div>
        <section className="questionWrap">
          <div className="eyebrow">
            {q.year}년 {q.round}회 · {q.subject}
          </div>
          <QuestionContent question={q} />
          {q.assetUrl && (
            // 문제 전용 로컬 PNG는 원본 비율이 서로 달라 일반 img가 적합하다.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              className="questionAsset"
              src={q.assetUrl}
              alt={q.assetAltText ?? `${q.questionNo}번 문제 자료`}
            />
          )}
          {q.hasImageReference && !q.assetUrl && (
            <aside>
              이 문항에는 원본 PDF의 도표/그림 자료가 포함되어 있습니다. 원본{" "}
              {q.sourcePage}쪽을 기준으로 검토 표시되었습니다.
            </aside>
          )}
          <div className={`choices${q.isSql ? " sqlChoices" : ""}`}>
            {(["A", "B", "C", "D"] as Key[]).map((k, i) => (
              <button
                key={k}
                className={answers[q.id] === k ? "selected" : ""}
                onClick={() => setAnswers((a) => ({ ...a, [q.id]: k }))}
              >
                <span>{i + 1}</span>
                <p>{q.choices[k]}</p>
              </button>
            ))}
          </div>
          <footer className="source">
            출처: 첨부 기출문제 PDF · 원본 {q.sourcePage}쪽
          </footer>
        </section>
        <nav className="examNav">
          <button disabled={index === 0} onClick={() => setIndex((i) => i - 1)}>
            이전
          </button>
          <button
            className="gridBtn"
            onClick={() => {
              const n = prompt(`이동할 문제 번호 (1~${exam.length})`);
              if (n && +n >= 1 && +n <= exam.length) setIndex(+n - 1);
            }}
          >
            답안 {Object.keys(answers).length}/{exam.length}
          </button>
          {index === exam.length - 1 ? (
            <button className="primary" onClick={submit}>
              제출
            </button>
          ) : (
            <button className="primary" onClick={() => setIndex((i) => i + 1)}>
              다음
            </button>
          )}
        </nav>
      </main>
    );
  }
  if (view === "result") {
    const correct = results.filter((r) => r.isCorrect).length,
      gradable = results.filter((r) => r.correctAnswer).length;
    return (
      <main className="resultPage">
        <header className="brand">
          <button onClick={() => setView("home")}>← 홈</button>
          <b>채점 결과</b>
          <span />
        </header>
        <section className="scoreCard">
          <small>이번 시험 점수</small>
          <strong>
            {gradable ? Math.round((correct / gradable) * 100) : 0}
            <em>점</em>
          </strong>
          <p>
            {correct}개 정답 · {gradable - correct}개 오답 · 정답 미제공{" "}
            {results.filter((r) => !r.correctAnswer).length}개
          </p>
        </section>
        <section className="reviewList">
          {exam.map((q, i) => {
            const r = results.find((x) => x.id === q.id);
            return (
              <article
                key={q.id}
                className={r?.isCorrect ? "correct" : "wrong"}
              >
                <div>
                  <b>
                    {i + 1}. {splitQuestionDisplay(q.questionText).title}
                  </b>
                  <span>
                    {r?.isCorrect === true
                      ? "정답"
                      : r?.isCorrect === false
                        ? "오답"
                        : "미채점"}
                  </span>
                </div>
                <p>
                  내 답 {r?.selected ?? "미응답"} · 정답{" "}
                  {r?.correctAnswer ?? "원문 누락"}
                </p>
                <div className="reviewChoices">
                  {(["A", "B", "C", "D"] as Key[]).map((key) => {
                    const isAnswer = key === r?.correctAnswer;
                    const isSelected = key === r?.selected;
                    const label = isAnswer && isSelected
                      ? "내 답 · 정답"
                      : isAnswer
                        ? "정답"
                        : isSelected
                          ? "내 답"
                          : null;
                    return (
                      <div
                        key={key}
                        className={`reviewChoice${isAnswer ? " answer" : ""}${isSelected ? " selected" : ""}`}
                      >
                        <strong>{key}</strong>
                        <p>{q.choices[key]}</p>
                        {label && <em>{label}</em>}
                      </div>
                    );
                  })}
                </div>
                {r?.explanation ? (
                  <div className="explanationBlock">
                    <span>{r.explanationStatus === "verified" ? "직접 작성 · 검증 완료" : "직접 작성 · 검토 필요"}</span>
                    <small>{r.explanation}</small>
                  </div>
                ) : (
                  <small>아직 작성된 해설이 없습니다.</small>
                )}
              </article>
            );
          })}
        </section>
        <button className="bottomAction" onClick={() => setView("home")}>
          학습 홈으로
        </button>
      </main>
    );
  }
  const modes = [
    ["round", "회차 그대로", "원본 순서 100문제"],
    ["random", "랜덤 풀이", "여러 연도에서 골고루"],
    ["real", "실전 CBT", "과목별 20문제"],
    ["subject", "과목 집중", "취약 과목만"],
    ["wrong", "오답 다시", "틀린 문제 복습"],
    ["unseen", "미풀이", "처음 보는 문제"],
    ["bookmark", "즐겨찾기", "저장한 문제"],
    ["code", "코드 문제", "실행 결과 연습"],
    ["sql", "SQL 문제", "DB 집중"],
  ];
  return (
    <main className="home">
      <header className="hero">
        <div className="brandMark">J</div>
        <div>
          <p>정보처리기사 필기</p>
          <h1>정처기 CBT</h1>
        </div>
        <span className={`online${pwaReady ? "" : " pending"}`}>
          {pwaReady ? "OFFLINE READY" : "WEB MODE"}
        </span>
      </header>
      <section className="intro">
        <p>2022—2025 기출문제</p>
        <h2>
          오늘도 한 문제씩,
          <br />
          <i>합격에 가까워집니다.</i>
        </h2>
        <div className="stats">
          <div>
            <b>{stats.solved}</b>
            <span>푼 문제</span>
          </div>
          <div>
            <b>{stats.wrong}</b>
            <span>오답</span>
          </div>
          <div>
            <b>{stats.bookmarks}</b>
            <span>즐겨찾기</span>
          </div>
        </div>
      </section>
      <section className="setup">
        <label>학습 모드</label>
        <div className="modeGrid">
          {modes.map(([id, title, desc]) => (
            <button
              key={id}
              className={mode === id ? "active" : ""}
              onClick={() => setMode(id)}
            >
              <b>{title}</b>
              <small>{desc}</small>
            </button>
          ))}
        </div>
        {mode === "round" && (
          <div className="selectors">
            <select value={year} onChange={(e) => setYear(e.target.value)}>
              {[2022, 2023, 2024, 2025].map((v) => (
                <option key={v}>{v}</option>
              ))}
            </select>
            <select value={round} onChange={(e) => setRound(e.target.value)}>
              {[1, 2, 3].map((v) => (
                <option key={v} value={v}>
                  {v}회
                </option>
              ))}
            </select>
          </div>
        )}
        {mode === "subject" && (
          <select
            className="wide"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          >
            {SUBJECTS.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        )}
        {!["round", "real"].includes(mode) && (
          <div className="counts">
            {[5, 10, 20, 50].map((n) => (
              <button
                className={count === n ? "active" : ""}
                key={n}
                onClick={() => setCount(n)}
              >
                {n}문제
              </button>
            ))}
          </div>
        )}
        <button className="start" onClick={start}>
          문제 풀기 <span>→</span>
        </button>
      </section>
      <footer className="homeFoot">
        <b>1,200</b>개 기출 · 정답 <b>1,200</b>개 연결
        <br />홈 화면에 추가하면 앱처럼 사용할 수 있습니다.
      </footer>
    </main>
  );
}
