/*
 * The canvas is where everything will be drawn onto
 */

define(['jquery', 'underscore', 'app/elementFactory', 'app/eventer', 'jquery-ui'], function ($, _, factory, eventer) {
    "use strict";

    var elements = [],
        canvas,
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
            canvas.el.append(elem.el());
        }
        elem.selected(true);
    }

    // Deselect everything when clicked in the background
    $('#canvas').contents().find('body').click(function () {
        // Find all focused elements and unfocus them
        _.map(canvas.allSelected(), function (el) {
            el.selected(false);
        });

        // If the callback is defined, call it
        listener.trigger('onNothingSelected');
    });

    // Make canvas unselectable
    $('#canvas-container')
        .attr('unselectable', 'on')
        .css('user-select', 'none')
        .on('selectstart', false);

    canvas = {
        'el': $('#canvas').contents().find('body'),

        'onSelectionChanged': function (cb) {
            listener.listen('onSelectionChanged', cb);
            // for chainability
            return canvas;
        },

        'onNothingSelected': function (cb) {
            listener.listen('onNothingSelected', cb);
            // for chainability
            return canvas;
        },

        'removeCurrent': function () {
            var selected = canvas.selected();
            elements = _.filter(elements, function (el) {
                return el !== selected;
            });
            // Set as unselected and remove
            selected
                .selected(false)
                .el().remove();
        },

        'add': function (type) {
            // Create an element of the specified type
            factory(canvas.selected(), type, elementCreated);
            // for chainability
            return canvas;
        },

        'allSelected': function () {
            return _.filter(elements, function (el) {
                return el.selected();
            });
        },

        'selected': function () {
            return canvas.allSelected()[0];
        },

        'cssChanged': function (text) {
            var el = canvas.selected();
            // If an element is selected apply the new CSS
            if (el) {
                el.applyCSS(text);
            }
            // TODO: Apply to canvas
        },

        'htmlChanged': function (props) {
            var el = canvas.selected();
            if (el) {
                el.applyHTML(props);
            }
            // TODO Apply to canvas
        }
    };

    return canvas;
});
