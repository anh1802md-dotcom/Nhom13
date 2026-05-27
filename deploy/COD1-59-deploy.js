/**
 * COD1-59: Deploy ứng dụng
 * Script hỗ trợ chạy backend + hướng dẫn deploy mobile
 *
 * Cách dùng:
 *   node deploy/COD1-59-deploy.js
 *   node deploy/COD1-59-deploy.js --docker
 */
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const ROOT = path.join(__dirname, '..');
const BACKEND = path.join(ROOT, 'backend');

function run(cmd, args, cwd) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { cwd, stdio: 'inherit', shell: true });
    child.on('close', (code) => (code === 0 ? resolve() : reject(new Error(`Exit ${code}`))));
  });
}

async function checkDeps(dir, label) {
  const nodeModules = path.join(dir, 'node_modules');
  if (!fs.existsSync(nodeModules)) {
    console.log(`📦 Cài đặt dependencies ${label}...`);
    await run('npm', ['install'], dir);
  }
}

async function buildWeb() {
  const webDir = path.join(ROOT, 'web');
  console.log('🔨 Build trang web...');
  await checkDeps(webDir, 'web');
  await run('npm', ['run', 'build'], webDir);
}

async function startBackend() {
  console.log('🚀 Khởi động server (API + trang web) tại http://localhost:3000');
  await run('node', ['server.js'], BACKEND);
}

async function dockerDeploy() {
  const composePath = path.join(__dirname, 'docker-compose.yml');
  if (!fs.existsSync(composePath)) {
    console.error('Không tìm thấy docker-compose.yml');
    process.exit(1);
  }
  console.log('🐳 Deploy bằng Docker Compose...');
  await run('docker', ['compose', 'up', '--build', '-d'], __dirname);
  console.log('✅ Backend đã chạy qua Docker tại cổng 3000');
}

async function main() {
  const useDocker = process.argv.includes('--docker');

  console.log('=== COD1-59: Triển khai ứng dụng ===\n');
  console.log('Cấu trúc dự án:');
  console.log('  backend/  → API Node.js (port 3000)');
  console.log('  web/      → Trang web React');
  console.log('  tests/    → Test cases\n');

  if (useDocker) {
    await dockerDeploy();
    return;
  }

  console.log('\n🌐 Trang web: http://localhost:3000\n');
  await checkDeps(BACKEND, 'backend');
  await buildWeb();
  await startBackend();
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
