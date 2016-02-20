'use strict';

var co = require('co');

var isPromise = function(obj) {
    if (obj && typeof obj.then === 'function' && typeof obj.catch === 'function') {
        return true;
    }

    return false;
}

module.exports = co;

/**
 * Runs an array of yieldables in series
 *
 * @method series
 * @param  {array} arr  Array of yieldables
 * @param  {object} [ctx] This value, binded to each yieldable
 * @param  {array} [args] Arguments array, passed to each yieldable
 * @return {object} Returns a promise
 * 
 * @returnValue {promise}
 * @arg {object} Result object
 */
module.exports.series = function(arr, ctx, args) {
    ctx = ctx || {};
    
    if (Array.isArray(ctx)) {
        args = ctx;
        ctx = {};
    }

    if (!args) {
        args = []
    }

    if (!Array.isArray(args)) {
        throw new Error('The args parameter must be an array!');
    }

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
                let ownPromise = fn.bind.apply(fn, [ctx].concat(args, callback))();
                if (isPromise(ownPromise)) {
                    res = yield ownPromise;
                }
                else {
                    res = yield callback._promise;
                }
            }
            else {
                res = yield fn.bind.apply(fn, [ctx].concat(args))();
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
