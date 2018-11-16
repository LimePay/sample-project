window.addEventListener('load', async function () {

    populateCardHolderInfo();
    addRelayedPaymentSection();
    subscribeForRelayedPaymentClick();

    function populateCardHolderInfo () {
        $('#card-holder-name').val('Ivan Ivanov');
        $('#zip-code').val(123654);
        $('#street-address').val('Mladost 104, Sofia, Bulgaria');
    }

    async function addRelayedPaymentSection () {
        let relayedPaymentFrame = await $.get('./relayed-payment-frame.html');

        $('#relayed-payment-wrapper').html(relayedPaymentFrame);
    }

    function subscribeForRelayedPaymentClick() {
        let interval = setInterval(function () {
            if (processRelayedPayment) {
                $('#btn-relayed-payment').show();
                $('#btn-relayed-payment').click(processRelayedPayment);
                clearInterval(interval);
            }
        }, 300);

    }
})