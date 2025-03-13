const request = require('supertest');
const fs = require('fs');
const app = require('../../app');

jest.mock('fs');

describe('Version Controller', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should return the correct version', async () => {
        fs.readFileSync.mockReturnValue(JSON.stringify({ version: "1.0.0" }));

        const response = await request(app).get('/version');
        expect(response.status).toBe(200);
        expect(response.text).toBe('"v1.0.0"');
    });

    test('should return a 500 error if package.json is missing', async () => {
        fs.readFileSync.mockImplementation(() => {
            throw new Error('File not found');
        });

        const response = await request(app).get('/version');
        expect(response.status).toBe(500);
        expect(response.body).toHaveProperty('message', 'Error fetching the project version!');
        expect(response.body).toHaveProperty('error', 'File not found');
    });
});
