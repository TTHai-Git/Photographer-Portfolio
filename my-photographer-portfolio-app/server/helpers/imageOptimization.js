/**
 * Image Optimization Helper
 * Supports multiple image formats and provides optimization strategies
 * Optimizes for best quality but smallest file size
 */

// Định dạng ảnh được hỗ trợ
export const SUPPORTED_IMAGE_FORMATS = {
  jpg: {
    mime: "image/jpeg",
    extension: "jpg",
    quality: "auto",
    optimized: "webp",
    description: "JPEG - Tương thích tốt nhất, phù hợp cho ảnh photo",
  },
  jpeg: {
    mime: "image/jpeg",
    extension: "jpeg",
    quality: "auto",
    optimized: "webp",
    description: "JPEG - Tương thích tốt nhất, phù hợp cho ảnh photo",
  },
  png: {
    mime: "image/png",
    extension: "png",
    quality: "auto",
    optimized: "webp",
    description: "PNG - Có alpha channel, phù hợp cho graphic",
  },
  webp: {
    mime: "image/webp",
    extension: "webp",
    quality: "auto",
    optimized: "webp",
    description: "WebP - Tối ưu nhất cho web, file nhẹ nhất",
  },
  avif: {
    mime: "image/avif",
    extension: "avif",
    quality: "auto",
    optimized: "avif",
    description: "AVIF - Hiện đại nhất, compression tốt nhất",
  },
  gif: {
    mime: "image/gif",
    extension: "gif",
    quality: "auto",
    optimized: "webp",
    description: "GIF - Ảnh động",
  },
  tiff: {
    mime: "image/tiff",
    extension: "tiff",
    quality: "auto",
    optimized: "webp",
    description: "TIFF - Chất lượng cao, file nặng",
  },
  bmp: {
    mime: "image/bmp",
    extension: "bmp",
    quality: "auto",
    optimized: "webp",
    description: "BMP - Định dạng cũ, không nén",
  },
  ico: {
    mime: "image/x-icon",
    extension: "ico",
    quality: "auto",
    optimized: "webp",
    description: "ICO - Icon định dạng",
  },
  svg: {
    mime: "image/svg+xml",
    extension: "svg",
    quality: "auto",
    optimized: "svg",
    description: "SVG - Vector format, scalable",
  },
};

/**
 * Lấy thông tin định dạng ảnh
 * @param {string} filename - Tên file ảnh
 * @returns {object|null} - Thông tin định dạng hoặc null
 */
export const getImageFormatInfo = (filename) => {
  const ext = filename.split(".").pop().toLowerCase();
  return SUPPORTED_IMAGE_FORMATS[ext] || null;
};

/**
 * Kiểm tra file ảnh có hợp lệ không
 * @param {string} filename - Tên file ảnh
 * @returns {boolean} - True nếu định dạng được hỗ trợ
 */
export const isValidImageFormat = (filename) => {
  return getImageFormatInfo(filename) !== null;
};

/**
 * Lấy các tham số tối ưu hóa Cloudinary cho ảnh
 * Mục tiêu: Chất lượng tốt nhất nhưng file nhẹ nhất
 * @param {string} format - Định dạng ảnh (jpg, png, webp, etc)
 * @returns {object} - Các tham số cấu hình
 */
export const getCloudinaryOptimizationParams = (format = "auto") => {
  return {
    // Chất lượng & Compression
    quality: "auto", // Tự động điều chỉnh chất lượng dựa trên thiết bị
    fetch_format: "auto", // Tự động convert sang WebP/AVIF nếu browser hỗ trợ
    format: "auto", // Tự động chọn định dạng tốt nhất

    // Responsiveness
    dpr: "auto", // Tự động điều chỉnh theo pixel density (1x, 2x, 3x)
    responsive_width: true, // Tự động responsive

    // Layout
    aspect_ratio: "preserve", // Giữ nguyên tỷ lệ

    // Performance
    delay: "progressive", // Progressive encoding untuk JPG
    interlace: "true", // Interlace untuk PNG/GIF
    flags: ["immutable"], // Cache các ảnh đã optimize
  };
};

