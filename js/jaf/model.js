/*
 * An object with events
 * Possible events are changed and changing
 * Use .get and .set for attributes manipulation
 */

define(['underscore', 'jaf/eventer'], function (_, eventer) {
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
    return {
        extend: function (base) {
            var listener = eventer.listener(),
                obj = _.clone(base),
                model;
              
            model = {
                // listen to events
                on: function (name, cb) {
                    listener.listen(name, cb);
                },
                
                // return a copy of the object attributes
                props: function() {
                    return _.clone(obj);
                },
    
                // delete all attributes from the object
                clear: function () {
                    obj = {};
                },
    
                // set a value
                set: function(attr, val) {
                    if(_.isObject(attr)) {
                        return setMany(model, attr);
                    }
    
                    // if the object has a value, trigger
                    // the CHANGING event
                    if(obj[attr] && obj[attr] !== val) {
                        listener.trigger('changing', attr, obj[attr]);
                    }
    
                    obj[attr] = val;
    
                    // Finally trigger the CHANGED event
                    listener.trigger('changed', attr, val);
                },
    
                // get the value
                get: function(attr) {
                    return obj[attr];
                }
            };
            
            
            // copy the functions of the original object onto model
            _.each(_.keys(obj), function (key) {
                if(_.isFunction(obj[key])) {
                    model[key] = obj[key];
                }
            });
    
            // finally return it
            return model;
        }
    };
});
