'use strict';
const express = require('express');
const axios = require('axios');
const jsonWallet = require('./wallet');
const app = express();

const SHOPPER_ID = "5bb35916cafe6fcc4dd16ef3";

const API_KEY = "dd0826c0c63711e8a28e3fa29e9358da";
const API_SECRET = "e0eb86ffeb73c25f985ea2fe7a606476af124511fa0c8d906fefdc2f9331e44c6c89b2bc2c26b9b6d0cf5f460a8d3f54c649334b204518de57a54bd7a8519918c27dbfe064dd14c0dc677fb8f0391cbba1706629bad5116f6ee1f7ff10c27b2a7d1294da88f61775169e811be9c268695ece16cd45026eaf01c753f74cb5f121";
const URL = "http://localhost:3000/v1/payments"


app.use('/static', express.static('public'));
app.get('/', async (req, res, next) => {
    try {
        // Get LimePay Token and return it to the UI

        let result = await axios({
            method: "POST",
            url: URL,
            headers: {
                "Content-Type": "application/json",
                "Cache-Control": "no-cache",
                "Authorization": "Basic " + Buffer.from(API_KEY + ":" + API_SECRET).toString('base64')
            },
            data: {
                "currency": "USD",
                "shopper": SHOPPER_ID,
                "items": [
                    {
                        "description": "Негърч1е",
                        "amount": 100.4,
                        "quantity": 1
                    },
                    {
                        "description": "Death Nigga2",
                        "amount": 23.2,
                        "quantity": 2
                    }
                ],
                "fundTxData": {
                    "tokenAmount": "10000000000000000000",
                    "weiAmount": "60000000000000000"
                },
                "genericTransactions": [
                    {
                        "gasPrice": "18800000000",
                        "gasLimit": "4700000",
                        "to": "0xc8b06aA70161810e00bFd283eDc68B1df1082301",
                        "functionName": "transfer"
                    },
                    {
                        "gasPrice": "18800000000",
                        "gasLimit": "4700000",
                        "to": "0xc8b06aA70161810e00bFd283eDc68B1df1082301",
                        "functionName": "transfer"
                    }
                ]
            }
        });
        let token = result.headers["x-lime-token"];
        res.json({ token: token, jsonWallet: jsonWallet });
    } catch (err) {
        res.json(err.response.data);

    }
});

app.use((err, request, response, next) => {
    console.log(err);
    response.status(500).send("Something went wrong.");
});

var server = app.listen(9090, () => {
    console.log("Marketplace app listening at http://localhost:" + 9090);
});