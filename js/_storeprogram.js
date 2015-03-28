EVE.store_program = function (e) {
    'use strict';

    EVE.program[e.data.program] = parseFloat(e.currentTarget.value);

    if (EVE[e.data.update]) {
        return EVE[e.data.update]();
    }

    return;
};
