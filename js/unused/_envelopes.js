EVE = (function (module) {
    'use strict';
    var debug = true;

    module.attack = function (x) {
        if (debug && console) {
            console.log('Attack function used');
        }

        return EVE.now() + x;
    };

    return module;
}(EVE));
