define(['jquery', 'underscore', 'jaf/presenter', 'codemirror'], function ($, _, presenter) {
    var editor;
    
    return presenter.extend({
        init: function () {
            var self = this;
            
            editor = CodeMirror.fromTextArea(document.getElementById('css-textarea'), {
                'mode': 'text/css',
                'lineNumbers': true,
                'theme': 'monokai',
                'lineWrapping': true
            });
            
            editor.on('change', function () {
                self.trigger('change', editor.getValue());
            });
        },
        
        val: function (value) {
            if(value === undefined) {
                return editor.getValue();
            } else {
                editor.setValue(value);
                // chainability
                return this;
            }
        }
    });
});