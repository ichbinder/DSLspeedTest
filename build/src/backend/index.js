'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = reconnect;

var _piGpio = require('pi-gpio');

var _piGpio2 = _interopRequireDefault(_piGpio);

var _lowdb = require('lowdb');

var _lowdb2 = _interopRequireDefault(_lowdb);

var _dateformat = require('dateformat');

var _dateformat2 = _interopRequireDefault(_dateformat);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var db = (0, _lowdb2.default)('./speedDB.json');

function reconnect(time) {
  var getReconnectPromise = function getReconnectPromise(value) {
    return new Promise(function (resolve) {
      for (var i = 0, len = time.length; i < len; i += 1) {
        var currentTime = (0, _dateformat2.default)(new Date(), 'HH:MM:ss');
        if ((0, _moment2.default)(currentTime).isSame(time[i])) _piGpio2.default.open(7, 'output', function (err) {
          if (err) console.log('Es gab ein fheler:', err);else {
            _piGpio2.default.write(7, 1, function () {
              _piGpio2.default.close(7);
              db.get('reconnect').push({ reconTime: (0, _dateformat2.default)(new Date(), 'yyyy-mm-dd HH:MM:ss') }).write();
            });
          }
        });
        resolve(value);
      }
    });
  };

  var loop = function loop(value) {
    return getReconnectPromise(value).then(function (result) {
      return loop(result);
    });
  };

  loop(true).then(function () {
    return console.log('all done!');
  });
}