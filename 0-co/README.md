## 0 - co
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
By running our generator function within a library such as [`co`](https://github.com/tj/co), we can take Promise-based code like this
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
