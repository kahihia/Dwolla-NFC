var config = {

    API_KEY: '',
    API_SECRET: '',

    API_KEY_UAT: '',
    API_SECRET_UAT: '',

    SANDBOX: false,

    getAPIKey: function() {
        if (!config.SANDBOX) {
            return config.API_KEY;
        } else {
            return config.API_KEY_UAT;
        }
    },

    getAPISecret: function() {
        if (!config.SANDBOX) {
            return config.API_SECRET;
        } else {
            return config.API_SECRET_UAT;
        }
    }
}