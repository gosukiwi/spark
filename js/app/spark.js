/*
 * Front presenter
 * Work on the main UI and call other presenters
 */

define([
        'underscore', 
        'jquery', 
        'jaf/view', 
        'app/presenters/library', 
        'app/elements/canvas', 
        'app/lib/history', 
        'jquery-ui', 
        'codemirror'
    ], function (_, $, view, presenter_library, canvasElement, history) {
    "use strict";

    var propsContainer = $('#properties-container'),
        canvas,
        cssEditor,
        preloader,
        presenters = {
            library: presenter_library
        };

    preloader = {
        el: view('spark-ui/loading.mustache'),
        show: function () {
            this.el.dialog({
                modal: true
            });
        },

        hide: function () {
            this.el.dialog('close');
        }
    };

    preloader.show();

    // Create a canvas and save it
    canvasElement(undefined, function (elem) {
        canvas = elem;
        canvas.properties.set('id', 'page-body');
    });

    // Bind ace editor
    cssEditor = CodeMirror.fromTextArea(document.getElementById('css-textarea'), {
        'mode': 'text/css',
        'lineNumbers': true,
        'theme': 'monokai',
        'lineWrapping': true,
        'value': "/* Your custom CSS goes here */\n"
    });

    function onSaveElementProperties() {
        var props = {};

        // Get all settings
        propsContainer.find('input[type=text]').each(function (i, el) {
            props[$(el).attr('id').split('-')[1]] = $(el).val();
        });

        // Update element
        canvas.htmlChanged(props);
    }

    function onDeleteElement() {
        // Remove selected element from canvas
        canvas.remove();
    }

    /*
     * Draws the given object onto a menu container as a
     * list of key-values
     */
    function drawHtmlMenu(element) {
        var container = propsContainer,
            formatted_properties = [],
            props = element.properties.props(),
            html;

        _.each(_.keys(props), function (key) {
            formatted_properties.push({ name: key, value: props[key] });
        });

        html = view('spark-ui/element-properties.mustache', {
            'type': element.type,
            'parent': element.container ? element.container.type : 'No parent',
            'properties': formatted_properties
        });

        container.empty();
        container.append(html);

        /* HTML Bindings */
        document.getElementById('btn-delete').onclick = onDeleteElement;
        document.getElementById('btn-save-changes').onclick =
            onSaveElementProperties;

        $('#btn-parent').tooltip();

        $('div.prop-item').click(function () {
            $(this).find('input').focus();
        });

        $('#btn-parent').click(function () {
            if (element.container !== undefined) {
                if (element.container.type === 'canvas') {
                    element.selected(false);
                    element.container.selected(true);
                    drawHtmlMenu(canvas);
                } else {
                    element.container.selected(true);
                }
            } 
        });
    }

    // When nothing is selected on the canvas, draw
    // the canvas html and css props
    canvas.onNothingSelected(function () {
        drawHtmlMenu(canvas);
    });

    // When something is selected, draw that element
    // html and css props
    canvas.onSelectionChanged(function (elem) {
        drawHtmlMenu(elem);
    });

    // Draw the initial state of the menu, as nothing
    // is selected yet, just draw the canvas
    drawHtmlMenu(canvas);

    return {
        // Binding and jquery ui initialization
        init: function () {
            // Bind the toolbox
            $('div#elements i')
                .click(function () {
                    var name = $(this).attr('id').split('-')[2];
                    canvas.add(name);
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

            // Listen when updating CSS
            cssEditor.on('change', function () {
                canvas.cssChanged(cssEditor.getValue());
            });

            // Undo button
            $('#btn-undo').click(function () {
                history.undo();
            });

            // Library
            presenters.library
                .on('image-added image-removed', function () {
                    canvas.cssChanged(cssEditor.getValue());
                })
                .init();

            preloader.hide();
        }
    };
});
