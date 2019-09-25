const bcrypt = require('bcrypt');
const { pool } = require('../dbPool');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const { emailCredentials } = require('../config');

const saltRounds = 10;

const loginUser = (req, res) => {
  const { email, password } = req.body;

  pool.query('SELECT * FROM app_users WHERE email = $1', [email], (error, results) => {
    if (error) {
      res.json({ error: true, msg: error });
    }
    if (results.rows.length === 0) {
      // User dont exist
      res.json({ error: true });
      throw error;
    } else {
      // Existing user
      const dbPassword = results.rows[0].password;
      const match = bcrypt.compareSync(password, dbPassword);
      if (match) {
        res.json({ error: false, data: { username: results.rows[0].username } });
      } else {
        res.json({ error: true });
      }
    }
  });
};

const createUser = (req, res) => {
  const { username, email, password } = req.body;

  pool.query('SELECT * FROM app_users WHERE email = $1', [email], (error, results) => {
    if (error) {
      res.json({ error: true, msg: error });
      throw error;
    }
    if (results.rows.length === 0) {
      // New user
      const hash = bcrypt.hashSync(password, saltRounds);
      pool.query('INSERT INTO app_users (username, email, password) VALUES ($1, $2, $3)', [username, email, hash], (error, results) => {
        if (error) {
          res.json({ error: true, msg: error });
        }
        res.json({ error: false });
      });
    } else {
      // Existing user
      res.json({ error: true })
    }
  });
};

const validateToken = (req, res) => {
  const { token } = req.body;

  pool.query('SELECT * FROM app_users WHERE token = $1', [token], (error, results) => {
    if (error) {
      res.json({ error: true, msg: error });
      throw error;
    }
    if (results.rows.length === 0) {
      res.json({ error: true, msg: 'Invalid token' });
    } else {
      const { id, expires } = results.rows[0];

      if (Date.now() > expires) {
        res.json({ error: true, msg: 'Token expired' });
      } else {
        res.json({ error: false, id });
      }
    }
  });
};

const updatePassword = (req, res) => {
  const { password, id } = req.body;

  const hash = bcrypt.hashSync(password, saltRounds);

  pool.query('UPDATE app_users SET password = $1 WHERE id = $2', [hash, id], (error, results) => {
    if (error) {
      res.json({ error: true, msg: error });
      throw error;
    }
    res.json({ error: false });
  });
};

const forgotPassword = (req, res) => {
  const { email } = req.body;

  pool.query('SELECT * FROM app_users WHERE email = $1', [email], (error, results) => {
    if (error) {
      res.json({ error: true, msg: error });
      throw error;
    }
    if (results.rows.length === 0) {
      // User dont exist
      res.json({ error: true, msg: 'Email doen\'t exist' });
    } else {
      const { id } = results.rows[0];
      const token = crypto.randomBytes(20).toString('hex');
      pool.query('UPDATE app_users SET token = $1, expires = $2 WHERE id = $3', [token, Date.now() + 360000, id], (error, results) => {
        if (error) {
          res.json({ error: true, msg: error });
          throw error;
        }
        const transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          auth: {
            type: "login",
            user: emailCredentials.email,
            pass: emailCredentials.pass
          }
        });
        const mailOptions = {
          from: emailCredentials.email,
          to: email,
          subject: 'Reset email link',
          text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n` +
                `Please click on the following link, or paste this into your browser to complete the process within one hour of receiving this.\n\n` +
                `http://localhost:3000/#/auth/reset-password/${token}\n\n` +
                `If you did not request this, please ignore this email and your password will remain unchanged.\n`
        };
        transporter.sendMail(mailOptions, (error, data) => {
          if (error) {
            res.json({ error: true, msg: error });
            throw error;
          } else {
            res.json({ error: false });
          }
        });
      });
    }
  });
};

module.exports = {
  loginUser,
  createUser,
  forgotPassword,
  validateToken,
  updatePassword,
};