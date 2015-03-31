EVE.gate_off = function () {
    'use strict';
    EVE.playing.pop();// Make sure this always makes sense
    if (EVE.playing.length) {
        var n = EVE.playing.sort()[EVE.playing.length - 1],
            note_value = 100 * (n % 12) - 900;
        EVE.set_pitch(note_value);
    } else {
        EVE.amp_env_off();
    }
};

EVE.amp_env_off = function () {
    'use strict';
    // Prevent decay from acting like second attack
    EVE.vca.gain.cancelScheduledValues(EVE.synth.currentTime);
    EVE.amp_release();
};

EVE.amp_release = function () {
    'use strict';
    var vca_release_peak = EVE.vca.gain.value;

    // Set starting point
    EVE.vca.gain.setValueAtTime(vca_release_peak, EVE.synth.currentTime);

    // Release
    EVE.vca.gain.setTargetAtTime(EVE.program.get('vca_g'), EVE.synth.currentTime, EVE.program.get('vca_r'));
};
