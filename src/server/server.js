const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const app = express();

const auth = require('./controllers/auth');
const infusion = require('./controllers/infusionsoft');

const port = 5000;

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// Auth
app.post('/api/signin', auth.loginUser);
app.post('/api/signup', auth.createUser);
app.post('/api/forgotPassword', auth.forgotPassword);
app.post('/api/validateToken', auth.validateToken);
app.post('/api/updatePassword', auth.updatePassword);

// InfusionSoft API
app.get('/api/getSessions', infusion.getSessions);
app.get('/api/getClientsDataPost', infusion.getSessionClients_DataPost);
app.post('/api/postClientsFS', infusion.postClientsFS);

app.listen(port, () => console.log(`Listening on port ${port}!`));