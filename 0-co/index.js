var promisify = require('promisify-node'),
    fs = promisify('fs'),
    thfRegex = /^thf/;

fs.readdir('./stuff').then(function(files) {
    console.log('Renaming files...');
    files.forEach(function(file) {
        var relativeName,
            newName;

        if(!thfRegex.test(file)) {
            // Skip files whose names don't contain the string to be replaced
            return;
        }

        // Calculate the current name (relative to cwd), and the new name
        relativeName = './stuff/' + file;
        newName = './stuff/' + file.replace(thfRegex, 'wvk');

        // Do the rename and resume execution once done
        fs.rename(relativeName, newName).then(function() {
            // Console.log in node supports a basic printf-type syntax
            console.log('Renamed "%s" to "%s"', relativeName, newName);
        }, function(err) {
            console.error(err);
        });
    });
}, function(err) {
    console.error(err);
});
