/*
 * Front presenter
 * A front presenter instantiates all other presenters and
 * binds them together listening to their events
 */

define([
        'underscore', 
        'jquery', 
        'app/presenters/spark-ui/library', 
        'app/presenters/spark-ui/html-properties', 
        'app/presenters/spark-ui/css-editor', 
        'app/presenters/spark-ui/top-menu', 
        'app/presenters/spark-ui/external-css', 
        'app/lib/elements/canvas', 
        'app/lib/modal-dialog', 
        'app/lib/tooltip'
    ], function (_, $, presenter_library, presenter_properties, presenter_css, presenter_top_menu, presenter_external_css, canvasElement, modal, tooltip) {
    "use strict";

    var canvas,
    presenters = {
        'library': presenter_library,
        'properties': presenter_properties,
        'css': presenter_css,
        'menu': presenter_top_menu,
        'external-css': presenter_external_css
    };

    // Create a canvas and save it
    canvasElement(null, function (elem) {
        canvas = elem;
        canvas.properties.set('id', 'page-body');
        canvas.selected(true);
    });

    /* Presenters */

    // library presenter
    presenters.library
        .on('image-added image-removed', function () {
            canvas.css(presenters.css.val());
        })
        .init();
    
    // html properties presenter
    canvas.on('selected', function (elem) {
        presenters.properties.draw(elem);
    });
    // on start draw the canvas props
    presenters.properties.draw(canvas);
    
    // css editor presenter
    presenters.css
        .on('change', function (css) {
            canvas.css(css);
        })
        .init();
        
    // top menu presenter
    presenters.menu
        .on('savefile-loaded', function (params) {
            presenters.css.val(params.css);
            presenters.library.redraw();
        })
        .on('generate-savefile', function (savefile) {
            presenters.menu.css(presenters.css.val());
        })
        .init(canvas);
    
    // extermal css
    presenters['external-css'].init();
    
    return {
        // Binding and jquery ui initialization
        init: function () {
            // Bind the toolbox
            $('div#elements i')
                .click(function () {
                    var name = $(this).attr('id').split('-')[2];
                    //try {
                        canvas.curr().add(name);
                    /*} catch (e) {
                        modal
                            .title('Oops!')
                            .content(e)
                            .buttons({
                                'Ok': function () {
                                    modal.hide();
                                }
                            })
                            .show();
                    }*/
                })
                .each(function (i, el) {
                    tooltip.bind(el);
                });

            // Menu boxes
            // first of all, hide all the divs
            $('.menu-box > div').hide();

            // When clicking a tab, change the active one
            $('.menu-box li').click(function () {
                var id,
                    container = $(this).parent().parent();

                container.find('.active').removeClass('active');
                $(this).addClass('active');
                id = $(this).attr('id');
                container.find('>div').hide();
                $('div[tab-id=' + id + ']').show();
            });

            // finally simulate a click on all first tabs
            $('.menu-box li:first-child').trigger('click');
        }
    };
});
