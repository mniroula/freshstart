import React from 'react';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';

import SignIn from '../Auth/SignIn';
import SignUp from '../Auth/SignUp';
import ForgotPassword from '../Auth/ForgotPassword';
import ResetPassword from '../Auth/ResetPassword';
import Dashboard from '../Dashboard';

import 'client/styles/global.scss';

const App = ({ history }) => (
  <Router history={history}>
    <Switch>
      <Route path="/auth/login" component={SignIn} />
      <Route path="/auth/register" component={SignUp} />
      <Route path="/auth/forgot-password" component={ForgotPassword} />
      <Route path="/auth/reset-password/:token" component={ResetPassword} />
      <Route path="/" component={Dashboard} />
    </Switch>
  </Router>
);

export default App;
