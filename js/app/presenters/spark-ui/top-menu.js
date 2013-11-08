define(['jquery', 'underscore', 'jaf/presenter', 'app/lib/history', 'app/lib/modal-dialog', 'json'], function ($, _, presenter, history, modal) {
    var canvas;
    
    // menu enables the user to easily choose a command, uppon chosing one
    // execute it
    function execute(command) {
        if(command === 'save') {
            save();
        } else if(command === 'undo') {
            history.undo();
        } else if(command === 'about') {
            about();
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