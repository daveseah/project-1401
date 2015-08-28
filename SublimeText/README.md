## SublimeText Helpers

The `1401.sublime-project` file points to the following folders for convenience. All folders are in the build/assets/javascript/ path.
~~~
1401-games     - the games directory where you create your 
                 games using 1401 system components
1401           - the 1401 system directory
app            - the durandal view and viewmodels for 
                 defining the web application
build          - the build directory in case you need to 
                 access config files
~~~

Additionally, the `1401.Snippets` folder can be copied to your SublimeText user folder (go to SublimeText's "Preferences" then "Browse Packages"). Once copied (restart may be necessary), you can issue the following TAB-COMPLETION shortcuts in a Javascript source file:
~~~
/1401modshell  - insert a 1401-style module template for 
                 starting a new module
/1401gamemain  - insert a 1401 main game loop for your 
                 game-main.js file
/1401sysloop   - insert a 1401 sysloop for game modules
~~~

If you want to maintain my weird code formatting conventions, here's a few snippets to help with that:
~~~
/1401mfunc     - insert a 1401-style function definition
                 with parameters
/1401csep      - insert a set of 1401-style comment line 
                 separators
/1401cind      - insert a set of 1401-style indented comment
                 lead-in
~~~

For convenience in creating pieces
~~~
/1401pmake     - make piece creation code block (multitab)
/1401ploop     - make piece looper (multitab)
~~~