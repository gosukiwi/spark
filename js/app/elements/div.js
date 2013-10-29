/*
 * An element representing a div layer
 */
define(['underscore', 'jquery', 'app/element', 'app/view', 'jquery-ui'], 
        function (_, $, element, view) {
    "use strict";

    function create (container) {
        var div = element(container);

        div.el(view('elements/div.mustache', { cols: 12 }));
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

                // Filter the grid_ class and update it
                _.chain(div.el().attr('class').split(' '))
                    .filter(function (c) {
                        return c.indexOf('grid_') !== -1;
                    })
                    .map(function (c) {
                        div.el().removeClass(c);
                        div.el().addClass('grid_' + val);
                    });
            }
        });

        div.properties.set({
            'columns': 12,
            'offset': 0
        });

        return div;
    }

    return function (container, success) {
        var form;

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

        form = view('forms/form-div-create.mustache');
        form.find('#slide-cols').slider({
            min: 1,
            max: 12,
            value: 12,
            title: 'Create DIV',
            change: function (e, ui) {
                form.find('#lbl-cols')
                    .attr('cols', ui.value)
                    .text(ui.value + ' columns');
            }
        });

        form.dialog({
            modal: true,
            buttons: {
                'Ok': function () {
                    var el = create(container),
                        cols;
        
                    cols = parseInt(form.find('#lbl-cols').attr('cols'), 10);
                    
                    el.properties.set('columns', cols);
                    success(el);

                    el.container.columnsConsumed += cols;
                    if(el.container.columnsConsumed > 12) {
                        el.container.columnsConsumed = cols;
                        el.el().before('<div class="clear"></div>');
                    }

                    $(this).dialog('close');
                },

                'Cancel': function () {
                    $(this).dialog('close');
                }
            }
        });
    }
});
