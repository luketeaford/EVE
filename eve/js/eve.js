window.AudioContext=window.AudioContext||window.webkitAudioContext;var EVE={config:{eg_minimum:.05,harmonics:8,masterFreq:440,octaveShift:0},synth:new AudioContext};!function(){"use strict";function e(){this.parentElement.dataset.state="open"===this.parentElement.dataset.state?"closed":"open"}var t,E=document.querySelectorAll("section > a");for(t=0;t<E.length;t+=1)E[t].addEventListener("click",e)}(),EVE=function(e){"use strict";return e.keyboard={scope:document.getElementById("keyboard")},e}(EVE),EVE.program={name:"INIT",osc1:1,osc2:0,osc3:0,osc4:0,osc5:0,osc6:0,osc7:0,osc8:0,osc1_eg:0,osc2_eg:0,osc3_eg:0,osc4_eg:0,osc5_eg:0,osc6_eg:0,osc7_eg:0,osc8_eg:0,timbre_a:0,timbre_d:.3,timbre_s:0,timbre_r:.3,lfo1_rate:4,lfo1_track:!1,lfo1_type:"square",osc1_lfo:0,osc2_lfo:0,osc3_lfo:0,osc4_lfo:0,osc5_lfo:0,osc6_lfo:0,osc7_lfo:0,osc8_lfo:0,lfo2_rate:3,lfo2_type:"sawtooth",lfo2_amp:0,lfo2_pitch:0,vca_a:0,vca_d:.25,vca_s:1,vca_r:.25,vca_g:0},EVE.now=function(){"use strict";return EVE.synth.currentTime},EVE.attack=function(e){"use strict";return EVE.now()+e},EVE.oscilloscope=EVE.synth.createAnalyser(),function(){"use strict";var e=2048,t=document.getElementById("scope"),E=t.getContext("2d"),o="rgb(53, 56, 55)",a=new Uint8Array(e);!function n(){var t,c,r,s=300/e,i=0;for(window.requestAnimationFrame(n),E.clearRect(0,0,300,150),E.lineWidth=2,E.strokeStyle=o,E.beginPath(),EVE.oscilloscope.getByteTimeDomainData(a),t=0;e>t;t+=1)c=a[t]/128,r=150*c/2,0===t?E.moveTo(i,r):E.lineTo(i,r),i+=s;E.lineTo(300,75),E.stroke()}()}(),EVE.vca=EVE.synth.createGain(),EVE.vca.gain.value=EVE.program.vca_g,EVE.vca.connect(EVE.synth.destination),EVE.vca.connect(EVE.oscilloscope),EVE.vca.debug=!0,EVE.vca.scope=document.getElementById("vca"),EVE.vca.update=function(e){"use strict";var t=e.target.dataset.program;switch(EVE.vca.debug&&console.log(t,EVE.program[t]),t){case"vca_a":case"vca_d":case"vca_s":case"vca_r":break;case"vca_g":EVE.vca.gain.setValueAtTime(EVE.program.vca_g,EVE.now())}},EVE.vca.scope.addEventListener("update_vca",EVE.vca.update),EVE.update_vca=new CustomEvent("update_vca",{bubbles:!0}),EVE.harmonicOsc={debug:!0,scope:document.getElementById("harmonics"),update:function(e){"use strict";var t=e.target.dataset.program;EVE.harmonicOsc.debug&&console.log(t,EVE.program[t]),EVE.harmonicOsc[t].vca.gain.setValueAtTime(EVE.program[t],EVE.now())}},function(){"use strict";var e,t;for(e=1;e<=EVE.config.harmonics;e+=1)t="osc"+e,EVE.harmonicOsc[t]=EVE.synth.createOscillator(),EVE.harmonicOsc[t].frequency.value=EVE.config.masterFreq*e,EVE.harmonicOsc[t].type="sine",EVE.harmonicOsc[t].vca=EVE.synth.createGain(),EVE.harmonicOsc[t].vca.gain.value=EVE.program[t],EVE.harmonicOsc[t].connect(EVE.harmonicOsc[t].vca),EVE.harmonicOsc[t].vca.connect(EVE.vca)}(),EVE.harmonicOsc.scope.addEventListener("update_harmonic_osc",EVE.harmonicOsc.update),EVE.update_harmonic_osc=new CustomEvent("update_harmonic_osc",{bubbles:!0}),EVE.timbreEg={debug:!0,scope:document.getElementById("timbre-eg"),update:function(e){"use strict";var t=e.target.dataset.program;EVE.timbreEg.debug&&console.log(t,EVE.program[t])}},EVE.timbreEg.scope.addEventListener("update_timbre_eg",EVE.timbreEg.update),EVE.update_timbre_eg=new CustomEvent("update_timbre_eg",{bubbles:!0}),EVE.timbreEnv={debug:!0,scope:document.getElementById("timbre-env"),update:function(e){"use strict";var t=e.target.dataset.program;EVE.timbreEnv.debug&&console.log(t,EVE.program[t])}},EVE.timbreEnv.scope.addEventListener("update_timbre_env",EVE.timbreEnv.update),EVE.update_timbre_env=new CustomEvent("update_timbre_env",{bubbles:!0}),function(){"use strict";var e,t,E;for(EVE.lfo1=EVE.synth.createOscillator(),EVE.lfo1.frequency.value=EVE.program.lfo1_rate,EVE.lfo1.type=EVE.program.lfo1_type,e=1;e<=EVE.config.harmonics;e+=1)E="osc"+e,t=E+"_lfo",EVE[t]=EVE.synth.createGain(),EVE[t].gain.value=EVE.program[t],EVE.lfo1.connect(EVE[t]),EVE[t].connect(EVE.harmonicOsc[E].vca.gain)}(),EVE.lfo1.debug=!0,EVE.lfo1.scope=document.getElementById("lfo1"),EVE.lfo1.update=function(e){"use strict";var t=e.target.dataset.program;EVE.lfo1.debug&&console.log(t,EVE.program[t]),"lfo1_rate"===t?EVE.lfo1.frequency.setValueAtTime(EVE.program.lfo1_rate*EVE.harmonicOsc.osc1.frequency.value,EVE.now()):EVE[t].gain.setValueAtTime(EVE.program[t],EVE.now())},EVE.lfo1.scope.addEventListener("update_lfo1",EVE.lfo1.update),EVE.update_lfo1=new CustomEvent("update_lfo1",{bubbles:!0}),EVE.lfo2={},function(){"use strict";var e;for(EVE.lfo2=EVE.synth.createOscillator(),EVE.lfo2.frequency.value=EVE.program.lfo2_rate,EVE.lfo2.type=EVE.program.lfo2_type,EVE.lfo2_amp=EVE.synth.createGain(),EVE.lfo2_amp.gain.value=EVE.program.lfo2_amp,EVE.lfo2_pitch=EVE.synth.createGain(),EVE.lfo2_pitch.gain.value=EVE.program.lfo2_pitch,EVE.lfo2.connect(EVE.lfo2_amp),EVE.lfo2.connect(EVE.lfo2_pitch),EVE.lfo2_amp.connect(EVE.vca.gain),e=1;e<EVE.config.harmonics;e+=1)EVE.lfo2_pitch.connect(EVE.harmonicOsc["osc"+e].frequency);EVE.program.lfo1_track&&EVE.lfo2_pitch.connect(EVE.lfo1.frequency)}(),function(){"use strict";function e(){var t;for(t=1;t<=EVE.config.harmonics;t+=1)EVE.harmonicOsc["osc"+t].start(0);EVE.lfo1.start(0),EVE.lfo2.start(0),document.removeEventListener("click",e),document.removeEventListener("dblclick",e),document.removeEventListener("keydown",e),document.removeEventListener("touchstart",e),document.removeEventListener("wheel",e)}document.addEventListener("click",e),document.addEventListener("dblclick",e),document.addEventListener("keydown",e),document.addEventListener("touchstart",e),document.addEventListener("wheel",e)}(),EVE.slider={debug:!0,grab:function(){"use strict";var e=this.dataset.program,t="update_"+this.parentElement.parentElement.dataset.update,E="lin"===this.dataset.curve?1:this.value;EVE.program[e]=this.value*E,EVE.slider.debug&&console.log("Updating",t),this.dispatchEvent(EVE[t])}},function(){"use strict";var e,t=document.querySelectorAll("input[type=range]");for(e=0;e<t.length;e+=1)t[e].addEventListener("input",EVE.slider.grab)}(),EVE.calculatePitch=function(e){"use strict";var t;for(t=1;t<=EVE.config.harmonics;t+=1)EVE.harmonicOsc["osc"+t].detune.setValueAtTime(e,EVE.now());console.log("note",e)},EVE.setPitch=function(e){"use strict";var t;for(t=1;t<=EVE.config.harmonics;t+=1)EVE.harmonicOsc["osc"+t].detune.setValueAtTime(e,EVE.now());return EVE.program.lfo1_track&&EVE.lfo1.detune.setValueAtTime(e,EVE.now()),console.log("Fool JSLint",e),"Should include portamento and staccato options"},EVE.gateOn=function(e){"use strict";var t,E,o,a,n=EVE.synth.currentTime+EVE.program.vca_a+EVE.config.eg_minimum;for(E=1;E<=EVE.config.harmonics;E+=1)t=EVE.program["osc"+E+"_eg"],o=EVE.program["osc"+E],a=EVE.harmonicOsc["osc"+E].vca,a.gain.setTargetAtTime(o,EVE.now(),.1),a.gain.linearRampToValueAtTime(o+t,EVE.now()+EVE.program.timbre_a+EVE.config.eg_minimum),a.gain.setTargetAtTime(o+t*EVE.program.timbre_s,EVE.now()+EVE.program.timbre_a+EVE.config.eg_minimum,EVE.program.timbre_d);return EVE.vca.gain.setTargetAtTime(EVE.program.vca_g,EVE.now(),.1),EVE.vca.gain.linearRampToValueAtTime(1,n),EVE.vca.gain.setTargetAtTime(EVE.program.vca_s+EVE.program.vca_g,n,EVE.program.vca_d),EVE.calculatePitch(e.target.dataset.noteValue)},EVE.keyboard.scope.addEventListener("mousedown",EVE.gateOn),EVE.keyboard.scope.addEventListener("touchstart",EVE.gateOn),EVE.gateOff=function(){"use strict";var e,t,E,o=EVE.vca.gain.value;for(E=1;E<=EVE.config.harmonics;E+=1)t=EVE.harmonicOsc["osc"+E].vca,t.gain.cancelScheduledValues(EVE.now()),e=t.gain.value,t.gain.setValueAtTime(e,EVE.now()),t.gain.setTargetAtTime(EVE.program["osc"+E],EVE.now(),EVE.program.timbre_r);EVE.vca.gain.cancelScheduledValues(EVE.synth.currentTime),EVE.vca.gain.setValueAtTime(o,EVE.synth.currentTime),EVE.vca.gain.setTargetAtTime(EVE.program.vca_g,EVE.synth.currentTime,EVE.program.vca_r)},EVE.keyboard.scope.addEventListener("mouseup",EVE.gateOff),EVE.keyboard.scope.addEventListener("touchend",EVE.gateOff);