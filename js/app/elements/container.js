/*
 * An element representing an container
 */
define(['app/elements/element', 'jaf/view'], function (element, view) {
    "use strict";

    return function (parent, success) {
        var container = element(parent);

        container.type = 'container';
        container.el(view('elements/container.mustache'));
        container.isContainer = true;
        container.columnsConsumed = 0;

        success(container);
    }
});
