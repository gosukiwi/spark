/*
 * An element representing a div layer
 */
define(['underscore', 'jquery', 'jaf/view', 'app/lib/modal-dialog', 'app/lib/elements/div'], 
        function (_, $, view, modal, div_generator) {
    "use strict";
    
    var form = view('forms/form-grid-create.mustache');
    
    function create (element, success, cols) {
        var container;
        
        div_generator(element, function (elem) {
            container = elem;
            container.properties.set('class', 'container_12');
        }, { mode: 'no-auto-child' });
        
        _.each(cols.split(' '), function (n) {
            var column = parseInt(n, 10),
                div;
            
            if(_.isNaN(column)) {
                throw 'Invalid column definition, must be spaced numbers.';
            }
            
            div = container.add('div', { cols: column });
            div.properties.set('class', 'grid_' + column);
        });
            
        container.selected(true);
        success(container);
        modal.hide();
    }

    // given a vanilla element and a success callback
    return function (element, success) {
        if(element.parent().type !== 'canvas') {
            element.remove();
            throw 'This element can only reside inside canvas';
        }
        
        modal
            .title('Create grid')
            .content(form)
            .buttons({
                'Create': function () {
                    var columns = form.find('#grid-input').val();
                    return create(element, success, columns);
                },
                'Cancel': function () {
                    modal.hide();
                }
            })
            .show();
    };
});
