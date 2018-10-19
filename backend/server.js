'use strict';
const express = require('express');
const axios = require('axios');
const jsonWallet = require('./wallet');
const app = express();


// // Created in the Remote Test MongoDB
// const VENDOR_ID = "5ba3826bc190b1bc2362d2b7";
// const SHOPPER_ID = "5ba385a0c190b1bc2362d2c7";

// const API_KEY = "1888c350bcc711e898ec3dfe32153918";
// const API_SECRET = "be26192f19a05d1101569b7454d7ea88eb78d1b48c54ee7d9bcbc18da010ee7416d60ff9769e27cc836bd6e5e6ac4f5693412133bf62782039abc1199cc46bb5a13a994efbbd3bd5b762bdae8aa9fe2c3a041c8b7fcfda94f4c0e540f78bd326c4489ad89be7cc646308871f5b9be52406cd370285238c6bf3da842a7c9e8858";
// Created in the Remote Test MongoDB
const SHOPPER_ID = "5bc8a40c0fc36833261220c3";

const API_KEY = "673dc9a0d04a11e88f350bc23d81661d";
const API_SECRET = "3f21013f25b78841feb5242d7752aa3fb443ff6888a93e5fc529d89910af7d39e9ed94a9f24299e7755d6a7c790e0c342f5e6dd47c229ca88fb1783128aeea3f4d102f407994cf8ddfb826808e3520fc55cd8b1bdcb2291df39fc7623c878ffa734ac01b24039c8a6ffd2fa6bd95e35bb23dc6ed96c3ba4adca8860354dd8f7b";
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
                        "totalAmount": 100,
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
                        "spender": "0x1835f2716ba8f3ede4180c88286b27f070efe985",
                        "functionName": "transfer"
                    },
                    {
                        "gasPrice": "18800000000",
                        "gasLimit": "4700000",
                        "to": "0xc8b06aA70161810e00bFd283eDc68B1df1082301",
                        "spender": "0x1835f2716ba8f3ede4180c88286b27f070efe985",
                        "functionName": "transfer"
                    }
                ]
            }
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
    console.log("Marketplace app listening at http://localhost:" + 9090);
});