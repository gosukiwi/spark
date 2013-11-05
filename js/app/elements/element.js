define(['jaf/eventer', 'jaf/model', 'md5', 'app/lib/history', 'app/elements/elementFactory'], 
        function (eventer, model, md5, history, factory) {
    "use strict";
    
    // holds an instance of a selected element, as only one can be
    // selected in the canvas, this is global to all elements
    var current_element,
    // the export function
        element_gen;
    
    element_gen = function (parent) {
        var listener = eventer.listener(),
            focused = false,
            widget,
            children = [],
            last_selected_child,
            el;
            
        widget = {
            // Attributes
            'isContainer': false,
            'isResizable': false,
            'properties': model({}),
            'parent': function () {
                return parent;
            },
            'children': function () {
                return children;
            },
            'root': function () {
                return parent === null ? widget : widget.parent();
            },

            // Methods
            'el': function (jqueryHtmlElem) {
                if(jqueryHtmlElem !== undefined) {
                    el = jqueryHtmlElem;
                    el.click(function (e) {
                        e.stopPropagation();
                        widget.selected(true);
                    });
                    return widget;
                }

                return el;
            },
            
            'add': function (type, params_obj) {
                if(!current_element.isContainer) {
                    throw "Cannot add element to a non container";
                }
                
                // Add an element of the specified type to this element
                factory(element_gen, current_element, type, function (elem) {
                    // Attach an event to this child
                    // when selected save data and trigger this 'onSelected' event
                    elem.onSelected(function (curr) {
                        listener.trigger('onSelected', curr);
                        current_element = curr;
                    });
                    
                    children.push(elem);
                    elem.parent().el().append(elem.el());
                    elem.selected(true);
                }, params_obj);
            },
            
            'onSelected': function (cb) {
                listener.listen('onSelected', cb);
                return widget;
            },

            'selected': function (val, except) {
                if(val === undefined) {
                    return focused;
                }

                focused = val;

                if (val === true) {
                    // Deselect current
                    current_element.selected(false);
                    // Add active class to this element, as it's now selected
                    widget.el().addClass('active');
                    // Trigger the callbacks
                    listener.trigger('onSelected', widget);
                    // And save this selection as current one
                    current_element = widget;
                } else {
                    // If set to false, just remove the active class if exists
                    widget.el().removeClass('active');
                }

                // For chanability
                return widget;
            },

            /*
            * Given a hash, apply it as html properties on this element
            */
            'html': function (props) {
                var key;
            
                for (key in props) {
                    if (props.hasOwnProperty(key)) {
                        widget.properties.set(key, props[key]);
                    }
                }
            },
            
            /* 
            * Gets the currently selected element, if this element is selected
            * returns it, if not, return last selected child's curr().
            */
            'curr': function () {
                return current_element;
            },

            'remove': function () {
                widget.selected(false);
                widget.el().remove();
            }
        };

        widget.properties.set('id', 
            md5(new Date().getUTCMilliseconds()).substr(0, 6));

        widget.properties.onChanged(function (key, val) {
            widget.el().attr(key, val);
        });

        widget.properties.onChanging(function (key, val) {
            history.add(function () {
                widget.properties.set(key, val);
            });
        });
        
        // current_element will start as the canvas
        if(current_element === undefined) {
            current_element = widget;
        }

        return widget;
    };
    
    return element_gen;
});
