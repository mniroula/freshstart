import React, { useState } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import cookie from 'react-cookies';
import axios from 'axios';

import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import Message from '../../_common/Message';

import { setUser } from '../../../store/reducers/app/actions';
import { apiUrl } from '../../../config';

import styles from './styles.scss';

const SignIn = ({ history, onLoginUser }) => {
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const [values, setValues] = useState({
    email: cookie.load('email') || '',
    password: cookie.load('password') || ''
  });
  const [errors, setErrors] = useState({
    email: !re.test(values.email),
    password: values.password.length < 6
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [loginError, setLoginError] = useState(false);

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

  const signIn = () => {
    // Validate email/password
    axios({
      method: 'post',
      url: `${apiUrl}/api/signin`,
      data: {
        email: values.email,
        password: values.password
      }
    }).then(({data}) => {
      if (data.error) {
        setErrors({ email: true, password: true });
        setValues({ email: '', password: '' });
        setLoginError(true);
      } else {
        // Save cookies
        if (rememberMe) {
          const expireAuth = getExpireDate(60 * 24 * 30);
          cookie.save("email", values.email, {path: "/", expires: expireAuth});
          cookie.save("password", values.password, {path: "/", expires: expireAuth});
        }
        // Authorize
        const expireSignIn = getExpireDate(60 * 12);
        cookie.save("authorized", true, {path: "/", expires: expireSignIn});
        cookie.save("username", data.data.username, {path: "/", expires: expireSignIn});
        // Redux
        onLoginUser(values.email);
        // Redirect to dashboard
        history.push('/');
      }
    });
  };

  const handleCloseMessage = () => {
    setLoginError(false);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.logo} />
        <span className={styles.title}>Sign In</span>
        <TextField
          name='email'
          label='Email'
          className={styles.textField}
          value={values.email}
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
          value={values.password}
          onChange={handleChange('password')}
          margin='normal'
          required
          error ={errors.password}
          helperText={errors.password ? 'Minimum password field length is 6 chars' : null}
        />
        <div className={styles.row}>
          <FormControlLabel
            control={
              <Checkbox
                checked={rememberMe}
                onChange={() => setRememberMe(c => !c)}
                value={rememberMe}
                style ={{ color: '#1abc9c' }}
              />
            }
            label='Remember Me'
          />
          <Link to="/auth/forgot-password" className={styles.forgotPassword}>Forgot Password?</Link>
        </div>
        <Button variant='contained' style={{
          backgroundColor: (errors.email || errors.password) ? '#b8b8b8' : '#1abc9c',
          color: '#fff',
          paddingLeft: '50px',
          paddingRight: '50px',
          marginTop: '20px' }}
          onClick={() => signIn()}
          disabled={errors.email || errors.password}>
          Sign In
        </Button>
        <Link className={styles.signUp} to="/auth/register">Sign Up</Link>
      </div>
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        open={loginError}
        autoHideDuration={5000}
        onClose={handleCloseMessage}
      >
        <Message message="Wrong email/password" variant="error" onClose={handleCloseMessage} />
      </Snackbar>
    </div>
  );
};

SignIn.propTypes = {
  history: PropTypes.shape({}).isRequired,
  onLoginUser: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => {
  return {
    onLoginUser: name => {
      dispatch(setUser(name));
    }
  };
};

export default withRouter(
  connect(null, mapDispatchToProps)(SignIn)
);