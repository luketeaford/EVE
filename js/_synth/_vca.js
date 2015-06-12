EVE.vca = EVE.synth.createGain();
EVE.vca.gain.value = EVE.program.vca_g;
EVE.vca.connect(EVE.synth.destination);

// TODO Listen for the oscilloscope and connect to it when available
EVE.vca.connect(EVE.oscilloscope);
