import { readFile, writeFile } from "node:fs/promises";
import { createCanvas, loadImage } from "@napi-rs/canvas";

async function main() {
  const svg = await readFile("public/icon.svg", "utf8");
  const source = await loadImage(`data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`);

  for (const [filename, size] of [["icon-192.png", 192], ["icon-512.png", 512], ["icon-maskable-512.png", 512], ["apple-touch-icon.png", 180]] as const) {
    const canvas = createCanvas(size, size);
    const context = canvas.getContext("2d");
    context.fillStyle = "#17251f";
    context.fillRect(0, 0, size, size);
    context.drawImage(source, 0, 0, size, size);
    await writeFile(`public/${filename}`, canvas.toBuffer("image/png"));
  }

  console.log("PWA PNG 아이콘 4개 생성 완료");
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
