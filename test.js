const express = require('express');
const router = express.Router();
const { getDatabase, ref, get } = require('firebase-admin/database');
const admin = require('firebase-admin');

if (!admin.apps.length) {
  const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG_JSON);
  admin.initializeApp({
    credential: admin.credential.cert(firebaseConfig),
    databaseURL: process.env.FIREBASE_DATABASE_URL
  });
}

router.get('/', async (req, res) => {
  try {
    const db = getDatabase();
    const dbRef = ref(db, 'tasks');
    const snapshot = await get(dbRef);
    res.json(snapshot.val() || {});
  } catch (error) {
    res.status(500).json({ error: 'Firebase error', detail: error.message });
  }
});

module.exports = router;