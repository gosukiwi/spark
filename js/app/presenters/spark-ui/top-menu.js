// presenter in charge of the top menu 
define([
    'jquery', 
    'underscore', 
    'jaf/presenter', 
    'jaf/view', 
    'jaf/globals', 
    'app/lib/history', 
    'app/lib/modal-dialog', 
    'json', 
    'base64'
    ], function ($, _, presenter, view, globals, history, modal) {
    "use strict";
    
    var canvas,
        menu_presenter,
        css;
    
    // menu enables the user to easily choose a command, uppon chosing one
    // execute it
    function execute(command) {
        if(command === 'save') {
            save();
        } else if(command === 'undo') {
            history.undo();
        } else if(command === 'about') {
            about();
        } else if(command === 'load') {
            load();
        }
    }
    
    // save command
    function save() {
        var savefile,
            saveobj;
        
        function get_tree(root) {
            var output = [{ type: root.type, props: root.properties.plain() }];
            
            if(root.children()) {
                _.each(root.children(), function (child) {
                    output.push(get_tree(child));
                });
            }
            
            return output;
        }
        
        // trigger the generate-savefile event
        // spark.js listens to this event to copy the css editor
        // value into the css variable of this file
        menu_presenter.trigger('generate-savefile');
        
        // generate the save object
        saveobj = {
            'elements': get_tree(canvas),
            'css': css,
            'external_css': globals.external_css,
            'library': globals.library
        };
        
        // the savefile is a lwz compressed, base64 string of the save object as a JSON string
        savefile = Base64.encode(JSON.stringify(saveobj));
        
        // show a modal dialog with a link to the savefile
        modal
            .title('Save')
            .content(view('forms/save.mustache', {
                'savefile_link': 'data:application/octet-stream;charset=utf-8,spark-savefile,' + savefile
            }))
            .buttons({
                'Close': function () {
                    modal.hide();
                }
            })
            .show();
    }
    
    // load command
    function load () {
        var load_view = view('forms/load.mustache');
        
        function load_file(e) {
            var file = e.target.files[0],
                reader = new FileReader();
                
            reader.onload = read_file;
            reader.readAsText(file);
        }
        
        function read_file(file) {
            var text = file.target.result;
            if(text.indexOf('spark-savefile,') === -1) {
                throw 'Invalid savefile';
            }
            
            text = text.substring(15);
            load_savefile(text);
        }
        
        // given a base64 encoded json string, load it to spark
        function load_savefile(savefile) {
            // get a plain old javascript object from the savefile
            var saveobj = $.parseJSON(Base64.decode(savefile));
            // set the css
            canvas.css(saveobj.css);
            // set the library
            globals.library = saveobj.library || {};
            // set external css
            globals.external_css = saveobj.external_css || [];
            // create elements
            visit(saveobj.elements);
            
            // once all the elements have been visited (created)
            menu_presenter.trigger('savefile-loaded', {
                css: canvas.css()
            });
            
            // as loading is now done, hide the modal
            modal.hide();
        }
        
        // visit each element and create recursively
        function visit(elements, accu) {
            var container = elements[0],
                children = _.rest(elements),
                parent;
                
            if(accu === undefined) {
                parent = canvas;
            } else {
                parent = accu.add(container.type, { mode: 'no-auto-child' });
            }
            
            _.each(children, function (child) {
                visit(child, parent);
            });
            
            parent.properties.set(container.props);
        }
        
        function display_load_dialog() {
            modal
                .title('Load')
                .content(load_view)
                .buttons({
                    'Close': function () {
                        modal.hide();
                    }
                })
                .on('#load-file-picker', 'change', load_file)
                .show();
        }
        
        // check if there are elements already
        if(canvas.children().length !== 0) {
            modal
                .title('Canvas is not empty')
                .content('Are you sure you want to load a savefile and clear this canvas?')
                .buttons({
                    'Ok': function () {
                        modal.hide();
                        canvas.clear();
                        canvas.css('');
                        globals.library = {};
                        globals.external_css = {};
                        display_load_dialog();
                    },
                    'Cancel': function () {
                        modal.hide();
                    }
                })
                .show();
        } else {
            display_load_dialog();
        }
    }
    
    // about command
    function about() {
        modal
            .title('About')
            .content('Spark is an app to help you easily modelate CSS and HTML')
            .buttons({
                'Ok': function () {
                    modal.hide();
                }
            })
            .show();
    }
    
    // top-menu presenter
    menu_presenter = presenter.extend({
        // the init function takes the canvas as parameter
        // it's later used for saving
        init: function (c) {
            canvas = c;
            
            $('#top-menu > ul li').click(function (e) {
                var id = $(this).attr('id');
                
                e.stopPropagation();
                $('#top-menu li.selected').removeClass('selected');
                $(this).addClass('selected');
                $('#top-submenu ul').hide();
                $('ul[parent=' + id + ']').slideDown('fast');
            });
            
            $('#top-submenu li').click(function (e) {
                var command;
                
                e.stopPropagation();
                $(this).parent().hide();
                $('#top-menu li.selected').removeClass('selected');
                
                command = $(this).text().toLowerCase();
                execute(command);
            });
            
            $('html').click(function () {
                $('#top-submenu ul').hide();
                $('#top-menu li.selected').removeClass('selected');
            });
        },
        
        css: function (code) {
            css = code;
        }
    });
    
    // finally return the presenter
    return menu_presenter;
});