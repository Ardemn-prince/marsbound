'use client';
import { useEffect } from 'react';
import { useMission } from '@/game/store';
import { saveMission } from '@/game/save';
import { SOL_SECONDS } from '@/game/forecast';
/** Never load or overwrite storage at mount: the player explicitly chooses Resume. */
export default function Persistence(){useEffect(()=>{let lastSol=0,lastShelter:string|null=null,lastSave=0;const save=()=>{const m=useMission.getState().mission;if(!m.started)return;const result=saveMission(m,'autosave');useMission.setState({saveStatus:result});lastSave=m.elapsed;};const unsubscribe=useMission.subscribe(({mission:m})=>{const sol=Math.floor(m.elapsed/SOL_SECONDS);const entering=!!m.shelter&&!lastShelter;const boundary=sol>lastSol;lastSol=sol;lastShelter=m.shelter;if(m.started&&(entering||boundary||m.elapsed-lastSave>=30)){lastSave=m.elapsed;save();}});const hidden=()=>{if(document.hidden)save();};window.addEventListener('pagehide',save);document.addEventListener('visibilitychange',hidden);return()=>{unsubscribe();window.removeEventListener('pagehide',save);document.removeEventListener('visibilitychange',hidden);};},[]);return null;}