/**
 * Tạo URL ảnh tối ưu với các tham số transformation
 * @param {string} publicId - Public ID của ảnh trên Cloudinary
 * @param {object} cloudinary - Cloudinary instance (nếu có)
 * @returns {object} - URL và các biến CSS cho responsive images
 */
export const getOptimizedImageUrl = (publicId, cloudinary = null) => {
  if (cloudinary) {
    return cloudinary.url(publicId, {
      quality: "auto",
      fetch_format: "auto",
      dpr: "auto",
    });
  }

  // Fallback nếu không có cloudinary instance
  return {
    url: publicId,
    srcset: `
      ${publicId}?q=auto&f=auto&w=320 320w,
      ${publicId}?q=auto&f=auto&w=640 640w,
      ${publicId}?q=auto&f=auto&w=1280 1280w,
      ${publicId}?q=auto&f=auto&w=1920 1920w
    `,
  };
};

/**
 * Tạo danh sách URL ảnh responsive cho srcset
 * @param {string} publicId - Public ID của ảnh
 * @param {array} widths - Danh sách chiều rộng (default: [320, 640, 1280, 1920])
 * @param {object} cloudinary - Cloudinary instance
 * @returns {object} - URL src và srcset cho img tag
 */
export const getResponsiveImageUrls = (
  publicId,
  widths = [320, 640, 1280, 1920],
  cloudinary = null,
) => {
  if (!cloudinary) {
    console.warn("Cloudinary instance not provided");
    return {
      src: publicId,
      srcset: "",
    };
  }

  const srcset = widths
    .map((width) => {
      const url = cloudinary.url(publicId, {
        width: width,
        quality: "auto",
        fetch_format: "auto",
        crop: "fill",
        gravity: "auto",
      });
      return `${url} ${width}w`;
    })
    .join(", ");

  return {
    src: cloudinary.url(publicId, {
      quality: "auto",
      fetch_format: "auto",
      width: 1280,
      crop: "fill",
      gravity: "auto",
    }),
    srcset: srcset,
  };
};

/**
 * Tạo thumbnail URL từ ảnh chính
 * @param {string} publicId - Public ID của ảnh
 * @param {number} size - Kích thước thumbnail (default: 200)
 * @param {object} cloudinary - Cloudinary instance
 * @returns {string} - URL thumbnail
 */
export const getThumbnailUrl = (publicId, size = 200, cloudinary = null) => {
  if (!cloudinary) {
    return publicId;
  }

  return cloudinary.url(publicId, {
    width: size,
    height: size,
    quality: "auto",
    fetch_format: "auto",
    crop: "fill",
    gravity: "auto",
  });
};

/**
 * Lấy cấu hình upload cho Cloudinary API
 * Bao gồm các tham số để tối ưu hóa ảnh khi upload
 * @returns {object} - Cấu hình FormData
 */
export const getUploadConfiguration = () => {
  return {
    // Transformation khi upload
    transformation: [
      {
        quality: "auto",
        fetch_format: "auto",
        dpr: "auto",
      },
    ],
    // Eager transformations - tạo các version đã optimize
    eager: [
      {
        quality: "auto",
        fetch_format: "auto",
        width: 1280,
        crop: "limit",
      },
      {
        quality: "auto",
        fetch_format: "auto",
        width: 640,
        crop: "limit",
      },
      {
        quality: "auto",
        fetch_format: "auto",
        width: 320,
        crop: "limit",
      },
    ],
  };
};

export default {
  SUPPORTED_IMAGE_FORMATS,
  getImageFormatInfo,
  isValidImageFormat,
  getCloudinaryOptimizationParams,
  getOptimizedImageUrl,
  getResponsiveImageUrls,
  getThumbnailUrl,
  getUploadConfiguration,
};
