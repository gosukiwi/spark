/*
 * The library allows the user to select files from her computer and
 * use them in the canvas and css
 */
define(['jquery', 'underscore', 'jaf/globals', 'jaf/presenter', 'jaf/view'], function ($, _, globals, presenter, view) {
    var el = $('#menu-library'),
        filesContainer = el.find('#library-items-container');

    globals.library = {};

    return presenter.extend({
        init: function () {
            var self = this;

            function removeImage() {
                var name = $(this).attr('file-name');
                delete globals.library[name];
                self.trigger('image-removed');
                drawFiles();
            }

            function drawFiles() {
                var formatted_files,
                    html;

                formatted_files = _.map(_.keys(globals.library), 
                    function (name) {
                    return { 
                        name: name, 
                        file: globals.library[name].target.result 
                    };
                });

                html = view('spark-ui/library.mustache', {
                    files: formatted_files
                });

                // Remove all html and bindings
                filesContainer.empty();
                // Create html
                filesContainer.html(html);
                // Create bindings
                filesContainer.find('i').click(removeImage);
            }

            el.find('#library-file-select').change(function (e) {
                _.each(e.target.files, function (file) {
                    var reader = new FileReader(),
                        fileName = file.name;
                    reader.readAsDataURL(file);
                    reader.onload = function (f) {
                        globals.library[fileName] = f;
                        drawFiles();
                        self.trigger('image-added');
                    };
                });
            });

            el.find('#btn-add-file').click(function () {
                el.find('#library-file-select').click();
            });
        }
    });
});
