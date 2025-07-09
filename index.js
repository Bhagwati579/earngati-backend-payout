
const express = require("express");
const bodyParser = require("body-parser");
const admin = require("firebase-admin");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(bodyParser.json());

const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://earngati-gpay-system-default-rtdb.asia-southeast1.firebasedatabase.app"
});

const db = admin.database();

const CASHFREE_CLIENT_ID = process.env.CASHFREE_CLIENT_ID;
const CASHFREE_SECRET_KEY = process.env.CASHFREE_SECRET_KEY;

let token = null;

// Generate Auth Token
async function generateToken() {
  const response = await axios.post("https://payout-api.cashfree.com/payout/v1/authorize", {
    client_id: CASHFREE_CLIENT_ID,
    client_secret: CASHFREE_SECRET_KEY
  }, {
    headers: { "Content-Type": "application/json" }
  });
  token = response.data.data.token;
}

// Payout Endpoint
app.post("/payout", async (req, res) => {
  const { name, upi, amount } = req.body;
  try {
    if (!token) await generateToken();

    const payoutRes = await axios.post("https://payout-api.cashfree.com/payout/v1/requestTransfer", {
      transferMode: "upi",
      amount,
      upi,
      remarks: "EarnGati Task Payout"
    }, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    res.json({ success: true, data: payoutRes.data });
  } catch (error) {
    console.error("Payout failed:", error.response?.data || error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(3000, () => {
  console.log("EarnGati Payout Backend running on port 3000");
});
