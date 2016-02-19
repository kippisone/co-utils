'use strict';

var co = require('co');

var isPromise = function(obj) {
    if (obj && typeof obj.then === 'function' && typeof obj.catch === 'function') {
        return true;
    }

    return false;
}

module.exports = co;
module.exports.series = function(arr) {
    return co(function* () {
        var result = [];
        for (let fn of arr) {
            let res;
            if (typeof fn === 'object' &&
                typeof fn.then === 'function' &&
                typeof fn.catch === 'function'
            ) {
                res = yield fn;
            }
            else if (typeof fn === 'function' && fn.constructor.name === 'Function') {
                let callback = this.getCallbackPromise();
                let ownPromise = fn(callback);
                if (isPromise(ownPromise)) {
                    res = yield ownPromise;
                }
                else {
                    res = yield callback._promise;
                }
            }
            else {
                res = yield fn;
            }

            result.push(res);
        }

        return result;
    }.bind(this));
};

module.exports.getCallbackPromise = function() {
    var resolve,
        reject,
        finalFuncs = [];

    var promise = new Promise(function(_resolve, _reject) {
        resolve = _resolve;
        reject = _reject;
    });

    function callback (err, result) {
        if (err) {
            return callback.reject(err);
        }

        callback.resolve(result);
    }

    callback.resolve = function(res) {
        resolve(res);
        callback._callFinal();
    }
    
    callback.reject = function(res) {
        reject(res);
        callback._callFinal();
    }

    callback.final = function(fn) {
        finalFuncs.push(fn);
    }

    callback.then = function(fn) {
        promise.then(fn);
        return callback;
    }

    callback.catch = function(fn) {
        promise.catch(fn);
        return callback;
    }

    callback._callFinal = function() {
        for (let fn of finalFuncs) {
            fn();
        }

        return callback;
    }

    callback._promise = promise;


    return callback;
};
