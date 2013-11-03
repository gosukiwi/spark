/*
 * The library allows the user to select files from her computer and
 * use them in the canvas and css
 */
define(['jquery', 'underscore', 'jaf/globals', 'jaf/presenter'], function ($, _, globals, presenter) {
    var el = $('#menu-library'),
        filesContainer = el.find('#library-items-container');

    globals.library = {};

    return presenter.extend({
        init: function () {
            var self = this;

            function drawFiles() {
                filesContainer.empty();
                _.each(_.keys(globals.library), function (name) {
                    var file = globals.library[name];

                    filesContainer.append('<img width="50" height="50" src="' + file.target.result + '" />');
                });
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
        }
    });
});
