import React from 'react/addons';
import { RouteHandler } from 'react-router';
import fluxMixin from 'flummox/mixin';

export default React.createClass({
    statics: {
        init: async function({state, flux}){

        }
    },

    render: function(){
        return (
            <div className="home">
                It works!
            </div>
        );
    }
});
