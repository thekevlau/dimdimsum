import React from 'react';
import { Route, DefaultRoute, Redirect } from 'react-router';

import App from './App';
import Create from './components/Create';
import Home from './components/Home';
import Join from './components/Join';

export default (
    <Route name="app" handler={App} path="/">
        <DefaultRoute handler={Home} />
        <Route name="join" path="join" handler={Join} />
        <Route name="create" path="create" handler={Create} />
    </Route>
);
