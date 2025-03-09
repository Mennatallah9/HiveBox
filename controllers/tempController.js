const axios = require('axios');

const getTemp = async (req, res) => {
    const currentDate = new Date().toISOString();
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const oneHourAgoStr = oneHourAgo.toISOString();

    const SENSEBOX_API_URL = `https://api.opensensemap.org/boxes?date=${oneHourAgoStr},${currentDate}&phenomenon=temperature&format=json`;

    try {
        const response = await axios.get(SENSEBOX_API_URL);
        const boxes = response.data;

        let temperatureSum = 0;
        let validBoxCount = 0;

        boxes.forEach(box => {
            if (box.lastMeasurementAt && new Date(box.lastMeasurementAt) >= oneHourAgo) {
                if (box.sensors) {
                    box.sensors.forEach(sensor => {
                        if (
                            sensor.title.toLowerCase().includes('temperature') ||
                            sensor.unit?.toLowerCase() === '°c' ||
                            sensor.unit?.toLowerCase() === 'celsius'
                        ) {
                            if (
                                sensor.lastMeasurement &&
                                sensor.lastMeasurement.value &&
                                new Date(sensor.lastMeasurement?.createdAt) >= oneHourAgo
                            ) {
                                const tempValue = parseFloat(sensor.lastMeasurement.value);
                                if (!isNaN(tempValue)) {
                                    temperatureSum += tempValue;
                                    validBoxCount++;
                                }
                            }
                        }
                    });
                }
            }
        });

        if (validBoxCount === 0) {
            return res.status(404).json({ error: "No temperature data available from the last hour" });
        }

        const averageTemperature = temperatureSum / validBoxCount;

        res.status(200).json({
            averageTemperature: averageTemperature.toFixed(2),
            unit: "°C",
        });

    } catch (error) {
        res.status(500).json({
            message: "Error fetching the temperature!",
            error: error.message
        });
    }
};

module.exports = getTemp;
