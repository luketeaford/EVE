#Eve Web Audio Synthesizer

#NEXT STEPS:
* RIBBON: pitch bend and pitch control
* TOUCH: prevent default on keys
* TOUCH: ribbon control should do gate stuff
* keyboard/performance separated
* add midi learn
* make config editable
* keyboard improvements: tab through preset buttons, esc to close preset bank (make radio buttons)
* fix scss
* now() is kind of worthless
* MIDI modwheel should control lfo2 gain (in a useful way)


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


#NOTES:
* Reduce HTML as much as possible


#2.0 FEATURES
* Fine Tune
* LFO 1 expansion: amp, pitch, and phase per channel


#FINE TUNE
* [] FINE TUNE CANNOT BE PART OF THE PRESET (IT'S A CONFIG)
* [] FINE TUNE SHOULD BE FREQUENCY CHANGE TO ALL OSCILLATORS AND LFOS
* [] fine tune must happen in real time


#CRAZY IDEAS
* Could be cool to animate key color with envelope times
