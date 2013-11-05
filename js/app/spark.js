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
        'app/elements/canvas', 
        'app/lib/history', 
        'jquery-ui'
    ], function (_, $, presenter_library, presenter_properties, presenter_css, canvasElement, history) {
    "use strict";

    var canvas,
    presenters = {
        'library': presenter_library,
        'properties': presenter_properties,
        'css': presenter_css
    };

    // Create a canvas and save it
    canvasElement(null, function (elem) {
        canvas = elem;
        canvas.properties.set('id', 'page-body');
        canvas.selected(true);
    });

    function getTree(root) {
        var output = [root.type];
        
        if(root.children()) {
            _.each(root.children(), function (child) {
                output.push(getTree(child));
            });
        }
        
        return output;
    }
    
    function save() {
        console.log(getTree(canvas));
    }
    
    // Presenters

    // library presenter
    presenters.library
        .on('image-added image-removed', function () {
            canvas.cssChanged(cssEditor.getValue());
        })
        .init();
    
    // html properties presenter
    canvas.onSelected(function (elem) {
        presenters.properties.draw(elem);
    });
    presenters.properties.init(canvas);
    
    // css editor presenter
    presenters.css
        .on('change', function (css) {
            canvas.css(css);
        })
        .init();
    
    return {
        // Binding and jquery ui initialization
        init: function () {
            // Bind the toolbox
            $('div#elements i')
                .click(function () {
                    var name = $(this).attr('id').split('-')[2];
                    canvas.curr().add(name);
                })
                .tooltip();

            // Create the menu boxes tabs
            // First of all, hide all the divs
            $('.menu-box > div').hide();

            $('.button-list i').tooltip();

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

            // Finally simulate a click on all first tabs
            $('.menu-box li:first-child').trigger('click');

            // Undo button
            $('#btn-undo').click(function () {
                history.undo();
            });
            
            // Save button
            $('#btn-save').click(function () {
                save();
            });
        }
    };
});
