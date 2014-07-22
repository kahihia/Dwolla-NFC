var hce = {
    echo: function(data, successCallback, errorCallback) {
        cordova.exec(function(data) {
            successCallback(JSON.parse(data));
        }, function(err) {
            errorCallback(err)
        }, 'HCE', 'echo', [data]);
    }
}