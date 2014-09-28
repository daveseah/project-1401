## Project 1401 - Javascript Video Game Shell

I am an interactive designer and reluctant programmer that, on my [10-year blogging anniversary][10year], realized that I was not getting some dream projects done. One of the oldest ones is making my own video game. While I don't consider myself a die-hard programmer and have avoided it when possible, I'm seeing that I can't avoid it. Thanks to some recent project work, I've started to pick up some modern web application skills, so I'm using them to kick-start a Javascript-based code base for game design exploration.

Although there are a lot of tutorials on the Internet, they often do not teach you how to build an actual working system from scratch. There are also many powerful game engines available, but they don't often explain their founding architectural concepts either. I am hoping that this project will help fill that void, because I am totally obsessive about connecting all the dots together in working code. 

For more detailed project documentation, the [Project 1401 Wiki][wiki] here on Github. For background information, see my [Project 1401][project1401] home page. 

[project1401]:http://davidseah.com/about/make-video-game/
[10year]:http://davidseah.com/2014/09/my-next-10-years-of-blogging/
[wiki]:http://github.com/daveseah/project-1401/wiki

## Platform Information

I've chosen standard plugin-free technologies that I think are cleanly-architected and well-documented. 

* The web client is Javascript EC5 and HTML5 within the Durandal modular MVVM web application framework, which uses KnockoutJS, Bootstrap, and Handlebars as its underlying technology. More importantly, it uses RequireJS to enable modular development. 
* The build environment is MimosaJS, which is built on Git, Bower, NodeJS/NPM, and Express.

Although I'm using OS X, this project should also build on Linux (I've tested Ubuntu 12.04LTS running in a VirtualBox VM on Windows). I am using Chrome as my main development browser.


## Quick Installation

You must have Git, NodeJS, and Mimosa installed. For the purposes of these instructions, the path `/my_code_folder` is the example directory where we'll put the source code; replace that with your own directory (for example, mine is `~dseah/dev/`). You will need to be connected to the Internet.

#### Install Git, NodeJS, Mimosa

* Install **Git** and **NodeJS**, if you don't have them already. I used a package manager (e.g. `apt-get` on Ubuntu, `homebrew` on OS X) to do it for me.
* Open a terminal window, and install Mimosa by typing `npm install -g mimosa`. It may take a while for this to install from the Internet, so be patient.

#### Clone the Project 1401 Github Repo

* When Mimosa has installed correctly, `cd /my_code_folder`, then `git clone https://github.com/daveseah/project-1401.git`. This will pull all the current repo files into a directory called `/my_code_folder/project-1401`.

#### Build the Project and Run

The project-1401 directory has a folder called `buildsys` that has all the source files. We have to do some one-time initialization that will pull Node modules and Javascript modules from the Internet.

* `cd project-1401/buildsys` 
* Initialize Mimosa with `npm install`. This grabs the Node modules using the Node Package Manager (npm), as specified by the `package.json` config file.
* Install local Javascript packages with `mimosa build`. This grabs the Javascript client libraries using Mimosa-Bower, as specified by the `bower.json` config file.
* If everything seemed to work, type `mimosa watch -s` and then open Chrome to **http://localhost:3000**, on the same machine you installed Project 1401.

## Updates

September 20, 2014
: I only have committed the pristine Durandal/Mimosa setup, with cosmetic text changes. My goal is to make very careful commits that show EXACTLY how I'm adapting this framework into a Javascript game platform, explaining the underlying architecture of the system so I don't forget how it works.

September 28, 2014
: Added game module loading w/ basic gameloop and gamestep control (text only), rewriting it to be easier to create modules from scratch.