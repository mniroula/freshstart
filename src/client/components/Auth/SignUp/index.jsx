import React, { useState } from 'react';
import { withRouter, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import cookie from 'react-cookies';
import axios from 'axios';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import Message from '../../_common/Message';

import { apiUrl } from '../../../config';

import styles from './styles.scss';

const SignUp = ({ history }) => {
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [errors, setErrors] = useState({
    username: !formData.username.length,
    email: !re.test(formData.email),
    password: formData.password.length < 6
  });
  const [emailExists, setEmailExists] = useState(false);

  const handleChange = name => event => {
    const value = event.target.value;
    setFormData({ ...formData, [name]: value }); 
    if (name === 'username') {
      setErrors(err => ({
        ...err,
        username: !value.length,
      }));
    }
    if (name === 'email') {
      setErrors(err => ({
        ...err,
        email: !re.test(value),
      }));
    }
    if (name === 'password') {
      setErrors(err => ({
        ...err,
        password: value.length < 6,
      }));
    }
  };

  const getExpireDate = min => {
    const d = new Date();
    d.setTime(d.getTime() + (min * 60 * 1000));
    return d;
  };

  const signUp = () => {
    // Validate user (server)
    axios({
      method: 'post',
      url: `${apiUrl}/api/signup`,
      data: {
        username: formData.username,
        email: formData.email,
        password: formData.password
      }
    }).then(({data}) => {
      if (data.error) {
        setErrors(err => ({ ...err, email: true }));
        setFormData(v => ({ ...v, password: '' }));
        setEmailExists(true);
      } else {
        const expireAuth = getExpireDate(60 * 24 * 30);
        // Save cookies
        cookie.save("userName", formData.username, {path: "/", expires: expireAuth});
        cookie.save("email", formData.email, {path: "/", expires: expireAuth});
        cookie.save("password", formData.password, {path: "/", expires: expireAuth});
        // Redirect to signIn
        history.push('/auth/login');
      }
    });
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.logo} />
        <span className={styles.title}>Sign Up</span>
        <TextField
          name='username'
          label='Full Name'
          className={styles.textField}
          value={formData.username}
          onChange={handleChange('username')}
          margin='normal'
          required
          error ={errors.username}
        />
        <TextField
          name='email'
          label='Email'
          className={styles.textField}
          value={formData.email}
          onChange={handleChange('email')}
          margin='normal'
          required
          error ={errors.email}
          helperText={errors.email ? 'Invalid email address' : null}
        />
        <TextField
          name='password'
          label='Password'
          type='password'
          className={styles.textField}
          value={formData.password}
          onChange={handleChange('password')}
          margin='normal'
          required
          error ={errors.password}
          helperText='Minimum password field length is 6 chars'
        />
        <Button variant='contained' style={{
          backgroundColor: (errors.username || errors.email || errors.password) ? '#b8b8b8' : '#1abc9c',
          color: '#fff',
          paddingLeft: '50px',
          paddingRight: '50px',
          marginTop: '20px' }}
          onClick={() => signUp()}
          disabled={errors.username || errors.email || errors.password}>
          Sign Up
        </Button>
        <Link className={styles.backToLogin} to="/auth/login">Back to Login Page</Link>
      </div>
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        open={emailExists}
        autoHideDuration={5000}
        onClose={() => setEmailExists(false)}
      >
        <Message message="Email exists" variant="error" onClose={() => setEmailExists(false)} />
      </Snackbar>
    </div>
  );
};

SignUp.propTypes = {
  history: PropTypes.shape({}).isRequired,
};

export default withRouter(SignUp);