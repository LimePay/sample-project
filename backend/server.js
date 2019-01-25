'use strict';
const express = require('express');
const axios = require('axios');
const ethers = require('ethers');

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
        const fiatPaymentData = await getFiatData();
        fiatPaymentData.shopper = "5c3e090cfd77ee6054c03883";  // Hard-coded shopper ID
        
        const createdPayment = await LimePay.fiatPayment.create(fiatPaymentData, signerWalletConfig);
        response.json({ token: createdPayment.limeToken });
    } catch (error) {
        next(error);
    }

});

app.post('/relayedPayment', async (request, response, next) => {
    try {
        const relayedPaymentData = await getRelayedData();
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
        environment: LimePaySDK.Environment.Sandbox, // LimePaySDK.Environment.Production,
        apiKey: CONFIG.API_KEY,
        secret: CONFIG.API_SECRET
    });

    console.log(`Sample app listening at http://localhost:` + 9090)
});

const getFiatData = async () => {
    const gasPrice = await getGasPrice();

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
                gasPrice,
                gasLimit: 4700000,
                to: "0x30D25785515bE27d0B46Ab41Ed57dBAbf8A9cFf6",
                functionName: "approve",
                functionParams: [
                    {
                        type: 'address',
                        value: "0x37688cFc875DC6AA6D39fE8449A759e434a86482",
                    },
                    {
                        type: 'uint',
                        value: '10000000000000000000',
                    }
                ]
            },
            {
                gasPrice,
                gasLimit: 4700000,
                to: "0x37688cFc875DC6AA6D39fE8449A759e434a86482",
                functionName: "buySomeService",
                functionParams: []
            }
        ]
    };
};

const getRelayedData = async () => {
    const gasPrice = await getGasPrice();
    return {
        fundTxData: {
            weiAmount: "60000000000000000"
        },
        genericTransactions: [
            {
                gasPrice,
                gasLimit: 4700000,
                to: "0x30D25785515bE27d0B46Ab41Ed57dBAbf8A9cFf6",
                functionName: "approve",
                functionParams: [
                    {
                        type: 'address',
                        value: "0x37688cFc875DC6AA6D39fE8449A759e434a86482",
                    },
                    {
                        type: 'uint',
                        value: '10000000000000000000',
                    }
                ]
            },
            {
                gasPrice,
                gasLimit: 4700000,
                to: "0x37688cFc875DC6AA6D39fE8449A759e434a86482",
                functionName: "buySomeService",
                functionParams: []
            }
        ]
    }
}

const getGasPrice = async () => {
    var price = await axios.get(CONFIG.GAS_STATION_URL);
    var parsedPrice = ethers.utils.parseUnits((price.data.fast / 10).toString(10), 'gwei');
    return parsedPrice.toString();
}