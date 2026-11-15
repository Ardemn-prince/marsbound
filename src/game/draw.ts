import {draw_hazard_objects} from './hazard-render';
import {drawSprite,walkFrame,drawWeatherBeacon,drawDetailSprite,drawAtlasCell} from './sprites';
import {characterById,characterGender} from './characters';
import type { Renderer } from '@/engine/renderer';
import type { Mission,Player } from './model';
import { drawTerrain } from './world';
import { drawBase,bed } from './base';
import { drawInteractionOutline } from './interaction-target';
import { drawSamples } from './research';
import { drawRex } from './rex';
import { drawAtmosphere } from './hazards';
import { drawRover } from './rover';
import { WORLD } from './world';
export function drawAstronaut(c:CanvasRenderingContext2D,p:Player,character='nova',indoors=false){const outfit=characterById(character);const x=Math.round(p.x),y=Math.round(p.y)-(p.running&&p.moving?Math.round(Math.abs(Math.sin(p.animation))*4):0);const step=p.moving?Math.round(Math.sin(p.animation)*3):0;
  const faceRight=Math.cos(p.facing)>=0;
  if(indoors&&drawAtlasCell(c,'cadets-v1.png',4,2,p.moving?[1,2,3,2][Math.floor(p.animation*.8)%4]:0,characterGender(character)==='girl'?1:0,x-36,y-35,72,72,!faceRight))return;
  if(!p.moving&&p.action<=0&&drawDetailSprite(c,'idle',x-15,y-31,30,56,!faceRight)){c.fillStyle=outfit.suit;c.fillRect(x+(faceRight?-10:6),y-7,4,4);return;}
  if(drawSprite(c,walkFrame(p.animation/10,p.moving),2,x-36,y-36,72,!faceRight)){
    // Colored shoulder patch keeps the chosen cadet identifiable behind the visor.
    c.fillStyle=outfit.suit;c.fillRect(x+(faceRight?-9:5),y-5,5,4);
    if(p.drilling&&p.action>0){const jitter=Math.floor(p.action*40)%2;drawSprite(c,0,1,x+(faceRight?2:-34),y-10+jitter,32,!faceRight);}
    return;
  }
  c.fillStyle='#3b2b2a66';c.fillRect(x-15,y+20,32,7);
  c.fillStyle='#344653';c.fillRect(x-15,y-13,8,25);c.fillRect(x+11,y-13,8,25);
  c.fillStyle=outfit.suit;c.fillRect(x-11,y-9,23,25);c.fillRect(x-9,y+11+step,7,11);c.fillRect(x+4,y+11-step,7,11);
  c.fillStyle='#344653';c.fillRect(x-10,y+20+step,9,4);c.fillRect(x+4,y+20-step,9,4);
  c.fillStyle=outfit.accent;c.fillRect(x-10,y-9,23,5);c.fillRect(x-16,y-8,5,15);c.fillRect(x+12,y-8-(p.action>0?7:0),5,15);
  c.fillStyle='#f0e7c7';c.fillRect(x-13,y-30,27,22);c.fillRect(x-16,y-25,4,15);c.fillRect(x+14,y-25,4,15);
  c.fillStyle='#446477';c.fillRect(x-10,y-26,21,17);c.fillStyle=outfit.skin;c.fillRect(x-7,y-23,15,13);
  c.fillStyle=outfit.hair;c.fillRect(x-8,y-25,17,6);if(character==='aya'||character==='nova'){c.fillRect(x-9,y-21,4,12);c.fillRect(x+7,y-22,4,13);}
  c.fillStyle='#283744';c.fillRect(x-4+(faceRight?2:-2),y-18,3,3);c.fillRect(x+5+(faceRight?2:-2),y-18,3,3);
  c.fillStyle='#955b50';c.fillRect(x-1,y-13,5,2);c.fillStyle='#fff8e5';c.fillRect(x-9,y-28,19,2);
  c.fillStyle='#eee4bf';c.fillRect(x-5,y+1,11,5);c.fillStyle='#6cacb1';c.fillRect(x-3,y+2,7,2);
}
export function drawScene(r:Renderer,m:Mission){r.camera.follow(m.player,WORLD.width,WORLD.height);r.begin();const c=r.ctx;
  drawTerrain(c,{x:r.camera.x,y:r.camera.y,w:r.camera.width,h:r.camera.height});drawBase(c,m.shelter,m.power,m.circuits,m.player);
  if(m.beacon&&!drawWeatherBeacon(c,m.beacon.x,m.beacon.y)){c.fillStyle='#cdd7b7';c.fillRect(m.beacon.x-2,m.beacon.y-30,4,30);c.fillStyle='#a7e2c8';c.fillRect(m.beacon.x-12,m.beacon.y-32,24,5);}
  draw_hazard_objects(c,m);drawSamples(c,m);drawInteractionOutline(c,m);drawRover(c,m);drawRex(c,m);if(m.sleeping&&m.shelter==='command')drawSleeping(c,m);else if(!m.riding)drawAstronaut(c,m.player,m.character,!!m.shelter);r.end();drawAtmosphere(c,m,r.camera);
}

function drawSleeping(c:CanvasRenderingContext2D,m:Mission){
 c.save();c.translate(bed.x-5,bed.y-24);c.rotate(-Math.PI/2);drawAstronaut(c,{...m.player,x:0,y:0,moving:false,running:false,action:0},m.character,true);c.restore();
 const breath=Math.sin(m.elapsed*2)*1.2;c.fillStyle='#b0ac91';c.fillRect(bed.x-22,bed.y-35+breath,40,22);c.fillStyle='#d2ccb1';c.fillRect(bed.x-22,bed.y-35+breath,40,3);c.fillStyle='#858a79';for(let i=0;i<4;i++)c.fillRect(bed.x-17+i*8,bed.y-29+breath+i%2*3,3,12);c.fillStyle='#e1d7ba';c.fillRect(bed.x-22,bed.y-15+breath,40,2);
 c.save();c.fillStyle='#d9f4ed';c.textAlign='center';for(let i=0;i<3;i++){const t=(m.elapsed*.45+i/3)%1;c.globalAlpha=1-t;c.font='bold '+(10+i*2)+'px monospace';c.fillText('z',bed.x+25+t*18,bed.y-32-t*35);}c.restore();
}
