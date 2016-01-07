## 1 - runner
This project covers a little on how generators actually work and how we are able to leverage them to flatten async code.
The end result is writing a (greatly simplified) version of `co` - the library we used to 'run' our generator function in the first example.

#### Generator functions
There are two things which usually get lumped under the term 'generator' - the first, and the one which people usually mean when they say 'generator', is the generator function (`function*(){}`).

Generator functions can be called like a regular function, but instead of returning the value after `return`, like a normal function, generator functions return a *generator object*.

```js
function* a() { /*...*/ };

var b = a();

// b is now a generator object
```

#### Generator objects
> TODO
