import test from 'node:test';
import assert from 'node:assert/strict';
import {MissionAudio} from '../src/game/audio';

test('recorded effects have bounded durations, no duplicate voices, and cancel stale loads',async()=>{
  const originalContext=globalThis.AudioContext,originalFetch=globalThis.fetch;
  const sources:{stopTimes:number[];started:boolean;onended:(()=>void)|null}[]=[];
  let release:(()=>void)|undefined;
  class FakeContext{
    currentTime=10;destination={};
    resume(){return Promise.resolve();}close(){return Promise.resolve();}
    createGain(){return {gain:{value:0,setValueAtTime(){},linearRampToValueAtTime(){},cancelScheduledValues(){},setTargetAtTime(){}},connect(){},disconnect(){}};}
    createBufferSource(){const source={stopTimes:[] as number[],started:false,onended:null as (()=>void)|null,buffer:null,connect(){},disconnect(){},start(){this.started=true;},stop(time:number){this.stopTimes.push(time);}};sources.push(source);return source;}
    decodeAudioData(){return Promise.resolve({duration:10});}
  }
  globalThis.AudioContext=FakeContext as unknown as typeof AudioContext;
  globalThis.fetch=(async()=>{await new Promise<void>(resolve=>{release=resolve;});return new Response(new ArrayBuffer(0));}) as typeof fetch;
  const engine=new MissionAudio();
  try{
    await engine.enable();
    engine.playFile('drill.wav',.5,.6);engine.playFile('drill.wav',.5,.6);
    release!();await new Promise(resolve=>setTimeout(resolve,0));
    assert.equal(sources.length,1,'concurrent requests create only one voice');
    assert.equal(sources[0].stopTimes[0],10.6,'ten-second source is capped to action duration');
    engine.stopFile('drill.wav');assert.equal(sources[0].stopTimes.at(-1),10.05,'action cancellation fades out within 50ms');
    engine.playFile('walk.wav',.5,.28);engine.stopFile('walk.wav');release!();await new Promise(resolve=>setTimeout(resolve,0));
    assert.equal(sources.length,1,'audio finishing loading after action stops must not play');
  }finally{engine.dispose();globalThis.AudioContext=originalContext;globalThis.fetch=originalFetch;}
});

test('rover loop reuses one player and stops immediately on dismount',async()=>{
  const originalAudio=globalThis.Audio;
  const players:FakeMedia[]=[];
  class FakeMedia{
    paused=true;ended=false;volume=0;loop=false;preload='';
    constructor(public src:string){players.push(this);}
    addEventListener(){}play(){this.paused=false;return Promise.resolve();}pause(){this.paused=true;}removeAttribute(){}load(){}
  }
  globalThis.Audio=FakeMedia as unknown as typeof Audio;
  const engine=new MissionAudio();engine.enabled=true;
  try{
    engine.setLoop('rover','mars_rover_move.wav',.07);
    engine.setLoop('rover','mars_rover_move.wav',.07);
    await new Promise(resolve=>setTimeout(resolve,100));
    assert.equal(players.length,1);assert.equal(players[0].paused,false);
    engine.stopLoop('rover');assert.equal(players[0].paused,true);assert.equal(players[0].volume,0);
    await new Promise(resolve=>setTimeout(resolve,100));assert.equal(players[0].paused,true,'mixer must not restart a stopped engine');
  }finally{engine.dispose();globalThis.Audio=originalAudio;}
});

test('enabling sound starts intro media inside the user gesture window',async()=>{
  const originalContext=globalThis.AudioContext,originalAudio=globalThis.Audio;
  const players:FakeMedia[]=[];
  class FakeContext{
    destination={};currentTime=0;
    createGain(){return {gain:{value:0},connect(){}};}
    resume(){return Promise.resolve();}close(){return Promise.resolve();}
  }
  class FakeMedia{
    paused=true;ended=false;volume=0;loop=false;preload='';plays=0;
    constructor(public src:string){players.push(this);}
    addEventListener(){}play(){this.plays++;this.paused=false;return Promise.resolve();}pause(){this.paused=true;}removeAttribute(){}load(){}
  }
  globalThis.AudioContext=FakeContext as unknown as typeof AudioContext;
  globalThis.Audio=FakeMedia as unknown as typeof Audio;
  const engine=new MissionAudio();
  try{
    engine.playMedia('The_Crimson_Reach.mp4',.85);
    await engine.enable();
    assert.equal(players.length,1);
    assert.equal(players[0].plays,1);
    assert.equal(players[0].volume,.425);
  }finally{engine.dispose();globalThis.AudioContext=originalContext;globalThis.Audio=originalAudio;}
});
