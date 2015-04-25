#EVE
Web Audio Synthesizer by Luke Teaford

EVE is an additive monosynth built with Web Audio.

##Requirements
###Audio
* No audibile clicks or pops
* Lush reverb
* Fine tune scaling before making presets

###Routing
* /login
* /signup
* /user/sound
* /user/
* /user/settings
* /help

###Browser Support
* Truly mobile first
* Work perfectly cross browser
* Musically useful even on mobile

###Visual Design
* Heavenly, angelic, light
* Everything comes from the top down
  * Including expand/collapse triangles
* Gold, haloes, eternity

###MIDI
* Must have MIDI learn
* Must have default map for the Moog Sub 37

###Code Standards
* camelCasing even though it's ugly
* alphabetizing
* whatever else I think of
* uses editorConfig

###Navigation
* Should be page level kinds of things:
  * Register/Sign In
  * Help (Manual)
  * Settings
* "Register" should be changed to "Sign In" if a user has completed sign in

###Keyboard
* Ability to choose modes:
  * Chromatic
  * the cool modes

###Development
* Must be very simple for others to work on despite demanding standards
* Basically, should be clone it, read directions, type npm install, and go!
* Eliminate all confusion about what goes where
* Probably want to use the convention where final script is called eve.min.js
  * Maybe even with semantic versioning

###Gulp
* Add a watch to the gulpfile itself in case it changes, it should stop and rerun

###HTML
Probably a better idea to use a pseudo element instead of hr after every section
