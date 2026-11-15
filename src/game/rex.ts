import {hazard_task_text} from './hazard-events';
import {facilities,facilityWalls,shelterAt} from './base';
import {contains} from '@/engine/math';
import {drawSprite,walkFrame,drawDetailSprite} from './sprites';
import { wrappedDelta,wrappedDistance,wrapPosition } from '@/engine/math';
import { WORLD,riftGapObstacles } from './world';
import type { Mission } from './model';
import {samples,collect,SCIENCE} from './research';
import {nearest} from './player';
import { forecast } from './forecast';
const tips=['Mars has a thin atmosphere. Your suit brings the air you need.','Rocks are little history books. Let’s read them in the lab!','Solar panels need sunlight. Save battery power for the night.','The delta is an ancient river’s footprint. Look east for mudstone.'];
export const REX_ROCK_PICKUP_COOLDOWN=120;
function radiationGuidance(m:Mission,prefix:string){if(m.shelter==='command'&&m.loadout.includes('shield'))return `${prefix} Command shielding will block the radiation.`;if(m.shelter)return `${prefix} This habitat reduces exposure, but Command with Regolith Shielding offers full protection.`;return `${prefix} Get inside. Command with Regolith Shielding offers full protection.`;}
export function rexTip(m:Mission){if(m.oxygen<=0)return 'Oxygen empty! Crew safety is falling. Refill at the greenhouse O₂ station now.';if(m.oxygen<=10)return 'Oxygen critical: 10% or less. Return to the greenhouse O₂ station now.';if(m.oxygen<=25)return 'Oxygen low: 25% or less. Plan your return to the greenhouse O₂ station.';if(m.hazard_event&&m.elapsed<m.hazard_event.ends_at)return hazard_task_text(m.hazard_event)+'.';const f=forecast(m.elapsed);if(f.until>0&&f.until<=60)return f.kind==='radiation'?radiationGuidance(m,`Radiation event in ${Math.ceil(f.until)} seconds.`):'Dust storm in '+Math.ceil(f.until)+' seconds. Let’s head for the command module!';if(f.active)return f.kind==='radiation'?radiationGuidance(m,'Radiation detected.'): 'Weather alert! Shelter first. Science can wait.';if(m.inventory.length>=4)return 'My cargo slot is full too. Let’s bring these samples to the lab.';if(m.scanning)return 'I’ll watch the scanner. Keep lab power on until it finishes.';const nearby=nearest(m.player,samples.filter(s=>!m.collected.includes(s.id)),150);if(nearby)return 'Sample spotted! '+SCIENCE[nearby.kind].name+' nearby. Use your field scanner to check its rarity.';return tips[Math.floor(m.elapsed/24)%tips.length];}
/** Breadcrumb following follows the astronaut's safe route through doorways. */
export function tickRex(m:Mission,dt:number):Mission{
  const rex={...m.rex,trail:[...m.rex.trail],moving:false};
  const last=rex.trail.at(-1)??rex;
  if(wrappedDistance(last,m.player)>16)rex.trail.push({x:m.player.x,y:m.player.y});
  if(rex.trail.length>240)rex.trail.shift();
  const entering=!!m.shelter&&shelterAt(rex)!==m.shelter;
  const gap=wrappedDistance(rex,m.player),stopGap=entering?24:m.shelter?112:m.riding?100:72,startGap=entering?30:m.shelter?150:m.riding?140:110;
  if(gap<=stopGap){rex.following=false;rex.followDelay=0;}
  else if(!rex.following){
    rex.followDelay=gap>=startGap?(rex.followDelay??0)+dt:0;
    if(rex.followDelay>=.45)rex.following=true;
  }
  if(rex.following){
    let budget=Math.min((m.riding?420:gap>220?230:155)*dt,Math.max(0,gap-stopGap));
    while(budget>0&&rex.trail.length){
      const target=rex.trail[0],d=wrappedDistance(rex,target);
      if(d<.01){rex.trail.shift();continue;}
      const step=Math.min(d,budget,4);
      const candidate=wrapPosition({x:rex.x+wrappedDelta(rex.x,target.x,WORLD.width)/d*step,y:rex.y+wrappedDelta(rex.y,target.y,WORLD.height)/d*step},WORLD.width,WORLD.height);
      if(facilityWalls.some(w=>contains(w,candidate,6))||riftGapObstacles.some(w=>contains(w,candidate,6))){rex.trail=[];rex.following=false;break;}
      rex.x+=wrappedDelta(rex.x,target.x,WORLD.width)/d*step;
      rex.y+=wrappedDelta(rex.y,target.y,WORLD.height)/d*step;
      Object.assign(rex,wrapPosition(rex,WORLD.width,WORLD.height));
      rex.moving=true;budget-=step;
      if(step===d)rex.trail.shift();
    }
  }
  if(m.shelter&&shelterAt(rex)===m.shelter&&wrappedDistance(rex,m.player)<112){
    const angle=Math.atan2(rex.y-m.player.y,rex.x-m.player.x);
    const offsets=[0,.5,-.5,1,-1,1.5,-1.5,Math.PI,-Math.PI];
    for(const offset of offsets){
      const candidate={x:m.player.x+Math.cos(angle+offset)*112,y:m.player.y+Math.sin(angle+offset)*112};
      if(shelterAt(candidate)===m.shelter&&!facilityWalls.some(w=>contains(w,candidate,6))){rex.x=candidate.x;rex.y=candidate.y;rex.following=false;rex.moving=false;break;}
    }
  }
  const pickupCooldown=Math.max(0,m.rexPickupCooldown-dt);let next:Mission={...m,rex,rexPickupCooldown:pickupCooldown};const sample=nearest(rex,samples.filter(s=>!m.collected.includes(s.id)),30);if(sample&&!m.shelter&&m.inventory.length===3&&pickupCooldown<=0&&wrappedDistance(m.player,sample)<80){next=collect(next,sample,4);next.rexPickupCooldown=REX_ROCK_PICKUP_COOLDOWN;next.message='Rex: I picked up '+SCIENCE[sample.kind].name+' in his cargo slot. Let’s take it to the lab!';}return next;}
