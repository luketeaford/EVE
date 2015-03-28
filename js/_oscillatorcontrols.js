// These are all essentially the same
EVE.update_osc1 = function () {
    'use strict';
    return EVE.osc1_vca.gain.setValueAtTime(EVE.program.osc1 * EVE.program.osc1, EVE.synth.currentTime);
};

EVE.update_osc2 = function () {
    'use strict';
    return EVE.osc2_vca.gain.setValueAtTime(EVE.program.osc2 * EVE.program.osc2, EVE.synth.currentTime);
};

EVE.update_osc3 = function () {
    'use strict';
    return EVE.osc3_vca.gain.setValueAtTime(EVE.program.osc3 * EVE.program.osc3, EVE.synth.currentTime);
};

EVE.update_osc4 = function () {
    'use strict';
    return EVE.osc4_vca.gain.setValueAtTime(EVE.program.osc4 * EVE.program.osc4, EVE.synth.currentTime);
};

EVE.update_osc5 = function () {
    'use strict';
    return EVE.osc5_vca.gain.setValueAtTime(EVE.program.osc5 * EVE.program.osc5, EVE.synth.currentTime);
};

EVE.update_osc6 = function () {
    'use strict';
    return EVE.osc6_vca.gain.setValueAtTime(EVE.program.osc6 * EVE.program.osc6, EVE.synth.currentTime);
};

EVE.update_osc7 = function () {
    'use strict';
    return EVE.osc7_vca.gain.setValueAtTime(EVE.program.osc7 * EVE.program.osc7, EVE.synth.currentTime);
};

EVE.update_osc8 = function () {
    'use strict';
    return EVE.osc8_vca.gain.setValueAtTime(EVE.program.osc8 * EVE.program.osc8, EVE.synth.currentTime);
};
