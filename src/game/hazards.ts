import { clamp } from '@/engine/math';
import type { Mission } from './model';
import { forecast,SOL_SECONDS } from './forecast';
export function tickHazards(m:Mission,dt:number):Mission{const f=forecast(m.elapsed);let next={...m};const outside=!m.shelter;const exposure=(f.night&&outside?.18:0)+(f.active&&outside?(f.kind==='radiation'?.5:.08):0);next.safety=clamp(m.safety-(exposure*(m.upgrades.includes('suit')?.5:1)+(f.active&&f.kind==='radiation'&&m.shelter&&!(m.shelter==='command'&&m.loadout.includes('shield'))?.06:0))*dt,0,100);
  const eventId=`${f.sol}-${f.kind}`;
  if(f.active&&((f.kind==='dust'&&m.beacon)||(f.kind==='radiation'&&m.shelter==='command'))&&!m.measuredEvents.includes(eventId))next.measuredEvents=[...m.measuredEvents,eventId];
  if(f.phase>=f.start+55&&!m.loggedEvents.includes(eventId)&&m.measuredEvents.includes(eventId)){next={...next,points:next.points+20,loggedEvents:[...next.loggedEvents,eventId],message:'Weather data logged safely. +20 research points.',timeline:[...next.timeline,`Sol ${f.sol}: recorded a ${f.kind} event (+20 points).`]};}
  if(next.safety<15&&outside){next={...next,riding:false,player:{...next.player,x:550,y:490},shelter:'command',rex:{x:530,y:490,trail:[]},points:Math.max(0,next.points-10),safety:25,message:'Rex brought you home! Rescue cost 10 points. Rest and restore life support.',timeline:[...next.timeline,`Sol ${f.sol}: Rex returned the crew to shelter.`]};}
  if(next.safety<=0)next={...next,outcome:'evacuated',message:'The rescue crew has you. Your discoveries will help the next expedition.'};
  else if(next.elapsed>=14*SOL_SECONDS)next={...next,elapsed:14*SOL_SECONDS,outcome:next.points>=200?'success':'partial',message:next.points>=200?'Survey complete! Your research will help design the next Mars habitat.':'Crew safely home. Your discoveries give the next expedition a head start.'};
  return next;
}
export function deployBeacon(m:Mission):Mission{if(m.shelter)return {...m,message:'Deploy the weather beacon outdoors.'};return {...m,beacon:{x:m.player.x,y:m.player.y},message:'Weather beacon deployed. Dust events will be logged automatically for +20 points.'};}
export function drawAtmosphere(c:CanvasRenderingContext2D,m:Mission,camera:{x:number;y:number}){const f=forecast(m.elapsed);if(f.night){c.fillStyle='#14243eaa';c.fillRect(0,0,960,600);}if(f.active){c.fillStyle=f.kind==='dust'?'#c2844266':'#ad729033';c.fillRect(0,0,960,600);if(f.kind==='dust'){c.strokeStyle='#e6b88277';c.lineWidth=2;for(let i=0;i<70;i++){const x=(i*131+m.elapsed*210)%1040-40,y=(i*83+m.elapsed*23)%600;c.beginPath();c.moveTo(x,y);c.lineTo(x+24,y-5);c.stroke();}}}
  if(m.flashlight&&(f.night||f.active)){const x=m.player.x-camera.x,y=m.player.y-camera.y;const g=c.createRadialGradient(x,y,8,x,y,130);g.addColorStop(0,'#fff5bf44');g.addColorStop(1,'#fff5bf00');c.fillStyle=g;c.fillRect(x-130,y-130,260,260);}
}
