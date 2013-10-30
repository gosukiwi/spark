/*
 * Application entry point
 * Works with the main UI
 */

define(['underscore', 'jquery', 'app/elements/canvas', 'app/view', 'app/history', 'jquery-ui'], function (_, $, canvasElement, view, history) {
    "use strict";

    var propsContainer = $('#properties-container'),
        canvas;

    // Create a canvas and save it
    canvasElement(undefined, function (elem) {
        canvas = elem;
        canvas.properties.set('id', 'page-body');
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

    function drawCssMenu(element) {
        if(element.isContainer) {
            // If it's a container draw the global css
            $('#css-textarea').val(
                $('#canvas').contents().find('#canvas-css').text());
        } else {
            // Else draw the custom element css
            $('#css-textarea').val(element.getCSSText());
        }
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
                    drawCssMenu(canvas);
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
        drawCssMenu(canvas);
    });

    // When something is selected, draw that element
    // html and css props
    canvas.onSelectionChanged(function (elem) {
        drawHtmlMenu(elem);
        drawCssMenu(elem);
    });

    // Draw the initial state of the menu, as nothing
    // is selected yet, just draw the canvas
    drawHtmlMenu(canvas);
    drawCssMenu(canvas);

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
            $('div#css-container textarea').keyup(function () {
                canvas.cssChanged($(this).val());
            });

            // Undo button
            $('#btn-undo').click(function () {
                history.undo();
            });
        }
    };
});
