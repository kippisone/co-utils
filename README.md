# co-utils

Extends [co](https://github.com/tj/co) with a .series method to call an array of promises, callbacks or generators in series

```js
var co = require('co-series');

// co can be used as usual
co(function* () {
    
});
```

## Callables

Callabels are functions or promises supported by co-series

### Promises

```js
var fn = new Promise(function(resolve, reject) {
    resolve('foo');
});
```

### Callback functions

```js
var fn = function(done) {
    done(null, 'foo');
}
```

### Functions returning a promise

```js
var fn = function(promise) {
    promisee.resolve('foo');
};
```

### Generators

```
var fn = function *() {
    yield doSomeAsync();
    return 'foo';
};
```

## Usage

// Call an array of **callables** in series
var promises = [
    Promise.resolve('a');
    Promise.resolve('b');
    Promise.resolve('c'),
    function *() { return 'd' },
    function *() { return 'e' },
    function() {}
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
