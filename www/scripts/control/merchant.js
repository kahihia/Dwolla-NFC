//HCE == hosted card emulation | this is not supported by the phonegap-nfc plugin yet :(
//using nfc.share and nfc.unshare you can fake HCE. but the beam API is a must.

//https://github.com/grundid/host-card-emulation-sample

merchant = {

    id: null,
    name: null,
    currentNFCID: null,
    lookForTransaction_ajax: null,

    NAME_ID_NAMESPACE: 'com.dwolla.nfc_id',
    NAME_STORE_NAMESPACE: 'com.dwolla.nfc_name',

    longPullTimer: null,
    lookForTransaction_ajax: null,
    LONG_POLL_INTERVAL: 3000,

    initialize: function() {
        merchant.getBasicInfo();
        merchant.stageTransaction();
        merchant.addListeners();
    },

    addListeners: function() {
        app.addEventListener(app.TRANSACTION_CANCELED, merchant.transactionCanceledHand);
    },

    //---------------------------------------------------------------------------------------------
    //TRANSACTION LONG POLLING - need a better solution?
    //---------------------------------------------------------------------------------------------
    waitAndLookForTransaction: function() {
        merchant.longPullTimer = setTimeout(merchant.lookForTransaction, merchant.LONG_POLL_INTERVAL);
    },

    lookForTransaction: function() {
        var anHourAgo = new Date(new Date().getTime() - 3600000);
        merchant.lookForTransaction_ajax = $.ajax({
            'type': 'GET',
            'url': 'https://' + app.subDomain + '.dwolla.com/oauth/rest/transactions/',
            'data': {
                'oauth_token': app.token,
                'sinceDate': anHourAgo.toUTCString(),
                'types': 'money_received'
            },
            'success': function(data) {
                merchant.checkDataForMatch(data);
            }
        });
    },

    checkDataForMatch: function(data) {
        var found = false;
        if (data.Success) {
            for (var i = 0; i < data.Response.length; i++) {
                var node = data.Response[i];
                if (node.Metadata != null) {
                    if (node.Metadata.nfcID == merchant.currentNFCID) {
                        found = true;
                        merchant.showSuccess(node.Amount, node.SourceName);
                    }
                }

            }
        }
        if (!found) {
            merchant.waitAndLookForTransaction();
        } else {
            merchant.setStage();
        }
    },

    showSuccess: function(amount, name) {
        $('#buffering').css('display', 'none');
        app.stopCancelTimer();
        notification.show({
            'headline': 'Money Received',
            'text': 'You just received $' + amount + ' from ' + name + '.'
        }, 'confirmation');
    },

    //---------------------------------------------------------------------------------------------
    //NFC
    //---------------------------------------------------------------------------------------------
    setNFCID: function() {
        //ten digit number
        merchant.currentNFCID = String(Math.floor(Math.random() * 10000000000) + 999999999);
        //merchant.currentNFCID = '0128736463';
    },

    broadcastTransactionInfo: function() {
        var message = [];
        var recordType = app.TAG_MIME_TYPE;

        merchant.setNFCID();

        var payload = 'nfcID:' + merchant.currentNFCID + ';merchantID:' + merchant.id + ';amount:' + $('#cost').val() + ';name:' + merchant.name;
        var record = ndef.mimeMediaRecord(recordType, payload);

        message.push(record);

        //Android Application Record (allows launch without app open)
        var tnf = ndef.TNF_EXTERNAL_TYPE;
        recordType = "android.com:pkg";
        payload = "com.dwolla.dwollaNFC";
        record = ndef.record(tnf, recordType, [], payload);
        message.push(record); // push the record onto the message

        merchant.shareTag(message);
        //merchant.writeTag(message);
    },

    //++++++++++++++++++++++++++++++++++++++++
    //single device testing only.
    //++++++++++++++++++++++++++++++++++++++++
    // writeTag: function(message) {
    //     nfc.write(
    //         message,
    //         function() {
    //             alert("Tag got wrote.");
    //         },
    //         function(reason) {
    //             alert("There was a problem " + reason);
    //         }
    //     );
    // },
    //++++++++++++++++++++++++++++++++++++++++

    shareTag: function(message) {
        //this makes the device act like a NFC tag, P2P style.
        //android beam will show up during this process.
        nfc.share(
            message,
            function() {
                merchant.tagSharredHand();
            },
            function(reason) {
                alert("There was a problem " + reason);
            }
        );
    },

    tagSharredHand: function() {
        $('#buffering').css('display', 'block');
        app.startCancelTimer();
        merchant.updateStatus('awaiting a payment...');
        nfc.unshare();
        merchant.waitAndLookForTransaction();
    },

    //---------------------------------------------------------------------------------------------
    //BASIC INFO
    //---------------------------------------------------------------------------------------------
    getBasicInfo: function() {
        function initialize() {

            setID(window.localStorage[merchant.NAME_ID_NAMESPACE]);
            setName(window.localStorage[merchant.NAME_STORE_NAMESPACE]);

            if (merchant.id != undefined) {
                unFreezeUI();
            } else {
                freezeUI();
                getBasicInfo();
            }

        }

        function setID(id) {
            if (id != undefined) {
                window.localStorage[merchant.NAME_ID_NAMESPACE] = id;
                merchant.id = window.localStorage[merchant.NAME_ID_NAMESPACE];
            }
        }

        function setName(name) {
            if (name != undefined) {
                window.localStorage[merchant.NAME_STORE_NAMESPACE] = name
                merchant.name = window.localStorage[merchant.NAME_STORE_NAMESPACE];

                $('header .login-name').html('Logged in as: ' + merchant.name);
            }
        }

        function freezeUI() {
            $('#cost').attr('disabled', 'true');
            $('#stage').attr('disabled', 'true');
            $('#cancel').attr('disabled', 'true');
        }

        function unFreezeUI() {
            $('#cost').removeAttr('disabled');
            $('#stage').removeAttr('disabled');
            $('#cancel').attr('disabled', 'true');
        }

        function getBasicInfo() {
            $.ajax({
                'type': 'GET',
                'url': 'https://' + app.subDomain + '.dwolla.com/oauth/rest/users/',
                'data': {
                    'oauth_token': app.token
                },
                'success': function(data) {
                    if (data.Success) {
                        setID(data.Response.Id);
                        setName(data.Response.Name);;

                        unFreezeUI();
                    }
                }
            });
        }

        initialize();
    },

    //---------------------------------------------------------------------------------------------
    //UI
    //---------------------------------------------------------------------------------------------

    setStage: function() {
        $('#cost').removeAttr('disabled');
        $('#stage').removeAttr('disabled');
        $('#cancel').attr('disabled', 'true');
        $('#cost').val('');
        merchant.updateStatus('idle');
    },

    updateStatus: function(status) {
        $('#merchant-status').html(status);
    },

    stageTransaction: function() {
        function initialize() {
            $('#cost').val('');
            merchant.updateStatus('idle');

            addListeners();
        }

        function setStage() {
            $('#cost').removeAttr('disabled');
            $('#stage').removeAttr('disabled');
            $('#cancel').attr('disabled', 'true');
            $('#cost').val('');
            merchant.updateStatus('idle');
        }

        function addListeners() {
            $('#stage').on('click', stageHand);
            $('#cancel').on('click', cancelHand);
        }

        function stageHand() {
            if (baseUtil.isPrice($('#cost').val())) {
                $('#cost').attr('disabled', 'true');
                $('#stage').attr('disabled', 'true');
                $('#cancel').removeAttr('disabled');
                merchant.updateStatus('awaiting a interaction...');
                merchant.broadcastTransactionInfo();
            } else {
                alert($('#cost').val() + ' is not a price.')
            }
        }

        function cancelHand() {
            nfc.unshare();
            merchant.setStage();
        }

        initialize();
    },


    //---------------------------------------------------------------------------------------------
    //CANCEL TIMEOUT
    //---------------------------------------------------------------------------------------------
    transactionCanceledHand: function() {
        $('#buffering').css('display', 'none');
        if (merchant.lookForTransaction_ajax != null) {
            merchant.lookForTransaction_ajax.abort();
        }
        if (merchant.longPullTimer != null) {
            clearTimeout(merchant.longPullTimer);
        }
        merchant.setStage();
    }
}