import React, { useState } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import PropTypes from 'prop-types';

import SessionPicker from './components/SessionPicker';
import SessionClients from './components/SessionClients';
import Snackbar from '@material-ui/core/Snackbar';
import Message from '../_common/Message';

import { setClients } from '../../store/reducers/app/actions';
import { apiUrl } from '../../config';

import styles from './styles.scss';

const DataPostDashboard = ({ sessions, updateClients }) => {
  const [selectedSession, setSelectedSession] = useState(null);
  const [sessionClients, setSessionClients] = useState(null);
  const [fetchError, setFetchError] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [postError, setPostError] = useState(false);
  const [postSuccess, setPostSuccess] = useState(false);

  const onSessionToggle = (session) => {
    if (!session) return;
    setSelectedSession(session);
    setShowProgress(true);
    axios
      .get(`${apiUrl}/api/getClientsDataPost`, { params: { session } })
      .then(({data}) => {
        if (data.err) return;
        updateClients(data.data);
        setSessionClients(data.data);
        setShowProgress(false);
      })
      .catch(err => {
        console.log(err);
        setFetchError(true);
      });
  };

  const postClientsToFsPortal = () => {
    axios({
      method: 'post',
      url: `${apiUrl}/api/postClientsFS`,
      data: {
        session: selectedSession,
        clients: sessionClients.filter(s => !s.exists),
      }
    }).then(({data}) => {
      if (data.error) {
        console.log('Error', data.error);
        setPostError(true);
      } else {
        console.log('Success', data);
        setPostSuccess(true);
        const clients = sessionClients.map(sClient => ({
          ...sClient,
          exists: true,
        }));
        setSessionClients(clients)
      }
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.panel}>
        { sessionClients && <div className={styles.activeSession}>Total guests: {sessionClients.length}</div>}
        <SessionPicker
          sessions={sessions}
          onToggleSession={(sessionName) => onSessionToggle(sessionName)} />
      </div>
      <div className={styles.content}>
        <SessionClients
          clients={sessionClients}
          isProgress={showProgress}
          postClientsToFsPortal={postClientsToFsPortal} />
      </div>
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        open={fetchError}
        autoHideDuration={5000}
        onClose={() => setFetchError(false)}
      >
        <Message message="Fetch session clients error" variant="error" onClose={() => setFetchError(false)} />
      </Snackbar>
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        open={postError}
        autoHideDuration={5000}
        onClose={() => setPostError(false)}
      >
        <Message message="Fetch session clients error" variant="error" onClose={() => setPostError(false)} />
      </Snackbar>
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        open={postSuccess}
        autoHideDuration={5000}
        onClose={() => setPostSuccess(false)}
      >
        <Message message="Client(s) successfully imported into DB" variant="success" onClose={() => setPostSuccess(false)} />
      </Snackbar>
    </div>
  );
};

DataPostDashboard.propTypes = {
  sessions: PropTypes.arrayOf(PropTypes.shape({})),
  updateClients: PropTypes.func.isRequired,
};

const mapStateToProps = ({ app }) => {
  return {
    sessions: app.sessions,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateClients: clients => {
      dispatch(setClients(clients));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DataPostDashboard);
