/*
 * Create a new element based on the type
 */

define(['app/lib/elements/div', 'app/lib/elements/image', 'app/lib/elements/text', 'app/lib/elements/grid'], 
        function (div, image, text, grid) {
    "use strict";

    // Given a base element, calls a function to extend
    // it into the required type, specified in
    // params.type. The success callback is called
    // after the element is created
    return function (base_element, success, params) {
        var type = params.type;
        
        if (type === 'div') {
            div(base_element, success, params);
        } else if (type === 'grid') {
            grid(base_element, success);
        } else if (type === 'text') {
            text(base_element, success);
        } else if (type === 'image') {
            image(base_element, success);
        } else {
            throw 'Invalid type: ' + type;
        }
    };
});
