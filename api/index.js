const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 5076;

app.use(cors());

const {
  addJobApp, importJobApp,
} = require('./methods');

app.use(
  bodyParser.json(),
  bodyParser.urlencoded({
    extended: true
  })
);

app.post('/add-job-app', addJobApp);
app.post('/import-job-app', importJobApp);

app.listen(port, () => {
  console.log(`App running... on port ${port}`);
});