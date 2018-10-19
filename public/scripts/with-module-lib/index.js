const LimePayWeb = require('limepay-web');
const countries = require('./../../constants/countries-codes');

var initForm = (async () => {

    window.onload = async function () {

        (function populateDropdownWithCountryCodes() {
            Object.keys(countries).forEach((countryCode) => {
                let dropdownCountryCode = `<option value="${countryCode}">${countryCode} (${countries[countryCode]})</option>`;
                $(dropdownCountryCode).appendTo("#countries-codes");
            });
        })();

        let tokenABI = getTokenABI();
        var result = await $.get('/');
        const password = "123123123";
        processAnimation.init();

        let callbackFn = async function () {
            // transactions -> [{to: Z, contractABI: Y, gasLimit: X, valueAmounts, fnName, ...params}]
            let transactions = [
                {
                    to: '0xc8b06aA70161810e00bFd283eDc68B1df1082301',
                    abi: tokenABI,
                    gasLimit: 4700000,
                    value: 0,
                    fnName: "transfer",
                    params: ["0x1835f2716ba8f3ede4180c88286b27f070efe985", 1]
                },
                {
                    to: '0xc8b06aA70161810e00bFd283eDc68B1df1082301',
                    abi: tokenABI,
                    gasLimit: 4700000,
                    value: 0,
                    fnName: "transfer",
                    params: ["0x1835f2716ba8f3ede4180c88286b27f070efe985", 1]
                }
            ];

            return await LimePayWeb.TransactionsBuilder.buildSignedTransactions(result.jsonWallet, password, transactions);
        }

        let limePayConfig = {
            URL: "http://localhost:3000",
            signingTxCallback: callbackFn,
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

        LimePayWeb.init(result.token, limePayConfig).catch((err) => {
            console.log(err);
            alert('Form initialization failed');
            // Implement some logic
        });


        function getTokenABI() {
            return [
                {
                    "constant": true,
                    "inputs": [],
                    "name": "name",
                    "outputs": [
                        {
                            "name": "",
                            "type": "string"
                        }
                    ],
                    "payable": false,
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "constant": false,
                    "inputs": [
                        {
                            "name": "_spender",
                            "type": "address"
                        },
                        {
                            "name": "_value",
                            "type": "uint256"
                        }
                    ],
                    "name": "approve",
                    "outputs": [
                        {
                            "name": "",
                            "type": "bool"
                        }
                    ],
                    "payable": false,
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "constant": true,
                    "inputs": [],
                    "name": "totalSupply",
                    "outputs": [
                        {
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "payable": false,
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "constant": false,
                    "inputs": [
                        {
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
                    "outputs": [
                        {
                            "name": "",
                            "type": "bool"
                        }
                    ],
                    "payable": false,
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "constant": true,
                    "inputs": [],
                    "name": "INITIAL_SUPPLY",
                    "outputs": [
                        {
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "payable": false,
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "constant": true,
                    "inputs": [],
                    "name": "decimals",
                    "outputs": [
                        {
                            "name": "",
                            "type": "uint8"
                        }
                    ],
                    "payable": false,
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "constant": false,
                    "inputs": [
                        {
                            "name": "_spender",
                            "type": "address"
                        },
                        {
                            "name": "_subtractedValue",
                            "type": "uint256"
                        }
                    ],
                    "name": "decreaseApproval",
                    "outputs": [
                        {
                            "name": "",
                            "type": "bool"
                        }
                    ],
                    "payable": false,
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "constant": true,
                    "inputs": [
                        {
                            "name": "_owner",
                            "type": "address"
                        }
                    ],
                    "name": "balanceOf",
                    "outputs": [
                        {
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "payable": false,
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "constant": true,
                    "inputs": [],
                    "name": "symbol",
                    "outputs": [
                        {
                            "name": "",
                            "type": "string"
                        }
                    ],
                    "payable": false,
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "constant": false,
                    "inputs": [
                        {
                            "name": "_to",
                            "type": "address"
                        },
                        {
                            "name": "_value",
                            "type": "uint256"
                        }
                    ],
                    "name": "transfer",
                    "outputs": [
                        {
                            "name": "",
                            "type": "bool"
                        }
                    ],
                    "payable": false,
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "constant": false,
                    "inputs": [
                        {
                            "name": "_spender",
                            "type": "address"
                        },
                        {
                            "name": "_addedValue",
                            "type": "uint256"
                        }
                    ],
                    "name": "increaseApproval",
                    "outputs": [
                        {
                            "name": "",
                            "type": "bool"
                        }
                    ],
                    "payable": false,
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "constant": true,
                    "inputs": [
                        {
                            "name": "_owner",
                            "type": "address"
                        },
                        {
                            "name": "_spender",
                            "type": "address"
                        }
                    ],
                    "name": "allowance",
                    "outputs": [
                        {
                            "name": "",
                            "type": "uint256"
                        }
                    ],
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
                    "inputs": [
                        {
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
                    "inputs": [
                        {
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

        document.getElementById('checkout-form').addEventListener('submit', () => {
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

            LimePayWeb.PaymentService.processPayment(cardHolderInformation);
        });
    }

})();


initForm.onInvalidCompanyField = function () {
    processAnimation.stopProcessingAnimation();
}


module.exports = initForm;
