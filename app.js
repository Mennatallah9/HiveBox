const tempRoutes = require('./routes/tempRoutes')
const versionRoutes = require('./routes/versionRoutes')
const metricsRoutes = require('./routes/metricsRoutes')
const express = require('express')

const app = new express();

app.use('/temperature', tempRoutes);
app.use('/version', versionRoutes);
app.use('/metrics', metricsRoutes)

module.exports = app;