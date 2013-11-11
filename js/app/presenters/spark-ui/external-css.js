// external css presenter
define(['underscore', 'jquery', 'jaf/presenter', 'jaf/view', 'jaf/collection', 'jaf/model', 'jaf/globals'], function (_, $, presenter, view, collection, model, globals) {
    "use strict";
    
    var el = $('#external-css-container'),
        external_css = collection(),
        ext_css_presenter;
        
    function draw() {
        var container = el.find('#external-css-list-container'),
            list = view('spark-ui/external-css.mustache', { links: external_css.plain() }),
            css_imports = $('#canvas').contents().find('#canvas-external-css');
            
        container.empty().html(list);
        container.find('i').click(remove_link);
        
        css_imports.empty();
        external_css.each(function (item) {
            css_imports.append('@import url("' + item.get('src') + '");');
        });
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
    
    // save this collection to globals
    function save_global() {
        var obj = [];
        external_css.each(function (item) {
            obj.push(item.get('src'));
        });
        globals.external_css = obj;
    }
        
    ext_css_presenter = presenter.extend({
        init: function () {
            var btn = el.find('#btn-add-external-css');
            
            external_css.on('added removed', function () {
                draw();
                save_global();
            });
            
            el.find('#tb-external-css')
                .keydown(function (e) {
                    if(e.keyCode === 13) {
                        btn.trigger('click');
                    }
                });
            
            btn.click(add_link);
        },
        
        reloadGlobals: function () {
            external_css.empty();
            _.each(globals.external_css, function (item) {
                external_css.add(model.extend({ src: item }));
            });
            draw();
        }
    });
    
    return ext_css_presenter;
});