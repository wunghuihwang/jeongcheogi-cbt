import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { createCanvas, loadImage } from "@napi-rs/canvas";
import { walk } from "../lib/fs-utils";

async function main() {
  const files = (await walk("data/imported"))
    .filter((file) => /\/assets\/question-[^/]+\.png$/.test(file))
    .sort();
  const columns = 4;
  const cellWidth = 300;
  const cellHeight = 220;
  const rows = Math.ceil(files.length / columns);
  const canvas = createCanvas(columns * cellWidth, rows * cellHeight);
  const context = canvas.getContext("2d");
  context.fillStyle = "#e7e9e5";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.font = "12px sans-serif";

  for (const [index, file] of files.entries()) {
    const image = await loadImage(file);
    const column = index % columns;
    const row = Math.floor(index / columns);
    const x = column * cellWidth;
    const y = row * cellHeight;
    context.fillStyle = "white";
    context.fillRect(x + 5, y + 5, cellWidth - 10, cellHeight - 10);
    context.fillStyle = "#17251f";
    context.fillText(file.replace("data/imported/", ""), x + 12, y + 22);
    const scale = Math.min((cellWidth - 24) / image.width, (cellHeight - 48) / image.height, 1.5);
    context.drawImage(image, x + 12, y + 34, image.width * scale, image.height * scale);
  }

  await mkdir("data/reports", { recursive: true });
  const output = path.join("data", "reports", "crop-contact-sheet.png");
  await writeFile(output, canvas.toBuffer("image/png"));
  console.log(`${files.length}개 크롭 연락판 생성: ${output}`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
