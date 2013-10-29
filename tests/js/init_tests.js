"use strict";
require.config({
    paths: {
        'QUnit': 'lib/qunit',
        'app': '../../js/app',
        'underscore': '../../js/lib/underscore',
        'jquery': '../../js/lib/jquery',
        'jquery-ui': '../../js/lib/jquery-ui',
        'hogan': '../../js/lib/hogan',
        'md5': '../../js/lib/md5',
    },
    shim: {
       'QUnit': {
           exports: 'QUnit',
           init: function() {
               QUnit.config.autoload = false;
               QUnit.config.autostart = false;
           }
       },

       underscore: {
           exports: '_'
       }
    }
});

// require the unit tests.
require(['QUnit', 'tests/eventer', 'tests/model', 'tests/elementFactory'], 
        function(QUnit, eventer, model, factory) {
        // run the tests.
        eventer.run();
        model.run();
        factory.run();

        // start QUnit.
        QUnit.load();
        QUnit.start();
    }
);
