import { handleActions } from 'redux-actions';

import { setUser, setSessions, setClients } from './actions';

export default handleActions(
  {
    [setUser]: (state, { payload: name } ) => ({ ...state, currentUser: name }),
    [setSessions]: (state, { payload: sessions } ) => ({ ...state, sessions }),
    [setClients]: (state, { payload: clients } ) => ({ ...state, clients }),
  },
  {
    currentUser: null,
    sessions: [],
    clients: [],
  },
);