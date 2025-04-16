const request = require('supertest');
const axios = require('axios');
const app = require('../../app');

jest.mock('axios');

describe('Temperature Controller', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should return average temperature when data is available', async () => {
        axios.get.mockResolvedValue({
            data: [
                {
                    lastMeasurementAt: new Date().toISOString(),
                    sensors: [
                        {
                            title: "Temperature",
                            lastMeasurement: {
                                value: "25.5",
                                createdAt: new Date().toISOString(),
                            },
                        },
                    ],
                },
            ],
        });

        const response = await request(app).get('/temperature');
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('averageTemperature', "25.50");
        expect(response.body).toHaveProperty('status', "Good");
    });

    test('should return 404 if no valid temperature data is found', async () => {
        axios.get.mockResolvedValue({ data: [] });

        const response = await request(app).get('/temperature');
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('error', "No temperature data available from the last hour");
    });

    test('should return 500 on API failure', async () => {
        axios.get.mockRejectedValue(new Error("API failure"));

        const response = await request(app).get('/temperature');
        expect(response.status).toBe(500);
        expect(response.body).toHaveProperty('message', "Error fetching the temperature!");
        expect(response.body).toHaveProperty('error', "API failure");
    });
});
