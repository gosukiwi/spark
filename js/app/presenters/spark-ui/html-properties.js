define(['jquery', 'underscore', 'jaf/presenter', 'jaf/view'], function ($, _, presenter, view) {
    "use strict";
    
    var el = $('#properties-container');
        
    return presenter.extend({
        init: function (elem) {
            this.draw(elem);
        },
        
        draw: function (elem) {
            var formatted_properties = [],
                props = elem.properties.props(),
                html;

            _.each(_.keys(props), function (key) {
                formatted_properties.push({ name: key, value: props[key] });
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
            
            el.find('#btn-delete').click(function () {
                if(elem.type === 'canvas') {
                    throw 'Cannot delete canvas!';
                }
                elem.curr().remove();
            });
    
            $('#btn-parent').tooltip();
    
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