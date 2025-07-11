const express = require('express');
const admin = require('firebase-admin');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG);
firebaseConfig.private_key = firebaseConfig.private_key.replace(/\\n/g, '\n');

admin.initializeApp({
  credential: admin.credential.cert(firebaseConfig),
  databaseURL: process.env.FIREBASE_DATABASE_URL
});

// ✅ Home Route
app.get('/', (req, res) => {
  res.send('✅ EarnGati Backend Running');
});

// ✅ Health Check Route for Render
app.get('/health', (req, res) => {
  res.send('EarnGati Backend is running.');
});

// ✅ Admin Key Verification Route
app.post('/verify-admin', (req, res) => {
  const key = req.body.key;
  if (key === process.env.ADMIN_KEY) {
    res.json({ success: true });
  } else {
    res.status(403).json({ success: false });
  }
});

// ✅ Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
