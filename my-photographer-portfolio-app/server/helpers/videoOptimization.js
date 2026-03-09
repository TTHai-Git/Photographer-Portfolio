/**
 * Video Optimization Helper
 * Supports multiple video formats and provides optimization strategies
 */

// Định dạng video được hỗ trợ
export const SUPPORTED_VIDEO_FORMATS = {
  mp4: {
    mime: "video/mp4",
    codec: "h264",
    container: "mp4",
    quality: "auto",
    bitrate: "auto",
    description: "H.264 video codec - Tương thích tốt nhất"
  },
  webm: {
    mime: "video/webm",
    codec: "vp8/vp9",
    container: "webm",
    quality: "auto",
    bitrate: "auto",
    description: "VP8/VP9 codec - Tối ưu cho web"
  },
  ogv: {
    mime: "video/ogg",
    codec: "theora",
    container: "ogg",
    quality: "auto",
    bitrate: "auto",
    description: "Theora codec - Mã nguồn mở"
  },
  mov: {
    mime: "video/quicktime",
    codec: "h264",
    container: "mov",
    quality: "auto",
    bitrate: "auto",
    description: "QuickTime format - iPhone/Mac"
  },
  avi: {
    mime: "video/x-msvideo",
    codec: "mpeg4",
    container: "avi",
    quality: "auto",
    bitrate: "auto",
    description: "AVI format - Định dạng cũ"
  },
  mkv: {
    mime: "video/x-matroska",
    codec: "h264",
    container: "matroska",
    quality: "auto",
    bitrate: "auto",
    description: "Matroska format - Chất lượng cao"
  },
  flv: {
    mime: "video/x-flv",
    codec: "h264",
    container: "flv",
    quality: "auto",
    bitrate: "auto",
    description: "Flash Video - Legacy format"
  },
  wmv: {
    mime: "video/x-ms-wmv",
    codec: "mpeg4",
    container: "wmv",
    quality: "auto",
    bitrate: "auto",
    description: "Windows Media Video"
  },
  m4v: {
    mime: "video/x-m4v",
    codec: "h264",
    container: "mp4",
    quality: "auto",
    bitrate: "auto",
    description: "MPEG-4 Video - iTunes compatible"
  },
  m3u8: {
    mime: "application/x-mpegURL",
    codec: "h264",
    container: "hls",
    quality: "auto",
    bitrate: "auto",
    description: "HLS Streaming format"
  }
};

/**
 * Lấy thông tin định dạng video
 * @param {string} filename - Tên file video
 * @returns {object|null} - Thông tin định dạng hoặc null
 */
export const getVideoFormatInfo = (filename) => {
  const ext = filename.split(".").pop().toLowerCase();
  return SUPPORTED_VIDEO_FORMATS[ext] || null;
};

/**
 * Kiểm tra file video có hợp lệ không
 * @param {string} filename - Tên file video
 * @returns {boolean} - True nếu định dạng được hỗ trợ
 */
export const isValidVideoFormat = (filename) => {
  return getVideoFormatInfo(filename) !== null;
};

/**
 * Lấy các tham số tối ưu hóa Cloudinary cho video
 * Mục tiêu: Chất lượng tốt nhất nhưng file nhẹ nhất
 * @returns {object} - Các tham số cấu hình
 */
export const getCloudinaryOptimizationParams = () => {
  return {
    quality: "auto", // Tự động điều chỉnh chất lượng dựa trên thiết bị
    bit_rate: "auto", // Tối ưu hóa bit rate tự động
    video_codec: "h264", // Codec tốt nhất cho compatibility
    audio_codec: "aac", // AAC codec cho âm thanh
    fetch_format: "auto", // Tự động chọn định dạng tốt nhất cho browser
    // Thêm các tham số để có file nhỏ hơn:
    aspect_ratio: "preserve" // Giữ nguyên tỷ lệ
    // Cloudinary sẽ tự động tối ưu hóa kích thước video khi được yêu cầu
  };
};

/**
 * Lấy các tham số transformation Cloudinary để phát video tối ưu
 * @param {string} publicId - Public ID của video trên Cloudinary
 * @returns {object} - Tham số transformation
 */
export const getVideoPlaybackTransformation = (publicId) => {
  return {
    // Tối ưu hóa cho phát lại
    fetch_format: "auto", // Tự động chọn định dạng tốt nhất
    quality: "auto", // Chất lượng tự động điều chỉnh
    default_image: "fetch_format:auto" // Poster image optimization
  };
};

/**
 * Tạo URL phát video tối ưu cho nhiều browser/device
 * @param {string} publicId - Public ID của video
 * @param {object} options - Các tùy chọn thêm
 * @returns {object} - Danh sách các URL định dạng khác nhau
 */
export const getMultiFormatPlaybackUrls = (publicId, cloudinary) => {
  if (!cloudinary) {
    console.warn("Cloudinary instance not provided");
    return {};
  }

  return {
    // MP4 - Tương thích tốt nhất
    mp4: cloudinary.url(publicId, {
      resource_type: "video",
      format: "mp4",
      quality: "auto",
      fetch_format: "auto"
    }),
    // WebM - Tối ưu cho web
    webm: cloudinary.url(publicId, {
      resource_type: "video",
      format: "webm",
      quality: "auto",
      fetch_format: "auto"
    }),
    // Phiên bản tối ưu chung
    default: cloudinary.url(publicId, {
      resource_type: "video",
      fetch_format: "auto",
      quality: "auto"
    })
  };
};

export default {
  SUPPORTED_VIDEO_FORMATS,
  getVideoFormatInfo,
  isValidVideoFormat,
  getCloudinaryOptimizationParams,
  getVideoPlaybackTransformation,
  getMultiFormatPlaybackUrls
};
