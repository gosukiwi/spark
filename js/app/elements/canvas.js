/*
 * An element representing a canvas
 */
define([
        'jquery', 
        'underscore', 
        'app/helpers/cssParser', 
        'app/elements/element', 
        'jaf/eventer'
    ], function ($, _, cssParser, element, eventer) {
    "use strict";

    return function (container, success) {
        var canvas = element(container),
            listener = eventer.listener();

        
        /*
         * PROPERTIES
         */

        canvas.type = 'canvas';
        canvas.el($('#canvas').contents().find('body'));
        canvas.isContainer = true;

        /*
         * METHODS
         */
         
        canvas.elements = function () {
            return elements;
        };

        canvas.remove = function (elem) {
            elem = elem || canvas.curr();
            if (elem) {
                if(elem.type === 'canvas') {
                    throw "You cannot delete the canvas!";
                }
                
                elem.parent().selected(true);

                // Remove the element from the container
                elem.remove();
                elem.parent().removeChild(elem);
            }
        };

        /*
        * Sets the CSS of the canvas.
        * TODO: Move to spark.js?
        */
        canvas.css = function (text) {
            // parse the css to use the library
            var css = cssParser(text);
            $('#canvas').contents().find('#canvas-css').text(css);
        };

        // Do
        canvas.onSelected(function () {
            // Find all focused elements and unfocus them
            canvas.el().removeClass('active');
        });

        success(canvas);
    };
});
