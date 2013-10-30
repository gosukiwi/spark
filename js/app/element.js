define(['app/eventer', 'app/model', 'md5', 'app/history'], 
        function (eventer, model, md5, history) {
    "use strict";

    return function (container) {
        var listener = eventer.listener(),
            focused = false,
            widget,
            el;

        widget = {
            // Attributes
            'isContainer': false,
            'isResizable': false,
            'properties': model({}),
            'container': container,

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

            'onSelected': function (cb) {
                listener.listen('onSelected', cb);
                return widget;
            },

            'onDeselected': function (cb) {
                listener.listen('onDeselected', cb);
                return widget;
            },

            'selected': function (val) {
                if(val === undefined) {
                    return focused;
                }

                focused = val;

                if (val === true) {
                    widget.el().addClass('active');
                    listener.trigger('onSelected', el);
                } else {
                    widget.el().removeClass('active');
                    listener.trigger('onDeselected', el);
                }

                // For chanability
                return widget;
            },

            'applyHTML': function (props) {
                var key;
            
                for (key in props) {
                    if (props.hasOwnProperty(key)) {
                        widget.properties.set(key, props[key]);
                    }
                }
            },

            'append': function (elem) {
                widget.el().append(elem.el());
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
});
