let processFiatPayment;
let processRelayedPayment;
let fiatPayment;
let relayedPayment;
let tokenABI;
let contractABI;

const SHOPPER_WALLET_PASSPHRASE = "some cool passphrase";

window.onload = async function () {
    (function onWindowLoad() {
        $.getJSON('./../constants/countries-codes.json', function (countriesCodes) {
            $.each(countriesCodes, function (code) {
                let dropdownCountryCode = `<option value="${code}">${code} (${countriesCodes[code]})</option>`;
                $(dropdownCountryCode).appendTo("#countries-codes");
            });
        });

        $.getJSON('./../constants/TokenABI.json', function (abi) {
            tokenABI = abi;
        });

        $.getJSON('./../constants/ContractABI.json', function (abi) {
            contractABI = abi;
        });

    })();

    let limePay = await LimePayWeb.connect('http://localhost:3000/v1');

    processAnimation.init();

    $('input[type=radio][name=initialization]').change(async function () {
        if (this.value == 'fiat') {
            await initialiseFiatPayment();
        } else if (this.value == 'relayed') {
            await initialiseRelayedPayment();
        }
    });

    async function initialiseFiatPayment() {
        // Make backend call for the creation of the payment
        const result = await $.post('/fiatPayment');

        // Unlocks the payment form
        fiatPayment = await limePay.FiatPayments.load(result.token);
    }

    async function initialiseRelayedPayment() {
        processAnimation.startProcessingAnimation();

        // Make backend call for the creation of the payment
        const result = await $.post('/relayedPayment');
        relayedPayment = limePay.RelayedPayments.load(result.token);

        processAnimation.stopProcessingAnimation();
        document.getElementById('div-relayed-payment').hidden = false;
    }

    // The function is trigger once the user submits the payment form
    processFiatPayment = async function () {

        // Get the shopper JSON Wallet from the backend
        const shopperWallet = await $.get('/shopperWallet');

        const encryptedWallet = {
            json: JSON.stringify(shopperWallet),
            password: SHOPPER_WALLET_PASSPHRASE
        };

        const transactions = await getTransactions();

        // Signs the provided transactions using the Shoppers wallet
        let signedTransactions = await limePay.Transactions.signWithEncryptedWallet(
            transactions,
            encryptedWallet.json,
            encryptedWallet.password
        );


        // Extracting the Card holder information from the form
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
        }

        // Triggers the processing of the payment
        await fiatPayment.process(cardHolderInformation, signedTransactions);
    }

    processRelayedPayment = async function () {
        processAnimation.startProcessingAnimation();

        // Get the shopper JSON Wallet from the backend
        const shopperWallet = await $.get('/shopperWallet');

        const encryptedWallet = {
            json: JSON.stringify(shopperWallet),
            password: SHOPPER_WALLET_PASSPHRASE
        };

        const transactions = await getTransactions();

        // Signs the provided transactions using the Shoppers wallet
        let signedTransactions = await limePay.Transactions.signWithEncryptedWallet(
            transactions,
            encryptedWallet.json,
            encryptedWallet.password
        );

        // Triggers the processing of the payment
        await relayedPayment.process(signedTransactions);
    }

    async function getTransactions() {
        return [
            {
                to: '0x30D25785515bE27d0B46Ab41Ed57dBAbf8A9cFf6',
                abi: tokenABI,
                gasLimit: 4700000,
                value: 0,
                functionName: "approve",
                functionParams: ["0x37688cFc875DC6AA6D39fE8449A759e434a86482", '10000000000000000000'] // Approve '0x37688cFc875DC6AA6D39fE8449A759e434a86482' to spend 10 Tokens 
            },
            {
                to: '0x37688cFc875DC6AA6D39fE8449A759e434a86482',
                abi: contractABI, // the ABI of your contract here
                gasLimit: 4700000,
                value: 0, // Put the amount of ethers if required
                functionName: "buySomeService",
                functionParams: [] // Put the parameters of the 'buySomeService' function here
            }
        ];
    }

    onInvalidCompanyField = function () {
        processAnimation.stopProcessingAnimation();
    }
}

