/*dwolla+sb1@troyblank.com;Dwolla Dev1!;1234;Ron;Sandbox;500.0;verified
dwolla+sb2@troyblank.com;Dwolla Dev1!;1234;Pete;Sandbox;500.0;verified*/

//http://developer.android.com/tools/publishing/app-signing.html

var app = {

    token: null,
    TOKEN: 'com.dwolla.nfc_token',

    SUB_DOMAIN: 'uat', //www is production uat is sandbox

    O_AUTH_CALLBACK: 'dwolla-nfc://callback/tempcode',
    //API_KEY: 'l6V7VLNIcCT+ydSgOyT8ysQfkzuyxki9KyOreGkQb73XWh7t9W',
    //API_SECRET: 'ydmomsNEfUcVwkfVFhnKft38i/zmkB9/OnqLX/zlTRVxLQ23Dj',

    //THESE ARE THE UAT CREDENTIALS
    API_KEY: 'xf5EURhJ0U/d6Sq8fuf5OKXRR0E++q2TOal+iJHZG7cj7tdQ8j',
    API_SECRET: 'egzdeqe2xCB5MRr1HjzVGi4/jpqDBb0919gZyJTmb5bPKk3iK2',

    TAG_MIME_TYPE: 'dwolla/nfc',

    cancelTimer: null,
    TRANSACTION_CANCEL_DELAY: 45000,

    initialize: function() {
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
        }, 'cancel');
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
        var baseURL = 'https://' + app.SUB_DOMAIN + '.dwolla.com/oauth/v2/authenticate?';
        var clientID = 'client_id=' + encodeURIComponent(app.API_KEY);
        var responseType = '&response_type=' + encodeURIComponent('code');
        var redirectURI = '&redirect_uri=' + encodeURIComponent(app.O_AUTH_CALLBACK);
        var scope = '&scope=' + encodeURIComponent('AccountInfoFull|Balance|Contacts|Funding|Request|Send|Transactions');

        //call back scheme does not work in app browser for some reason.
        window.open((baseURL + clientID + responseType + redirectURI + scope), '_system', 'location=no');
    },

    getToken: function(code) {
        $('#buffering').css('display', 'block');
        var baseURL = 'https://' + app.SUB_DOMAIN + '.dwolla.com/oauth/v2/token?';
        var clientID = 'client_id=' + encodeURIComponent(app.API_KEY);
        var clientSecret = '&client_secret=' + encodeURIComponent(app.API_SECRET);
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

//browser debug
// $(document).ready(function() {
//     client.initialize();
//     merchant.initialize();
// })