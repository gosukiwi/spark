/*
 * An element representing a canvas
 */
define(['jquery', 'underscore', 'app/elements/elementFactory', 'app/elements/element', 'jaf/eventer'], function ($, _, factory, element, eventer) {
    "use strict";

    return function (container, success) {
        var canvas = element(container),
            elements = [],
            listener = eventer.listener();

        function elementCreated(elem) {
            // When an element is selected
            // deselect all other elements
            // and call the onSelectionChanged callback of the canvas
            elem.onSelected(function () {
                _.filter(elements, function (el) {
                    return el.selected() && el !== elem;
                }).map(function (el) {
                    el.selected(false);
                });

                listener.trigger('onSelectionChanged', elem);
            });

            /* add to canvas */
            elements.push(elem);
            if (canvas.selected() && canvas.selected().isContainer) {
                canvas.selected().append(elem);
            } else {
                canvas.el().append(elem.el());
            }
            elem.selected(true);
        }

        /*
         * PROPERTIES
         */

        canvas.type = 'canvas';
        canvas.el($('#canvas').contents().find('body'));
        canvas.isContainer = true;

        /*
         * METHODS
         */

        canvas.remove = function (elem) {
            elem = elem || canvas.selected();
            if (elem) {
                // Select container
                if(elem.container.type === 'canvas') {
                    listener.trigger('onNothingSelected');
                } else {
                    elem.container.selected(true);
                }

                // Remove the element from the container
                elem.remove();

                // When removing and element also remove all children
                _.each(_.filter(elements, function (el) {
                    return el.container === elem;
                }), function (elem) {
                    elem.remove();
                    elements = _.without(elements, elem);
                });

                elements = _.without(elements, elem);
            }
        };

        canvas.onSelectionChanged = function (cb) {
            listener.listen('onSelectionChanged', cb);
            // chainability
            return canvas;
        };


        canvas.onNothingSelected = function (cb) {
            listener.listen('onNothingSelected', cb);
            // chainability
            return canvas;
        };

        // Return all selected elements in the canvas
        canvas.allSelected = function () {
            return _.filter(elements, function (el) {
                return el.selected();
            });
        };

        // Return the first selected element in the canvas
        canvas.selected = function () {
            return canvas.allSelected()[0];
        };

        // Add a new element to the canvas
        // The meta argument is metadata
        canvas.add = function (type, meta) {
            factory(canvas, type, elementCreated, meta);
        };

        canvas.cssChanged = function (text) {
            $('#canvas').contents().find('#canvas-css').text(text);
        };

        canvas.htmlChanged = function (props) {
            var el = canvas.selected();
            if (el) {
                el.applyHTML(props);
            } else {
                canvas.applyHTML(props);
            }
        };

        // Do
        canvas.el().click(function () {
            // Find all focused elements and unfocus them
            _.map(canvas.allSelected(), function (el) {
                el.selected(false);
            });

            // If the callback is defined, call it
            listener.trigger('onNothingSelected');
        });

        success(canvas);
    };
});
