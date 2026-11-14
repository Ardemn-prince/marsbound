import { create } from 'zustand';
import type { InputManager } from '@/engine/input';
import { newMission,type Mission } from './model';
import { movePlayer,nearest } from './player';
import { obstacles,regionAt,loadRegion } from './world';
import { facilityWalls,shelterAt,stations } from './base';
import { samples,collect,startScan,tickResearch } from './research';
import { tickRex } from './rex';
import { tickHazards,deployBeacon } from './hazards';
import { tickSurvival,toggleRover,service } from './survival';
export const useMission=create<{mission:Mission;step:(dt:number,input:InputManager)=>void;interact:()=>void;togglePause:()=>void;openPanel:(panel:string|null)=>void;toggleCircuit:(key:keyof Mission['circuits'])=>void}>( (set,get)=>({
  mission:newMission(),
  togglePause:()=>set(s=>({mission:{...s.mission,paused:!s.mission.paused}})),
  openPanel:panel=>set(s=>({mission:{...s.mission,panel}})),
  toggleCircuit:key=>set(s=>({mission:{...s.mission,circuits:{...s.mission.circuits,[key]:!s.mission.circuits[key]}}})),
  interact:()=>{const m=get().mission;if(m.paused||m.outcome)return;const serviced=service(m);if(serviced!==m){set({mission:serviced});return;}const sample=nearest(m.player,samples.filter(s=>!m.collected.includes(s.id)),52);if(sample){set({mission:collect(m,sample)});return;}const target=nearest(m.player,stations);if(target?.id==='lab'&&m.shelter==='lab'){set({mission:startScan(m)});return;}set({mission:{...m,player:{...m.player,action:.5},panel:target?.id??null,message:target?`${target.name}: facility ready. You are sheltered inside the walls.`:'Move closer to a marked sample or walk into a facility.'}});},
  step:(dt,input)=>{if(input.consume('escape'))get().togglePause();if(input.consume('e'))get().interact();let m=get().mission;if(m.paused||m.outcome)return;if(input.consume('f'))m={...m,flashlight:!m.flashlight};if(input.consume('k'))m=deployBeacon(m);if(input.consume('v'))m=toggleRover(m);if(input.consume('p'))m={...m,panel:m.panel==='power'?null:'power'};
    const player=movePlayer(m.player,{x:Number(input.isDown('d','arrowright'))-Number(input.isDown('a','arrowleft')),y:Number(input.isDown('s','arrowdown'))-Number(input.isDown('w','arrowup')),dash:!m.riding&&input.isDown('shift')},dt*(m.riding?1.8:1),[...obstacles,...facilityWalls]);
    const region=regionAt(player);loadRegion(region.id);const explored=m.explored.includes(region.id)?m.explored:[...m.explored,region.id];
    set({mission:tickHazards(tickRex(tickResearch(tickSurvival({...m,player,rover:m.riding?{x:player.x,y:player.y}:m.rover,shelter:shelterAt(player),elapsed:m.elapsed+dt,region:region.id,explored,message:m.region!==region.id?`Entering ${region.name}. ${region.subtitle}.`:m.message},dt),dt),dt),dt)});
  }
}));
