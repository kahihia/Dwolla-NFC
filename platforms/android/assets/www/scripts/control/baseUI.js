baseUI = {

    mode: null,
    MODE_NAMESPACE: 'com.dwolla.nfc_mode',

    initialize: function() {
        baseUI.modeSwitcher();
    },

    updateMode: function(mode) {
        window.localStorage[app.MODE_NAMESPACE] = mode;
        $('.mode').css('display', 'none');
        $('#' + mode).css('display', 'block');

        baseUI.mode = mode;
    },

    //---------------------------------------------------------------------------------------------
    //MODE SWITCHER
    //---------------------------------------------------------------------------------------------
    modeSwitcher: function() {
        function initialize() {
            checkForStoredMode();
            addListeners();
        }

        function checkForStoredMode() {
            if (window.localStorage[app.MODE_NAMESPACE] != undefined) {
                baseUI.updateMode(window.localStorage[app.MODE_NAMESPACE]);
            } else {
                baseUI.updateMode('client');
            }
        }

        //UI
        //++++++++++++++++

        function addListeners() {
            $('header .gear').on('click', gearHand);
            $('header ul li').on('click', modeSelectHand);
        }

        function modeSelectHand() {
            baseUI.updateMode($(this).data('mode'));
            $('header ul').removeClass('active');
        }

        function gearHand() {
            if (!$('header ul').hasClass('active')) {
                $('header ul').addClass('active');
            } else {
                $('header ul').removeClass('active');
            }
        }

        initialize();
    }

}