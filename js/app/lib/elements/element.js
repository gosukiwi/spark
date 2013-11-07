/*
* Represents a HTML element inside the spark app.
* A canvas element is the root, and contains all other elements.
* Canvas is created manually once, all other elements are created
* by handling events in the UI.
*
* @Author Federico Ramírez
*
* Most common methods are 
*   el() - the jQuery DOM object
*   curr() - gets the current selected element (any element not just children of this one)
*   children() - array of children elements
*   parent() - the parent element
*   add() - adds an element inside this one
*
* Events:
*  selected - Triggers when the element is selected
*/
define(['jaf/eventer', 'jaf/model', 'md5', 'app/lib/history', 'app/lib/elements/elementFactory'], 
        function (eventer, model, md5, history, factory) {
    "use strict";
    
    // holds an instance of a selected element, as only one can be
    // selected in the canvas, this is global to all elements
    var current_element,
    // the export function, I'll use a function which returns instances
    // as using 'new' is not my cup of tea
        element_generator;
    
    element_generator = function (parent) {
            // an instance of jaf's eventer
        var listener = eventer.listener(),
            // used for holding whether this element is selected
            focused = false,
            // an array of elements, children of this one
            children = [],
            // a reference to the jQuery DOM element which this element represents
            el,
            // this object will be returned when the function is executed
            widget;
            
            
        widget = {
            // attributes
            'isContainer': false,
            'isResizable': false,
            'properties': model({}),
            'parent': function () {
                return parent;
            },
            
            // methods
            'children': function () {
                return children;
            },
            
            'root': function () {
                return parent === null ? widget : widget.parent().root();
            },

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
            
            /*
            * Adds a child element to this one
            */
            'add': function (type, params_obj) {
                if(!widget.isContainer) {
                    throw "Cannot add element to a non container";
                }
                
                params_obj = params_obj || {};
                params_obj.type = type;
                
                // factory takes a vanilla element and customizes it into a type
                // type is specified in params_obj.type
                factory(element_generator(widget), function (elem) {
                    // bubble the onSelected event up to root
                    // also save the current selected element
                    elem.on('selected', function (curr) {
                        listener.trigger('selected', curr);
                        current_element = curr;
                    });
                    
                    // add the new element to the children list of this one
                    children.push(elem);
                    // also append the new element html to this html
                    elem.parent().el().append(elem.el());
                    // and set as selected, this is useful so all new elements are born selected
                    elem.selected(true);
                }, params_obj);
            },
            
            /*
            * Triggers a callback when the element is selected
            */
            'on': function (name, cb) {
                listener.listen(name, cb);
                return widget;
            },

            /*
            * Sets or gets whether thsi element is selected
            */
            'selected': function (val) {
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
                    listener.trigger('selected', widget);
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

            /*
            * Removes this element from the canvas
            */
            'remove': function () {
                widget.parent()
                    .selected(true)
                    .unlinkChild(widget);
                widget.el().remove();
            },
            
            /*
            * Used automatically inside remove, it's used to
            * unlink the parent-child reference
            */
            'unlinkChild': function (el) {
                children = _.without(children, el);
            }
        };

        // before returning, let's add a unique id
        widget.properties.set('id', 
            md5(new Date().getUTCMilliseconds()).substr(0, 6));

        // also, listen for properties changes
        widget.properties.on('changed', function (key, val) {
            widget.el().attr(key, val);
        });

        // and before a property changes, add it to history
        // used for undo implementation
        widget.properties.on('changing', function (key, val) {
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
    
    // return generator function, calling this function generates instances of elements
    return element_generator;
});
