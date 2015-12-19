'use strict';

var co = require('co');

module.exports = co;
module.exports.series = function(arr) {
    return co(function* () {
        var result = [];
        while (true) {
            let next = arr.shift();
            if (!next) {
                return result;
            }

            let res = yield next;
            result.push(res);
        }

        /*for (let gen of arr) {
            try {
                
            }
            catch(err) {
                console.log(err);
                throw new Error(err);
            }
        }*/
    });
};
