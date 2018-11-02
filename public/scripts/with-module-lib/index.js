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

        var result = await $.get('/');

        processAnimation.init();

        let limePayConfig = {
            URL: "http://localhost:3000",
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

        document.getElementById('checkout-form').addEventListener('submit', async () => {

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

            let wallet = await $.get('/wallet');

            let tokenABI = "YOUR TOKEN ABI HERE";
            let contractABI = "YOUR SERVICE CONTRACT ABI HERE";
            let passphrase = "123123123";

            let signedTransactions = await signTransactions(wallet);
            LimePayWeb.PaymentService.processPayment(cardHolderInformation, signedTransactions);

            let signTransactions = async function (wallet) {

                let transactions = [
                    {
                        to: '0xc8b06aA70161810e00bFd283eDc68B1df1082301',
                        abi: tokenABI,
                        gasLimit: 4700000,
                        value: 0,
                        functionName: "approve",
                        functionParams: ["0x07F3fB05d8b7aF49450ee675A26A01592F922734", 1]
                    },
                    {
                        to: '0x07F3fB05d8b7aF49450ee675A26A01592F922734',
                        abi: contractABI,
                        gasLimit: 4700000,
                        value: 0,
                        functionName: "buySomeService",
                        functionParams: ["0x1835f2716ba8f3ede4180c88286b27f070efe985"]
                    }
                ];


                return await LimePayWeb.TransactionsBuilder.buildSignedTransactions(wallet, passphrase, transactions);
            }

        });
    }

})();


initForm.onInvalidCompanyField = function () {
    processAnimation.stopProcessingAnimation();
}


module.exports = initForm;
