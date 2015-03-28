EVE.gate_on = function (e) {
    'use strict';
    var n,
        note_value,
        i = 0;

    // This could be clearer by testing for EVE.legato or EVE.staccato
    if (EVE.playing.length === 0 || EVE.legato === false) {
        EVE.amp_env_on();
    }

    if (this.getAttribute) {
        // Notes coming from qwerty or touch
        // Not the best way to use data attributes
        note_value = parseFloat(this.getAttribute('data-note-value'));
        // might be wrong
        n = ((note_value + 900) / 100) + 60;
    } else {
        // Notes coming from MIDI
        n = e.data[i];
        note_value = 100 * (n % 12) - 900;
    }

    // Prevent duplicate notes
    if (EVE.playing.indexOf(n) === -1) {
        EVE.playing.push(n);
    }

    EVE.set_pitch(note_value);

};

EVE.amp_env_on = function () {
    'use strict';
    // Set starting point - Exponential fade out
    EVE.vca.gain.setTargetAtTime(EVE.program.vca_g, EVE.synth.currentTime, 0.05);
    EVE.amp_attack();
};

EVE.amp_attack = function () {
    'use strict';
    var vca_end_of_attack = EVE.synth.currentTime + EVE.program.vca_a;

    // Attack
    EVE.vca.gain.linearRampToValueAtTime(1, vca_end_of_attack);

    // Decay
    EVE.vca.gain.setTargetAtTime(EVE.program.vca_s + EVE.program.vca_g, vca_end_of_attack, EVE.program.vca_d);
};
