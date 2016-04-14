var EVE = {};

EVE = (function (module) {
    'use strict';
    var promptNecessary = !!(!window.AudioContext && window.webkitAudioContext);

    window.AudioContext = window.AudioContext || window.webkitAudioContext;

    module = new AudioContext();

    module.promptNecessary = promptNecessary;

    return module;
}(EVE));
