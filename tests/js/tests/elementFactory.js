define(['app/elementFactory'], function(factory) {
        "use strict";

        return { 
            run: function() {
                test('Element Factory', function() {
                    notEqual(factory, undefined, 'Loads correctly');
                });
            }
        };
    }
);
