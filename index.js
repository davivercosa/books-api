const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const router = require('./routes/routes');

// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

app.use(bodyParser.json({ limit: '50mb' }));
app.use(
  bodyParser.urlencoded({
    limit: '50mb',
    extended: true,
    parameterLimit: 50000,
  }),
);

app.use('/', router);

app.listen(3000, () => {
  console.log("Server's up!");
});
