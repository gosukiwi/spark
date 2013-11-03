define(['underscore', 'jaf/eventer'], function (_, eventer) {
    return {
        extend: function (p) {
            var listener = eventer.listener();

            p.on = function (evt, cb) {
                _.each(evt.split(' '), function (name) {
                    listener.listen(name, cb);
                });
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
