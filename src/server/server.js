const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const auth = require('./controllers/auth');

const apiBaseUrl = 'http://work.fsportal.site/api.php';

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.get('/api/getSessions', (req, res) => {
  axios
    .get(apiBaseUrl, {params: {action: 'getSessions'}})
    .then(function (response) {
      res.status(200).send(response.data);
    })
    .catch(function (error) {
      res.status(500).send(error);
    });
});

app.post('/api/signin', auth.loginUser);
app.post('/api/signup', auth.createUser);
app.post('/api/forgotPassword', auth.forgotPassword);
app.post('/api/validateToken', auth.validateToken);
app.post('/api/updatePassword', auth.updatePassword);

app.listen(8080, () => console.log("Listening on port 8080!"));