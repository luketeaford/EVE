if (navigator.requestMIDIAccess) {

    EVE.midi = {
        active: null,
        debug: true,
        devices: [],
        messages: {
            listen: 254,
            noteOn: 144,
            noteOff: 128,
            pitchWheel: 224
        },

        getDevices: function () {
            'use strict';

            return navigator.requestMIDIAccess().then(function (midi) {
                var devices = [],
                    input,
                    inputs = midi.inputs.entries();

                for (input = inputs.next(); input && !input.done; input = inputs.next()) {
                    devices.push(input.value[1]);
                }

                if (EVE.midi.debug === true && console) {
                    console.log('Devices:', devices);
                }

                return devices;
            });
        }
    };

    EVE.midi.events = function (e) {
        'use strict';
        var n = e.data[1];

        switch (e.data[0]) {
        case EVE.midi.messages.listen:
            break;
        case EVE.midi.messages.noteOn:
            // Some MIDI controllers send 0 velocity intead of note off
            if (e.data[2] >= 1) {
                if (EVE.midi.active === null) {
                    EVE.midi.active = n;
                    EVE.gateOn();
                }
                // Send pitch for any loud note
                EVE.calculatePitch(EVE.midi.toCents(n));
            } else {
                // Cheap MIDI controller note off
                if (EVE.midi.active === n) {
                    EVE.midi.active = null;
                    EVE.gateOff();
                } else {
                    // Return to initial note
                    EVE.calculatePitch(EVE.midi.toCents(EVE.midi.active));
                }
            }
            break;
        case EVE.midi.messages.noteOff:
            console.log('Proper midi note off');
            EVE.midi.active = null;
            EVE.gateOff();
            break;
        case EVE.midi.messages.pitchWheel:
            console.log('EVE pitch wheel moved');
            break;
        default:
            console.log('Unrecognized MIDI event', e.data);
            break;
        }
    };

    EVE.midi.getDevices().then(function (devices) {
        'use strict';
        var i = 0;

        EVE.midi.devices = devices;

        for (i; i < devices.length; i += 1) {
            EVE.midi.devices[i].onmidimessage = EVE.midi.events;
        }
    });

    EVE.midi.toCents = function (midiNote) {
        'use strict';
        return 100 * (midiNote - 69);
    };

} else {
    if (EVE.midi.debug === true && console) {
        console.log('No Web MIDI support in your browser');
    }
}
