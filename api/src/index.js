const express = require('express');
const cors = require('cors');
const app = express();
const port = 3076;
const routes = require('./routes');
const bodyParser = require('body-parser');

app.use(cors({
  origin: "*"
}));

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', "*");
  next();
});

app.use('/api/', routes);

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
