if (navigator.requestMIDIAccess) {

    EVE.midi = {
        debug: true,
        messages: {
            listen: 254,
            note_on: 144,
            note_off: 128,
            pitch: 224
        },

        devices: [],

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

    EVE.midi.events = function (event) {
        'use strict';
        //var n = event.data[1];

        switch (event.data[0]) {
        case EVE.midi.messages.listen:
            break;
        case EVE.midi.messages.note_on:
            // Some MIDI controllers send 0 velocity intead of note_off
            if (event.data[2] >= 1) {
                EVE.gateOn(event, EVE.midi.toCents(event.data[1]));
            } else {
                // Cheap MIDI controller note_off
                EVE.gateOff(event);
            }
            break;
        case EVE.midi.messages.note_off:
            EVE.gateOff(event);
            break;
        case EVE.midi.messages.pitch:
            console.log('EVE pitch wheel moved');
            break;
        default:
            console.log('Unrecognized MIDI event', event.data);
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
