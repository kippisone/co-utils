var co = require('../index.js');
var expect = require('expect.js');

describe('co.series()', function() {
    'use strict';
    
    describe('method', function() {
        beforeEach(function() {

        });

        afterEach(function() {

        });

        it('Should call promises in series', function(done) {
            var promises = [
                Promise.resolve('a'),
                Promise.resolve('b'),
                Promise.resolve('c')
            ];

            co.series(promises).then(function(result) {
                expect(result).to.be.eql(['a', 'b', 'c']);
                done();
            }).catch(function(err) {
                done(err);
            });
        });

        it('Should fail if one promise rejects', function(done) {
            var p1 = new Promise(function(resolve, reject) { resolve ('a'); });
            var p2 = new Promise(function(resolve, reject) { resolve ('b'); });
            var p3 = new Promise(function(resolve, reject) { reject('Booom'); });

            co.series([p1, p2, p3]).then(function(res) {
                done('Fail!');
            }).catch(function(err) {
                expect(err).to.be.eql('Booom');
                done();
            });
        });

        it('Should fail if one promise throws an error', function(done) {
            var p1 = new Promise(function(resolve, reject) { resolve ('a'); });
            var p2 = new Promise(function(resolve, reject) { resolve ('b'); });
            var p3 = new Promise(function(resolve, reject) { throw new Error('Booom'); });

            co.series([p1, p2, p3]).then(function(res) {
                done('Fail!');
            }).catch(function(err) {
                expect(err.message).to.be.eql('Booom');
                done();
            });
        });
    });
});