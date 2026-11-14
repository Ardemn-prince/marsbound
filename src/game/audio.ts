/** Original synthesized audio; no downloads, microphone access or autoplay. */
export class MissionAudio {
  private context:AudioContext|null=null; private master:GainNode|null=null;
  enabled=false;
  async enable(){this.context??=new AudioContext();if(!this.master){this.master=this.context.createGain();this.master.connect(this.context.destination);}this.master.gain.value=.18;await this.context.resume();this.enabled=true;}
  mute(){this.enabled=false;if(this.master)this.master.gain.value=0;}
  volume(value:number){if(this.master)this.master.gain.value=this.enabled?value*.3:0;}
  tone(frequency:number,duration=.2,level=.12,type:OscillatorType='sine'){if(!this.enabled||!this.context||!this.master)return;const c=this.context,osc=c.createOscillator(),gain=c.createGain();osc.type=type;osc.frequency.value=frequency;gain.gain.setValueAtTime(0,c.currentTime);gain.gain.linearRampToValueAtTime(level,c.currentTime+.03);gain.gain.exponentialRampToValueAtTime(.001,c.currentTime+duration);osc.connect(gain);gain.connect(this.master);osc.start();osc.stop(c.currentTime+duration+.05);osc.onended=()=>{osc.disconnect();gain.disconnect();};}
  ambient(region:string,night:boolean,beat:number){const notes=region==='delta'?[146.83,174.61,220,261.63]:region==='margin'?[164.81,196,246.94,293.66]:[110,130.81,164.81,196];this.tone(notes[beat%4]*(night?.5:1),3,.035);this.tone(notes[(beat+2)%4]*.5,3,.025,'triangle');}
  dispose(){this.enabled=false;void this.context?.close();this.context=null;this.master=null;}
}
