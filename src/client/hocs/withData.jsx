import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import PropTypes from 'prop-types';

import { setSessions } from '../store/reducers/app/actions';
import { apiUrl } from '../config';

export default function withData(WrappedComponent) {
  const WithData = ({ updateSessions, ...props }) => {
    const [sessions, setSessions] = useState(null);

    useEffect(() => {
      axios
      .get(`${apiUrl}/api/getSessions`)
      .then(({data}) => {
        const mSessions = [];
        const s = Object.keys(data.data).forEach((key) => {
          mSessions.push({ id: key, sessionName: data.data[key] });
        });
        setSessions(mSessions);
        updateSessions(mSessions);
      })
      .catch(err => console.log(err));
    }, []);

    if (!sessions) return null;
    
    return <WrappedComponent {...props} />;
  };

  WithData.propTypes = {
    updateSessions: PropTypes.func.isRequired,
  };

  const mapDispatchToProps = dispatch => {
    return {
      updateSessions: sessions => {
        dispatch(setSessions(sessions));
      },
    };
  };

  return connect(null, mapDispatchToProps)(WithData);
};