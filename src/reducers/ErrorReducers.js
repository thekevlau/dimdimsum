export default (errorState={}, action) => {
    switch (action.type) {
        case 'APP_ERROR':
            return {...errorState, errors: [...errorState.errors, action.message]};
        default:
            return errorState;
    }
};
