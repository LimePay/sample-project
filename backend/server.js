'use strict';
const express = require('express');
const axios = require('axios');
const jsonWallet = require('./wallet');
const app = express();

const HOST = require('./../config/config').HOST;


// test server
// const API_KEY = "d5888510d14611e8bbe2c9ba0f136f8e";
// const API_SECRET = "0b9b786307efbfc5efebe1b38001bc62462c4addb087f5454db2402da0a58ad1b1acba3bde721a903ad0a43f36af6b1f1b877e6239cf2b689757add8034b89ded08e1e9e61035977688e4ba6be263c295d96d75f353a040f1eaab4a071d970a24cc77bd1e87d79bfaee4cb2ea87cb35ecee9015b6f5ad81c01a55922f80fc861";
// const SHOPPER_ID = "5bc5e9baf02b0a0c0604f067";

// local 
const API_KEY = "2953b240d2d811e88c12d7de8c5db96a";
const API_SECRET = "2ac908132bdd21e000febb675dc6d7e4109043b81a7c71e847a28a684c7c5947b4879c343b88674df37402b1ad90036808660e30ed03c5866608b0445698e7b3097d302c8f1413d71162ce9e24f8484afdb6035f4b374a2e654b74abd853adefaec85909014e6a1cce78c235937c9a49ecbe9bf9bbef5868d45371d400b26099";
const SHOPPER_ID = "5bc8893817b9b4cbddf3920a";

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
                        "amount": 100.4,
                        "quantity": 1
                    },
                    {
                        "description": "Another description",
                        "amount": 25.2,
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
                    // {
                    //     "gasPrice": "18800000000",
                    //     "gasLimit": "4700000",
                    //     "to": "0xc8b06aA70161810e00bFd283eDc68B1df1082301",
                    //     "functionName": "transfer"
                    // }
                ]
            }
        });
        
        let token = result.headers["x-lime-token"];
        res.json({ token: token, jsonWallet: jsonWallet });
    } catch (err) {
        //console.log('==========================>>>>> ERROR'); // TypeError: Converting circular structure to JSON
        //console.log(err.response ? err.response.data : err);
        // res.json(err.response ? err.response.data : err); // TypeError: Converting circular structure to JSON
        res.json(err);
    }
});

app.use((err, request, response, next) => {
    console.log(err);
    response.status(500).send("Something went wrong.");
});

var server = app.listen(9090, () => {
    console.log(`Sample app listening at http://localhost:` + 9090);
});