const express = require('express');
const dotenv = require('dotenv');
const testRoute = require('./test');
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use('/api/test-firebase', testRoute);

app.get('/health', (req, res) => {
  res.send('OK');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});