import { create } from 'zustand';
import type { InputManager } from '@/engine/input';
import { newMission,type Mission } from './model';
import { movePlayer,nearest } from './player';
export const obstacles=[{x:710,y:560,w:75,h:55}];
export const useMission=create<{mission:Mission;step:(dt:number,input:InputManager)=>void;interact:()=>void;togglePause:()=>void}>( (set,get)=>({
  mission:newMission(),
  togglePause:()=>set(s=>({mission:{...s.mission,paused:!s.mission.paused}})),
  interact:()=>{const m=get().mission;if(m.paused)return;const target=nearest(m.player,[{x:600,y:560}]);set({mission:{...m,player:{...m.player,action:.5},message:target?'Landing beacon: communications with Earth are online.':'Move closer to a marked object, then press E.'}});},
  step:(dt,input)=>{if(input.consume('escape'))get().togglePause();if(input.consume('e'))get().interact();let m=get().mission;if(m.paused)return;if(input.consume('f'))m={...m,flashlight:!m.flashlight};
    const player=movePlayer(m.player,{x:Number(input.isDown('d','arrowright'))-Number(input.isDown('a','arrowleft')),y:Number(input.isDown('s','arrowdown'))-Number(input.isDown('w','arrowup')),dash:input.isDown('shift')},dt,obstacles);
    set({mission:{...m,player,elapsed:m.elapsed+dt}});
  }
}));
