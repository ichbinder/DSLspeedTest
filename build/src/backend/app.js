'use strict';

var _www = require('./bin/www');

var _www2 = _interopRequireDefault(_www);

var _speedTestTimer = require('./speedTestTimer');

var _speedTestTimer2 = _interopRequireDefault(_speedTestTimer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _www2.default)();

(0, _speedTestTimer2.default)(5, 10000);

app.listen(app.get('port'), function () {
  console.log('Express ready on http://localhost:' + app.get('port'));
});