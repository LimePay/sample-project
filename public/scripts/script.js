window.onload = async function () {
    let token = await $.get('/');

    let callbackFn = async function () {
        // transactions -> [{to: Z, contractABI: Y, gasLimit: X, valueAmounts, fnName, ...params}]
        let transactions = [
            {
                to: contractAddress,
                contractABI: aib,
                gasLimit: 4700000,
                valueAmounts: {
                    eth: 0,
                    token: 1000
                },
                fnName: "transfer",
                params: ["endUserAddress", 1000]
            }
        ];

        //TODO Mock jsonWallet, password, contractAddress, contractABI

        let txBuilder = new LimePayWeb.TransactionsBuilder(jsonWallet, password);
        return await txBuilder.buildSignedTransactions(transactions);
    }

    let isInitializedCorrect = await LimePayWeb.init(token, callbackFn);

    if (isInitializedCorrect) {
        toastr.success('Successfully initialized Lime Pay!', 'Test');
    } else {
        toastr.error('Something went wrong! Cannot initialize Lime Pay!', 'Test');
    }
}



// for testing purpose
// (async () => {

//     const jsonWallet = require('./wallet.json');
//     const password = "123123123";
//     const tokenABI = require('./ABIs/TokenContractAbi');
//     const genericContractABI = "mockedContractABI";

//     const tokenContractAddress = '0xc8b06aA70161810e00bFd283eDc68B1df1082301';
//     const genericContractAddress = "mockedContractAddress";

//     let txOptions = {
//         approveTxGasLimit: 4700000,
//         approveTxGasPrice: 3000000000,
//         customTxGasLimit: 4700000,
//         customTxGasPrice: 3000000000
//     }

//     let valueAmounts = {
//         eth: 0,
//         token: 1000
//     }

//     let endUserAddress = '0x8e8fd30c784bbb9b80877052aae4bd9d43bcc032';

//     let txBuilder = new TransactionsBuilder(jsonWallet, password, tokenABI, tokenContractAddress, genericContractABI, genericContractAddress);
//     let result = await txBuilder.buildSignedTransactions(txOptions, valueAmounts, "transfer", endUserAddress, 1000);

//     console.log(result);
// })()