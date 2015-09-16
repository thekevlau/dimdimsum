export default {
    generateActionCreators: actions => Object.keys(actions).reduce(
            (accum, type) => ({
                ...accum,
                [type]: data => ({
                    type,
                    data
                })
            }), {}),

    generateConnectionActionCreators: actions => Object.keys(actions).reduce(
            function(accum, type) {
                return {
                    ...accum,
                    [type]: function(to, data, except) {
                        return {
                            connectionAction: true,
                            type: type.replace('send', 'connection'),
                            data,
                            to,
                            except
                        };
                    }
                };
            }, {})
};
