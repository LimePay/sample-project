let processFiatPayment;
let processRelayedPayment;
let fiatPayment;
let relayedPayment;
let limePayConfig;
let tokenABI;
let contractABI;

const SHOPPER_WALLET_PASSPHRASE = "some cool passphrase";
let limepay;

window.onload = async function () {
    (async function onWindowLoad() {
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

        limepay = await LimePayWeb.connect(LimePayWeb.Environment.Sandbox);
    })();

    processAnimation.init();

    $('input[type=radio][name=initialization]').change(async function() {
        if (this.value == 'fiat') {
            await initialiseFiatPayment();
        } else if (this.value == 'relayed') {
            await initialiseRelayedPayment();
        }
    });

    async function initialiseFiatPayment () {
        // Make backend call for the creation of the payment
        const result = await $.post('/fiatPayment');
        
        // Unlocks the payment form
        const fiatPayment2 = await limepay.FiatPayments.load(result.token);
        fiatPayment = await limepay.FiatPayments.load(result.token);
    }

    async function initialiseRelayedPayment() {
        // Make backend call for the creation of the payment
        const result = await $.post('/relayedPayment');

        relayedPayment = await limepay.RelayedPayments.load(result.token);
    }

    // The function is trigger once the user submits the payment form
    processFiatPayment = async function () {
        
        // Get the shopper JSON Wallet from the backend
        const shopperWallet = await $.get('/shopperWallet');
        
        const transactions = await getTransactions();

        // Signs the provided transactions using the Shoppers wallet
        const signedTXs = await limepay.Transactions.signWithEncryptedWallet(transactions, JSON.stringify(shopperWallet), SHOPPER_WALLET_PASSPHRASE);

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
        await fiatPayment.process(cardHolderInformation, signedTXs)
            .then(res => {
                alert("done!");
            });
    }

    processRelayedPayment = async function () {
        processAnimation.startProcessingAnimation();

        // Get the shopper JSON Wallet from the backend
        const shopperWallet = await $.get('/shopperWallet');

        const walletConfiguration = {
            encryptedWallet: {
                jsonWallet: JSON.stringify(shopperWallet),
                password: SHOPPER_WALLET_PASSPHRASE
            }
        };
        const transactions = await getTransactions();

        // Signs the provided transactions using the Shoppers wallet
        const signedTXs = await limepay.Transactions.signWithEncryptedWallet(transactions, JSON.stringify(shopperWallet), SHOPPER_WALLET_PASSPHRASE);

        // Triggers the processing of the payment
        relayedPayment.process(signedTXs)
            .then(res => {
                alert("done!");
            });
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

