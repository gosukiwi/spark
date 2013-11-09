define(['jquery', 'underscore', 'jaf/presenter', 'jaf/view', 'app/lib/modal-dialog', 'app/lib/tooltip'], function ($, _, presenter, view, modal, tooltip) {
    "use strict";
    
    var el = $('#properties-container');
        
    return presenter.extend({
        draw: function (elem) {
            var formatted_properties = [],
                props = elem.properties.props(),
                html;

            _.each(_.keys(props), function (key) {
                // let's not draw the automatically generated guid property
                if(key !== 'guid') {
                    formatted_properties.push({ name: key, value: props[key] });
                }
            });
    
            html = view('spark-ui/element-properties.mustache', {
                'type': elem.type,
                'parent': elem.parent() ? elem.parent().type : 'No parent',
                'properties': formatted_properties
            });
    
            el.empty()
              .html(html);
    
            /* HTML Bindings */
            el.find('#btn-save-changes').click(function () {
                var props = {};
                el.find('input[type=text]').each(function (i, el) {
                    props[$(el).attr('id').split('-')[1]] = $(el).val();
                });            
                elem.html(props);
            });
            
            el.find('input').keydown(function (e) {
                // If ENTER key was pressed
                if(e.keyCode === 13) {
                    el.find('#btn-save-changes').trigger('click');
                }
            });
            
            el.find('#btn-delete').click(function () {
                if(elem.type === 'canvas') {
                    throw 'Cannot delete canvas!';
                }
                
                modal
                    .title('Remove ' + elem.curr().type)
                    .content('Are you sure you want to delete this element?')
                    .buttons({
                        'Delete': function () {
                            elem.curr().remove();
                            modal.hide();
                        },
                        
                        'Cancel': function () {
                            modal.hide();
                        }
                    })
                    .show();
            });
    
            tooltip.bind($('#btn-parent'));
    
            $('div.prop-item').click(function () {
                $(this).find('input').focus();
            });
    
            $('#btn-parent').click(function () {
                if (elem.parent() !== null) {
                    elem.parent().selected(true);
                } 
            });
        }
    });
});