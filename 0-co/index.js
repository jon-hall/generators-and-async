var co = require('co'),
    promisify = require('promisify-node'),
    fs = promisify('fs'),
    thfRegex = /^thf/;

co(function*() {
    try {
        // Get the list of files by yielding on readdir
        var files = yield fs.readdir('./stuff');

        console.log('Renaming files...');
        for(var i = 0; i < files.length; i++) {
            var file = files[i],
                relativeName,
                newName;

            if(!thfRegex.test(file)) {
                // Skip files whose names don't contain the string to be replaced
                continue;
            }

            // Calculate the current name (relative to cwd), and the new name
            relativeName = './stuff/' + file;
            newName = './stuff/' + file.replace(thfRegex, 'wvk');

            // Yield on the rename and resume execution once done
            yield fs.rename(relativeName, newName);

            // Console.log in node supports a basic printf-type syntax
            console.log('Renamed "%s" to "%s"', relativeName, newName);
        }
    } catch(err) {
        // Catch all errors here
        console.error(err);
    }
});
