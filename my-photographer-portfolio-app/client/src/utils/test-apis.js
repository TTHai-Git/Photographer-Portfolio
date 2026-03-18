// 📝 Test Axios Config on Different Devices
// Dùng script này để test các APIs POST/PUT/PATCH/DELETE

import axios from "axios";

// ========================
// 🔧 CONFIG
// ========================
const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:5000";
const TOKEN = "YOUR_ADMIN_TOKEN"; // Replace with actual token

// ========================
// 📊 TEST UTILITIES
// ========================
const testLogger = {
  request: (method, url, data) => {
    console.log(`
    ╔═══════════════════════════════════════╗
    ║ 📤 REQUEST
    ╚═══════════════════════════════════════╝
    Method: ${method.toUpperCase()}
    URL: ${url}
    Data: ${JSON.stringify(data, null, 2)}
    `);
  },

  response: (status, data) => {
    console.log(`
    ╔═══════════════════════════════════════╗
    ║ 📥 RESPONSE
    ╚═══════════════════════════════════════╝
    Status: ${status}
    Data: ${JSON.stringify(data, null, 2)}
    `);
  },

  error: (status, message, error) => {
    console.error(`
    ╔═══════════════════════════════════════╗
    ║ ❌ ERROR
    ╚═══════════════════════════════════════╝
    Status: ${status}
    Message: ${message}
    Error: ${JSON.stringify(error, null, 2)}
    `);
  },
};

// ========================
// 🚀 TEST FUNCTIONS
// ========================

// 1️⃣ Test POST - Create Folder
export const testCreateFolder = async () => {
  try {
    const data = {
      rootDir: "Hoang-Truc-Photographer-Portfolio",
      folderName: "Test-Folder-" + new Date().getTime(),
    };

    testLogger.request("POST", `${BASE_URL}/cloudinaries/folders/cre`, data);

    const response = await axios.post(
      `${BASE_URL}/cloudinaries/folders/cre`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${TOKEN}`,
        },
        withCredentials: true,
        timeout: 30000,
      },
    );

    testLogger.response(response.status, response.data);
    return response.data;
  } catch (error) {
    testLogger.error(
      error.response?.status || "N/A",
      error.message,
      error.response?.data,
    );
    throw error;
  }
};

// 2️⃣ Test DELETE - Delete Folder
export const testDeleteFolder = async (folderName = "Test-Folder-1234") => {
  try {
    const data = {
      folderDirs: [`Hoang-Truc-Photographer-Portfolio/${folderName}`],
    };

    testLogger.request("DELETE", `${BASE_URL}/cloudinaries/folders/del`, data);

    const response = await axios.delete(
      `${BASE_URL}/cloudinaries/folders/del`,
      {
        data: data,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${TOKEN}`,
        },
        withCredentials: true,
        timeout: 30000,
      },
    );

    testLogger.response(response.status, response.data);
    return response.data;
  } catch (error) {
    testLogger.error(
      error.response?.status || "N/A",
      error.message,
      error.response?.data,
    );
    throw error;
  }
};

// 3️⃣ Test POST - Move Images
export const testMoveImages = async () => {
  try {
    const data = {
      public_ids: ["sample-public-id-1", "sample-public-id-2"],
      targetFolder: "Hoang-Truc-Photographer-Portfolio/Target-Folder",
      selectedFolder: "Hoang-Truc-Photographer-Portfolio/Source-Folder",
    };

    testLogger.request("POST", `${BASE_URL}/cloudinaries/images/mov`, data);

    const response = await axios.post(
      `${BASE_URL}/cloudinaries/images/mov`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${TOKEN}`,
        },
        withCredentials: true,
        timeout: 30000,
      },
    );

    testLogger.response(response.status, response.data);
    return response.data;
  } catch (error) {
    testLogger.error(
      error.response?.status || "N/A",
      error.message,
      error.response?.data,
    );
    throw error;
  }
};

// 4️⃣ Test DELETE - Delete Images
export const testDeleteImages = async () => {
  try {
    const data = {
      public_ids: ["sample-public-id-1", "sample-public-id-2"],
      selectedFolder: "Hoang-Truc-Photographer-Portfolio/Sample-Folder",
    };

    testLogger.request("DELETE", `${BASE_URL}/cloudinaries/images/del`, data);

    const response = await axios.delete(`${BASE_URL}/cloudinaries/images/del`, {
      data: data,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOKEN}`,
      },
      withCredentials: true,
      timeout: 30000,
    });

    testLogger.response(response.status, response.data);
    return response.data;
  } catch (error) {
    testLogger.error(
      error.response?.status || "N/A",
      error.message,
      error.response?.data,
    );
    throw error;
  }
};

