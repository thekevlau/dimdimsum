export default {
    bind: function(fn, ...args) {
        if (!fn) {
            return null;
        }
        return fn.bind.apply(this, args);
    }
}
