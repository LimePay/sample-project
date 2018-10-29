'use strict';
const express = require('express');
const axios = require('axios');
const jsonWallet = require('./wallet');
const app = express();

const SHOPPER_ID = "5bd71b73fa7b2860da1ac0ac";

const API_KEY = "13fb6d80db8811e8a21bb9d012985814";
const API_SECRET = "309c4802c54be8257b48c1b337e284a7a46b29061691cbf4bcccbc1d29c0a7e65f20fd4c8f34c1d07f755c7555de1139be56b6a55bf0748fa6eccd48b4b9a72b5d3f7e8c62e6dcbddfc95c3dae1b9f9665d1bdac30cd402068e37918f6e93d1e40d07aba006d6c49170780f750462b06ff40348697e0bbfb9b842ab9eb4e6950";
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
                        "description": "Credit",
                        "lineAmount": 100,
                        "quantity": 42.5
                    },
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
        res.json({ token: token });
    } catch (err) {
        res.json(err.response.data);

    }
});

app.get('/wallet', async (req, res, next) => {
    res.json({ jsonWallet: jsonWallet });
});

app.use((err, request, response, next) => {
    console.log(err);
    response.status(500).send("Something went wrong.");
});

var server = app.listen(9090, () => {
    console.log("Marketplace app listening at http://localhost:" + 9090);
});