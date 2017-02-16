'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = speetTestPerTime;

var _dateformat = require('dateformat');

var _dateformat2 = _interopRequireDefault(_dateformat);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _lowdb = require('lowdb');

var _lowdb2 = _interopRequireDefault(_lowdb);

var _sleep = require('sleep');

var _sleep2 = _interopRequireDefault(_sleep);

var _speedTest = require('./speedTest');

var _speedTest2 = _interopRequireDefault(_speedTest);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var db = (0, _lowdb2.default)('./speedDB.json');

db.defaults({ speed: [] }).write();

// const SPEEDTEST_INTERVAL = 5; // Wie oft soll der SpeedTest ausgeführt werden.
// const SPEEDTEST_TIME = 5000; // Wie lange soll der SpeedTest ausgeführt werden 5000 = 5 Sikunden.
var SLEEP_TIMER = 1; // Wie lange soll gewartet werden bis die loop erneut ausgefürt wird.
// const SPEED_TIMER = 30; // Der Interval des SpeedTest in Minuten.

var currentTime = (0, _dateformat2.default)(new Date(), 'yyyy-mm-dd HH:MM:ss');
var nextHour = Number(currentTime.split(' ')[1].split(':')[0]) + 1;

function speetTestPerTime(SPEEDTEST_INTERVAL, SPEEDTEST_TIME) {
  var getSpeedPromise = function getSpeedPromise(value) {
    return new Promise(function (resolve) {
      _sleep2.default.sleep(SLEEP_TIMER);

      var starTime = (0, _moment2.default)(nextHour + ':00:00', 'HH:mm:ss');
      currentTime = (0, _moment2.default)(currentTime).add(SLEEP_TIMER, 'seconds');
      var next = (0, _moment2.default)(starTime).diff(currentTime, 'secents');
      console.log(currentTime);
      if (next <= SLEEP_TIMER * 1000 && next >= SLEEP_TIMER * -1 * 1000) {
        (0, _speedTest2.default)(SPEEDTEST_INTERVAL, SPEEDTEST_TIME).then(function (averageSpeet) {
          currentTime = (0, _dateformat2.default)(new Date(), 'yyyy-mm-dd HH:MM:ss');
          nextHour = Number(currentTime.split(' ')[1].split(':')[0]) + 1;

          db.get('speed').push({
            id: db.get('speed').size() + 1,
            date: currentTime,
            download: averageSpeet.down,
            upload: averageSpeet.up,
            minDown: averageSpeet.minDown,
            minUp: averageSpeet.minUp,
            maxDown: averageSpeet.maxDown,
            maxMin: averageSpeet.maxMin,
            ping: averageSpeet.ping,
            clientIP: averageSpeet.ip
          }).write();
          resolve(value);
        });
      } else {
        resolve(value);
      }
    });
  };

  var loop = function loop(value) {
    return getSpeedPromise(value).then(function (result) {
      return loop(result);
    });
  };

  loop(true).then(function () {
    return console.log('all done!');
  });
}

// console.log(
//   db
//     .get( 'speed' )
//     .filter( i => i.date.match( new RegExp( '2017-02-12 19' ) ) )
//     .map( 'date' )
//     .value() );