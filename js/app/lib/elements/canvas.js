/*
 * An element representing a canvas
 */
define([
        'jquery', 
        'underscore', 
        'app/lib/cssParser', 
        'app/lib/elements/element', 
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
        canvas.on('selected', function () {
            // Find all focused elements and unfocus them
            canvas.el().removeClass('active');
        });

        success(canvas);
    };
});
