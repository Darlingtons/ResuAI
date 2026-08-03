require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const admin = require('firebase-admin');
// Initialize Firebase Admin SDK
try {
  const serviceAccount = require('./serviceAccountKey.json');
  admin.initializeApp({
    credential: admin.cert(serviceAccount)
  });
  console.log("🔥 Firebase Admin SDK initialized successfully via serviceAccountKey.json");
} catch (e) {
  console.error("Firebase Admin serviceAccountKey.json load failed:", e.message);
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    try {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      admin.initializeApp({
        credential: admin.cert(serviceAccount)
      });
      console.log("🔥 Firebase Admin SDK initialized successfully via FIREBASE_SERVICE_ACCOUNT env var");
    } catch (envError) {
      console.error("❌ Failed to parse FIREBASE_SERVICE_ACCOUNT env var:", envError);
    }
  } else {
    console.warn("⚠️  WARNING: Firebase Admin could not be initialized (serviceAccountKey.json not found and FIREBASE_SERVICE_ACCOUNT env var not set). Local mock database mode will be active.");
  }
}

const app = express();
app.use(cors());
app.use(express.json());

// Check if keys are provided
if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  console.warn("⚠️  WARNING: Razorpay keys are missing in the .env file.");
}

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'dummy_key',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_secret',
});

// Endpoint to generate an Order ID
app.post('/api/create-order', async (req, res) => {
  try {
    const { amount, currency, receipt } = req.body;

    if (razorpay.key_id === 'dummy_key') {
      return res.status(500).json({ error: "Server is missing Razorpay keys in .env" });
    }

    const options = {
      amount: amount, // amount in smallest currency unit (paise/cents)
      currency: currency || "USD",
      receipt: receipt || "receipt_" + Math.random().toString(36).substring(7),
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error("Order Creation Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Endpoint to securely verify the payment signature and update subscription
app.post('/api/verify-payment', async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userId } = req.body;

  if (!userId) {
    return res.status(400).json({ success: false, message: "Missing userId in request body!" });
  }

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest('hex');

  const isAuthentic = expectedSignature === razorpay_signature;

  if (isAuthentic) {
    if (admin.apps.length > 0) {
      try {
        const db = admin.firestore();
        const renewalDate = new Date();
        renewalDate.setFullYear(renewalDate.getFullYear() + 1);

        // Securely update the user's Pro status in Firestore directly from the server
        await db.collection('users').doc(userId).set({
          isPro: true,
          subscriptionRenewal: renewalDate.toLocaleDateString(),
        }, { merge: true });

        console.log(`✅ Securely upgraded user ${userId} to Pro status in Firestore.`);
        res.json({ success: true, message: "Payment verified and user database updated successfully!" });
      } catch (dbError) {
        console.error("❌ Database Update Error:", dbError);
        res.status(500).json({ success: false, message: "Payment verified but database update failed: " + dbError.message });
      }
    } else {
      console.warn("⚠️ Firebase Admin not initialized. Simulated successful payment verification.");
      res.json({ success: true, message: "Payment verified successfully (Mock Database Mode)." });
    }
  } else {
    res.status(400).json({ success: false, message: "Invalid Signature!" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Secure Payment Backend running on http://localhost:${PORT}`);
});
