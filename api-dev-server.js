// Local development API server
// Run with: node api-dev-server.js
// This mimics the Vercel serverless functions locally

import express from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// POST /api/create-order
app.post('/api/create-order', async (req, res) => {
    try {
        const { amount, currency = 'INR' } = req.body;

        if (!amount || amount <= 0) {
            return res.status(400).json({ error: 'Invalid amount' });
        }

        const options = {
            amount: Math.round(amount),
            currency,
            receipt: `receipt_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);

        return res.status(200).json({
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
        });
    } catch (error) {
        console.error('Razorpay order creation failed:', error);
        return res.status(500).json({ error: 'Failed to create order' });
    }
});

// POST /api/verify-payment
app.post('/api/verify-payment', async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({ error: 'Missing payment details' });
        }

        const body = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body)
            .digest('hex');

        const isAuthentic = expectedSignature === razorpay_signature;

        if (isAuthentic) {
            return res.status(200).json({
                verified: true,
                paymentId: razorpay_payment_id,
                orderId: razorpay_order_id,
            });
        } else {
            return res.status(400).json({
                verified: false,
                error: 'Payment signature verification failed',
            });
        }
    } catch (error) {
        console.error('Payment verification failed:', error);
        return res.status(500).json({ error: 'Verification failed' });
    }
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`✅ API dev server running on http://localhost:${PORT}`);
    console.log(`   Razorpay Key ID: ${process.env.RAZORPAY_KEY_ID ? '✓ loaded' : '✗ missing'}`);
    console.log(`   Razorpay Secret: ${process.env.RAZORPAY_KEY_SECRET ? '✓ loaded' : '✗ missing'}`);
});
