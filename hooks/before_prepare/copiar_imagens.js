#!/usr/bin/env node

//
// This hook copies various resource files from our version control system directories into the appropriate platform specific location
//


// configure all the files to copy.  Key of object is the source file, value is the destination location.  It's fine to put all platforms' icons and splash screen files here, even if we don't build for all platforms on each developer's box.
var filestocopy = [{
    "drawable/android/icon.png": "platforms/android/res/drawable/icon.png"
},{
    "drawable/android/icon.png": "icon.png"
}, {
    "drawable/android/drawable-hdpi/icon.png": "platforms/android/res/drawable-hdpi/icon.png"
}, {
    "drawable/android/drawable-ldpi/icon.png": "platforms/android/res/drawable-ldpi/icon.png"
}, {
    "drawable/android/drawable-mdpi/icon.png": "platforms/android/res/drawable-mdpi/icon.png"
}, {
    "drawable/android/drawable-xhdpi/icon.png": "platforms/android/res/drawable-xhdpi/icon.png"
}, {
    "drawable/android/drawable-port-xhdpi/screen.png": "www/res/android/screen/port-xhdpi.png"
}, {
    "drawable/android/drawable-land-xhdpi/screen.png": "www/res/android/screen/land-xhdpi.png"
}, {
    "drawable/android/drawable-port-hdpi/screen.png": "www/res/android/screen/port-hdpi.png"
}, {
    "drawable/android/drawable-land-hdpi/screen.png": "www/res/android/screen/land-hdpi.png"
}, {
    "drawable/android/drawable-port-ldpi/screen.png": "www/res/android/screen/port-ldpi.png"
}, {
    "drawable/android/drawable-land-ldpi/screen.png": "www/res/android/screen/land-ldpi.png"
}, {
    "drawable/android/drawable-port-mdpi/screen.png": "www/res/android/screen/port-mdpi.png"
}, {
    "drawable/android/drawable-land-mdpi/screen.png": "www/res/android/screen/land-mdpi.png"
}, {
    "drawable/android/9-patch.9.png": "www/res/android/screen/9-patch.9.png"
} ];

var fs = require('fs');
var path = require('path');

// no need to configure below
var rootdir = process.argv[2];

filestocopy.forEach(function(obj) {
    Object.keys(obj).forEach(function(key) {
        var val = obj[key];
        var srcfile = path.join(rootdir, key);
        var destfile = path.join(rootdir, val);
        //console.log("copying "+srcfile+" to "+destfile);
        var destdir = path.dirname(destfile);
        if (fs.existsSync(srcfile) && fs.existsSync(destdir)) {
            fs.createReadStream(srcfile).pipe(fs.createWriteStream(destfile));
        }
    });
});
