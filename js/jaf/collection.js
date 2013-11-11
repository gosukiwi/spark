/*
* An observable collection
* Events: added, changed and removed.
*/
define(['underscore', 'jaf/eventer'], function (_, eventer) {
    "use strict";
    
    return function () {
        var list = [],
            listener = eventer.listener();
            
        return {
            // add a new item to the collection
            'add': function (item) {
                list.push(item);
                item.on('change', function (attr, val) {
                    listener.trigger('changed', item, attr, val);
                });
                listener.trigger('added', item);
                
                // chainability
                return this;
            },
            
            'each': function (fn) {
                return _.each(list, fn);
            },
            
            // find an item in the collection, can either be called with
            // the item instance or the model guid
            'find': function (findee) {
                var comparator = function (item) {
                    return item === findee;
                };
                
                if(_.isString(findee)) {
                    comparator = function (item) {
                        return item.get('guid') === findee;
                    };
                }
                
                return _.findWhere(list, comparator);
            },
            
            // remove an item from the collection
            'remove': function (item) {
                if(_.isString(item)) {
                    return this.remove(this.find(item));
                }
                
                list = _.without(list, item);
                listener.trigger('removed', item);
                
                // chainability
                return this;
            },
            
            // listen to events
            'on': function (name, cb) {
                listener.listen(name, cb);
                
                // chainability
                return this;
            },
            
            // returns a copy of this collection as an array
            'plain': function () {
                return _.map(list, function (item) {
                    return item.plain();
                });
            },
            
            // deletes all elements in the collection
            'empty': function () {
                list = [];
                
                // chainability
                return this;
            },
            
            // returns the length of the collection
            'length': function () {
                return list.length;
            }
        };
    };
});