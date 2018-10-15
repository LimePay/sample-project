'use strict';
const express = require('express');
const axios = require('axios');
const jsonWallet = require('./wallet');
const app = express();

const SHOPPER_ID = "5bc4735d3957e20cad01dd6e";

const API_KEY = "78d7eb40d06911e8835a1fc6c684b570";
const API_SECRET = "6f5a17f3535c243236cf0aa2736eda24c980de97dfaf3b79d29614ac1e38a6015ff80472d97ae050a5ce1a0852e2b8e053a4dfcd5be4d7ac4275e32a38f7be2e71b95754ed57d19b57c6846f9c66c18da25a72ad5d01797fd2f87372d9f3881492f01cc76ff7ad0e664f811df451a621b47af87977d4264a48edfc008c58f8c3";
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