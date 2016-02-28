window.AudioContext=window.AudioContext||window.webkitAudioContext;var EVE=new AudioContext;EVE=function(e){"use strict";return e.events={gateOff:new CustomEvent("gateoff",{bubbles:!0}),gateOn:new CustomEvent("gateon",{bubbles:!0}),updateHarmonicOscillator:new CustomEvent("updateharmonicoscillator",{bubbles:!0}),updateLfo1:new CustomEvent("updatelfo1",{bubbles:!0}),updateLfo2:new CustomEvent("updatelfo2",{bubbles:!0}),updatePerformance:new CustomEvent("updateperformance",{bubbles:!0}),updateTimbreEg:new CustomEvent("updatetimbreeg",{bubbles:!0}),updateTimbreEnv:new CustomEvent("updatetimbreenv",{bubbles:!0}),updateVca:new CustomEvent("updatevca",{bubbles:!0})},e}(EVE),EVE=function(e){"use strict";return e.config={egMax:2.125,egMin:.025,glideMax:.165,glideMin:1e-4,lfo2Max:139,masterFreq:440},e}(EVE),EVE=function(e){"use strict";return e.preset={name:"INIT",osc1:1,osc2:0,osc3:0,osc4:0,osc5:0,osc6:0,osc7:0,osc8:0,osc1_eg:0,osc2_eg:0,osc3_eg:0,osc4_eg:0,osc5_eg:0,osc6_eg:0,osc7_eg:0,osc8_eg:0,timbre_a:0,timbre_d:.125,timbre_s:.5,timbre_r:.125,lfo1_rate:1,lfo1_range:20,lfo1_type:"sine",osc1_lfo:0,osc2_lfo:0,osc3_lfo:0,osc4_lfo:0,osc5_lfo:0,osc6_lfo:0,osc7_lfo:0,osc8_lfo:0,lfo2_rate:3,lfo2_type:"sine",lfo2_amp:0,lfo2_pitch:0,lfo2_delay:0,lfo2_a:0,lfo2_r:1e-4,lfo2_g:0,vca_a:0,vca_d:.1,vca_s:.5,vca_r:.1,vca_g:0,glide:1e-5},e}(EVE),EVE=function(e){"use strict";var t=2048,a=document.getElementById("scope"),o=a.getContext("2d"),n="rgb(53, 56, 55)",c=new Uint8Array(t);return e.oscilloscope=e.createAnalyser(),function r(){var a,s,l,i=300/t,d=0;for(window.requestAnimationFrame(r),o.clearRect(0,0,300,150),o.lineWidth=2,o.strokeStyle=n,o.beginPath(),e.oscilloscope.getByteTimeDomainData(c),a=0;t>a;a+=1)s=c[a]/128,l=150*s/2,0===a?o.moveTo(d,l):o.lineTo(d,l),d+=i;o.lineTo(300,75),o.stroke()}(),e}(EVE),EVE=function(e){"use strict";var t=!1;return e.vca=e.createGain(),e.vca.gain.value=e.preset.vca_g,e.vca.connect(e.destination),e.vca.connect(e.oscilloscope),e.vca.attack=document.getElementById("vca-a"),e.vca.decay=document.getElementById("vca-d"),e.vca.sustain=document.getElementById("vca-s"),e.vca.release=document.getElementById("vca-r"),e.vca.gateOn=function(){var a=e.now()+e.preset.vca_a*e.config.egMax+e.config.egMin;e.vca.gain.cancelScheduledValues(0),e.vca.gain.setTargetAtTime(e.preset.vca_g,e.now(),.1),e.vca.gain.linearRampToValueAtTime(1,a),e.vca.gain.setTargetAtTime(e.preset.vca_s+e.preset.vca_g,a,e.preset.vca_d*e.config.egMax),t&&console&&console.log("Begin attack stage - custom gateOn")},e.vca.gateOff=function(){var a=e.vca.gain.value;e.vca.gain.cancelScheduledValues(0),e.vca.gain.setValueAtTime(a,e.now()),e.vca.gain.setTargetAtTime(e.preset.vca_g,e.now(),e.preset.vca_r*e.config.egMax+e.config.egMin),t&&console&&console.log("Begin release stage - custom gateOff")},e.vca.update=function(a){var o;a.target&&a.target.dataset&&a.target.dataset.program&&(o=a.target.dataset.program),"vca_g"===o&&e.vca.gain.setValueAtTime(e.preset.vca_g,e.now()),t&&console&&console.log(o,e.preset[o])},document.addEventListener("updatevca",e.vca.update),document.addEventListener("gateon",e.vca.gateOn),document.addEventListener("gateoff",e.vca.gateOff),e}(EVE),EVE=function(e){"use strict";var t,a,o=!1;for(e.harmonicOscillator={inputs:document.querySelectorAll("#harmonic-oscillator input"),update:function(t){var a;t.target&&t.target.dataset&&t.target.dataset.program&&(a=t.target.dataset.program),e.harmonicOscillator[a].vca.gain.setValueAtTime(e.preset[a],e.now()),o&&console&&console.log(a,e.preset[a])}},e.harmonicOscillator.mixer=e.createGain(),e.harmonicOscillator.mixer.gain.value=-1,t=1;8>=t;t+=1)a="osc"+t,e.harmonicOscillator[a]=e.createOscillator(),e.harmonicOscillator[a].frequency.value=e.config.masterFreq*t,e.harmonicOscillator[a].type="sine",e.harmonicOscillator[a].vca=e.createGain(),e.harmonicOscillator[a].vca.gain.value=e.preset[a],e.harmonicOscillator[a].connect(e.harmonicOscillator[a].vca),e.harmonicOscillator[a].vca.connect(e.harmonicOscillator.mixer),e.harmonicOscillator.mixer.connect(e.vca);return document.addEventListener("updateharmonicoscillator",e.harmonicOscillator.update),e}(EVE),EVE=function(e){"use strict";var t,a,o,n=!1;for(e.lfo1=e.createOscillator(),e.lfo1.frequency.value=e.preset.lfo1_rate,e.lfo1.type=e.preset.lfo1_type,t=1;8>=t;t+=1)o="osc"+t,a=o+"_lfo",e[a]=e.createGain(),e[a].gain.value=e.preset[a],e.lfo1.connect(e[a]),e[a].connect(e.harmonicOscillator[o].vca.gain);return e.lfo1.scope=document.getElementById("lfo1"),e.lfo1.sine=document.getElementById("lfo1-sin"),e.lfo1.square=document.getElementById("lfo1-sqr"),e.lfo1.tri=document.getElementById("lfo1-tri"),e.lfo1.saw=document.getElementById("lfo1-saw"),e.lfo1.low=document.getElementById("lfo1-low"),e.lfo1.mid=document.getElementById("lfo1-mid"),e.lfo1.high=document.getElementById("lfo1-high"),e.lfo1.track=document.getElementById("lfo1-track"),e.lfo1.rate=document.getElementById("lfo1-rate"),e.lfo1.oscInputs=document.querySelectorAll("#lfo1 .js-osc"),e.lfo1.update=function(t){var a;switch(t.target&&t.target.dataset&&t.target.dataset.program&&(a=t.target.dataset.program),a){case"lfo1_type":e.lfo1.type=e.preset.lfo1_type;break;case"lfo1_range":case"lfo1_rate":e.lfo1.frequency.setValueAtTime(e.preset.lfo1_rate*e.preset.lfo1_range,e.now());break;case"osc1_lfo":case"osc2_lfo":case"osc3_lfo":case"osc4_lfo":case"osc5_lfo":case"osc6_lfo":case"osc7_lfo":case"osc8_lfo":e[a].gain.setValueAtTime(e.preset[a],e.now());break;default:n&&console&&console.log("Unhandled LFO 1 update change")}n&&console&&console.log(a,e.preset[a])},document.addEventListener("updatelfo1",e.lfo1.update),e}(EVE),EVE=function(e){"use strict";var t,a=!1;for(e.lfo2=e.createOscillator(),e.lfo2.frequency.value=e.preset.lfo2_rate,e.lfo2.type=e.preset.lfo2_type,e.lfo2_amp=e.createGain(),e.lfo2_amp.gain.value=e.preset.lfo2_amp,e.lfo2_pitch=e.createGain(),e.lfo2_pitch.gain.value=e.preset.lfo2_pitch,e.lfo2_vca=e.createGain(),e.lfo2_vca.gain.value=0,e.lfo2.connect(e.lfo2_vca),e.lfo2_vca.connect(e.lfo2_amp),e.lfo2_vca.connect(e.lfo2_pitch),e.lfo2_amp.connect(e.harmonicOscillator.mixer.gain),t=1;8>=t;t+=1)e.lfo2_pitch.connect(e.harmonicOscillator["osc"+t].frequency);return e.preset.lfo1_track&&e.lfo2_pitch.connect(e.lfo1.frequency),e.lfo2.scope=document.getElementById("lfo2"),e.lfo2.sine=document.getElementById("lfo2-sin"),e.lfo2.square=document.getElementById("lfo2-sqr"),e.lfo2.saw=document.getElementById("lfo2-saw"),e.lfo2.tri=document.getElementById("lfo2-tri"),e.lfo2.rate=document.getElementById("lfo2-rate"),e.lfo2.amp=document.getElementById("lfo2-amp"),e.lfo2.pitch=document.getElementById("lfo2-pitch"),e.lfo2.delay=document.getElementById("lfo2-delay"),e.lfo2.attack=document.getElementById("lfo2-attack"),e.lfo2.release=document.getElementById("lfo2-release"),e.lfo2.gain=document.getElementById("lfo2-gain"),e.lfo2.gateOff=function(){e.lfo2_vca.gain.cancelScheduledValues(e.now()),e.lfo2_vca.gain.setValueAtTime(e.lfo2_vca.gain.value,e.now()),e.lfo2_vca.gain.setTargetAtTime(e.preset.lfo2_g,e.now(),e.preset.lfo2_r)},e.lfo2.gateOn=function(){e.lfo2_vca.gain.cancelScheduledValues(0),e.lfo2_vca.gain.setTargetAtTime(e.preset.lfo2_g,e.now(),.1),e.lfo2_vca.gain.setTargetAtTime(1,e.now()+e.preset.lfo2_delay*e.config.egMax,e.preset.lfo2_a*e.config.egMax+e.config.egMin)},e.lfo2.update=function(t){var o;switch(t.target&&t.target.dataset&&t.target.dataset.program&&(o=t.target.dataset.program),a&&console&&console.log(o,e.preset[o]),o){case"lfo2_amp":e.lfo2_amp.gain.setValueAtTime(e.preset.lfo2_amp,e.now());break;case"lfo2_g":e.lfo2_vca.gain.setValueAtTime(e.preset.lfo2_g,e.now());break;case"lfo2_pitch":e.lfo2_pitch.gain.setValueAtTime(e.preset.lfo2_pitch*e.config.lfo2Max,e.now());break;case"lfo2_rate":e.lfo2.frequency.setValueAtTime(e.preset.lfo2_rate*e.config.lfo2Max,e.now());break;case"lfo2_type":e.lfo2.type=e.preset.lfo2_type;break;default:a&&console&&console.log("Unhandled LFO 2 update change")}},document.addEventListener("updatelfo2",e.lfo2.update),document.addEventListener("gateon",e.lfo2.gateOn),document.addEventListener("gateoff",e.lfo2.gateOff),e}(EVE),EVE=function(e){"use strict";var t=!1;return e.performance={glide:document.getElementById("glide"),update:function(a){var o;switch(a.target&&a.target.dataset&&a.target.dataset.program&&(o=a.target.dataset.program),t&&console&&console.log(o,e.preset[o]),o){case"glide":e.preset.glide=e.preset.glide*e.config.glideMax+e.config.glideMin}}},document.addEventListener("updateperformance",e.performance.update),e}(EVE),EVE=function(e){"use strict";var t=!1;return e.timbreEg={inputs:document.querySelectorAll("#timbre-eg input"),update:function(a){var o;a.target&&a.target.dataset&&a.target.dataset.program&&(o=a.target.dataset.program),t&&console&&console.log(o,e.preset[o])}},document.addEventListener("updatetimbreeg",e.timbreEg.update),e}(EVE),EVE=function(e){"use strict";var t=!0;return e.timbreEnv={attack:document.getElementById("timbre-a"),decay:document.getElementById("timbre-d"),sustain:document.getElementById("timbre-s"),release:document.getElementById("timbre-r"),gateOn:function(){var a,o,n,c=1,r=e.now()+e.preset.timbre_a*e.config.egMax+e.config.egMin;for(c=1;8>=c;c+=1)a=e.preset["osc"+c+"_eg"],o=e.preset["osc"+c],n=e.harmonicOscillator["osc"+c].vca,n.gain.cancelScheduledValues(0),n.gain.setTargetAtTime(o,e.now(),.1),n.gain.linearRampToValueAtTime(o+a,r),n.gain.setTargetAtTime(o+a*e.preset.timbre_s,r,e.preset.timbre_d*e.config.egMax);t&&console&&console.log("Timbre envelope on")},gateOff:function(){var a,o,n=1;for(n;8>=n;n+=1)o=e.harmonicOscillator["osc"+n].vca,o.gain.cancelScheduledValues(e.now()),a=o.gain.value,o.gain.setValueAtTime(a,e.now()),o.gain.setTargetAtTime(e.preset["osc"+n],e.now(),e.preset.timbre_r);t&&console&&console.log("Timbre envelope off")},update:function(a){var o;a.target&&a.target.dataset&&a.target.dataset.program&&(o=a.target.dataset.program),t&&console&&console.log(o,e.preset[o])}},document.addEventListener("updatetimbreenv",e.timbreEnv.update),document.addEventListener("gateon",e.timbreEnv.gateOn),document.addEventListener("gateoff",e.timbreEnv.gateOff),e}(EVE),EVE=function(e){"use strict";var t,a=document.querySelectorAll("input[type=radio]"),o=!1;for(e.button={press:function(){var t=this.name,a="update"+this.parentElement.parentElement.parentElement.dataset.update;e.preset[t]!==this.value&&(e.preset[t]="string"!=typeof this.value||isNaN(this.value-1)?this.value:parseFloat(this.value)),o&&console&&console.log("Updating",a),this.dispatchEvent(e.events[a])}},t=0;t<a.length;t+=1)a[t].addEventListener("change",e.button.press);return e}(EVE),EVE=function(e){"use strict";var t=document.getElementById("keyboard");return e.calculatePitch=function(t){var a=t.target?t.target.dataset.noteValue:t,o=1200*e.keyboard.octaveShift+parseFloat(a);return e.setPitch(o)},t.addEventListener("mousedown",e.calculatePitch),t.addEventListener("touchstart",e.calculatePitch),e}(EVE),EVE=function(e){"use strict";var t=!0;return e.attack=function(e){return t&&console&&console.log("Attack function used"),EVE.now()+e},e}(EVE),EVE=function(e){"use strict";var t,a,o,n,c=document.getElementsByClassName("shift-octave"),r=[],s={65:0,87:1,83:2,69:3,68:4,70:5,84:6,71:7,89:8,72:9,85:10,74:11,75:12,79:13,76:14,80:15,186:16,222:17,221:18},l={65:-2100,87:-2e3,83:-1900,69:-1800,68:-1700,70:-1600,84:-1500,71:-1400,89:-1300,72:-1200,85:-1100,74:-1e3,75:-900,79:-800,76:-700,80:-600,186:-500,222:-400,221:-300};for(e.keyboard={lights:document.querySelectorAll("#performance [data-light]"),keys:document.querySelectorAll("#keyboard button"),octaveShift:0,scope:document.getElementById("keyboard"),shiftOctave:function(a){function o(){var a=e.keyboard.octaveShift+2;for(t=0;t<e.keyboard.lights.length;t+=1)e.keyboard.lights[t].dataset.light=t===a?"on":"off"}var n=e.keyboard.octaveShift,c=this.dataset?this.dataset.shift:a;(n>-2&&0>c||2>n&&c>0)&&(e.keyboard.octaveShift=n+parseFloat(c),o())},convertQwertyToPitch:function(e){return l[e]},highlightKey:function(t){a=s[t],e.keyboard.keys[a].dataset.active="false"===e.keyboard.keys[a].dataset.active?"true":"false"},pressBus:function(t){switch(t.which){case 122:e.keyboard.shiftOctave(-1);break;case 120:e.keyboard.shiftOctave(1);break;case 96:console&&console.log(e.preset)}},downBus:function(t){n=e.keyboard.convertQwertyToPitch(t.which),n&&(-1===r.indexOf(n)&&(r.push(n),r.sort(function(e,t){return e-t})),o||(o=!o,e.gate()),e.calculatePitch(n),e.keyboard.highlightKey(t.which))},upBus:function(t){n=e.keyboard.convertQwertyToPitch(t.which),n&&(r.splice(r.indexOf(n),1),r.length>=1?e.calculatePitch(r[r.length-1]):(o=!o,e.gate()),e.keyboard.highlightKey(t.which))}},t=0;t<c.length;t+=1)c[t].addEventListener("click",e.keyboard.shiftOctave),c[t].addEventListener("touchstart",e.keyboard.shiftOctave);return document.addEventListener("keypress",e.keyboard.pressBus),document.addEventListener("keydown",e.keyboard.downBus),document.addEventListener("keyup",e.keyboard.upBus),e}(EVE),EVE=function(e){"use strict";return e.setPitch=function(t){var a;for(a=1;8>=a;a+=1)e.harmonicOscillator["osc"+a].detune.setTargetAtTime(t,e.now(),e.preset.glide);e.preset.lfo1_range>=440&&e.lfo1.detune.setValueAtTime(t,e.now(),e.preset.glide)},e}(EVE),EVE=function(e){"use strict";var t,a=!1,o=document.querySelectorAll("input[type=range]");for(e.slider={grab:function(){var t=this.dataset.program,o="update"+this.parentElement.parentElement.parentElement.dataset.update,n="lin"===this.dataset.curve?1:this.value;e.preset[t]=this.value*n,a&&console&&console.log("Updating",o),this.dispatchEvent(e.events[o])}},t=0;t<o.length;t+=1)o[t].addEventListener("input",e.slider.grab);return e}(EVE),EVE=function(e){"use strict";return e.startSynth=function(){var t;for(t=1;8>=t;t+=1)e.harmonicOscillator["osc"+t].start(0);e.lfo1.start(0),e.lfo2.start(0),document.removeEventListener("click",e.startSynth),document.removeEventListener("keydown",e.startSynth),document.removeEventListener("mousedown",e.startSynth),document.removeEventListener("touchend",e.startSynth),e.startSynth=void 0},document.addEventListener("click",e.startSynth),document.addEventListener("keydown",e.startSynth),document.addEventListener("mousedown",e.startSynth),document.addEventListener("touchend",e.startSynth),e}(EVE),EVE=function(e){"use strict";return e.now=function(){return e.currentTime},e}(EVE),EVE=function(e){"use strict";var t=!1,a=document.getElementById("keyboard");return e.gate=function(){var a=t?"gateOff":"gateOn";t=!t,document.dispatchEvent(e.events[a])},a.addEventListener("mousedown",e.gate),a.addEventListener("mouseup",e.gate),a.addEventListener("touchend",e.gate),a.addEventListener("touchstart",e.gate),e}(EVE);