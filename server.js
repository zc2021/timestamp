const express = require('express');
const cors = require('cors');

const port = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(express.static('public'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

app.get('/api/:date?', function (req, res) {
  let targetDate = dateValParser(req.params.date);
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

function dateValParser(param) {
  let dateVal = param;
  if (dateVal === undefined) {
    return new Date(Date.now());
  } else if (!isNaN(Number(dateVal))) {
    return new Date(Number(dateVal));
  }
  return new Date(dateVal);
}

app.listen(port, function () {
  console.log(`Listening at: http://localhost:${port}`);
});
