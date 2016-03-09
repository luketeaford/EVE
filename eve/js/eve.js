window.AudioContext=window.AudioContext||window.webkitAudioContext;var EVE=new AudioContext;EVE=function(e){"use strict";return e.events={gateoff:new CustomEvent("gateoff",{bubbles:!0}),gateon:new CustomEvent("gateon",{bubbles:!0}),updateharmonicoscillator:new CustomEvent("updateharmonicoscillator",{bubbles:!0}),updatelfo1:new CustomEvent("updatelfo1",{bubbles:!0}),updatelfo2:new CustomEvent("updatelfo2",{bubbles:!0}),updateperformance:new CustomEvent("updateperformance",{bubbles:!0}),loadpreset:new CustomEvent("loadpreset",{bubbles:!0}),updatetimbreeg:new CustomEvent("updatetimbreeg",{bubbles:!0}),updatetimbreenv:new CustomEvent("updatetimbreenv",{bubbles:!0}),updatevca:new CustomEvent("updatevca",{bubbles:!0})},e}(EVE),EVE=function(e){"use strict";return e.config={egMax:2.125,egMin:.025,fineTune:0,fineTuneRange:51,glideMax:.165,glideMin:1e-4,lfo2DelayMax:2,lfo2AmpMaxDepth:1.28,lfo2PitchMaxDepth:3520,lfo2RateMax:139,masterFreq:440},e}(EVE),EVE=function(e){"use strict";return e.preset={name:"INIT",osc1:1,osc2:0,osc3:0,osc4:0,osc5:0,osc6:0,osc7:0,osc8:0,osc1_eg:0,osc2_eg:0,osc3_eg:0,osc4_eg:0,osc5_eg:0,osc6_eg:0,osc7_eg:0,osc8_eg:0,timbre_a:0,timbre_d:.125,timbre_s:.5,timbre_r:.125,lfo1_rate:1,lfo1_range:20,lfo1_type:"sine",osc1_lfo:0,osc2_lfo:0,osc3_lfo:0,osc4_lfo:0,osc5_lfo:0,osc6_lfo:0,osc7_lfo:0,osc8_lfo:0,lfo2_rate:3,lfo2_polarity:1,lfo2_type:"sine",lfo2_amp:0,lfo2_pitch:0,lfo2_delay:0,lfo2_a:0,lfo2_r:1e-4,lfo2_g:0,vca_a:0,vca_d:.1,vca_s:.5,vca_r:.1,vca_g:0,glide:1e-5},e.defaultPreset=e.preset,e}(EVE),EVE=function(e){"use strict";var t=1024,a=document.getElementById("scope"),o=a.getContext("2d"),n="rgb(51, 58, 52)",r=new Uint8Array(t),c=150,s=300;return e.oscilloscope=e.createAnalyser(),function l(){var a,i,d,u=s/t,f=0;for(window.requestAnimationFrame(l),o.clearRect(0,0,s,c),o.lineWidth=2,o.strokeStyle=n,o.beginPath(),e.oscilloscope.getByteTimeDomainData(r),a=0;t>a;a+=1)i=r[a]/128,d=i*c/2,0===a?o.moveTo(f,d):o.lineTo(f,d),f+=u;o.lineTo(s,c/2),o.stroke()}(),e}(EVE),EVE=function(e){"use strict";var t=document.getElementById("vca-a"),a=document.getElementById("vca-d"),o=document.getElementById("vca-g"),n=document.getElementById("vca-r"),r=document.getElementById("vca-s");return e.vca=e.createGain(),e.vca.gain.value=e.preset.vca_g,e.vca.connect(e.destination),e.vca.connect(e.oscilloscope),e.vca.gateOff=function(){var t=e.vca.gain.value;e.vca.gain.cancelScheduledValues(0),e.vca.gain.setValueAtTime(t,e.now()),e.vca.gain.setTargetAtTime(e.preset.vca_g,e.now(),e.preset.vca_r*e.config.egMax+e.config.egMin)},e.vca.gateOn=function(){var t=e.now()+e.preset.vca_a*e.config.egMax+e.config.egMin;e.vca.gain.cancelScheduledValues(0),e.vca.gain.setTargetAtTime(e.preset.vca_g,e.now(),.1),e.vca.gain.linearRampToValueAtTime(1,t),e.vca.gain.setTargetAtTime(e.preset.vca_s+e.preset.vca_g,t,e.preset.vca_d*e.config.egMax+e.config.egMin)},e.vca.update=function(){var t=event.target.dataset.program;"vca_g"===t&&e.vca.gain.setValueAtTime(e.preset.vca_g,e.now())},e.vca.load=function(){t.value=Math.sqrt(e.preset.vca_a),a.value=Math.sqrt(e.preset.vca_d),r.value=e.preset.vca_s,n.value=Math.sqrt(e.preset.vca_r),o.value=Math.sqrt(e.preset.vca_g)},document.addEventListener("updatevca",e.vca.update),document.addEventListener("gateon",e.vca.gateOn),document.addEventListener("gateoff",e.vca.gateOff),document.addEventListener("loadpreset",e.vca.load),e}(EVE),EVE=function(e){"use strict";var t,a,o,n=!1,r=e.config.fineTune*e.config.fineTuneRange;for(e.harmonicOscillator={inputs:document.querySelectorAll("#harmonic-oscillator input")},e.harmonicOscillator.mixer=e.createGain(),e.harmonicOscillator.mixer.gain.value=-1,t=1;8>=t;t+=1)a="osc"+t,o=e.config.masterFreq+r,e.harmonicOscillator[a]=e.createOscillator(),e.harmonicOscillator[a].frequency.value=o*t,e.harmonicOscillator[a].type="sine",e.harmonicOscillator[a].vca=e.createGain(),e.harmonicOscillator[a].vca.gain.value=e.preset[a],e.harmonicOscillator[a].connect(e.harmonicOscillator[a].vca),e.harmonicOscillator[a].vca.connect(e.harmonicOscillator.mixer),e.harmonicOscillator.mixer.connect(e.vca);return e.harmonicOscillator.update=function(){var t=e.harmonicOscillator,a=event.target.dataset.program;t[a].vca.gain.setValueAtTime(e.preset[a],e.now()),n&&console&&console.log(a,e.preset[a]),console.log("Harmonic oscillator updating")},e.harmonicOscillator.load=function(){var o=e.harmonicOscillator.inputs;for(t=1;8>=t;t+=1)a="osc"+t,o[t-1].value=Math.sqrt(e.preset[a])},document.addEventListener("updateharmonicoscillator",e.harmonicOscillator.update),document.addEventListener("loadpreset",e.harmonicOscillator.load),e}(EVE),EVE=function(e){"use strict";var t,a,o,n=!1,r=document.querySelectorAll("#lfo1 .js-osc"),c=document.getElementById("lfo1-rate");for(e.lfo1=e.createOscillator(),e.lfo1.frequency.value=e.preset.lfo1_rate,e.lfo1.type=e.preset.lfo1_type,t=1;8>=t;t+=1)o="osc"+t,a=o+"_lfo",e[a]=e.createGain(),e[a].gain.value=e.preset[a],e.lfo1.connect(e[a]),e[a].connect(e.harmonicOscillator[o].vca.gain);return e.lfo1.sine=document.getElementById("lfo1-sin"),e.lfo1.square=document.getElementById("lfo1-sqr"),e.lfo1.triangle=document.getElementById("lfo1-tri"),e.lfo1.sawtooth=document.getElementById("lfo1-saw"),e.lfo1.low=document.getElementById("lfo1-low"),e.lfo1.mid=document.getElementById("lfo1-mid"),e.lfo1.high=document.getElementById("lfo1-high"),e.lfo1.track=document.getElementById("lfo1-track"),e.lfo1.update=function(){var t=event.target.dataset.program;switch(t){case"lfo1_type":e.lfo1.type=e.preset.lfo1_type;break;case"lfo1_range":case"lfo1_rate":e.lfo1.frequency.setValueAtTime(e.preset.lfo1_rate*e.preset.lfo1_range,e.now());break;case"osc1_lfo":case"osc2_lfo":case"osc3_lfo":case"osc4_lfo":case"osc5_lfo":case"osc6_lfo":case"osc7_lfo":case"osc8_lfo":e[t].gain.setValueAtTime(e.preset[t],e.now());break;default:n&&console&&console.log("Unhandled LFO 1 update change")}n&&console&&console.log(t,e.preset[t])},e.lfo1.load=function(){var a={20:"low",40:"mid",80:"high",440:"track"};for(e.lfo1.type=e.preset.lfo1_type,e.lfo1[e.preset.lfo1_type].checked=!0,e.lfo1.frequency.setValueAtTime(e.preset.lfo1_rate*e.preset.lfo1_range,e.now()),e.lfo1[a[e.preset.lfo1_range]].checked=!0,c.value=Math.sqrt(e.preset.lfo1_rate),t=1;8>=t;t+=1)o="osc"+t+"_lfo",e[o].gain.setValueAtTime(e.preset[o],e.now()),r[t-1].value=e.preset[o]},document.addEventListener("updatelfo1",e.lfo1.update),document.addEventListener("loadpreset",e.lfo1.load),e}(EVE),EVE=function(e){"use strict";var t,a=document.getElementById("lfo2-amp"),o=document.getElementById("lfo2-attack"),n=!1,r=document.getElementById("lfo2-delay"),c=document.getElementById("lfo2-gain"),s=document.getElementById("lfo2-negative"),l=document.getElementById("lfo2-pitch"),i=document.getElementById("lfo2-positive"),d=document.getElementById("lfo2-rate"),u=document.getElementById("lfo2-release"),f={sawtooth:document.getElementById("lfo2-saw"),sine:document.getElementById("lfo2-sin"),square:document.getElementById("lfo2-sqr"),triangle:document.getElementById("lfo2-tri")};for(e.lfo2=e.createOscillator(),e.lfo2.frequency.value=e.preset.lfo2_rate,e.lfo2.type=e.preset.lfo2_type,e.lfo2_amp=e.createGain(),e.lfo2_amp.gain.value=e.preset.lfo2_amp,e.lfo2_pitch=e.createGain(),e.lfo2_pitch.gain.value=e.preset.lfo2_pitch,e.lfo2_vca=e.createGain(),e.lfo2_vca.gain.value=0,e.lfo2.connect(e.lfo2_vca),e.lfo2_vca.connect(e.lfo2_amp),e.lfo2_vca.connect(e.lfo2_pitch),e.lfo2_amp.connect(e.harmonicOscillator.mixer.gain),t=1;8>=t;t+=1)e.lfo2_pitch.connect(e.harmonicOscillator["osc"+t].frequency);return e.preset.lfo1_track&&e.lfo2_pitch.connect(e.lfo1.frequency),e.lfo2.gateOff=function(){e.lfo2_vca.gain.cancelScheduledValues(0),e.lfo2_vca.gain.setValueAtTime(e.lfo2_vca.gain.value,e.now()),e.lfo2_vca.gain.setTargetAtTime(e.preset.lfo2_g,e.now(),e.preset.lfo2_r*e.config.egMax+e.config.egMin)},e.lfo2.gateOn=function(){e.lfo2_vca.gain.cancelScheduledValues(0),e.lfo2_vca.gain.setTargetAtTime(e.preset.lfo2_g,e.now(),.1),e.lfo2_vca.gain.setTargetAtTime(1,e.now()+e.preset.lfo2_delay*e.config.lfo2DelayMax,e.preset.lfo2_a*e.config.egMax+e.config.egMin)},e.lfo2.update=function(){var t=event.target.dataset.program;switch(n&&console&&console.log(t,e.preset[t]),t){case"lfo2_amp":e.lfo2_amp.gain.setValueAtTime(e.preset.lfo2_amp*e.config.lfo2AmpMaxDepth*e.preset.lfo2_polarity,e.now());break;case"lfo2_g":e.lfo2_vca.gain.setValueAtTime(e.preset.lfo2_g,e.now());break;case"lfo2_pitch":e.lfo2_pitch.gain.setValueAtTime(e.preset.lfo2_pitch*e.config.lfo2PitchMaxDepth*e.preset.lfo2_polarity,e.now());break;case"lfo2_polarity":e.lfo2_amp.gain.setValueAtTime(e.preset.lfo2_amp*e.config.lfo2AmpMaxDepth*e.preset.lfo2_polarity,e.now()),e.lfo2_pitch.gain.setValueAtTime(e.preset.lfo2_pitch*e.config.lfo2PitchMaxDepth*e.preset.lfo2_polarity,e.now());break;case"lfo2_rate":e.lfo2.frequency.setValueAtTime(e.preset.lfo2_rate*e.config.lfo2RateMax,e.now());break;case"lfo2_type":e.lfo2.type=e.preset.lfo2_type;break;default:n&&console&&console.log("Unhandled LFO 2 update change")}},e.lfo2.load=function(){e.lfo2.type=e.preset.lfo2_type,f[e.preset.lfo2_type].checked=!0,e.lfo2.frequency.setValueAtTime(e.preset.lfo2_rate*e.config.lfo2RateMax,e.now()),d.value=Math.sqrt(e.preset.lfo2_rate),e.preset.lfo2_polarity>0?i.checked=!0:s.checked=!0,e.lfo2_amp.gain.setValueAtTime(e.preset.lfo2_amp*e.config.lfo2AmpMaxDepth*e.preset.lfo2_polarity,e.now()),a.value=e.preset.lfo2_amp,e.lfo2_pitch.gain.setValueAtTime(e.preset.lfo2_pitch*e.config.lfo2PitchMaxDepth*e.preset.lfo2_polarity,e.now()),l.value=Math.sqrt(e.preset.lfo2_pitch),r.value=Math.sqrt(e.preset.lfo2_delay),o.value=Math.sqrt(e.preset.lfo2_a),u.value=Math.sqrt(e.preset.lfo2_r),c.value=Math.sqrt(e.preset.lfo2_g)},document.addEventListener("gateoff",e.lfo2.gateOff),document.addEventListener("gateon",e.lfo2.gateOn),document.addEventListener("loadpreset",e.lfo2.load),document.addEventListener("updatelfo2",e.lfo2.update),e}(EVE),EVE=function(e){"use strict";var t=!1,a=document.getElementById("glide"),o=document.querySelectorAll("#octave-shift [data-light]"),n=document.getElementById("octave-shift");return e.performance={octaveShift:0,shiftOctave:function(t){var a,n,r;if((event.target.dataset.shift||"keypress"===event.type)&&(n=e.performance.octaveShift,r=event.target.dataset.shift||t,n>-2&&0>r||2>n&&r>0))for(e.performance.octaveShift=n+parseFloat(r),a=0;a<o.length;a+=1)o[a].dataset.light=a===e.performance.octaveShift+2?"on":"off"},update:function(){var a=event.target.dataset.program;t&&console&&console.log(a,e.preset[a])},load:function(){a.value=e.preset.glide}},document.addEventListener("loadpreset",e.performance.load),document.addEventListener("updateperformance",e.performance.update),n.addEventListener("click",e.performance.shiftOctave),n.addEventListener("touchend",e.performance.shiftOctave),e}(EVE),EVE=function(e){"use strict";var t=document.getElementById("timbre-a"),a=!1,o=document.getElementById("timbre-d"),n=document.getElementsByClassName("js-eg-amt"),r=document.getElementById("timbre-r"),c=document.getElementById("timbre-s");return e.timbreEnv={gateOff:function(){var t,a,o;for(t=1;8>=t;t+=1)o=e.harmonicOscillator["osc"+t].vca,o.gain.cancelScheduledValues(0),a=o.gain.value,o.gain.setValueAtTime(a,e.now()),o.gain.setTargetAtTime(e.preset["osc"+t],e.now(),e.preset.timbre_r*e.config.egMax+e.config.egMin)},gateOn:function(){var t,a,o,n,r=e.now()+e.preset.timbre_a*e.config.egMax+e.config.egMin;for(a=1;8>=a;a+=1)t=e.preset["osc"+a+"_eg"],o=e.preset["osc"+a],n=e.harmonicOscillator["osc"+a].vca,n.gain.cancelScheduledValues(0),n.gain.setTargetAtTime(o,e.now(),.1),n.gain.linearRampToValueAtTime(o+t,r),n.gain.setTargetAtTime(o+t*e.preset.timbre_s,r,e.preset.timbre_d*e.config.egMax+e.config.egMin)},update:function(){var t=event.target.dataset.program;a&&console&&console.log(t,e.preset[t])},load:function(){var a,s;for(a=1;8>=a;a+=1)s="osc"+a+"_eg",n[a-1].value=e.preset[s];t.value=Math.sqrt(e.preset.timbre_a),o.value=Math.sqrt(e.preset.timbre_d),c.value=e.preset.timbre_s,r.value=Math.sqrt(e.preset.timbre_r)}},document.addEventListener("updatetimbreenv",e.timbreEnv.update),document.addEventListener("gateon",e.timbreEnv.gateOn),document.addEventListener("gateoff",e.timbreEnv.gateOff),document.addEventListener("loadpreset",e.timbreEnv.load),e}(EVE),EVE=function(e){"use strict";var t={lfo1:"updatelfo1",lfo2:"updatelfo2"};return e.button={press:function(){var a,o,n;return"radio"===event.target.type?(a=event.target.name,o=t[event.path[2].id],n=event.target.value,e.preset[a]!==n&&("string"!=typeof n||isNaN(n-1)?e.preset[a]=n:e.preset[a]=parseFloat(n)),event.target.dispatchEvent(e.events[o])):void 0}},document.addEventListener("change",e.button.press),e}(EVE),EVE=function(e){"use strict";var t=document.getElementById("keyboard");return e.calculatePitch=function(t){var a=event.target.dataset?event.target.dataset.noteValue||t:t,o=1200*e.performance.octaveShift+parseFloat(a);return e.setPitch(o)},t.addEventListener("mousedown",e.calculatePitch),t.addEventListener("touchstart",e.calculatePitch),e}(EVE),EVE=function(e){"use strict";var t,a,o,n=[],r={65:0,87:1,83:2,69:3,68:4,70:5,84:6,71:7,89:8,72:9,85:10,74:11,75:12,79:13,76:14,80:15,186:16,222:17,221:18},c={65:-2100,87:-2e3,83:-1900,69:-1800,68:-1700,70:-1600,84:-1500,71:-1400,89:-1300,72:-1200,85:-1100,74:-1e3,75:-900,79:-800,76:-700,80:-600,186:-500,222:-400,221:-300};return e.keyboard={keys:document.querySelectorAll("#keyboard button"),convertQwertyToPitch:function(e){return c[e]},highlightKey:function(a){t=r[a],e.keyboard.keys[t].dataset.active="false"===e.keyboard.keys[t].dataset.active?"true":"false"},pressBus:function(){switch(event.which){case 44:e.program.cycle(-1);break;case 46:e.program.cycle(1);break;case 122:e.performance.shiftOctave(-1);break;case 120:e.performance.shiftOctave(1)}},downBus:function(){o=e.keyboard.convertQwertyToPitch(event.which),o&&(-1===n.indexOf(o)&&(e.calculatePitch(o),e.keyboard.highlightKey(event.which),n.push(o),n.sort(function(e,t){return e-t})),a||(a=!a,e.gate()))},upBus:function(){o=e.keyboard.convertQwertyToPitch(event.which),o&&(n.splice(n.indexOf(o),1),n.length>=1?e.calculatePitch(n[n.length-1]):(a=!a,e.gate()),e.keyboard.highlightKey(event.which))}},document.addEventListener("keypress",e.keyboard.pressBus),document.addEventListener("keydown",e.keyboard.downBus),document.addEventListener("keyup",e.keyboard.upBus),e}(EVE),EVE=function(e){"use strict";var t=!0;return navigator.requestMIDIAccess?(e.midi={active:null,events:function(){var a=event.data[1];switch(event.data[0]){case e.midi.messages.listen:t&&console&&console.log("MIDI listen");break;case e.midi.messages.noteOn:event.data[2]>=1?(null===e.midi.active&&(e.midi.active=a,e.gate()),e.calculatePitch(e.midi.toCents(a))):e.midi.active===a?(e.midi.active=null,e.gate()):e.calculatePitch(e.midi.toCents(e.midi.active));break;case e.midi.messages.noteOff:e.midi.active=null,e.gate();break;case e.midi.messages.volume:e.preset.osc2=event.data[2]/127*(event.data[2]/127),e.harmonicOscillator.inputs[1].dispatchEvent(e.events.updateharmonicoscillator),e.harmonicOscillator.inputs[1].value=Math.sqrt(e.preset.osc2),console.log("Moving the volume slider",event.data[2]);break;case e.midi.messages.bankSelect:console.log("You have selected a new bank");break;default:t&&console&&console.log("Unsupported MIDI event",event.data)}},getDevices:function(){return navigator.requestMIDIAccess().then(function(e){var a,o=[],n=e.inputs.entries();for(a=n.next();a&&!a.done;a=n.next())o.push(a.value[1]);return t=!1,t&&console&&console.log("Available devices:",o),o})},messages:{noteOn:144,noteOff:128,pitchWheel:224,bankSelect:192,volumeX:176},toCents:function(e){return 100*(e-69)}},e.midi.getDevices().then(function(t){var a=0;for(e.midi.devices=t,a;a<t.length;a+=1)e.midi.devices[a].onmidimessage=e.midi.events})):t&&console&&console.log("No MIDI available"),e}(EVE),EVE=function(e){"use strict";var t=["init","cool-sci-fi-sound","distorted-sawtooth","miranda","oranges","peach-fuzz","percusso","problematic-patch","test-lfo1","test-lfo2","test-patch","work-song"],a=document.getElementById("display-name"),o=0,n=t.length-1,r=document.getElementById("preset-bank"),c=document.getElementById("program");return e.program={cycle:function(c){var s=0,l=parseFloat(event.target.dataset.cycle)||c;if(event.target.dataset.cycle||"keypress"===event.type){if(s=o+l,s>=0&&n>=s)return o+=l,e.program.loadPreset(o)}else if(event.target===a&&(console.log(r.dataset.state),r.dataset.state="open"===r.dataset.state?"closed":"open"),event.target.value)return o=t.indexOf(event.target.value),r.dataset.state="closed",e.program.loadPreset(o)},load:function(){a.textContent=e.preset.name},loadPreset:function(a){var o=new XMLHttpRequest;o.open("GET","/presets/"+t[a]+".json",!0),o.onload=function(){var t;o.status>=200&&o.status<400?(t=JSON.parse(o.responseText),e.preset=t,document.dispatchEvent(e.events.loadpreset)):(e.preset=e.defaultPreset,document.dispatchEvent(e.events.loadpreset))},o.send()}},document.addEventListener("loadpreset",e.program.load),c.addEventListener("click",e.program.cycle),e}(EVE),EVE=function(e){"use strict";return e.setPitch=function(t){var a,o=e.preset.glide*e.config.glideMax+e.config.glideMin;for(a=1;8>=a;a+=1)e.harmonicOscillator["osc"+a].detune.setTargetAtTime(t,e.now(),o);e.preset.lfo1_range>=440&&e.lfo1.detune.setTargetAtTime(t,e.now(),o)},e}(EVE),EVE=function(e){"use strict";var t={"harmonic-oscillator":"updateharmonicoscillator",lfo1:"updatelfo1",lfo2:"updatelfo2",performance:"updateperformance","timbre-env":"updatetimbreenv",vca:"updatevca"};return e.slider={grab:function(){var a,o,n;return"range"===event.target.type?(a=event.target.dataset.program,o=t[event.path[2].id],n="lin"===event.target.dataset.curve?1:event.target.value,e.preset[a]=event.target.value*n,event.target.dispatchEvent(e.events[o])):void 0}},document.addEventListener("input",e.slider.grab),e}(EVE),EVE=function(e){"use strict";return e.startSynth=function(){var t;for(t=1;8>=t;t+=1)e.harmonicOscillator["osc"+t].start(0);e.lfo1.start(0),e.lfo2.start(0),document.removeEventListener("click",e.startSynth),document.removeEventListener("keydown",e.startSynth),document.removeEventListener("mousedown",e.startSynth),document.removeEventListener("touchend",e.startSynth),e.startSynth=void 0},document.addEventListener("click",e.startSynth),document.addEventListener("keydown",e.startSynth),document.addEventListener("mousedown",e.startSynth),document.addEventListener("touchend",e.startSynth),e}(EVE),EVE=function(e){"use strict";return e.now=function(){return e.currentTime},e}(EVE),EVE=function(e){"use strict";var t=!1,a=document.getElementById("keyboard");return e.gate=function(){var a=t?"gateoff":"gateon";t=!t,document.dispatchEvent(e.events[a])},a.addEventListener("mousedown",e.gate),a.addEventListener("mouseup",e.gate),a.addEventListener("touchend",e.gate),a.addEventListener("touchstart",e.gate),e}(EVE);