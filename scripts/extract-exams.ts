import fs from "node:fs";
import { mkdir, readdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import * as pdfjs from "pdfjs-dist/legacy/build/pdf.mjs";
import { createCanvas, DOMMatrix, ImageData, Path2D, loadImage, type Canvas } from "@napi-rs/canvas";
Object.assign(globalThis, { DOMMatrix, ImageData, Path2D });
import { examSchema, subjectFor, type ExamQuestion } from "../lib/exam-schema";
import { examIdentity, sha256File, sha256Text, walk } from "../lib/fs-utils";
import { corrections2022, crops2022 } from "./exam-corrections/2022";
import { corrections2023, crops2023 } from "./exam-corrections/2023";
import { corrections2024, crops2024 } from "./exam-corrections/2024";
import { corrections2025, crops2025 } from "./exam-corrections/2025";
import { explanations2024Round1 } from "./exam-corrections/explanations-2024-1";
import { explanations2024Round2 } from "./exam-corrections/explanations-2024-2";
import { explanations2024Round3 } from "./exam-corrections/explanations-2024-3";
import { explanations2023Round1 } from "./exam-corrections/explanations-2023-1";
import { explanations2023Round2 } from "./exam-corrections/explanations-2023-2";
import { explanations2023Round3 } from "./exam-corrections/explanations-2023-3";
import { explanations2022Round1 } from "./exam-corrections/explanations-2022-1";
import { explanations2022Round2 } from "./exam-corrections/explanations-2022-2";
import { explanations2022Round3 } from "./exam-corrections/explanations-2022-3";
import { explanations2025Round1 } from "./exam-corrections/explanations-2025-1";
import { explanations2025Round2 } from "./exam-corrections/explanations-2025-2";
import { explanations2025Round3 } from "./exam-corrections/explanations-2025-3";
import { presentationCorrections } from "./exam-corrections/presentation";

type TextItem = { str: string; transform: number[]; width: number; height: number };
type PageText = { page: number; text: string; rawText: string; imageOps: number };
const choiceKeys = ["A", "B", "C", "D"] as const;
const symbols = ["①", "②", "③", "④"];

function tidy(value: string): string {
  return value.normalize("NFC").replace(/[ \t]+/g, " ").replace(/,{2,}/g, ",").replace(/\s+([,.?!:;])/g, "$1").replace(/\n{3,}/g, "\n\n").trim();
}

function removePageFurniture(value: string): string {
  return value
    .replace(/기출문제\s*&\s*정답(?:\s*및\s*해설)?[\s\S]*$/, "")
    .replace(/정보처리기사\s*필기\s*기출문제\s*\d+회\s*-\s*\d+\s*-[\s\S]*$/, "")
    .replace(/저작권\s*안내[\s\S]*$/, "")
    // 과목 전환 제목은 직전 과목의 20/40/60/80번 마지막 선택지 뒤에
    // 저장되는 경우가 많다. 표기 순서가 뒤집힌 PDF 형태까지 처리한다.
    .replace(/\s*(?:[123]\s*회\s*)?제\s*(?:(?:[1-5]\s*)?과목|과목\s*[1-5]?)\s*:?\s*(?:소프트웨어\s*설계|소프트웨어\s*개발|데이터베이스\s*구축|프로그래밍\s*언어\s*활용|정보시스템\s*구축\s*관리)\s*[1-5]?\s*$/, "");
}

function columns(items: TextItem[], width: number, height: number): string {
  const usable = items.filter((item) => {
    const y = item.transform[5];
    // 실제 문항은 두 번째 페이지부터 상단 70~80pt 지점에서 바로 시작한다.
    // 최상단 문서 머리말만 제외하고 문항 영역을 보존한다.
    return item.str.trim() && y < height - 45 && y > 36;
  });
  const center = width / 2;
  const toLines = (selected: TextItem[]) => {
    const lines: { y: number; items: TextItem[] }[] = [];
    for (const item of selected) {
      const y = item.transform[5];
      let line = lines.find((candidate) => Math.abs(candidate.y - y) < 2.2);
      if (!line) lines.push((line = { y, items: [] }));
      line.items.push(item);
    }
    return lines.sort((a, b) => b.y - a.y).map((line) => line.items.sort((a, b) => a.transform[4] - b.transform[4]).map((item) => item.str).join(" ")).join("\n");
  };
  const left = usable.filter((item) => item.transform[4] < center - 4);
  const right = usable.filter((item) => item.transform[4] >= center - 4);
  const rightQuestionCount = right.filter((item) => /^(?:[1-9]\d?|100)\.$/.test(item.str.trim())).length;
  if (rightQuestionCount === 0) return toLines(usable);
  return `${toLines(left)}\n${toLines(right)}`;
}

async function readPdf(file: string): Promise<{ pages: PageText[]; pageCount: number }> {
  const doc = await pdfjs.getDocument({ data: new Uint8Array(fs.readFileSync(file)) }).promise;
  const pages: PageText[] = [];
  for (let number = 1; number <= doc.numPages; number++) {
    const page = await doc.getPage(number);
    const viewport = page.getViewport({ scale: 1 });
    const content = await page.getTextContent();
    const ops = await page.getOperatorList();
    const imageOps = ops.fnArray.filter((op) => op === 82 || op === 85).length;
    const rawText = (content.items as TextItem[]).map((item) => item.str).join(" ");
    pages.push({ page: number, text: columns(content.items as TextItem[], viewport.width, viewport.height), rawText, imageOps });
  }
  return { pages, pageCount: doc.numPages };
}

function extractAnswers(text: string): Map<number, { answer: "A" | "B" | "C" | "D"; original: string }> {
  const result = new Map<number, { answer: "A" | "B" | "C" | "D"; original: string }>();
  for (const match of text.matchAll(/(?:^|\s)(100|[1-9]\d?)\s*\.\s*([①②③④])/g)) {
    const index = symbols.indexOf(match[2]);
    result.set(Number(match[1]), { answer: choiceKeys[index], original: match[2] });
  }
  return result;
}

function parseChunk(chunk: string, no: number, page: number, sourceDocument: string, answer: ReturnType<typeof extractAnswers> extends Map<number, infer V> ? V | undefined : never, imageOps: number): ExamQuestion {
  const sourceBody = removePageFurniture(chunk.replace(/^\s*(?:100|[1-9]\d?)\s*\.\s*/, "")).normalize("NFC").trim();
  const sourcePositions = symbols.map((symbol) => sourceBody.indexOf(symbol));
  const sourceChoicesValid = sourcePositions.every((position, index) => position >= 0 && (index === 0 || position > sourcePositions[index - 1]));
  const sourceQuestionText = (sourceChoicesValid ? sourceBody.slice(0, sourcePositions[0]) : sourceBody).trim();
  const sourceChoiceValues = symbols.map((symbol, index) => sourceChoicesValid
    ? sourceBody.slice(sourcePositions[index] + symbol.length, sourcePositions[index + 1] ?? sourceBody.length).trim()
    : "");
  const body = tidy(sourceBody);
  const positions = symbols.map((symbol) => body.indexOf(symbol));
  const validChoices = positions.every((position, index) => position >= 0 && (index === 0 || position > positions[index - 1]));
  const reviews: string[] = [];
  if (!validChoices) reviews.push("선택지 A~D 분리 실패");
  let questionText = tidy(validChoices ? body.slice(0, positions[0]) : body);
  const choiceValues = symbols.map((symbol, index) => validChoices ? tidy(body.slice(positions[index] + symbol.length, positions[index + 1] ?? body.length)) : "");
  // 일부 구형 PDF는 코드 블록을 네 선택지 뒤에 저장한다. 마지막 선택지에
  // 붙은 명백한 코드 시작점은 지문으로 되돌려 코드 의미와 들여쓰기를 보존한다.
  const lateCode = choiceValues[3].search(/\b(?:public\s+class|class\s+\w+\s*\{|#include\s*<|int\s+main\s*\()/);
  if (lateCode > 0) {
    const code = choiceValues[3].slice(lateCode).trim();
    choiceValues[3] = choiceValues[3].slice(0, lateCode).trim();
    questionText = `${questionText}\n\n${code}`;
  }
  choiceValues.forEach((value, index) => { if (!value) { reviews.push(`선택지 ${choiceKeys[index]} 텍스트가 비어 있음(이미지/레이아웃 검토 필요)`); choiceValues[index] = "[원본 PDF의 이미지 또는 레이아웃 선택지 — 검토 필요]"; } });
  choiceValues.forEach((value, index) => { if (value.length > 160) reviews.push(`선택지 ${choiceKeys[index]} 길이 이상치(${value.length}자)`); });
  if (!answer) reviews.push("원본 정답표에 정답 없음");
  const hasImageReference = /다음\s*(그림|트리|그래프|도표|구조|화면)|그림과|아래\s*(그림|표)|대하여.*결과|빈\s*칸/.test(questionText);
  if (hasImageReference && imageOps === 0) reviews.push("이미지 참조 문구가 있으나 PDF 이미지 연산 미검출");
  const isCode = /#include|public\s+static|class\s+\w+|printf|System\.out|코드|프로그램.*실행|<\?php/i.test(body);
  const isSql = /\b(SELECT|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP|GRANT|REVOKE)\b|SQL/i.test(body);
  const needsPageAsset = hasImageReference || reviews.some((reason) => reason.includes("이미지/레이아웃"));
  const normalized = tidy(questionText);
  const choices = Object.fromEntries(choiceKeys.map((key, index) => [key, { original: `${symbols[index]} ${choiceValues[index]}`, normalized: choiceValues[index] }])) as ExamQuestion["choices"];
  return {
    questionNo: no, subject: subjectFor(no), questionText: normalized, originalQuestionText: sourceQuestionText || questionText,
    choices: Object.fromEntries(choiceKeys.map((key, index) => [key, {
      original: `${symbols[index]}${sourceChoiceValues[index] ? ` ${sourceChoiceValues[index]}` : ""}`,
      normalized: choices[key].normalized,
    }])) as ExamQuestion["choices"], correctAnswer: answer?.answer ?? null, originalAnswerText: answer?.original ?? null,
    sourcePage: page, sourceType: "uploaded_exam_pdf", sourceDocument,
    normalizedHash: sha256Text(`${normalized}|${choiceValues.join("|")}`),
    assets: needsPageAsset ? [{ type: "source_page", path: `assets/page-${page}.png`, pageNumber: page, altText: `${no}번 문항의 도표 또는 복잡한 레이아웃이 포함된 원본 ${page}쪽` }] : [],
    hasImageReference, isCode, isSql, needsReview: reviews.length > 0, reviewReasons: reviews,
    explanation: null, explanationStatus: "missing", explanationSource: null,
  };
}

async function extractExam(file: string) {
  const id = examIdentity(path.basename(file));
  if (!id) throw new Error(`연도/회차를 파일명에서 식별할 수 없음: ${file}`);
  const { pages, pageCount } = await readPdf(file);
  const answerPages = pages.filter((page) => extractAnswers(page.rawText).size >= 20);
  const answers = extractAnswers(answerPages.map((page) => page.rawText).join("\n"));
  const firstAnswerPage = answerPages[0]?.page ?? pageCount + 1;
  const questionPages = pages.filter((page) => page.page < firstAnswerPage);
  // 2단 편집 PDF는 콘텐츠 스트림 순서가 줄 단위로 교차되므로 좌표를 기준으로
  // 왼쪽 열 위→아래, 오른쪽 열 위→아래 순서로 재구성한 텍스트를 사용한다.
  let joined = questionPages.map((page) => `\n[[PAGE:${page.page}]]\n${page.text}`).join("");
  const findStarts = (text: string) => {
    const all = [...text.matchAll(/(?:^|\s)(100|[1-9]\d?)\s*\.\s+/g)];
    const selected: RegExpMatchArray[] = []; let cursor = 0;
    for (let expected = 1; expected <= 100; expected++) {
      const found = all.find((match) => Number(match[1]) === expected && (match.index ?? 0) >= cursor);
      if (!found) continue;
      selected.push(found); cursor = (found.index ?? 0) + found[0].length;
    }
    return selected;
  };
  let starts = findStarts(joined);
  // 일부 구형 PDF는 시각적으로 한 열이지만 텍스트 좌표가 페이지 중앙을 넘는다.
  // 좌표 재구성이 100개 경계를 만들지 못할 때만 원본 스트림 순서로 안전하게 대체한다.
  if (starts.length < 100) {
    joined = questionPages.map((page) => `\n[[PAGE:${page.page}]]\n${page.rawText}`).join("");
    starts = findStarts(joined);
  }
  const candidates = new Map<number, { chunk: string; page: number }>();
  for (let index = 0; index < starts.length; index++) {
    const match = starts[index];
    const no = Number(match[1]);
    const end = starts[index + 1]?.index ?? joined.length;
    const before = joined.slice(0, match.index);
    const pageMatch = [...before.matchAll(/\[\[PAGE:(\d+)\]\]/g)].at(-1);
    const chunk = joined.slice(match.index, end).replace(/\[\[PAGE:\d+\]\]/g, " ");
    if (!candidates.has(no) || chunk.length > candidates.get(no)!.chunk.length) candidates.set(no, { chunk, page: Number(pageMatch?.[1] ?? 1) });
  }
  const questions: ExamQuestion[] = [];
  for (let no = 1; no <= 100; no++) {
    const candidate = candidates.get(no);
    if (!candidate) continue;
    const pageInfo = pages[candidate.page - 1];
    questions.push(parseChunk(candidate.chunk, no, candidate.page, path.basename(file).normalize("NFC"), answers.get(no), pageInfo?.imageOps ?? 0));
  }
  const outDir = path.join("data", "imported", String(id.year), String(id.round));
  await mkdir(outDir, { recursive: true });
  const assetPages = [...new Set(questions.filter((q) => q.hasImageReference || q.reviewReasons.some((r) => r.includes("이미지/레이아웃"))).map((q) => q.sourcePage))];
  if (assetPages.length) {
    const assetDir = path.join(outDir, "assets"); await mkdir(assetDir, { recursive: true });
    const renderDoc = await pdfjs.getDocument({ data: new Uint8Array(fs.readFileSync(file)) }).promise;
    for (const pageNo of assetPages) {
      const page = await renderDoc.getPage(pageNo); const viewport = page.getViewport({ scale: 1.5 });
      const canvas = createCanvas(Math.ceil(viewport.width), Math.ceil(viewport.height));
      await page.render({ canvas: canvas as never, canvasContext: canvas.getContext("2d") as never, viewport }).promise;
      await writeFile(path.join(assetDir, `page-${pageNo}.png`), canvas.toBuffer("image/png"));
    }
  }
  const data = examSchema.parse({ schemaVersion: 1, ...id, title: `${id.year}년 ${id.round}회 정보처리기사 필기`, sourceDocument: path.basename(file).normalize("NFC"), sourceSha256: await sha256File(file), sourcePages: pageCount, extractedAt: new Date().toISOString(), questions });
  await writeFile(path.join(outDir, "questions.json"), JSON.stringify(data, null, 2) + "\n");
  return { ...id, pageCount, questions: questions.length, answers: answers.size, review: questions.filter((q) => q.needsReview).length };
}

async function extractStandards() {
  const files = (await walk("source/exam-standard")).filter((file) => file.toLowerCase().endsWith(".pdf")).sort();
  const result = [];
  for (const [index, file] of files.entries()) {
    const { pages, pageCount } = await readPdf(file);
    result.push({ title: path.basename(file).normalize("NFC"), effectiveFrom: index === 0 ? "2026-01-01" : "2023-01-01", effectiveTo: index === 0 ? "2026-12-31" : "2025-12-31", sha256: await sha256File(file), pageCount, rawText: pages.map((p) => p.text).join("\n\n"), parsedStructure: { items: pages.flatMap((p) => p.text.split("\n").filter((line) => /과목|주요항목|세부항목|세세항목/.test(line)).map((line, order) => ({ sourcePage: p.page, displayOrder: order, text: tidy(line) }))) } });
  }
  await mkdir("data/imported/standards", { recursive: true });
  await writeFile("data/imported/standards/standards.json", JSON.stringify(result, null, 2) + "\n");
}

const ocrWordRepairs: [RegExp, string][] = [
  [/소\s*프\s*트\s*웨\s*어/g, "소프트웨어"],
  [/데\s*이\s*터\s*베\s*이\s*스/g, "데이터베이스"],
  [/데\s*이\s*터/g, "데이터"],
  [/시\s*스\s*템/g, "시스템"],
  [/프로\s*젝\s*트/g, "프로젝트"],
  [/프\s*로\s*그\s*램/g, "프로그램"],
  [/프\s*로\s*그\s*래\s*밍/g, "프로그래밍"],
  [/모\s*델\s*링/g, "모델링"],
  [/릴\s*레\s*이\s*션/g, "릴레이션"],
  [/프로\s*세\s*스/g, "프로세스"],
  [/클\s*래\s*스/g, "클래스"],
  [/인\s*터\s*페\s*이\s*스/g, "인터페이스"],
  [/디\s*지\s*털/g, "디지털"],
  [/컴\s*포\s*넌\s*트/g, "컴포넌트"],
  [/운\s*영\s*체\s*제/g, "운영체제"],
  [/페\s*이\s*지/g, "페이지"],
  [/서\s*비\s*스/g, "서비스"],
  [/네\s*트\s*워\s*크/g, "네트워크"],
  [/알\s*고\s*리\s*즘/g, "알고리즘"],
  [/다\s*이\s*어\s*그\s*램/g, "다이어그램"],
  [/애\s*플\s*리\s*케\s*이\s*션/g, "애플리케이션"],
  [/카\s*디\s*널\s*리\s*티/g, "카디널리티"],
  [/트\s*랜\s*잭\s*션/g, "트랜잭션"],
  [/프로\s*토\s*콜/g, "프로토콜"],
  [/스\s*케\s*줄\s*링/g, "스케줄링"],
  [/패\s*스\s*워\s*드/g, "패스워드"],
  [/타\s*임\s*스\s*탬\s*프/g, "타임스탬프"],
  [/포\s*인\s*터/g, "포인터"],
  [/라\s*우\s*팅/g, "라우팅"],
  [/메\s*타\s*데\s*이\s*터/g, "메타데이터"],
  [/저\s*작\s*권\s*자/g, "저작권자"],
  [/저\s*장\s*장\s*치/g, "저장장치"],
  [/생\s*명\s*주\s*기/g, "생명주기"],
  [/기\s*능\s*점\s*수/g, "기능점수"],
  [/입\s*출\s*력/g, "입출력"],
  [/상\s*호\s*작\s*용/g, "상호작용"],
  [/접\s*근\s*통\s*제/g, "접근통제"],
  [/객\s*체\s*지\s*향/g, "객체지향"],
  [/기\s*본\s*키/g, "기본키"],
  [/외\s*래\s*키/g, "외래키"],
  [/후\s*보\s*키/g, "후보키"],
  [/슈\s*퍼\s*키/g, "슈퍼키"],
  [/삽\s*입/g, "삽입"],
  [/조\s*합/g, "조합"],
  [/비절\s*차적/g, "비절차적"],
  [/생\s*산성/g, "생산성"],
  [/복잡\s*도/g, "복잡도"],
];

function normalizeProseLayout(value: string): string {
  const flattened = value.replace(/\s*\n\s*/g, " ").replace(/[ \t]{2,}/g, " ").trim();
  if (!/[ㆍ•]/.test(flattened)) return flattened;
  const [prompt, ...bullets] = flattened.split(/\s*[ㆍ•]\s*/);
  return `${prompt.trim()}\n\n${bullets.map((bullet) => `• ${bullet.trim()}`).join("\n")}`.trim();
}

/**
 * PDF 자간 때문에 화면용 필드에만 생긴 확정 띄어쓰기를 정리한다.
 * 줄바꿈과 코드 기호는 건드리지 않으므로 코드/표 레이아웃에도 안전하다.
 */
function normalizeKoreanDisplaySpacing(value: string): string {
  return value
    .replace(/[\uFF01-\uFF5E]/g, (character) => String.fromCharCode(character.charCodeAt(0) - 0xfee0))
    .replace(/가장거리가/g, "가장 거리가")
    .replace(/평가 절차 모델[ \t]+인/g, "평가 절차 모델인")
    .replace(/데이터링크 계층/g, "데이터 링크 계층")
    .replace(/C언어/g, "C 언어")
    .replace(/\bJAVA\s+Script\b/g, "JavaScript")
    .replace(/\bJAVA\b/g, "Java")
    .replace(/IP주소/g, "IP 주소")
    .replace(/1대[ \t]+1/g, "1대1")
    .replace(/1대[ \t]+다/g, "1대다")
    .replace(/다대[ \t]+다/g, "다대다")
    .replace(/10000[ \t]+라인/g, "10000라인")
    .replace(/25[ \t]+번/g, "25번")
    .replace(/호출[ \t]+하는/g, "호출하는")
    .replace(/저장[ \t]+한다/g, "저장한다")
    .replace(/작[ \t]+업이다/g, "작업이다")
    .replace(/암호화[ \t]+된다/g, "암호화된다")
    .replace(/해당[ \t]+하지/g, "해당하지")
    .replace(/3[ \t]+대 요소/g, "3대 요소")
    .replace(/사용[ \t]+자들에게/g, "사용자들에게")
    .replace(/대응[ \t]+한다/g, "대응한다")
    .replace(/자유[ \t]+로운/g, "자유로운")
    .replace(/형[ \t]+태의/g, "형태의")
    .replace(/전[ \t]+송하는/g, "전송하는")
    .replace(/명시[ \t]+한다/g, "명시한다")
    .replace(/설계[ \t]+된/g, "설계된")
    .replace(/기술[ \t]+이다/g, "기술이다")
    .replace(/무엇[ \t]+인지/g, "무엇인지")
    .replace(/제공[ \t]+되는/g, "제공되는")
    .replace(/것[ \t]+이다/g, "것이다")
    .replace(/애튜리뷰트/g, "애트리뷰트")
    .replace(/부여[ \t]+하는/g, "부여하는")
    .replace(/작업[ \t]+할/g, "작업할")
    .replace(/제[ \t]+([1-9])[ \t]+정규형/g, "제$1정규형")
    .replace(/알고 있어이[ \t]+를/g, "알고 있어 이를")
    .replace(/([가-힣])적\s+인(?=[\s,.?!:;)]|$)/g, "$1적인")
    .replace(/([가-힣])으\s+로(?=[\s,.?!:;)]|$)/g, "$1으로")
    .replace(/의[ \t]+미한다/g, "의미한다")
    .replace(/언어\s+이다(?=[\s,.?!:;)]|$)/g, "언어이다")
    .replace(/([가-힣])[ \t]+(에게|에서|으로|까지|은|는|이|가|을|를|의|와|과|로|만|도)(?=[ \t,.?!:;)\]}]|$)/g, "$1$2")
    .replace(/([A-Za-z0-9)\]])\s+(은|는|이|가|을|를|의|에서|보다|에|와|과|로|까지만|까지|만|도)(?=[\s,.?!:;)\]}]|$)/g, "$1$2");
}

