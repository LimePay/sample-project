'use strict';
const express = require('express');
const axios = require('axios');
const LimePaySDK = require('limepay');
let LimePay;

const shopperWallet = require('./shopper-wallet');
const signerWallet = require('./signer-wallet');
const CONFIG = require('./config');


const signerWalletConfig = {
    encryptedWallet: {
        jsonWallet: JSON.stringify(signerWallet),
        password: CONFIG.SIGNER_WALLET_PASSPHRASE
    }
};

const app = express();

// Connect to LimePay API

app.use('/', express.static('public'));

app.post('/fiatPayment', async (request, response, next) => {
    try {
        const fiatPaymentData = getFiatData();
        fiatPaymentData.shopper = "5c3e090cfd77ee6054c03883";  // Hard-coded shopper ID
        
        const createdPayment = await LimePay.fiatPayment.create(fiatPaymentData, signerWalletConfig);
        response.json({ token: createdPayment.limeToken });
    } catch (error) {
        next(error);
    }

});

app.post('/relayedPayment', async (request, response, next) => {
    try {
        const relayedPaymentData = getRelayedData();
        relayedPaymentData.shopper = "5c3e090cfd77ee6054c03883";  // Hard-coded shopper ID
    
        const createdPayment = await LimePay.relayedPayment.create(relayedPaymentData, signerWalletConfig);
        response.json({ token: createdPayment.limeToken });
    } catch (error) {
        next(error)
    }

});

app.get('/shopperWallet', async (req, res, next) => {
    res.json(shopperWallet);
});

app.use((err, request, response, next) => {
    console.log(err);
    response.status(500).send(err);
});

app.listen(9090, async () => {
    LimePay = await LimePaySDK.connect({
        environment: 'http://localhost:3000/v1', // LimePay.Environment.Sandbox.Default,
        apiKey: CONFIG.API_KEY,
        secret: CONFIG.API_SECRET
    });

    console.log(`Sample app listening at http://localhost:` + 9090)
});

const getFiatData = () => {
    return {
        currency: "USD",
        items: [
            {
                description: "Some good description",
                lineAmount: 100.4,
                quantity: 1
            },
            {
                description: "Another description",
                lineAmount: 25.2,
                quantity: 2
            }
        ],
        fundTxData: {
            tokenAmount: "10000000000000000000",
            weiAmount: "60000000000000000"
        },
        genericTransactions: [
            {
                gasPrice: "18800000000",
                gasLimit: "4700000",
                to: "0xc8b06aA70161810e00bFd283eDc68B1df1082301",
                functionName: "transfer",
                functionParams: [
                    {
                        type: 'address',
                        value: "0x1835f2716ba8f3ede4180c88286b27f070efe985",
                    },
                    {
                        type: 'uint',
                        value: 0,
                    }
                ]
            }
        ]
    };
};

const getRelayedData = () => {
    return {
        fundTxData: {
            weiAmount: "60000000000000000"
        },
        genericTransactions: [
            {
                gasPrice: "18800000000",
                gasLimit: "4700000",
                to: "0xc8b06aA70161810e00bFd283eDc68B1df1082301",
                functionName: "transfer",
                functionParams: [
                    {
                        type: 'address',
                        value: "0x1835f2716ba8f3ede4180c88286b27f070efe985",
                    },
                    {
                        type: 'uint',
                        value: 0,
                    }
                ]
            }
        ]
    }
}