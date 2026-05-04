const CLOUDINARY_UPLOAD_PATH = "/image/upload/";

export const DEFAULT_PORTFOLIO_IMAGE_SIZE = {
  width: 1200,
  height: 1500
};

export const buildCloudinaryOptimizedUrl = (
  src,
  { width = DEFAULT_PORTFOLIO_IMAGE_SIZE.width, height = DEFAULT_PORTFOLIO_IMAGE_SIZE.height } = {}
) => {
  if (!src || !src.includes(CLOUDINARY_UPLOAD_PATH)) return src;

  const [prefix, suffix] = src.split(CLOUDINARY_UPLOAD_PATH);
  if (!prefix || !suffix) return src;

  const transformation = `f_auto,q_auto,c_fill,g_auto,w_${width},h_${height}`;
  return `${prefix}${CLOUDINARY_UPLOAD_PATH}${transformation}/${suffix}`;
};

export const getFixedAspectRatio = (
  width = DEFAULT_PORTFOLIO_IMAGE_SIZE.width,
  height = DEFAULT_PORTFOLIO_IMAGE_SIZE.height
) => `${width} / ${height}`;
