'use strict';

var co = require('co');

module.exports = co;
module.exports.series = function(arr) {
    return co(function* () {
        var result = [];
        for (let promise of arr) {
            let res = yield promise;
            result.push(res);
        }

        return result;
    });
};
