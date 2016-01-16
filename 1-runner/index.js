module.exports = function runner(genFn) {
    // get our generator object
    var gen = genFn();

    // since we may have to wait, use the naive approach of recursion
    // as this is a callback for a promise - accept the resolved value
    // and pass it back into the generator function when we call 'next'
    function step(value) {
        var next = gen.next(value);

        // bail when the generator function is done
        if(next.done) return;

        if(next.value instanceof Promise) {
            // wait on Promise and step on success or throw on failure
            next.value.then(step, function(err) {
                // catch any rejections and 're-throw' from within the
                // generator function
                gen.throw(err);
            });
        } else {
            // to prevent blowing the stack, use Promise to call step
            // make sure we pass next.value through to 'step'!
            Promise.resolve(next.value).then(step);
        }
    }

    // start the process going (no initial value)
    step();
};
