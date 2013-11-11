/*
 * An element representing a canvas
 */
define([
        'jquery', 
        'underscore', 
        'app/lib/css-parser', 
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
         
        /*
        * Sets the CSS of the canvas.
        */
        canvas.css = function (text) {
            var css;
            
            if(text === undefined) {
                return $('#canvas').contents().find('#canvas-css').text();
            } else {
                css = cssParser(text);
                $('#canvas').contents().find('#canvas-css').text(css);
            }
        };

        // Do
        canvas.on('selected', function () {
            // Find all focused elements and unfocus them
            canvas.el().removeClass('active');
        });

        success(canvas);
    };
});
