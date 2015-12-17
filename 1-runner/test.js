var runner = require('./index');

runner(function*() {
    console.log(1);

    // Yield on a Promise which resolves in 500ms
    yield new Promise(function(res, rej) {
        setTimeout(res, 500);
    });

    console.log(2);

    // Yield on another Promise which resolves in 500ms
    yield new Promise(function(res, rej) {
        setTimeout(res, 500);
    });

    console.log(3);
});
