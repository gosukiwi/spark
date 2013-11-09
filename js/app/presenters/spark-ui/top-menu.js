define(['jquery', 'underscore', 'jaf/presenter', 'jaf/view', 'app/lib/history', 'app/lib/modal-dialog', 'json', 'base64'], function ($, _, presenter, view, history, modal) {
    var canvas,
        menu_presenter;
    
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
            var output = [{ type: root.type, props: root.properties.props() }];
            
            if(root.children()) {
                _.each(root.children(), function (child) {
                    output.push(get_tree(child));
                });
            }
            
            return output;
        }
        
        saveobj = {
            'elements': get_tree(canvas),
            'css': canvas.css()
        };
        savefile = Base64.encode(JSON.stringify(saveobj));
        
        modal
            .title('Save')
            .content(view('forms/save.mustache', {
                'savefile_link': 'data:text/plain;charset=utf-8,spark-savefile,' + savefile
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
            
            text = text.split(',')[1];
            load_savefile(text);
        }
        
        // given a base64 encoded json string, load it to spark
        function load_savefile(base64_encoded_json) {
            var saveobj = $.parseJSON(Base64.decode(base64_encoded_json));
            canvas.css(saveobj.css);
            visit(saveobj.elements);
            
            // once all the elements have been visited (created)
            menu_presenter.trigger('savefile-loaded', {
                css: canvas.css()
            });
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
        }
    });
    
    // finally return the presenter
    return menu_presenter;
});