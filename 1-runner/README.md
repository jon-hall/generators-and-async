## 1 - runner
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

#### Back to the task at hand
> TODO
