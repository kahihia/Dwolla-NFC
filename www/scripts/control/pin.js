//currently there is no way to validate a pin, so this process is only done
//right before a send.

var pin = {

    input: new Array(),
    currentCallback: null,

    //---------------------------------------------------------------------------------------------
    //PUBLIC
    //---------------------------------------------------------------------------------------------

    getPin: function(callback) {
        pin.currentCallback = callback;
        pin.showPad();
    },

    hidePad: function() {
        $('#number-pad').hide();
    },

    displayError: function(message) {
        pin.clearPad();
        pin.showError(message);
    },

    //---------------------------------------------------------------------------------------------
    //PRIVATE
    //---------------------------------------------------------------------------------------------

    initialize: function() {
        pin.addListeners();
    },

    addListeners: function() {
        $('#number-pad button').on('click', pin.numClickHand);
    },

    showPad: function() {
        pin.clearPad();
        $('#number-pad').show();
    },

    updateProgressBar: function() {
        var dots = $('#number-pad .progress > div');
        $(dots).removeClass('active');
        for (var i = 0; i < pin.input.length; i++) {
            $(dots[i]).addClass('active');
        }
    },

    callCallBack: function() {
        pin.currentCallback(pin.input.join(''));
    },

    showError: function(message) {
        $('#number-pad .error').show();
        $('#number-pad .error').html(message);
    },

    hideError: function() {
        $('#number-pad .error').hide();
        $('#number-pad .error').empty();
    },

    //HANDLERS
    numClickHand: function() {
        if (pin.input.length < 4) {
            pin.input.push($(this).html());
            pin.updateProgressBar();
        }
        if (pin.input.length == 4) {
            pin.callCallBack();
        }
    },

    clearPad: function() {
        pin.input = new Array();
        pin.updateProgressBar();
        pin.hideError();
    }
}

$(document).ready(pin.initialize);