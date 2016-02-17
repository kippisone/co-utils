var co = require('../index.js');
var expect = require('expect.js');
var sinon = require('sinon');

describe('co.series()', function() {
    'use strict';
    
    describe('method', function() {
        it('Should call functions in series', function(done) {
            var func1 = sinon.stub();
            var func2 = sinon.stub();
            var func3 = sinon.stub();
            var isGenStub = sinon.stub();
            isGenStub.returns(false);

            func1.yields(null, 'a');
            func2.yields(null, 'b');
            func3.yields(null, 'c');

            func1.isGenerator = isGenStub;
            func2.isGenerator = isGenStub;
            func3.isGenerator = isGenStub;

            var functions = [
                func1,
                func2,
                func3
            ];

            co.series(functions).then(function(result) {
                expect(result).to.be.eql(['a', 'b', 'c']);
                done();
            }).catch(function(err) {
                done(err);
            });
        });

        it('Should fail if one function rejects', function(done) {
            var func1 = sinon.stub();
            var func2 = sinon.stub();
            var func3 = sinon.stub();
            var isGenStub = sinon.stub();
            isGenStub.returns(false);

            func1.yields(null, 'a');
            func2.yields(null, 'b');
            func3.yields('err');

            func1.isGenerator = isGenStub;
            func2.isGenerator = isGenStub;
            func3.isGenerator = isGenStub;

            co.series([func1, func2, func3]).then(function(res) {
                done('Fail!');
            }).catch(function(err) {
                expect(err).to.be.eql('Booom');
                done();
            });
        });

        it('Should fail if one function throws an error', function(done) {
            var func1 = sinon.stub();
            var func2 = sinon.stub();
            var func3 = sinon.stub();
            var isGenStub = sinon.stub();
            isGenStub.returns(false);

            func1.yields(null, 'a');
            func2.throws('err');
            func3.yields(null, 'c');

            func1.isGenerator = isGenStub;
            func2.isGenerator = isGenStub;
            func3.isGenerator = isGenStub;

            co.series([func1, func2, func3]).then(function(res) {
                done('Fail!');
            }).catch(function(err) {
                expect(err.message).to.be.eql('Booom');
                done();
            });
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