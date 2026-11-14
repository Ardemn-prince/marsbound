import { create } from 'zustand';
import type { InputManager } from '@/engine/input';
import { newMission,type Mission } from './model';
import { movePlayer,nearest } from './player';
import { obstacles,regionAt,loadRegion } from './world';
import { facilityWalls,shelterAt,stations } from './base';
import { samples,collect,startScan,tickResearch } from './research';
import { tickRex } from './rex';
export const useMission=create<{mission:Mission;step:(dt:number,input:InputManager)=>void;interact:()=>void;togglePause:()=>void;openPanel:(panel:string|null)=>void}>( (set,get)=>({
  mission:newMission(),
  togglePause:()=>set(s=>({mission:{...s.mission,paused:!s.mission.paused}})),
  openPanel:panel=>set(s=>({mission:{...s.mission,panel}})),
  interact:()=>{const m=get().mission;if(m.paused)return;const sample=nearest(m.player,samples.filter(s=>!m.collected.includes(s.id)),52);if(sample){set({mission:collect(m,sample)});return;}const target=nearest(m.player,stations);if(target?.id==='lab'&&m.shelter==='lab'){set({mission:startScan(m)});return;}set({mission:{...m,player:{...m.player,action:.5},panel:target?.id??null,message:target?`${target.name}: facility ready. You are sheltered inside the walls.`:'Move closer to a marked sample or walk into a facility.'}});},
  step:(dt,input)=>{if(input.consume('escape'))get().togglePause();if(input.consume('e'))get().interact();let m=get().mission;if(m.paused)return;if(input.consume('f'))m={...m,flashlight:!m.flashlight};
    const player=movePlayer(m.player,{x:Number(input.isDown('d','arrowright'))-Number(input.isDown('a','arrowleft')),y:Number(input.isDown('s','arrowdown'))-Number(input.isDown('w','arrowup')),dash:input.isDown('shift')},dt,[...obstacles,...facilityWalls]);
    const region=regionAt(player);loadRegion(region.id);const explored=m.explored.includes(region.id)?m.explored:[...m.explored,region.id];
    set({mission:tickRex(tickResearch({...m,player,shelter:shelterAt(player),elapsed:m.elapsed+dt,region:region.id,explored,message:m.region!==region.id?`Entering ${region.name}. ${region.subtitle}.`:m.message},dt),dt)});
  }
}));
