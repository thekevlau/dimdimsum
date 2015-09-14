import 'babel/polyfill';
import './polyfills/ArrayPolyfills';
import './polyfills/ObjectPolyfills';

import AppRoutes from './Routes';
import { applyMiddleware, createStore } from 'redux';
import Connection from './components/Connection';
import ConnectionActionMiddleware from './middleware/ConnectionActionMiddleware';
import LoggerMiddleware from './middleware/LoggerMiddleware';
import { Provider } from 'react-redux';
import React from 'react';
import Reducers from './reducers';
import Router from 'react-router';

window.__DEBUG__ = true;

const router = Router.create({
    routes: AppRoutes,
    location: Router.HistoryLocation
});

const store = applyMiddleware(
    LoggerMiddleware,
    ConnectionActionMiddleware
)(createStore)(Reducers, window.__INITIAL_STORE_STATE__ || {
    gameState: {
        self: null,
        roomName: null,
        players: {},
        hostName: null
    },
    errorState: {
        errors: []
    }
});

// Run static init methods for components (used to fetch initial data).
router.run((Handler, state) => {
    // Remove function wrap around handler with react 0.14.
    const connectionWrapper = () => (
        <Connection>
            <Handler {...state} />
        </Connection>
    );

    const appRoot = (
        <Provider store={store}>
            {connectionWrapper}
        </Provider>
    );

    React.render(appRoot, document.getElementById('app'));
});
