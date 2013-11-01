/*
 * An element representing an text
 */
define(['app/elements/element', 'app/view'], function (element, view) {
    "use strict";

    return function (container, success) {
        var text;

        text = element(container);

        text.properties.onChanged(function (key, val) {
            // Text has a special propertie which is
            // CONTENT this property is used to fill
            // the content of a paragraph element
            if(key === 'content') {
                text.el().removeAttr(key);
                text.el().text(val);
            }
        });

        text.el(view('elements/text.mustache'));
        text.type = 'text';
        text.isContainer = false;
        text.isResizable = false;

        text.properties.set({
            'content': 'Example text',
        });

        // Call success if exists
        _.isFunction(success) && success(text);
    }
});
