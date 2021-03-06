// Load modules

var Path = require('path');
var _Lab = require('../test_runner');
var Lab = require('../');


// Declare internals

var internals = {};


// Test shortcuts

var lab = exports.lab = _Lab.script();
var describe = lab.describe;
var it = lab.it;
var before = lab.before;
var after = lab.after;
var expect = _Lab.expect;


describe('Leaks', function () {

    it('identifies global leaks', function (done) {

        global.abc = 1;
        var leaks = Lab.leaks.detect();
        delete global.abc;
        expect(leaks.length).to.equal(1);
        done();
    });

    it('identifies global leaks for non-enumerable properties', function (done) {

        Object.defineProperty(global, 'abc', { enumerable: false, configurable: true });
        var leaks = Lab.leaks.detect();
        delete global.abc;
        expect(leaks.length).to.equal(1);
        done();
    });

    it('verifies no leaks', function (done) {

        var leaks = Lab.leaks.detect();
        expect(leaks.length).to.equal(0);
        done();
    });

    it('ignores DTrace globals', function (done) {

        var currentGlobal = global.DTRACE_HTTP_SERVER_RESPONSE;

        global.DTRACE_HTTP_SERVER_RESPONSE = 1;
        var leaks = Lab.leaks.detect();
        expect(leaks.length).to.equal(0);

        global.DTRACE_HTTP_SERVER_RESPONSE = currentGlobal;
        done();
    });

    it('works with missing DTrace globals', function (done) {

        delete global.DTRACE_HTTP_SERVER_RESPONSE;
        delete global.DTRACE_HTTP_CLIENT_REQUEST;
        delete global.DTRACE_NET_STREAM_END;
        delete global.DTRACE_HTTP_SERVER_REQUEST;
        delete global.DTRACE_NET_SOCKET_READ;
        delete global.DTRACE_HTTP_CLIENT_RESPONSE;
        delete global.DTRACE_NET_SOCKET_WRITE;
        delete global.DTRACE_NET_SERVER_CONNECTION;

        var leaks = Lab.leaks.detect();
        expect(leaks.length).to.equal(0);

        done();
    });

    it('ignores Counter globals', function (done) {

        global.COUNTER_NET_SERVER_CONNECTION = 1;
        var leaks = Lab.leaks.detect();
        delete global.COUNTER_NET_SERVER_CONNECTION;
        expect(leaks.length).to.equal(0);
        done();
    });

    it('ignores Harmony globals', function (done) {

        global.Promise = 1;
        global.Proxy = 1;
        global.Symbol = 1;
        global.WeakMap = 1;

        var leaks = Lab.leaks.detect();
        expect(leaks.length).to.equal(0);

        delete global.Promise;
        delete global.Proxy;
        delete global.Symbol;
        delete global.WeakMap;

        done();
    });

    it('identifies custom globals', function (done) {

        global.abc = 1;
        var leaks = Lab.leaks.detect(['abc']);
        delete global.abc;
        expect(leaks.length).to.equal(0);
        done();
    });
});
