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
        const dbClient = await fsPool.query('SELECT * FROM client WHERE first_name = $1 AND last_name = $2 AND city = $3 AND archived = false', [isClients.data[i].firstName, isClients.data[i].lastName, isClients.data[i].city]);
        isClients.data[i].exists = dbClient.rows.length ? true : false;
        isClients.data[i].dbId = dbClient.rows.length ? parseInt(dbClient.rows[0].id, 10) : null;
      } catch (err) {
        console.log(err);
      }
    }
  }
  res.json({ error: null, data: isClients.data });
};

const parseStrDate = (d, m, y) => {
  let nMonth = null;
  switch (m) {
    case 'Jan': 
      nMonth = '01';
      break;
    case 'Feb': 
      nMonth = '02';
      break;
    case 'Mar': 
      nMonth = '03';
      break;
    case 'Apr': 
      nMonth = '04';
      break;
    case 'May': 
      nMonth = '05';
      break;
    case 'Jun': 
      nMonth = '06';
      break;
    case 'Jul': 
      nMonth = '07';
      break;
    case 'Aug': 
      nMonth = '08';
      break;
    case 'Sep': 
      nMonth = '09';
      break;
    case 'Oct': 
      nMonth = '10';
      break;
    case 'Nov': 
      nMonth = '11';
      break;
    case 'Dec': 
      nMonth = '12';
      break;
  }
  return `${y}-${nMonth}-${d}`;
};

const parseSessionDate = (strDate) => {
  const sessionPattern1 = /(\w{3})\s(\d{1,2})-(\w{3})\s(\d{1,2})\s(\d{4})/;
  const sessionPattern2 = /(\w{3})\s(\d{1,2})-(\d{1,2})\s(\d{4})/;
  if (sessionPattern1.test(strDate)) {
    // Oct 28-Nov 18 2018
    const match = strDate.match(sessionPattern1);
    return {
      name: `${match[1]} ${match[2]}-${match[3]} ${match[4]}, ${match[5]}`,
      start_date: parseStrDate(match[2], match[1], match[5]),
      end_date: parseStrDate(match[4], match[3], match[5]),
    };
  } else {
    // Jan 6-27 2019
    const match = strDate.match(sessionPattern2);
    return {
      name: `${match[1]} ${match[2]}-${match[3]}, ${match[4]}`,
      start_date: parseStrDate(match[2], match[1], match[4]),
      end_date: parseStrDate(match[3], match[1], match[4]),
    };
  }
};

const fetchNextId = async (tableName) => {
  const res = await fsPool.query(`SELECT MAX(id) AS nextId FROM ${tableName}`);
  return parseInt(res.rows[0].nextid, 10) + 1;
};

const fetchFSSession = async (session) => {
  const sessionObj = parseSessionDate(session);
  console.log('sessionObj', JSON.stringify(sessionObj, null, 2));
  const res = await fsPool.query('SELECT * FROM session WHERE name = $1', [sessionObj.name]);
  if (res.rows.length === 0) {
    return null;
  }
  return res.rows[0].id;
};

const createFSSession = async (session, id) => {
  const sessionObj = parseSessionDate(session);
  console.log('sessionObj', JSON.stringify(sessionObj, null, 2));
  await fsPool.query('INSERT INTO session (id, archived, name, start_date, end_date) VALUES ($1, $2, $3, $4, $5)', [id, false, sessionObj.name, sessionObj.start_date, sessionObj.end_date]);
};

const assignClientToSession = async (sessionId, clientId) => {
  await fsPool.query('INSERT INTO session_clients (session_id, client_id) VALUES ($1, $2)', [sessionId, clientId]);
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
        gender,
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
        email,
        program_dates,
        budget,
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19) RETURNING id`,
      [
        id,
        false,
        `${client.firstName} ${client.lastName}`,
        client.firstName,
        client.lastName,
        null,
        client.phoneMobile,
        client.phoneWork,
        client.phoneHome,
        `${client.programCycle.split(" ")[0]} days`,
        client.programCycle,
        client.country.toUpperCase() || null,
        client.state,
        client.city,
        client.address,
        client.postcode,
        client.email,
        client.programDates || null,
        client.budget || null,
      ]);
  client.dbId = parseInt(res.rows[0].id, 10);
  return client;
};

const postClientsFS = async (req, res) => {
  const { session, clients } = req.body;
  const clientIds = [];
  for (let i=0; i<clients.length; i++) {
    const client = clients[i];
    if (client.postcode && client.postcode.trim().length > 7) {
      client.postcode = client.postcode.trim().substr(0, 7).toUpperCase();
    }
    const nextClientId = await fetchNextId('client');
    const dbClient = await createFSClient(client, nextClientId); 
    let sessionId = await fetchFSSession(session);
    if (!sessionId) {
      sessionId = await fetchNextId('session');
      await createFSSession(session, sessionId);
    }
    await assignClientToSession(sessionId, nextClientId);
    clientIds.push(dbClient);
  }
  res.json({ error: null, data: clientIds });
};

module.exports = {
  getSessions,
  getSessionClients_DataPost,
  postClientsFS,
};