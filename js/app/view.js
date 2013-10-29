define(['jquery', 'hogan'], function ($) {
    var cache = {},
        baseUrl = 'js/app/views/';

    return function (src, context) {
        var res,
            path = baseUrl + src;
        
        if(!cache[src]) {
            jQuery.ajaxSetup({async:false});
            $.get(path, function (data) {
                res = data;
            });
            jQuery.ajaxSetup({async:true});
            cache[src] = Hogan.compile(res);
        }

        return $(cache[src].render(context));
    };
});
