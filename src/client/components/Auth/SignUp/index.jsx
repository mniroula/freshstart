import React, { useState } from 'react';
import { withRouter, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import cookie from 'react-cookies';
import axios from 'axios';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import styles from './styles.scss';

const SignUp = ({ history }) => {
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const [values, setValues] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({
    email: !re.test(values.email),
    password: values.password.length < 6
  });
  const [emailExists, setEmailExists] = useState(false);

  const handleChange = name => event => {
    const value = event.target.value;
    setValues({ ...values, [name]: value }); 
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
      url: '/api/signup',
      data: {
        email: values.email,
        password: values.password
      }
    }).then(({data}) => {
      if (data.error) {
        setErrors(err => ({ ...err, email: true }));
        setValues(v => ({ ...v, password: '' }));
        setEmailExists(true);
      } else {
        const expireAuth = getExpireDate(60 * 24 * 30);
        // Save cookies
        cookie.save("userId", data.userId, {path: "/", expires: expireAuth});
        cookie.save("email", values.email, {path: "/", expires: expireAuth});
        cookie.save("password", values.password, {path: "/", expires: expireAuth});
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
          name='email'
          label='Email'
          className={styles.textField}
          value={values.email}
          onChange={handleChange('email')}
          margin='normal'
          required
          error ={errors.email}
          helperText={emailExists ? 'Email exists' : null}
        />
        <TextField
          name='password'
          label='Password'
          type='password'
          className={styles.textField}
          value={values.password}
          onChange={handleChange('password')}
          margin='normal'
          required
          error ={errors.password}
          helperText='Minimum password field length is 6 chars'
        />
        <Button variant='contained' style={{
          backgroundColor: (errors.email || errors.password) ? '#b8b8b8' : '#1abc9c',
          color: '#fff',
          paddingLeft: '50px',
          paddingRight: '50px',
          marginTop: '20px' }}
          onClick={() => signUp()}
          disabled={errors.email || errors.password}>
          Sign Up
        </Button>
        <Link className={styles.backToLogin} to="/auth/login">Back to Login Page</Link>
      </div>
    </div>
  );
};

SignUp.propTypes = {
  history: PropTypes.shape({}).isRequired,
};

export default withRouter(SignUp);