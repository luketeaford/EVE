EVE.load_program = function (patch) {
    'use strict';
    var patch_url = encodeURI('programs/') + patch + '.json';
    $.getJSON(decodeURI(patch_url), function (loaded) {
        EVE.program = loaded;
        EVE.program_number = EVE.urls.indexOf(patch);
        return EVE.update_program();
    }).fail(function () {
        EVE.program = {
            "name": "Default",

            "osc1": 0,
            "osc2": 0,
            "osc3": 0,
            "osc4": 0,
            "osc5": 0,
            "osc6": 0,
            "osc7": 0,
            "osc8": 0,

            "vca_attack": 0.1,
            "vca_decay": 0.1,
            "vca_sustain": 1,
            "vca_release": 0.1,
            "vca_gain": 0,
        };
        EVE.update_program();
        return;
    });
};
