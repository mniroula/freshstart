import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import Message from '../../_common/Message';

import { apiUrl } from '../../../config';

import styles from './styles.scss';

const ResetPassword = ({ match }) => {
  const [values, setValues] = useState({
    isTokenValidated: false,
    isValidToken: false,
    userId: null,
    password: '',
    repeatPassword: '',
    passwordsMatch: false
  });
  const [errorMessage, setErrorMessage] = useState(false);
  const [errorPasswordUpdate, setErrorPasswordUpdate] = useState(false);
  const [passwordUpdated, setPasswordUpdated] = useState(false);

  // Validate token
  useEffect(() => {
    axios({
      method: 'post',
      url: `${apiUrl}/api/validateToken`,
      data: {
        token: match.params.token
      }
    }).then(({data}) => {
      if (data.error) {
        setValues(v => ({
          ...v,
          isTokenValidated: true,
          isValidToken: false
        }));
        setErrorMessage(true);
      } else {
        console.log(data);
        setValues(v => ({
          ...v,
          isTokenValidated: true,
          isValidToken: true,
          userId: data.id
        }));
      }
    });
  }, []);

  const handleChange = name => event => {
    const value = event.target.value;
    setValues(v => ({ ...v, [name]: value }));
    if (name === 'password' && value.length > 5 && values.repeatPassword.length > 5 && value === values.repeatPassword) {
      setValues(v => ({ ...v, passwordsMatch: true }));
    } else if (name === 'repeatPassword' && value.length > 5 && values.password.length > 5 && value === values.password) {
      setValues(v => ({ ...v, passwordsMatch: true }));
    }
  };

  const updatePassword = () => {
    axios({
      method: 'post',
      url: `${apiUrl}/api/updatePassword`,
      data: {
        id: values.userId,
        password: values.password
      }
    }).then(({data}) => {
      if (data.error) {
        setErrorPasswordUpdate(true);
      } else {
        setPasswordUpdated(true);
      }
    });
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.logo} />
        {
          !values.isTokenValidated && (
            <h1>Please wait</h1>
          )
        }
        <span className={styles.title}>Reset Password</span>
        <TextField
          name='password'
          label='Password'
          type='password'
          className={styles.textField}
          value={values.password}
          onChange={handleChange('password')}
          margin='normal'
          required
          error ={!values.passwordsMatch}
          helperText='Minimum password field length is 6 chars'
        />
        <TextField
          name='repeatPassword'
          label='Repeat Password'
          type='password'
          className={styles.textField}
          value={values.repeatPassword}
          onChange={handleChange('repeatPassword')}
          margin='normal'
          required
          error ={!values.passwordsMatch}
        />
        <Button variant='contained' style={{
          backgroundColor: !values.passwordsMatch ? '#b8b8b8' : '#1abc9c',
          color: '#fff',
          paddingLeft: '50px',
          paddingRight: '50px',
          marginTop: '20px' }}
          onClick={() => updatePassword()}
          disabled={!values.passwordsMatch || (values.isTokenValidated && !values.isValidToken)}>
          Update Password
        </Button>
        <Link className={styles.backToLogin} to="/auth/login">Back to Login Page</Link>
      </div>
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        open={errorMessage}
        autoHideDuration={5000}
        onClose={() => setErrorMessage(false)}
      >
        <Message message="Token is invalid or has been expired" variant="error" onClose={() => setErrorMessage(false)} />
      </Snackbar>
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        open={errorPasswordUpdate}
        autoHideDuration={5000}
        onClose={() => setErrorPasswordUpdate(false)}
      >
        <Message message="Password update error" variant="error" onClose={() => setErrorPasswordUpdate(false)} />
      </Snackbar>
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        open={passwordUpdated}
        autoHideDuration={5000}
        onClose={() => setPasswordUpdated(false)}
      >
        <Message message="Password updated" variant="success" onClose={() => setPasswordUpdated(false)} />
      </Snackbar>
    </div>
  );
};

export default ResetPassword;
