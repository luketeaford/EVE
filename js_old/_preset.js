EVE.preset.cycle = function (n) {
    'use strict';
    var i = n && n < 0 ? -1 : 1,
        x = EVE.preset.number + i;

    if (x >= 0 && x <= EVE.preset.bank.length - 1) {
        EVE.preset.number = x;
    }

    console.log('EVE.preset.number = ', EVE.preset.number);
    console.log('PROGRAM:', EVE.preset.bank[EVE.preset.number]);

    return EVE.preset.load(i);
};

EVE.preset.cycleForward = EVE.preset.cycle.bind(null, 1);
EVE.preset.cycleBackward = EVE.preset.cycle.bind(null, -1);

(function bindProgramButtons() {
    'use strict';
    var nextPreset = document.getElementById('next-preset'),
        prevPreset = document.getElementById('prev-preset');

    nextPreset.addEventListener('click', EVE.preset.cycleForward);
    prevPreset.addEventListener('click', EVE.preset.cycleBackward);
    document.addEventListener('update_program', EVE.preset.update);
}());
