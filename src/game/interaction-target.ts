import {distance,type Rect} from '@/engine/math';
import {bed,facilities,greenhouseFoodStation,greenhouseOxygenStation,solarFieldBounds,stations} from './base';
import type {Mission} from './model';
import {samples} from './research';
import {nearest} from './player';
export type InteractionTarget=Rect & {id:string;label:string};
export function interactionTarget(m:Mission):InteractionTarget|null{
 if(m.riding)return null;
 const box=(id:string,label:string,x:number,y:number,w:number,h:number)=>({id,label,x,y,w,h});
 if(m.shelter==='command'&&distance(m.player,bed)<70)return box('bed',m.sleeping?'Wake up':'Sleep',2226,1478,88,72);
 if(m.shelter==='greenhouse'){
  if(distance(m.player,greenhouseOxygenStation)<65)return box('oxygen','Refill oxygen',2927,1632,66,62);
  if(distance(m.player,greenhouseFoodStation)<65)return box('food','Eat meal',3043,1632,74,62);
  return null;
 }
 if(distance(m.player,{x:2620,y:1985})<100)return box('solar','Clean panels',solarFieldBounds.x,solarFieldBounds.y,solarFieldBounds.w,solarFieldBounds.h);
 if(m.shelter==='storage')return box('storage','Recharge rover',2005,1639,70,44);
 const sample=nearest(m.player,samples.filter(s=>!m.collected.includes(s.id)),52);
 if(sample)return box(sample.id,'Drill and collect',sample.x-20,sample.y-23,40,42);
 const station=nearest(m.player,stations.filter(s=>s.id===m.shelter));
 if(station){const f=facilities.find(f=>f.id===station.id)!;return station.id==='command'?box('command','Command / craft',f.x+f.w/2-56,f.y+95,112,76):box(station.id,'Analyze sample',f.x+f.w/2-48,f.y+f.h-116,96,70);}
 if(!m.shelter&&distance(m.player,m.rover)<65)return box('rover','Board rover',m.rover.x-48,m.rover.y-40,96,76);
 return null;
}
export function drawInteractionOutline(c:CanvasRenderingContext2D,m:Mission){const t=interactionTarget(m);if(!t)return;c.save();c.strokeStyle='#f8edb6';c.lineWidth=2;c.globalAlpha=.8+.2*Math.sin(m.elapsed*4);c.strokeRect(t.x-3,t.y-3,t.w+6,t.h+6);c.strokeStyle='#3e514a';c.lineWidth=1;c.strokeRect(t.x-5,t.y-5,t.w+10,t.h+10);c.restore();}
