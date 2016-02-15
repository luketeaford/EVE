window.AudioContext=window.AudioContext||window.webkitAudioContext;var EVE=new AudioContext;EVE=function(e){"use strict";return e.events={gateOff:new CustomEvent("gateoff",{bubbles:!0}),gateOn:new CustomEvent("gateon",{bubbles:!0}),updateHarmonicOscillator:new CustomEvent("updateharmonicoscillator",{bubbles:!0}),updateLfo1:new CustomEvent("updatelfo1",{bubbles:!0}),updateLfo2:new CustomEvent("updatelfo2",{bubbles:!0}),updatePerformance:new CustomEvent("updateperformance",{bubbles:!0}),updateTimbreEg:new CustomEvent("updatetimbreeg",{bubbles:!0}),updateTimbreEnv:new CustomEvent("updatetimbreenv",{bubbles:!0}),updateVca:new CustomEvent("updatevca",{bubbles:!0})},e}(EVE),EVE=function(e){"use strict";return e.config={egMax:2.125,egMin:.05,masterFreq:440},e}(EVE),EVE=function(e){"use strict";return e.preset={name:"INIT",osc1:1,osc2:0,osc3:0,osc4:0,osc5:0,osc6:0,osc7:0,osc8:0,osc1_eg:0,osc2_eg:0,osc3_eg:0,osc4_eg:0,osc5_eg:0,osc6_eg:0,osc7_eg:0,osc8_eg:0,timbre_a:0,timbre_d:.125,timbre_s:0,timbre_r:.125,lfo1_rate:1,lfo1_range:20,lfo1_type:"sine",osc1_lfo:0,osc2_lfo:0,osc3_lfo:0,osc4_lfo:0,osc5_lfo:0,osc6_lfo:0,osc7_lfo:0,osc8_lfo:0,lfo2_rate:3,lfo2_type:"sine",lfo2_amp:0,lfo2_pitch:0,lfo2_d:0,lfo2_a:0,lfo2_r:1e-4,lfo2_g:0,vca_a:0,vca_d:.1,vca_s:0,vca_r:.1,vca_g:0,glide:1e-6},e}(EVE),EVE=function(e){"use strict";var t=2048,o=document.getElementById("scope"),a=o.getContext("2d"),n="rgb(53, 56, 55)",c=new Uint8Array(t);return e.oscilloscope=e.createAnalyser(),function r(){var o,s,l,i=300/t,u=0;for(window.requestAnimationFrame(r),a.clearRect(0,0,300,150),a.lineWidth=2,a.strokeStyle=n,a.beginPath(),e.oscilloscope.getByteTimeDomainData(c),o=0;t>o;o+=1)s=c[o]/128,l=150*s/2,0===o?a.moveTo(u,l):a.lineTo(u,l),u+=i;a.lineTo(300,75),a.stroke()}(),e}(EVE),EVE=function(e){"use strict";var t=!0;return e.vca=e.createGain(),e.vca.gain.value=e.preset.vca_g,e.vca.connect(e.destination),e.vca.connect(e.oscilloscope),e.vca.attack=document.getElementById("vca-a"),e.vca.decay=document.getElementById("vca-d"),e.vca.sustain=document.getElementById("vca-s"),e.vca.release=document.getElementById("vca-r"),e.vca.gateOn=function(){t&&console&&console.log("Begin attack stage - custom gateOn")},e.vca.gateOff=function(){t&&console&&console.log("Begin release stage - custom gateOff")},e.vca.update=function(o){var a;o.target&&o.target.dataset&&o.target.dataset.program&&(a=o.target.dataset.program),"vca_g"===a&&e.vca.gain.setValueAtTime(e.preset.vca_g,e.now()),t&&console&&console.log(a,e.preset[a])},document.addEventListener("updatevca",e.vca.update),document.addEventListener("gateon",e.vca.gateOn),document.addEventListener("gateoff",e.vca.gateOff),e}(EVE),EVE=function(e){"use strict";var t,o;for(e.harmonicOscillator={debug:!0,inputs:document.querySelectorAll("#harmonic-oscillator input"),update:function(t){var o;t.target&&t.target.dataset&&t.target.dataset.program&&(o=t.target.dataset.program),e.harmonicOscillator.debug&&console&&console.log(o,e.preset[o]),e.harmonicOscillator[o].vca.gain.setValueAtTime(e.preset[o],e.now())}},e.harmonicOscillator.mixer=e.createGain(),e.harmonicOscillator.mixer.gain.value=-1,t=1;8>=t;t+=1)o="osc"+t,e.harmonicOscillator[o]=e.createOscillator(),e.harmonicOscillator[o].frequency.value=e.config.masterFreq*t,e.harmonicOscillator[o].type="sine",e.harmonicOscillator[o].vca=e.createGain(),e.harmonicOscillator[o].vca.gain.value=e.preset[o],e.harmonicOscillator[o].connect(e.harmonicOscillator[o].vca),e.harmonicOscillator[o].vca.connect(e.harmonicOscillator.mixer),e.harmonicOscillator.mixer.connect(e.vca);return e}(EVE),EVE=function(e){"use strict";var t,o,a;for(e.lfo1=e.createOscillator(),e.lfo1.frequency.value=e.preset.lfo1_rate,e.lfo1.type=e.preset.lfo1_type,t=1;8>=t;t+=1)a="osc"+t,o=a+"_lfo",e[o]=e.createGain(),e[o].gain.value=e.preset[o],e.lfo1.connect(e[o]),e[o].connect(e.harmonicOscillator[a].vca.gain);return e.lfo1.debug=!0,e.lfo1.scope=document.getElementById("lfo1"),e.lfo1.sine=document.getElementById("lfo1-sin"),e.lfo1.square=document.getElementById("lfo1-sqr"),e.lfo1.tri=document.getElementById("lfo1-tri"),e.lfo1.saw=document.getElementById("lfo1-saw"),e.lfo1.low=document.getElementById("lfo1-low"),e.lfo1.mid=document.getElementById("lfo1-mid"),e.lfo1.high=document.getElementById("lfo1-high"),e.lfo1.track=document.getElementById("lfo1-track"),e.lfo1.rate=document.getElementById("lfo1-rate"),e.lfo1.oscInputs=document.querySelectorAll("#lfo1 .js-osc"),e.lfo1.update=function(t){var o;switch(t.target&&t.target.dataset&&t.target.dataset.program&&(o=t.target.dataset.program),e.lfo1.debug&&console&&console.log(o,e.preset[o]),o){case"lfo1_type":e.lfo1.type=e.preset.lfo1_type;break;case"lfo1_range":case"lfo1_rate":e.lfo1.frequency.setValueAtTime(e.preset.lfo1_rate*e.preset.lfo1_range,e.now());break;case"osc1_lfo":case"osc2_lfo":case"osc3_lfo":case"osc4_lfo":case"osc5_lfo":case"osc6_lfo":case"osc7_lfo":case"osc8_lfo":e[o].gain.setValueAtTime(e.preset[o],e.now());break;default:e.lfo1.debug&&console&&console.log("Unhandled LFO 1 update change")}},e}(EVE),EVE=function(e){"use strict";var t;for(e.lfo2=e.createOscillator(),e.lfo2.frequency.value=e.preset.lfo2_rate,e.lfo2.type=e.preset.lfo2_type,e.lfo2_amp=e.createGain(),e.lfo2_amp.gain.value=e.preset.lfo2_amp,e.lfo2_pitch=e.createGain(),e.lfo2_pitch.gain.value=e.preset.lfo2_pitch,e.lfo2_vca=e.createGain(),e.lfo2_vca.gain.value=0,e.lfo2.connect(e.lfo2_vca),e.lfo2_vca.connect(e.lfo2_amp),e.lfo2_vca.connect(e.lfo2_pitch),e.lfo2_amp.connect(e.harmonicOscillator.mixer.gain),t=1;8>=t;t+=1)e.lfo2_pitch.connect(e.harmonicOscillator["osc"+t].frequency);return e.preset.lfo1_track&&e.lfo2_pitch.connect(e.lfo1.frequency),e.lfo2.debug=!0,e.lfo2.max=40,e.lfo2.scope=document.getElementById("lfo2"),e.lfo2.sine=document.getElementById("lfo2-sin"),e.lfo2.square=document.getElementById("lfo2-sqr"),e.lfo2.saw=document.getElementById("lfo2-saw"),e.lfo2.tri=document.getElementById("lfo2-tri"),e.lfo2.rate=document.getElementById("lfo2-rate"),e.lfo2.amp=document.getElementById("lfo2-amp"),e.lfo2.pitch=document.getElementById("lfo2-pitch"),e.lfo2.delay=document.getElementById("lfo2-delay"),e.lfo2.attack=document.getElementById("lfo2-attack"),e.lfo2.release=document.getElementById("lfo2-release"),e.lfo2.gain=document.getElementById("lfo2-gain"),e.lfo2.update=function(t){var o;switch(t.target&&t.target.dataset&&t.target.dataset.program&&(o=t.target.dataset.program),e.lfo2.debug&&console&&console.log(o,e.preset[o]),o){case"lfo2_amp":e.lfo2_amp.gain.setValueAtTime(e.preset.lfo2_amp,e.now());break;case"lfo2_g":e.lfo2_vca.gain.setValueAtTime(e.preset.lfo2_g,e.now());break;case"lfo2_pitch":e.lfo2_pitch.gain.setValueAtTime(139*e.preset.lfo2_pitch,e.now());break;case"lfo2_rate":e.lfo2.frequency.setValueAtTime(e.preset.lfo2_rate*e.lfo2.max,e.now());break;case"lfo2_type":e.lfo2.type=e.preset.lfo2_type;break;default:e.lfo2.debug&&console&&console.log("Unhandled LFO 2 update change")}},e}(EVE),EVE=function(e){"use strict";return e.performance={debug:!0,glide:document.getElementById("glide"),update:function(t){var o;switch(t.target&&t.target.dataset&&t.target.dataset.program&&(o=t.target.dataset.program),e.performance.debug&&console&&console.log(o,e.preset[o]),o){case"glide":e.preset.glide=.165*e.preset.glide,e.performance.debug&&console&&console.log("Glide updated to",e.preset.glide);break;default:e.performance.debug&&console&&console.log("Unhandled performance update change")}}},e}(EVE),EVE=function(e){"use strict";return e.timbreEg={debug:!0,inputs:document.querySelectorAll("#timbre-eg input"),update:function(t){var o;t.target&&t.target.dataset&&t.target.dataset.program&&(o=t.target.dataset.program),e.timbreEg.debug&&console&&console.log(o,e.preset[o])}},e}(EVE),EVE=function(e){"use strict";return e.timbreEnv={debug:!0,attack:document.getElementById("timbre-a"),decay:document.getElementById("timbre-d"),sustain:document.getElementById("timbre-s"),release:document.getElementById("timbre-r"),update:function(t){var o;t.target&&t.target.dataset&&t.target.dataset.program&&(o=t.target.dataset.program),e.timbreEnv.debug&&console&&console.log(o,e.preset[o])}},e}(EVE),EVE=function(e){"use strict";var t,o=document.querySelectorAll("input[type=radio]");for(e.button={debug:!0,press:function(){var t=this.name,o="update_"+this.parentElement.parentElement.parentElement.dataset.update;e.preset[t]!==this.value&&(e.preset[t]="string"!=typeof this.value||isNaN(this.value-1)?this.value:parseFloat(this.value)),e.button.debug&&console&&console.log("Updating",o),this.dispatchEvent(EVE[o])}},t=0;t<o.length;t+=1)o[t].addEventListener("change",e.button.press);return e}(EVE),EVE=function(e){"use strict";return EVE.calculatePitch=function(t){var o=t.target?t.target.dataset.noteValue:t,a=1200*e.keyboard.octaveShift+parseFloat(o);return e.setPitch(a)},e.calculatePitch.debug=!0,e}(EVE),EVE=function(e){"use strict";var t,o,a,n,c=document.getElementsByClassName("shift-octave"),r=!1;for(e.keyboard={lights:document.querySelectorAll("#performance [data-light]"),octaveShift:0,scope:document.getElementById("keyboard"),shiftOctave:function(t){function o(){var t=e.keyboard.octaveShift+2;for(n=0;n<e.keyboard.lights.length;n+=1)e.keyboard.lights[n].dataset.light=n===t?"on":"off"}var a=e.keyboard.octaveShift,c=this.dataset?this.dataset.shift:t;(a>-2&&0>c||2>a&&c>0)&&(e.keyboard.octaveShift=a+parseFloat(c),o()),r&&console&&console.log(e.keyboard.octaveShift)},pressBus:function(t){switch(t.which){case 122:e.keyboard.shiftOctave(-1);break;case 120:e.keyboard.shiftOctave(1)}r&&console&&console.log("PRESS:",t.which)},downBus:function(n){switch(n.which){case 65:a=-2100;break;case 87:a=-2e3;break;case 83:a=-1900;break;case 69:a=-1800;break;case 68:a=-1700;break;case 70:a=-1600;break;case 84:a=-1500;break;case 71:a=-1400;break;case 89:a=-1300;break;case 72:a=-1200;break;case 85:a=-1100;break;case 74:a=-1e3;break;case 75:a=-900;break;case 79:a=-800;break;case 76:a=-700;break;case 80:a=-600;break;case 186:a=-500;break;case 222:a=-400;break;case 221:a=-300;break;case 192:console&&console.log(e.preset)}a&&t!==n.which&&(o||(t=n.which,o=!o,e.gate()),e.calculatePitch(a)),r&&console&&console.log("DOWN BUS",n.which)},upBus:function(n){n.which===t&&(t=void 0,o=!o,a=void 0,e.gate()),r&&console&&console.log("UP BUS",n.which)}},n=0;n<c.length;n+=1)c[n].addEventListener("click",e.keyboard.shiftOctave),c[n].addEventListener("touchstart",e.keyboard.shiftOctave);return document.addEventListener("keypress",e.keyboard.pressBus),document.addEventListener("keydown",e.keyboard.downBus),document.addEventListener("keyup",e.keyboard.upBus),e}(EVE),EVE=function(e){"use strict";return e.setPitch=function(t){var o;for(o=1;8>=o;o+=1)e.harmonicOscillator["osc"+o].detune.setTargetAtTime(t,e.now(),e.preset.glide);e.preset.lfo1_range>=440&&e.lfo1.detune.setValueAtTime(t,e.now(),e.preset.glide)},e}(EVE),EVE=function(e){"use strict";var t,o=document.querySelectorAll("input[type=range]");for(e.slider={debug:!0,grab:function(){var t=this.dataset.program,o="update"+this.parentElement.parentElement.parentElement.dataset.update,a="lin"===this.dataset.curve?1:this.value;e.preset[t]=this.value*a,e.slider.debug&&console&&console.log("Updating",o),this.dispatchEvent(e.events[o])}},t=0;t<o.length;t+=1)o[t].addEventListener("input",e.slider.grab);return e}(EVE),EVE=function(e){"use strict";return e.startSynth=function(){var t;for(t=1;8>=t;t+=1)e.harmonicOscillator["osc"+t].start(0);e.lfo1.start(0),e.lfo2.start(0),document.removeEventListener("click",e.startSynth),document.removeEventListener("keydown",e.startSynth),document.removeEventListener("mousedown",e.startSynth),document.removeEventListener("touchend",e.startSynth),e.startSynth=void 0},document.addEventListener("click",e.startSynth),document.addEventListener("keydown",e.startSynth),document.addEventListener("mousedown",e.startSynth),document.addEventListener("touchend",e.startSynth),e}(EVE),EVE=function(e){"use strict";return e.now=function(){return e.currentTime},e}(EVE),EVE=function(e){"use strict";var t=!1;return e.gate=function(){var o=t?"gateOff":"gateOn";t=!t,document.dispatchEvent(e.events[o])},e}(EVE);