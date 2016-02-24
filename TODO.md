#Eve Web Audio Synthesizer

#NEXT STEPS:
* add portamento fall back (an array of played keys in order)
* add a class to keys that played
* Refine VCA envelope
* Create timbre Envelope
* consider combining the timbre envelope and eg amounts
* add MIDI
* fine tune LFO 1
* fine tune LFO 2
* add oscilloscope
* add program bank and change buttons
* ability to ajax in presets
* midi learn
* fix scss

#PORTAMENTO PROBLEMS
* KEYDOWN
  * add each unique pitch to an array
  * sort the array in ascending order
* KEYUP
  * remove the matching pitch from array
  * sort the array in ascending order (optional?)
  * use lowest index from array to calculate pitch (THIS IS THE HARD PART)

#NOTES:
* Custom Events will require capitalizing HTML data-attributes in the short term (fix THAT later)
* Figure out a good place to bind events
* Reduce HTML as much as possible


#OLD INFORMATION
##Next Steps:

* Put playing keys in an array for portamento

* presets

##OLD TODOs:

* Harmonic Osc needs modulation amounts moved into each channel
  * lfo (positive and negative)
  * envelope (positive only)

* Delay

* Gulp
  * write minified files in the conventional way
  * minify HTML
  * don't commit minfiles
