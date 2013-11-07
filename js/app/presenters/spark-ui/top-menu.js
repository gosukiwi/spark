define(['jquery', 'underscore', 'jaf/presenter'], function ($, _, presenter) {
    // menu enables the user to easily choose a command, uppon chosing one
    // execute it
    function execute(command) {
        if(command === 'save') {
            console.log('SAVE!');
        }
    }
    
    return presenter.extend({
        init: function () {
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