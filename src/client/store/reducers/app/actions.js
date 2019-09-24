import { createActions } from 'redux-actions';

export const {
  setUser,
  setSessions,
  setClients,
} = createActions('SET_USER', 'SET_SESSIONS', 'SET_CLIENTS');
