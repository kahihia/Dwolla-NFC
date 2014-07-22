var notification = {

    TIME_SHOW: 5000,

    //---------------------------------------------------------------------------------------------
    //PUBLIC
    //---------------------------------------------------------------------------------------------

    show: function(data, type) {
        //data should have 'headline' and 'text' props
        $('#' + type + ' h2').html(data.headline);
        $('#' + type + ' p').html(data.text);
        $('#' + type + '').css('opacity', '1');
        $('#' + type + '').show();
        notification.countAndFade(type);
    },

    //---------------------------------------------------------------------------------------------
    //PRIVATE
    //---------------------------------------------------------------------------------------------

    countAndFade: function(type) {
        setTimeout(function() {
            $('#' + type + '').animate({
                'opacity': 0
            }, 500, function() {
                $('#' + type + '').hide();
            });
        }, notification.TIME_SHOW)
    }
}