// 5️⃣ Test POST - Save Assets
export const testSaveAssets = async () => {
  try {
    const data = {
      assets: [
        {
          public_id: "sample-public-id",
          original_filename: "test.jpg",
          secure_url: "https://example.com/test.jpg",
          resource_type: "image",
          bytes: 1024,
          format: "jpg",
          resolution: "1920x1080",
        },
      ],
      folder: "Hoang-Truc-Photographer-Portfolio/Test-Folder",
    };

    testLogger.request("POST", `${BASE_URL}/cloudinaries/save`, data);

    const response = await axios.post(`${BASE_URL}/cloudinaries/save`, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOKEN}`,
      },
      withCredentials: true,
      timeout: 30000,
    });

    testLogger.response(response.status, response.data);
    return response.data;
  } catch (error) {
    testLogger.error(
      error.response?.status || "N/A",
      error.message,
      error.response?.data,
    );
    throw error;
  }
};

// ========================
// 📋 RUN ALL TESTS
// ========================
export const runAllTests = async () => {
  console.log("🧪 Starting API Tests...\n");

  const results = [];

  // Test 1: Create Folder
  try {
    console.log("Test 1️⃣: Create Folder...");
    await testCreateFolder();
    results.push({ test: "Create Folder", status: "✅ PASS" });
  } catch (error) {
    results.push({ test: "Create Folder", status: "❌ FAIL" });
  }

  // Test 2: Move Images
  try {
    console.log("\nTest 2️⃣: Move Images...");
    await testMoveImages();
    results.push({ test: "Move Images", status: "✅ PASS" });
  } catch (error) {
    results.push({ test: "Move Images", status: "❌ FAIL" });
  }

  // Test 3: Delete Images
  try {
    console.log("\nTest 3️⃣: Delete Images...");
    await testDeleteImages();
    results.push({ test: "Delete Images", status: "✅ PASS" });
  } catch (error) {
    results.push({ test: "Delete Images", status: "❌ FAIL" });
  }

  // Test 4: Save Assets
  try {
    console.log("\nTest 4️⃣: Save Assets...");
    await testSaveAssets();
    results.push({ test: "Save Assets", status: "✅ PASS" });
  } catch (error) {
    results.push({ test: "Save Assets", status: "❌ FAIL" });
  }

  // Test 5: Delete Folder
  try {
    console.log("\nTest 5️⃣: Delete Folder...");
    await testDeleteFolder();
    results.push({ test: "Delete Folder", status: "✅ PASS" });
  } catch (error) {
    results.push({ test: "Delete Folder", status: "❌ FAIL" });
  }

  // Summary
  console.log(`
  ╔═══════════════════════════════════════╗
  ║ 📊 TEST SUMMARY
  ╚═══════════════════════════════════════╝
  `);

  results.forEach((r) => {
    console.log(`${r.test}: ${r.status}`);
  });

  return results;
};

// ========================
// 🎯 USAGE
// ========================
/*
// Import in your test file:
import { testCreateFolder, runAllTests } from './test-apis.js';

// Run single test:
await testCreateFolder();

// Run all tests:
await runAllTests();
*/
