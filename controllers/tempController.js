const axios = require('axios');
require('dotenv').config();

const getTemp = async (req, res) => {
    const currentDate = new Date().toISOString();
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const oneHourAgoStr = oneHourAgo.toISOString();

    const SENSEBOX_API_URL = `${process.env.SENSEBOX_API_BASE_URL}?date=${oneHourAgoStr},${currentDate}&phenomenon=temperature&format=json`;

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
        let status;
        if (averageTemperature<10){
            status = "Too Cold";
        }else if(averageTemperature<37){
            status = "Good";
        }else{
            status = "Too Hot";
        }

        res.status(200).json({
            averageTemperature: averageTemperature.toFixed(2),
            status: status
        });

    } catch (error) {
        res.status(500).json({
            message: "Error fetching the temperature!",
            error: error.message
        });
    }
};

module.exports = getTemp;
