import React from 'react';
import { Route, DefaultRoute, Redirect } from 'react-router';

import App from './App';
import Home from './components/Home';

import Send from './components/Send';
import Receive from './components/Receive';

export default (
    <Route name="app" handler={App} path="/">
        <DefaultRoute handler={Home} />
        <Route name="send" handler={Send} path="send" />
        <Route name="receive" handler={Receive} path="receive" />
    </Route>
);
