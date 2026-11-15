import { saveMission,loadMission } from './save';
import { create } from 'zustand';
import type { InputManager } from '@/engine/input';
import { newMission,type Mission } from './model';
import { movePlayer,nearest } from './player';
import { distance } from '@/engine/math';
import { obstacles,regionAt,loadRegion } from './world';
import { facilities,facilityWalls,shelterAt,stations,bed,greenhouseFoodStation,greenhouseOxygenStation } from './base';
import { samples,collect,startScan,tickResearch,fieldScan } from './research';
import { tickRex } from './rex';
import { tickHazards,deployBeacon } from './hazards';
import { launch,buyUpgrade,requestSupply,tickProgression } from './progression';
import { SLEEP_TIME_MULTIPLIER,canCollectSample,tickSurvival,toggleRover,service } from './survival';
export const useMission=create<{mission:Mission;saveStatus:string;save:()=>void;load:(slotId?:string)=>void;step:(dt:number,input:InputManager)=>void;interact:()=>void;togglePause:()=>void;openPanel:(panel:string|null)=>void;launch:(ids:string[],character?:string)=>void;buy:(id:string)=>void;supply:()=>void;toggleCircuit:(key:keyof Mission['circuits'])=>void}>( (set,get)=>({
  mission:newMission(),saveStatus:'Saves stay in this browser on this device.',
  save:()=>set({saveStatus:saveMission(get().mission)}),
  load:(slotId)=>{const result=loadMission(slotId);set({saveStatus:result.message,...(result.mission?{mission:result.mission}:{})});},
  launch:(ids,character)=>set({mission:launch(ids,character)}),
  buy:id=>set(s=>({mission:buyUpgrade(s.mission,id)})),
  supply:()=>set(s=>({mission:requestSupply(s.mission)})),
  togglePause:()=>set(s=>({mission:{...s.mission,paused:!s.mission.paused}})),
  openPanel:panel=>set(s=>({mission:{...s.mission,panel}})),
  toggleCircuit:key=>set(s=>({mission:{...s.mission,circuits:{...s.mission.circuits,[key]:!s.mission.circuits[key]}}})),
  interact:()=>{const m=get().mission;if(m.paused||m.outcome||!m.started||!!m.panel)return;if(distance(m.player,bed)<70&&m.shelter==='command'){if(!m.sleeping&&m.oxygen<=0){set({mission:{...m,message:'Oxygen empty! Refill at the greenhouse O₂ station before sleeping.'}});return;}if(m.sleep>=100){set({mission:{...m,message:'You are fully rested. The bed is ready when you need it.'}});return;}set({mission:{...m,sleeping:!m.sleeping,player:{...m.player,moving:false},message:m.sleeping?'You wake refreshed and ready to explore.':'Resting in the Command bed. Sleep recovers gradually.'}});return;}if(m.shelter==='greenhouse'){const oxygenNearby=distance(m.player,greenhouseOxygenStation)<65;const foodNearby=distance(m.player,greenhouseFoodStation)<65;if(!oxygenNearby&&!foodNearby){set({mission:{...m,message:'Choose the O₂ station to refill your suit or the FOOD station to eat.'}});return;}const serviced=service(m,foodNearby?'food':'oxygen');if(serviced!==m){set({mission:serviced});return;}}else{const serviced=service(m);if(serviced!==m){set({mission:serviced});return;}}const sample=nearest(m.player,samples.filter(s=>!m.collected.includes(s.id)),52);if(sample){if(!canCollectSample(m)){set({mission:{...m,message:'You are too tired to collect samples. Rest at the Command bed first.'}});return;}set({mission:collect(m,sample,4)});return;}const target=nearest(m.player,stations);if(target?.id==='lab'&&m.shelter==='lab'){set({mission:startScan(m)});return;}set({mission:{...m,player:{...m.player,action:.5},panel:target?.id??null,message:target?`${target.name}: facility ready. You are sheltered inside the walls.`:'Move closer to a sample, a rover, a stone, or a base console.'}});},
  step:(dt,input)=>{if(input.consume('escape')){if(get().mission.panel)get().openPanel(null);else if(get().mission.started)get().togglePause();input.clear();return;}if(input.consume('p')&&get().mission.started){get().openPanel(get().mission.panel==='power'?null:'power');input.clear();return;}for(const [key,panel] of [['m','map'],['c','workbench'],['j','journal']] as const){if(input.consume(key)&&get().mission.started&&!get().mission.paused){get().openPanel(get().mission.panel===panel?null:panel);input.clear();return;}}if(input.consume('e'))get().interact();let m=get().mission;if(m.paused||m.outcome||!m.started||m.panel){input.clear();return;}if(input.consume('q'))m=fieldScan(m);if(input.consume('f'))m={...m,flashlight:!m.flashlight};if(input.consume('k'))m=deployBeacon(m);if(input.consume('v'))m=toggleRover(m);
    const simulationDt=Math.min(dt*(m.sleeping&&m.oxygen>0?SLEEP_TIME_MULTIPLIER:1),.2);
    const directionalInput=input.isDown('d','arrowright')||input.isDown('a','arrowleft')||input.isDown('s','arrowdown')||input.isDown('w','arrowup');
    if(m.sleeping&&directionalInput)m={...m,sleeping:false,message:'You wake up ready to move.'};
    const fatigue=m.sleep<=0?.45:m.sleep<25?.75:1;
    const player=movePlayer(m.player,{x:Number(input.isDown('d','arrowright'))-Number(input.isDown('a','arrowleft')),y:Number(input.isDown('s','arrowdown'))-Number(input.isDown('w','arrowup')),dash:!m.riding&&input.isDown('shift')},simulationDt*(m.riding?(m.loadout.includes('turbo')?2.7:1.8):1)*fatigue,[...obstacles,...(m.riding?facilities:facilityWalls)]);
    const region=regionAt(player);loadRegion(region.id);const explored=m.explored.includes(region.id)?m.explored:[...m.explored,region.id];
    const next=tickProgression(tickHazards(tickRex(tickResearch(tickSurvival({...m,player,rover:m.riding?{x:player.x,y:player.y}:m.rover,shelter:shelterAt(player),elapsed:m.elapsed+simulationDt,region:region.id,explored,message:m.region!==region.id?`Entering ${region.name}. ${region.subtitle}.`:m.message},simulationDt),simulationDt),simulationDt),simulationDt),simulationDt);
    set(state=>({mission:state.mission===m?next:{...next,panel:state.mission.panel,paused:state.mission.paused,circuits:state.mission.circuits}}));
  }
}));
