import fs from "node:fs";
import path from "node:path";
import { examSchema } from "../lib/exam-schema";

type Finding = { year: number; round: number; questionNo: number; field: string; reason: string; excerpt: string };
const findings: Finding[] = [];
const looksExecutable = (text: string) => /#include\s*</.test(text)
  || /\bpublic\s+class\s+\w+/.test(text)
  || /\b(?:int|void)\s+main\s*\(/.test(text)
  || /(?:^|\n\n)\s*(?:int|char|float|double|String)\s+\w+/m.test(text)
  || /\b(?:printf|scanf|System\.out)\s*\.?\w*\s*\(/.test(text)
  || /<\?php/i.test(text)
  || /(?:^|\n\n)\s*P\(S\)\s*:/m.test(text)
  || /(?:^|\n\n)\s*[a-zA-Z_]\w*\s*(?:<|>|==|!=|<<|>>|&&|\|\|)/m.test(text)
  || (/\b(?:Python|파이썬)\b/i.test(text) && /(?:^|\n)\s*(?:import\s+\w+|[a-zA-Z_]\w*\s*=|[a-zA-Z_]\w*\s*,\s*[a-zA-Z_]\w*\s*=|for\s+\w+\s+in\s+|while\s+[^\n]+:|print\s*\()/m.test(text));
for (let year = 2022; year <= 2025; year++) for (let round = 1; round <= 3; round++) {
  const exam = examSchema.parse(JSON.parse(fs.readFileSync(`data/imported/${year}/${round}/questions.json`, "utf8")));
  const assetDir = `data/imported/${year}/${round}/assets`;
  if (fs.existsSync(assetDir)) for (const name of fs.readdirSync(assetDir)) {
    if (/^page-\d+\.png$/.test(name)) findings.push({ year, round, questionNo: 0, field: "assets", reason: "미참조 전체 페이지 이미지 잔존", excerpt: name });
  }
  for (const q of exam.questions) {
    const fields = [["question", q.questionText], ...Object.entries(q.choices).map(([key, value]) => [`choice_${key}`, value.normalized])] as const;
    for (const [field, text] of fields) {
      const rules: [RegExp, string][] = [
        [/기출문제\s*&\s*정답|저작권\s*안내|제\s*(?:(?:[1-5]\s*)?과목|과목\s*[1-5]?)/, "문서 머리말 유입"],
        [/,\.|\.\?|\?\.|,{2,}/, "문장부호 순서 이상"],
        [/\(\s*,|,\s*[가-힣A-Za-z]+\s+(?:으로|로).*\s+\)/, "괄호/열거 순서 이상"],
        [/[①②③④]/, "본문/선택지에 선택지 기호 잔존"],
        [/\[원본 PDF의/, "대체 문구 잔존"],
        [/[\uE000-\uF8FF]/, "PDF 전용 글리프(PUA) 잔존"],
        [/[０-９Ａ-Ｚａ-ｚ]/, "전각 영숫자 잔존"],
        [/(?:소\s+프\s*트웨어|데\s+이\s*터|시스\s+템|프로젝\s+트|프\s+로그램|모델\s+링|릴레\s+이션|프로세\s+스|인터페이\s+스|서비\s+스|페이\s+지|산출\s+물|최\s+소화|통신환\s+경)/, "어절 내부 분리"],
        [/[가-힣],\s*(?:다|여|도|수|어야|지만)(?![가-힣])/, "줄 끝 쉼표/어미 분리"],
        [/\b(?:GUKGraphical|CLKCommand|valMeter|valance|Thrasing|Machine Leaming|ARO)\b/i, "확정 OCR 철자 오류"],
        [/(?:스케쥴|맴리스터|Recog\s+nition|메타\s+데이터)/i, "확정 표기 오류"],
        [/DON’T|[\uFF01-\uFF5E]/, "코드/연산자 유니코드 OCR 오류"],
        [/(?:평가 절차 모델[ \t]+인|데이터링크 계층|호출[ \t]+하는|저장[ \t]+한다|작[ \t]+업이다|암호화[ \t]+된다|해당[ \t]+하지|3[ \t]+대 요소|사용[ \t]+자들에게|대응[ \t]+한다|자유[ \t]+로운|형[ \t]+태의|전[ \t]+송하는|명시[ \t]+한다|설계[ \t]+된|기술[ \t]+이다|무엇[ \t]+인지|제공[ \t]+되는|것[ \t]+이다|애튜리뷰트|부여[ \t]+하는|작업[ \t]+할|제[ \t]+[1-9][ \t]+정규형|알고 있어이[ \t]+를)/, "확정 단어/어미 분절"],
        [/C언어|\bJAVA(?:\s+Script)?\b|IP주소/, "영문 기술 용어 표기 불일치"],
        [/(?:1대[ \t]+1|1대[ \t]+다|다대[ \t]+다|10000[ \t]+라인|25[ \t]+번)/, "숫자/단위 표기 불일치"],
        [/가장거리가|[가-힣]적\s+인(?:[\s,.?!:;)]|$)|[가-힣]으\s+로(?:[\s,.?!:;)]|$)|의[ \t]+미한다|언어\s+이다(?:[\s,.?!:;)]|$)/, "확정 PDF 자간 오류"],
        [/([가-힣])[ \t]+(?:에게|에서|으로|까지|은|는|이|가|을|를|의|와|과|로|만|도)(?=[ \t,.?!:;)\]}]|$)/, "한글 뒤 조사/어미 띄어쓰기"],
        [/([A-Za-z0-9)\]])\s+(?:은|는|이|가|을|를|의|에서|보다|에|와|과|로|까지만|까지|만|도)(?=[\s,.?!:;)\]}]|$)/, "영문/괄호 뒤 조사 띄어쓰기"],
        [/(?:^|\n)\s*[123]\s*회\s*$/m, "회차 꼬리말 유입"],
      ];
      for (const [pattern, reason] of rules) if (pattern.test(text)) findings.push({ year, round, questionNo: q.questionNo, field, reason, excerpt: text.slice(0, 240).replace(/\n/g, " ") });
      if (field.startsWith("choice") && text.length > 180 && !q.isCode) findings.push({ year, round, questionNo: q.questionNo, field, reason: "선택지 길이 이상", excerpt: text.slice(0, 240).replace(/\n/g, " ") });
    }
    if (!q.isCode && looksExecutable(q.questionText)) findings.push({ year, round, questionNo: q.questionNo, field: "isCode", reason: "실행 코드인데 일반 문항으로 분류됨", excerpt: q.questionText.slice(0, 240).replace(/\n/g, " ") });
    if (q.isCode && !looksExecutable(q.questionText) && !/\n\n[\s\S]*(?:[{};]|:=|\(.*\)|\b(?:break|continue|return)\b)/.test(q.questionText)) findings.push({ year, round, questionNo: q.questionNo, field: "isCode", reason: "코드 분류 근거가 없음", excerpt: q.questionText.slice(0, 240).replace(/\n/g, " ") });
    if ((q.isCode || q.isSql) && q.assets.length) findings.push({ year, round, questionNo: q.questionNo, field: "assets", reason: "복원된 코드/SQL과 전체 페이지 이미지 중복", excerpt: q.assets.map((asset) => asset.path).join(", ") });
    if (q.assets.some((asset) => asset.type === "source_page")) findings.push({ year, round, questionNo: q.questionNo, field: "assets", reason: "전체 페이지 이미지가 크롭되지 않음", excerpt: q.assets.map((asset) => asset.path).join(", ") });
    if (q.hasImageReference !== (q.assets.length > 0)) findings.push({ year, round, questionNo: q.questionNo, field: "hasImageReference", reason: "이미지 참조 플래그와 자산 연결 불일치", excerpt: q.assets.map((asset) => asset.path).join(", ") || "자산 없음" });
    for (const asset of q.assets) {
      const assetFile = path.join("data", "imported", String(year), String(round), asset.path);
      if (!fs.existsSync(assetFile)) findings.push({ year, round, questionNo: q.questionNo, field: "assets", reason: "자산 파일 누락", excerpt: asset.path });
    }
    if (!q.isCode && !q.isSql && /\n/.test(q.questionText) && !/\n\n/.test(q.questionText)) findings.push({ year, round, questionNo: q.questionNo, field: "question", reason: "일반 문장의 강제 줄바꿈 잔존", excerpt: q.questionText.slice(0, 240).replace(/\n/g, " ") });
    if (!q.questionText.includes("\n\n") && /\?\s+\S/s.test(q.questionText)) findings.push({ year, round, questionNo: q.questionNo, field: "question", reason: "메인 질문 뒤 보조 설명/조건 경계 누락", excerpt: q.questionText.slice(0, 240).replace(/\n/g, " ") });
    if (q.isCode && /[“”]/.test(q.questionText)) findings.push({ year, round, questionNo: q.questionNo, field: "question", reason: "코드에 스마트 따옴표 잔존", excerpt: q.questionText.slice(0, 240).replace(/\n/g, " ") });
    if (q.isCode && /[{};]/.test(q.questionText) && !/\n\s+[^\n]/.test(q.questionText)) findings.push({ year, round, questionNo: q.questionNo, field: "question", reason: "중괄호 코드 들여쓰기/줄바꿈 손상", excerpt: q.questionText.slice(0, 240).replace(/\n/g, " ") });
    if (/\b(?:Python|파이썬)\b/i.test(q.questionText)) {
      const lines = q.questionText.split("\n");
      for (let index = 0; index < lines.length - 1; index++) if (/^\s*(?:def|for|while|if|elif|else).*:\s*$/.test(lines[index]) && lines[index + 1].trim() && !/^\s{4,}\S/.test(lines[index + 1])) {
        findings.push({ year, round, questionNo: q.questionNo, field: "question", reason: "Python 블록 들여쓰기 손상", excerpt: q.questionText.slice(0, 240).replace(/\n/g, " ") }); break;
      }
      for (let index = 1; index < lines.length; index++) {
        const previous = lines[index - 1];
        const current = lines[index];
        if (/^\S/.test(previous) && /^ {4,}\S/.test(current) && !/[:([{\\]\s*$/.test(previous)) {
          findings.push({ year, round, questionNo: q.questionNo, field: "question", reason: "Python 최상위 행의 예기치 않은 들여쓰기", excerpt: q.questionText.slice(0, 240).replace(/\n/g, " ") }); break;
        }
      }
    }
  }
}
fs.mkdirSync("data/reports", { recursive: true });
fs.writeFileSync("data/reports/content-audit.json", JSON.stringify({ generatedAt: new Date().toISOString(), findings }, null, 2) + "\n");
console.log(`콘텐츠 이상 후보 ${findings.length}건`);
for (const f of findings) console.log(`${f.year}-${f.round} ${f.questionNo}번 ${f.field}: ${f.reason} — ${f.excerpt}`);
process.exitCode = findings.length ? 1 : 0;
