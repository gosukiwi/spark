define(['jquery', 'underscore', 'jaf/presenter', 'codemirror'], function ($, _, presenter) {
    var editor;
    
    return presenter.extend({
        init: function () {
            var self = this;
            
            editor = CodeMirror.fromTextArea(document.getElementById('css-textarea'), {
                'mode': 'text/css',
                'lineNumbers': true,
                'theme': 'monokai',
                'lineWrapping': true,
                'value': "/* Your custom CSS goes here */\n"
            });
            
            editor.on('change', function () {
                self.trigger('change', editor.getValue());
            });
        },
        
        val: function () {
            return editor.getValue();
        }
    });
});