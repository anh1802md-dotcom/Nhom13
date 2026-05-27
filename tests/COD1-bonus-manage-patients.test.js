/**
 * Test bổ sung — quản lý & xóa bệnh nhân
 */
const { describe, it, before, after } = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');

let BASE = 'http://127.0.0.1:3098';
let token;
let httpServer;

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
            json = {};
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

before(async () => {
  process.env.PORT = '0';
  const mod = require('../backend/server');
  httpServer = await mod.start();
  BASE = `http://127.0.0.1:${httpServer.address().port}`;
  const login = await request('POST', '/api/auth/login', {
    username: 'bacsi',
    password: 'user123',
  });
  token = login.json.token;
});

after(() => {
  if (httpServer) httpServer.close();
});

describe('Quản lý tất cả bệnh nhân', () => {
  it('lấy danh sách tất cả BN', async () => {
    const res = await request('GET', '/api/bonus/manage/patients', null, true);
    assert.equal(res.status, 200);
    assert.ok(res.json.data.length >= 1);
  });

  it('thêm BN và xóa khi chưa có thuốc', async () => {
    const create = await request(
      'POST',
      '/api/bonus/patients',
      { fullName: 'Nguyễn Test Xóa' },
      true
    );
    assert.equal(create.status, 201);
    const id = create.json.data.id;

    const del = await request('DELETE', `/api/bonus/manage/patients/${id}`, null, true);
    assert.equal(del.status, 200);
  });

  it('không xóa BN còn thuốc đang điều trị', async () => {
    const create = await request(
      'POST',
      '/api/bonus/patients',
      { fullName: 'BN Đang điều trị' },
      true
    );
    const id = create.json.data.id;
    await request(
      'POST',
      '/api/medications',
      {
        patientId: id,
        drugName: 'Thuốc đang dùng',
        endDate: '2099-12-31',
      },
      true
    );
    const res = await request('DELETE', `/api/bonus/manage/patients/${id}`, null, true);
    assert.equal(res.status, 400);
  });
});
