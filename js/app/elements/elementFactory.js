/*
 * Create a new element based on the type
 */

define(['jaf/globals', 'app/elements/div', 'app/elements/image', 'app/elements/container', 'app/elements/text', 'app/elements/grid'], 
        function (globals, div, image, containerDiv, text, grid) {
    "use strict";

    // Turns a jQuery DOM element into a spark element
    return function (element_gen, canvas, type, success, meta) {
        var container = globals.current_element;
        
        if (type === 'div') {
            div(element_gen, canvas, container, success, meta);
        } else if (type === 'container') {
            containerDiv(element_gen, container, success);
        } else if (type === 'grid') {
            grid(element_gen, container, success);
        } else if (type === 'text') {
            text(element_gen, container, success);
        } else if (type === 'image') {
            image(container, success);
        }
    };
});
