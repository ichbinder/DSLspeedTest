'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _dateformat = require('dateformat');

var _dateformat2 = _interopRequireDefault(_dateformat);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _lowdb = require('lowdb');

var _lowdb2 = _interopRequireDefault(_lowdb);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var db = (0, _lowdb2.default)('./speedDB.json');
var router = new _express2.default.Router();

router.post('/lastHours', function (req, res) {
  if (!req.body.hours) {
    res.status(400).json({
      message: 'Bitte geben sie das hours ein.',
      error: true
    });
  } else {
    var currentTime = (0, _dateformat2.default)(new Date(), 'yyyy-mm-dd HH:MM:ss');
    res.status(200).json(db.get('speed').filter(function (i) {
      var pastTime = (0, _moment2.default)(currentTime).subtract(req.body.hours, 'hours');
      if ((0, _moment2.default)(i.date).isBetween(pastTime, currentTime)) return i;
      return null;
    }).value());
  }
}).post('/getWeek', function (req, res) {
  if (!req.body.week) {
    res.status(400).json({
      message: 'Bitte geben sie das week ein.',
      error: true
    });
  } else {
    res.status(200).json(db.get('speed').filter(function (i) {
      var dayOfWeek = (0, _moment2.default)().isoWeek(req.body.week);
      var startOfWeek = (0, _moment2.default)(dayOfWeek).startOf('week');
      var endOfWeek = (0, _moment2.default)(dayOfWeek).endOf('week');
      if ((0, _moment2.default)(i.date).isBetween(startOfWeek, endOfWeek)) return i;
      return null;
    }).value());
  }
}).post('/getMonth', function (req, res) {
  if (!req.body.week) {
    res.status(400).json({
      message: 'Bitte geben sie das month ein.',
      error: true
    });
  } else {
    res.status(200).json(db.get('speed').filter(function (i) {
      var dayOfMonth = (0, _moment2.default)().month(req.body.week - 1);
      var startOfMonth = (0, _moment2.default)(dayOfMonth).startOf('month');
      var endOfMonth = (0, _moment2.default)(dayOfMonth).endOf('month');
      if ((0, _moment2.default)(i.date).isBetween(startOfMonth, endOfMonth)) return i;
      return null;
    }).value());
  }
});

module.exports = router;