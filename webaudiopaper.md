ABSTRACT

Synthesis is an important part of Web Audio, and the native audio nodes give developers the power to build innovative and unique synthesizers. This talk will share knowledge and insight into synthesizer design and application architecture from the approach of making musical instruments gained from developing my Web Audio Synthesizers.

WHAT IS A SYNTHESIZER?

A synthesizer is simply a machine for creating new sounds. I see no need to distinguish between a synthesizer and a sampler as some pedantic synth geeks do: whether a new sound originates from an OscillatorNode or an AudioBufferSourceNode makes no difference to me. Synthesizers do not necessarily need to be musical or to be played in traditional ways. Although Web MIDI and black and white keyboards are nice, a synthesizer could be triggered by any kind of browser events. I will call these types of synthesizers "sound engines". Sound engines would be useful in video games, user interfaces, and other applications where it's desirable to play a sound in response to user actions.

FUNCTIONS OF THE NATIVE AUDIO NODES

Synthesizers are made of many complex components, but a lot can be achieved with a few simple building blocks. In a Web Audio synthesizer, these are the native audio nodes. In particular, the OscillatorNode, BiquadFilterNode, and GainNode offer a surprising amount of flexibility for building a synthesizer.

In a typical musical synthesizer, the oscillator is primarily responsible for pitch. An OscillatorNode could be a sound source: its pitch is determined by frequency and detune. The OscillatorNode's type parameter is the most rudimentary timbre control in Web Audio. 'Sawtooth', 'square', and 'triangle' types have more harmonics and are therefore more musically interesting than sine waves.

The BiquadFilterNode is useful for filtering the sound. In general, it works by reducing the amplitude of certain frequencies in the sound. The types are equivalent to the modes that may be available on certain hardware synthesizers. Lowpass is the most commonly used in musical keyboard synthesizers because it can remove the "buzz" from harmonically rich waveforms.

The GainNode controls the amplitude of a signal. The most obvious use of a GainNode is a simple volume control, but GainNodes give developers a tremendous amount of creative control over their synthesizers.

MORE INTERESTING USES OF THE NATIVE AUDIO NODES

A common technique in synthesis is to layer multiple oscillators to create a thicker sound. It is desirable to slightly detune each oscillator so that they beat against each other like analog oscillators do.

This technique is used in TANGUY where the User Interface element, "Oscillator One" is actually built out of multiple OscillatorNodes that are treated as one (they receive the same frequency and detuning information). Each OscillatorNode is connected to a GainNode, essentially each GainNode acts like a mixer, so the various types can be blended. My EVE synthesizer uses a similar technique to give the user control over eight sine wave OscillatorNodes. Each of these OscillatorNodes receives the same detune information, but the frequency is doubled each time: a classic technique in additive synthesis.

OscillatorNodes can be connected to AudioParams to create interesting modulation. Hardware synthesizers usually have one or more Low Frequency Oscillators (LFOs) to do precisely this. I encourage developers to experiment with connections. Typically, LFOs would have a frequency less than 20Hz, but again experimentation is encouraged.

When building synthesizers, it is often useful to vary the intensity of an effect. Scheduling value changes to a GainNode can be used to create an envelope. This allows the user to fade an effect in and out as they please. TANGUY uses a "modulation wheel" that is associated with the amplitude of a GainNode so that the effect of the LFO can be attenuated or stopped entirely. EVE has an LFO with a delay stage in addition to the normal attack decay sustain release pattern. This can be used to delay and fade in vibrato and tremolo effects.

ARCHITECTURE TIPS AND RECOMMENDATIONS

For developers accustomed to playing hardware synthesizers, Web Audio provides a few challenges. Through building my Web Audio synthesizers, I have arrived at some general architecture tips that I think will be useful to others.

Use a flat JSON object to store the values of parameters. This makes it easy to debug, modify, and change sounds, and it's nice to see at a glance what is happening. I recommend using simple values in presets (0-1 is a common range in TANGUY and EVE), and taking those values from HTML5 range inputs. Mathematical operations happen elsewhere in the JavaScript using the values without changing them. This makes it easy to keep the UI synchronized.

Create CustomEvents and use a Pub/Sub pattern to simulate the workings of hardware synthesizers. When the user plays a key on a hardware synthesizer, all of the envelopes are triggered accordingly and it's much easier to maintain that logic in smaller components than in one gigantic "keyboardOn" style function.

Consider placing a GainNode between each connection, and using multiple GainNodes connected to another GainNode to be used as a mixer. Doing so will give you more flexibility for fine tuning the depths of modulation and the relative amplitudes of your sources.

Remember the UI does not need to reflect all of the possible operations that happen in the code. Feedback loops are permissible. Simplify the choices you're giving the user to only the most useful ones. Try providing one control that does many things. Do not be afraid to experiment.  
