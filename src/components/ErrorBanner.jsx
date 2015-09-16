import React from 'react';

export default React.createClass({
    render: function() {
        if (!this.props.errors.length) {
            return <div></div>;
        }

        return (
            <div>
                {this.props.errors[0].message}
            </div>
        );
    }
});
