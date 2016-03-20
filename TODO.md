#Eve Web Audio Synthesizer


#NEXT STEPS:
* style performance controls
* consistent font for inputs (radio buttons should match knobs)
* clean up scss

* stop committing min files
* min files should be eve*.min.js and eve*.min.css

* TOUCH: FIX LEGATO
* TOUCH: prevent default on keys

* make config editable
* MIDI modwheel should control lfo2 gain (in a useful way)
* keyboard/performance separated

* now() is kind of worthless
* make envelope functions?


#BEFORE MAKING PRESETS
* fine tune envelopes
* fine tune lfo 1
* fine tune lfo 2


#ENVELOPES
* The peak variable is weirdly named inside attack -- it IS the peak, but it's also the attack time
* Determine if slightly slower envelopes would be better (now that vca is fixed)


#TOUCH PROBLEMS:
* Playing legato doesn't work -- turns gateOff (playing array should move to calculatePitch, I guess) - THIS IS PROBABLY BECAUSE TOUCHSTART/END NOT LIMITED TO ONE AT A TIME


#CLEAN UP IDEAS
* Eliminate switches where feasible
* value as number instead of parseFloat

#NOTES:
* Reduce HTML as much as possible


#2.0 FEATURES
* top level nav for section to edit: (oscillator, timbre envelope, config, etc)
* add midi learn
* Fine Tune
* cache the data-note-value for keyboard presses AND inputs
* LFO 1 expansion: amp, pitch, and phase per channel
* perhaps ribbon glide should be linked to the preset glide


#FINE TUNE
* [] FINE TUNE CANNOT BE PART OF THE PRESET (IT'S A CONFIG)
* [] FINE TUNE SHOULD BE FREQUENCY CHANGE TO ALL OSCILLATORS AND LFOS
* [] fine tune must happen in real time
