# co-series

Extends co with a .series method to call an array of promises in series

```js
var co = require('co-series');

// co can be used as usual
co(function* () {
    
});

// Call an array of promises in series
var promises = [
    Promise.resolve('a');
    Promise.resolve('b');
    Promise.resolve('c');
];

co.series(promises).then(function(result) {
    // result === ['a', 'b', 'c']
});

// If one of the promises rejects or an error will be thrown,
// then the main promise will fail

var promises = [
    Promise.resolve('a');
    Promise.resolve('b');
    Promise.reject('c');
];

co.series(promises).then(function(result) {
    // this will not be called
}).catch(function(err) {
    // err === 'c'
});

```
