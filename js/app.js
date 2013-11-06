requirejs.config({
    //By default load any module IDs from js/lib
    baseUrl: 'js/',
    //except, if the module ID starts with "app",
    //load it from the js/app directory. paths
    //config is relative to the baseUrl, and
    //never includes a ".js" extension since
    //the paths config could be for a directory.
    paths: {
        'underscore': 'vendor/lodash',
        'jquery': 'vendor/jquery',
        'jquery-ui': 'vendor/jquery-ui',
        'md5': 'vendor/md5',
        'hogan': 'vendor/hogan',
        'codemirror': 'vendor/codemirror',
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

    $('#preloader').fadeOut();
});
