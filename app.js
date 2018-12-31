const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const api = require('./routes/api');
const port = 3000;

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use('/api', api);

app.listen(port, (() => {
    console.log("Server running on localhost:" + port);
}), err => console.log(err));
