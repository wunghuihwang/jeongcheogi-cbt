import { cp, mkdir } from "node:fs/promises";
import path from "node:path";

async function main() {
  const standalone = path.join(".next", "standalone");
  await mkdir(path.join(standalone, ".next"), { recursive: true });
  await Promise.all([
    cp("public", path.join(standalone, "public"), { recursive: true, force: true }),
    cp(path.join(".next", "static"), path.join(standalone, ".next", "static"), { recursive: true, force: true }),
  ]);
  console.log("standalone 배포 자산 복사 완료");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
