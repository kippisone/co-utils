'use strict';

var co = require('co');

module.exports = co;
module.exports.series = function(arr) {
    var promiseFn = function(fn) {
        return function(resolve, reject) {
            let p2 = fn(reject, resolve);
            if (p2 && p2.then && p2.catch) {
                p2.then(resolve).catch(reject);
            }
        };
    };
    
    return co(function* () {
        var result = [];
        for (let promise of arr) {
            let res;
            if (typeof promise === 'function') {
                res = yield new Promise(promiseFn(promise));

            }
            else {
                res = yield promise;
            }

            result.push(res);
        }

        return result;
    });
};
