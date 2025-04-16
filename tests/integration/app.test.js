const request = require('supertest');
const app = require('../../app');

describe('Integration Tests', () => {
    test('GET /version returns version', async () => {
        const response = await request(app).get('/version');
        expect(response.statusCode).toBe(200);
    });

    test('GET /temperature returns status and value', async () => {
        const response = await request(app).get('/temperature');
        expect(response.statusCode).toBe(200);
        expect(response.body.status).toMatch(/Too Cold|Good|Too Hot/);
    });

    test('GET /metrics returns Prometheus metrics', async () => {
        const response = await request(app).get('/metrics');
        expect(response.statusCode).toBe(200);
        expect(response.text).toMatch(/# HELP|# TYPE/);
    });
});
