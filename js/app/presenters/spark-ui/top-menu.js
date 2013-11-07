define(['jquery', 'underscore', 'jaf/presenter', 'app/lib/history', 'json'], function ($, _, presenter, history) {
    var canvas;
    
    // menu enables the user to easily choose a command, uppon chosing one
    // execute it
    function execute(command) {
        if(command === 'save') {
            save();
        } else if(command === 'undo') {
            history.undo();
        }
    }
    
    function save() {
        function getTree(root) {
            var output = [{ type: root.type, props: root.properties.props() }];
            
            if(root.children()) {
                _.each(root.children(), function (child) {
                    output.push(getTree(child));
                });
            }
            
            return output;
        }
        
        console.log(JSON.stringify(getTree(canvas)));
    }
    
    return presenter.extend({
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
});