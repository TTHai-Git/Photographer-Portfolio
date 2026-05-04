function buildImageUrl(publicId, { width, quality = "auto", format = "auto" } = {}) {
    const transforms = [
        "c_fill",
        "g_auto",
        `f_${format}`,
        `q_${quality}`,
        width ? `w_${width}` : null,
    ]
        .filter(Boolean)
        .join(",");

    return `https://res.cloudinary.com/${process.env.REACT_APP_CLOUD_NAME}/image/upload/${transforms}/${publicId}`;
}
export default buildImageUrl;