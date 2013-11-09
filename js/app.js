requirejs.config({
    baseUrl: 'js/',
    // Vendor libraries use IDs 
    paths: {
        'underscore': 'vendor/lodash',
        'jquery': 'vendor/jquery',
        'jquery-ui': 'vendor/jquery-ui',
        'md5': 'vendor/md5',
        'hogan': 'vendor/hogan',
        'codemirror': 'vendor/codemirror',
        'json': 'vendor/json2',
        'base64': 'vendor/base64'
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
