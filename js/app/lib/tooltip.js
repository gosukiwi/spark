define(['underscore', 'jquery'], function (_, $) {
    "use strict";
    
    var tooltip = $('<div id="tooltip"></div>');
    tooltip.hide();
    
    $('body').append(tooltip);
    
    return {
        bind: function (el, evt) {
            var pos,
                text;
                
            evt = evt || 'mouseenter';
            el = $(el);
            pos = el.position();
            text = el.attr('title');
            
            el.removeAttr('title');
            
            el.on(evt, function () {
                tooltip
                    .css({
                        'left': pos.left,
                        'top': pos.top - tooltip.height() - 5
                    })
                    .text(text)
                    .fadeIn();
            });
            
            el.mouseleave(function () {
                tooltip
                    .hide()
                    .attr('title', text);
            });
        }
    };
});