"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  createEmptyProgress,
  getLanguageProgress,
  getOverallProgress,
  LANGUAGE_ORDER,
  PROGRAMMING_STUDY_DATA,
  PROGRAMMING_STUDY_STORAGE_KEY,
  type Importance,
  type LanguageId,
  type LanguageStudyData,
  type ProgrammingStudyProgress,
  type StudyContent,
  type StudyTopic,
} from "@/lib/programming-study-data";

const importanceLabel: Record<Importance, string> = {
  high: "높음",
  medium: "보통",
  low: "낮음",
};

function readStoredProgress(): ProgrammingStudyProgress {
  const empty = createEmptyProgress();
  if (typeof window === "undefined") return empty;

  try {
    const raw: unknown = JSON.parse(
      window.localStorage.getItem(PROGRAMMING_STUDY_STORAGE_KEY) ?? "null",
    );
    if (!raw || typeof raw !== "object") return empty;
    const record = raw as Record<string, unknown>;
    const completed = record.completed;
    const recent = record.recentLanguage;
    if (!completed || typeof completed !== "object") return empty;

    const completedRecord = completed as Record<string, unknown>;
    for (const id of LANGUAGE_ORDER) {
      const values = completedRecord[id];
      if (Array.isArray(values)) {
        empty.completed[id] = values.filter(
          (value): value is string => typeof value === "string",
        );
      }
    }
    empty.recentLanguage =
      typeof recent === "string" && LANGUAGE_ORDER.includes(recent as LanguageId)
        ? (recent as LanguageId)
        : null;
  } catch {
    return empty;
  }
  return empty;
}

function useStudyProgress() {
  const [progress, setProgress] = useState<ProgrammingStudyProgress>(
    createEmptyProgress,
  );
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setProgress(readStoredProgress());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(
      PROGRAMMING_STUDY_STORAGE_KEY,
      JSON.stringify(progress),
    );
  }, [progress, ready]);

  const toggleTopic = useCallback((languageId: LanguageId, topicId: string) => {
    setProgress((current) => {
      const completed = current.completed[languageId];
      const next = completed.includes(topicId)
        ? completed.filter((id) => id !== topicId)
        : [...completed, topicId];
      return {
        completed: { ...current.completed, [languageId]: next },
        recentLanguage: languageId,
      };
    });
  }, []);

  const setRecentLanguage = useCallback((languageId: LanguageId) => {
    setProgress((current) =>
      current.recentLanguage === languageId
        ? current
        : { ...current, recentLanguage: languageId },
    );
  }, []);

  const reset = useCallback(() => setProgress(createEmptyProgress()), []);

  return { progress, ready, toggleTopic, setRecentLanguage, reset };
}

function StudyHeader() {
  return (
    <header className="studyTopbar">
      <Link href="/" className="studyBrand" aria-label="정보처리기사 CBT 홈">
        <span className="studyBrandMark" aria-hidden="true">정</span>
        <span>정보처리기사 CBT</span>
      </Link>
      <Link href="/study/programming" className="studyTopLink">
        프로그래밍 핵심 정리
      </Link>
    </header>
  );
}

