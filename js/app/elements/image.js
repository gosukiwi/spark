/*
 * An element representing an image
 */
define(['app/elements/element', 'jaf/view', 'jaf/globals'], function (element, view, globals) {
    "use strict";

    return function (image, success) {
        image.el(view('elements/image.mustache'));
        image.type = 'image';
        image.isContainer = false;
        image.isResizable = true;
        image.properties.set({
            'width': 100,
            'height': 100,
            'src': 'http://placehold.it/100x100'
        });

        image.properties.on('changed', function (attr, val) {
            var match,
                imgData;

            if(attr === 'src') {
                match = val.match(/library\('(.*?)'\)/);
                if(match) {
                    imgData = globals.library[match[1]].target.result;
                    image.properties.set(attr, imgData);
                    image.properties.set('width', '');
                    image.properties.set('height', '');
                }
            }
        });

        success(image);
    };
});
