window.addEventListener('load', async function () {

    let isDefaultSubmitActionPrevented = false;

    $('input[type=radio][name=initialization]').change(async function() {
        if (this.value == 'fiat') {
            $('#checkout-form').show();
            preventDefaultSubmitAction();
            populateCardHolderInfo();
            $('#relayed-payment-wrapper').hide();
        }
        else if (this.value == 'relayed') {
            await addRelayedPaymentSection();
            subscribeForRelayedPaymentClick();
            $('#checkout-form').hide();
        }
    });

    function populateCardHolderInfo () {
        $('#card-holder-name').val('Ivan Ivanov');
        $('#zip-code').val(123654);
        $('#street-address').val('Mladost 104, Sofia, Bulgaria');
    }

    async function addRelayedPaymentSection () {
        let relayedPaymentFrame = await $.get('./relayed-payment-frame.html');
        $('#relayed-payment-wrapper').show();
        $('#relayed-payment-wrapper').html(relayedPaymentFrame);
    }

    function subscribeForRelayedPaymentClick () {
        let interval = setInterval(function () {
            if (processRelayedPayment || window.processRelayedPayment) {
                $('#btn-relayed-payment').show();
                $('#btn-relayed-payment').click(processRelayedPayment || window.processRelayedPayment);
                clearInterval(interval);
            }
        }, 300);

    }

    function preventDefaultSubmitAction () {
        
        if (!isDefaultSubmitActionPrevented) {
            let checkoutForm = document.getElementById('checkout-form');
            checkoutForm.addEventListener('submit', (event) => {
                event.preventDefault();
            });

            isDefaultSubmitActionPrevented = true;
        }
    }
})