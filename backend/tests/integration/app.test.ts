import request from 'supertest';
import { app } from '../../src/app';

describe('App Bootstrap Integration Tests', () => {
  it('GET / should return operational API status info', async () => {
    const res = await request(app).get('/');

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('name', 'STRATA Backend API');
    expect(res.body).toHaveProperty('status', 'operational');
    expect(res.body).toHaveProperty('docs', '/api/docs');
  });

  it('GET /api/v1/unknown-endpoint should trigger 404 handler', async () => {
    const res = await request(app).get('/api/v1/unknown-endpoint');

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('success', false);
    expect(res.body.error).toHaveProperty('code', 'NOT_FOUND');
  });
});
