## generators-and-async (completed branch)
> This is the completed branch, for the incomplete version go [here](jon-hall/generators-and-async/tree/master).

An introduction to how generators can be leveraged to flatten asynchronous code into a more manageable structure.

It comprises two basic exercises, the first of which illustrates how Promise-based code can be de-cluttered using generators to 'await' on promises.  In the other example, we build our own miniature version of the library used in the first project (`co`) to understand how it actually works under the hood.

#### Prerequisites
In order to run the projects in this repo you'll need to have a version of node (preferably `>=4.0.0`) installed (you can check your version by entering `node -v` in a command prompt).  You can get the installer from [here](https://nodejs.org) if you don't have node yet, or want to update.

You'll also need git (or a git client) to clone this repo.

#### Projects
Each folder contains a mini-project with it's own README which explains some of the concepts being illustrated, and how to complete each exercise, if you want to try it for yourself.

Project walkthroughs:
 - [0-co](0-co/README.md)
 - [1-runner](1-runner/README.md)

#### Further reading

 - [Koa](https://github.com/koajs/koa/tree/9f80296fc49fa0c03db939e866215f3721fcbbc6) - a web framework (currently) based on generators, using [co](https://github.com/tj/co).
 - [Generators are iterators and iterables](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols) - in-depth coverage of the `iterable` and `iterator` protocols, including generator objects.
 - [Async/await today with babel](http://masnun.com/2015/11/11/using-es7-asyncawait-today-with-babel.html) - a small article covering the basic setup of writing similarly flattened async code using the upcoming [async/await](https://github.com/tc39/ecmascript-asyncawait) syntax by [transpiling](https://en.wikipedia.org/wiki/Source-to-source_compiler) with [babel](http://babeljs.io/).
