import React, { useState } from 'react';
import { withRouter, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import axios from 'axios';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import Message from '../../_common/Message';

import { apiUrl } from '../../../config';

import styles from './styles.scss';

const ForgotPassword = ({ history }) => {
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const [values, setValues] = useState({ email: '' });
  const [errors, setErrors] = useState({ email: !re.test(values.email) });
  const [resetErrorEmail, setResetErrorEmail] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);

  const handleChange = name => event => {
    const value = event.target.value;
    setValues({ email: value }); 
    setErrors({ email: !re.test(value) });
  };

  const resetPassword = () => {
    axios({
      method: 'post',
      url: `${apiUrl}/api/forgotPassword`,
      data: {
        email: values.email
      }
    }).then(({data}) => {
      if (data.error) {
        setErrors({ email: true });
        setValues({ email: '' });
        setResetErrorEmail(true);
      } else {
        setResetEmailSent(true);
      }
    });
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.logo} />
        <span className={styles.title}>Forgot Password</span>
        <span className={styles.description}>Please enter the email that you've used. We'll send you the password reset link.</span>
        <TextField
          name='email'
          label='Email'
          className={styles.textField}
          value={values.email}
          onChange={handleChange('email')}
          margin='normal'
          required
          error ={errors.email}
          helperText={errors.email ? 'Invalid email address' : null }
        />
        <Button variant='contained' style={{
          backgroundColor: errors.email ? '#b8b8b8' : '#1abc9c',
          color: '#fff',
          paddingLeft: '50px',
          paddingRight: '50px',
          marginTop: '20px' }}
          onClick={() => resetPassword()}
          disabled={errors.email}>
          Reset Password
        </Button>
        <Link className={styles.backToLogin} to="/auth/login">Back to Login Page</Link>
      </div>
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        open={resetErrorEmail}
        autoHideDuration={5000}
        onClose={() => setResetErrorEmail(false)}
      >
        <Message message="Email doesn't exist" variant="error" onClose={() => setResetErrorEmail(false)} />
      </Snackbar>
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        open={resetEmailSent}
        autoHideDuration={5000}
        onClose={() => setResetEmailSent(false)}
      >
        <Message message="Reset email sent" variant="success" onClose={() => setResetEmailSent(false)} />
      </Snackbar>
    </div>
  );
};

ForgotPassword.propTypes = {
  history: PropTypes.shape({}).isRequired,
};

export default withRouter(ForgotPassword);
