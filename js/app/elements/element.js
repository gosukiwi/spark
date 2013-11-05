define(['jaf/eventer', 'jaf/model', 'md5', 'app/lib/history', 'app/elements/elementFactory', 'jaf/globals'], 
        function (eventer, model, md5, history, factory, globals) {
    "use strict";
    
    var element_gen = function (parent) {
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
                if(!globals.current_element.isContainer) {
                    throw "Cannot add element to a non container";
                }
                
                // Add an element of the specified type to this element
                factory(element_gen, widget, type, function (elem) {
                    // Attach an event to this child
                    // when selected save data and trigger this 'onSelected' event
                    elem.onSelected(function (curr) {
                        last_selected_child = curr;
                        listener.trigger('onSelected', curr);
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
                    widget.el().addClass('active');
                    listener.trigger('onSelected', widget);
                    // If a selection exists, deselect
                    if(globals.current_element) {
                        globals.current_element.selected(false);
                    }
                    // And save this selection as current one
                    globals.current_element = widget;
                } else {
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
                globals.current_element;
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

        return widget;
    };
    
    return element_gen;
});
