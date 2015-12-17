var fs = require('fs'),
    thfRegex = /^thf/;

fs.readdir('./stuff', function(err, files) {
    // Handle the error, if present
    if(err) {
        throw err;
    }

    files.forEach(function(file) {
        if(!thfRegex.test(file)) {
            // Skip files whose names don't contain the string to be replaced
            return;
        }

        // Calculate the current name (relative to cwd), and the new name
        var relativeName = './stuff/' + file,
            newName = './stuff/' + file.replace(thfRegex, 'wvk');

        // Do the rename (also an async operation)
        fs.rename(relativeName, newName, function(err2) {
            // NOTE: This one is 'err2' so we don't shadow 'err'
            if(err2) {
                throw err2;
            }

            console.log('Renamed "%s" to "%s"', relativeName, newName);
        });
    });

    console.log('Renaming files...');
});
