/**
 * COD1-58: Viết test case
 * Chạy: npm test (từ thư mục gốc) hoặc node --test tests/COD1-58-test-cases.test.js
 */
const { describe, it, before, after } = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');

let BASE = 'http://127.0.0.1:3099';
let app;
let token;

function request(method, path, body, auth = false) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE);
    const data = body ? JSON.stringify(body) : null;
    const req = http.request(
      url,
      {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(auth && token ? { Authorization: `Bearer ${token}` } : {}),
          ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {}),
        },
      },
      (res) => {
        let raw = '';
        res.on('data', (c) => (raw += c));
        res.on('end', () => {
          let json = {};
          try {
            json = raw ? JSON.parse(raw) : {};
          } catch {
            json = { raw };
          }
          resolve({ status: res.statusCode, json });
        });
      }
    );
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

let httpServer;

before(async () => {
  process.env.PORT = '0';
  const mod = require('../backend/server');
  app = mod.app;
  httpServer = await mod.start();
  const { port } = httpServer.address();
  BASE = `http://127.0.0.1:${port}`;
});

after(() => {
  if (httpServer) httpServer.close();
});

describe('COD1-50: API đăng nhập', () => {
  it('đăng nhập thành công với bacsi/user123', async () => {
    const res = await request('POST', '/api/auth/login', {
      username: 'bacsi',
      password: 'user123',
    });
    assert.equal(res.status, 200);
    assert.ok(res.json.token);
    token = res.json.token;
  });

  it('từ chối sai mật khẩu', async () => {
    const res = await request('POST', '/api/auth/login', {
      username: 'bacsi',
      password: 'sai',
    });
    assert.equal(res.status, 401);
  });
});

describe('COD1-48: API bệnh nhân', () => {
  it('lấy danh sách bệnh nhân', async () => {
    const res = await request('GET', '/api/patients', null, true);
    assert.equal(res.status, 200);
    assert.ok(Array.isArray(res.json.data));
  });

  it('lấy chi tiết bệnh nhân p1', async () => {
    const res = await request('GET', '/api/patients/p1', null, true);
    assert.equal(res.status, 200);
    assert.equal(res.json.data.id, 'p1');
  });
});

describe('COD1-49: API lịch sử thuốc', () => {
  it('lấy lịch sử thuốc theo patientId', async () => {
    const res = await request('GET', '/api/medications?patientId=p1', null, true);
    assert.equal(res.status, 200);
    assert.ok(res.json.data.length >= 1);
  });

  it('thêm lịch sử thuốc mới', async () => {
    const res = await request(
      'POST',
      '/api/medications',
      {
        patientId: 'p1',
        drugName: 'Vitamin C',
        dosage: '1 viên',
        frequency: '1 lần/ngày',
      },
      true
    );
    assert.equal(res.status, 201);
    assert.equal(res.json.data.drugName, 'Vitamin C');
  });
});

describe('COD1-41/42: API lịch khám', () => {
  it('đặt và xem lịch khám', async () => {
    const create = await request(
      'POST',
      '/api/appointments',
      {
        patientId: 'p1',
        date: '2026-07-01',
        time: '14:00',
        doctorName: 'BS Test',
      },
      true
    );
    assert.equal(create.status, 201);

    const list = await request('GET', '/api/appointments?patientId=p1', null, true);
    assert.equal(list.status, 200);
    assert.ok(list.json.data.length >= 1);
  });
});

describe('COD1-54: API lịch sử khám', () => {
  it('lấy lịch sử khám', async () => {
    const res = await request('GET', '/api/examinations?patientId=p1', null, true);
    assert.equal(res.status, 200);
    assert.ok(res.json.data.length >= 1);
  });
});

describe('COD1-46: Admin users', () => {
  it('admin đăng nhập và xem users', async () => {
    const login = await request('POST', '/api/auth/login', {
      username: 'admin',
      password: 'admin123',
    });
    assert.equal(login.status, 200);
    const adminToken = login.json.token;

    const oldToken = token;
    token = adminToken;
    const res = await request('GET', '/api/admin/users', null, true);
    token = oldToken;
    assert.equal(res.status, 200);
    assert.ok(res.json.data.length >= 2);
  });
});
