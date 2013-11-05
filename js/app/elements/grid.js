/*
 * An element representing a div layer
 */
define(['underscore', 'jquery', 'jaf/view'], 
        function (_, $, view) {
    "use strict";

    return function (canvas, success) {
        var form;

        if(canvas.type !== 'canvas') {
            throw 'This element can only reside inside canvas';
        }

        canvas.add('container');

        form = view('forms/form-grid-create.mustache');
        form.dialog({
            modal: true,
            width: 400,
            buttons: {
                'Ok': function () {
                    var cols = $(this).find('#grid-input').val();
                    _.each(cols.split(' '), function (n) {
                        var column = parseInt(n, 10);
                        if(_.isNaN(columns)) {
                            alert('Invalid column definition!');
                        }

                        // set the container as selected element of the canvas
                        //grid_container.selected(true);
                        // add a div to the selected element of the canvas
                        if(canvas.curr().type === "div") {
                            canvas.curr().parent().selected(true);
                        }
                        canvas.add('div', column);
                    });

                    canvas.curr().parent().selected(true);

                    $(this).dialog('close');
                },

                'Cancel': function () {
                    $(this).dialog('close');
                }
            }
        });
    }
});
