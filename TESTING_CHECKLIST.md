# ✅ Checklist - Fixing iOS/macOS API 500 Errors

## 📋 Pre-Fix Verification

- [ ] All tests pass on Android/Windows
- [ ] Server is running locally
- [ ] Have admin token ready for testing
- [ ] Git repository is clean (no uncommitted changes)

---

## 🔧 Code Changes Applied

### Server-Side Changes

- [x] **`/server/middlewares/index.js`** - Updated middleware configuration
  - [x] Changed `extended: false` → `extended: true`
  - [x] Added `limit: "50mb"` to `express.json()`
  - [x] Added `limit: "50mb"` to `express.urlencoded()`
  - [x] Added error handler for parsing errors
  - [ ] Verify the file exists and changes are saved

- [x] **`/server/app.js`** - Added global error handler
  - [x] Added error handling middleware at the end
  - [x] Logs all errors to console
  - [x] Returns proper error response
  - [ ] Verify the file exists and changes are saved

- [x] **`/server/middlewares/cors.js`** - Enhanced CORS configuration
  - [x] Added "OPTIONS" to methods array
  - [x] Added comprehensive allowedHeaders
  - [x] Added exposedHeaders
  - [x] Added maxAge: 86400
  - [ ] Verify the file exists and changes are saved

### Client-Side Changes

- [x] **`/client/src/config/APIs.js`** - Updated axios configuration
  - [x] Added request interceptor for Content-Type
  - [x] Added `timeout: 30000` to authApi
  - [x] Added `withCredentials: true` to default axios instance
  - [x] Fixed refresh token endpoint URL construction
  - [ ] Verify the file exists and changes are saved

### New Files Created

- [x] **`/client/src/utils/test-apis.js`** - Test utilities
  - [x] Contains test functions for POST, PUT, PATCH, DELETE
  - [x] Includes logging utilities
  - [x] Has runAllTests() function
  - [ ] Review and verify the file

---

## 🧪 Local Testing

### Step 1: Start Server

```bash
cd my-photographer-portfolio-app/server
npm install  # if needed
npm start
```

- [ ] Server running on http://localhost:5000
- [ ] No errors in console

### Step 2: Check Middleware

```bash
# From terminal, test CORS preflight
curl -X OPTIONS http://localhost:5000/cloudinaries/folders/cre \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: POST" \
  -H "Content-Type: application/json" -v
```

- [ ] Response includes `Access-Control-Allow-Origin`
- [ ] Response includes `Access-Control-Allow-Methods`
- [ ] HTTP 200 status

### Step 3: Test POST Request

```bash
# Test with curl
curl -X POST http://localhost:5000/cloudinaries/folders/cre \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"rootDir":"test","folderName":"test-' + date +%s + '"}'
```

- [ ] Returns 200/201 status
- [ ] No 500 error
- [ ] Response body is valid JSON

### Step 4: Test DELETE Request

```bash
curl -X DELETE http://localhost:5000/cloudinaries/folders/del \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"folderDirs":["test/folder"]}'
```

- [ ] Returns 200 status
- [ ] No 500 error
- [ ] Response body is valid JSON

### Step 5: Start Client

```bash
cd my-photographer-portfolio-app/client
npm start
```

- [ ] Client running on http://localhost:3000
- [ ] No console errors
- [ ] Can see network requests in DevTools

### Step 6: Test from Browser

```javascript
// Open DevTools Console and run:
import { testCreateFolder } from "./utils/test-apis.js";
await testCreateFolder();
```

- [ ] Request sent successfully
- [ ] Response received (not 500)
- [ ] Check Network tab for details

---

## 📱 Device Testing

### Windows/Android (Should Already Work)

#### Windows Desktop - Edge/Chrome:

- [ ] Open http://localhost:3000
- [ ] Test POST request
- [ ] Result: ✅ Success
- [ ] No console errors

#### Android Phone - Chrome:

- [ ] Connect to same network as PC
- [ ] Open http://MACHINE_IP:3000
- [ ] Test POST request
- [ ] Result: ✅ Success

### iOS/macOS (Recently Fixed)

#### iPhone - Safari:

- [ ] Connect to same network
- [ ] Open http://MACHINE_IP:3000
- [ ] Enable Web Inspector (Settings → Safari → Advanced)
- [ ] Test POST request
- [ ] Result: ✅ Should work now!
- [ ] Check Safari Web Inspector for errors

#### iPad - Safari:

- [ ] Similar to iPhone
- [ ] Test POST request
- [ ] Result: ✅ Should work now!

#### macBook - Safari:

- [ ] Open http://localhost:3000 (or http://MACHINE_IP:3000)
- [ ] Enable Developer Menu (Safari → Develop)
- [ ] Test POST request
- [ ] Result: ✅ Should work now!

---

