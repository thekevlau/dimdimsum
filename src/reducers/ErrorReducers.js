export default (errorState={}, action) => {
    switch (action.type) {
        case 'APP_ERROR':
            return {
                ...errorState,
                errors: [
                    ...errorState.errors,
                    {
                        message: action.message,
                        fatal: action.fatal
                    }
                ]
            };

        default:
            return errorState;
    }
};
