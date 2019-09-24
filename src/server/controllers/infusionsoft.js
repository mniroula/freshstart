const axios = require('axios');
const { apiBaseUrl } = require('../config');
const { fsPool } = require('../dbPool');

const getSessions = (req, res) => {
  axios
    .get(apiBaseUrl, { params: { action: 'getSessions' }})
    .then(data => {
      res.json({ err: null, data: data.data });
    })
    .catch(err => {
      res.json({ err: true, msg: err });
    });
};

const getSessionClients_DataPost = async (req, res) => {
  const isClients = await axios.get(apiBaseUrl, { params: { action: 'getSessionClients_DataPost', session: req.query.session }});
  if (isClients.data.length) {
    for (let i=0; i<isClients.data.length; i++) {
      try {
        const dbClient = await fsPool.query('SELECT * FROM client WHERE first_name = $1 AND last_name = $2 AND city = $3', [isClients.data[i].firstName, isClients.data[i].lastName, isClients.data[i].city]);
        isClients.data[i].exists = dbClient.rows.length ? true : false;
        isClients.data[i].dbId = dbClient.rows.length ? parseInt(dbClient.rows[0].id, 10) : null;
      } catch (err) {
        console.log(err);
      }
    }
  }
  res.json({ error: null, data: isClients.data });
};

const createFSSession = async (session) => {
  const res = await fsPool.query('');
};

const fetchNextId = async () => {
  const res = await fsPool.query('SELECT MAX(id) AS nextId FROM client');
  return parseInt(res.rows[0].nextid, 10) + 1;
};

const createFSClient = async (client, id) => {
  const res = await fsPool
    .query(
      `INSERT INTO client (
        id,
        archived,
        name,
        first_name,
        last_name,
        phone_mobile,
        phone_work,
        phone_home,
        program_length,
        cycle,
        country,
        state,
        city,
        street,
        postcode,
        email
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) RETURNING id`,
      [
        id,
        false,
        `${client.firstName} ${client.lastName}`,
        client.firstName,
        client.lastName,
        client.phoneMobile,
        client.phoneWork,
        client.phoneHome,
        `${client.programCycle.split(" ")[0]} days`,
        client.programCycle,
        client.country,
        client.state,
        client.city,
        client.address,
        client.postcode,
        client.email
      ]);
  client.dbId = parseInt(res.rows[0].id, 10);
  return client;
};

const postClientsFS = async (req, res) => {
  const { session, clients } = req.body;
  const clientIds = [];
  for (let i=0; i<1; i++) {
    const client = clients[i];
    // Get next available id
    const nextId = fetchNextId();
    // Create db client
    clientIds.push(createFSClient(client, nextId));
    
  }
  res.json({ error: null, data: clientIds });
};

module.exports = {
  getSessions,
  getSessionClients_DataPost,
  postClientsFS,
};