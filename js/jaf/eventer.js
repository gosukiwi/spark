/*
 * Eventer generates listeners.
 * Listeners can listen and trigger events.
 *
 * var listener = eventer.listener();
 * listener.listen('myEvent');
 * listener.trigger('myEvent', arg1, arg2);
 *
 * You can also listen to several events and share a callback
 * 
 * listener.listen('update delete', myCallback);
 */

define(['underscore'], function (_) {
    return {
        listener: function () {
            var callbacks = {};

            return {
                listen: function(names, cb) {
                    _.each(names.split(' '), function (name) {
                        if(callbacks[name] === undefined) {
                            callbacks[name] = [];
                        } 
                        callbacks[name].push(cb);
                    });
                },

                trigger: function(name) {
                    var args;

                    // If the callback is defined
                    if(callbacks[name] && callbacks[name].length > 0) {
                        // Get the arguments
                        args = _.rest(_.toArray(arguments));

                        // Call with selected arguments
                        _.map(callbacks[name], function (cb) {
                            if(_.isFunction(cb)) {
                                cb.apply(undefined, args);
                            }
                        });
                    }
                }
            };
        }
    };
});
