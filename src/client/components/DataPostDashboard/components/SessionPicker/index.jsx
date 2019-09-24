import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import styles from './styles.scss';

const SessionPicker = ({ sessions, onToggleSession }) => {
  const [session, setSession] = useState(null);

  const toggleSession = (sessionName) => {
    setSession(sessionName);
    onToggleSession(sessionName);
  };

  if (!sessions.length) return null;

  return (
    <FormControl className={styles.formControl}>
      <InputLabel htmlFor="session">Session</InputLabel>
      <Select
        value={session || 'Select session'}
        onChange={(e) => toggleSession(e.target.value)}
      >
        {
          sessions.map(x => <MenuItem key={x.id} value={x.sessionName}>{x.sessionName}</MenuItem>)
        }
      </Select>
    </FormControl>
  );
};

SessionPicker.propTypes = {
  sessions: PropTypes.arrayOf(PropTypes.shape({})),
  onToggleSession: PropTypes.func.isRequired,
};

SessionPicker.defaultProps = {
  sessions: null,
};

export default SessionPicker;