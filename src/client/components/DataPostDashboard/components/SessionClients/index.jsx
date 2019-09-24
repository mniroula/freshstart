import React from 'react';
import PropTypes from 'prop-types';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

import styles from './styles.scss';

const SessionClients = ({ clients, isProgress, postClientsToFsPortal }) => {
  
  if (isProgress) return (
    <div className={styles.progressContainer}>
      <CircularProgress />
    </div>
  );

  if (!clients) return null;
  
  return (
    <div>
      <Paper className={styles.root}>
        <div className={styles.tableWrapper}>
          <Table stickyHeader className={styles.table}>
            <TableHead>
              <TableRow className={styles.tableHeading}>
                <TableCell>Firstname</TableCell>
                <TableCell>Lastname</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>City</TableCell>
                <TableCell>Cycle</TableCell>
                <TableCell>Program Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {clients.map(client => (
                <TableRow key={client.id} className={`${client.exists ? styles.existingClient : null}`}>
                  <TableCell component="th" scope="client">{client.firstName}</TableCell>
                  <TableCell>{client.lastName}</TableCell>
                  <TableCell>{client.email}</TableCell>
                  <TableCell>{client.city}</TableCell>
                  <TableCell>{client.programCycle}</TableCell>
                  <TableCell>{client.programDatesInternalUse}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Paper>
      <div className={styles.buttonRow}>
        <Button
          variant="contained"
          className={styles.button}
          onClick={() => postClientsToFsPortal()}>Import</Button>
      </div>
    </div>
  );
};

SessionClients.propTypes = {
  clients: PropTypes.arrayOf(PropTypes.shape({})),
  isProgress: PropTypes.bool.isRequired,
  postClientsToFsPortal: PropTypes.func.isRequired,
};

SessionClients.defaultProps = {
  clients: null,
};

export default SessionClients;