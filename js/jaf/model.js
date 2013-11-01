/*
 * Just a bunch of attributes with events
 */

define(['jaf/eventer'], function (eventer) {
    "use strict";

    function setMany(model, attrs) {
        var key;

        for(key in attrs) {
            if(attrs.hasOwnProperty(key)) {
                model.set(key, attrs[key]);
            }
        }
    }

    // Return a function which takes an object 
    // and adds events
    return function (obj) {
        var listener = eventer.listener(),
            model;

        model = {
            // Changed callback
            onChanged: function (cb) {
                listener.listen('changed', cb);
            },

            onChanging: function (cb) {
                listener.listen('changing', cb);
            },
            
            // Return a copy of the object attributes
            props: function() {
                return _.clone(obj);
            },

            // Delete all attributes from the object
            clear: function () {
                obj = {};
            },

            // Set a value
            set: function(attr, val) {
                if(_.isObject(attr)) {
                    return setMany(model, attr);
                }

                // If the object has a value, trigger
                // the CHANGING event
                if(obj[attr] && obj[attr] !== val) {
                    listener.trigger('changing', 
                            attr, obj[attr]);
                }

                obj[attr] = val;

                // Finally trigger the CHANGED event
                listener.trigger('changed', attr, val);
            },

            // Get the value
            get: function(attr) {
                return obj[attr];
            }
        };

        return model;
    };
});
