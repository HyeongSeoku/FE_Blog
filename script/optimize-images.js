import fs from "fs";
import fsp from "fs/promises";
import path from "path";
import sharp from "sharp";

sharp.concurrency(4);

const MAX_SIZE_MB = 1; // 원본이 1MB 초과면 재인코딩
const QUALITY = 80; // webp 품질
const MAX_WIDTH = 1920; // 최대 너비
const MAX_HEIGHT = 1080; // 최대 높이
const CONTENT_IMAGE_DIR = path.join(process.cwd(), "public/content-image");
const LOW_THUMBNAIL_DIR = path.join(process.cwd(), "public/low-thumbnail");

const SRC_EXT = /\.(jpe?g|png|webp|avif)$/i;

const NON_WEBP_EXT = /\.(jpe?g|png|avif)$/i;

const ensureDir = async (dir) => {
  if (!fs.existsSync(dir)) await fsp.mkdir(dir, { recursive: true });
};

const relFromContentRoot = (p) => path.relative(CONTENT_IMAGE_DIR, p);
const replaceToWebp = (p) => p.replace(/\.\w+$/, ".webp");

const optimizeToWebp = async (filePath) => {
  const rel = relFromContentRoot(filePath);
  const outWebp = path.join(CONTENT_IMAGE_DIR, replaceToWebp(rel));
  const outWebpDir = path.dirname(outWebp);
  await ensureDir(outWebpDir);

  const image = sharp(filePath);
  const meta = await image.metadata();
  const sizeMB = fs.statSync(filePath).size / (1024 * 1024);

  const isWebp = (meta.format || "").toLowerCase() === "webp";
  const shouldOptimize =
    !isWebp ||
    meta.width > MAX_WIDTH ||
    meta.height > MAX_HEIGHT ||
    sizeMB > MAX_SIZE_MB;

  if (!shouldOptimize) {
    // 이미 충분히 최적화된 webp면 low-thumbnail만 보장
    await writeLowThumb(filePath, rel);
    return { converted: false, deleted: false, out: outWebp };
  }

  console.log(
    `[INFO] optimize → webp: ${rel} (${meta.width}x${meta.height}, ${sizeMB.toFixed(2)}MB)`,
  );

  await image
    .rotate()
    .resize({
      width: MAX_WIDTH,
      height: MAX_HEIGHT,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: QUALITY, effort: 4 })
    .toFile(outWebp);

  await writeLowThumb(outWebp, rel, /*alreadyWebp*/ true);

  if (NON_WEBP_EXT.test(filePath)) {
    await fsp.unlink(filePath);
    return { converted: true, deleted: true, out: outWebp };
  }

  return { converted: true, deleted: false, out: outWebp };
};

const writeLowThumb = async (sourcePath, rel, alreadyWebp = false) => {
  // low-thumbnail/아래에 동일 폴더 구조 유지
  const lowRel = replaceToWebp(rel);
  const lowOut = path.join(LOW_THUMBNAIL_DIR, lowRel);
  await ensureDir(path.dirname(lowOut));

  const input = alreadyWebp ? sharp(sourcePath) : sharp(sourcePath);
  await input
    .clone()
    .resize(10, 10, { fit: "inside" })
    .webp({ quality: 40, effort: 1 })
    .toFile(lowOut);

  console.log(`[INFO] low-thumb saved: ${relFromContentRoot(lowOut)}`);
};

// 디렉터리 재귀 순회
const optimizeImagesInDir = async (dir) => {
  const entries = await fsp.readdir(dir, { withFileTypes: true });

  for (const e of entries) {
    const p = path.join(dir, e.name);

    if (e.isDirectory()) {
      await optimizeImagesInDir(p);
      continue;
    }

    if (!SRC_EXT.test(e.name)) continue;

    try {
      await optimizeToWebp(p);
    } catch (err) {
      console.error(`[ERROR] ${relFromContentRoot(p)} → ${err.message}`);
    }
  }
};

(async () => {
  console.log(`[INFO] start optimizing under: ${CONTENT_IMAGE_DIR}`);
  await ensureDir(CONTENT_IMAGE_DIR);
  await ensureDir(LOW_THUMBNAIL_DIR);
  await optimizeImagesInDir(CONTENT_IMAGE_DIR);
  console.log("[INFO] done.");
})();
