import React from 'react';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import { Provider } from 'react-redux';

import SignIn from '../Auth/SignIn';
import SignUp from '../Auth/SignUp';
import ForgotPassword from '../Auth/ForgotPassword';
import ResetPassword from '../Auth/ResetPassword';
import Dashboard from '../Dashboard';

import store from '../../store';

import 'client/styles/global.scss';

const App = () => (
  <Router>
    <Provider store={store}>
      <Switch>
        <Route path="/auth/login" component={SignIn} />
        <Route path="/auth/register" component={SignUp} />
        <Route path="/auth/forgot-password" component={ForgotPassword} />
        <Route path="/auth/reset-password/:token" component={ResetPassword} />
        <Route path="/" component={Dashboard} />
      </Switch>
    </Provider>
  </Router>
);

export default App;
