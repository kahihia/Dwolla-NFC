var client = {

    payTransaction_ajax: null,

    initialize: function() {
        if (app.token !== undefined && app.token !== null) {
            client.getBalance();
        }
        client.moneySender();
        client.addListeners();
    },


    addListeners: function() {
        nfc.addMimeTypeListener(app.TAG_MIME_TYPE, client.onTagDiscovered, client.onTagDiscovered_success, client.onTagDiscovered_fail);
        app.addEventListener(app.TRANSACTION_CANCELED, client.transactionCanceledHand);

        //this currently does not work: no way to remove this listener :(
        //nfc.removeNdefListener(client.onTagDiscovered, client.onTagDiscovered_success, client.onTagDiscovered_fail);
    },

    //---------------------------------------------------------------------------------------------
    //BALANCE
    //---------------------------------------------------------------------------------------------
    getBalance: function() {
        $.ajax({
            'type': 'GET',
            'url': 'https://' + app.subDomain + '.dwolla.com/oauth/rest/balance/',
            'data': {
                'oauth_token': app.token
            },
            'success': function(data) {
                $('#balance').html('$' + data.Response);
            }
        });
    },

    //---------------------------------------------------------------------------------------------
    //TAG REACTOR
    //---------------------------------------------------------------------------------------------
    onTagDiscovered: function(nfcEvent) {
        var payload = client.decodePayload(nfc.bytesToString(nfcEvent.tag.ndefMessage[0].payload));

        if (payload.nfcID != undefined) {
            //if not in client mode switch
            if (baseUI.mode != 'client') {
                baseUI.updateMode('client');
            }

            //dispatch data got to trigger send
            app.dispatchEvent(app.NFC_STAGED_FROM_MERCHANT, payload);
        }
    },

    decodePayload: function(rawPayload) {
        var payload = {};
        var baseArray = rawPayload.split(';');
        for (var i = 0; i < baseArray.length; i++) {
            var node = baseArray[i];
            var keyVal = node.split(':');
            payload[keyVal[0]] = keyVal[1];
        }
        return payload;
    },

    onTagDiscovered_success: function() {
        //listener setup successfully.
    },

    onTagDiscovered_fail: function(reason) {
        alert('NFC tag discovery has failed because of: ' + reason);
    },

    //---------------------------------------------------------------------------------------------
    //MONEY SENDER
    //---------------------------------------------------------------------------------------------

    moneySender: function() {

        var nfcID = null; //used to verify transaction on the merchant side.
        var merchantID = null;
        var amount = null;
        var name = null;

        function initialize() {
            addListners();
        }

        function addListners() {
            app.addEventListener(app.NFC_STAGED_FROM_MERCHANT, merchantStagedMoneyHand)
        }

        function merchantStagedMoneyHand(data) {
            //need to get ID from merchant NFC information
            nfcID = data.nfcID;
            merchantID = data.merchantID;
            amount = data.amount;
            name = data.name;
            pin.getPin(sendMoneyHand);
            app.startCancelTimer();
        }

        function sendMoneyHand(pinNum) {
            $('#buffering').css('display', 'block');

            client.payTransaction_ajax = $.ajax({
                'type': 'POST',
                'datatype': "json",
                'contentType': "application/json; charset=utf-8",
                'url': 'https://' + app.subDomain + '.dwolla.com/oauth/rest/transactions/send',
                'data': JSON.stringify({
                    "oauth_token": app.token,
                    "pin": pinNum,
                    "destinationId": merchantID,
                    "amount": amount,
                    "notes": "Sent from Troy Blank's Dwolla NFC APP.",
                    "metadata": {
                        'nfcID': nfcID
                    }
                }),
                'success': function(data) {
                    $('#buffering').css('display', 'none');
                    if (data.Success) {
                        client.getBalance();
                        pin.hidePad();
                        showSuccess();
                    } else {
                        pin.displayError(data.Message);
                    }
                },
                'error': function(data) {
                    app.stopCancelTimer();
                    $('#buffering').css('display', 'none');
                    pin.displayError('error! sending money');
                }
            });
        }

        function showSuccess() {
            app.stopCancelTimer();
            notification.show({
                'headline': 'Money Sent',
                'text': 'You just sent $' + amount + ' to ' + name + '.'
            }, 'confirmation');
        }

        initialize();
    },

    //---------------------------------------------------------------------------------------------
    //CANCEL TIMEOUT
    //---------------------------------------------------------------------------------------------
    transactionCanceledHand: function() {
        $('#buffering').css('display', 'none');
        pin.hidePad();
        if (client.payTransaction_ajax != null) {
            client.payTransaction_ajax.abort();
        }
    }
}