# EVE Web Audio Synthesizer

# SCSS CLEANUP
* mixins/show-octaves needs work (media query)
* modules/keyboard needs work (media query)
* clean up temp

# 2.0 FEATURES
* qwerty keyboard control of selected knobs
* cache the data-note-value for keyboard presses AND inputs

# FINE TUNE
* [] FINE TUNE CANNOT BE PART OF THE PRESET (IT'S A CONFIG)
* [] FINE TUNE SHOULD BE FREQUENCY CHANGE TO ALL OSCILLATORS AND LFOS
* [] fine tune must happen in real time

# SMALL BUGS
* Possible to latch gate on by playing ribbon and keyboard
* iOS gets awful distortion when the app is launched as an installable web app

# CLEAN UP IDEAS
* The peak variable is weirdly named -- it IS the peak, and the attack time
* keyboard/performance separated and gate organized better
