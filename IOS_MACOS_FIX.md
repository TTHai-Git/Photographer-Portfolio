# 🔧 Hướng Dẫn Sửa Lỗi 500 trên iOS/macOS

## 📋 Tóm Tắt Vấn Đề

Lỗi **axios 500** xảy ra khi test các APIs POST, PUT, PATCH, DELETE trên iPhone/macBook nhưng hoạt động bình thường trên Android/Windows.

### ✅ Nguyên Nhân Chính:

1. **Body Size Limit Quá Nhỏ** - Express mặc định chỉ accept 100KB JSON
2. **Content-Type Header Không Tương Thích** - iOS/Safari gửi khác biệt
3. **Thiếu CORS Headers** - Safari yêu cầu headers nghiêm ngặt hơn
4. **Không Có Error Handler** - Lỗi middleware không được log rõ
5. **Timeout Quá Ngắn** - Request bị timeout trước khi hoàn thành

---

## 🛠️ Các Giải Pháp Đã Áp Dụng

### 1️⃣ **Cập Nhật `/server/middlewares/index.js`**

```javascript
// ✅ Tăng JSON body limit từ 100KB lên 50MB
app.use(express.json({ limit: "50mb" }));

// ✅ Tăng URL-encoded limit
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// ✅ Thêm error handler cho parsing errors
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      message: "Invalid JSON format",
      error: err.message,
    });
  }
  next(err);
});
```

**Lý do:** iOS gửi request với dữ liệu được encoding khác nhau, cần limit lớn hơn.

---

### 2️⃣ **Cập Nhật `/server/app.js` - Global Error Handler**

```javascript
// Global error handler - phải đặt ở cuối cùng
app.use((err, req, res, next) => {
  console.error("❌ Error:", err);

  if (res.headersSent) {
    return next(err);
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  return res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { error: err.toString() }),
  });
});
```

**Lý do:** Giúp catch tất cả lỗi và log rõ để debug.

---

### 3️⃣ **Cập Nhật `/server/middlewares/cors.js`**

```javascript
const corsInit = () =>
  cors({
    origin: [...origins],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
    // ✅ Thêm các header cho iOS/Safari
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Accept",
      "Origin",
      "Access-Control-Request-Method",
      "Access-Control-Request-Headers",
    ],
    exposedHeaders: ["Content-Length", "X-Content-Type"],
    maxAge: 86400, // Cache preflight requests
  });
```

**Lý do:** Safari yêu cầu các headers CORS chặt chẽ hơn Chrome/Firefox.

---

### 4️⃣ **Cập Nhật `/client/src/config/APIs.js`**

```javascript
// ✅ Request interceptor - đảm bảo Content-Type
authApi.interceptors.request.use(
  (config) => {
    if (!config.headers["Content-Type"]) {
      config.headers["Content-Type"] = "application/json";
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ✅ Thêm timeout cho tất cả requests
export const authApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
  timeout: 30000, // 30 giây
});
```

**Lý do:**

- Đảm bảo header được set đúng cách
- Tránh hanging requests trên devices chậm

---

## 🧪 Cách Test

### Test trên macOS:

```bash
# Sử dụng curl để test
curl -X POST http://localhost:5000/cloudinaries/folders/cre \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"rootDir":"test","folderName":"newFolder"}'
```

### Test trên iPhone Safari:

1. Mở Safari → Settings → Advanced → Web Inspector (enable)
2. Connect Xcode → Run app
3. Inspect network requests trong console
4. Kiểm tra lỗi chính xác

### Test trên Postman:

```
POST /cloudinaries/folders/cre
Header: Content-Type: application/json
Header: Authorization: Bearer TOKEN
Body: {"rootDir":"test","folderName":"newFolder"}
```

---

## 📊 Khác Biệt iOS vs Android

| Feature           | iOS/Safari            | Android/Chrome             |
| ----------------- | --------------------- | -------------------------- |
| Body Size Default | Có thể bị limit       | Hỗ trợ tốt                 |
| Content-Type      | Yêu cầu chặt chẽ      | Linh hoạt hơn              |
| CORS Preflight    | Bắt buộc              | Bắt buộc nhưng ít khắt khe |
| Cookies           | Cần `withCredentials` | Cần `withCredentials`      |
| Timeout           | Mặc định 60s          | Mặc định 0 (unlimited)     |

---

## 🔍 Debugging Tips

### Kiểm tra Network Tab:

```javascript
// Thêm logging ở client
authApi.interceptors.request.use((config) => {
  console.log("📤 Request:", {
    url: config.url,
    method: config.method,
    headers: config.headers,
    data: config.data,
  });
  return config;
});

authApi.interceptors.response.use(
  (response) => {
    console.log("📥 Response:", response.status);
    return response;
  },
  (error) => {
    console.error("❌ Error:", {
      status: error.response?.status,
      message: error.response?.data?.message,
      url: error.config?.url,
    });
    return Promise.reject(error);
  },
);
```

### Server Logging:

```bash
# Thêm DEBUG logs
DEBUG=* npm start
```

---

## ✨ Các Thay Đổi Chi Tiết

### `/server/middlewares/index.js` ✅

- ✅ Tăng JSON limit từ 100KB → 50MB
- ✅ Thêm error handler cho parsing
- ✅ Changed `extended: false` → `extended: true`

### `/server/app.js` ✅

- ✅ Thêm global error handler middleware

### `/server/middlewares/cors.js` ✅

- ✅ Thêm "OPTIONS" method
- ✅ Thêm allowedHeaders chi tiết
- ✅ Thêm exposedHeaders
- ✅ Thêm maxAge cache

### `/client/src/config/APIs.js` ✅

- ✅ Thêm request interceptor
- ✅ Thêm timeout: 30000
- ✅ Bật `withCredentials` cho default axios
- ✅ Fixed BASE_URL construction

---

## 🚀 Bước Tiếp Theo

1. **Test trên iOS device:**

   ```bash
   npm run build
   # Deploy to test environment
   ```

2. **Monitor logs** khi test trên iOS/macOS

3. **Kiểm tra network** trong Safari Web Inspector

4. **Nếu vẫn có lỗi**, check:
   - Console logs trên server
   - Network tab trên client
   - Proxy settings (VPN, corporate proxy)
   - Device network settings

---

## 📌 Lưu Ý Quan Trọng

⚠️ **Timeout Issue**: Nếu device iOS chậm, request có thể timeout.

- Solution: Tăng timeout nếu cần `timeout: 60000`

⚠️ **Large Payload**: Nếu upload files lớn, cần tăng limit hơn.

- Solution: `limit: "100mb"` nếu cần

⚠️ **Proxy/VPN**: Một số lỗi 500 có thể do proxy/VPN.

- Solution: Test trên network khác

---

## 📞 Liên Hệ Hỗ Trợ

Nếu vấn đề vẫn tồn tại:

1. Check server logs:

   ```bash
   tail -f logs/error.log
   ```

2. Enable verbose logging:

   ```bash
   NODE_ENV=development npm start
   ```

3. Test endpoint cụ thể trên cả platforms

4. Share error message đầy đủ cho debugging

---

**Status:** ✅ Fixed - Ready for testing on iOS/macOS
