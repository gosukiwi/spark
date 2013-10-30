/*
 * An element representing an image
 */
define(['app/element', 'app/view'], function (element, view) {
    "use strict";

    return function (container, success) {
        var image;

        image = element(container);

        image.el(view('elements/image.mustache'));
        image.type = 'image';
        image.isContainer = false;
        image.isResizable = true;
        image.properties.set({
            'width': 100,
            'height': 100,
            'src': 'http://placehold.it/100x100'
        });

        success(image);
    }
});
