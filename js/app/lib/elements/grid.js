/*
 * An element representing a div layer
 */
define(['underscore', 'jquery', 'jaf/view', 'app/lib/modal-dialog', 'app/lib/elements/container'], 
        function (_, $, view, modal, container_generator) {
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
        modal
            .title('Create grid')
            .content(form)
            .buttons({
                'Create': function () {
                    var cols = form.find('#grid-input').val();
                    
                    _.each(cols.split(' '), function (n) {
                        var column = parseInt(n, 10);
                        
                        if(_.isNaN(column)) {
                            throw 'Invalid column definition, must be spaced numbers.';
                        }
                        
                        container.add('div', { cols: column });
                    });
                        
                    container.selected(true);
                    
                    modal.hide();
                },
                
                'Cancel': function () {
                    modal.hide();
                }
            })
            .show();
    };
});
