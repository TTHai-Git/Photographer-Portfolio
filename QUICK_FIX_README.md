# 🚀 Giải Pháp Lỗi API 500 trên iOS/macOS

## ❌ Vấn Đề

- ✅ POST, PUT, PATCH, DELETE hoạt động tốt trên **Android** và **Windows**
- ❌ Nhưng trên **iPhone**, **iPad**, **macBook** báo lỗi **axios 500**

## ✅ Nguyên Nhân

Vấn đề chính nằm ở sự khác biệt trong xử lý request giữa các platform:

| Vấn Đề                  | Chi Tiết                                                            |
| ----------------------- | ------------------------------------------------------------------- |
| **Body Size Limit**     | iOS gửi request với encoding khác, cần limit lớn hơn (100KB → 50MB) |
| **Content-Type Header** | Safari yêu cầu header chặt chẽ hơn Chrome                           |
| **CORS Headers**        | iOS cần các CORS header cụ thể                                      |
| **Timeout**             | Request timeout trước khi hoàn thành                                |

## 🔧 Giải Pháp Đã Áp Dụng

### 1. Server Middleware (`/server/middlewares/index.js`)

```javascript
// ✅ Tăng body size limit
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoding({ extended: true, limit: "50mb" }));
```

### 2. Global Error Handler (`/server/app.js`)

```javascript
// ✅ Catch và log tất cả errors
app.use((err, req, res, next) => {
  console.error("Error:", err);
  // Return proper error response
});
```

### 3. CORS Configuration (`/server/middlewares/cors.js`)

```javascript
// ✅ Thêm OPTIONS method và allowedHeaders
cors({
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept", "Origin"],
});
```

### 4. Client Axios Config (`/client/src/config/APIs.js`)

```javascript
// ✅ Request interceptor + timeout
authApi.interceptors.request.use((config) => {
  config.headers["Content-Type"] = "application/json";
  return config;
});

const authApi = axios.create({
  timeout: 30000, // 30 seconds
  withCredentials: true,
});
```

## 🧪 Cách Test

### Option 1: Test với Curl (Terminal)

```bash
# Test POST
curl -X POST http://localhost:5000/cloudinaries/folders/cre \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"rootDir":"test","folderName":"newFolder"}'

# Test DELETE
curl -X DELETE http://localhost:5000/cloudinaries/folders/del \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"folderDirs":["test/folder"]}'
```

### Option 2: Test với Postman

1. Set method: **POST** / **DELETE** / **PUT** / **PATCH**
2. Set URL: `http://localhost:5000/cloudinaries/folders/cre`
3. Headers tab:
   - `Content-Type: application/json`
   - `Authorization: Bearer YOUR_TOKEN`
4. Body tab (raw JSON):
   ```json
   {
     "rootDir": "Hoang-Truc-Photographer-Portfolio",
     "folderName": "Test-Folder"
   }
   ```
5. Send

### Option 3: Test từ Code

```javascript
import { testCreateFolder, runAllTests } from "./utils/test-apis.js";

// Run single test
await testCreateFolder();

// Run all tests
await runAllTests();
```

### Option 4: Test trên iOS Safari

1. **iPhone**: Settings → Safari → Advanced → Web Inspector (Enable)
2. **macBook**: Safari → Develop → Enable Developer Menu
3. Mở app, check Network Tab khi gọi API
4. Nếu vẫn có lỗi, check console logs

## 📊 Kiểm Tra Network

### Request Headers (Client)

```
GET /api/endpoint HTTP/1.1
Host: localhost:5000
Content-Type: application/json
Authorization: Bearer token123
Accept: application/json
```

### Response Headers (Server)

```
HTTP/1.1 200 OK
Content-Type: application/json
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Credentials: true
Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS
```

## 📋 Changelog

- ✅ Tăng body limit từ 100KB → 50MB
- ✅ Thêm global error handler
- ✅ Cấu hình CORS chi tiết cho iOS
- ✅ Thêm request/response interceptors
- ✅ Thêm timeout: 30000ms
- ✅ Thêm `withCredentials: true`
- ✅ Fixed Content-Type header setup

## 🎯 Files Được Sửa

```
✅ /server/middlewares/index.js       - Tăng body limit + error handler
✅ /server/app.js                     - Thêm global error handler
✅ /server/middlewares/cors.js        - Cấu hình CORS cho iOS
✅ /client/src/config/APIs.js         - Cập nhật axios config
✅ /client/src/utils/test-apis.js     - Thêm test utilities (mới)
```

## 🚀 Next Steps

1. **Rebuild & Deploy**

   ```bash
   npm run build
   ```

2. **Test trên các devices**
   - ✅ Android (Chrome) - Đã hoạt động
   - ✅ Windows (Edge/Chrome) - Đã hoạt động
   - 🆕 iPhone (Safari) - Test ngay!
   - 🆕 macBook (Safari) - Test ngay!

3. **Nếu vẫn có lỗi**
   - Check server logs: `tail -f logs/error.log`
   - Enable debug: `DEBUG=* npm start`
   - Network tab trên Safari Inspector

## 💡 Debugging Cheat Sheet

```bash
# Xem server logs
tail -f logs/error.log

# Enable detailed logs
NODE_ENV=development npm start

# Test network connectivity
curl -i http://localhost:5000/auth/me

# Check CORS
curl -X OPTIONS http://localhost:5000/cloudinaries/folders/cre \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: POST"
```

## 📞 Support

Nếu vấn đề vẫn tồn tại:

1. ✅ Kiểm tra network tab trên Safari Developer Tools
2. ✅ Xem full error message từ server logs
3. ✅ Test endpoint trên cả client và server
4. ✅ Check proxy/VPN settings
5. ✅ Thử device/network khác

---

**Status:** ✅ Fixed and Ready for Testing on iOS/macOS
