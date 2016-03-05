#Eve Web Audio Synthesizer

#NEXT STEPS:
* FINE TUNE SHOULD BE FREQUENCY CHANGE TO ALL OSCILLATORS AND LFOS
* fine tune must happen in real time
* need ability to advance presets with - and = and possibly , and .
* add MIDI / midi learn
* fix scss


#BEFORE MAKING PRESETS
* fine tune envelopes
* fine tune lfo 1
* fine tune lfo 2

#ENVELOPES
* The peak variable is weirdly named inside attack -- it IS the peak, but it's also the attack time
* Determine if slightly slower envelopes would be better (now that vca is fixed)

#TOUCH PROBLEMS:
Playing legato doesn't work -- turns gateOff (playing array should move to calculatePitch, I guess)

#CLEAN UP IDEAS
* Eliminate switches where feasible

#NOTES:
* Reduce HTML as much as possible
