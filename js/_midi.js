EVE = (function (module) {
    'use strict';
    var debug = false;

    if (navigator.requestMIDIAccess) {
        module.midi = {
            active: null,

            events: function () {
                var n = event.data[1];

                switch (event.data[0]) {
                case module.midi.messages.listen:
                    if (debug && console) {
                        console.log('MIDI listen');
                    }
                    break;
                case module.midi.messages.noteOn:
                    if (event.data[2] >= 1) {
                        if (module.midi.active === null) {
                            module.midi.active = n;
                            module.gate();
                        }
                        module.calculatePitch(null, module.midi.toCents(n));
                    } else {
                        // Cheap MIDI controller note off
                        if (module.midi.active === n) {
                            module.midi.active = null;
                            module.gate();
                        } else {
                            // Return to initial note (for legato playing)
                            module.calculatePitch(null, module.midi.toCents(module.midi.active));
                        }
                    }
                    module.midi.highlightKey(n);
                    break;
                case module.midi.messages.noteOff:
                    module.midi.active = null;
                    module.gate();
                    module.midi.highlightKey(n);
                    break;
                // NEEDS WORK, BUT IS A GOOD ROUGH DRAFT
                case module.midi.messages.volume:
                    module.preset.osc2 = (event.data[2] / 127) * (event.data[2] / 127);
                    module.harmonicOscillator.inputs[1].dispatchEvent(module.events.updateharmonicoscillator);
                    module.harmonicOscillator.inputs[1].value = Math.sqrt(module.preset.osc2);
                    console.log('Moving the volume slider', event.data[2]);
                    break;
                case module.midi.messages.bankSelect:
                    console.log('You have selected a new bank');
                    break;
                default:
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
                noteOn: 144,
                noteOff: 128,
                pitchWheel: 224,
                bankSelect: 192,
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
