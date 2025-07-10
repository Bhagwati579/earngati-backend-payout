const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

// Firebase Config
const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG_JSON);
admin.initializeApp({
  credential: admin.credential.cert(firebaseConfig),
  databaseURL: process.env.FIREBASE_DATABASE_URL
});
const db = admin.database();

// Test Firebase Route
app.get('/api/test-firebase', async (req, res) => {
  try {
    const snapshot = await db.ref("tasks").once("value");
    res.json(snapshot.val() || { message: "No tasks found" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health Check
app.get('/health', (req, res) => {
  res.send('EarnGati Backend is running.');
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ EarnGati backend running on port ${PORT}`);
});