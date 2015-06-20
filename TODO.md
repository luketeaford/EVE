#Eve Web Audio Synthesizer

##Next Steps:
* create a mixer for the harmonicOsc -- connect LFO 2 that instead of VCA gain
* connect the mixer to VCA gain


##TODO:
* create octaveShift
* Rewrite calculatePitch and setPitch

* Harmonic Osc needs modulation amounts moved into each channel
  * lfo (positive and negative)
  * envelope (positive only)
* LFO 2
  * has ranges (slow, medium, high)
  * Should have these destinations:
    * master vca (done)
    * pitch of all oscillators (and LFO)
    * each harmonic (vca just like LFO 1)

* Delay

* Reverb