function hasExecutableCode(value: string): boolean {
  return /#include\s*</.test(value)
    || /\bpublic\s+class\s+\w+/.test(value)
    || /(?:^|\n)\s*class\s+\w+\s*\{/.test(value)
    || /\b(?:int|void)\s+main\s*\(/.test(value)
    || /\bmain\s*\([^)]*\)\s*\{/.test(value)
    || /(?:^|\n\n)\s*(?:int|char|float|double|String)\s+\w+/m.test(value)
    || /\b(?:printf|scanf|System\.out)\s*\.?\w*\s*\(/.test(value)
    || /<\?php/i.test(value)
    || /(?:^|\n\n)\s*(?:import\s+\w+|[a-zA-Z_]\w*\s*=|[a-zA-Z_]\w*\s*,\s*[a-zA-Z_]\w*\s*=|for\s+\w+\s+in\s+|while\s+[^\n]+:|print\s*\()/m.test(value);
}

function displayCleanup(value: string): string {
  let cleaned = value
    .replace(/INSERT\s+INTO\s+컴퓨터과테이블\s+학번\s*\(,\s*이름,\s*학년\s*\)/gi, "INSERT INTO 컴퓨터과테이블(학번, 이름, 학년)")
    .replace(/\?\.?\s*생략\.\./g, "?")
    .replace(/;?\.\.\s*생략\.\./g, ";")
    .replace(/,\s*\./g, ".")
    .replace(/\.\s*\?/g, "?")
    .replace(/\?\s*\./g, "?")
    .replace(/\b(\d+)\s+개\b/g, "$1개")
    .replace(/\n\s*\n[123]\s*회\s*$/, "")
    .replace(/다음\s+두,\s*SQL/g, "다음 두 SQL")
    .replace(/데이터베\s*,\s*이스/g, "데이터베이스")
    .replace(/포함되\s*,\s*어야/g, "포함되어야")
    .replace(/한\s*,\s*다/g, "한다")
    .replace(/있\s+다(?![가-힣])/g, "있다")
    .replace(/한\s+다(?![가-힣])/g, "한다")
    .replace(/위\s+해(?![가-힣])/g, "위해")
    .replace(/위\s+한(?![가-힣])/g, "위한")
    .replace(/관련\s+한(?![가-힣])/g, "관련한")
    .replace(/통\s+해(?![가-힣])/g, "통해")
    .replace(/모\s+두(?![가-힣])/g, "모두")
    .replace(/있도\s+록(?![가-힣])/g, "있도록")
    .replace(/해당하\s+지(?![가-힣])/g, "해당하지")
    .replace(/제공\s+한다(?![가-힣])/g, "제공한다")
    .replace(/의미\s+한다(?![가-힣])/g, "의미한다")
    .replace(/의미한\s+다(?![가-힣])/g, "의미한다")
    .replace(/구성되\s+어(?![가-힣])/g, "구성되어")
    .replace(/적합하\s+다(?![가-힣])/g, "적합하다")
    .replace(/용이하\s+다(?![가-힣])/g, "용이하다")
    .replace(/수행\s+한다(?![가-힣])/g, "수행한다")
    .replace(/수정\s+할(?![가-힣])/g, "수정할")
    .replace(/고려한\s+다(?![가-힣])/g, "고려한다")
    .replace(/활용\s+된다(?![가-힣])/g, "활용된다")
    .replace(/정의\s+한다(?![가-힣])/g, "정의한다")
    .replace(/진행\s+된다(?![가-힣])/g, "진행된다")
    .replace(/제공\s+해야(?![가-힣])/g, "제공해야")
    .replace(/존재\s+한다(?![가-힣])/g, "존재한다")
    .replace(/모형이\s+다(?![가-힣])/g, "모형이다")
    .replace(/복귀\s+하는지(?![가-힣])/g, "복귀하는지")
    .replace(/동작해\s+야(?![가-힣])/g, "동작해야")
    .replace(/최소화하고\s+자(?![가-힣])/g, "최소화하고자")
    .replace(/(\d)\s+(개|회|번째|계층|단계|비트|바이트|명|건|종|가지|년|월|일|초)(?![가-힣])/g, "$1$2")
    .replace(/([A-Za-z0-9가-힣])\s+\((?=[A-Za-z0-9가-힣][^\n)]*\))/g, "$1(")
    .replace(/\(\s+(?!\))/g, "(")
    .replace(/(?<!\()\s+\)/g, ")")
    .replace(/\s+([,.?!:;])/g, "$1")
    .trim();
  for (const [pattern, replacement] of ocrWordRepairs) cleaned = cleaned.replace(pattern, replacement);
  return cleaned;
}

function contentFingerprint(question: ExamQuestion): string {
  return [question.questionText, ...choiceKeys.map((key) => question.choices[key].normalized)]
    .join("").normalize("NFC").toLowerCase().replace(/[^\p{L}\p{N}]/gu, "");
}

function qualityPenalty(question: ExamQuestion): number {
  const text = [question.questionText, ...choiceKeys.map((key) => question.choices[key].normalized)].join(" ");
  return (text.match(/,\.|\.\?|\?\.|\(\s*,|\s+\)|\(\s+|제\s*과목/g) ?? []).length * 100
    + (text.match(/\n/g) ?? []).length
    + (question.needsReview ? 25 : 0);
}

type DisplayCorrection = {
  questionText?: string;
  choices?: Partial<Record<(typeof choiceKeys)[number], string>>;
  correctAnswer?: (typeof choiceKeys)[number] | null;
  originalAnswerText?: string | null;
  isCode?: boolean;
  isSql?: boolean;
  hasImageReference?: boolean;
  needsReview?: boolean;
  reviewReasons?: readonly string[];
  removeAssets?: boolean;
};

type ExamCrop = {
  outputAsset: string;
  pageNumber: number;
  type: "diagram" | "choice_diagram";
  altText: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

function applyDisplayCorrections(
  byId: Map<string, ExamQuestion>,
  corrections: Record<string, DisplayCorrection>,
) {
  for (const [id, correction] of Object.entries(corrections)) {
    const question = byId.get(id);
    if (!question) throw new Error(`교정 대상 문항을 찾을 수 없음: ${id}`);
    if (correction.questionText !== undefined) question.questionText = correction.questionText;
    if (correction.choices) {
      for (const key of choiceKeys) {
        const normalized = correction.choices[key];
        if (normalized !== undefined) question.choices[key].normalized = normalized;
      }
    }
    if (correction.correctAnswer !== undefined) question.correctAnswer = correction.correctAnswer;
    if (correction.originalAnswerText !== undefined) question.originalAnswerText = correction.originalAnswerText;
    if (correction.isCode !== undefined) question.isCode = correction.isCode;
    if (correction.isSql !== undefined) question.isSql = correction.isSql;
    if (correction.hasImageReference !== undefined) question.hasImageReference = correction.hasImageReference;
    if (correction.needsReview !== undefined) question.needsReview = correction.needsReview;
    if (correction.reviewReasons !== undefined) question.reviewReasons = [...correction.reviewReasons];
    if (correction.removeAssets) {
      question.assets = [];
      if (correction.hasImageReference === undefined) question.hasImageReference = false;
    }
  }
}

async function applyExamCrops(
  byId: Map<string, ExamQuestion>,
  crops: Record<string, ExamCrop>,
) {
  const sourceFiles = new Map<string, string>();
  for (const file of (await walk("source/past-exams")).filter((item) => item.toLowerCase().endsWith(".pdf"))) {
    const identity = examIdentity(path.basename(file));
    if (identity) sourceFiles.set(`${identity.year}-${identity.round}`, file);
  }
  const renderedPages = new Map<string, Canvas>();
  const documents = new Map<string, Awaited<ReturnType<typeof pdfjs.getDocument>["promise"]>>();

  for (const [id, crop] of Object.entries(crops)) {
    const question = byId.get(id);
    if (!question) throw new Error(`크롭 대상 문항을 찾을 수 없음: ${id}`);
    const examId = id.split("-").slice(0, 2).join("-");
    const sourceFile = sourceFiles.get(examId);
    if (!sourceFile) throw new Error(`크롭 원본 PDF를 찾을 수 없음: ${examId}`);
    const pageKey = `${examId}-${crop.pageNumber}`;
    let rendered = renderedPages.get(pageKey);
    if (!rendered) {
      let document = documents.get(examId);
      if (!document) {
        document = await pdfjs.getDocument({ data: new Uint8Array(fs.readFileSync(sourceFile)) }).promise;
        documents.set(examId, document);
      }
      const page = await document.getPage(crop.pageNumber);
      const viewport = page.getViewport({ scale: 1.5 });
      rendered = createCanvas(Math.ceil(viewport.width), Math.ceil(viewport.height));
      await page.render({ canvas: rendered as never, canvasContext: rendered.getContext("2d") as never, viewport }).promise;
      renderedPages.set(pageKey, rendered);
    }
    if (!rendered) throw new Error(`PDF 페이지 렌더링 실패: ${pageKey}`);
    const output = createCanvas(crop.width, crop.height);
    const context = output.getContext("2d");
    context.fillStyle = "white";
    context.fillRect(0, 0, crop.width, crop.height);
    context.drawImage(rendered, crop.x, crop.y, crop.width, crop.height, 0, 0, crop.width, crop.height);
    await mkdir(path.dirname(crop.outputAsset), { recursive: true });
    await writeFile(crop.outputAsset, output.toBuffer("image/png"));
    const examDir = path.join("data", "imported", ...examId.split("-"));
    question.assets = [{
      type: "diagram",
      path: path.relative(examDir, crop.outputAsset).split(path.sep).join("/"),
      pageNumber: crop.pageNumber,
      altText: crop.altText,
    }];
    question.hasImageReference = true;
  }
  for (const document of documents.values()) await document.destroy();
}

async function repairRepeatedQuestions() {
  const entries: { file: string; data: ReturnType<typeof examSchema.parse> }[] = [];
  for (let year = 2022; year <= 2025; year++) for (let round = 1; round <= 3; round++) {
    const file = path.join("data", "imported", String(year), String(round), "questions.json");
    entries.push({ file, data: examSchema.parse(JSON.parse(fs.readFileSync(file, "utf8"))) });
  }
  const groups = new Map<string, ExamQuestion[]>();
  for (const { data } of entries) for (const question of data.questions) {
    const key = contentFingerprint(question); const list = groups.get(key) ?? []; list.push(question); groups.set(key, list);
  }
  let repaired = 0;
  for (const questions of groups.values()) {
    const best = [...questions].sort((a, b) => qualityPenalty(a) - qualityPenalty(b))[0];
    for (const question of questions) {
      const before = JSON.stringify([question.questionText, question.choices]);
      question.questionText = displayCleanup(best.questionText);
      for (const key of choiceKeys) question.choices[key].normalized = displayCleanup(best.choices[key].normalized);
      question.normalizedHash = sha256Text(`${question.questionText}|${choiceKeys.map((key) => question.choices[key].normalized).join("|")}`);
      if (before !== JSON.stringify([question.questionText, question.choices])) repaired++;
    }
  }
  const byId = new Map<string, ExamQuestion>(entries.flatMap(({ data }) => data.questions.map((q) => [`${data.year}-${data.round}-${q.questionNo}`, q])));
  const copyDisplay = (targetId: string, sourceId: string) => {
    const target = byId.get(targetId)!, source = byId.get(sourceId)!;
    target.questionText = displayCleanup(source.questionText);
    for (const key of choiceKeys) target.choices[key].normalized = displayCleanup(source.choices[key].normalized);
    target.needsReview = false; target.reviewReasons = [];
  };
  copyDisplay("2023-1-5", "2025-1-5");
  copyDisplay("2023-3-7", "2023-2-17");
  copyDisplay("2025-1-93", "2022-2-93");
  copyDisplay("2025-1-100", "2022-1-88");
  const verified: Record<string, { question?: string; choices: [string, string, string, string]; note?: string }> = {
    "2022-1-44": { choices: ["원", "직사각형", "이중 타원", "직선"], note: "원본 선택지가 도형이므로 원본 페이지 자산 병행 표시" },
    "2023-1-46": { question: "테이블 R과 S에 대해 다음 SQL 문이 실행되었을 때, 실행 결과로 옳은 것은?\n\nR\nA | B\n1 | A\n3 | B\n\nS\nA | B\n1 | A\n2 | B\n\nSELECT A FROM R\nUNION ALL\nSELECT A FROM S;", choices: ["1", "3, 2", "1, 3", "1, 3, 1, 2"], note: "UNION ALL 실행 결과 도표를 원본 페이지에서 판독" },
    "2022-1-57": { question: "테이블 R과 S에 대해 다음 SQL 문이 실행되었을 때, 실행 결과로 옳은 것은?\n\nR\nA | B\n1 | A\n3 | B\n\nS\nA | B\n1 | A\n2 | B\n\nSELECT A FROM R\nUNION ALL\nSELECT A FROM S;", choices: ["1", "3, 2", "1, 3", "1, 3, 1, 2"], note: "UNION ALL 실행 결과 도표를 원본 페이지에서 판독" },
    "2022-2-57": { question: "다음 [조건]에 부합하는 SQL문을 작성하고자 할 때, [SQL문]의 빈칸에 들어갈 내용으로 옳은 것은? (단, '팀코드' 및 '이름'은 속성이며, '직원'은 테이블이다.)\n\n[조건]\n이름이 '정도일'인 팀원이 소속된 팀코드를 이용하여 해당 팀에 소속된 팀원들의 이름을 출력하는 SQL문 작성\n\n[SQL문]\n\nSELECT 이름\nFROM 직원\nWHERE 팀코드 = ( );", choices: ["WHERE 이름 = '정도일'", "SELECT 팀코드 FROM 이름 WHERE 직원 = '정도일'", "WHERE 직원 = '정도일'", "SELECT 팀코드 FROM 직원 WHERE 이름 = '정도일'"] },
    "2022-2-60": { question: "사용자 'PARK'에게 테이블을 생성할 수 있는 권한을 부여하기 위한 SQL문의 빈칸에 들어갈 내용으로 옳은 것은?\n\n[SQL문]\n\nGRANT ( ) PARK;", choices: ["CREATE TABLE TO", "CREATE TO", "CREATE FROM", "CREATE TABLE FROM"] },
    "2025-2-56": { question: "테이블 R과 S에 대해 다음 SQL 문이 실행되었을 때, 실행 결과로 옳은 것은?\n\nR\nA | B\n1 | A\n3 | B\n\nS\nA | B\n1 | A\n2 | B\n\nSELECT A FROM R\nUNION ALL\nSELECT A FROM S;", choices: ["1", "3, 2", "1, 3", "1, 3, 1, 2"], note: "UNION ALL 실행 결과 도표를 원본 페이지에서 판독" },
    "2023-2-63": { question: "다음 Python 프로그램이 실행되었을 때, 실행 결과는?\n\na = 100\nlist_data = ['a', 'b', 'c']\ndict_data = {'a': 90, 'b': 95}\nprint(list_data[0])\nprint(dict_data['a'])", choices: ["a, 90", "100, 90", "100, 100", "a, a"], note: "Python 출력 결과 도표를 원본 페이지에서 판독" },
    "2023-3-48": { question: "DBA가 사용자 PARK에게 테이블 STUDENT의 데이터를 갱신할 수 있는 권한을 부여하려고 한다. 다음 SQL문의 빈칸에 들어갈 내용으로 옳은 것은?\n\nGRANT ㉠ ㉡ STUDENT TO PARK;", choices: ["㉠ INSERT, ㉡ INTO", "㉠ ALTER, ㉡ TO", "㉠ UPDATE, ㉡ ON", "㉠ REPLACE, ㉡ IN"] },
    "2023-3-75": { choices: ["A, B, C 출력이 반복된다.", "A, B, C", "A, B, C, D 출력이 반복된다.", "A, B, C, D까지만 출력된다."] },
    "2025-3-6": { question: "N-S(Nassi-Schneiderman) Chart에 대한 설명으로 거리가 먼 것은?", choices: ["논리의 기술에 중점을 둔 도형식 표현 방법이다.", "연속, 선택 및 다중 선택, 반복 등의 제어 논리 구조로 표현한다.", "주로 화살표를 사용하여 논리적인 제어 구조로 흐름을 표현한다.", "조건이 복합되어 있는 곳의 처리를 시각적으로 명확히 식별하는 데 적합하다."] },
    "2025-3-91": { question: "인증의 유형 중에서 패스워드를 사용하는 경우에 해당하는 인증 유형은?", choices: ["Something You Have", "Something You Are", "Something You Know", "Somewhere You Are"], note: "원본 PDF는 네 번째 선택지 기호도 ③으로 인쇄됨" },
    "2024-1-51": { question: "다음 릴레이션의 카디널리티와 차수가 옳게 나타난 것은?\n\n| 아이디 | 성명 | 나이 | 등급 | 적립금 | 가입 연도 |\n|---|---|---:|---:|---:|---:|\n| yuyu01 | 원유철 | 36 | 3 | 2000 | 2008 |\n| sykim10 | 김성일 | 29 | 2 | 3300 | 2014 |\n| kshan4 | 한경선 | 45 | 3 | 2800 | 2009 |\n| namsu52 | 이남수 | 33 | 5 | 1000 | 2016 |", choices: ["카디널리티: 4, 차수: 4", "카디널리티: 4, 차수: 6", "카디널리티: 6, 차수: 4", "카디널리티: 6, 차수: 6"] },
    "2024-1-48": { question: "다음 SQL문에서 빈칸에 들어갈 내용으로 옳은 것은?\n\nUPDATE 회원\n( ) 전화번호 = '010-14'\nWHERE 회원번호 = 'N4';", choices: ["FROM", "SET", "INTO", "TO"] },
    "2024-1-58": { question: "다음 [조건]에 부합하는 SQL문을 작성하고자 할 때, [SQL문]의 빈칸에 들어갈 내용으로 옳은 것은? (단, '팀코드' 및 '이름'은 속성이며, '직원'은 테이블이다.)\n\n[조건]\n이름이 '정도일'인 팀원이 소속된 팀코드를 이용하여 해당 팀에 소속된 팀원들의 이름을 출력하는 SQL문 작성\n\n[SQL문]\n\nSELECT 이름\nFROM 직원\nWHERE 팀코드 = ( );", choices: ["WHERE 이름 = '정도일'", "SELECT 팀코드 FROM 이름 WHERE 직원 = '정도일'", "WHERE 직원 = '정도일'", "SELECT 팀코드 FROM 직원 WHERE 이름 = '정도일'"] },
    "2024-3-47": { question: "DBA가 사용자 PARK에게 테이블 STUDENT의 데이터를 갱신할 수 있는 권한을 부여하려고 한다. 다음 SQL문의 빈칸에 들어갈 내용으로 옳은 것은?\n\nGRANT ㉠ ㉡ STUDENT TO PARK;", choices: ["㉠ INSERT, ㉡ INTO", "㉠ ALTER, ㉡ TO", "㉠ UPDATE, ㉡ ON", "㉠ REPLACE, ㉡ IN"] },
  };
  for (const [id, correction] of Object.entries(verified)) {
    const q = byId.get(id)!; if (correction.question) q.questionText = correction.question;
    choiceKeys.forEach((key, index) => { q.choices[key].normalized = correction.choices[index]; });
    q.needsReview = Boolean(correction.note); q.reviewReasons = correction.note ? [correction.note] : [];
  }
  // 텍스트·표·코드로 완전히 복원된 문항은 전체 페이지 이미지를 화면에
  // 중복 표시하지 않는다. 실제 도형 판독이 필요한 문항만 자산을 유지한다.
  for (const id of ["2022-2-57", "2022-2-60", "2022-2-65", "2023-1-46", "2023-2-63", "2023-3-48", "2023-3-75", "2024-1-48", "2024-1-58", "2024-3-47", "2025-2-56", "2025-2-76", "2025-3-65", "2025-3-91"]) {
    byId.get(id)!.assets = [];
  }
  const pythonQuestions: Record<string, string> = {
    "2022-1-77": "다음 Python 프로그램이 실행되었을 때, 실행 결과는?\n\na = 100\nlist_data = ['a', 'b', 'c']\ndict_data = {'a': 90, 'b': 95}\nprint(list_data[0])\nprint(dict_data['a'])",
    "2022-1-79": "다음 Python 프로그램이 실행되었을 때, 실행 결과는?\n\na = ['대', '한', '민', '국']\nfor i in a:\n    print(i)",
    "2022-2-65": "다음 Python 프로그램의 실행 결과가 [실행 결과]와 같을 때, 빈칸에 적합한 것은?\n\nx = 20\nif x == 10:\n    print('10')\n( ) x == 20:\n    print('20')\nelse:\n    print('other')\n\n[실행 결과]\n20",
    "2022-3-65": "다음 Python 코드에서 '53t44'를 입력했을 때 출력 결과는?\n\na, b = map(int, input().split('t'))\nprint(a, b)",
    "2023-1-80": "다음 Python 프로그램이 실행되었을 때, 실행 결과는?\n\na = 100\nlist_data = ['a', 'b', 'c']\ndict_data = {'a': 90, 'b': 95}\nprint(list_data[0])\nprint(dict_data['a'])",
    "2023-3-75": "다음은 Python으로 작성된 반복문이다. 실행 결과는?\n\nwhile True:\n    print('A')\n    print('B')\n    print('C')\n    continue\n    print('D')",
    "2025-1-65": "다음 Python 코드에서 '53t44'를 입력했을 때 출력 결과는?\n\na, b = map(int, input().split('t'))\nprint(a, b)",
    "2025-2-65": "다음 Python 프로그램이 실행되었을 때, 실행 결과는?\n\nstrA = 'Information Technology'\nstrL = list()\nfor i in range(0, len(strA), 2):\n    strL.append(strA[i])\nfor j in range(len(strL) - 1, 0, -2):\n    print(strL[j], end='')",
    "2025-2-76": "다음은 Python으로 작성된 반복문이다. 실행 결과는?\n\nwhile True:\n    print('A')\n    print('B')\n    break\n    print('C')\n    print('D')",
    "2025-3-65": "다음은 n각형을 화면에 그리는 프로그램을 Python으로 구현한 것이다. 괄호 (㉠~㉢)에 들어갈 알맞은 코드는?\n\nimport turtle\n\n(㉠) shape(distance, n):\n    t = turtle.Turtle()\n    for i in range(n):\n        t.(㉡)\n        t.(㉢)\n\nshape(100, 5)",
    "2025-3-73": "다음 Python 코드에서 '53t44'를 입력했을 때 출력 결과는?\n\na, b = map(int, input().split('t'))\nprint(a, b)",
  };
  for (const [id, text] of Object.entries(pythonQuestions)) byId.get(id)!.questionText = text;
  const q2025 = entries.find(({ data }) => data.year === 2025 && data.round === 1)!.data.questions;
  const replacements: [string, string][] = [
    ["사용사례", "사용 사례"], ["원시코드", "원시 코드"], ["수 행해", "수행해"],
    ["끌어 올리는", "끌어올리는"], ["개발 문서 보다는", "개발 문서보다는"],
    ["속성과 연산 식별 및", "속성과 연산을 식별하고"], ["다이어그램을 표시하는", "다이어그램으로 표시하는"],
    ["자료 사전 (DD: Data Dictionary)가", "자료 사전(DD: Data Dictionary)이"], ["높여야한다", "높여야 한다"],
    ["Use case Diagram", "Use Case Diagram"], ["오퍼레이션의 시스템의 구조 를", "오퍼레이션 등 시스템의 구조를"],
    ["동작순서", "동작 순서"], ["생산성을 높이는데", "생산성을 높이는 데"],
    ["요구 사항", "요구사항"], ["이 해도", "이해도"], ["객체 지향", "객체지향"],
    ["White Box Testing 에", "White Box Testing에"], ["Boundary Value Analysis 가", "Boundary Value Analysis가"],
    ["Source Code 의", "Source Code의"], ["진행 된다", "진행된다"], ["관리 (DRM) 기술", "관리(DRM) 기술"],
    ["라이센스", "라이선스"], ["“Selection Sort” 를", "‘Selection Sort’를"], ["PASS 3 의", "PASS 3의"],
    ["초기상태", "초기 상태"], ["Gradle 은", "Gradle은"], ["Jenkins 는 Groovy 를", "Jenkins는 Groovy를"],
    ["Hybrid 에", "Hybrid에"], ["Hub & Spoke 와 Message Bus 의", "Hub & Spoke와 Message Bus의"],
    ["point to point", "point-to-point"], ["서브루틴 호출 인터럽트 처리 수식 계산 및 수식 표기, 법", "서브루틴 호출, 인터럽트 처리, 수식 계산 및 수식 표기법"],
    ["노드 (Node) 와 선분 (Branch)", "노드(Node)와 선분(Branch)"], ["사이클 (Cycle) 이", "사이클(Cycle)이"],
    ["개발소스", "개발 소스"], ["상용제품 으로", "상용 제품으로"], ["버전관리", "버전 관리"], ["패키 징", "패키징"],
    ["주목적인 테스트 는", "주목적인 테스트는"], ["검증 (Verification) 과 확인 (Validation) 에 대 한", "검증(Verification)과 확인(Validation)에 대한"],
    ["기능 비기능 요구사항", "기능·비기능 요구사항"], ["얼마, 나", "얼마나"], ["측정하며 확인, 은", "측정하며, 확인은"],
    ["강도 (Stress) 테스트", "강도(Stress) 테스트"], ["응답하는 시간 특정 시간 내에, 처리하는 업무량 사용자 요구에", "응답하는 시간, 특정 시간 내에 처리하는 업무량, 사용자 요구에"],
    ["언어 (DCL) 의", "언어(DCL)의"], ["병행수행", "병행 수행"], ["로킹 (Locking) 단위", "로킹(Locking) 단위"],
    ["A → B 이고", "A → B이고"], ["SQL 의 분류 중 DDL 에", "SQL의 분류 중 DDL에"], ["로그 (log) 를", "로그(log)를"],
    ["타임 스탬프", "타임스탬프"], ["보장 받는", "보장받는"], ["차수 (Degree) 는", "차수(Degree)는"],
    ["사용자 X1 에게", "사용자 X1에게"], ["개체 관계 모델의 - E-R 다이어그램", "개체-관계 모델의 E-R 다이어그램"],
    ["선 – 개체 타입과", "선 - 개체 타입과"], ["3NF 에서 BCNF 가", "3NF에서 BCNF가"], ["뷰 (VIEW) 에", "뷰(VIEW)에"],
    ["삽입 갱신 삭제", "삽입·갱신·삭제"], ["제약사항", "제약 사항"], ["가입년도", "가입 연도"],
    ["SQL 문에서", "SQL문에서"], ["SQL 문", "SQL문"], ["‘ 홍길동 ’", "'홍길동'"],
    ["규정 (Integrity Rule) 과", "규정(Integrity Rule)과"], ["제약 조건 규정을 참조, 할 때", "제약 조건, 규정을 참조할 때"],
    ["규정 (Relation Integrity Rules) 은", "규정(Relation Integrity Rules)은"], ["처리 비용 이", "처리 비용이"],
    ["IP 주소체계", "IP 주소 체계"], ["손쉽 게", "손쉽게"], ["유니캐스트 (Unicast)를", "유니캐스트(Unicast)를"],
    ["우선 순위", "우선순위"], ["흐름 제어 (Flow Control) 에", "흐름 제어(Flow Control)에"],
    ["확인 신호 - (ACK) 를", "확인 신호(ACK)를"], ["응답 (NAK) 이", "응답(NAK)이"], ["7 계층", "7계층"],
    ["128.107.176.0/22 네트워크", "128.107.176.0/22인 네트워크"], ["디스크립터 (File Descriptor) 에", "디스크립터(File Descriptor)에"],
    ["블록 (File Control Block) 이라고", "블록(File Control Block)이라고"], ["개방 (open) 되면", "개방(open)되면"],
    ["문자 변환함수", "문자 변환 함수"], ["문자 열", "문자열"], ["송 수신, · ·", "송·수신"], ["전파하 거나", "전파하거나"],
    ["규모 인력 등의 요소를 기반으로 개발에 필요한, 비용", "규모, 인력 등의 요소를 기반으로 개발에 필요한 비용"],
    ["상향식 하향식 혼합식 기법이, 있다", "상향식, 하향식, 혼합식 기법이 있다"],
    ["프로젝트 요소 자원 요소 생, 산성 요소", "프로젝트 요소, 자원 요소, 생산성 요소"],
    ["실행 환경 개발 환경 서비스 환경 운영 환경으로, 구성", "실행 환경, 개발 환경, 서비스 환경, 운영 환경으로 구성"],
    ["최대 홉수를 15 로", "최대 홉 수를 15로"], ["소작업 별로", "소작업별로"], ["한 눈에", "한눈에"],
    ["나선형 (Spiral) 모형", "나선형(Spiral) 모형"], ["운영체제 나", "운영체제나"],
    ["강제 접근통제 (MAC) 의", "강제 접근 통제(MAC)의"], ["서로 이해 충돌 관계", "서로 이익 충돌 관계"],
    ["클락 윌슨 무결성 모델 - (Clark-Wilson Integrity Model)", "클락-윌슨 무결성 모델(Clark-Wilson Integrity Model)"],
    ["진행하여 야", "진행하여야"], ["산출 물", "산출물"], ["프로젝 트", "프로젝트"], ["문제점으 로", "문제점으로"],
    ["해쉬값", "해시값"], ["해쉬", "해시"], ["함수 (One-way function) 이다", "함수(One-way Function)이다"],
    ["조각화 된", "조각화된"], ["한정 된", "한정된"], ["서비 스", "서비스"],
    ["이 러한", "이러한"], ["않더라 도", "않더라도"], ["에서 는", "에서는"], ["사 용한다", "사용한다"],
    ["작 업이다", "작업이다"], ["정 상적으로", "정상적으로"], ["모 두", "모두"], ["갱 신으로부터", "갱신으로부터"],
    ["릴레이션 을", "릴레이션을"], ["패 킷을", "패킷을"], ["보조기 억장치로", "보조기억장치로"],
    ["문자 열로", "문자열로"], ["있 도록", "있도록"], ["체계이 며", "체계이며"], ["이용하 여", "이용하여"],
    ["다양 한", "다양한"],
    ["여긴 다", "여긴다"], ["처리하 여", "처리하여"], ["기대 하는", "기대하는"], ["오라 클", "오라클"],
    ["폭포 수", "폭포수"], ["최 소화", "최소화"], ["장 거리", "장거리"], ["여 러", "여러"],
    ["토 큰", "토큰"], ["움직 임", "움직임"], ["개 념", "개념"], ["작 업", "작업"], ["공 간", "공간"],
    ["페이지 들", "페이지들"], ["PC 급", "PC급"], ["추진하면 서", "추진하면서"], ["명령 어", "명령어"],
    ["검 사", "검사"], ["형성 한다", "형성한다"], ["저장 하고", "저장하고"], ["나 타낼", "나타낼"],
    ["3가 지", "3가지"], ["예 시", "예시"], ["장 ٠ 단점", "장·단점"], ["순 차", "순차"],
    ["특 성", "특성"], ["함 수", "함수"], ["아 니면", "아니면"], ["제거된 다", "제거된다"],
    ["크래 커", "크래커"], ["사이 버", "사이버"], ["잠그거 나", "잠그거나"], ["가정 하여", "가정하여"],
    ["해 준다", "해준다"], ["삭 제", "삭제"], ["불필 요한", "불필요한"], ["처 리", "처리"],
    ["활 용", "활용"], ["대 표적", "대표적"], ["종 속", "종속"], ["나타 내", "나타내"],
    ["정규 형", "정규형"], ["절차 형", "절차형"], ["최 적", "최적"], ["안 전", "안전"],
    ["보헴 이", "보헴이"], ["의 견", "의견"], ["이 해도", "이해도"], ["라이 센스", "라이선스"],
    ["가 치", "가치"], ["접 속", "접속"], ["세 분화", "세분화"], ["통신환 경", "통신 환경"],
    ["흘려보 내", "흘려보내"], ["유발 한다", "유발한다"], ["마이크로 소프트 사", "마이크로소프트사"],
    ["피 보나치", "피보나치"], ["최종결과물", "최종 결과물"], ["샘플코드", "샘플 코드"],
    ["데이터개체", "데이터 개체"], ["고려없이", "고려 없이"], ["원상 복귀 시키는", "원상 복귀시키는"],
    ["스케쥴링", "스케줄링"], ["해시키라 고", "해시키라고"], ["검색하거 나", "검색하거나"],
    ["향상시 키는", "향상시키는"], ["권한보 다", "권한보다"], ["쓰기가가 능하지만", "쓰기가 가능하지만"],
  ];
  const normalize2025 = (value: string) => replacements.reduce((text, [from, to]) => text.split(from).join(to), value);
  for (const q of q2025) {
    if (!q.isCode && q.questionNo !== 92) q.questionText = q.questionText.replace(/\s*\n\s*/g, " ");
    q.questionText = normalize2025(q.questionText);
    for (const key of choiceKeys) q.choices[key].normalized = normalize2025(q.choices[key].normalized.replace(/\s*\n\s*/g, " "));
  }
  const q5 = q2025.find((q) => q.questionNo === 5)!; q5.correctAnswer = "B"; q5.originalAnswerText = "④"; q5.needsReview = true; q5.reviewReasons = ["사용자 검토에 따라 정답 B로 교정; 원본 정답표는 ④"];
  q2025.find((q) => q.questionNo === 21)!.choices.C.normalized = "Valgrind";
  const nonCode = new Set([1, 3, 8, 9, 17, 19, 21, 29, 40, 42, 82]); q2025.forEach((q) => { if (nonCode.has(q.questionNo)) q.isCode = false; });
  q2025.find((q) => q.questionNo === 52)!.questionText = "다음 릴레이션의 카디널리티와 차수가 옳게 나타난 것은?\n\n| 아이디 | 성명 | 나이 | 등급 | 적립금 | 가입 연도 |\n|---|---|---:|---:|---:|---:|\n| yuyu01 | 원유철 | 36 | 3 | 2000 | 2008 |\n| sykim10 | 김성일 | 29 | 2 | 3300 | 2014 |\n| kshan4 | 한경선 | 45 | 3 | 2800 | 2009 |\n| namsu52 | 이남수 | 33 | 5 | 1000 | 2016 |";
  q2025.find((q) => q.questionNo === 76)!.questionText = "다음과 같은 세그먼트 테이블을 가지는 시스템에서 논리 주소 (2, 176)에 대한 물리 주소는?\n\n| 세그먼트 번호 | 시작 주소 | 길이(바이트) |\n|---:|---:|---:|\n| 0 | 670 | 248 |\n| 1 | 1752 | 422 |\n| 2 | 222 | 198 |\n| 3 | 996 | 604 |";
  q2025.find((q) => q.questionNo === 92)!.questionText = "다음에서 설명하는 소프트웨어 정의 기술(SDx)은?\n\nㆍ가상화를 적용하여 필요한 공간만큼 나누어 사용할 수 있도록 하며, 서버 가상화와 유사함\nㆍ컴퓨팅 소프트웨어로 규정하는 데이터 스토리지 체계이며, 일정 조직 내 여러 스토리지를 하나처럼 관리하고 운용하는 컴퓨터 이용 환경\nㆍ스토리지 자원을 효율적으로 나누어 쓰는 방법으로 이해할 수 있음";
  q2025.find((q) => q.questionNo === 93)!.assets = [];
  q2025.find((q) => q.questionNo === 100)!.assets = [];
  const page2 = path.join("data", "imported", "2025", "1", "assets", "page-2.png");
  if (fs.existsSync(page2)) {
    const source = await loadImage(page2); const crop = createCanvas(170, 125); const context = crop.getContext("2d");
    context.fillStyle = "white"; context.fillRect(0, 0, 170, 125); context.drawImage(source, 480, 385, 170, 125, 0, 0, 170, 125);
    await writeFile(path.join(path.dirname(page2), "question-24-tree.png"), crop.toBuffer("image/png"));
    q2025.find((q) => q.questionNo === 24)!.assets = [{ type: "diagram", path: "assets/question-24-tree.png", pageNumber: 2, altText: "24번 트리 차수 문제의 원본 트리 그림" }];
  }
  for (const { data } of entries) for (const q of data.questions) {
    q.questionText = normalize2025(displayCleanup(normalize2025(q.questionText)));
    for (const key of choiceKeys) q.choices[key].normalized = normalize2025(displayCleanup(normalize2025(q.choices[key].normalized)));
    q.isCode = hasExecutableCode(q.questionText);
    const hasStructuredText = /\n\s*\|/.test(q.questionText)
      || /\n\s*(?:SELECT|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP|GRANT|REVOKE)\b/i.test(q.questionText);
    if (!q.isCode && !hasStructuredText) q.questionText = normalizeProseLayout(q.questionText);
    if (!q.isCode) for (const key of choiceKeys) q.choices[key].normalized = normalizeProseLayout(q.choices[key].normalized);
    q.normalizedHash = sha256Text(`${q.questionText}|${choiceKeys.map((key) => q.choices[key].normalized).join("|")}`);
  }

  // 원본 PDF 전수 대조로 확정한 문항별 교정은 일반 OCR 정리보다 뒤에
  // 적용한다. 그래야 코드 들여쓰기, 표, 수식처럼 의도적인 레이아웃이
  // 범용 공백 정리 규칙에 의해 다시 손상되지 않는다.
  const modularCorrections: Record<string, DisplayCorrection> = {
    ...corrections2022,
    ...corrections2023,
    ...corrections2024,
    ...corrections2025,
    ...presentationCorrections,
  };
  applyDisplayCorrections(byId, modularCorrections);

  for (const [questionNo, explanation] of Object.entries(explanations2022Round1)) {
    const question = byId.get(`2022-1-${questionNo}`);
    if (!question) throw new Error(`해설 대상 문항을 찾을 수 없음: 2022-1-${questionNo}`);
    question.explanation = explanation;
    question.explanationStatus = "verified";
    question.explanationSource = "authored";
  }
  for (const [questionNo, explanation] of Object.entries(explanations2022Round2)) {
    const question = byId.get(`2022-2-${questionNo}`);
    if (!question) throw new Error(`해설 대상 문항을 찾을 수 없음: 2022-2-${questionNo}`);
    question.explanation = explanation;
    question.explanationStatus = "verified";
    question.explanationSource = "authored";
  }
  for (const [questionNo, explanation] of Object.entries(explanations2022Round3)) {
    const question = byId.get(`2022-3-${questionNo}`);
    if (!question) throw new Error(`해설 대상 문항을 찾을 수 없음: 2022-3-${questionNo}`);
    question.explanation = explanation;
    question.explanationStatus = "verified";
    question.explanationSource = "authored";
  }
  for (const [questionNo, explanation] of Object.entries(explanations2023Round1)) {
    const question = byId.get(`2023-1-${questionNo}`);
    if (!question) throw new Error(`해설 대상 문항을 찾을 수 없음: 2023-1-${questionNo}`);
    question.explanation = explanation;
    question.explanationStatus = "verified";
    question.explanationSource = "authored";
  }
  for (const [questionNo, explanation] of Object.entries(explanations2023Round2)) {
    const question = byId.get(`2023-2-${questionNo}`);
    if (!question) throw new Error(`해설 대상 문항을 찾을 수 없음: 2023-2-${questionNo}`);
    question.explanation = explanation;
    question.explanationStatus = "verified";
    question.explanationSource = "authored";
  }
  for (const [questionNo, explanation] of Object.entries(explanations2023Round3)) {
    const question = byId.get(`2023-3-${questionNo}`);
    if (!question) throw new Error(`해설 대상 문항을 찾을 수 없음: 2023-3-${questionNo}`);
    question.explanation = explanation;
    question.explanationStatus = "verified";
    question.explanationSource = "authored";
  }
  for (const [questionNo, explanation] of Object.entries(explanations2024Round1)) {
    const question = byId.get(`2024-1-${questionNo}`);
    if (!question) throw new Error(`해설 대상 문항을 찾을 수 없음: 2024-1-${questionNo}`);
    question.explanation = explanation;
    question.explanationStatus = "verified";
    question.explanationSource = "authored";
  }
  for (const [questionNo, explanation] of Object.entries(explanations2024Round2)) {
    const question = byId.get(`2024-2-${questionNo}`);
    if (!question) throw new Error(`해설 대상 문항을 찾을 수 없음: 2024-2-${questionNo}`);
    question.explanation = explanation;
    question.explanationStatus = "verified";
    question.explanationSource = "authored";
  }
  for (const [questionNo, explanation] of Object.entries(explanations2024Round3)) {
    const question = byId.get(`2024-3-${questionNo}`);
    if (!question) throw new Error(`해설 대상 문항을 찾을 수 없음: 2024-3-${questionNo}`);
    question.explanation = explanation;
    question.explanationStatus = "verified";
    question.explanationSource = "authored";
  }
  for (const [questionNo, explanation] of Object.entries(explanations2025Round1)) {
    const question = byId.get(`2025-1-${questionNo}`);
    if (!question) throw new Error(`해설 대상 문항을 찾을 수 없음: 2025-1-${questionNo}`);
    question.explanation = explanation;
    question.explanationStatus = "verified";
    question.explanationSource = "authored";
  }
  for (const [questionNo, explanation] of Object.entries(explanations2025Round2)) {
    const question = byId.get(`2025-2-${questionNo}`);
    if (!question) throw new Error(`해설 대상 문항을 찾을 수 없음: 2025-2-${questionNo}`);
    question.explanation = explanation;
    question.explanationStatus = "verified";
    question.explanationSource = "authored";
  }
  for (const [questionNo, explanation] of Object.entries(explanations2025Round3)) {
    const question = byId.get(`2025-3-${questionNo}`);
    if (!question) throw new Error(`해설 대상 문항을 찾을 수 없음: 2025-3-${questionNo}`);
    question.explanation = explanation;
    question.explanationStatus = "verified";
    question.explanationSource = "authored";
  }

  // 같은 원문이 여러 회차에 다시 출제된 경우, 전수 대조로 복원된 표시
  // 텍스트를 아직 개별 교정이 없는 동일 문항에도 전달한다. original 필드는
  // 각 회차의 원문 그대로 두고 화면용 필드만 복사한다.
  const idByQuestion = new Map<ExamQuestion, string>();
  for (const [id, question] of byId) idByQuestion.set(question, id);
  const displayCorrectedIds = new Set(Object.entries(modularCorrections)
    .filter(([, correction]) => correction.questionText !== undefined || correction.choices !== undefined)
    .map(([id]) => id));
  for (const questions of groups.values()) {
    const source = questions.find((question) => displayCorrectedIds.has(idByQuestion.get(question) ?? ""));
    if (!source) continue;
    for (const target of questions) {
      const targetId = idByQuestion.get(target) ?? "";
      if (target === source || displayCorrectedIds.has(targetId)) continue;
      target.questionText = source.questionText;
      for (const key of choiceKeys) target.choices[key].normalized = source.choices[key].normalized;
      target.isCode = source.isCode;
      target.isSql = source.isSql;
    }
  }
  // 동일 문항 전파보다 개별 PDF 대조값이 항상 우선한다.
  applyDisplayCorrections(byId, modularCorrections);

  // 문항별 확정 교정이 다시 넣을 수 있는 PDF 자간 오류도 화면용 필드에만
  // 마지막으로 정리한다. originalQuestionText와 choices.*.original은 불변이다.
  for (const { data } of entries) for (const question of data.questions) {
    question.questionText = normalizeKoreanDisplaySpacing(question.questionText);
    for (const key of choiceKeys) {
      question.choices[key].normalized = normalizeKoreanDisplaySpacing(question.choices[key].normalized);
    }
  }

  // 텍스트로 완전히 복원된 코드와 SQL에는 전체 페이지 이미지를 중복해서
  // 노출하지 않는다. 실제 도형은 아래의 검증된 크롭으로 다시 연결한다.
  for (const { data } of entries) for (const question of data.questions) {
    if (question.isCode || question.isSql) {
      question.assets = [];
      question.hasImageReference = false;
    }
    question.normalizedHash = sha256Text(`${question.questionText}|${choiceKeys.map((key) => question.choices[key].normalized).join("|")}`);
  }

  const modularCrops: Record<string, ExamCrop> = { ...crops2022 };
  for (const crop of crops2023) modularCrops[crop.id] = {
    outputAsset: crop.outputPath,
    pageNumber: crop.pageNumber,
    type: crop.type,
    altText: crop.altText,
    x: crop.x,
    y: crop.y,
    width: crop.width,
    height: crop.height,
  };
  for (const crop of crops2024) modularCrops[crop.id] = {
    outputAsset: path.join("data", "imported", "2024", String(crop.round), "assets", crop.filename),
    pageNumber: crop.page,
    type: "diagram",
    altText: crop.altText,
    x: crop.x,
    y: crop.y,
    width: crop.width,
    height: crop.height,
  };
  for (const crop of crops2025) modularCrops[crop.id] = {
    outputAsset: path.join("data", "imported", "2025", String(crop.round), "assets", crop.filename),
    pageNumber: crop.page,
    type: "diagram",
    altText: crop.altText,
    x: crop.x,
    y: crop.y,
    width: crop.width,
    height: crop.height,
  };
  await applyExamCrops(byId, modularCrops);
  for (const { file, data } of entries) {
    const assetDir = path.join(path.dirname(file), "assets");
    const assetNames = await readdir(assetDir).catch(() => [] as string[]);
    for (const name of assetNames) {
      if (/^page-\d+\.png$/.test(name)) await unlink(path.join(assetDir, name));
    }
    await writeFile(file, JSON.stringify(data, null, 2) + "\n");
  }
  console.log(`반복 기출 교차 검증으로 화면 표시 ${repaired}문항 정규화`);
}

async function main() {
  const files = (await walk("source/past-exams")).filter((file) => file.toLowerCase().endsWith(".pdf")).sort((a, b) => a.normalize("NFC").localeCompare(b.normalize("NFC"), "ko"));
  const seen = new Set<string>();
  const reports = [];
  for (const file of files) {
    const id = examIdentity(path.basename(file));
    if (!id || seen.has(`${id.year}-${id.round}`)) continue;
    seen.add(`${id.year}-${id.round}`);
    reports.push(await extractExam(file));
  }
  await repairRepeatedQuestions();
  for (const report of reports) {
    const finalData = examSchema.parse(JSON.parse(fs.readFileSync(path.join("data", "imported", String(report.year), String(report.round), "questions.json"), "utf8")));
    console.log(`✓ ${report.year}년 ${report.round}회: ${finalData.questions.length}문항 / 정답 ${finalData.questions.filter((question) => question.correctAnswer).length} / 검토 ${finalData.questions.filter((question) => question.needsReview).length}`);
  }
  await extractStandards();
  console.log(`출제기준 2개와 기출 ${reports.length}회 추출 완료`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