## 🔍 Debugging Checklist

If you encounter issues, check:

### Server Issues

- [ ] Server logs show any errors?
  ```bash
  tail -f logs/error.log
  ```
- [ ] Try with debug mode:
  ```bash
  NODE_ENV=development npm start
  ```
- [ ] Check port 5000 is available
  ```bash
  lsof -i :5000  # macOS/Linux
  netstat -ano | findstr :5000  # Windows
  ```
- [ ] Verify all files were saved correctly
  ```bash
  git diff  # See what changed
  ```

### Client Issues

- [ ] DevTools Console showing errors?
- [ ] Network tab showing request/response?
- [ ] Check axios interceptors are loaded
- [ ] Verify BASE_URL is correct

### Network Issues

- [ ] Can ping between devices?
  ```bash
  ping MACHINE_IP
  ```
- [ ] Firewall blocking port 5000?
- [ ] VPN/Proxy interfering?
- [ ] Same network or different subnet?

### CORS Issues

- [ ] Response headers include CORS headers?
- [ ] Origin header matches allowed origin?
- [ ] Check preflight request status
- [ ] Browser console showing CORS error?

---

## 📊 Testing Results Template

### POST Request

```
Device: ___________
Browser: ___________
Request: POST /cloudinaries/folders/cre
Status: ___________
Headers Sent: ✅/❌
Body Valid: ✅/❌
Response: ✅/❌
Errors: ___________
```

### DELETE Request

```
Device: ___________
Browser: ___________
Request: DELETE /cloudinaries/folders/del
Status: ___________
Headers Sent: ✅/❌
Body Valid: ✅/❌
Response: ✅/❌
Errors: ___________
```

### PATCH Request

```
Device: ___________
Browser: ___________
Request: PATCH /route
Status: ___________
Headers Sent: ✅/❌
Body Valid: ✅/❌
Response: ✅/❌
Errors: ___________
```

---

## 📈 Success Criteria

### Must Pass

- [ ] POST request works on iPhone
- [ ] DELETE request works on iPhone
- [ ] PUT/PATCH request works on iPhone
- [ ] All requests work on Android (unchanged)
- [ ] All requests work on Windows (unchanged)
- [ ] Server logs no errors
- [ ] No 500 errors returned
- [ ] Response times reasonable (<5 sec)

### Nice to Have

- [ ] Test on iPad
- [ ] Test on macBook
- [ ] Test on various iOS versions
- [ ] Performance optimized
- [ ] Error messages clear

---

## 🚀 Deployment Checklist

### Pre-Deployment

- [ ] All tests pass locally
- [ ] All changes committed to git
- [ ] No console errors
- [ ] No server errors
- [ ] Code reviewed

### Deployment

- [ ] Backup current version
- [ ] Deploy server changes
- [ ] Deploy client changes
- [ ] Verify deployment successful
- [ ] Check production logs

### Post-Deployment

- [ ] Test on production URL
- [ ] Test on iOS device
- [ ] Test on Windows device
- [ ] Monitor logs for errors
- [ ] Collect user feedback

---

## 📞 Troubleshooting Guide

### Problem: Still getting 500 error on iOS

**Possible Causes & Solutions:**

1. [ ] Cache not cleared
   - Solution: Hard refresh (Cmd+Shift+R on Mac)
2. [ ] Changes not deployed
   - Solution: Verify files were updated
3. [ ] Wrong network
   - Solution: Check IP address is correct
4. [ ] CORS still blocking
   - Solution: Check CORS headers in response
5. [ ] Token expired
   - Solution: Re-login or use new token

### Problem: Request timeout

**Possible Causes & Solutions:**

1. [ ] Network latency
   - Solution: Increase timeout to 60000ms
2. [ ] Server slow
   - Solution: Check server performance
3. [ ] Large payload
   - Solution: Reduce data size or increase limit

### Problem: Content-Type errors

**Possible Causes & Solutions:**

1. [ ] Header not set
   - Solution: Verify request interceptor is running
2. [ ] Wrong Content-Type value
   - Solution: Must be "application/json"
3. [ ] Proxy modifying headers
   - Solution: Try different network

---

## 📝 Sign-Off

- [ ] All fixes applied
- [ ] All tests passed
- [ ] Documentation updated
- [ ] Ready for production
- [ ] Team notified

**Tested by:** ****\_\_\_****
**Date:** ****\_\_\_****
**Status:** ✅ APPROVED / ⏳ PENDING / ❌ FAILED

---

**Notes:**

```
_________________________________________________________________

_________________________________________________________________

_________________________________________________________________

_________________________________________________________________
```

---

## 📚 Reference Documents

- `IOS_MACOS_FIX.md` - Detailed explanation
- `QUICK_FIX_README.md` - Quick reference
- `FIX_SUMMARY.md` - Visual summary
