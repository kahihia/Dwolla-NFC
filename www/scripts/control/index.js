var app = {

    token: null,
    TOKEN: 'com.dwolla.nfc_token',

    subDomain: 'www',

    O_AUTH_CALLBACK: 'dwolla-nfc://callback/tempcode',

    TAG_MIME_TYPE: 'dwolla/nfc',

    cancelTimer: null,
    TRANSACTION_CANCEL_DELAY: 45000,

    initialize: function() {
        if (config.SANDBOX) {
            app.subDomain = 'uat';
        }

        app.token = window.localStorage[app.TOKEN];

        if (app.token == undefined) {
            app.aquireToken()
        } else {
            baseUI.initialize();
            client.initialize();
            merchant.initialize();

            //app.log('initialized');
        }
    },

    //---------------------------------------------------------------------------------------------
    //CANCEL TIMER
    //---------------------------------------------------------------------------------------------
    startCancelTimer: function() {
        app.cancelTimer = setTimeout(app.transactionCanceledHand, app.TRANSACTION_CANCEL_DELAY);
    },

    stopCancelTimer: function() {
        clearTimeout(app.cancelTimer);
    },

    transactionCanceledHand: function() {
        notification.show({
            'headline': 'Transaction Canceled',
            'text': 'The time to make a transaction has exceeded, please try again'
        }, 'canceled');
        app.dispatchEvent(app.TRANSACTION_CANCELED);
    },

    //---------------------------------------------------------------------------------------------
    //TOKEN ACQUISITION
    //---------------------------------------------------------------------------------------------
    aquireToken: function() {
        //two step process
        window.plugins.webintent.getUri(function(url) {
            if (url == null) {
                app.authenticate();
            } else if (url.indexOf('/callback/tempcode') > 0) {
                //need to handle errors here
                var code = url.split('?code=')[1];
                app.getToken(code);
            }
        });
    },

    authenticate: function() {
        var baseURL = 'https://' + app.subDomain + '.dwolla.com/oauth/v2/authenticate?';
        var clientID = 'client_id=' + encodeURIComponent(config.getAPIKey());
        var responseType = '&response_type=' + encodeURIComponent('code');
        var redirectURI = '&redirect_uri=' + encodeURIComponent(app.O_AUTH_CALLBACK);
        var scope = '&scope=' + encodeURIComponent('AccountInfoFull|Balance|Contacts|Funding|Request|Send|Transactions');

        //call back scheme does not work in app browser for some reason.
        window.open((baseURL + clientID + responseType + redirectURI + scope), '_system', 'location=no');
    },

    getToken: function(code) {
        $('#buffering').css('display', 'block');
        var baseURL = 'https://' + app.subDomain + '.dwolla.com/oauth/v2/token?';
        var clientID = 'client_id=' + encodeURIComponent(config.getAPIKey());
        var clientSecret = '&client_secret=' + encodeURIComponent(config.getAPISecret());
        var grantType = '&grant_type=' + encodeURIComponent('authorization_code');
        var oldRedirectURI = '&redirect_uri=' + encodeURIComponent(app.O_AUTH_CALLBACK);
        var code = '&code=' + code;

        $.ajax(baseURL + clientID + clientSecret + grantType + oldRedirectURI + code).done(function(data) {
            $('#buffering').css('display', 'none');
            if (data.access_token != undefined) {
                app.setToken(data.access_token);
            } else {
                alert("error");
            }
        }).fail(function() {
            alert("error");
        });
    },

    setToken: function(token) {
        window.localStorage[app.TOKEN] = token;

        //restart now that we have token.
        //this is broken as any NFC listener tries to open the app not in chrome which the nfc readyness is in chrome for some weird reason
        // app.initialize();
        app.log('You have been authenticated, please re-open the app to use.')
    },

    //---------------------------------------------------------------------------------------------
    //EVENT DISPATCHER
    //---------------------------------------------------------------------------------------------

    eventDispatcher: new Object(),

    NFC_STAGED_FROM_MERCHANT: 'nfc stage from merchant',
    TRANSACTION_CANCELED: 'transaction canceled',

    addEventListener: function(type, handler) {
        if (app.eventDispatcher[type] == undefined) {
            app.eventDispatcher[type] = new Array();
        }
        app.eventDispatcher[type].push(handler);
    },

    removeEventListener: function(type, handler) {
        var i = app.eventDispatcher[type].length - 1;
        while (i >= 0) {
            if (app.eventDispatcher[type][i] == handler) {
                app.eventDispatcher[type].splice(i, 1);
                return;
            }
            i--;
        }
    },

    dispatchEvent: function(type, data) {
        if (app.eventDispatcher[type] != undefined) {
            var callList = app.eventDispatcher[type].slice(0);
            for (var i = 0; i < callList.length; i++) {
                callList[i].apply(this, [data]);
            }
        }
    },

    //---------------------------------------------------------------------------------------------
    //DEBUG
    //---------------------------------------------------------------------------------------------
    log: function(message) {
        $('#log ul').append('<li>' + message + '</li>');
    }
};

document.addEventListener('deviceready', app.initialize);