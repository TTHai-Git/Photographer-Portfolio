import { useRef, useEffect } from "react";

export const useImageCompressor = () => {
  const workerRef = useRef(null);
  const callbacks = useRef({});
  // 🔥 requestCounter nằm bên trong hook, không chia sẻ giữa các instance
  const requestCounterRef = useRef(0);

  useEffect(() => {
    // Tạo worker khi component mount
    const worker = new Worker(
      new URL("../workers/imageCompressor.worker.js", import.meta.url),
      { type: "module" }
    );

    workerRef.current = worker;

    worker.onmessage = (e) => {
      const { requestId, success, blob, error } = e.data;

      const callback = callbacks.current[requestId];
      if (!callback) return; // callback đã bị xóa (do unmount) → bỏ qua

      delete callbacks.current[requestId];

      if (success) {
        callback.resolve(blob);
      } else {
        callback.reject(new Error(error));
      }
    };

    worker.onerror = (e) => {
      // Reject tất cả pending callbacks nếu worker gặp lỗi nghiêm trọng
      console.error("Worker fatal error:", e);
      Object.values(callbacks.current).forEach(({ reject }) =>
        reject(new Error(`Worker error: ${e.message}`))
      );
      callbacks.current = {};
    };

    // CLEANUP — khi component unmount
    return () => {
      // Reject tất cả pending requests thay vì bỏ lơ (tránh promise leak)
      Object.values(callbacks.current).forEach(({ reject }) =>
        reject(new Error("Component unmounted — compression cancelled"))
      );
      callbacks.current = {};

      worker.terminate();
      workerRef.current = null;
    };
  }, []);

  const compressImage = (file, options = {}) => {
    // 🛡️ Guard: worker chưa sẵn sàng
    if (!workerRef.current) {
      return Promise.reject(new Error("Image compressor worker is not ready"));
    }

    return new Promise((resolve, reject) => {
      const requestId = requestCounterRef.current++;

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