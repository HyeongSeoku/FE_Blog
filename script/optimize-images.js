import fs from "fs";
import path from "path";
import sharp from "sharp";

sharp.concurrency(4); // 병렬 처리 설정

const MAX_SIZE_MB = 1; // 최대 1MB
const QUALITY = 80; // JPEG 품질
const MAX_WIDTH = 1920; // 최대 너비
const MAX_HEIGHT = 1080; // 최대 높이

const CONTENT_IMAGE_DIR = path.join(process.cwd(), "public/content-image");

// 이미지 최적화 함수
export const optimizeImage = async (filePath) => {
  const outputFilePath = filePath.replace(/\.\w+$/, ".jpeg"); // 확장자를 .jpeg로 변경

  try {
    // 파일 크기 확인
    const { size } = fs.statSync(filePath);
    const sizeMB = size / (1024 * 1024);

    // 이미지 메타데이터 확인
    const metadata = await sharp(filePath).metadata();
    const { width, height, format } = metadata;

    // 최적화 여부 확인
    const isJPEG = format === "jpeg";
    const shouldOptimize =
      !isJPEG ||
      width > MAX_WIDTH ||
      height > MAX_HEIGHT ||
      sizeMB > MAX_SIZE_MB;

    if (!shouldOptimize) {
      console.log(`[INFO] 이미 최적화된 파일입니다. 건너뜁니다: ${filePath}`);
      return;
    }

    console.log(
      `[INFO] 최적화 중: ${filePath} (${sizeMB.toFixed(2)} MB, ${width}x${height})`,
    );

    // 이미지 최적화 및 JPEG로 변환
    await sharp(filePath)
      .resize({
        width: MAX_WIDTH,
        height: MAX_HEIGHT,
        fit: "inside", // 비율 유지
      })
      .jpeg({ quality: QUALITY }) // JPEG 품질 설정
      .toFile(outputFilePath);

    // 원본 파일 삭제
    fs.unlinkSync(filePath);

    console.log(`[INFO] 최적화 완료 및 JPEG로 변환: ${outputFilePath}`);
  } catch (error) {
    console.error(`[INFO] 최적화 중 오류 발생: ${filePath} - ${error.message}`);
  }
};

// 디렉토리 내 모든 이미지 최적화
export const optimizeImagesInDir = async (dir) => {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);

    // 이미지 파일만 처리
    if (fs.statSync(filePath).isFile() && /\.(jpg|jpeg|png)$/i.test(file)) {
      await optimizeImage(filePath);
    }
  }
};

(async () => {
  console.log(`[INFO] ${CONTENT_IMAGE_DIR} 디렉터리에서 이미지 최적화 시작`);
  await optimizeImagesInDir(CONTENT_IMAGE_DIR);
  console.log("[INFO] 이미지 최적화 완료");
})();
