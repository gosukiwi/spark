/*
 * Create a new element based on the type
 */

define(['jaf/globals', 'app/elements/div', 'app/elements/image', 'app/elements/container', 'app/elements/text', 'app/elements/grid'], 
        function (globals, div, image, containerDiv, text, grid) {
    "use strict";

    // Turns a jQuery DOM element into a spark element
    return function (element_gen, parent, type, success, meta) {
        if (type === 'div') {
            div(element_gen, parent, success, meta);
        } else if (type === 'container') {
            containerDiv(element_gen, parent, success);
        } else if (type === 'grid') {
            grid(parent, success);
        } else if (type === 'text') {
            text(element_gen, parent, success);
        } else if (type === 'image') {
            image(element_gen, parent, success);
        }
    };
});
