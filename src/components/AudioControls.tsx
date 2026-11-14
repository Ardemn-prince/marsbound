'use client';
import {useEffect,useState} from 'react';
import {MissionAudio} from '@/game/audio';
import {useMission} from '@/game/store';
import {forecast} from '@/game/forecast';
const engine=new MissionAudio();
let volumePreference=.5;
export function AudioRuntime(){useEffect(()=>{let beat=0;let previous=useMission.getState().mission;const unsubscribe=useMission.subscribe(({mission:m})=>{if(m.points>previous.points)engine.tone(660,.5,.1);else if(m.inventory.length>previous.inventory.length)engine.tone(440,.15,.12,'triangle');if(forecast(m.elapsed).active&&!forecast(previous.elapsed).active)engine.tone(220,.7,.12,'triangle');previous=m;});const interval=setInterval(()=>{const m=useMission.getState().mission;if(m.started&&!m.paused&&!m.panel&&!m.outcome&&!document.hidden)engine.ambient(m.region,forecast(m.elapsed).night,beat++);},3000);return()=>{unsubscribe();clearInterval(interval);engine.dispose();};},[]);return null;}
export default function AudioControls(){const [enabled,setEnabled]=useState(engine.enabled);const [volume,setVolume]=useState(volumePreference);const [error,setError]=useState('');return <div className="audio-controls"><button onClick={async()=>{if(enabled){engine.mute();setEnabled(false);}else try{await engine.enable();engine.volume(volume);setEnabled(true);setError('');}catch{setError('Audio is unavailable in this browser.');}}}>{enabled?'♫ Sound on':'♫ Sound off'}</button>{enabled&&<label>Volume<input aria-label="Audio volume" type="range" min="0" max="1" step=".05" value={volume} onChange={e=>{const v=Number(e.target.value);volumePreference=v;setVolume(v);engine.volume(v);}}/></label>}<span role="status">{error}</span></div>}
