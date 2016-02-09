window.AudioContext=window.AudioContext||window.webkitAudioContext;var EVE={config:{egMax:2.125,egMin:.05,masterFreq:440},synth:new AudioContext};!function(){"use strict";function e(){this.parentElement.dataset.state="open"===this.parentElement.dataset.state?"closed":"open"}var t,a=document.querySelectorAll("section > a");for(t=0;t<a.length;t+=1)a[t].addEventListener("click",e)}(),EVE.keyboard={current:null,debug:!1,keyDown:!1,octaveShift:0,scope:document.getElementById("keyboard"),shiftOctave:function(e){"use strict";function t(){var e,t=document.querySelectorAll("#performance [data-light]"),a=EVE.keyboard.octaveShift+2;for(e=0;e<t.length;e+=1)t[e].dataset.light=e===a?"on":"off"}var a=EVE.keyboard.octaveShift,E=this.dataset?this.dataset.shift:e;(a>-2&&0>E||2>a&&E>0)&&(EVE.keyboard.octaveShift=a+parseFloat(E),t()),EVE.keyboard.debug&&console&&console.log(EVE.keyboard.octaveShift)},pressBus:function(e){"use strict";switch(EVE.keyboard.debug&&console&&console.log(e.which),e.which){case 45:case 95:EVE.keyboard.shiftOctave(-1);break;case 61:case 43:EVE.keyboard.shiftOctave(1)}},downBus:function(e){"use strict";var t=null;switch(EVE.keyboard.debug&&console&&console.log("DOWN BUS",e.which),e.which){case 65:t=-2100;break;case 87:t=-2e3;break;case 83:t=-1900;break;case 69:t=-1800;break;case 68:t=-1700;break;case 70:t=-1600;break;case 84:t=-1500;break;case 71:t=-1400;break;case 89:t=-1300;break;case 72:t=-1200;break;case 85:t=-1100;break;case 74:t=-1e3;break;case 75:t=-900;break;case 79:t=-800;break;case 76:t=-700;break;case 80:t=-600;break;case 186:t=-500;break;case 222:t=-400;break;case 221:t=-300;break;case 192:console.log(EVE.program)}null!==t&&EVE.keyboard.current!==e.which&&(EVE.keyboard.keyDown===!1&&(EVE.keyboard.current=e.which,EVE.gateOn()),EVE.calculatePitch(t))},upBus:function(e){"use strict";e.which===EVE.keyboard.current&&(EVE.keyboard.current=null,EVE.gateOff())},touch:function(e){"use strict";EVE.keyboard.debug&&console&&console.log("Keyboard touched",e)}},function(){"use strict";var e,t=document.getElementsByClassName("shift-octave");for(e=0;e<t.length;e+=1)t[e].addEventListener("click",EVE.keyboard.shiftOctave),t[e].addEventListener("touchstart",EVE.keyboard.shiftOctave);document.addEventListener("keypress",EVE.keyboard.pressBus),document.addEventListener("keydown",EVE.keyboard.downBus),document.addEventListener("keyup",EVE.keyboard.upBus)}(),EVE.program={name:"INIT",osc1:1,osc2:0,osc3:0,osc4:0,osc5:0,osc6:0,osc7:0,osc8:0,osc1_eg:0,osc2_eg:0,osc3_eg:0,osc4_eg:0,osc5_eg:0,osc6_eg:0,osc7_eg:0,osc8_eg:0,timbre_a:0,timbre_d:.125,timbre_s:0,timbre_r:.125,lfo1_rate:1,lfo1_range:20,lfo1_type:"sine",osc1_lfo:0,osc2_lfo:0,osc3_lfo:0,osc4_lfo:0,osc5_lfo:0,osc6_lfo:0,osc7_lfo:0,osc8_lfo:0,lfo2_rate:3,lfo2_type:"sine",lfo2_amp:0,lfo2_pitch:0,lfo2_d:0,lfo2_a:0,lfo2_r:1e-4,lfo2_g:0,vca_a:0,vca_d:.1,vca_s:0,vca_r:.1,vca_g:0,glide:1e-6},EVE.program.bank=["init","cool-sci-fi-sound","problematic-patch","test-patch"],EVE.program.number=0,EVE.program.cycle=function(e){"use strict";var t=e&&0>e?-1:1,a=EVE.program.number+t;return a>=0&&a<=EVE.program.bank.length-1&&(EVE.program.number=a),console.log("EVE.program.number = ",EVE.program.number),console.log("PROGRAM:",EVE.program.bank[EVE.program.number]),t},EVE.program.cycleForward=EVE.program.cycle.bind(null,1),EVE.program.cycleBackward=EVE.program.cycle.bind(null,-1),function(){"use strict";var e=document.getElementById("nextProgram"),t=document.getElementById("prevProgram");e.addEventListener("click",EVE.program.cycleForward),t.addEventListener("click",EVE.program.cycleBackward)}(),EVE.now=function(){"use strict";return EVE.synth.currentTime},EVE.attack=function(e){"use strict";return EVE.now()+e},EVE.oscilloscope=EVE.synth.createAnalyser(),function(){"use strict";var e=2048,t=document.getElementById("scope"),a=t.getContext("2d"),E="rgb(53, 56, 55)",o=new Uint8Array(e);!function r(){var t,n,c,s=300/e,i=0;for(window.requestAnimationFrame(r),a.clearRect(0,0,300,150),a.lineWidth=2,a.strokeStyle=E,a.beginPath(),EVE.oscilloscope.getByteTimeDomainData(o),t=0;e>t;t+=1)n=o[t]/128,c=150*n/2,0===t?a.moveTo(i,c):a.lineTo(i,c),i+=s;a.lineTo(300,75),a.stroke()}()}(),EVE.vca=EVE.synth.createGain(),EVE.vca.gain.value=EVE.program.vca_g,EVE.vca.connect(EVE.synth.destination),EVE.vca.connect(EVE.oscilloscope),EVE.vca.debug=!0,EVE.vca.scope=document.getElementById("vca"),EVE.vca.update=function(e){"use strict";var t;e.target&&e.target.dataset&&e.target.dataset.program&&(t=e.target.dataset.program),EVE.vca.debug&&console&&console.log(t,EVE.program[t]),"vca_g"===t&&EVE.vca.gain.setValueAtTime(EVE.program.vca_g,EVE.now())},EVE.vca.scope.addEventListener("update_vca",EVE.vca.update),EVE.update_vca=new CustomEvent("update_vca",{bubbles:!0}),EVE.harmonicOsc={debug:!0,scope:document.getElementById("harmonics"),update:function(e){"use strict";var t;e.target&&e.target.dataset&&e.target.dataset.program&&(t=e.target.dataset.program),EVE.harmonicOsc.debug&&console&&console.log(t,EVE.program[t]),EVE.harmonicOsc[t].vca.gain.setValueAtTime(EVE.program[t],EVE.now())}},function(){"use strict";var e,t;for(EVE.harmonicOsc.mixer=EVE.synth.createGain(),EVE.harmonicOsc.mixer.gain.value=-1,e=1;8>=e;e+=1)t="osc"+e,EVE.harmonicOsc[t]=EVE.synth.createOscillator(),EVE.harmonicOsc[t].frequency.value=EVE.config.masterFreq*e,EVE.harmonicOsc[t].type="sine",EVE.harmonicOsc[t].vca=EVE.synth.createGain(),EVE.harmonicOsc[t].vca.gain.value=EVE.program[t],EVE.harmonicOsc[t].connect(EVE.harmonicOsc[t].vca),EVE.harmonicOsc[t].vca.connect(EVE.harmonicOsc.mixer),EVE.harmonicOsc.mixer.connect(EVE.vca)}(),EVE.harmonicOsc.scope.addEventListener("update_harmonic_osc",EVE.harmonicOsc.update),EVE.update_harmonic_osc=new CustomEvent("update_harmonic_osc",{bubbles:!0}),EVE.timbreEg={debug:!0,scope:document.getElementById("timbre-eg"),update:function(e){"use strict";var t;e.target&&e.target.dataset&&e.target.dataset.program&&(t=e.target.dataset.program),EVE.timbreEg.debug&&console&&console.log(t,EVE.program[t])}},EVE.timbreEg.scope.addEventListener("update_timbre_eg",EVE.timbreEg.update),EVE.update_timbre_eg=new CustomEvent("update_timbre_eg",{bubbles:!0}),EVE.timbreEnv={debug:!0,scope:document.getElementById("timbre-env"),update:function(e){"use strict";var t;e.target&&e.target.dataset&&e.target.dataset.program&&(t=e.target.dataset.program),EVE.timbreEnv.debug&&console&&console.log(t,EVE.program[t])}},EVE.timbreEnv.scope.addEventListener("update_timbre_env",EVE.timbreEnv.update),EVE.update_timbre_env=new CustomEvent("update_timbre_env",{bubbles:!0}),function(){"use strict";var e,t,a;for(EVE.lfo1=EVE.synth.createOscillator(),EVE.lfo1.frequency.value=EVE.program.lfo1_rate,EVE.lfo1.type=EVE.program.lfo1_type,e=1;8>=e;e+=1)a="osc"+e,t=a+"_lfo",EVE[t]=EVE.synth.createGain(),EVE[t].gain.value=EVE.program[t],EVE.lfo1.connect(EVE[t]),EVE[t].connect(EVE.harmonicOsc[a].vca.gain)}(),EVE.lfo1.debug=!0,EVE.lfo1.scope=document.getElementById("lfo1"),EVE.lfo1.update=function(e){"use strict";var t;switch(e.target&&e.target.dataset&&e.target.dataset.program&&(t=e.target.dataset.program),EVE.lfo1.debug&&console&&console.log(t,EVE.program[t]),t){case"lfo1_type":EVE.lfo1.type=EVE.program.lfo1_type;break;case"lfo1_range":case"lfo1_rate":EVE.lfo1.frequency.setValueAtTime(EVE.program.lfo1_rate*EVE.program.lfo1_range,EVE.now());break;case"osc1_lfo":case"osc2_lfo":case"osc3_lfo":case"osc4_lfo":case"osc5_lfo":case"osc6_lfo":case"osc7_lfo":case"osc8_lfo":EVE[t].gain.setValueAtTime(EVE.program[t],EVE.now());break;default:EVE.lfo1.debug&&console&&console.log("Unhandled LFO 1 update change")}},EVE.lfo1.scope.addEventListener("update_lfo1",EVE.lfo1.update),EVE.update_lfo1=new CustomEvent("update_lfo1",{bubbles:!0}),function(){"use strict";var e;for(EVE.lfo2=EVE.synth.createOscillator(),EVE.lfo2.frequency.value=EVE.program.lfo2_rate,EVE.lfo2.type=EVE.program.lfo2_type,EVE.lfo2_amp=EVE.synth.createGain(),EVE.lfo2_amp.gain.value=EVE.program.lfo2_amp,EVE.lfo2_pitch=EVE.synth.createGain(),EVE.lfo2_pitch.gain.value=EVE.program.lfo2_pitch,EVE.lfo2_vca=EVE.synth.createGain(),EVE.lfo2_vca.gain.value=0,EVE.lfo2.connect(EVE.lfo2_vca),EVE.lfo2_vca.connect(EVE.lfo2_amp),EVE.lfo2_vca.connect(EVE.lfo2_pitch),EVE.lfo2_amp.connect(EVE.harmonicOsc.mixer.gain),e=1;8>=e;e+=1)EVE.lfo2_pitch.connect(EVE.harmonicOsc["osc"+e].frequency);EVE.program.lfo1_track&&EVE.lfo2_pitch.connect(EVE.lfo1.frequency)}(),EVE.lfo2.debug=!0,EVE.lfo2.max=40,EVE.lfo2.scope=document.getElementById("lfo2"),EVE.lfo2.update=function(e){"use strict";var t;switch(e.target&&e.target.dataset&&e.target.dataset.program&&(t=e.target.dataset.program),EVE.lfo2.debug&&console&&console.log(t,EVE.program[t]),t){case"lfo2_amp":EVE.lfo2_amp.gain.setValueAtTime(EVE.program.lfo2_amp,EVE.now());break;case"lfo2_g":EVE.lfo2_vca.gain.setValueAtTime(EVE.program.lfo2_g,EVE.now());break;case"lfo2_pitch":EVE.lfo2_pitch.gain.setValueAtTime(139*EVE.program.lfo2_pitch,EVE.now());break;case"lfo2_rate":EVE.lfo2.frequency.setValueAtTime(EVE.program.lfo2_rate*EVE.lfo2.max,EVE.now());break;case"lfo2_type":EVE.lfo2.type=EVE.program.lfo2_type;break;default:EVE.lfo2.debug&&console&&console.log("Unhandled LFO 2 update change")}},EVE.lfo2.scope.addEventListener("update_lfo2",EVE.lfo2.update),EVE.update_lfo2=new CustomEvent("update_lfo2",{bubbles:!0}),EVE.performance={},EVE.performance.debug=!0,EVE.performance.scope=document.getElementById("performance"),EVE.performance.update=function(e){"use strict";var t;switch(e.target&&e.target.dataset&&e.target.dataset.program&&(t=e.target.dataset.program),EVE.performance.debug&&console&&console.log(t,EVE.program[t]),t){case"glide":EVE.program.glide=.165*EVE.program.glide,EVE.performance.debug&&console&&console.log("Glide updated to",EVE.program.glide);break;default:EVE.performance.debug&&console&&console.log("Unhandled performance update change")}},EVE.performance.scope.addEventListener("update_performance",EVE.performance.update),EVE.update_performance=new CustomEvent("update_performance",{bubbles:!0}),function(){"use strict";function e(){var t;for(t=1;8>=t;t+=1)EVE.harmonicOsc["osc"+t].start(0);EVE.lfo1.start(0),EVE.lfo2.start(0),document.removeEventListener("click",e),document.removeEventListener("keydown",e),document.removeEventListener("mousedown",e),document.removeEventListener("touchend",e)}document.addEventListener("click",e),document.addEventListener("keydown",e),document.addEventListener("mousedown",e),document.addEventListener("touchend",e)}(),EVE.slider={debug:!1,grab:function(){"use strict";var e=this.dataset.program,t="update_"+this.parentElement.parentElement.parentElement.dataset.update,a="lin"===this.dataset.curve?1:this.value;EVE.program[e]=this.value*a,EVE.slider.debug&&console&&console.log("Updating",t),this.dispatchEvent(EVE[t])}},function(){"use strict";var e,t=document.querySelectorAll("input[type=range]");for(e=0;e<t.length;e+=1)t[e].addEventListener("input",EVE.slider.grab)}(),EVE.knob={currentKnob:null,debug:!0,test:function(){"use strict";EVE.knob.debug&&console&&console.log("AMAZING INPUT -- input event")},grab:function(e){"use strict";EVE.knob.grab.origin={x:e.pageX,y:e.pageY},EVE.knob.currentKnob=this,document.addEventListener("mousemove",EVE.knob.twist),document.addEventListener("touchmove",EVE.knob.twist)},rotate:function(){"use strict";var e=null;EVE.knob.currentKnob.style.webkitTransform=e,EVE.knob.currentKnob.style.transform=e},twist:function(e){"use strict";var t=e.pageY-EVE.knob.grab.origin.y,a="rotate("+t+"deg)",E=document.getElementById("test");EVE.knob.debug&&console&&(console.log("Difference y",t),E.stepUp(e.pageY-EVE.knob.grab.origin.y),E.addEventListener("change",function(){console.log("THE INPUT HAS CHANGED")})),e.preventDefault(),EVE.knob.currentKnob.style.mozTransform=a,EVE.knob.currentKnob.style.webkitTransform=a,EVE.knob.currentKnob.style.transform=a,document.addEventListener("mouseup",EVE.knob.release),document.addEventListener("touchend",EVE.knob.release)},release:function(){"use strict";console&&console.log("Knob released"),document.removeEventListener("mousemove",EVE.knob.twist),document.removeEventListener("mouseup",EVE.knob.release),document.removeEventListener("touchmove",EVE.knob.twist),document.removeEventListener("touchend",EVE.knob.release)}},EVE.button={debug:!0,press:function(){"use strict";var e=this.name,t="update_"+this.parentElement.parentElement.parentElement.dataset.update;EVE.program[e]!==this.value&&(EVE.program[e]="string"!=typeof this.value||isNaN(this.value-1)?this.value:parseFloat(this.value)),EVE.button.debug&&console&&console.log("Updating",t),this.dispatchEvent(EVE[t])}},function(){"use strict";var e,t=document.querySelectorAll("input[type=radio]");for(e=0;e<t.length;e+=1)t[e].addEventListener("change",EVE.button.press)}(),EVE.calculatePitch=function(e){"use strict";var t=e.target?e.target.dataset.noteValue:e,a=1200*EVE.keyboard.octaveShift+parseFloat(t);return EVE.setPitch(a)},EVE.calculatePitch.debug=!0,EVE.keyboard.scope.addEventListener("mousedown",EVE.calculatePitch),EVE.keyboard.scope.addEventListener("touchstart",EVE.calculatePitch),EVE.setPitch=function(e){"use strict";var t;for(t=1;8>=t;t+=1)EVE.harmonicOsc["osc"+t].detune.setTargetAtTime(e,EVE.now(),EVE.program.glide);EVE.program.lfo1_range>=440&&EVE.lfo1.detune.setValueAtTime(e,EVE.now(),EVE.program.glide)},EVE.setPitch.debug=!0,EVE.gateOn=function(){"use strict";var e,t,a,E,o=EVE.now()+EVE.program.vca_a*EVE.config.egMax+EVE.config.egMin,r=EVE.now()+EVE.program.timbre_a*EVE.config.egMax+EVE.config.egMin;for(EVE.keyboard.keyDown=!0,EVE.lfo2_vca.gain.setTargetAtTime(EVE.program.lfo2_g,EVE.now(),.1),EVE.lfo2_vca.gain.setTargetAtTime(1,EVE.now()+EVE.program.lfo2_d*EVE.config.egMax,EVE.program.lfo2_a*EVE.config.egMax+EVE.config.egMin),t=1;8>=t;t+=1)e=EVE.program["osc"+t+"_eg"],a=EVE.program["osc"+t],E=EVE.harmonicOsc["osc"+t].vca,E.gain.setTargetAtTime(a,EVE.now(),.1),E.gain.linearRampToValueAtTime(a+e,r),E.gain.setTargetAtTime(a+e*EVE.program.timbre_s,r,EVE.program.timbre_d*EVE.config.egMax);EVE.vca.gain.setTargetAtTime(EVE.program.vca_g,EVE.now(),.1),EVE.vca.gain.linearRampToValueAtTime(1,EVE.synth.currentTime+EVE.program.vca_a+EVE.config.egMin*EVE.config.egMax),EVE.vca.gain.setTargetAtTime(EVE.program.vca_s+EVE.program.vca_g,o,EVE.program.vca_d*EVE.config.egMax)},EVE.keyboard.scope.addEventListener("mousedown",EVE.gateOn),EVE.keyboard.scope.addEventListener("touchstart",EVE.gateOn),EVE.gateOff=function(){"use strict";var e,t,a,E=EVE.lfo2_vca.gain.value,o=EVE.vca.gain.value;for(EVE.keyboard.keyDown=!1,EVE.lfo2_vca.gain.cancelScheduledValues(EVE.now()),EVE.lfo2_vca.gain.setValueAtTime(E,EVE.now()),EVE.lfo2_vca.gain.setTargetAtTime(EVE.program.lfo2_g,EVE.now(),EVE.program.lfo2_r),e=1;8>=e;e+=1)a=EVE.harmonicOsc["osc"+e].vca,a.gain.cancelScheduledValues(EVE.now()),t=a.gain.value,a.gain.setValueAtTime(t,EVE.now()),a.gain.setTargetAtTime(EVE.program["osc"+e],EVE.now(),EVE.program.timbre_r);EVE.vca.gain.cancelScheduledValues(EVE.synth.currentTime),EVE.vca.gain.setValueAtTime(o,EVE.synth.currentTime),EVE.vca.gain.setTargetAtTime(EVE.program.vca_g,EVE.synth.currentTime,EVE.program.vca_r*EVE.config.egMax+EVE.config.egMin)},EVE.keyboard.scope.addEventListener("mouseup",EVE.gateOff),EVE.keyboard.scope.addEventListener("touchend",EVE.gateOff),navigator.requestMIDIAccess&&(EVE.midi={active:null,debug:!1,devices:[],messages:{listen:254,noteOn:144,noteOff:128,pitchWheel:224},getDevices:function(){"use strict";return navigator.requestMIDIAccess().then(function(e){var t,a=[],E=e.inputs.entries();for(t=E.next();t&&!t.done;t=E.next())a.push(t.value[1]);return EVE.midi.debug&&console&&console.log("Available Devices:",a),a})}},EVE.midi.events=function(e){"use strict";var t=e.data[1];switch(e.data[0]){case EVE.midi.messages.listen:break;case EVE.midi.messages.noteOn:e.data[2]>=1?(null===EVE.midi.active&&(EVE.midi.active=t,EVE.gateOn()),EVE.calculatePitch(EVE.midi.toCents(t))):EVE.midi.active===t?(EVE.midi.active=null,EVE.gateOff()):EVE.calculatePitch(EVE.midi.toCents(EVE.midi.active));break;case EVE.midi.messages.noteOff:EVE.midi.active=null,EVE.gateOff();break;case EVE.midi.messages.pitchWheel:break;default:EVE.midi.debug&&console&&console.log("Unrecognized MIDI event",e.data)}},EVE.midi.getDevices().then(function(e){"use strict";var t=0;for(EVE.midi.devices=e,t;t<e.length;t+=1)EVE.midi.devices[t].onmidimessage=EVE.midi.events}),EVE.midi.toCents=function(e){"use strict";return 100*(e-69)});