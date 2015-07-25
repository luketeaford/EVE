window.AudioContext=window.AudioContext||window.webkitAudioContext;var EVE={config:{eg_minimum:.05,harmonics:8,lfo_max:110,masterFreq:440},synth:new AudioContext};!function(){"use strict";function e(){this.parentElement.dataset.state="open"===this.parentElement.dataset.state?"closed":"open"}var t,o=document.querySelectorAll("section > a");for(t=0;t<o.length;t+=1)o[t].addEventListener("click",e)}(),EVE.keyboard={current:null,debug:!0,octaveShift:0,scope:document.getElementById("keyboard"),shiftOctave:function(e){"use strict";function t(){var e,t=document.querySelectorAll("#performance > span"),o=EVE.keyboard.octaveShift+2;for(e=0;e<t.length;e+=1)t[e].dataset.light=e===o?"on":"off"}var o=EVE.keyboard.octaveShift,a=this.dataset?this.dataset.shift:e;(o>-2&&0>a||2>o&&a>0)&&(EVE.keyboard.octaveShift=o+parseFloat(a),t()),EVE.keyboard.debug&&console&&console.log(EVE.keyboard.octaveShift)},pressBus:function(e){"use strict";switch(EVE.keyboard.debug&&console&&23===EVE.keyboard.octaveShift&&console.log(e.which),e.which){case 45:case 95:EVE.keyboard.shiftOctave(-1);break;case 61:case 43:EVE.keyboard.shiftOctave(1)}},downBus:function(e){"use strict";var t=null;switch(EVE.keyboard.debug&&console&&console.log("DOWN BUS",e.which),e.which){case 65:t=-2100;break;case 83:t=-2e3;break;case 68:t=-1900;break;case 70:t=-1800;break;case 71:t=-1700;break;case 72:t=-1600;break;case 74:t=-1500;break;case 75:t=-1400;break;case 76:t=-1300;break;case 186:t=-1200;break;case 222:t=-1100;break;case 81:t=-1e3;break;case 87:t=-900;break;case 69:t=-800;break;case 82:t=-700;break;case 84:t=-600;break;case 89:t=-500;break;case 85:t=-400;break;case 73:t=-300;break;case 79:t=-200;break;case 80:t=-100;break;case 219:t=0;break;case 221:t=100}null!==t&&EVE.keyboard.current!==e.which?(EVE.keyboard.current=e.which,EVE.gateOn(e,t)):EVE.keyboard.debug&&console&&console.log("No pitch information")},upBus:function(){"use strict";EVE.keyboard.current=null,EVE.gateOff()},touch:function(e){"use strict";console&&console.log("Keyboard touched",e)}},function(){"use strict";var e,t=document.getElementsByClassName("octave-shift");for(e=0;e<t.length;e+=1)t[e].addEventListener("click",EVE.keyboard.shiftOctave);document.addEventListener("keypress",EVE.keyboard.pressBus),document.addEventListener("keydown",EVE.keyboard.downBus),document.addEventListener("keyup",EVE.keyboard.upBus)}(),EVE.program={name:"INIT",osc1:1,osc2:0,osc3:0,osc4:0,osc5:0,osc6:0,osc7:0,osc8:0,osc1_eg:0,osc2_eg:0,osc3_eg:0,osc4_eg:0,osc5_eg:0,osc6_eg:0,osc7_eg:0,osc8_eg:0,timbre_a:0,timbre_d:.3,timbre_s:0,timbre_r:.3,lfo1_rate:4,lfo1_track:!1,lfo1_type:"square",osc1_lfo:0,osc2_lfo:0,osc3_lfo:0,osc4_lfo:0,osc5_lfo:0,osc6_lfo:0,osc7_lfo:0,osc8_lfo:0,lfo2_rate:3,lfo2_track:!1,lfo2_type:"sawtooth",lfo2_amp:0,lfo2_pitch:0,vca_a:0,vca_d:.25,vca_s:1,vca_r:.25,vca_g:0},EVE.now=function(){"use strict";return EVE.synth.currentTime},EVE.attack=function(e){"use strict";return EVE.now()+e},EVE.oscilloscope=EVE.synth.createAnalyser(),function(){"use strict";var e=2048,t=document.getElementById("scope"),o=t.getContext("2d"),a="rgb(53, 56, 55)",E=new Uint8Array(e);!function n(){var t,r,c,s=300/e,i=0;for(window.requestAnimationFrame(n),o.clearRect(0,0,300,150),o.lineWidth=2,o.strokeStyle=a,o.beginPath(),EVE.oscilloscope.getByteTimeDomainData(E),t=0;e>t;t+=1)r=E[t]/128,c=150*r/2,0===t?o.moveTo(i,c):o.lineTo(i,c),i+=s;o.lineTo(300,75),o.stroke()}()}(),EVE.vca=EVE.synth.createGain(),EVE.vca.gain.value=EVE.program.vca_g,EVE.vca.connect(EVE.synth.destination),EVE.vca.connect(EVE.oscilloscope),EVE.vca.debug=!0,EVE.vca.scope=document.getElementById("vca"),EVE.vca.update=function(e){"use strict";var t;e.target&&e.target.dataset&&e.target.dataset.program&&(t=e.target.dataset.program),EVE.vca.debug&&console&&console.log(t,EVE.program[t]),"vca_g"===t&&EVE.vca.gain.setValueAtTime(EVE.program.vca_g,EVE.now())},EVE.vca.scope.addEventListener("update_vca",EVE.vca.update),EVE.update_vca=new CustomEvent("update_vca",{bubbles:!0}),EVE.harmonicOsc={debug:!0,scope:document.getElementById("harmonics"),update:function(e){"use strict";var t;e.target&&e.target.dataset&&e.target.dataset.program&&(t=e.target.dataset.program),EVE.harmonicOsc.debug&&console&&console.log(t,EVE.program[t]),EVE.harmonicOsc[t].vca.gain.setValueAtTime(EVE.program[t],EVE.now())}},function(){"use strict";var e,t;for(EVE.harmonicOsc.mixer=EVE.synth.createGain(),EVE.harmonicOsc.mixer.gain.value=-1,e=1;e<=EVE.config.harmonics;e+=1)t="osc"+e,EVE.harmonicOsc[t]=EVE.synth.createOscillator(),EVE.harmonicOsc[t].frequency.value=EVE.config.masterFreq*e,EVE.harmonicOsc[t].type="sine",EVE.harmonicOsc[t].vca=EVE.synth.createGain(),EVE.harmonicOsc[t].vca.gain.value=EVE.program[t],EVE.harmonicOsc[t].connect(EVE.harmonicOsc[t].vca),EVE.harmonicOsc[t].vca.connect(EVE.harmonicOsc.mixer),EVE.harmonicOsc.mixer.connect(EVE.vca)}(),EVE.harmonicOsc.scope.addEventListener("update_harmonic_osc",EVE.harmonicOsc.update),EVE.update_harmonic_osc=new CustomEvent("update_harmonic_osc",{bubbles:!0}),EVE.timbreEg={debug:!0,scope:document.getElementById("timbre-eg"),update:function(e){"use strict";var t;e.target&&e.target.dataset&&e.target.dataset.program&&(t=e.target.dataset.program),EVE.timbreEg.debug&&console&&console.log(t,EVE.program[t])}},EVE.timbreEg.scope.addEventListener("update_timbre_eg",EVE.timbreEg.update),EVE.update_timbre_eg=new CustomEvent("update_timbre_eg",{bubbles:!0}),EVE.timbreEnv={debug:!0,scope:document.getElementById("timbre-env"),update:function(e){"use strict";var t;e.target&&e.target.dataset&&e.target.dataset.program&&(t=e.target.dataset.program),EVE.timbreEnv.debug&&console&&console.log(t,EVE.program[t])}},EVE.timbreEnv.scope.addEventListener("update_timbre_env",EVE.timbreEnv.update),EVE.update_timbre_env=new CustomEvent("update_timbre_env",{bubbles:!0}),function(){"use strict";var e,t,o;for(EVE.lfo1=EVE.synth.createOscillator(),EVE.lfo1.frequency.value=EVE.program.lfo1_rate,EVE.lfo1.type=EVE.program.lfo1_type,e=1;e<=EVE.config.harmonics;e+=1)o="osc"+e,t=o+"_lfo",EVE[t]=EVE.synth.createGain(),EVE[t].gain.value=EVE.program[t],EVE.lfo1.connect(EVE[t]),EVE[t].connect(EVE.harmonicOsc[o].vca.gain)}(),EVE.lfo1.debug=!0,EVE.lfo1.scope=document.getElementById("lfo1"),EVE.lfo1.update=function(e){"use strict";var t;switch(e.target&&e.target.dataset&&e.target.dataset.program&&(t=e.target.dataset.program),EVE.lfo1.debug&&console&&console.log(t,EVE.program[t]),t){case"lfo1_type":EVE.lfo1.type=EVE.program.lfo1_type;break;case"lfo1_rate":EVE.lfo1.frequency.setValueAtTime(EVE.program.lfo1_rate*EVE.harmonicOsc.osc1.frequency.value,EVE.now());break;case"osc1_lfo":case"osc2_lfo":case"osc3_lfo":case"osc4_lfo":case"osc5_lfo":case"osc6_lfo":case"osc7_lfo":case"osc8_lfo":EVE[t].gain.setValueAtTime(EVE.program[t],EVE.now());break;default:EVE.lfo1.debug&&console&&console.log("Unhandled LFO 1 update change")}},EVE.lfo1.scope.addEventListener("update_lfo1",EVE.lfo1.update),EVE.update_lfo1=new CustomEvent("update_lfo1",{bubbles:!0}),function(){"use strict";var e;for(EVE.lfo2=EVE.synth.createOscillator(),EVE.lfo2.frequency.value=EVE.program.lfo2_rate,EVE.lfo2.type=EVE.program.lfo2_type,EVE.lfo2_amp=EVE.synth.createGain(),EVE.lfo2_amp.gain.value=EVE.program.lfo2_amp,EVE.lfo2_pitch=EVE.synth.createGain(),EVE.lfo2_pitch.gain.value=EVE.program.lfo2_pitch,EVE.lfo2.connect(EVE.lfo2_amp),EVE.lfo2.connect(EVE.lfo2_pitch),EVE.lfo2_amp.connect(EVE.harmonicOsc.mixer.gain),e=1;e<EVE.config.harmonics;e+=1)EVE.lfo2_pitch.connect(EVE.harmonicOsc["osc"+e].frequency);EVE.program.lfo1_track&&EVE.lfo2_pitch.connect(EVE.lfo1.frequency)}(),EVE.lfo2.debug=!0,EVE.lfo2.scope=document.getElementById("lfo2"),EVE.lfo2.update=function(e){"use strict";var t;switch(e.target&&e.target.dataset&&e.target.dataset.program&&(t=e.target.dataset.program),EVE.lfo2.debug&&console&&console.log(t,EVE.program[t]),t){case"lfo2_amp":EVE.lfo2_amp.gain.setValueAtTime(EVE.program.lfo2_amp,EVE.now());break;case"lfo2_pitch":EVE.lfo2_pitch.gain.setValueAtTime(EVE.program.lfo2_pitch*EVE.config.masterFreq,EVE.now());break;case"lfo2_rate":EVE.lfo2.frequency.setValueAtTime(EVE.program.lfo2_rate*EVE.config.lfo_max,EVE.now());break;case"lfo2_type":EVE.lfo2.type=EVE.program.lfo2_type;break;default:EVE.lfo2.debug&&console&&console.log("Unhandled LFO 2 update change")}},EVE.lfo2.scope.addEventListener("update_lfo2",EVE.lfo2.update),EVE.update_lfo2=new CustomEvent("update_lfo2",{bubbles:!0}),function(){"use strict";function e(){var t;for(t=1;t<=EVE.config.harmonics;t+=1)EVE.harmonicOsc["osc"+t].start(0);EVE.lfo1.start(0),EVE.lfo2.start(0),document.removeEventListener("click",e),document.removeEventListener("dblclick",e),document.removeEventListener("keydown",e),document.removeEventListener("touchstart",e),document.removeEventListener("wheel",e)}document.addEventListener("click",e),document.addEventListener("dblclick",e),document.addEventListener("keydown",e),document.addEventListener("touchstart",e),document.addEventListener("wheel",e)}(),EVE.slider={debug:!0,grab:function(e){"use strict";var t=this.dataset.program,o="update_"+this.parentElement.parentElement.parentElement.dataset.update,a="lin"===this.dataset.curve?1:this.value;EVE.program[t]=this.value*a,EVE.slider.debug&&console&&(console.dir(e.target),console.log("Updating",o)),this.dispatchEvent(EVE[o])}},function(){"use strict";var e,t=document.querySelectorAll("input[type=range]");for(e=0;e<t.length;e+=1)t[e].addEventListener("input",EVE.slider.grab)}(),EVE.knob={currentKnob:null,debug:!0,test:function(){"use strict";console.log("AMAZING INPUT -- input event")},grab:function(e){"use strict";EVE.knob.grab.origin={x:e.pageX,y:e.pageY},EVE.knob.currentKnob=this,document.addEventListener("mousemove",EVE.knob.twist),document.addEventListener("touchmove",EVE.knob.twist)},rotate:function(){"use strict";var e=null;EVE.knob.currentKnob.style.webkitTransform=e,EVE.knob.currentKnob.style.transform=e},twist:function(e){"use strict";var t=e.pageY-EVE.knob.grab.origin.y,o="rotate("+t+"deg)",a=document.getElementById("test");EVE.knob.debug&&console&&(console.log("Difference y",t),console.dir(a),a.stepUp(e.pageY-EVE.knob.grab.origin.y),a.addEventListener("change",function(){console.log("THE INPUT HAS CHANGED")})),e.preventDefault(),EVE.knob.currentKnob.style.mozTransform=o,EVE.knob.currentKnob.style.webkitTransform=o,EVE.knob.currentKnob.style.transform=o,document.addEventListener("mouseup",EVE.knob.release),document.addEventListener("touchend",EVE.knob.release)},release:function(){"use strict";console.log("Knob released"),document.removeEventListener("mousemove",EVE.knob.twist),document.removeEventListener("mouseup",EVE.knob.release),document.removeEventListener("touchmove",EVE.knob.twist),document.removeEventListener("touchend",EVE.knob.release)}},EVE.button={debug:!0,press:function(){"use strict";var e=this.name,t="update_"+this.parentElement.parentElement.dataset.update;EVE.program[e]!==this.value&&(EVE.program[e]=this.value),EVE.button.debug&&console&&console.log("Updating",t),this.dispatchEvent(EVE[t])}},function(){"use strict";var e,t=document.querySelectorAll("input[type=radio]");for(e=0;e<t.length;e+=1)t[e].addEventListener("change",EVE.button.press)}(),EVE.calculatePitch=function(e){"use strict";var t=1200*EVE.keyboard.octaveShift+parseFloat(e);return 0===e&&console.log("NOTE IS ZERO EXACTLY"),EVE.calculatePitch.debug===!0&&console&&(console.log("Pitch: ",t),console.log("note:",e)),EVE.setPitch(t)},EVE.calculatePitch.debug=!0,EVE.setPitch=function(e){"use strict";var t;for(t=1;8>=t;t+=1)EVE.harmonicOsc["osc"+t].detune.setValueAtTime(e,EVE.now());EVE.program.lfo1_track&&EVE.lfo1.detune.setValueAtTime(e,EVE.now())},EVE.setPitch.debug=!0,EVE.gateOn=function(e,t){"use strict";var o,a,E,n,r,c=EVE.now()+EVE.program.vca_a+EVE.config.eg_minimum,s=EVE.now()+EVE.program.timbre_a+EVE.config.eg_minimum;for(E=t||0===t?t:e.target.dataset.noteValue,a=1;8>=a;a+=1)o=EVE.program["osc"+a+"_eg"],n=EVE.program["osc"+a],r=EVE.harmonicOsc["osc"+a].vca,r.gain.setTargetAtTime(n,EVE.now(),.1),r.gain.linearRampToValueAtTime(n+o,s),r.gain.setTargetAtTime(n+o*EVE.program.timbre_s,s,EVE.program.timbre_d);return EVE.vca.gain.setTargetAtTime(EVE.program.vca_g,EVE.now(),.1),EVE.vca.gain.linearRampToValueAtTime(1,c),EVE.vca.gain.setTargetAtTime(EVE.program.vca_s+EVE.program.vca_g,c,EVE.program.vca_d),EVE.calculatePitch(E)},EVE.keyboard.scope.addEventListener("mousedown",EVE.gateOn),EVE.keyboard.scope.addEventListener("touchstart",EVE.gateOn),EVE.gateOff=function(){"use strict";var e,t,o,a=EVE.vca.gain.value;for(o=1;8>=o;o+=1)t=EVE.harmonicOsc["osc"+o].vca,t.gain.cancelScheduledValues(EVE.now()),e=t.gain.value,t.gain.setValueAtTime(e,EVE.now()),t.gain.setTargetAtTime(EVE.program["osc"+o],EVE.now(),EVE.program.timbre_r);EVE.vca.gain.cancelScheduledValues(EVE.synth.currentTime),EVE.vca.gain.setValueAtTime(a,EVE.synth.currentTime),EVE.vca.gain.setTargetAtTime(EVE.program.vca_g,EVE.synth.currentTime,EVE.program.vca_r)},EVE.keyboard.scope.addEventListener("mouseup",EVE.gateOff),EVE.keyboard.scope.addEventListener("touchend",EVE.gateOff);