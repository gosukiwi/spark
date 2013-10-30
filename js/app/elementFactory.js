/*
 * Create a new element based on the type
 */

define(['app/elements/canvas', 'app/elements/div', 'app/elements/image', 'app/elements/container', 'app/elements/text'], 
        function (canvas, div, image, containerDiv, text) {
    "use strict";

    // Turns a jQuery DOM element into a spark element
    return function (container, type, success) {
        if (type === 'div') {
            div(container, success);
        } else if (type === 'container') {
            containerDiv(container, success);
        } else if (type === 'text') {
            text(container, success);
        } else if (type === 'image') {
            image(container, success);
        }
    };
});
