/*
 * An element representing a div layer
 */
define(['underscore', 'jquery', 'app/elements/element', 'jaf/view', 'jquery-ui'], 
        function (_, $, element, view) {
    "use strict";

    function create (container) {
        var div = element(container);

        div.type = 'div';
        div.el(view('elements/div.mustache'));
        div.isContainer = true;

        div.properties.onChanged(function (key, val) {
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

    return function (canvas, container, success, cols) {
        var form,
            el;

        if(!container.isContainer) {
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

        el = create(container);

        // If we already have the column number
        if(_.isNumber(cols)) {
            el.properties.set({
                'columns': cols,
                'offset': 0
            });

            el.container.columnsConsumed += cols;
            if(el.container.columnsConsumed > 12) {
                el.container.columnsConsumed = cols;
                el.el().before('<div class="clear"></div>');
            }
        }


        success(el);

        // make sure the element is selected
        el.selected(true);
        // add a para
        canvas.add('text');
        // select it again
        el.selected(true);

    }
});
