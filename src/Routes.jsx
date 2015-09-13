import React from 'react';
import { Route, DefaultRoute, Redirect } from 'react-router';

import App from './App';
import Home from './components/Home';
import WaitRoom from './components/WaitRoom';

export default (
    <Route name="app" handler={App} path="/">
        <DefaultRoute handler={Home} />
        <Route name="wait" path="wait" handler={WaitRoom} />
    </Route>
);
