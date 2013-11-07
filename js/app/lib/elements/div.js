/*
 * An element representing a div layer
 */
define(['underscore', 'jquery', 'jaf/view', 'jquery-ui'], 
        function (_, $, view) {
    "use strict";
    
    function extend (div) {
        div.type = 'div';
        div.el(view('elements/div.mustache'));
        div.isContainer = true;

        div.properties.on('changed', function (key, val) {
            // Divs have special properties which are
            // COLUMNS and OFFSET, these properties
            // are used with a css grid system and
            // are NOT html properties, so remove them
            // from the element if found

            if(key === 'offset') {
                div.el().removeAttr(key);
            } else if(key === 'columns') {
                div.el().removeAttr(key);

                if(div.el().attr('class') 
                    && div.el().attr('class').indexOf('grid_') !== -1) 
                {
                    _.chain(div.el().attr('class').split(' '))
                        .filter(function (c) {
                            return c.indexOf('grid_') !== -1;
                        })
                        .map(function (c) {
                            div.el().removeClass(c);
                            div.el().addClass('grid_' + val);
                        });
                } else {
                    div.el().addClass('grid_' + val);
                }
            }
        });

        return div;
    }

    return function (element, success, params) {
        var form,
            cols = params.cols,
            el;

        el = extend(element);

        // If we already have the column number
        if(_.isNumber(cols)) {
            el.properties.set({
                'columns': cols,
                'offset': 0
            });
            
            el.parent().columnsConsumed += cols;
            if(el.parent().columnsConsumed > 12) {
                el.parent().columnsConsumed = cols;
                el.el().before('<div class="clear"></div>');
            }
        }

        success(el);

        // add a para
        el.add('text');
        // select it again
        el.selected(true);
    };
});
