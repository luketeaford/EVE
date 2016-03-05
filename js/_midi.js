EVE = (function (module) {
    'use strict';
    var debug = true;

    if (navigator.requestMIDIAccess) {
        module.midi = {
            active: null,

            events: function (e) {
                var n = e.data[1];

                switch (e.data[0]) {
                case module.midi.messages.noteOn:
                    if (e.data[2] >= 1) {
                        if (module.midi.active === null) {
                            module.midi.active = n;
                            module.gate();
                        }
                        module.calculatePitch(module.midi.toCents(n));
                    } else {
                        // Cheap MIDI controller note off
                        if (module.midi.active === n) {
                            module.midi.active = null;
                            module.gate();
                        } else {
                            // Return to initial note (for legato playing)
                            module.calculatePitch(module.midi.toCents(module.midi.active));
                        }
                    }
                    break;
                case module.midi.messages.noteOff:
                    module.midi.active = null;
                    module.gate();
                    break;
                default:
                    if (debug && console) {
                        console.log('Unsupported MIDI event', e.data);
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

            messages: {
                noteOn: 144,
                noteOff: 128,
                pitchWheel: 224
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
