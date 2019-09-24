import React from 'react';
import PropTypes from 'prop-types';
// material ui
import SnackbarContent from '@material-ui/core/SnackbarContent';
import { IconButton } from '@material-ui/core';
// icons
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import WarningIcon from '@material-ui/icons/Warning';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import CloseIcon from '@material-ui/icons/Close';

import styles from './styles.scss';

const variantIcon = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon,
};

const Message = ({ message, variant, onClose }) => {
  const Icon = variantIcon[variant];
  
  return (
    <SnackbarContent
      className={styles[variant]}
      aria-describedby="client-snackbar"
      message={
        <span id="client-snackbar" className={styles.message}>
          <Icon className={`${styles.icon} ${styles.iconVariant}`} />
          { message }
        </span>
      }
      action={[
        <IconButton key="close" aria-label="close" color="inherit" onClick={onClose}>
          <CloseIcon className={styles.icon} />
        </IconButton>
      ]}
    />
  );
};

Message.propTypes = {
  message: PropTypes.string,
  variant: PropTypes.oneOf(['error', 'info', 'success', 'warning']).isRequired,
  onClose: PropTypes.func,
};

export default Message;