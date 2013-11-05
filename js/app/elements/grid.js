/*
 * An element representing a div layer
 */
define(['underscore', 'jquery', 'jaf/view'], 
        function (_, $, view) {
    "use strict";

    return function (canvas, success) {
        var form;

        if(canvas.type !== 'canvas') {
            throw 'This element can only reside inside canvas';
        }

        form = view('forms/form-grid-create.mustache');
        form.dialog({
            modal: true,
            width: 400,
            buttons: {
                'Ok': function () {
                    var cols = $(this).find('#grid-input').val(),
                        container;
                        
                    canvas.add('container');
                    container = canvas.curr();
                    
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
