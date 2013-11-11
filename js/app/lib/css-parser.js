define(['jaf/globals'], function (globals) {
    var regex = /library\('(.*?)'\)/g;

    return function (css) {
        var arr = regex.exec(css),
            fileName,
            file;

        while(arr !== null) {
            fileName = arr[1];
            file = globals.library[fileName];

            // replace library() with the actual image data if the 
            // image exists
            if(file !== undefined) {
                css = css.replace(arr[0], 'url(' + file.target.result + ')');
            }

            // read next match
            arr = regex.exec(css);
        }

        return css;
    };
});
