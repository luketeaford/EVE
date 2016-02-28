#Eve Web Audio Synthesizer

#NEXT STEPS:
* ability to ajax in presets
* write load method for each section (like LFO2)
* add oscilloscope
* add MIDI
* midi learn
* consider combining the timbre envelope and eg amounts (visually)
* fix scss

#BEFORE MAKING PRESETS
* fine tune lfo 1
* fine tune lfo 2

#ENVELOPES
* The peak variable is weirdly named inside attack -- it IS the peak, but it's also the attack time
* Determine if slightly slower envelopes would be better (now that vca is fixed)

#TOUCH PROBLEMS:
Playing legato doesn't work -- turns gateOff (playing array should move to calculatePitch, I guess)

#CLEAN UP IDEAS
* sliders and buttons could use event.path[x] instead of finding a bunch of parentElements
* Eliminate switches where feasible

#NOTES:
* Custom Events will require capitalizing HTML data-attributes in the short term (fix THAT later)
* Figure out a good place to bind events
* Reduce HTML as much as possible
