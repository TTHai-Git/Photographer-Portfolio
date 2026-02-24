/* eslint-env worker */
/* eslint-disable no-restricted-globals */

self.onmessage = async (e) => {
  const { requestId, file, maxBytes, maxWidthOrHeight } = e.data;

  try {
    const imgBitmap = await createImageBitmap(file);

    let { width, height } = imgBitmap;
    const maxDim = Math.max(width, height);

    if (maxDim > maxWidthOrHeight) {
      const ratio = maxWidthOrHeight / maxDim;
      width *= ratio;
      height *= ratio;
    }

    const canvas = new OffscreenCanvas(width, height);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(imgBitmap, 0, 0, width, height);

    let quality = 0.9;
    let blob = await canvas.convertToBlob({
      type: "image/webp",
      quality,
    });

    while (blob.size > maxBytes && quality > 0.4) {
      quality -= 0.1;
      blob = await canvas.convertToBlob({
        type: "image/webp",
        quality,
      });
    }

    self.postMessage({ requestId, success: true, blob });
  } catch (err) {
    console.error("Worker error:", err);
    self.postMessage({ requestId, success: false, error: err.message });
  }
};
