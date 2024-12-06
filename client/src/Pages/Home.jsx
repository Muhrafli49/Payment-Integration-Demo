import React, { useEffect, useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import axios from "axios";


const Home = () => {
    const [name, setName] = useState("");
    const [order_id, setOrder_id] = useState("");
    const [total, setTotal] = useState(0);
    const [token, setToken] = useState("");

    const processPayment = async () => {
        const data = {
            name: name,
            order_id: order_id,
            total: total
        }

        const config = {
            headers: {
                "Content-Type": "application/json",
            }
        }

        const response = await axios.post(
            "http://localhost:5000/api/payment/process-payment", 
            data, 
            config
        );

        setToken(response.data.token);

    };

    useEffect(() => {
        if (token) {
            window.snap.pay(token, {
                onSuccess: (result) => {
                    localStorage.setItem("payment", JSON.stringify(result));
                    setToken("");
                },
                onPending: (result) => {
                    localStorage.setItem("payment", JSON.stringify(result));
                    setToken("");
                },
                onError: (error) => {
                    console.log(error);
                    setToken("");
                },
                onClose: () => {
                    console.log("Anda belum menyelesaikan pembayaran ini");
                    setToken("");
                }

            });

            setName("");
            setOrder_id("");
            setTotal("");
        }
    }, [token]);


    useEffect(() => {
        const midtransUrl = "https://app.sandbox.midtrans.com/snap/snap.js";
    
        const clientKey = import.meta.env.VITE_MIDTRANS_CLIENT_KEY;

        if (!clientKey) {
            console.error("Client Key not found in environment variables.");
        }        
    
        let scriptTag = document.createElement("script");
        scriptTag.src = midtransUrl;

        scriptTag.setAttribute("data-client-key", clientKey);
        document.body.appendChild(scriptTag);
    }, []);
    


return (
    <Box
        className="container"
        sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            height: "100vh",
            width: "100vw",
            padding: 4,
        }}
        >
        {/* Judul */}
        <Typography variant="h4" sx={{ mb: 4, fontWeight: "bold" }}>
            Payment
        </Typography>

        {/* Form */}
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "100%",
                maxWidth: "500px",
            }}
        >
            <TextField
                type="text"
                label="Nama"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
                sx={{ mb: 3 }}
            />
            <TextField
                type="text"
                label="Order ID"
                value={order_id}
                onChange={(e) => setOrder_id(e.target.value)}
                fullWidth
                sx={{ mb: 3 }}
            />
            <TextField
                type="number"
                label="Total"
                value={total}
                onChange={(e) => setTotal(e.target.value)}
                fullWidth
                sx={{ mb: 3 }}
            />
        </Box>

        {/* Tombol */}
        <Button
            onClick={processPayment}
            variant="contained"
            color="primary"
            size="large"
            sx={{ mt: 2, textTransform: "none", paddingX: 4 }}
        >
            Pembayaran
        </Button>
        </Box>
    );
};

export default Home;
