## 0 - co (completed branch)
> This is the completed branch, for the incomplete version go [here](//github.com/jon-hall/generators-and-async/tree/master/0-co).

This project introduces how generators can help us write flatter code.  It covers how to convert Promise-based code to flatter, synchronous-looking, generator-based code.  It doesn't actually explore *how* this works, that is left for the other example to explore.

#### A brief intro to generators (more on them later)

Generator functions are written very similarly to normal functions, except they use `function*` instead of just `function`, indicating it's a generator function.

The other main difference is that generator functions support a new keyword - `yield`, which is a bit like `return`, except that function execution *resumes* after a value is `yield`ed

```js
function* aGeneratorFunction() {
    yield 1;
    yield 2; // also runs when the generator is executed
    return 5;
    return 2; // this line is not hit as the return DOES exit the generator
}
```

#### How this enables flat async code

By running our generator function within a library such as [`co`](//github.com/tj/co), we can take Promise-based code like this

```js
doSomethingAsync()
    .then(function(result) {
        return doSomethingElseAsync(result);
    })
    .then(function(result) {
        return doOneMoreAsyncThing(result);
    })
    .then(function(result) {
        console.log(result);
    }, function(err) {
        console.error(err);
    });
```

and turn it into the much cleaner

```js
co(function*() {
    try {
        var result = yield doSomethingAsync();
        result = yield doSomethingElseAsync(result);
        console.log(yield doOneMoreAsyncThing(result));
    } catch(err) {
        console.error(err);
    }
});
```

`co` allows us to simply `yield` a Promise to receive its result, if the Promise rejects then the error is thrown from that line of code.  This allows us to handle errors just like in synchronous code - using `try`/`catch` blocks.

We can also do stuff like overwrite `result` on the same line as passing it to `doSomethingElseAsync` without any problems.  We're even able to directly pass a `yield` expression into the call to `console.log`, the generator waits on the Promise before `console.log` gets called.

#### Converting existing Promise-based code

The `index.js` file in this repo shows a *promisified* version of the renamer application from the [node-intro](//github.com/jon-hall/node-intro), the original version is also included for reference (`index_orig.js`).

Use the example code above to convert the `index.js` file to use `co` and `yield` on each of the Promises.

To get you started, run (from a command prompt in this folder)

```sh
npm install co --save
```

now you have co installed you can start flattening the code

```js
var co = require('co'),
    promisify = require('promisify-node'),
    fs = promisify('fs'),
    thfRegex = /^thf/;

co(function*() {
    try {
        // TODO: yield on some Promises..
        /* old Promisey code goes here */

    } catch(err) {
        console.error(err);
    }
});
```

Replace each `.then` call with a `yield` into a variable (which receives the result), and any error callbacks (the second argument to `.then`) can be replaced by putting code in a `try`/`catch` block.

#### Yielding loops
You'll need to do `yield`s inside of the `files` array loop, since `.forEach` doesn't accept generator functions we need a different way to loop (as we won't be able to `yield` in the loop if we aren't in a generator function).  The simplest solution is to convert it back to a regular `for` loop:

```js
for(var i = 0; i < files.length; i++) {
    var file = files[i];
    /* ... */
    yield fs.rename(/* ... */);
}
```

Test your code by running `node index.js` from a command prompt in the directory - if it renames the files in the `/stuff` folder then it worked.  If not, then there's a spare copy of the files, to reset with, in `/stuff_backup`.
