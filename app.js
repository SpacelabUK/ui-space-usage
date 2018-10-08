
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());

app.use('/', (request, response) => {
  response.sendFile(`${__dirname}/public/sandbox.html`);
});

app.use(express.static('public'));

app.listen(3004);
