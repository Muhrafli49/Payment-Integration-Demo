import express, { response } from "express";
import midtransClient from "midtrans-client";
import dotenv from "dotenv";

dotenv.config(); 

const router = express.Router(); 

router.post('/process-payment', async (req, res) => {
    try {
        const snap = new midtransClient.Snap({
            isProduction: false,
            serverKey: process.env.MIDTRANS_SERVER_KEY,
            clientKey: process.env.MIDTRANS_CLIENT_KEY,
        });

        const parameter = {
            transaction_details: {
                order_id: req.body.order_id,
                gross_amount: req.body.total
            },
            customer_details : {
                first_name: req.body.name
            }
        }

        snap.createTransaction(parameter).then((transaction) => {
            const dataPayment = {
                response: JSON.stringify(transaction)
            }
            const token = transaction.token
    
        res.status(200).json({ message: "Midtrans client initialized successfully.", dataPayment, token: token });
        })



    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
