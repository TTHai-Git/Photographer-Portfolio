import { useRef, useEffect } from "react";

let requestCounter = 0;

export const useImageCompressor = () => {
  const workerRef = useRef(null);
  const callbacks = useRef({});

  useEffect(() => {
    // 🔥 Tạo worker khi component mount
    workerRef.current = new Worker(
      new URL("../workers/imageCompressor.worker.js", import.meta.url),
      { type: "module" }
    );

    workerRef.current.onmessage = (e) => {
      const { requestId, success, blob, error } = e.data;

      console.log("Got response from worker:", requestId);

      const callback = callbacks.current[requestId];
      if (!callback) return;

      delete callbacks.current[requestId];

      if (success) {
        callback.resolve(blob);
      } else {
        callback.reject(error);
      }
    };

    // 🔥 CLEANUP — khi component unmount
    return () => {
      console.log("Terminating worker...");
      workerRef.current?.terminate();
      workerRef.current = null;
      callbacks.current = {};
    };
  }, []);

  const compressImage = (file, options = {}) => {
    return new Promise((resolve, reject) => {
      const requestId = requestCounter++;
      console.log("Posting to worker:", requestId);

      callbacks.current[requestId] = { resolve, reject };

      workerRef.current.postMessage({
        requestId,
        file,
        maxBytes: options.maxBytes || 10 * 1024 * 1024,
        maxWidthOrHeight: options.maxWidthOrHeight || 2560,
      });
    }).then((blob) => {
      return new File([blob], file.name.replace(/\.\w+$/, ".webp"), {
        type: "image/webp",
      });
    });
  };

  return { compressImage };
};