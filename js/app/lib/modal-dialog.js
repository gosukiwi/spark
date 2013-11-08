define(['underscore', 'jquery'], function (_, $) {
    var container = $('<div id="modal-dialog-container"></div>');
        dialog = $('<div id="modal-dialog"><div id="modal-dialog-title"></div><div id="modal-dialog-content"></div><div id="modal-dialog-footer"></div></div>');
        
    container
        .append(dialog)
        .hide();
        
    $('body').append(container);
    
    return {
        'show': function (speed) {
            speed = speed || 300;
            container.show();
            dialog.css('margin-top', '-' + dialog.height() + 'px').animate({
                'margin-top': '200px'
            }, speed);
                
            // chainability
            return this;
        },
        
        'hide': function () {
            container.hide();
            // chainability
            return this;
        },
        
        'title': function (title) {
            dialog.find('#modal-dialog-title').text(title);
            // chainability
            return this;
        },
        
        'content': function (content) {
            dialog.find('#modal-dialog-content').html(content);
            // chainability
            return this;
        },
        
        'footer': function (footer) {
            dialog.find('#modal-dialog-footer').text(footer);
            // chainability
            return this;
        },
        
        'buttons': function (obj) {
            var footer = dialog.find('#modal-dialog-footer'),
                btn;
                
            footer.empty();
            _.each(_.keys(obj), function (name) {
                btn = $('<span class="button">' + name + '</span>');
                btn.click(obj[name]);
                footer.append(btn);
            });
            
            // chainability
            return this;
        }
    };
});