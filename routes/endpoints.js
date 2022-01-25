const path = require('path');
const express = require('express');

const recordRoutes = express.Router();

recordRoutes.route('/').get(function (_req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

recordRoutes.route('/api/:date?').get(function (req, res) {
  const targetDate = dateValParser(req.params.date);
  let body;
  let code;
  if (isNaN(targetDate.getTime())) {
    code = 400;
    body = {error: 'Invalid Date'};
  } else {
    code = 200;
    body = {
      unix: targetDate.getTime(),
      utc: targetDate.toUTCString(),
    }
  }
  res.status(code).json(body);
});

module.exports = recordRoutes;

// helpers
function dateValParser(param) {
  let dateVal = param;
  if (dateVal === undefined) {
    return new Date(Date.now());
  } else if (!isNaN(Number(dateVal))) {
    return new Date(Number(dateVal));
  }
  return new Date(dateVal);
}