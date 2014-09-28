define(function() {
    var ctor = function () {
        this.displayName = 'About This Project';
        this.description = '<a href="http://davidseah.com/about/make-video-game/">Project 1401</a> is my "make a game" learning project. The goal is to make a game that incorporates graphics, sound, and physics. It doesn\'t really matter that is is a GREAT game; I\'m hopeful that this project will be helpful to others learning how to build a web app/game in Javascript for modern browsers. Along the way I hope I have some fun and put this old dream to rest.';
        this.features = [
            'Make a clean Durandal/Mimosa shell',
            'Customize text for project',
            'Commit installation instructions to Github',
            'Created documentation wiki on Github',
            'Added Game Demo Shell'
        ];
    };

    //Note: This module exports a function. That means that you, the developer, can create multiple instances.
    //This pattern is also recognized by Durandal so that it can create instances on demand.
    //If you wish to create a singleton, you should export an object instead of a function.
    //See the "flickr" module for an example of object export.

    return ctor;
});