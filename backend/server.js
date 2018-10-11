'use strict';
const express = require('express');
const axios = require('axios');
const jsonWallet = "Shopper's JSON Wallet";
const app = express();

const LIME_PAY_BASE_URL;

const VENDOR_ID = "YOUR_VENDOR_ID_HERE";
const SHOPPER_ID = "SHOPPERS_ID_HERE";

const API_KEY = "YOUR_API_KEY_HERE";
const API_SECRET = "YOUR_SECRET_HERE";
const CREATE_PAYMENT_URL = LIME_PAY_BASE_URL + "/v1/payments"


app.use('/static', express.static('public'));

app.get('/', async (req, res, next) => {
    try {
        // Get LimePay Token and return it to the UI

        let paymentData = {
            "currency": "USD",
            "shopper": SHOPPER_ID,
            "vendor": VENDOR_ID,
            "items": [
                {
                    "description": "my crypto apple",
                    "amount": 100,
                    "quantity": 1
                }
            ],
            "fundTxData": {
                "tokenAmount": "10000000000000000000",
                "weiAmount": "60000000000000000"
            },
            "genericTransactions": [
                {
                    "to": "0xc8b06aA70161810e00bFd283eDc68B1df1082301",
                    "gasPrice": "18800000000",
                    "gasLimit": "4700000",
                    "functionName": "approve"
                },
                {
                    "to": "0x07F3fB05d8b7aF49450ee675A26A01592F922734",
                    "gasPrice": "18800000000",
                    "gasLimit": "4700000",
                    "functionName": "buySomeService"
                }
            ]
        }

        let result = await axios({
            method: "POST",
            url: CREATE_PAYMENT_URL,
            headers: {
                "Content-Type": "application/json",
                "Cache-Control": "no-cache",
                "Authorization": "Basic " + Buffer.from(API_KEY + ":" + API_SECRET).toString('base64')
            },
            data: paymentData
        });

        let token = result.headers["x-lime-token"];
        res.json({ token: token, jsonWallet: jsonWallet });
    } catch (err) {
        console.log(err.response.data);
    }
});

app.use((err, request, response, next) => {
    console.log(err);
    response.status(500).send("Something went wrong.");
});

var server = app.listen(9090, () => {
    console.log("Sample APP listening at http://localhost:" + 9090);
});