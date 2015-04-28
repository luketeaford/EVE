function navTemplate(){"use strict";return!1}window.AudioContext=window.AudioContext||window.webkitAudioContext;var EVE={synth:new AudioContext,config:{harmonics:8,master_freq:440,octave_shift:0},program:{name:"INITIALIZE",osc1:1,osc2:0,osc3:0,osc4:0,osc5:0,osc6:0,osc7:0,osc8:0,vca_a:.1,vca_d:.1,vca_s:.15,vca_r:.1,vca_g:0},now:function(){"use strict";return EVE.synth.currentTime},attack:function(e){"use strict";return EVE.synth.currentTime+e},decay:function(){"use strict"},sustain:function(){"use strict"},release:function(){"use strict"}};EVE.events={update:new CustomEvent("update",{bubbles:!0}),press:new CustomEvent("press",{bubbles:!0}),navigate:new CustomEvent("navigate",{detail:{place:window.location},bubbles:!0})},EVE.buildSynth=function(){"use strict";function e(e){var t,n,a,o;for(t=0;e>t;t+=1)n=t+1,a="osc"+n,o=a+"_vca",EVE[o]=EVE.synth.createGain(),EVE[o].gain.setValueAtTime(EVE.program[a],EVE.now()),EVE[o].connect(EVE.vca),EVE[a]=EVE.synth.createOscillator(),EVE[a].type="sine",EVE[a].frequency.value=EVE.config.master_freq*n,EVE[a].connect(EVE[o]),EVE.harmonicOscs.push(EVE[a]),EVE.harmonicVcas.push(EVE[o])}return EVE.harmonicOscs=[],EVE.harmonicVcas=[],EVE.vca=EVE.synth.createGain(),EVE.vca.gain.setValueAtTime(0,EVE.now()),EVE.vca.connect(EVE.synth.destination),e(EVE.config.harmonics),EVE.buildSynth=function(){return console.warn("Synth already built"),"Synth already built"},!0},EVE.buildScope=function(){"use strict";function e(){var n,s,E,c=300/t,r=0;for(window.requestAnimationFrame(e),a.clearRect(0,0,300,150),a.lineWidth=2,a.strokeStyle="rgb(255, 255, 0)",a.beginPath(),EVE.oscilloscope.getByteTimeDomainData(o),n=0;t>n;n+=1)s=o[n]/128,E=150*s/2,0===n?a.moveTo(r,E):a.lineTo(r,E),r+=c;a.lineTo(300,75),a.stroke()}var t=2048,n=document.getElementById("scope"),a=n.getContext("2d"),o=new Uint8Array(t);EVE.oscilloscope=EVE.synth.createAnalyser(),EVE.vca.connect(EVE.oscilloscope),e(),EVE.buildScope=function(){return console.warn("buildScope already called"),"Scope already built"}},EVE.startSynth=function e(){"use strict";var t;for(t=0;t<EVE.config.harmonics;t+=1)EVE.harmonicOscs[t].start(0);document.removeEventListener("click",e),document.removeEventListener("dblclick",e),document.removeEventListener("keydown",e),document.removeEventListener("touchstart",e),document.removeEventListener("wheel",e),EVE.startSynth=function(){return console.warn("Synth can only be started once"),!0}},document.addEventListener("click",EVE.startSynth),document.addEventListener("dblclick",EVE.startSynth),document.addEventListener("keydown",EVE.startSynth),document.addEventListener("touchstart",EVE.startSynth),document.addEventListener("wheel",EVE.startSynth),EVE.gateOn=function(e){"use strict";function t(){var e=EVE.synth.currentTime+EVE.program.vca_a;EVE.vca.gain.linearRampToValueAtTime(1,e),EVE.vca.gain.setTargetAtTime(EVE.program.vca_s+EVE.program.vca_g,e,EVE.program.vca_d)}return EVE.vca.gain.setTargetAtTime(EVE.program.vca_g,EVE.synth.currentTime,.1),e.target.dataset.noteValue&&(e.target.dispatchEvent(EVE.events.press),console.log("Go calculate pitch")),t()},EVE.gateOff=function(){"use strict";function e(){var e=EVE.vca.gain.value;return EVE.vca.gain.setValueAtTime(e,EVE.synth.currentTime),EVE.vca.gain.setTargetAtTime(EVE.program.vca_g,EVE.synth.currentTime,EVE.program.vca_r)}return EVE.vca.gain.cancelScheduledValues(EVE.synth.currentTime),e()},EVE.calculatePitch=function(e){"use strict";var t;for(t=0;t<EVE.config.harmonics;t+=1)EVE.harmonicOscs[t].detune.setValueAtTime(e,EVE.synth.currentTime);console.log("calculatePitch called")},EVE.slider={grab:function(){"use strict";var e=this.dataset.program;EVE.program[e]=this.value,this.dispatchEvent(EVE.events.update)},update:function(e){"use strict";var t=e.target.dataset.program;switch(t){case"osc1":case"osc2":case"osc3":case"osc4":case"osc5":case"osc6":case"osc7":case"osc8":EVE[t+"_vca"].gain.setValueAtTime(EVE.program[t]*EVE.program[t],EVE.now())}}},function(){"use strict";var e,t=document.getElementById("harmonics"),n=t.getElementsByTagName("input");for(e=0;e<n.length;e+=1)n[e].addEventListener("input",EVE.slider.grab);console.log("Sliders bound")}(),function(){"use strict";navTemplate(),EVE.buildSynth(),EVE.buildScope(),EVE.keyboard=document.getElementById("keyboard"),EVE.keyboard.addEventListener("mousedown",EVE.gateOn),EVE.keyboard.addEventListener("touchstart",EVE.gateOn),EVE.keyboard.addEventListener("mouseup",EVE.gateOff),EVE.keyboard.addEventListener("touchend",EVE.gateOff),EVE.keyboard.addEventListener("press",function(e){EVE.calculatePitch(e.target.dataset.noteValue),console.log("Set note via custom event to",e.target.dataset.noteValue)}),document.addEventListener("update",EVE.slider.update)}(),function(){"use strict";function e(){this.parentElement.dataset.state="open"===this.parentElement.dataset.state?"closed":"open"}var t,n=document.querySelectorAll("section > h2, .toggle");for(t=0;t<n.length;t+=1)n[t].addEventListener("click",e)}(),EVE.testBuild=function(){"use strict";var e={page:"build"};history.pushState(e,"","build"),window.dispatchEvent(EVE.events.navigate),console.log("Test build called",history.state.page)},EVE.testRegister=function(){"use strict";var e={page:"register"};history.pushState(e,"","register"),window.dispatchEvent(EVE.events.navigate),console.log("Test register called",history.state.page)},EVE.historyChange=function(){"use strict";console.log("History pop state going on")},EVE.router=function(e){"use strict";switch(console.log("Router activated",history.state.page),history.state.page){case"build":console.log("Go to build page");break;case"register":console.log("Go to registration page"),console.dir(e);break;default:console.log("404 page, man.")}},window.addEventListener("popstate",EVE.historyChange),window.addEventListener("navigate",EVE.router);