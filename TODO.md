# EVE Web Audio Synthesizer

# NEXT STEPS:
* Add a means to hide editing

# SCSS
* Check CSS for colors / Rename all derived colors
* clean up scss

# BROWSERSYNC
* Get live reload working

# LFO TRACKING:
* Does trackedOscs belong to the config?
* Need to make sure that property is saved to preset

# BEFORE MAKING PRESETS
* fine tune envelopes
* fine tune lfo 1
* fine tune lfo 2

# ENVELOPES
* The peak variable is weirdly named inside attack -- it IS the peak, but it's also the attack time
* Determine if slightly slower envelopes would be better

# CLEAN UP IDEAS
* keyboard/performance separated and gate organized better
* Eliminate switches where feasible
* value as number instead of parseFloat

# 2.0 FEATURES
* qwerty keyboard control of selected knobs
* make config editable
* MAKE ENVELOPE FUNCTIONS -- and now() is kind of worthless
* MIDI modwheel should control lfo2 gain (in a useful way)
* top level nav for section to edit: (oscillator, timbre envelope, config, etc)
* add midi learn
* Fine Tune
* cache the data-note-value for keyboard presses AND inputs
* LFO 1 expansion: amp, pitch, and phase per channel

# FINE TUNE
* [] FINE TUNE CANNOT BE PART OF THE PRESET (IT'S A CONFIG)
* [] FINE TUNE SHOULD BE FREQUENCY CHANGE TO ALL OSCILLATORS AND LFOS
* [] fine tune must happen in real time

# SMALL BUGS
* ribbon controller won't scale properly with 1octave
* Possible to latch gate on by playing ribbon and keyboard

# POSSIBLE ISSUES
* iOS gets awful distortion when the app is launched as an installable web app
