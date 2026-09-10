const fs = require('fs');
const path = require('path');

// 1. Update src/components/AdminKeyGeneratorModal.tsx
const adminModalPath = path.resolve('src/components/AdminKeyGeneratorModal.tsx');
let adminModalContent = fs.readFileSync(adminModalPath, 'utf8');
adminModalContent = adminModalContent.replace(/48\.8/g, '49.9');
fs.writeFileSync(adminModalPath, adminModalContent, 'utf8');
console.log('Updated AdminKeyGeneratorModal.tsx');

// 2. Update src/services/api.ts
const apiPath = path.resolve('src/services/api.ts');
let apiContent = fs.readFileSync(apiPath, 'utf8');
apiContent = apiContent.replace(/price: number = 48\.8/g, 'price: number = 49.9');
fs.writeFileSync(apiPath, apiContent, 'utf8');
console.log('Updated api.ts');

// 3. Update server/db.cjs
const dbPath = path.resolve('server/db.cjs');
let dbContent = fs.readFileSync(dbPath, 'utf8');
dbContent = dbContent.replace(/price REAL NOT NULL DEFAULT 48\.8/g, 'price REAL NOT NULL DEFAULT 49.9');
dbContent = dbContent.replace(/price: 48\.8/g, 'price: 49.9');
dbContent = dbContent.replace(/price = 48\.8/g, 'price = 49.9');
fs.writeFileSync(dbPath, dbContent, 'utf8');
console.log('Updated server/db.cjs');

// 4. Update server/server.cjs
const serverPath = path.resolve('server/server.cjs');
let serverContent = fs.readFileSync(serverPath, 'utf8');
serverContent = serverContent.replace(/price \|\| 48\.8/g, 'price || 49.9');
fs.writeFileSync(serverPath, serverContent, 'utf8');
console.log('Updated server/server.cjs');

// 5. Update scripts/test_backend_api.cjs
const testApiPath = path.resolve('scripts/test_backend_api.cjs');
if (fs.existsSync(testApiPath)) {
  let testApiContent = fs.readFileSync(testApiPath, 'utf8');
  testApiContent = testApiContent.replace(/48\.8/g, '49.9');
  fs.writeFileSync(testApiPath, testApiContent, 'utf8');
  console.log('Updated scripts/test_backend_api.cjs');
}

// 6. Update src/components/VipModal.tsx if any 48.8 remains
const vipModalPath = path.resolve('src/components/VipModal.tsx');
let vipModalContent = fs.readFileSync(vipModalPath, 'utf8');
vipModalContent = vipModalContent.replace(/48\.8/g, '49.9');
fs.writeFileSync(vipModalPath, vipModalContent, 'utf8');
console.log('Updated VipModal.tsx');