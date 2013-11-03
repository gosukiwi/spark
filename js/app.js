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
requirejs(['jquery', 'app/spark'], function ($, spark) {
    // Compatibility check
    if(!(window.File && window.FileReader && window.FileList && window.Blob)) {
        alert('Your browser does not support the latest HTML file API');
        // TODO: Redirect
        return;
    }

    // Init app
    spark.init();
});
