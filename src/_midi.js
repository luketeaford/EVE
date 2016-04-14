EVE = (function (module) {
    'use strict';
    var debug = true,
        lfo2Gain = document.querySelector('[data-program=lfo2_g]'),
        pitchBendOffset = 64,
        z;

    if (navigator.requestMIDIAccess) {
        module.midi = {
            active: null,

            events: function () {
                var a = event.data[0],
                    b = event.data[1],
                    c = event.data[2],
                    n = event.data[1];

                switch (a) {
                case module.midi.messages.listen:
                    if (debug && console) {
                        console.log('MIDI listen');
                    }
                    break;
                case module.midi.messages.modWheel:
                    if (event.data[1] === 1) {
                        module.preset.lfo2_g = Math.pow(event.data[2] / 127, 2);
                        module.lfo2_vca.gain.setTargetAtTime(module.preset.lfo2_g, module.now(), 0.1);
                        lfo2Gain.value = Math.sqrt(module.preset.lfo2_g);
                        if (debug && console) {
                            console.log('Moving the modwheel!');
                        }
                    }
                    break;
                case module.midi.messages.noteOn:
                    if (event.data[2] >= 1) {
                        if (module.midi.active === null) {
                            module.midi.active = n;
                            module.gate(event);
                        }
                        module.calculatePitch(null, module.midi.toCents(n));
                    } else {
                        // Cheap MIDI controller note off
                        if (module.midi.active === n) {
                            module.midi.active = null;
                            module.gate(event);
                        } else {
                            // Return to initial note (for legato playing)
                            module.calculatePitch(null, module.midi.toCents(module.midi.active));
                        }
                    }
                    module.midi.highlightKey(n);
                    break;
                case module.midi.messages.noteOff:
                    module.midi.active = null;
                    module.gate(event);
                    module.midi.highlightKey(n);
                    break;
                case module.midi.messages.pitchWheel:
                    z = b ? 1 : 0;

                    module.performance.pitchBend = (z + c - pitchBendOffset) / pitchBendOffset * module.config.pitchBendRange;

                    document.dispatchEvent(module.events.pitchbend);
                    break;
                default:
                    debug = true;
                    if (debug && console) {
                        console.log('Unsupported MIDI event', event.data);
                    }
                    break;
                }
            },

            getDevices: function () {
                return navigator.requestMIDIAccess().then(function (MIDI) {
                    var devices = [],
                        input,
                        inputs = MIDI.inputs.entries();

                    for (input = inputs.next(); input && !input.done; input = inputs.next()) {
                        devices.push(input.value[1]);
                    }

                    if (debug && console) {
                        console.log('Available devices:', devices);
                    }

                    return devices;
                });
            },

            highlightKey: function (note) {
                var key = note - 48;

                if (key > -1 && key < module.keyboard.keys.length) {
                    module.keyboard.keys[key].dataset.active =
                        module.keyboard.keys[key].dataset.active === 'false' ?
                                'true' :
                                'false';
                }

                return;
            },

            messages: {
                bankSelect: 192,
                modWheel: 176,// 176, 1, 0-127
                noteOn: 144,
                noteOff: 128,
                pitchWheel: 224,
                volumeX: 176
            },

            toCents: function (midiNote) {
                return 100 * (midiNote - 69);
            }
        };

        module.midi.getDevices().then(function (devices) {
            var i = 0;

            module.midi.devices = devices;

            for (i; i < devices.length; i += 1) {
                module.midi.devices[i].onmidimessage = module.midi.events;
            }
        });
    } else {
        if (debug && console) {
            console.log('No MIDI available');
        }
    }

    return module;
}(EVE));
