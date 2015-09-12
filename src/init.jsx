import 'babel/polyfill';
import './polyfills/ArrayPolyfills';
import './polyfills/ObjectPolyfills';
import './polyfills/StringPolyfills';

import AppRoutes from './Routes';
import InternalActionMiddleware from './middleware/InternalActionMiddleware';
import { Provider } from 'react-redux';
import React from 'react';
import Reducers from './reducers';
import { applyMiddleware, createStore } from 'redux';
import Router from 'react-router';

const router = Router.create({
    routes: AppRoutes,
    location: Router.HistoryLocation
});

const store = applyMiddleware(InternalActionMiddleware)(createStore)
        (Reducers, window.__INITIAL_STORE_STATE__ || {
    gameState: {
        self: null,
        roomName: null,
        players: {},
        hostPlayer: null
    }
});

// Run static init methods for components (used to fetch initial data).
router.run((Handler, state) => {
    // Remove function wrap around handler with react 0.14.
    const appRoot = (
        <Provider store={store}>
            { () => <Handler {...state} /> }
        </Provider>
    );

    React.render(appRoot, document.getElementById('app'));
});
