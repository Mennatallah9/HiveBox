const tempRoutes = require('./routes/tempRoutes')
const versionRoutes = require('./routes/versionRoutes')
const express = require('express')

const app = new express();

app.use('/temperature', tempRoutes);
app.use('/version', versionRoutes);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
})