EVE = (function (module) {
    'use strict';
    var bank = [
        'init',
        'cool-sci-fi-sound',
        'problematic-patch',
        'test-patch'
    ],
        cycleBackward,
        cycleForward,
        debug = true,
        displayName = document.getElementById('display-name'),
        nextPreset = document.getElementById('next-preset'),
        number = 0,
        numberOfPresets = bank.length - 1,
        prevPreset = document.getElementById('prev-preset');

    module.program = {
        cycle: function (n) {
            var i = n && n < 0 ? -1 : 1,
                x = number + i;

            if (x >= 0 && x <= numberOfPresets) {
                number = x;
            }
            // EXPERIMENT
            console.log('Preset number', number);
            console.log('PROGRAM:', bank[number]);

            return module.program.loadPreset(i);
        },

        loadPreset: function (index) {
            var ajax = new XMLHttpRequest();

            ajax.open('GET', '/presets/' + bank[index] + '.json', true);

            ajax.onload = function () {
                var data;

                if (ajax.status >= 200 && ajax.status < 400) {
                    data = JSON.parse(ajax.responseText);
                    module.preset = data;
                } else {
                    module.preset = module.defaultPreset;
                    if (debug && console) {
                        console.log('Error loading program');
                    }
                }
                document.dispatchEvent(module.events.loadPreset);
            };

            ajax.send();

            return;
        },

        load: function () {
            displayName.textContent = module.preset.name;
            return;
        }
    };

    cycleBackward = module.program.cycle.bind(null, -1);
    cycleForward = module.program.cycle.bind(null, 1);

    nextPreset.addEventListener('click', cycleForward);
    prevPreset.addEventListener('click', cycleBackward);
    document.addEventListener('loadpreset', module.program.load);

    return module;
}(EVE));
