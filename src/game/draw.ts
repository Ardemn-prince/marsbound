import type { Renderer } from '@/engine/renderer';
import type { Mission,Player } from './model';
import { drawTerrain } from './world';
import { drawBase } from './base';
import { drawSamples } from './research';
import { drawRex } from './rex';
import { drawAtmosphere } from './hazards';
import { drawRover } from './rover';
export function drawAstronaut(c:CanvasRenderingContext2D,p:Player){const x=Math.round(p.x),y=Math.round(p.y);const step=p.moving?Math.round(Math.sin(p.animation)*3):0;
  c.fillStyle='#673e35';c.fillRect(x-15,y+12,32,7);c.fillStyle='#63736d';c.fillRect(x-15,y-13,8,24);c.fillStyle='#e9e4c9';c.fillRect(x-10,y-17,23,29);c.fillStyle='#f7efd6';c.fillRect(x-12,y-29,27,21);c.fillStyle='#263e43';c.fillRect(x-7+(p.facing>0?3:0),y-25,17,11);c.fillStyle='#8bc8c7';c.fillRect(x-3,y-24,10,3);c.fillStyle='#d16f4d';c.fillRect(x-10,y-8,23,5);c.fillStyle='#cbcbb7';c.fillRect(x-9,y+10+step,7,10);c.fillRect(x+5,y+10-step,7,10);c.fillStyle='#eef1d5';c.fillRect(x+13,y-10-(p.action>0?10:0),5,15);
}
export function drawScene(r:Renderer,m:Mission){r.camera.follow(m.player,2400,1600);r.begin();const c=r.ctx;
  drawTerrain(c,{x:r.camera.x,y:r.camera.y,w:960,h:600});drawBase(c,m.shelter);
  if(m.beacon){c.fillStyle='#cdd7b7';c.fillRect(m.beacon.x-2,m.beacon.y-30,4,30);c.fillStyle='#a7e2c8';c.fillRect(m.beacon.x-12,m.beacon.y-32,24,5);}
  drawSamples(c,m);drawRover(c,m);drawRex(c,m);if(!m.riding)drawAstronaut(c,m.player);r.end();drawAtmosphere(c,m,r.camera);
}
