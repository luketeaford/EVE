#Eve Web Audio Synthesizer

#NEXT STEPS:
* REMEMBER: a lot of (any?) parentElements? instead use currentTarget
* consider combining the timbre envelope and eg amounts (visually)
* add MIDI
* fine tune LFO 1
* fine tune LFO 2
* add oscilloscope
* add program bank and change buttons
* ability to ajax in presets
* midi learn
* fix scss

#ENVELOPES
* The peak variable is weirdly named inside attack -- it IS the peak, but it's also the attack time
* Determine if slower envelopes would be better (now that vca is fixed)

#TOUCH PROBLEMS:
Playing legato doesn't work -- turns gateOff (playing array should move to calculatePitch, I guess)

#NOTES:
* Custom Events will require capitalizing HTML data-attributes in the short term (fix THAT later)
* Figure out a good place to bind events
* Reduce HTML as much as possible
