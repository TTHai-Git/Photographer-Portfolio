import sharp from "sharp";

/**
 * Nén ảnh xuống WebP + Resize nếu quá lớn + Remove EXIF + giữ dưới 10MB
 */
export const compressToWebp = async (buffer) => {
  const MAX_WIDTH = 2560;
  const MAX_HEIGHT = 2560;
  const MAX_SIZE = 10 * 1024 * 1024; // 10MB

  let quality = 90;

  // Load metadata để quyết định resize
  let pipeline = sharp(buffer);
  const metadata = await pipeline.metadata();

  // Resize nếu ảnh quá lớn
  if (metadata.width > MAX_WIDTH || metadata.height > MAX_HEIGHT) {
    pipeline = pipeline.resize({
      width: MAX_WIDTH,
      height: MAX_HEIGHT,
      fit: "inside",
      withoutEnlargement: true,
    });
  }

  // Loop giảm chất lượng cho đến khi < 10MB
  while (quality >= 40) {
    const output = await pipeline
      .webp({
        quality,
        effort: 6, // tối ưu cân bằng tốc độ / chất lượng
      })
      .toBuffer();

    if (output.length < MAX_SIZE) {
      return output;
    }

    quality -= 10; // giảm dần chất lượng mỗi vòng
  }

  throw new Error("Không thể nén ảnh xuống dưới 10MB.");
};
