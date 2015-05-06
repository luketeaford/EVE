function navTemplate(){"use strict";return!1}window.AudioContext=window.AudioContext||window.webkitAudioContext;var EVE={synth:new AudioContext,config:{harmonics:8,master_freq:440,octave_shift:0},program:{name:"INITIALIZE",osc1:1,osc2:0,osc3:0,osc4:0,osc5:0,osc6:0,osc7:0,osc8:0,env1:0,env2:0,env3:0,env4:0,env5:0,env6:0,env7:0,env8:0,timbre_a:.1,timbre_d:.1,timbre_s:1,timbre_r:.1,vca_a:.1,vca_d:.1,vca_s:.15,vca_r:.1,vca_g:0},keyboard:document.getElementById("keyboard"),now:function(){"use strict";return EVE.synth.currentTime}};EVE.events={update:new CustomEvent("update",{bubbles:!0}),navigate:new CustomEvent("navigate",{detail:{place:window.location},bubbles:!0})},EVE.buildSynth=function(){"use strict";function e(e){var t,a,n,E;for(t=0;e>t;t+=1)a=t+1,n="osc"+a,E=n+"_vca",EVE[E]=EVE.synth.createGain(),EVE[E].gain.setValueAtTime(EVE.program[n],EVE.now()),EVE[E].connect(EVE.vca),EVE[n]=EVE.synth.createOscillator(),EVE[n].type="sine",EVE[n].frequency.value=EVE.config.master_freq*a,EVE[n].connect(EVE[E]),EVE.harmonicOscs.push(EVE[n]),EVE.harmonicVcas.push(EVE[E])}return EVE.harmonicOscs=[],EVE.harmonicVcas=[],EVE.vca=EVE.synth.createGain(),EVE.vca.gain.setValueAtTime(0,EVE.now()),EVE.vca.connect(EVE.synth.destination),e(EVE.config.harmonics),EVE.buildSynth=function(){return console.warn("Synth already built"),"Synth already built"},!0},EVE.buildScope=function(){"use strict";function e(){var a,o,r,c=300/t,s=0;for(window.requestAnimationFrame(e),n.clearRect(0,0,300,150),n.lineWidth=2,n.strokeStyle="rgb(255, 255, 0)",n.beginPath(),EVE.oscilloscope.getByteTimeDomainData(E),a=0;t>a;a+=1)o=E[a]/128,r=150*o/2,0===a?n.moveTo(s,r):n.lineTo(s,r),s+=c;n.lineTo(300,75),n.stroke()}var t=2048,a=document.getElementById("scope"),n=a.getContext("2d"),E=new Uint8Array(t);EVE.oscilloscope=EVE.synth.createAnalyser(),EVE.vca.connect(EVE.oscilloscope),e(),EVE.buildScope=function(){return console.warn("buildScope already called"),"Scope already built"}},EVE.startSynth=function e(){"use strict";var t;for(t=0;t<EVE.config.harmonics;t+=1)EVE.harmonicOscs[t].start(0);document.removeEventListener("click",e),document.removeEventListener("dblclick",e),document.removeEventListener("keydown",e),document.removeEventListener("touchstart",e),document.removeEventListener("wheel",e),EVE.startSynth=function(){return console.warn("Synth can only be started once"),!0}},document.addEventListener("click",EVE.startSynth),document.addEventListener("dblclick",EVE.startSynth),document.addEventListener("keydown",EVE.startSynth),document.addEventListener("touchstart",EVE.startSynth),document.addEventListener("wheel",EVE.startSynth),EVE.gateOn=function(e){"use strict";var t,a=EVE.synth.currentTime+EVE.program.vca_a,n=1;for(t=1;t<EVE.config.harmonics+1;t+=1)EVE["osc"+t+"_vca"].gain.setTargetAtTime(EVE.program["osc"+t],EVE.now(),.1),EVE["osc"+t+"_vca"].gain.linearRampToValueAtTime(EVE.program["osc"+t]+n*Math.abs(EVE.program["env"+t]),EVE.now()+EVE.program.timbre_a),EVE["osc"+t+"_vca"].gain.setTargetAtTime(EVE.program["osc"+t]+EVE.program["env"+t]*EVE.program.timbre_s,EVE.now()+EVE.program.timbre_a,EVE.program.timbre_d);return EVE.vca.gain.setTargetAtTime(EVE.program.vca_g,EVE.now(),.1),EVE.vca.gain.linearRampToValueAtTime(1,a),EVE.vca.gain.setTargetAtTime(EVE.program.vca_s+EVE.program.vca_g,a,EVE.program.vca_d),EVE.calculatePitch(e.target.dataset.noteValue)},EVE.keyboard.addEventListener("mousedown",EVE.gateOn),EVE.keyboard.addEventListener("touchstart",EVE.gateOn),EVE.gateOff=function(){"use strict";var e,t,a=EVE.vca.gain.value;for(t=1;t<EVE.config.harmonics+1;t+=1)EVE["osc"+t+"_vca"].gain.cancelScheduledValues(EVE.now()),e=EVE["osc"+t+"_vca"].gain.value,EVE["osc"+t+"_vca"].gain.setValueAtTime(e,EVE.now()),EVE["osc"+t+"_vca"].gain.setTargetAtTime(EVE.program["osc"+t],EVE.now(),EVE.program.timbre_r);EVE.vca.gain.cancelScheduledValues(EVE.synth.currentTime),EVE.vca.gain.setValueAtTime(a,EVE.synth.currentTime),EVE.vca.gain.setTargetAtTime(EVE.program.vca_g,EVE.synth.currentTime,EVE.program.vca_r)},EVE.keyboard.addEventListener("mouseup",EVE.gateOff),EVE.keyboard.addEventListener("touchend",EVE.gateOff),EVE.calculatePitch=function(e){"use strict";var t;for(t=0;t<EVE.config.harmonics;t+=1)EVE.harmonicOscs[t].detune.setValueAtTime(e,EVE.synth.currentTime)},EVE.slider={grab:function(){"use strict";var e=this.dataset.program,t="lin"===this.dataset.curve?1:this.value;EVE.program[e]=this.value*t,this.dispatchEvent(EVE.events.update)},update:function(e){"use strict";var t=e.target.dataset.program;switch(t){case"osc1":case"osc2":case"osc3":case"osc4":case"osc5":case"osc6":case"osc7":case"osc8":EVE[t+"_vca"].gain.setValueAtTime(EVE.program[t],EVE.now());break;case"vca_g":EVE.vca.gain.setValueAtTime(EVE.program.vca_g,EVE.now())}}},function(){"use strict";var e,t=document.querySelectorAll("input[type=range]");for(e=0;e<t.length;e+=1)t[e].addEventListener("input",EVE.slider.grab)}(),function(){"use strict";navTemplate(),EVE.buildSynth(),EVE.buildScope(),document.addEventListener("update",EVE.slider.update)}(),function(){"use strict";function e(){this.parentElement.dataset.state="open"===this.parentElement.dataset.state?"closed":"open"}var t,a=document.querySelectorAll("section > h2, .toggle");for(t=0;t<a.length;t+=1)a[t].addEventListener("click",e)}(),EVE.testBuild=function(){"use strict";var e={page:"build"};history.pushState(e,"","build"),window.dispatchEvent(EVE.events.navigate),console.log("Test build called",history.state.page)},EVE.testRegister=function(){"use strict";var e={page:"register"};history.pushState(e,"","register"),window.dispatchEvent(EVE.events.navigate),console.log("Test register called",history.state.page)},EVE.historyChange=function(){"use strict";console.log("History pop state going on")},EVE.router=function(e){"use strict";switch(console.log("Router activated",history.state.page),history.state.page){case"build":console.log("Go to build page");break;case"register":console.log("Go to registration page"),console.dir(e);break;default:console.log("404 page, man.")}},window.addEventListener("popstate",EVE.historyChange),window.addEventListener("navigate",EVE.router);