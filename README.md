## Project 1401 - Javascript Video Game Shell

I am an interactive designer and reluctant programmer that, on my [10-year blogging anniversary][10year], realized that I was not getting some dream projects done. One of the oldest ones is making my own video game. While I don't consider myself a die-hard programmer and have avoided it when possible, I'm seeing that I can't avoid it. Thanks to some recent project work, I've started to pick up some modern web application skills, so I'm using them to kick-start a Javascript-based code base for game design exploration.

Although there are a lot of tutorials on the Internet, they often do not teach you how to build an actual working system from scratch. There are also many powerful game engines available, but they don't often explain their founding architectural concepts either. I am hoping that this project will help fill that void, because I am totally obsessive about connecting all the dots together in working code. 

For more detailed project documentation, the [Project 1401 Wiki][wiki] here on Github. For background information, see my [Project 1401][project1401] home page. 

[project1401]:http://davidseah.com/about/make-video-game/
[10year]:http://davidseah.com/2014/09/my-next-10-years-of-blogging/
[wiki]:http://github.com/daveseah/project-1401/wiki

## Platform Information

I've chosen standard plugin-free technologies that I think are cleanly-architected and well-documented. 

* The web client is Javascript EC5 and HTML5 structured within Durandal, a modular MVVM web application framework. Durandal uses KnockoutJS, Bootstrap (2.3.2), and Handlebars for its underlying technology. More importantly, it uses RequireJS to enable modular development. 
* The build environment is MimosaJS, which is built on NodeJS and NPM. The development webserver is implemented in Node using Express. Git and Bower are used for source control and package management. 

Although I'm using OS X, this project should also build on Linux and Windows. I've tested Ubuntu 12.04LTS running in a VirtualBox VM on Windows, and also Windows 8.1 64bit. I am using Chrome as my main development browser; this project is not designed for broad browser compatibility at this point.


## Quick Installation

You must have Git, NodeJS, and Mimosa installed. For the purposes of these instructions, the path `/my_code_folder` is the example directory where we'll put the source code; replace that with your own directory (for example, mine is `~dseah/dev/`). You will need to be connected to the Internet, because Node and Mimosa download dependencies from other repositories.

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

#### Additional Documentation

The [Project 1401 Wiki](https://github.com/daveseah/project-1401/wiki) on GitHub contains my working documentation. My goal is to make this very clear to the intermediate-level programmer who wants to understand the concepts that drive the system design. 

There is not a lot of online material that details the birth of a video game architecture from the ground-up, so I've decided to share it. If you find anything unclear, let me know!

## Updates

February 17, 2015
* Refactoring the ports of SYSLOOP and RENDERER, two manager modules. When I had written the renderer before, I didn't have a good grasp of how to manage the different coordinate systems (there are three: browser, webgl/screen, and world). Also, it was a mess. 
* Ported/cleaned-up Visual and Viewport managers.

September 28, 2014
* Added game module loading w/ basic gameloop and gamestep control (text only), rewriting it to be easier to create modules from scratch.

September 20, 2014
* I only have committed the pristine Durandal/Mimosa setup, with cosmetic text changes. My goal is to make very careful commits that show EXACTLY how I'm adapting this framework into a Javascript game platform, explaining the underlying architecture of the system so I don't forget how it works.

