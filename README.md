## generators-and-async
An introduction to how generators can be leveraged to flatten asynchronous code into a more manageable structure.

It comprises two basic exercises, the first of which illustrates how Promise-based code can be de-cluttered using generators to 'await' on promises.  In the other example, we build our own miniature version of the library used in the first project (`co`) to understand how it actually works under the hood.

#### Prerequisites
In order to run the projects in this repo you'll need to have a version of node (preferably `>=4.0.0`) installed (you can check your version by entering `node -v` in a command prompt).  You can get the installer from [here](https://nodejs.org) if you don't have node yet, or want to update.

You'll also need git (or a git client) to clone this repo.  That's all the basics you need to get going, *although the ffi example does require a fair amount of additional things, if you intend to run it* - further details are in the readme for that project.

#### Projects
Each folder contains a mini-project with it's own README which explains some of the concepts being illustrated, and how to complete each exercise, if you want to try it for yourself.  

Completed versions of each of the projects will be found on the `completed` branch if you just want to skip to a finished version and look at, or play with, the code.

Project walkthroughs:
 - [0-co](0-co/README.md)
 - [1-runner](1-runner/README.md)

#### Further reading
> TODO