function ProgressBar({ value, label }: { value: number; label: string }) {
  return (
    <div className="studyProgressBlock">
      <div className="studyProgressLabel">
        <span>{label}</span>
        <strong>{value}%</strong>
      </div>
      <div
        className="studyProgressTrack"
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={value}
      >
        <span style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function ImportanceBadge({ importance }: { importance: Importance }) {
  return (
    <span className={`studyBadge studyBadge-${importance}`}>
      중요도 {importanceLabel[importance]}
    </span>
  );
}

export function ProgrammingStudyHome() {
  const { progress, ready, reset } = useStudyProgress();
  const overall = getOverallProgress(progress);
  const recent = progress.recentLanguage
    ? PROGRAMMING_STUDY_DATA[progress.recentLanguage]
    : null;

  const handleReset = () => {
    if (window.confirm("프로그래밍 핵심 정리 학습 기록을 모두 초기화할까요?")) {
      reset();
    }
  };

  return (
    <div className="studyPage">
      <StudyHeader />
      <main className="studyMain">
        <section className="studyHero" aria-labelledby="study-main-title">
          <p className="studyEyebrow">필기 · 실기 한 번에 대비</p>
          <h1 id="study-main-title">프로그래밍 핵심 정리</h1>
          <p>
            정보처리기사 필기·실기에서 자주 출제되는 프로그래밍 문법과
            SQL 정리
          </p>
        </section>

        <section className="studyDashboard" aria-label="전체 학습 현황">
          <div>
            <p className="studySectionKicker">전체 학습 진행률</p>
            <ProgressBar value={ready ? overall : 0} label="전체 학습 진행률" />
          </div>
          <div className="studyRecent">
            <span>최근 학습한 언어</span>
            {recent ? (
              <Link href={`/study/programming/${recent.id}`}>{recent.name} 이어보기 →</Link>
            ) : (
              <strong>아직 학습 기록이 없어요</strong>
            )}
          </div>
          <button className="studyResetButton" type="button" onClick={handleReset}>
            전체 초기화
          </button>
        </section>

        <section aria-labelledby="language-cards-title">
          <div className="studySectionHeading">
            <div>
              <p className="studySectionKicker">LANGUAGE GUIDE</p>
              <h2 id="language-cards-title">언어별로 학습하기</h2>
            </div>
            <p>완료한 섹션은 이 기기에 자동 저장됩니다.</p>
          </div>
          <div className="studyLanguageGrid">
            {LANGUAGE_ORDER.map((id, index) => {
              const language = PROGRAMMING_STUDY_DATA[id];
              const value = getLanguageProgress(language, progress.completed[id]);
              return (
                <article className={`studyLanguageCard studyLanguage-${id}`} key={id}>
                  <div className="studyCardNumber" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <h3>{language.name}</h3>
                  <p>{language.description}</p>
                  <ul className="studyTopicChips" aria-label={`${language.name} 핵심 주제`}>
                    {language.coreTopics.map((topic) => <li key={topic}>{topic}</li>)}
                  </ul>
                  <ProgressBar value={ready ? value : 0} label={`${language.name} 진행률`} />
                  <Link className="studyCardLink" href={`/study/programming/${id}`}>
                    {value > 0 ? "이어서 학습하기" : "학습 시작하기"}<span aria-hidden="true"> →</span>
                  </Link>
                </article>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}

function ContentBlock({ content }: { content: StudyContent }) {
  switch (content.type) {
    case "text":
      return <p className="studyText">{content.value}</p>;
    case "code":
      return (
        <figure className="studyCodeBlock">
          <figcaption>{content.language}</figcaption>
          <pre tabIndex={0}><code>{content.value}</code></pre>
        </figure>
      );
    case "result":
      return (
        <figure className="studyResultBlock">
          <figcaption>실행 결과</figcaption>
          <pre tabIndex={0}>{content.value}</pre>
        </figure>
      );
    case "warning":
      return (
        <aside className="studyCallout studyWarning">
          <strong>{content.title ?? "주의사항"}</strong>
          <p>{content.value}</p>
        </aside>
      );
    case "memory":
      return (
        <aside className="studyCallout studyMemory">
          <strong>암기 포인트</strong>
          <p>{content.value}</p>
        </aside>
      );
    case "table":
      return (
        <div className="studyTableWrap" tabIndex={0} role="region" aria-label="학습 비교표">
          <table>
            <thead><tr>{content.headers.map((header) => <th key={header} scope="col">{header}</th>)}</tr></thead>
            <tbody>{content.rows.map((row, rowIndex) => (
              <tr key={`${rowIndex}-${row.join("-")}`}>
                {row.map((cell, cellIndex) => cellIndex === 0
                  ? <th key={cellIndex} scope="row">{cell}</th>
                  : <td key={cellIndex}>{cell}</td>)}
              </tr>
            ))}</tbody>
          </table>
        </div>
      );
  }
}

function TopicArticle({
  topic,
  languageId,
  checked,
  onToggle,
}: {
  topic: StudyTopic;
  languageId: LanguageId;
  checked: boolean;
  onToggle: () => void;
}) {
  const checkboxId = `${languageId}-${topic.id}-complete`;
  return (
    <article className="studyTopic" id={topic.id} data-study-topic>
      <header className="studyTopicHeader">
        <div>
          <div className="studyTopicMeta">
            {topic.examTypes.map((type) => (
              <span className={`studyExamTag studyExam-${type}`} key={type}>
                {type === "written" ? "필기 중요" : "실기 중요"}
              </span>
            ))}
            <ImportanceBadge importance={topic.importance} />
          </div>
          <h2>{topic.title}</h2>
          <p>{topic.summary}</p>
        </div>
      </header>
      <div className="studyTopicContents">
        {topic.contents.map((content, index) => (
          <ContentBlock content={content} key={`${topic.id}-${content.type}-${index}`} />
        ))}
      </div>
      <div className="studyCompleteCheck">
        <input id={checkboxId} type="checkbox" checked={checked} onChange={onToggle} />
        <label htmlFor={checkboxId}>
          <span aria-hidden="true">✓</span>
          이 섹션 학습 완료
        </label>
      </div>
    </article>
  );
}

function TopicList({
  language,
  activeId,
  label,
}: {
  language: LanguageStudyData;
  activeId: string;
  label: string;
}) {
  return (
    <nav aria-label={label}>
      <ol>
        {language.topics.map((topic, index) => (
          <li key={topic.id}>
            <a href={`#${topic.id}`} className={activeId === topic.id ? "active" : undefined}>
              <span>{String(index + 1).padStart(2, "0")}</span>{topic.title}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function ProgrammingLanguagePage({ language }: { language: LanguageStudyData }) {
  const { progress, ready, toggleTopic, setRecentLanguage } = useStudyProgress();
  const [activeId, setActiveId] = useState(language.topics[0]?.id ?? "");
  const completed = progress.completed[language.id];
  const percentage = getLanguageProgress(language, completed);

  const neighbors = useMemo(() => {
    const index = LANGUAGE_ORDER.indexOf(language.id);
    return {
      previous: index > 0 ? PROGRAMMING_STUDY_DATA[LANGUAGE_ORDER[index - 1]] : null,
      next: index < LANGUAGE_ORDER.length - 1 ? PROGRAMMING_STUDY_DATA[LANGUAGE_ORDER[index + 1]] : null,
    };
  }, [language.id]);

  useEffect(() => {
    if (ready) setRecentLanguage(language.id);
  }, [language.id, ready, setRecentLanguage]);

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-study-topic]"));
    if (!("IntersectionObserver" in window) || sections.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActiveId(visible.target.id);
      },
      { rootMargin: "-18% 0px -65% 0px", threshold: [0, 0.1, 0.5] },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [language.id]);

  return (
    <div className="studyPage">
      <StudyHeader />
      <main className="studyMain studyDetailMain">
        <div className="studyBreadcrumb">
          <Link href="/study/programming">프로그래밍 핵심 정리</Link><span aria-hidden="true">/</span><span>{language.name}</span>
        </div>
        <section className={`studyLanguageHero studyLanguage-${language.id}`}>
          <div>
            <p className="studyEyebrow">PROGRAMMING LANGUAGE</p>
            <h1>{language.name}</h1>
            <p>{language.description}</p>
          </div>
          <div className="studyImportancePanel" aria-label="시험 중요도">
            <span>필기 중요도 <ImportanceBadge importance={language.writtenImportance} /></span>
            <span>실기 중요도 <ImportanceBadge importance={language.practicalImportance} /></span>
          </div>
        </section>
        <div className="studyDetailProgress">
          <ProgressBar value={ready ? percentage : 0} label={`${language.name} 학습 진행률`} />
          <span>{completed.length} / {language.topics.length} 섹션 완료</span>
        </div>

        <details className="studyMobileToc">
          <summary>목차 열기 · 현재 {language.topics.find((topic) => topic.id === activeId)?.title}</summary>
          <TopicList language={language} activeId={activeId} label={`${language.name} 모바일 목차`} />
        </details>

        <div className="studyDetailGrid">
          <aside className="studyDesktopToc">
            <p>목차</p>
            <TopicList language={language} activeId={activeId} label={`${language.name} 목차`} />
          </aside>
          <div className="studyArticleColumn">
            {language.topics.map((topic) => (
              <TopicArticle
                key={topic.id}
                topic={topic}
                languageId={language.id}
                checked={completed.includes(topic.id)}
                onToggle={() => toggleTopic(language.id, topic.id)}
              />
            ))}

            <section className="studyReviewGrid" aria-label="최종 암기 점검">
              <div className="studyReviewCard studyReviewMemory">
                <h2>반드시 외울 것</h2>
                <ul>{language.mustMemorize.map((item) => <li key={item}>{item}</li>)}</ul>
              </div>
              <div className="studyReviewCard studyReviewMistakes">
                <h2>자주 틀리는 부분</h2>
                <ul>{language.commonMistakes.map((item) => <li key={item}>{item}</li>)}</ul>
              </div>
            </section>

            <nav className="studyPager" aria-label="언어 페이지 이동">
              {neighbors.previous ? <Link href={`/study/programming/${neighbors.previous.id}`}>← 이전 · {neighbors.previous.name}</Link> : <span />}
              {neighbors.next ? <Link href={`/study/programming/${neighbors.next.id}`}>다음 · {neighbors.next.name} →</Link> : <Link href="/study/programming">학습 메인으로 →</Link>}
            </nav>
          </div>
        </div>
      </main>
      <button className="studyScrollTop" type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="페이지 위로 이동">↑<span>위로</span></button>
    </div>
  );
}
