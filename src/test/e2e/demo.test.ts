import request from 'supertest';
import app from '../../app.js';
import { describe, it, expect } from 'vitest';

describe('GET /', () => {
  it('should return Welcome to CareConnect API', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.text).toBe('Welcome to CareConnect API');
  });
});
