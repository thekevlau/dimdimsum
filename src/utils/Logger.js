export default {
    debug: (...msgs) => {
        if (window.__DEBUG__) {
            console.log('DEBUG:', ...msgs);
        }
    },

    debugGroup: (...names) => {
        if (window.__DEBUG__) {
            console.group(...names);
        }
    },

    debugGroupEnd: (...names) => {
        if (window.__DEBUG__) {
             console.groupEnd(...names);
        }
    }
};
