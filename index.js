const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const admin = require("firebase-admin");
const axios = require("axios");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG_JSON);
admin.initializeApp({
  credential: admin.credential.cert(firebaseConfig),
  databaseURL: process.env.FIREBASE_DATABASE_URL
});

const db = admin.database();

app.get("/health", (req, res) => {
  res.send({ status: "EarnGati backend is running" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("EarnGati backend listening on port", PORT);
});