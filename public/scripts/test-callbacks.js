
let simulateClientScript = (function () {

    let retrieveLimeToken = async function () {

        let key = 'd6987210b11311e884f2879c6c556ac7';
        let secret = 'd743f1cbcda23f78315b4ef862856e6ed542ab0bd30c3324b8129789d56013ddb0e0b2aca63023c89e0f60d036436a6609452f13fe1673de1a75ca91037ab90aa7414220739431a357697ab6956244f79861b2389302d40a309b31072d0d878395aba871a0e2ef2b0587b3b2dcf380fb1482110a14c1045754fa4ae160b8bb6c';

        function promisifyLimeTokenResult() {
            return new Promise((resolve, reject) => {
                let settings = {
                    "async": true,
                    "crossDomain": true,
                    "url": `http://localhost:3000/limetoken`,
                    "method": "GET",
                    "headers": {
                        "Content-Type": "application/json",
                        "Cache-Control": "no-cache",
                        "Authorization": "Basic " + btoa(key + ":" + secret),
                    },
                    "processData": false,
                    success: function (data, textStatus, request) {
                        let limeToken = request.getResponseHeader('x-lime-token');
                        resolve(limeToken);
                    },
                    error: function (error) {
                        reject(error);
                    }
                }

                $.ajax(settings);
            })
        };

        let limePayToken = await promisifyLimeTokenResult();
        return limePayToken;
    }

    let retrievePaymentInfo = function () {
        let paymentInfo = {
            "amount": 200,
            "cardHolderInfo": {
                "firstName": "Lyubo",
                "lastName": "Kiprov"
            },
            "currency": "USD"
            // "pfToken": "6c53938eb4dc2c0359f5c2f92b9c0990b5b8b44df89d01fab045f163e0950fd1_"
        }

        return paymentInfo;
    }

    return {
        retrieveLimeToken: retrieveLimeToken,
        retrievePaymentInfo: retrievePaymentInfo
    }
})();
