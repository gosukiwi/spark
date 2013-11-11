/*
 * An element representing a div layer
 */
define(['underscore', 'jquery', 'jaf/view'], 
        function (_, $, view) {
    "use strict";
    
    return function (element, success, params) {
        params = params || {};
        
        element.type = 'div';
        element.el(view('elements/div.mustache'));
        element.isContainer = true;
        
        // if we have to automatically create children
        if(params.mode !== 'no-auto-child') {
            // add a para
            element.add('text');
            // select it again
            element.selected(true);
        }
        
        success(element);
    };
});
