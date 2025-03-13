const tempRoutes = require('./routes/tempRoutes')
const versionRoutes = require('./routes/versionRoutes')
const express = require('express')

const app = new express();

app.use('/temperature', tempRoutes);
app.use('/version', versionRoutes);

module.exports = app;