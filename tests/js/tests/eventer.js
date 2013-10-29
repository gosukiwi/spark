define(['app/eventer'], function(eventer) {
        "use strict";

        return { 
            run: function() {
                test('Eventer', function() {
                    notEqual(eventer, undefined, 'Loaded');

                    var listener = eventer.listener();
                    notEqual(listener, undefined, 'Listener creates');

                    var res = 0;
                    listener.listen('someEvent', function (n) {
                        res = n;
                    });

                    listener.trigger('someEvent', 1);
                    equal(res, 1, 'Listener works for one param');

                    listener.listen('otherEvent', function (a, b, c) {
                        res = a + b + c;
                    });

                    listener.trigger('otherEvent', 2, 3, 4);
                    equal(res, 9, 'Listener works for three params');
                });
            }
        };
    }
);
