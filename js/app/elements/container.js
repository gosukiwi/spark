/*
 * An element representing an container
 */
define(['app/elements/element', 'app/view'], function (element, view) {
    "use strict";

    return function (container, success) {
        var container = element(container);

        container.type = 'container';
        container.el(view('elements/container.mustache'));
        container.isContainer = true;
        container.columnsConsumed = 0;

        success(container);
    }
});
