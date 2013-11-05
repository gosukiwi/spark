define(['jquery', 'underscore', 'jaf/presenter', 'jaf/view'], function ($, _, presenter, view) {
    return presenter.extend({
        init: function () {
            var self = this,
                cssEditor = CodeMirror.fromTextArea(document.getElementById('css-textarea'), {
                'mode': 'text/css',
                'lineNumbers': true,
                'theme': 'monokai',
                'lineWrapping': true,
                'value': "/* Your custom CSS goes here */\n"
            });
            
            cssEditor.on('change', function () {
                self.trigger('change', cssEditor.getValue());
            });
        }
    });
});