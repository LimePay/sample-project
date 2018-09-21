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
const VENDOR_ID = "5ba10253b9e474784acd6d90";
const SHOPPER_ID = "5ba10255b9e474784acd6d93";

const API_KEY = "9b09af30bb4911e8aafbc1d2743b4199";
const API_SECRET = "0a8e5cdc1d1fa7f5786f387167c88572f4114d3769984305eb805a7efd35300354b8ad8c880f977a0ba4ee3918d7cc4904c056cac03fda19261264112a753ecf20ea4972f008f4ded23f25238a420bb34c7b9ca4b8bdc9ce6292940f174cf05a5d831322048c46bfbfab50bebea159a44fc3509472577d83a6a76929b610bc75";
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
                "vendor": VENDOR_ID,
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
                        "contractAddress": "0xc8b06aA70161810e00bFd283eDc68B1df1082301",
                        "spender": "0x1835f2716ba8f3ede4180c88286b27f070efe985",
                        "functionName": "transfer"
                    },
                    {
                        "gasPrice": "18800000000",
                        "gasLimit": "4700000",
                        "contractAddress": "0xc8b06aA70161810e00bFd283eDc68B1df1082301",
                        "spender": "0x1835f2716ba8f3ede4180c88286b27f070efe985",
                        "functionName": "transfer"
                    }
                ]
            }
        });
        let token = result.headers["x-lime-token"];
        res.json({ token: token, jsonWallet: jsonWallet });
    } catch (err) {
        console.log(err);
    }
});

app.use((err, request, response, next) => {
    console.log(err);
    response.status(500).send("Something went wrong.");
});

var server = app.listen(9090, () => {
    console.log("Marketplace app listening at http://localhost:" + 9090);
});