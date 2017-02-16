'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _rIndex = require('../routes/rIndex');

var _rIndex2 = _interopRequireDefault(_rIndex);

var _rSpeed = require('../routes/rSpeed');

var _rSpeed2 = _interopRequireDefault(_rSpeed);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function server() {
  var app = (0, _express2.default)();
  // sd
  app.set('port', process.env.PORT || 8009);

  // laden den bodyParser
  app.use(_bodyParser2.default.urlencoded({ extended: true }));
  app.use(_bodyParser2.default.json());

  // View engine
  app.set('views', '' + _path2.default.resolve(__dirname, '../views'));
  app.set('view engine', 'pug');

  // Lade die Statischen Datein in die Middleware
  app.use(_express2.default.static('' + _path2.default.resolve(__dirname, '../../frontend')));

  // Meine eigenen Routes werden hier bekoant gemacht
  app.use('/', _rIndex2.default);
  app.use('/speed', _rSpeed2.default);

  // Error Handling
  app.use(function (req, res) {
    res.type('text/plain');
    res.status(404);
    res.send('404 - Not Found');
  });

  app.use(function (err, req, res) {
    console.error(err.stack);
    res.type('text/plain');
    res.status(500);
    res.send('500 - Internal error');
  });

  return app;
}

exports.default = server;