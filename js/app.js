requirejs.config({
    //By default load any module IDs from js/lib
    baseUrl: 'js/vendor',
    //except, if the module ID starts with "app",
    //load it from the js/app directory. paths
    //config is relative to the baseUrl, and
    //never includes a ".js" extension since
    //the paths config could be for a directory.
    paths: {
        app: '../app',
        jaf: '../jaf'
    },
    
    shim: {
        underscore: {
            exports: '_'
        }
    }
});

// Start the main app logic.
requirejs(['jquery', 'app/spark', 'jaf/view'], function ($, spark, view) {
    var preloader;

    // Compatibility check
    if(!(window.File && window.FileReader && window.FileList && window.Blob)) {
        alert('Your browser does not support the latest HTML file API');
        // TODO: Redirect
        return;
    }

    preloader = {
        el: view('spark-ui/loading.mustache'),
        show: function () {
            this.el.dialog({
                modal: true
            });
        },

        hide: function () {
            this.el.dialog('close');
        }
    };

    preloader.show();

    // Init app
    spark.init();

    window.onload = function () { preloader.hide(); };
});
