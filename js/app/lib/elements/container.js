/*
 * An element representing an container
 */
define(['jaf/view'], function (view) {
    "use strict";

    return function (container, success) {
        container.type = 'container';
        container.el(view('elements/container.mustache'));
        container.isContainer = true;
        container.columnsConsumed = 0;

        success(container);
    };
});
