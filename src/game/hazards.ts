import {drawAtlasCell} from './sprites';
import { clamp } from '@/engine/math';
import type { Mission } from './model';
import { forecast,SOL_SECONDS,TIME_SCALE } from './forecast';
const commandReturn={x:2370,y:1705};
export function tickHazards(m:Mission,dt:number):Mission{const f=forecast(m.elapsed),timeDt=dt*TIME_SCALE;let next={...m};const outside=!m.shelter;const exposure=(f.night&&outside?.18:0)+(f.active&&outside?(f.kind==='radiation'?.5:.08):0);next.safety=clamp(m.safety-(exposure*(m.upgrades.includes('suit')?.5:1)+(f.active&&f.kind==='radiation'&&m.shelter&&!(m.shelter==='command'&&m.loadout.includes('shield'))?.06:0))*timeDt,0,100);
  const eventId=`${f.sol}-${f.kind}`;
  if(f.active&&((f.kind==='dust'&&m.beacon)||(f.kind==='radiation'&&m.shelter==='command'))&&!m.measuredEvents.includes(eventId))next.measuredEvents=[...m.measuredEvents,eventId];
  if(f.phase>=f.start+55&&!m.loggedEvents.includes(eventId)&&m.measuredEvents.includes(eventId)){next={...next,points:next.points+20,loggedEvents:[...next.loggedEvents,eventId],message:'Weather data logged safely. +20 research points.',timeline:[...next.timeline,`Sol ${f.sol}: recorded a ${f.kind} event (+20 points).`]};}
  if(next.safety<15&&outside){next={...next,riding:false,player:{...next.player,x:commandReturn.x,y:commandReturn.y},shelter:'command',rex:{x:commandReturn.x-40,y:commandReturn.y,trail:[]},points:Math.max(0,next.points-10),safety:25,message:'Rex pulled you back to Command. Rescue cost 10 points. Rest and restore life support.',timeline:[...next.timeline,`Sol ${f.sol}: Rex returned the crew to shelter.`]};}
  if(next.safety<=0)next={...next,outcome:'evacuated',message:'The rescue crew has you. Your discoveries will help the next expedition.'};
  else if(next.elapsed>=14*SOL_SECONDS)next={...next,elapsed:14*SOL_SECONDS,outcome:next.points>=200?'success':'partial',message:next.points>=200?'Survey complete! Your research will help design the next Mars habitat.':'Crew safely home. Your discoveries give the next expedition a head start.'};
  return next;
}
export function deployBeacon(m:Mission):Mission{if(m.shelter)return {...m,message:'Deploy the weather beacon outdoors.'};return {...m,beacon:{x:m.player.x,y:m.player.y},message:'Weather beacon deployed. Dust events will be logged automatically for +20 points.'};}

/** Visual exposure only; life-support damage remains in tickHazards. */
export function hazardVisualState(m:Pick<Mission,'elapsed'|'shelter'>){const f=forecast(m.elapsed);return {cold:f.night,dust:f.active&&f.kind==='dust',radiation:f.active&&f.kind==='radiation',intensity:m.shelter?.22:1,coverage:m.shelter?.055:.24};}
export function drawAtmosphere(c:CanvasRenderingContext2D,m:Mission,camera:{x:number;y:number;width:number;height:number}){
 const v=hazardVisualState(m),w=camera.width,h=camera.height;const edge=(rgb:string)=>{const g=c.createRadialGradient(w/2,h/2,Math.min(w,h)*(.5-v.coverage),w/2,h/2,Math.hypot(w,h)/2);g.addColorStop(0,'rgba('+rgb+',0)');g.addColorStop(1,'rgba('+rgb+','+(.82*v.intensity)+')');c.fillStyle=g;c.fillRect(0,0,w,h);};
 c.save();
 if(v.cold){c.fillStyle=m.shelter?'#14243e44':'#14243e99';c.fillRect(0,0,w,h);edge('49,135,192');c.globalAlpha=v.intensity;const inset=m.shelter?-Math.min(w,h)*.08:0;drawAtlasCell(c,'frost-v1.png',1,1,0,0,inset,inset,w-2*inset,h-2*inset);c.globalAlpha=1;}
 if(v.dust){edge('151,73,23');c.fillStyle='rgba(194,119,49,'+(.23*v.intensity)+')';c.fillRect(0,0,w,h);c.strokeStyle='rgba(242,191,116,'+(.48*v.intensity)+')';c.lineWidth=2;for(let i=0;i<85;i++){const x=(i*131+m.elapsed*230)%(w+140)-100,y=(i*83+m.elapsed*23)%h;if(m.shelter&&x>w*.07&&x<w*.93&&y>h*.07&&y<h*.93)continue;c.beginPath();c.moveTo(x,y);c.lineTo(x+50,y-12);c.stroke();}}
 if(v.radiation){edge('173,47,26');c.fillStyle='rgba(195,62,22,'+(.12*v.intensity)+')';c.fillRect(0,0,w,h);c.fillStyle='rgba(255,193,92,'+(.55*v.intensity)+')';for(let i=0;i<40;i++){const x=(i*137.3+m.elapsed*8)%w,y=(i*79.7+m.elapsed*15)%h;if(x>w*v.coverage&&x<w*(1-v.coverage)&&y>h*v.coverage&&y<h*(1-v.coverage))continue;c.fillRect(Math.floor(x),Math.floor(y),2,3);}}
 if(m.flashlight&&(v.cold||v.dust||v.radiation)){const x=m.player.x-camera.x,y=m.player.y-camera.y,g=c.createRadialGradient(x,y,8,x,y,130);g.addColorStop(0,'#fff5bf44');g.addColorStop(1,'#fff5bf00');c.fillStyle=g;c.fillRect(x-130,y-130,260,260);}
 c.restore();
}
