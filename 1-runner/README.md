## 1 - runner (completed branch)
> This is the completed branch, for the incomplete version go [here](//github.com/jon-hall/generators-and-async/tree/master/1-runner).

This project covers a little on how generators actually work and how we are able to leverage them to flatten async code.
The end result is writing a (greatly simplified) version of `co` - the library we used to 'run' our generator function in the first example.

#### Generator functions
There are two things which usually get lumped under the term 'generator' - the first, and the one which people usually mean when they say 'generator', is the generator function (`function*(){}`).

Generator functions can be called like a regular function, but instead of returning the value after `return`, like a normal function, generator functions return a *generator object*.

```js
function* a() { /*...*/ return 5; };

var b = a();

// b is now a generator object, not '5'
```

#### Generator objects
Generator objects are where the magic really happens - they are iterators, which means you can call `next()` on them to attempt to retrieve another value (you can *iterate* them).

Each time you call `next()` it 'runs' the generator function up to the next `yield` (or `return`) statement and returns the value `yield`ed (or returned).  In order to also provide information about the state of the sequence, this value is wrapped in an object containing two properties - `value` (the value yielded/returned) and `done` which tells you whether there are more results to be iterated.

One thing to note here is that, when you initially invoke a generator function - and haven't yet called `next()` on the returned generator object - none of the code inside the generator function is run until `next()` is called.

```js
function* a() {
    console.log(1);
    yield 'a';
    console.log(2);
    return 'b';
    console.log(3);
}

var b = a(); // nothing logged
b.next(); // logs: '1', then returns: { value: 'a', done: false }
b.next(); // logs: '2', then returns: { value: 'b', done: true }

// the generator has run to completion, but we can still call next()
b.next(); // never logs '3', always returns: { value: undefined, done: true }
```

###### Generator objects as iterables
> As an aside (since it isn't used by what we'll  be doing), generator objects are also iterables, meaning they can be used in `for...of` loops:

```js
// taking the above example generator function 'a'

// this immediately logs '1', as it starts iterating the
// returned generator object
for(var b of a()) {
    // logs 'a', then 'b', also causes log of '2' to be called
    // as the generator function runs
    console.log(b);
}
```

#### Back to the task at hand, how does this help us flatten async code?
We've seen that, if someone gives us a generator function, we can call it to get a generator object back.  This generator object then lets us control how the original generator function is 'run' - we can call `next()` which runs the generator function and gives us back the next value `yield`ed.

If, for example, a Promise is yielded from the generator function, we can choose to wait on that Promise before we call `next()` again - allowing us to do stuff like this:

```js
// runner is the function we will make to 'run' async code
// in a generator function
runner(function*() {
    yield doSomethingAsync();
    yield doAnotherAsyncThing();
    yield doMoreAsyncStuff();
});
```
In this scenario we can be sure that `doSomethingAsync` has completed before `doAnotherAsyncThing` is called (likewise with the subsequent call to `doMoreAsyncStuff`).  We now have async code which *looks* synchronous - we're already halfway there!  The code for `runner` at this stage would look something like this:

```js
function runner(genFn) {
    // get our generator object
    var gen = genFn();

    // since we may have to wait, use the naive approach of recursion
    function step() {
        var next = gen.next();

        // bail when the generator function is done
        if(next.done) return;

        if(next.value instanceof Promise) {
            // wait on Promise and step on success or failure
            next.value.then(step, step);
        } else {
            // to prevent blowing the stack, use a Promise to call step
            Promise.resolve().then(step);
        }
    }

    // start the process going
    step();
}
```
This is great, but what if the Promise we wait on rejects?

#### Handling asynchronous errors
Fortunately, as well as being iterators, generator objects also expose a method (`throw(err)`) which allows us to *pass an error back into* the generator function.  This results in the exception we 'pass in' being thrown like a regular `throw <Error>` would, at the site of the latest `yield`.

So if we decide to catch Promise rejections and then `throw` the error that the Promise was rejected with, our `runner` code now becomes:

```js
function runner(genFn) {
    // get our generator object
    var gen = genFn();

    // since we may have to wait, use the naive approach of recursion
    function step() {
        var next = gen.next();

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
            // to prevent blowing the stack, use a Promise to call step
            Promise.resolve().then(step);
        }
    }

    // start the process going
    step();
}
```
We're now only one piece away from a fully working (albeit minimal and rudimentary) implementation of  `co` in under 20 lines of code, so what is that missing piece?

#### Passing values back to the generator function
So far we've only called `next()` on the generator object without any parameters - it turns out that you can actually do `next(value)`, which will *pass a value back into the generator function* which is used within the function as the result of the `yield` expression.

```js
function* genFunc() {
    console.log(yield null);
}

var g = genFunc();
g.next(1); // runs genFunc to the first yield => console.log not called yet
g.next(2); // 'returns' 2 from the yield => '2' logged to console
```

Combining this with our existing `runner` code gives us our finished implementation, which can be saved as `index.js` in this folder and tested by running `node test.js`.

```js
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
            // to prevent blowing the stack, use a Promise to call step
            // make sure we pass next.value through to 'step'!
            Promise.resolve(next.value).then(step);
        }
    }

    // start the process going (no initial value)
    step();
};
```
