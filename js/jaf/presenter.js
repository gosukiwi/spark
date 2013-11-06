/*
* Extend an object onto a presenter.
* A presenter has .on and .trigger methods to handle events
*/
define(['underscore', 'jaf/eventer'], function (_, eventer) {
    return {
        extend: function (p) {
            var listener = eventer.listener();

            p.on = function (name, cb) {
                listener.listen(name, cb);
                // chainability
                return this;
            };

            p.trigger = function () {
                listener.trigger.apply(null, _.toArray(arguments));
                // chainability
                return this;
            };

            return p;
        }
    }
});
