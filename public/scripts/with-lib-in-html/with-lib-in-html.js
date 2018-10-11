window.onload = async function () {

    var result = await $.get('/');

    processAnimation.init();

    let callbackFn = async function () {

        let tokenABI = "YOUR TOKEN ABI HERE";
        let contractABI = "YOUR SERVICE CONTRACT ABI HERE";
        let passphrase = "123123123";

        let transactions = [
            {
                to: '0xc8b06aA70161810e00bFd283eDc68B1df1082301',
                abi: tokenABI,
                gasLimit: 4700000,
                value: 0,
                fnName: "approve",
                params: ["0x07F3fB05d8b7aF49450ee675A26A01592F922734", 1]
            },
            {
                to: '0x07F3fB05d8b7aF49450ee675A26A01592F922734',
                abi: contractABI,
                gasLimit: 4700000,
                value: 0,
                fnName: "buySomeService",
                params: ["0x1835f2716ba8f3ede4180c88286b27f070efe985"]
            }
        ];

        let txBuilder = new LimePayWeb.TransactionsBuilder(result.jsonWallet, passphrase);
        return await txBuilder.buildSignedTransactions(transactions);
    }

    let limePayConfig = {
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
}



