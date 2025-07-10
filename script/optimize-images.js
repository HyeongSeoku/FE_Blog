import fs from "fs";
import path from "path";
import sharp from "sharp";

sharp.concurrency(4); // 병렬 처리 설정

const MAX_SIZE_MB = 1; // 최대 1MB
const QUALITY = 80; // JPEG 품질
const MAX_WIDTH = 1920; // 최대 너비
const MAX_HEIGHT = 1080; // 최대 높이

const CONTENT_IMAGE_DIR = path.join(process.cwd(), "public/content-image");
const LOW_THUMBNAIL_DIR = path.join(process.cwd(), "public/low-thumbnail");

export const optimizeImage = async (filePath) => {
  const outputFilePath = filePath.replace(/\.\w+$/, ".jpeg"); // 확장자를 .jpeg로 변경

  try {
    // 파일 크기 확인
    const { size } = fs.statSync(filePath);
    const sizeMB = size / (1024 * 1024);

    // sharp 인스턴스 준비
    const imageSharp = sharp(filePath);

    // 이미지 메타데이터 확인
    const metadata = await imageSharp.metadata();
    const { width, height, format } = metadata;

    // 최적화 여부 판단
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

    // 최적화된 이미지 저장
    await imageSharp
      .resize({
        width: MAX_WIDTH,
        height: MAX_HEIGHT,
        fit: "inside",
      })
      .jpeg({ quality: QUALITY })
      .toFile(outputFilePath);

    // 썸네일 디렉터리 없으면 생성
    if (!fs.existsSync(LOW_THUMBNAIL_DIR)) {
      fs.mkdirSync(LOW_THUMBNAIL_DIR, { recursive: true });
    }

    // 썸네일 파일 경로 지정
    const lowThumbnailFilePath = path.join(
      LOW_THUMBNAIL_DIR,
      path.basename(outputFilePath),
    );

    // 썸네일 생성 (10x10)
    await imageSharp
      .clone()
      .resize(10, 10, { fit: "inside" })
      .jpeg({ quality: 40 })
      .toFile(lowThumbnailFilePath);

    console.log(`[INFO] 썸네일 저장 완료: ${lowThumbnailFilePath}`);

    // 마지막에 원본 삭제
    fs.unlinkSync(filePath);

    console.log(`[INFO] 최적화 완료 및 JPEG로 변환: ${outputFilePath}`);
  } catch (error) {
    console.error(
      `[ERROR] 최적화 중 오류 발생: ${filePath} - ${error.message}`,
    );
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
