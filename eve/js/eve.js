function navTemplate(){"use strict";return!1}window.AudioContext=window.AudioContext||window.webkitAudioContext;var EVE={synth:new AudioContext,config:{harmonics:8,master_freq:440,octave_shift:0},program:{name:"INITIALIZE",osc1:1,osc2:0,osc3:0,osc4:0,osc5:0,osc6:0,osc7:0,osc8:0,env1:0,env2:0,env3:0,env4:0,env5:0,env6:0,env7:0,env8:0,env_a:.1,env_d:.1,env_s:1,env_r:.1,vca_a:.1,vca_d:.1,vca_s:.15,vca_r:.1,vca_g:0},keyboard:document.getElementById("keyboard"),now:function(){"use strict";return EVE.synth.currentTime}};EVE.events={update:new CustomEvent("update",{bubbles:!0}),navigate:new CustomEvent("navigate",{detail:{place:window.location},bubbles:!0})},EVE.buildSynth=function(){"use strict";function e(e){var t,n,a,E;for(t=0;e>t;t+=1)n=t+1,a="osc"+n,E=a+"_vca",EVE[E]=EVE.synth.createGain(),EVE[E].gain.setValueAtTime(EVE.program[a],EVE.now()),EVE[E].connect(EVE.vca),EVE[a]=EVE.synth.createOscillator(),EVE[a].type="sine",EVE[a].frequency.value=EVE.config.master_freq*n,EVE[a].connect(EVE[E]),EVE.harmonicOscs.push(EVE[a]),EVE.harmonicVcas.push(EVE[E])}return EVE.harmonicOscs=[],EVE.harmonicVcas=[],EVE.vca=EVE.synth.createGain(),EVE.vca.gain.setValueAtTime(0,EVE.now()),EVE.vca.connect(EVE.synth.destination),e(EVE.config.harmonics),EVE.buildSynth=function(){return console.warn("Synth already built"),"Synth already built"},!0},EVE.buildScope=function(){"use strict";function e(){var n,o,r,s=300/t,c=0;for(window.requestAnimationFrame(e),a.clearRect(0,0,300,150),a.lineWidth=2,a.strokeStyle="rgb(255, 255, 0)",a.beginPath(),EVE.oscilloscope.getByteTimeDomainData(E),n=0;t>n;n+=1)o=E[n]/128,r=150*o/2,0===n?a.moveTo(c,r):a.lineTo(c,r),c+=s;a.lineTo(300,75),a.stroke()}var t=2048,n=document.getElementById("scope"),a=n.getContext("2d"),E=new Uint8Array(t);EVE.oscilloscope=EVE.synth.createAnalyser(),EVE.vca.connect(EVE.oscilloscope),e(),EVE.buildScope=function(){return console.warn("buildScope already called"),"Scope already built"}},EVE.startSynth=function e(){"use strict";var t;for(t=0;t<EVE.config.harmonics;t+=1)EVE.harmonicOscs[t].start(0);document.removeEventListener("click",e),document.removeEventListener("dblclick",e),document.removeEventListener("keydown",e),document.removeEventListener("touchstart",e),document.removeEventListener("wheel",e),EVE.startSynth=function(){return console.warn("Synth can only be started once"),!0}},document.addEventListener("click",EVE.startSynth),document.addEventListener("dblclick",EVE.startSynth),document.addEventListener("keydown",EVE.startSynth),document.addEventListener("touchstart",EVE.startSynth),document.addEventListener("wheel",EVE.startSynth),EVE.gateOn=function(e){"use strict";var t,n=EVE.synth.currentTime+EVE.program.vca_a;for(t=1;t<EVE.config.harmonics+1;t+=1)EVE["osc"+t+"_vca"].gain.setTargetAtTime(EVE.program["osc"+t],EVE.now(),.1),EVE["osc"+t+"_vca"].gain.linearRampToValueAtTime(EVE.program["osc"+t],EVE.synth.currentTime+EVE.program.env_a),EVE["osc"+t+"_vca"].gain.setTargetAtTime(EVE.program["osc"+t],EVE.synth.currentTime+EVE.program.env_a,EVE.program.env_d);return EVE.vca.gain.setTargetAtTime(EVE.program.vca_g,EVE.synth.currentTime,.1),EVE.vca.gain.linearRampToValueAtTime(1,n),EVE.vca.gain.setTargetAtTime(EVE.program.vca_s+EVE.program.vca_g,n,EVE.program.vca_d),EVE.calculatePitch(e.target.dataset.noteValue)},EVE.keyboard.addEventListener("mousedown",EVE.gateOn),EVE.keyboard.addEventListener("touchstart",EVE.gateOn),EVE.gateOff=function(){"use strict";var e=EVE.vca.gain.value;EVE.vca.gain.cancelScheduledValues(EVE.synth.currentTime),EVE.vca.gain.setValueAtTime(e,EVE.synth.currentTime),EVE.vca.gain.setTargetAtTime(EVE.program.vca_g,EVE.synth.currentTime,EVE.program.vca_r)},EVE.keyboard.addEventListener("mouseup",EVE.gateOff),EVE.keyboard.addEventListener("touchend",EVE.gateOff),EVE.calculatePitch=function(e){"use strict";var t;for(t=0;t<EVE.config.harmonics;t+=1)EVE.harmonicOscs[t].detune.setValueAtTime(e,EVE.synth.currentTime)},EVE.slider={grab:function(){"use strict";var e=this.dataset.program,t="lin"===this.dataset.curve?1:this.value;EVE.program[e]=this.value*t,this.dispatchEvent(EVE.events.update)},update:function(e){"use strict";var t=e.target.dataset.program;switch(t){case"osc1":case"osc2":case"osc3":case"osc4":case"osc5":case"osc6":case"osc7":case"osc8":EVE[t+"_vca"].gain.setValueAtTime(EVE.program[t],EVE.now());break;case"vca_g":EVE.vca.gain.setValueAtTime(EVE.program.vca_g,EVE.now())}}},function(){"use strict";var e,t=document.querySelectorAll("input[type=range]");for(e=0;e<t.length;e+=1)t[e].addEventListener("input",EVE.slider.grab)}(),function(){"use strict";navTemplate(),EVE.buildSynth(),EVE.buildScope(),document.addEventListener("update",EVE.slider.update)}(),function(){"use strict";function e(){this.parentElement.dataset.state="open"===this.parentElement.dataset.state?"closed":"open"}var t,n=document.querySelectorAll("section > h2, .toggle");for(t=0;t<n.length;t+=1)n[t].addEventListener("click",e)}(),EVE.testBuild=function(){"use strict";var e={page:"build"};history.pushState(e,"","build"),window.dispatchEvent(EVE.events.navigate),console.log("Test build called",history.state.page)},EVE.testRegister=function(){"use strict";var e={page:"register"};history.pushState(e,"","register"),window.dispatchEvent(EVE.events.navigate),console.log("Test register called",history.state.page)},EVE.historyChange=function(){"use strict";console.log("History pop state going on")},EVE.router=function(e){"use strict";switch(console.log("Router activated",history.state.page),history.state.page){case"build":console.log("Go to build page");break;case"register":console.log("Go to registration page"),console.dir(e);break;default:console.log("404 page, man.")}},window.addEventListener("popstate",EVE.historyChange),window.addEventListener("navigate",EVE.router);