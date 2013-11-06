/*
 * An element representing a div layer
 */
define(['underscore', 'jquery', 'jaf/view', 'app/elements/container'], 
        function (_, $, view, container_generator) {
    "use strict";

    return function (element, success) {
        var form,
            container;
            
        if(element.parent().type !== 'canvas') {
            element.remove();
            throw 'This element can only reside inside canvas';
        }
        
        container_generator(element, function (elem) {
            success(elem);
            container = elem;
        });

        form = view('forms/form-grid-create.mustache');
        form.dialog({
            modal: true,
            width: 400,
            buttons: {
                'Ok': function () {
                    var cols = $(this).find('#grid-input').val();
                    
                    _.each(cols.split(' '), function (n) {
                        var column = parseInt(n, 10);
                        
                        if(_.isNaN(column)) {
                            throw 'Invalid column definition, must be spaced numbers.';
                        }
                        
                        container.add('div', column);
                    });
                        
                    container.selected(true);
                    
                    $(this).dialog('close');
                },

                'Cancel': function () {
                    $(this).dialog('close');
                }
            }
        });
    }
});
