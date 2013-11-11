/*
 * An element representing a div layer
 */
define(['underscore', 'jquery', 'jaf/view'], 
        function (_, $, view) {
    "use strict";
    
    function extend (div) {
        div.type = 'div';
        div.el(view('elements/div.mustache'));
        div.isContainer = true;
        return div;
    }

    return function (element, success, params) {
        var form,
            el;

        el = extend(element);
        params = params || {};

        success(el);

        // if we have to automatically create children
        if(params.mode !== 'no-auto-child') {
            // add a para
            el.add('text');
        }
        
        // select it again
        el.selected(true);
    };
});
