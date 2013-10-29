define(['app/model'], function(model) {
        "use strict";

        return { 
            run: function() {
                test('Model', function() {
                    var m = model({ name: 'mike' });
                    notEqual(m, undefined, 'Model loaded');

                    m.set('age', 12);
                    equal(m.get('age'), 12, 'Setter and getter works');

                    var changedAttr,
                        changedVal;
                    m.onChanged(function (attr, val) {
                        changedAttr = attr;
                        changedVal = val;
                    });

                    m.set('age', 18);
                    equal(changedAttr, 'age', 'Callback argument 1 works');
                    equal(changedVal, 18, 'Callback argument 2 works');
                });
            }
        };
    }
);
