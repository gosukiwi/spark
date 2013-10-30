/*
 * Application entry point
 * Works with the main UI
 */

define(['underscore', 'jquery', 'app/elements/canvas', 'app/view', 'app/history', 'jquery-ui'], function (_, $, canvasElement, view, history) {
    "use strict";

    var propsContainer = $('#properties-container'),
        canvas;

    canvasElement(undefined, function (elem) {
        canvas = elem;
        canvas.properties.set('id', 'page-body');
    });

    function evtUpdateElementProps() {
        var props = {};

        // Get all settings
        propsContainer.find('input[type=text]').each(function (i, el) {
            props[$(el).attr('id').split('-')[1]] = $(el).val();
        });

        // Update element
        canvas.htmlChanged(props);
    }

    function evtDeleteElement() {
        canvas.removeCurrent();
        propsContainer.empty();
    }

    function drawCssMenu(element) {
        var text = '',
            key,
            props = element.css.props();

        for (key in props) {
            if (props.hasOwnProperty(key)) {
                text += key + ': ' + props[key] + ";\n";
            }
        }

        $('#css-textarea').val(text);
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
        document.getElementById('btn-delete').onclick = evtDeleteElement;
        document.getElementById('btn-save-changes').onclick =
            evtUpdateElementProps;

        $('#btn-parent').tooltip();

        $('div.prop-item').click(function () {
            $(this).find('input').focus();
        });

        $('#btn-parent').click(function () {
            if (element.container === undefined) {
                view('alert.mustache', {
                    title: 'Oops!',
                    text: 'The canvas element has no parent.'
                }).dialog({
                    modal: true,
                    buttons: {
                        'Ok': function () {
                            $(this).dialog('close');
                        }
                    }
                });
            } else if (element.container.type === 'canvas') {
                element.selected(false);
                element.container.selected(true);
                drawHtmlMenu(element.container);
                drawCssMenu(element.container);
            } else {
                element.container.selected(true);
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
