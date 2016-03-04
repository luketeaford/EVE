window.AudioContext=window.AudioContext||window.webkitAudioContext;var EVE=new AudioContext;EVE=function(e){"use strict";return e.events={gateOff:new CustomEvent("gateoff",{bubbles:!0}),gateOn:new CustomEvent("gateon",{bubbles:!0}),updateHarmonicOscillator:new CustomEvent("updateharmonicoscillator",{bubbles:!0}),updateLfo1:new CustomEvent("updatelfo1",{bubbles:!0}),updateLfo2:new CustomEvent("updatelfo2",{bubbles:!0}),updatePerformance:new CustomEvent("updateperformance",{bubbles:!0}),loadPreset:new CustomEvent("loadpreset",{bubbles:!0}),updateTimbreEg:new CustomEvent("updatetimbreeg",{bubbles:!0}),updateTimbreEnv:new CustomEvent("updatetimbreenv",{bubbles:!0}),updateVca:new CustomEvent("updatevca",{bubbles:!0})},e}(EVE),EVE=function(e){"use strict";return e.config={egMax:2.125,egMin:.025,fineTuneRange:50,glideMax:.165,glideMin:1e-4,lfo2DelayMax:2,lfo2RateMax:139,masterFreq:440},e}(EVE),EVE=function(e){"use strict";return e.preset={name:"INIT",osc1:1,osc2:0,osc3:0,osc4:0,osc5:0,osc6:0,osc7:0,osc8:0,osc1_eg:0,osc2_eg:0,osc3_eg:0,osc4_eg:0,osc5_eg:0,osc6_eg:0,osc7_eg:0,osc8_eg:0,timbre_a:0,timbre_d:.125,timbre_s:.5,timbre_r:.125,lfo1_rate:1,lfo1_range:20,lfo1_type:"sine",osc1_lfo:0,osc2_lfo:0,osc3_lfo:0,osc4_lfo:0,osc5_lfo:0,osc6_lfo:0,osc7_lfo:0,osc8_lfo:0,lfo2_rate:3,lfo2_type:"sine",lfo2_amp:0,lfo2_pitch:0,lfo2_delay:0,lfo2_a:0,lfo2_r:1e-4,lfo2_g:0,vca_a:0,vca_d:.1,vca_s:.5,vca_r:.1,vca_g:0,fine:0,glide:1e-5},e.defaultPreset=e.preset,e}(EVE),EVE=function(e){"use strict";var t=1024,a=document.getElementById("scope"),o=a.getContext("2d"),n="rgb(51, 58, 52)",r=new Uint8Array(t),c=150,s=300;return e.oscilloscope=e.createAnalyser(),function l(){var a,i,d,u=s/t,f=0;for(window.requestAnimationFrame(l),o.clearRect(0,0,s,c),o.lineWidth=2,o.strokeStyle=n,o.beginPath(),e.oscilloscope.getByteTimeDomainData(r),a=0;t>a;a+=1)i=r[a]/128,d=i*c/2,0===a?o.moveTo(f,d):o.lineTo(f,d),f+=u;o.lineTo(s,c/2),o.stroke()}(),e}(EVE),EVE=function(e){"use strict";var t=!1;return e.vca=e.createGain(),e.vca.gain.value=e.preset.vca_g,e.vca.connect(e.destination),e.vca.connect(e.oscilloscope),e.vca.attack=document.getElementById("vca-a"),e.vca.decay=document.getElementById("vca-d"),e.vca.sustain=document.getElementById("vca-s"),e.vca.release=document.getElementById("vca-r"),e.vca.gateOn=function(){var a=e.now()+e.preset.vca_a*e.config.egMax+e.config.egMin;e.vca.gain.cancelScheduledValues(0),e.vca.gain.setTargetAtTime(e.preset.vca_g,e.now(),.1),e.vca.gain.linearRampToValueAtTime(1,a),e.vca.gain.setTargetAtTime(e.preset.vca_s+e.preset.vca_g,a,e.preset.vca_d*e.config.egMax),t&&console&&console.log("Begin attack stage - custom gateOn")},e.vca.gateOff=function(){var a=e.vca.gain.value;e.vca.gain.cancelScheduledValues(0),e.vca.gain.setValueAtTime(a,e.now()),e.vca.gain.setTargetAtTime(e.preset.vca_g,e.now(),e.preset.vca_r*e.config.egMax+e.config.egMin),t&&console&&console.log("Begin release stage - custom gateOff")},e.vca.update=function(a){var o;a.target&&a.target.dataset&&a.target.dataset.program&&(o=a.target.dataset.program),"vca_g"===o&&e.vca.gain.setValueAtTime(e.preset.vca_g,e.now()),t&&console&&console.log(o,e.preset[o])},e.vca.load=function(){e.vca.attack.value=Math.sqrt(e.preset.vca_a),e.vca.decay.value=Math.sqrt(e.preset.vca_d),e.vca.sustain.value=e.preset.vca_s,e.vca.release.value=Math.sqrt(e.preset.vca_r),e.vca.gain.value=Math.sqrt(e.preset.vca_g)},document.addEventListener("updatevca",e.vca.update),document.addEventListener("gateon",e.vca.gateOn),document.addEventListener("gateoff",e.vca.gateOff),document.addEventListener("loadpreset",e.vca.load),e}(EVE),EVE=function(e){"use strict";var t,a,o=!1,n=document.querySelectorAll("#harmonic-oscillator input");for(e.harmonicOscillator={},e.harmonicOscillator.mixer=e.createGain(),e.harmonicOscillator.mixer.gain.value=-1,t=1;8>=t;t+=1)a="osc"+t,e.harmonicOscillator[a]=e.createOscillator(),e.harmonicOscillator[a].frequency.value=e.config.masterFreq*t,e.harmonicOscillator[a].type="sine",e.harmonicOscillator[a].vca=e.createGain(),e.harmonicOscillator[a].vca.gain.value=e.preset[a],e.harmonicOscillator[a].connect(e.harmonicOscillator[a].vca),e.harmonicOscillator[a].vca.connect(e.harmonicOscillator.mixer),e.harmonicOscillator.mixer.connect(e.vca);return e.harmonicOscillator.update=function(t){var a;t.target&&t.target.dataset&&t.target.dataset.program&&(a=t.target.dataset.program),e.harmonicOscillator[a].vca.gain.setValueAtTime(e.preset[a],e.now()),o&&console&&console.log(a,e.preset[a])},e.harmonicOscillator.load=function(){for(t=1;8>=t;t+=1)a="osc"+t,n[t-1].value=Math.sqrt(e.preset[a])},document.addEventListener("updateharmonicoscillator",e.harmonicOscillator.update),document.addEventListener("loadpreset",e.harmonicOscillator.load),e}(EVE),EVE=function(e){"use strict";var t,a,o,n=!1;for(e.lfo1=e.createOscillator(),e.lfo1.frequency.value=e.preset.lfo1_rate,e.lfo1.type=e.preset.lfo1_type,t=1;8>=t;t+=1)o="osc"+t,a=o+"_lfo",e[a]=e.createGain(),e[a].gain.value=e.preset[a],e.lfo1.connect(e[a]),e[a].connect(e.harmonicOscillator[o].vca.gain);return e.lfo1.sine=document.getElementById("lfo1-sin"),e.lfo1.square=document.getElementById("lfo1-sqr"),e.lfo1.triangle=document.getElementById("lfo1-tri"),e.lfo1.sawtooth=document.getElementById("lfo1-saw"),e.lfo1.low=document.getElementById("lfo1-low"),e.lfo1.mid=document.getElementById("lfo1-mid"),e.lfo1.high=document.getElementById("lfo1-high"),e.lfo1.track=document.getElementById("lfo1-track"),e.lfo1.rate=document.getElementById("lfo1-rate"),e.lfo1.oscInputs=document.querySelectorAll("#lfo1 .js-osc"),e.lfo1.update=function(t){var a;switch(t.target&&t.target.dataset&&t.target.dataset.program&&(a=t.target.dataset.program),a){case"lfo1_type":e.lfo1.type=e.preset.lfo1_type;break;case"lfo1_range":case"lfo1_rate":e.lfo1.frequency.setValueAtTime(e.preset.lfo1_rate*e.preset.lfo1_range,e.now());break;case"osc1_lfo":case"osc2_lfo":case"osc3_lfo":case"osc4_lfo":case"osc5_lfo":case"osc6_lfo":case"osc7_lfo":case"osc8_lfo":e[a].gain.setValueAtTime(e.preset[a],e.now());break;default:n&&console&&console.log("Unhandled LFO 1 update change")}n&&console&&console.log(a,e.preset[a])},e.lfo1.load=function(){var a={20:"low",40:"mid",80:"high",440:"track"};for(e.lfo1[e.preset.lfo1_type].checked=!0,e.lfo1[a[e.preset.lfo1_range]].checked=!0,e.lfo1.rate.value=Math.sqrt(e.preset.lfo1_rate),t=1;t<EVE.lfo1.oscInputs.length;t+=1)o="osc"+t+"_lfo",e.lfo1.oscInputs[t-1].value=e.preset[o]},document.addEventListener("updatelfo1",e.lfo1.update),document.addEventListener("loadpreset",e.lfo1.load),e}(EVE),EVE=function(e){"use strict";var t,a=!1;for(e.lfo2=e.createOscillator(),e.lfo2.frequency.value=e.preset.lfo2_rate,e.lfo2.type=e.preset.lfo2_type,e.lfo2_amp=e.createGain(),e.lfo2_amp.gain.value=e.preset.lfo2_amp,e.lfo2_pitch=e.createGain(),e.lfo2_pitch.gain.value=e.preset.lfo2_pitch,e.lfo2_vca=e.createGain(),e.lfo2_vca.gain.value=0,e.lfo2.connect(e.lfo2_vca),e.lfo2_vca.connect(e.lfo2_amp),e.lfo2_vca.connect(e.lfo2_pitch),e.lfo2_amp.connect(e.harmonicOscillator.mixer.gain),t=1;8>=t;t+=1)e.lfo2_pitch.connect(e.harmonicOscillator["osc"+t].frequency);return e.preset.lfo1_track&&e.lfo2_pitch.connect(e.lfo1.frequency),e.lfo2.sine=document.getElementById("lfo2-sin"),e.lfo2.square=document.getElementById("lfo2-sqr"),e.lfo2.sawtooth=document.getElementById("lfo2-saw"),e.lfo2.triangle=document.getElementById("lfo2-tri"),e.lfo2.rate=document.getElementById("lfo2-rate"),e.lfo2.amp=document.getElementById("lfo2-amp"),e.lfo2.pitch=document.getElementById("lfo2-pitch"),e.lfo2.delay=document.getElementById("lfo2-delay"),e.lfo2.attack=document.getElementById("lfo2-attack"),e.lfo2.release=document.getElementById("lfo2-release"),e.lfo2.gain=document.getElementById("lfo2-gain"),e.lfo2.gateOff=function(){e.lfo2_vca.gain.cancelScheduledValues(e.now()),e.lfo2_vca.gain.setValueAtTime(e.lfo2_vca.gain.value,e.now()),e.lfo2_vca.gain.setTargetAtTime(e.preset.lfo2_g,e.now(),e.preset.lfo2_r)},e.lfo2.gateOn=function(){e.lfo2_vca.gain.cancelScheduledValues(0),e.lfo2_vca.gain.setTargetAtTime(e.preset.lfo2_g,e.now(),.1),e.lfo2_vca.gain.setTargetAtTime(1,e.now()+e.preset.lfo2_delay*e.config.lfo2DelayMax,e.preset.lfo2_a*e.config.egMax+e.config.egMin)},e.lfo2.update=function(t){var o;switch(t.target&&t.target.dataset&&t.target.dataset.program&&(o=t.target.dataset.program),a&&console&&console.log(o,e.preset[o]),o){case"lfo2_amp":e.lfo2_amp.gain.setValueAtTime(e.preset.lfo2_amp,e.now());break;case"lfo2_g":e.lfo2_vca.gain.setValueAtTime(e.preset.lfo2_g,e.now());break;case"lfo2_pitch":e.lfo2_pitch.gain.setValueAtTime(e.preset.lfo2_pitch*e.config.lfo2RateMax,e.now());break;case"lfo2_rate":e.lfo2.frequency.setValueAtTime(e.preset.lfo2_rate*e.config.lfo2RateMax,e.now());break;case"lfo2_type":e.lfo2.type=e.preset.lfo2_type;break;default:a&&console&&console.log("Unhandled LFO 2 update change")}},e.lfo2.load=function(){e.lfo2[e.preset.lfo2_type].checked=!0,e.lfo2.rate.value=Math.sqrt(e.preset.lfo2_rate),e.lfo2.amp.value=e.preset.lfo2_amp,e.lfo2.pitch.value=Math.sqrt(e.preset.lfo2_pitch),e.lfo2.delay.value=Math.sqrt(e.preset.lfo2_delay),e.lfo2.attack.value=Math.sqrt(e.preset.lfo2_a),e.lfo2.release.value=Math.sqrt(e.preset.lfo2_r),e.lfo2.gain.value=Math.sqrt(e.preset.lfo2_g)},document.addEventListener("updatelfo2",e.lfo2.update),document.addEventListener("gateon",e.lfo2.gateOn),document.addEventListener("gateoff",e.lfo2.gateOff),document.addEventListener("loadpreset",e.lfo2.load),e}(EVE),EVE=function(e){"use strict";var t=!0;return e.performance={fine:document.getElementById("fine"),glide:document.getElementById("glide"),update:function(a){var o;switch(a.target&&a.target.dataset&&a.target.dataset.program&&(o=a.target.dataset.program),t&&console&&console.log(o,e.preset[o]),o){case"glide":e.preset.glide=e.preset.glide*e.config.glideMax+e.config.glideMin}},load:function(){e.performance.fine.value=e.preset.fine,e.performance.glide.value=e.preset.glide}},document.addEventListener("updateperformance",e.performance.update),document.addEventListener("loadpreset",e.performance.load),e}(EVE),EVE=function(e){"use strict";var t=!0,a=document.getElementsByClassName("js-eg-amt");return e.timbreEnv={attack:document.getElementById("timbre-a"),decay:document.getElementById("timbre-d"),sustain:document.getElementById("timbre-s"),release:document.getElementById("timbre-r"),gateOn:function(){var a,o,n,r,c=e.now()+e.preset.timbre_a*e.config.egMax+e.config.egMin;for(o=1;8>=o;o+=1)a=e.preset["osc"+o+"_eg"],n=e.preset["osc"+o],r=e.harmonicOscillator["osc"+o].vca,r.gain.cancelScheduledValues(0),r.gain.setTargetAtTime(n,e.now(),.1),r.gain.linearRampToValueAtTime(n+a,c),r.gain.setTargetAtTime(n+a*e.preset.timbre_s,c,e.preset.timbre_d*e.config.egMax);t&&console&&console.log("Timbre envelope on")},gateOff:function(){var a,o,n;for(a=1;8>=a;a+=1)n=e.harmonicOscillator["osc"+a].vca,n.gain.cancelScheduledValues(e.now()),o=n.gain.value,n.gain.setValueAtTime(o,e.now()),n.gain.setTargetAtTime(e.preset["osc"+a],e.now(),e.preset.timbre_r);t&&console&&console.log("Timbre envelope off")},update:function(a){var o;a.target&&a.target.dataset&&a.target.dataset.program&&(o=a.target.dataset.program),t&&console&&console.log(o,e.preset[o]),console.log("Why is the timbre envelope update not firing?")},load:function(){var t,o;for(t=1;8>=t;t+=1)o="osc"+t+"_eg",a[t-1].value=e.preset[o];e.timbreEnv.attack.value=Math.sqrt(e.preset.timbre_a),e.timbreEnv.decay.value=Math.sqrt(e.preset.timbre_d),e.timbreEnv.sustain.value=e.preset.timbre_s,e.timbreEnv.release.value=Math.sqrt(e.preset.timbre_r)}},document.addEventListener("updatetimbreenv",e.timbreEnv.update),document.addEventListener("gateon",e.timbreEnv.gateOn),document.addEventListener("gateoff",e.timbreEnv.gateOff),document.addEventListener("loadpreset",e.timbreEnv.load),e}(EVE),EVE=function(e){"use strict";var t,a=document.querySelectorAll("input[type=radio]"),o=!1;for(e.button={press:function(){var t=this.name,a="update"+this.parentElement.parentElement.parentElement.dataset.update;e.preset[t]!==this.value&&("string"!=typeof this.value||isNaN(this.value-1)?e.preset[t]=this.value:e.preset[t]=parseFloat(this.value)),o&&console&&console.log("Updating",a),this.dispatchEvent(e.events[a])}},t=0;t<a.length;t+=1)a[t].addEventListener("change",e.button.press);return e}(EVE),EVE=function(e){"use strict";var t=document.getElementById("keyboard");return e.calculatePitch=function(t){var a=t.target?t.target.dataset.noteValue:t,o=1200*e.keyboard.octaveShift+parseFloat(a)+e.preset.fine*e.config.fineTuneRange;return e.setPitch(o)},t.addEventListener("mousedown",e.calculatePitch),t.addEventListener("touchstart",e.calculatePitch),e}(EVE),EVE=function(e){"use strict";var t=!0;return e.attack=function(e){return t&&console&&console.log("Attack function used"),EVE.now()+e},e}(EVE),EVE=function(e){"use strict";var t,a,o,n,r=document.getElementsByClassName("shift-octave"),c=[],s={65:0,87:1,83:2,69:3,68:4,70:5,84:6,71:7,89:8,72:9,85:10,74:11,75:12,79:13,76:14,80:15,186:16,222:17,221:18},l={65:-2100,87:-2e3,83:-1900,69:-1800,68:-1700,70:-1600,84:-1500,71:-1400,89:-1300,72:-1200,85:-1100,74:-1e3,75:-900,79:-800,76:-700,80:-600,186:-500,222:-400,221:-300};for(e.keyboard={lights:document.querySelectorAll("#performance [data-light]"),keys:document.querySelectorAll("#keyboard button"),octaveShift:0,scope:document.getElementById("keyboard"),shiftOctave:function(a){function o(){var a=e.keyboard.octaveShift+2;for(t=0;t<e.keyboard.lights.length;t+=1)e.keyboard.lights[t].dataset.light=t===a?"on":"off"}var n=e.keyboard.octaveShift,r=this.dataset?this.dataset.shift:a;(n>-2&&0>r||2>n&&r>0)&&(e.keyboard.octaveShift=n+parseFloat(r),o())},convertQwertyToPitch:function(e){return l[e]},highlightKey:function(t){a=s[t],e.keyboard.keys[a].dataset.active="false"===e.keyboard.keys[a].dataset.active?"true":"false"},pressBus:function(t){switch(t.which){case 122:e.keyboard.shiftOctave(-1);break;case 120:e.keyboard.shiftOctave(1);break;case 96:console&&console.log(e.preset)}},downBus:function(t){n=e.keyboard.convertQwertyToPitch(t.which),n&&(-1===c.indexOf(n)&&(c.push(n),c.sort(function(e,t){return e-t})),o||(o=!o,e.gate()),e.calculatePitch(n),e.keyboard.highlightKey(t.which))},upBus:function(t){n=e.keyboard.convertQwertyToPitch(t.which),n&&(c.splice(c.indexOf(n),1),c.length>=1?e.calculatePitch(c[c.length-1]):(o=!o,e.gate()),e.keyboard.highlightKey(t.which))}},t=0;t<r.length;t+=1)r[t].addEventListener("click",e.keyboard.shiftOctave),r[t].addEventListener("touchstart",e.keyboard.shiftOctave);return document.addEventListener("keypress",e.keyboard.pressBus),document.addEventListener("keydown",e.keyboard.downBus),document.addEventListener("keyup",e.keyboard.upBus),e}(EVE),EVE=function(e){"use strict";var t,a,o=["init","test-patch","distorted-sawtooth","cool-sci-fi-sound","problematic-patch"],n=!0,r=document.getElementById("display-name"),c=document.getElementById("next-preset"),s=0,l=o.length-1,i=document.getElementById("prev-preset");return e.program={cycle:function(t){var a=t&&0>t?-1:1,o=s+a;return o>=0&&l>=o&&(s=o),e.program.loadPreset(s)},loadPreset:function(t){var a=new XMLHttpRequest;a.open("GET","/presets/"+o[t]+".json",!0),a.onload=function(){var t;a.status>=200&&a.status<400?(t=JSON.parse(a.responseText),e.preset=t,document.dispatchEvent(e.events.loadPreset),console.log("A new preset!",e.preset.name)):(e.preset=e.defaultPreset,document.dispatchEvent(e.events.loadPreset),n&&console&&console.log("Error loading program"))},a.send()},load:function(){r.textContent=e.preset.name}},t=e.program.cycle.bind(null,-1),a=e.program.cycle.bind(null,1),c.addEventListener("click",a),i.addEventListener("click",t),document.addEventListener("loadpreset",e.program.load),e}(EVE),EVE=function(e){"use strict";return e.setPitch=function(t){var a;for(a=1;8>=a;a+=1)e.harmonicOscillator["osc"+a].detune.setTargetAtTime(t,e.now(),e.preset.glide);e.preset.lfo1_range>=440&&e.lfo1.detune.setValueAtTime(t,e.now(),e.preset.glide)},e}(EVE),EVE=function(e){"use strict";var t,a=!1,o=document.querySelectorAll("input[type=range]");for(e.slider={grab:function(){var t=this.dataset.program,o="update"+this.parentElement.parentElement.dataset.update,n="lin"===this.dataset.curve?1:this.value;e.preset[t]=this.value*n,a&&console&&console.log("Updating",o),this.dispatchEvent(e.events[o])}},t=0;t<o.length;t+=1)o[t].addEventListener("input",e.slider.grab);return e}(EVE),EVE=function(e){"use strict";return e.startSynth=function(){var t;for(t=1;8>=t;t+=1)e.harmonicOscillator["osc"+t].start(0);e.lfo1.start(0),e.lfo2.start(0),document.removeEventListener("click",e.startSynth),document.removeEventListener("keydown",e.startSynth),document.removeEventListener("mousedown",e.startSynth),document.removeEventListener("touchend",e.startSynth),e.startSynth=void 0},document.addEventListener("click",e.startSynth),document.addEventListener("keydown",e.startSynth),document.addEventListener("mousedown",e.startSynth),document.addEventListener("touchend",e.startSynth),e}(EVE),EVE=function(e){"use strict";return e.now=function(){return e.currentTime},e}(EVE),EVE=function(e){"use strict";var t=!1,a=document.getElementById("keyboard");return e.gate=function(){var a=t?"gateOff":"gateOn";t=!t,document.dispatchEvent(e.events[a])},a.addEventListener("mousedown",e.gate),a.addEventListener("mouseup",e.gate),a.addEventListener("touchend",e.gate),a.addEventListener("touchstart",e.gate),e}(EVE);