import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Login from './pages/Login';
import Timeline from './pages/Timeline';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Login} />
        <Route path="/Timeline" component={Timeline} />

      </Switch>
    </BrowserRouter>
  );
}

export default App;
