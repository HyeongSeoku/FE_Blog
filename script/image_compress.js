import sharp from "sharp";
import fs from "fs";
import path from "path";

function getFileSizeInBytes(filePath) {
  const stats = fs.statSync(filePath);
  return stats.size;
}

async function getImageDimensions(filePath) {
  const image = sharp(filePath);
  const metadata = await image.metadata();
  return { width: metadata.width || 0, height: metadata.height || 0 };
}

async function compressImageToMaxSize(inputPath, outputPath, maxSizeInBytes) {
  try {
    let minQuality = 10;
    let maxQuality = 80;
    let fileSizeInBytes;
    let quality;

    const tempOutputPath = `${outputPath}-temp.jpg`;

    while (minQuality <= maxQuality) {
      quality = Math.floor((minQuality + maxQuality) / 2);

      await sharp(inputPath).jpeg({ quality }).toFile(tempOutputPath);

      fileSizeInBytes = getFileSizeInBytes(tempOutputPath);
      console.log(
        `Compressed file size: ${fileSizeInBytes} bytes at quality: ${quality}`,
      );

      if (fileSizeInBytes <= maxSizeInBytes) {
        minQuality = quality + 1;
      } else {
        maxQuality = quality - 1;
      }
    }

    await sharp(inputPath).jpeg({ quality: maxQuality }).toFile(outputPath);

    fs.unlinkSync(tempOutputPath);

    console.log(
      `Final compressed image saved to ${outputPath} with quality: ${maxQuality}`,
    );
  } catch (err) {
    console.error(`Error compressing image: ${err}`);
  }
}

async function compressImagesInDirectory(dir, outDir, maxSizeInBytes) {
  try {
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
    }

    const files = fs.readdirSync(dir);

    await Promise.all(
      files.map(async (file) => {
        const inputPath = path.join(dir, file);
        const outputFileName = `compressed-${file}`;
        const outputPath = path.join(outDir, outputFileName);

        if (
          [".jpg", ".jpeg", ".png"].includes(path.extname(file).toLowerCase())
        ) {
          const fileSizeInBytes = getFileSizeInBytes(inputPath);
          const { width, height } = await getImageDimensions(inputPath);

          // 해상도 조정 (필요할 경우)
          const resizedPath = `${outputPath}-resized.jpg`;
          if (width > 2000 || height > 2000) {
            await sharp(inputPath)
              .resize(2000, 2000, { fit: "inside" })
              .toFile(resizedPath);
            await compressImageToMaxSize(
              resizedPath,
              outputPath,
              maxSizeInBytes,
            );
            fs.unlinkSync(resizedPath);
          } else if (fileSizeInBytes > maxSizeInBytes) {
            await compressImageToMaxSize(inputPath, outputPath, maxSizeInBytes);
          } else {
            console.log(
              `Skipping compression for ${inputPath}, file size and dimensions are within limits.`,
            );
          }
        }
      }),
    );
  } catch (err) {
    console.error(`Unable to scan directory: ${err}`);
  }
}

const directory = "./public/content-image";
const compressedDirectory = "./public/content-image/compressed";
const maxSizeInBytes = 1 * 1024 * 1024;

compressImagesInDirectory(directory, compressedDirectory, maxSizeInBytes);
