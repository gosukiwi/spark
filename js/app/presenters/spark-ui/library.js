/*
 * The library allows the user to select files from her computer and
 * use them in the canvas and css
 */
define(['jquery', 'underscore', 'jaf/globals', 'jaf/presenter', 'jaf/view'], function ($, _, globals, presenter, view) {
    var el = $('#menu-library'),
        filesContainer = el.find('#library-items-container'),
        library_presenter;
        
    function draw_files() {
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
        filesContainer.find('i').click(remove_image);
    }
    
    // callback when a file is beeing deletted
    function remove_image() {
        var name = $(this).attr('file-name');
        delete globals.library[name];
        library_presenter.trigger('image-removed');
        draw_files();
    }

    globals.library = {};

    // define the presenter we'll return
    library_presenter = presenter.extend({
        init: function () {
            el.find('#library-file-select').change(function (e) {
                _.each(e.target.files, function (file) {
                    var reader = new FileReader(),
                        fileName = file.name;
                    reader.readAsDataURL(file);
                    reader.onload = function (f) {
                        globals.library[fileName] = f;
                        draw_files();
                        library_presenter.trigger('image-added');
                    };
                });
            });

            el.find('#btn-add-file').click(function () {
                el.find('#library-file-select').click();
            });
        },
        
        redraw: function () {
            draw_files();
        }
    });
    
    // finally return the presenter
    return library_presenter;
});
