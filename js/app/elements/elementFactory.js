/*
 * Create a new element based on the type
 */

define(['app/elements/div', 'app/elements/image', 'app/elements/container', 'app/elements/text', 'app/elements/grid'], 
        function (div, image, container, text, grid) {
    "use strict";

    // Turns a jQuery DOM element into a spark element
    return function (base_element, type, success, meta) {
        if (type === 'div') {
            div(base_element, success, meta);
        } else if (type === 'container') {
            container(base_element, success);
        } else if (type === 'grid') {
            grid(base_element, success);
        } else if (type === 'text') {
            text(base_element, success);
        } else if (type === 'image') {
            image(base_element, success);
        }
    };
});
