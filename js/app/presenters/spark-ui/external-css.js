// external css presenter
define(['underscore', 'jquery', 'jaf/presenter', 'jaf/view', 'jaf/collection', 'jaf/model'], function (_, $, presenter, view, collection, model) {
    "use strict";
    
    var el = $('#external-css-container'),
        external_css = collection(),
        ext_css_presenter;
        
    function draw() {
        var container = el.find('#external-css-list-container'),
            list = view('spark-ui/external-css.mustache', { links: external_css.plain() });
            
        container.empty().html(list);
        container.find('i').click(remove_link);
    }
    
    function add_link() {
        var input = el.find('#tb-external-css');
        if(!input.val()) {
            return;
        }
        
        external_css.add(model.extend({ src: input.val() }));
        input.val('');
    }
    
    function remove_link() {
        var guid = $(this).attr('guid');
        external_css.remove(guid);
    }
        
    ext_css_presenter = presenter.extend({
        init: function () {
            var btn = el.find('#btn-add-external-css');
            
            external_css.on('added removed', function () {
                draw();
            });
            
            el.find('#tb-external-css')
                .keydown(function (e) {
                    if(e.keyCode === 13) {
                        btn.trigger('click');
                    }
                });
            
            btn.click(add_link);
        }
    });
    
    return ext_css_presenter;
});