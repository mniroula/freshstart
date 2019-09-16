const bcrypt = require('bcrypt');
const pool = require('../dbPool');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const saltRounds = 10;

const loginUser = (req, res) => {
  const { email, password } = req.body;

  pool.query('SELECT * FROM app_users WHERE email = $1', [email], (error, results) => {
    if (error) {
      throw error;
    }
    if (results.rows.length === 0) {
      // User dont exist
      res.json({ error: true });
    } else {
      // Existing user
      const dbPassword = results.rows[0].password;
      const match = bcrypt.compareSync(password, dbPassword);
      if (match) {
        res.json({ error: false });
      } else {
        res.json({ error: true });
      }
    }
  });
};

const createUser = (req, res) => {
  const { email, password } = req.body;

  pool.query('SELECT * FROM app_users WHERE email = $1', [email], (error, results) => {
    if (error) {
      throw error;
    }
    if (results.rows.length === 0) {
      // New user
      const hash = bcrypt.hashSync(password, saltRounds);
      pool.query('INSERT INTO app_users (email, password) VALUES ($1, $2) RETURNING id', [email, hash], (error, results) => {
        if (error) {
          throw error;
        }
        res.json({ error: false, userId: results.rows[0].id });
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

  pool.query('UPDATE app_users SET password = $1 WHERE id = $2', [password, id], (error, results) => {
    if (error) {
      throw error;
    }
    res.json({ error: false });
  });
};

const forgotPassword = (req, res) => {
  const { email } = req.body;

  pool.query('SELECT * FROM app_users WHERE email = $1', [email], (error, results) => {
    if (error) {
      throw error;
    }
    if (results.rows.length === 0) {
      // User dont exist
      res.json({ error: true, msg: 'Email doen\'t exist' });
    } else {
      const { id } = results.rows[0];
      const token = crypto.randomBytes(20).toString('hex');
      pool.query('UPDATE app_users SET token = $1, expires = $2 WHERE id = $3', [token, Date.now() + 360000, id], (err, data) => {
        if (err) {
          throw err;
        }
        const transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          auth: {
            type: "login",
            user: 'vmiadzvedzeu@gmail.com',
            pass: 'MedvedeV1983!!'
          }
        });
        const mailOptions = {
          from: 'vmiadzvedzeu@gmail.com',
          to: email,
          subject: 'Reset email link',
          text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n` +
                `Please click on the following link, or paste this into your browser to complete the process within one hour of receiving this.\n\n` +
                `http://localhost:3000/#/auth/reset-password/${token}\n\n` +
                `If you did not request this, please ignore this email and your password will remain unchanged.\n`
        };
        transporter.sendMail(mailOptions, (e, r) => {
          if (e) {
            res.json({ error: true, msg: 'Can\'t send email' });
          } else {
            res.json({ error: false, msg: 'Email was sent' });
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