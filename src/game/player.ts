import { clamp,contains,distance,type Rect,type Vec2 } from '@/engine/math';
import type { Player } from './model';
export type Controls={x:number;y:number;dash:boolean};
export function movePlayer(player:Player,input:Controls,dt:number,obstacles:Rect[],width=2400,height=1600):Player{
  const length=Math.hypot(input.x,input.y);const speed=input.dash?210:135;
  const p={...player,moving:length>0,animation:player.animation+dt*(length?10:2),action:Math.max(0,player.action-dt)};
  if(!length)return p;const dx=input.x/length*speed*dt,dy=input.y/length*speed*dt;
  const x=clamp(p.x+dx,16,width-16),y=clamp(p.y+dy,16,height-16);
  if(!obstacles.some(r=>contains(r,{x,y:p.y},10)))p.x=x;
  if(!obstacles.some(r=>contains(r,{x:p.x,y},10)))p.y=y;
  if(input.x)p.facing=Math.sign(input.x);return p;
}
export function nearest<T extends Vec2>(player:Vec2,objects:T[],range=64):T|undefined{return objects.filter(o=>distance(player,o)<=range).sort((a,b)=>distance(player,a)-distance(player,b))[0];}
