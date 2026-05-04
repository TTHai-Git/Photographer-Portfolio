function buildImageUrl(
    publicId,
    {
        width,
        height,
        quality = "auto:eco",
        format = "auto",
    } = {}
) {
    const safeWidth = width || 800;

    const transforms = [
        height
            ? `c_fill,g_auto,w_${safeWidth},h_${height}`
            : `c_limit,w_${safeWidth}`,
        `f_${format}`,
        `q_${quality}`,
        "dpr_auto",
        "e_sharpen:30",
    ].join(",");

    return `https://res.cloudinary.com/${process.env.REACT_APP_CLOUD_NAME}/image/upload/${transforms}/${encodeURIComponent(publicId)}`;
}
export default buildImageUrl;