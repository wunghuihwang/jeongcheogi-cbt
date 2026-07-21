import { validateAll } from "./validate-exams";

validateAll().then((rows) => {
  console.log("| 연도 | 회차 | 문제 수 | 정답 수 | 이미지 문제 | 검토 필요 | 상태 |");
  console.log("|---:|---:|---:|---:|---:|---:|:---|");
  for (const r of rows) console.log(`| ${r.year} | ${r.round} | ${r.questions} | ${r.answers} | ${r.images} | ${r.review} | ${r.questions === 100 && !r.missing.length && !r.errors.length ? "통과" : "오류"} |`);
  const missing = rows.filter((r) => r.missing.length).map((r) => `${r.year}-${r.round}: ${r.missing.join(", ")}`);
  console.log(`\n누락 문제: ${missing.length ? missing.join(" / ") : "없음"}`);
  console.log(`총계: ${rows.reduce((n, r) => n + r.questions, 0)}문항 / 정답 ${rows.reduce((n, r) => n + r.answers, 0)} / 이미지 참조 ${rows.reduce((n, r) => n + r.images, 0)} / 검토 ${rows.reduce((n, r) => n + r.review, 0)}`);
});
