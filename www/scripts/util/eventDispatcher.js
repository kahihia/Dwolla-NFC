//-------------------------------------------------------------------------------------------------
// EventDispatcher v 1.0.0 | used to register events.
//
//-------------------------------------------------------------------------------------------------
function EventDispatcher() {

    eventDispatcher = new Object();

    //---------------------------------------------------------------------------------------------
    //PUBLIC
    //---------------------------------------------------------------------------------------------
    this.addEventListener = function(type, handler) {
        if (eventDispatcher[type] == undefined) {
            eventDispatcher[type] = new Array();
        }
        eventDispatcher[type].push(handler);
    }

    this.removeEventListener = function(type, handler) {
        var i = eventDispatcher[type].length - 1;
        while (i >= 0) {
            if (eventDispatcher[type][i] == handler) {
                eventDispatcher[type].splice(i, 1);
                return;
            }
            i--;
        }
    }

    this.dispatchEvent = function(type, data) {
        if (eventDispatcher[type] != undefined) {
            var callList = eventDispatcher[type].slice(0);
            for (var i = 0; i < callList.length; i++) {
                callList[i].apply(this, [data]);
            }
        }
    }
}