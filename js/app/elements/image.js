/*
 * An element representing an image
 */
define(['app/element', 'app/view'], function (element, view) {
    "use strict";

    return function (container, success) {
        var image;

        if(container === undefined) {
            view('alert.mustache', {
                title: 'Oops!',
                text: 'This element must be inside a container'
            }).dialog({
                modal: true,
                buttons: {
                    'Ok': function () {
                        $(this).dialog('close');
                    }
                }
            });
            return;
        }

        image = element(container);

        image.el(view('elements/image.mustache'));
        image.type = 'image';
        image.isContainer = false;
        image.properties.set({
            'width': 100,
            'height': 100
        });

        success(image);
    }
});
