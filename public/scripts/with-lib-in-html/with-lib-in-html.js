let processPayment;
let processRelayedPayment;
let onInvalidCompanyField;

let USE_LOCAL_SERVER = true;
let USE_ENCRYPTED_MNEMONIC_WALLET = false;

window.onload = async function () {
    (function populateDropdownWithCountryCodes() {
        $.getJSON('./../static/constants/countries-codes.json', function (countriesCodes) {
            $.each(countriesCodes, function (code) {
                let dropdownCountryCode = `<option value="${code}">${code} (${countriesCodes[code]})</option>`;
                $(dropdownCountryCode).appendTo("#countries-codes");
            });
        });
    })();

    var result = await $.get('/');

    processAnimation.init();

    let url = USE_LOCAL_SERVER ? "http://localhost:3000" : 'http://test-limepay-api.eu-west-1.elasticbeanstalk.com';

    let limePayConfig = {
        URL: url,
        eventHandler: {
            onSuccessfulSubmit: function () {
                alert('Your payment was send for processing');
                processAnimation.stopProcessingAnimation();
                // Implement some logic
            },
            onFailedSubmit: function (err) {
                console.log(err);
                alert('Your payment failed');
                processAnimation.stopProcessingAnimation();
                // Implement some logic
            }
        }
    }

    LimePayWeb.init(result.token, limePayConfig).then(async () => {

        /* 
        Once LimePayWeb is initialized you can calculateVAT
        You need to pass the following object:

            {
                countryCode: 'bg', // required
                isCompany: false, // required
                vatNumber: 123456789 // optional
            }
        
            Example:
                let paymentTotalAmount = await LimePayWeb.utils.calculateVAT({
                    countryCode: 'bg',
                    isCompany: false
                });

                console.log(`Your purchase amount: ${paymentTotalAmount.data.totalAmount}\nVat rate: ${paymentTotalAmount.data.rate}`);
        */
    }).catch((err) => {
        console.log(err);
        console.log(err.message);
        alert('Form initialization failed');
        // Implement some logic
    });
    
    let resultFromRelayedToken = await $.get('/relayed');
    LimePayWeb.initRelayedPayment(resultFromRelayedToken.token, limePayConfig).then(async () => {

        /* 
        Once LimePayWeb is initialized you can calculateVAT
        You need to pass the following object:

            {
                countryCode: 'bg', // required
                isCompany: false, // required
                vatNumber: 123456789 // optional
            }
        
            Example:
                let paymentTotalAmount = await LimePayWeb.utils.calculateVAT({
                    countryCode: 'bg',
                    isCompany: false
                });

                console.log(`Your purchase amount: ${paymentTotalAmount.data.totalAmount}\nVat rate: ${paymentTotalAmount.data.rate}`);
        */
    }).catch((err) => {
        console.log(err);
        console.log(err.message);
        alert('Form initialization failed RELAYED payment');
        // Implement some logic
    });

    processPayment = async function () {
        const cardHolderInformation = {
            vatNumber: document.getElementById('vat-number').value,
            name: document.getElementById('card-holder-name').value,
            countryCode: document.getElementById('countries-codes').value,
            zip: document.getElementById('zip-code').value,
            street: document.getElementById('street-address').value
        };
    
        if (document.getElementById('company').checked) {
            cardHolderInformation.isCompany = true;
        } else if (document.getElementById('personal').checked) {
            cardHolderInformation.isCompany = false;
        } else {
            throw new Error('Neither company, neither personal option is selected');
        }
    
        let signedTransactions = await getSignedTransactions();

        await LimePayWeb.PaymentService.processRelayedPayment(signedTransactions);
        await LimePayWeb.PaymentService.processPayment(cardHolderInformation, signedTransactions);

    }

    processRelayedPayment = async function () {
        processAnimation.startProcessingAnimation();
        let signedTransactions = await getSignedTransactions();

        await LimePayWeb.PaymentService.processRelayedPayment(signedTransactions);
    }

    async function getSignedTransactions () {
        let wallet = await $.get('/wallet');
        let signedTransactions = await signTransactions(wallet.jsonWallet);

        return signedTransactions;
    }

    async function signTransactions(wallet) {

        const password = "1234567890";
        
        let tokenABI = getTokenABI();
        // let tokenABI = getTokenABI_EMPTY_INPUT();
        // let tokenABI = getTokenABI_WITH_ARRAY_INPUT();
        // let tokenABI = getTokenABI_boolean();
          
        let transactions = [{
            to: '0xc8b06aA70161810e00bFd283eDc68B1df1082301',
            abi: tokenABI,
            gasLimit: 4700000,
            value: 0,
            functionName: "transfer",
            functionParams: ["0x1835f2716ba8f3ede4180c88286b27f070efe985",  0]
        }
        // {
        //     to: '0xc8b06aA70161810e00bFd283eDc68B1df1082301',
        //     abi: tokenABI,
        //     gasLimit: 4700000,
        //     value: 0,
        //     fnName: "transfer",
        //     params: ["0x1835f2716ba8f3ede4180c88286b27f070efe985", 1]
        // }
        ];

        // EXAMPLE 
        // let walletConfiguration = {
        //     encryptedWallet: {
        //         jsonWallet: jsonWallet,
        //         password: 1
        //     },
        //     decryptedWallet: wallet,
        //     privateKey: 'privateKey',
        //     mnemonic: {
        //         mnemonic: 'mnemonic',
        //         nonEnglishLocaleWorldList: 'bg'
        //     }
        // }

        // current used mnemonic
        // mnemonic: saddle must leg organ divide fiction cupboard nothing useless flower polar arrive
        // private key: 0xeacb4d87df63eecc3f056259cb631f925593f2bc93a41d36add12a855991d031
        // public key: 0x047c226e3791cb631ffd1b6aa20b8399759a1e18b8ad4b428ee979e14dec6816877deba886b57c411e4b4d368b4f9e40a4055186ffbddefe25cc8251891825cb79
        // address: 0x5AA6201D8F95a44e50b647dc52aa9Bc824f656f0

        // random mnemonic
        //let mnemonic = ethers.utils.HDNode.entropyToMnemonic(ethers.utils.randomBytes(16));
        ///console.log(`Mnemonic: ${mnemonic}`);

        let mnemonic = 'saddle must leg organ divide fiction cupboard nothing useless flower polar arrive';
        let wallet1 = ethers.Wallet.fromMnemonic(mnemonic);
        // let wallet1 = ethers.Wallet.createRandom(); // cant use this variant for successful payment because shopper's wallet address would be different from generated one.

        let encryptedWalletFromMnemonic = await wallet1.encrypt(password);

        let decryptedWallet = await ethers.Wallet.fromEncryptedJson(USE_ENCRYPTED_MNEMONIC_WALLET ? encryptedWalletFromMnemonic : wallet, password);
        
        let walletConfiguration = {
            decryptedWallet: decryptedWallet // Decrypted wallet for example created from ethers.Wallet.createRandom()
        }
        
        // let walletConfiguration = {
        //     encryptedWallet: {
        //         jsonWallet: JSON.parse(USE_ENCRYPTED_MNEMONIC_WALLET ? encryptedWalletFromMnemonic : wallet),
        //         password: password
        //     }
        // }
        
        // let walletConfiguration = {
        //     privateKey: '0xeacb4d87df63eecc3f056259cb631f925593f2bc93a41d36add12a855991d031'
        // }
        
        // let walletConfiguration = {
        //     mnemonic: {
        //         mnemonic: 'saddle must leg organ divide fiction cupboard nothing useless flower polar arrive',
        //         nonEnglishLocaleWorldList: null // default value is 'null' for english, if mnemonic is in italian, these field should be 'it' 
        //     }
        // }
        
        let result = await LimePayWeb.TransactionsBuilder.buildSignedTransactions(walletConfiguration, transactions);

        return result;
    }

    function getTokenABI() {
        return [{
                "constant": true,
                "inputs": [],
                "name": "name",
                "outputs": [{
                    "name": "",
                    "type": "string"
                }],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [{
                        "name": "_spender",
                        "type": "address"
                    },
                    {
                        "name": "_value",
                        "type": "uint256"
                    }
                ],
                "name": "approve",
                "outputs": [{
                    "name": "",
                    "type": "bool"
                }],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [],
                "name": "totalSupply",
                "outputs": [{
                    "name": "",
                    "type": "uint256"
                }],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [{
                        "name": "_from",
                        "type": "address"
                    },
                    {
                        "name": "_to",
                        "type": "address"
                    },
                    {
                        "name": "_value",
                        "type": "uint256"
                    }
                ],
                "name": "transferFrom",
                "outputs": [{
                    "name": "",
                    "type": "bool"
                }],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [],
                "name": "INITIAL_SUPPLY",
                "outputs": [{
                    "name": "",
                    "type": "uint256"
                }],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [],
                "name": "decimals",
                "outputs": [{
                    "name": "",
                    "type": "uint8"
                }],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [{
                        "name": "_spender",
                        "type": "address"
                    },
                    {
                        "name": "_subtractedValue",
                        "type": "uint256"
                    }
                ],
                "name": "decreaseApproval",
                "outputs": [{
                    "name": "",
                    "type": "bool"
                }],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [{
                    "name": "_owner",
                    "type": "address"
                }],
                "name": "balanceOf",
                "outputs": [{
                    "name": "",
                    "type": "uint256"
                }],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [],
                "name": "symbol",
                "outputs": [{
                    "name": "",
                    "type": "string"
                }],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [{
                        "name": "_to",
                        "type": "address"
                    },
                    {
                        "name": "_value",
                        "type": "uint256"
                    }
                ],
                "name": "transfer",
                "outputs": [{
                    "name": "",
                    "type": "bool"
                }],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [{
                        "name": "_spender",
                        "type": "address"
                    },
                    {
                        "name": "_addedValue",
                        "type": "uint256"
                    }
                ],
                "name": "increaseApproval",
                "outputs": [{
                    "name": "",
                    "type": "bool"
                }],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [{
                        "name": "_owner",
                        "type": "address"
                    },
                    {
                        "name": "_spender",
                        "type": "address"
                    }
                ],
                "name": "allowance",
                "outputs": [{
                    "name": "",
                    "type": "uint256"
                }],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "constructor"
            },
            {
                "anonymous": false,
                "inputs": [{
                        "indexed": true,
                        "name": "owner",
                        "type": "address"
                    },
                    {
                        "indexed": true,
                        "name": "spender",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "name": "value",
                        "type": "uint256"
                    }
                ],
                "name": "Approval",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [{
                        "indexed": true,
                        "name": "from",
                        "type": "address"
                    },
                    {
                        "indexed": true,
                        "name": "to",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "name": "value",
                        "type": "uint256"
                    }
                ],
                "name": "Transfer",
                "type": "event"
            }
        ]
    }

    function getTokenABI_EMPTY_INPUT() {
        return [{
                "constant": true,
                "inputs": [],
                "name": "name",
                "outputs": [{
                    "name": "",
                    "type": "string"
                }],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [{
                        "name": "_spender",
                        "type": "address"
                    },
                    {
                        "name": "_value",
                        "type": "uint256"
                    }
                ],
                "name": "approve",
                "outputs": [{
                    "name": "",
                    "type": "bool"
                }],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [],
                "name": "totalSupply",
                "outputs": [{
                    "name": "",
                    "type": "uint256"
                }],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [{
                        "name": "_from",
                        "type": "address"
                    },
                    {
                        "name": "_to",
                        "type": "address"
                    },
                    {
                        "name": "_value",
                        "type": "uint256"
                    }
                ],
                "name": "transferFrom",
                "outputs": [{
                    "name": "",
                    "type": "bool"
                }],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [],
                "name": "INITIAL_SUPPLY",
                "outputs": [{
                    "name": "",
                    "type": "uint256"
                }],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [],
                "name": "decimals",
                "outputs": [{
                    "name": "",
                    "type": "uint8"
                }],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [{
                        "name": "_spender",
                        "type": "address"
                    },
                    {
                        "name": "_subtractedValue",
                        "type": "uint256"
                    }
                ],
                "name": "decreaseApproval",
                "outputs": [{
                    "name": "",
                    "type": "bool"
                }],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [{
                    "name": "_owner",
                    "type": "address"
                }],
                "name": "balanceOf",
                "outputs": [{
                    "name": "",
                    "type": "uint256"
                }],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [],
                "name": "symbol",
                "outputs": [{
                    "name": "",
                    "type": "string"
                }],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [],
                "name": "transfer",
                "outputs": [{
                    "name": "",
                    "type": "bool"
                }],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [{
                        "name": "_spender",
                        "type": "address"
                    },
                    {
                        "name": "_addedValue",
                        "type": "uint256"
                    }
                ],
                "name": "increaseApproval",
                "outputs": [{
                    "name": "",
                    "type": "bool"
                }],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [{
                        "name": "_owner",
                        "type": "address"
                    },
                    {
                        "name": "_spender",
                        "type": "address"
                    }
                ],
                "name": "allowance",
                "outputs": [{
                    "name": "",
                    "type": "uint256"
                }],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "constructor"
            },
            {
                "anonymous": false,
                "inputs": [{
                        "indexed": true,
                        "name": "owner",
                        "type": "address"
                    },
                    {
                        "indexed": true,
                        "name": "spender",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "name": "value",
                        "type": "uint256"
                    }
                ],
                "name": "Approval",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [{
                        "indexed": true,
                        "name": "from",
                        "type": "address"
                    },
                    {
                        "indexed": true,
                        "name": "to",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "name": "value",
                        "type": "uint256"
                    }
                ],
                "name": "Transfer",
                "type": "event"
            }
        ]
    }

    function getTokenABI_WITH_ARRAY_INPUT() {
        return [{
                "constant": true,
                "inputs": [],
                "name": "name",
                "outputs": [{
                    "name": "",
                    "type": "string"
                }],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [{
                        "name": "_spender",
                        "type": "address"
                    },
                    {
                        "name": "_value",
                        "type": "uint256"
                    }
                ],
                "name": "approve",
                "outputs": [{
                    "name": "",
                    "type": "bool"
                }],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [],
                "name": "totalSupply",
                "outputs": [{
                    "name": "",
                    "type": "uint256"
                }],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [{
                        "name": "_from",
                        "type": "address"
                    },
                    {
                        "name": "_to",
                        "type": "address"
                    },
                    {
                        "name": "_value",
                        "type": "uint256"
                    }
                ],
                "name": "transferFrom",
                "outputs": [{
                    "name": "",
                    "type": "bool"
                }],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [],
                "name": "INITIAL_SUPPLY",
                "outputs": [{
                    "name": "",
                    "type": "uint256"
                }],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [],
                "name": "decimals",
                "outputs": [{
                    "name": "",
                    "type": "uint8"
                }],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [{
                        "name": "_spender",
                        "type": "address"
                    },
                    {
                        "name": "_subtractedValue",
                        "type": "uint256"
                    }
                ],
                "name": "decreaseApproval",
                "outputs": [{
                    "name": "",
                    "type": "bool"
                }],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [{
                    "name": "_owner",
                    "type": "address"
                }],
                "name": "balanceOf",
                "outputs": [{
                    "name": "",
                    "type": "uint256"
                }],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [],
                "name": "symbol",
                "outputs": [{
                    "name": "",
                    "type": "string"
                }],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [{
                        "name": "_to",
                        "type": "address"
                    },
                    {
                        "name": "_value",
                        "type": "uint256"
                    },
                    {
                        "name": "_somevalues",
                        "type": "uint256[]"
                    }
                ],
                "name": "transfer",
                "outputs": [{
                    "name": "",
                    "type": "bool"
                }],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [{
                        "name": "_spender",
                        "type": "address"
                    },
                    {
                        "name": "_addedValue",
                        "type": "uint256"
                    }
                ],
                "name": "increaseApproval",
                "outputs": [{
                    "name": "",
                    "type": "bool"
                }],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [{
                        "name": "_owner",
                        "type": "address"
                    },
                    {
                        "name": "_spender",
                        "type": "address"
                    }
                ],
                "name": "allowance",
                "outputs": [{
                    "name": "",
                    "type": "uint256"
                }],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "constructor"
            },
            {
                "anonymous": false,
                "inputs": [{
                        "indexed": true,
                        "name": "owner",
                        "type": "address"
                    },
                    {
                        "indexed": true,
                        "name": "spender",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "name": "value",
                        "type": "uint256"
                    }
                ],
                "name": "Approval",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [{
                        "indexed": true,
                        "name": "from",
                        "type": "address"
                    },
                    {
                        "indexed": true,
                        "name": "to",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "name": "value",
                        "type": "uint256"
                    }
                ],
                "name": "Transfer",
                "type": "event"
            }
        ]
    }

    function getTokenABI_boolean() {
        return [{
                "constant": true,
                "inputs": [],
                "name": "name",
                "outputs": [{
                    "name": "",
                    "type": "string"
                }],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [{
                        "name": "_spender",
                        "type": "address"
                    },
                    {
                        "name": "_value",
                        "type": "uint256"
                    }
                ],
                "name": "approve",
                "outputs": [{
                    "name": "",
                    "type": "bool"
                }],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [],
                "name": "totalSupply",
                "outputs": [{
                    "name": "",
                    "type": "uint256"
                }],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [{
                        "name": "_from",
                        "type": "address"
                    },
                    {
                        "name": "_to",
                        "type": "address"
                    },
                    {
                        "name": "_value",
                        "type": "uint256"
                    }
                ],
                "name": "transferFrom",
                "outputs": [{
                    "name": "",
                    "type": "bool"
                }],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [],
                "name": "INITIAL_SUPPLY",
                "outputs": [{
                    "name": "",
                    "type": "uint256"
                }],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [],
                "name": "decimals",
                "outputs": [{
                    "name": "",
                    "type": "uint8"
                }],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [{
                        "name": "_spender",
                        "type": "address"
                    },
                    {
                        "name": "_subtractedValue",
                        "type": "uint256"
                    }
                ],
                "name": "decreaseApproval",
                "outputs": [{
                    "name": "",
                    "type": "bool"
                }],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [{
                    "name": "_owner",
                    "type": "address"
                }],
                "name": "balanceOf",
                "outputs": [{
                    "name": "",
                    "type": "uint256"
                }],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [],
                "name": "symbol",
                "outputs": [{
                    "name": "",
                    "type": "string"
                }],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [{
                        "name": "_to",
                        "type": "address"
                    },
                    {
                        "name": "_value",
                        "type": "bool"
                    }
                ],
                "name": "transfer",
                "outputs": [{
                    "name": "",
                    "type": "bool"
                }],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [{
                        "name": "_spender",
                        "type": "address"
                    },
                    {
                        "name": "_addedValue",
                        "type": "uint256"
                    }
                ],
                "name": "increaseApproval",
                "outputs": [{
                    "name": "",
                    "type": "bool"
                }],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [{
                        "name": "_owner",
                        "type": "address"
                    },
                    {
                        "name": "_spender",
                        "type": "address"
                    }
                ],
                "name": "allowance",
                "outputs": [{
                    "name": "",
                    "type": "uint256"
                }],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "constructor"
            },
            {
                "anonymous": false,
                "inputs": [{
                        "indexed": true,
                        "name": "owner",
                        "type": "address"
                    },
                    {
                        "indexed": true,
                        "name": "spender",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "name": "value",
                        "type": "uint256"
                    }
                ],
                "name": "Approval",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [{
                        "indexed": true,
                        "name": "from",
                        "type": "address"
                    },
                    {
                        "indexed": true,
                        "name": "to",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "name": "value",
                        "type": "uint256"
                    }
                ],
                "name": "Transfer",
                "type": "event"
            }
        ]
    }
    
    onInvalidCompanyField = function () {
        processAnimation.stopProcessingAnimation();
    }
}

