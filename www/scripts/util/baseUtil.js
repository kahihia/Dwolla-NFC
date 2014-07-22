baseUtil = {
    isPrice: function(value) {
        if (Number(value) <= 0) {
            return false;
        }
        return (/^\d+(.\d{1,2})?$/.test(value));
    }
}