'use strict';
const express = require('express');
const axios = require('axios');
const jsonWallet = require('./wallet'); // const password = "1234567890";
const app = express();

const CONFIG = require('./../config/config');
const HOST = CONFIG.HOST;
const APP_CREDENTIALS = CONFIG.APP_CREDENTIALS;

// organization = 5be1b8ba9cb8aa22efadc827
const API_KEY = APP_CREDENTIALS.API_KEY;
const API_SECRET = APP_CREDENTIALS.API_SECRET;
const SHOPPER_ID = APP_CREDENTIALS.SHOPPER_ID;

const URL = HOST + "/v1/payments"

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
                        "description": "Some good description",
                        "lineAmount": 100.4,
                        "quantity": 1
                    },
                    {
                        "description": "Another description",
                        "lineAmount": 25.2,
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
                        "functionName": "transfer",
                        "functionParams": [
                            {
                                type: 'address',
                                value: "0x1835f2716ba8f3ede4180c88286b27f070efe985",
                            },
                            {
                                type: 'uint',
                                value: 1,
                            }
                        ]
                    }
                ]
            }
        });
        
        let token = result.headers["x-lime-token"];
        
        // res.json({ token: token, jsonWallet: jsonWallet });
        res.json({ token: token });
    } catch (err) {
        console.log('ERROR');
        console.log(err.response ? err.response.data : err);

        res.json(err.response ? err.response.data : err);
    }
});

app.get('/wallet', async (req, res, next) => {
    res.json({ jsonWallet: JSON.stringify(jsonWallet) });
});

app.use((err, request, response, next) => {
    console.log(err);
    response.status(500).send("Something went wrong.");
});

var server = app.listen(9090, () => {
    console.log(`Sample app listening at http://localhost:` + 9090);
});