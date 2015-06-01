## Project 1401 - Javascript Video Game Shell

On my [10-year blogging anniversary][10year], I vowed to fulfill my dream of making a video game just for me and my friends. I've started to pick up modern web dev skills thanks to recent project work, so I've decided to use Javascript as my plaform. It's universal and quite powerful these days, and deployment is instantaneous.

I have an educational goal as well. I've seen quite a lot of powerful game engines available, but the supporting documentation doesn't often go into the architecture behind their design and use. I want this project to help me and others understand how to build a working framework from scratch, mistakes and all. I figure this will be helpful to someone of an intermediate programming level who is curious how to build web applications. 

* For project documentation, the [Project 1401 Wiki][wiki] here on Github. 
* For background information, see my [Project 1401][project1401] home page. 
* For the current public demo build, go to [http://1401.davidseah.com][heroku].

[project1401]:http://davidseah.com/about/make-video-game/
[10year]:http://davidseah.com/2014/09/my-next-10-years-of-blogging/
[wiki]:http://github.com/daveseah/project-1401/wiki
[heroku]:http://1401.davidseah.com/

## Platform Information

I've chosen standard plugin-free technologies that I think are cleanly-architected and well-documented. 

* The web client is Javascript EC5 and HTML5 structured within Durandal, a modular MVVM web application framework. Durandal uses KnockoutJS, Bootstrap (2.3.2), and Handlebars for its underlying technology. More importantly, it uses RequireJS to enable modular development. 
* The build environment is MimosaJS, which is built on NodeJS and NPM. The development webserver is implemented in Node using Express. Git and Bower are used for source control and package management. 

Although I'm using OS X, this project should also build on Linux and Windows. I've tested Ubuntu 12.04LTS running in a VirtualBox VM on Windows, and also Windows 8.1 64bit. I am using Chrome as my main development browser; this project is not designed for broad browser compatibility at this point.


## Quick Installation

You must have Git, NodeJS, and Mimosa installed. For the purposes of these instructions, the path `/my_code_folder` is the example directory where we'll put the source code; replace that with your own directory (for example, mine is `~dseah/dev/`). You will need to be connected to the Internet, because Node and Mimosa download dependencies from other repositories.

Here's a [5 minute installation video on YouTube](https://www.youtube.com/watch?v=2QaUS15kGbU) that walks through the process of setting up a fresh Mac running OS X Yosemite, from installing Homebrew to pulling the repo and running it. 


#### Install Git, NodeJS, Mimosa

You need to install **Git** and **NodeJS**, if you don't have them already. Use a package manager or downloader. 

* On MacOS, I used [homebrew](http://brew.sh/) to install NodeJS. Homebrew requires installing the [xcode command line tools](https://developer.apple.com/library/ios/technotes/tn2339/_index.html), which gives you Git as well.
* On Windows, you can download the separate installers for Git and NodeJS. 
* Once Git and NodeJS are installed, open a terminal window (powershell on windows), and install Mimosa by typing `npm install -g mimosa`. It may take a while for this to install from the Internet during peak hours, so be patient.

#### Clone the Project 1401 Github Repo

* When Mimosa has installed correctly, `cd /my_code_folder`, then `git clone https://github.com/daveseah/project-1401.git`. This will pull all the current repo files into a directory called `/my_code_folder/project-1401`.

#### Build the Project and Run

The project-1401 directory has a folder called `build` that has all the source files. We have to do some one-time initialization that will pull Node modules and Javascript modules from the Internet.

* `cd project-1401/build` 
* Initialize Mimosa with `npm install`. This grabs the Node modules using the Node Package Manager (npm), as specified by the `package.json` config file.
* Install local Javascript packages with `mimosa build`. This grabs the Javascript client libraries using Mimosa-Bower, as specified by the `bower.json` config file.
* If everything seemed to work, type `mimosa watch -s` and then open Chrome to **http://localhost:3000**, on the same machine you installed Project 1401.

#### Forking the Project

If you want to build something on top of 1401, fork the project. If you add new code modules, I suggest putting them in a new subdirectory under 1401 so you can do a clean upstream fetch by [following these instructions](https://help.github.com/articles/syncing-a-fork/). 

#### Additional Documentation

The [Project 1401 Wiki](https://github.com/daveseah/project-1401/wiki) on GitHub contains my working documentation. My goal is to make this very clear to the intermediate-level programmer who wants to understand the concepts that drive the system design. 

There is not a lot of online material that details the birth of a video game architecture from the ground-up, so I've decided to share it. If you find anything unclear, let me know!

## Updates

March 12, 2015
* Add platform graphics tests
* Package and deploy to Heroku

March 10, 2015
* Add MovingPiece class
* Add PhysicsJS-driven sim step
* Add keyboard controls

March 4, 2015
* Add rotation for sprites
* Add infinite starfield
* Add 2d camera and starfield position tracking

February 28, 2015
* Completed refactor of main system startup and game step, confirmed operation.
* Updated documentation...woot!

February 19, 2015
* Refactoring the ports of SYSLOOP and RENDERER, two manager modules. When I had written the renderer before, I didn't have a good grasp of how to manage the different coordinate systems (there are three: browser, webgl/screen, and world). Also, it was a mess. 
* Ported/cleaned-up Visual and Viewport managers.
* Ported/cleaned-up ProtoPiece and Piece classes. Created MovingPiece stub.
* Added module and object inspection functions to help with documentation.

September 28, 2014
* Added game module loading w/ basic gameloop and gamestep control (text only), rewriting it to be easier to create modules from scratch.

September 20, 2014
* I only have committed the pristine Durandal/Mimosa setup, with cosmetic text changes. My goal is to make very careful commits that show EXACTLY how I'm adapting this framework into a Javascript game platform, explaining the underlying architecture of the system so I don't forget how it works.