export function drawRex(c:CanvasRenderingContext2D,m:Mission){if(facilities.some(f=>f.id!==m.shelter&&contains(f,m.rex)))return;const x=Math.round(m.rex.x),y=Math.round(m.rex.y);const step=m.rex.moving?Math.sin(m.elapsed*12)*2:0;const target=m.rex.trail[0];const faceRight=!target||wrappedDelta(x,target.x,WORLD.width)>=0;if((!m.rex.moving&&drawDetailSprite(c,'rexIdle',x-18,y-26,36,42,!faceRight))||drawSprite(c,walkFrame(m.elapsed,!!m.rex.moving),3,x-32,y-30,64,!faceRight)){c.font='9px monospace';c.fillStyle='#e9e0ba';c.textAlign='center';c.fillText('REX',x,y-29);return;}const headX=faceRight?x+4:x-19;const visorX=faceRight?x+10:x-18;c.fillStyle='#654d3e66';c.fillRect(x-15,y+8,33,6);c.fillStyle='#a7bab0';c.fillRect(x-13,y-8,23,17);c.fillStyle='#e3dbc1';c.fillRect(headX,y-17,15,16);c.fillStyle='#334e50';c.fillRect(visorX,y-14,11,7);c.fillStyle='#b8e9cd';c.fillRect(faceRight?x+17:x-20,y-13,3,3);c.fillStyle='#778c84';c.fillRect(x-11,y+8+step,5,7);c.fillRect(x+5,y+8-step,5,7);c.fillRect(faceRight?x-18:x+14,y-13,5,10);c.fillRect(faceRight?x+6:x-8,y-25,2,9);c.fillStyle=(forecast(m.elapsed).active||(forecast(m.elapsed).until>0&&forecast(m.elapsed).until<=60))?'#edbf72':'#a6e8c4';c.fillRect(faceRight?x+4:x-10,y-27,6,4);c.font='9px monospace';c.fillStyle='#e9e0ba';c.textAlign='center';c.fillText('REX',x,y-34);}

export function rexExpression(m:Mission){const f=forecast(m.elapsed);if(m.oxygen<=25||m.safety<30||f.active||(f.until>0&&f.until<=60))return 2;if(m.power<15)return 4;if(m.scanning||m.player.drilling)return 5;if(m.message.startsWith('Research complete'))return 3;return Math.floor(m.elapsed*2)%2?1:0;}
