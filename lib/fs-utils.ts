import { createHash } from "node:crypto";
import { createReadStream } from "node:fs";
import { readdir, stat } from "node:fs/promises";
import path from "node:path";

export async function walk(root: string): Promise<string[]> {
  const result: string[] = [];
  for (const name of await readdir(root)) {
    const full = path.join(root, name);
    const info = await stat(full);
    if (info.isDirectory()) result.push(...(await walk(full)));
    else result.push(full);
  }
  return result;
}

export async function sha256File(file: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const hash = createHash("sha256");
    createReadStream(file).on("data", (chunk) => hash.update(chunk)).on("error", reject).on("end", () => resolve(hash.digest("hex")));
  });
}

export function sha256Text(value: string): string {
  return createHash("sha256").update(value.normalize("NFC")).digest("hex");
}

export function examIdentity(filename: string): { year: number; round: number } | null {
  const name = filename.normalize("NFC");
  const match = name.match(/(202[2-5])\s*년?\s*([123])\s*회/);
  return match ? { year: Number(match[1]), round: Number(match[2]) } : null;
}
