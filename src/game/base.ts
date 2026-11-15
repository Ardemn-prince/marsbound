import {drawAirlock,drawFacilityInterior} from './interiors';
import {drawEnvironmentSprite} from './sprites';
import { contains,type Rect,type Vec2 } from '@/engine/math';
export type Facility=Rect & {id:'command'|'lab'|'storage'|'greenhouse';name:string;accent:string};
export const facilities:Facility[]=[{id:'command',name:'COMMAND / HAB-01',x:2200,y:1430,w:340,h:340,accent:'#6aa7b7'},{id:'lab',name:'SCIENCE LAB',x:2580,y:1500,w:240,h:220,accent:'#7cc6d1'},{id:'storage',name:'STORAGE DOME',x:1930,y:1520,w:220,h:210,accent:'#d9ad69'},{id:'greenhouse',name:'GREENHOUSE',x:2870,y:1450,w:300,h:300,accent:'#83c887'}];
export const facilityWalls:Rect[]=facilities.flatMap(f=>[{x:f.x,y:f.y,w:f.w,h:10},{x:f.x,y:f.y,w:10,h:f.h},{x:f.x+f.w-10,y:f.y,w:10,h:f.h},{x:f.x,y:f.y+f.h-10,w:f.w/2-28,h:10},{x:f.x+f.w/2+28,y:f.y+f.h-10,w:f.w/2-28,h:10}]);
export const shelterAt=(p:Vec2)=>facilities.find(f=>contains(f,p,-11))?.id??null;
export const stations=facilities.map(f=>({id:f.id,x:f.x+f.w/2,y:f.id==='command'?f.y+175:f.y+f.h-65,name:f.name}));
export const greenhouseOxygenStation={x:2960,y:1680};
export const greenhouseFoodStation={x:3080,y:1680};
export const greenhouseFoodInterval=90;
export const bed={x:2270,y:1550};
export function facilityPowered(f:Facility,power:number,circuits:{lab:boolean;greenhouse:boolean;heater:boolean}){if(power<=.01)return false;if(f.id==='greenhouse')return circuits.greenhouse;if(f.id==='lab')return circuits.lab;if(f.id==='command')return circuits.heater;return true;}
export function drawBase(c:CanvasRenderingContext2D,shelter:string|null,power=100,circuits={lab:true,greenhouse:true,heater:true},player?:Vec2){
  drawPowerConduits(c,power,circuits);
  for(const f of facilities){const inside=shelter===f.id,online=facilityPowered(f,power,circuits);const x=f.x,y=f.y;
    if(!inside&&drawEnvironmentSprite(c,f.id,x,y,f.w,f.h,online)){
      if(f.id==='lab'||f.id==='greenhouse')drawAirlock(c,f,player);
      // Keep the visible airlock aligned with the existing collision opening.
      c.fillStyle=online?'#a6ddbd':'#4b5651';c.fillRect(x+f.w/2-21,y+f.h-4,42,4);

      c.font='bold 10px monospace';c.textAlign='center';c.fillStyle='#303d39';c.fillRect(x+f.w/2-67,y-23,134,17);c.fillStyle='#e3e6c9';c.fillText(f.name,x+f.w/2,y-11);
      continue;
    }
    c.fillStyle='#674c4166';c.fillRect(x+9,y+14,f.w+8,f.h+7);c.fillStyle='#293e48';c.fillRect(x-3,y-3,f.w+6,f.h+6);c.fillStyle='#d8d7bd';c.fillRect(x+5,y+5,f.w-10,f.h-15);c.fillStyle=inside?'#344744':'#75a2aa';c.fillRect(x+14,y+15,f.w-28,f.h-35);
    if(inside){drawFacilityInterior(c,f);}
    else {c.fillStyle='#345769';c.fillRect(x+10,y+11,f.w-20,42);c.fillStyle='#609daf';c.fillRect(x+14,y+15,f.w-28,30);c.fillStyle='#a6d5cf';c.fillRect(x+18,y+17,f.w-36,4);for(let rib=0;rib<4;rib++){c.fillStyle='#426c80';c.fillRect(x+18,y+60+rib*12,f.w-36,3);}c.fillStyle=f.accent;c.fillRect(x+23,y+25,f.w-46,18);c.fillStyle='#526c6a';c.fillRect(x+28,y+28,f.w-56,12);c.fillStyle='#edf0d0';c.fillRect(x+20,y+56,f.w-40,5);c.fillStyle='#919c8b';c.fillRect(x+f.w-35,y+70,15,20);}
    c.fillStyle='#324543';c.fillRect(x+f.w/2-25,y+f.h-20,50,25);c.fillStyle=online?'#a6ddbd':'#4b5651';c.fillRect(x+f.w/2-21,y+f.h-4,42,4);
    if(inside)drawAirlock(c,f,player,true);
    if(!online){c.fillStyle='#17232799';c.fillRect(x+5,y+5,f.w-10,f.h-15);}
    c.font='bold 10px monospace';c.textAlign='center';c.fillStyle='#303d39';c.fillRect(x+f.w/2-67,y-23,134,17);c.fillStyle='#e3e6c9';c.fillText(f.name,x+f.w/2,y-11);
  }
  // Solar field on fixed serviced plots.
  for(let i=0;i<4;i++){const x=2515+i%2*110,y=1910+Math.floor(i/2)*94;if(drawEnvironmentSprite(c,'solar',x,y,70,84))continue;c.fillStyle='#635246';c.fillRect(x+7,y+25,48,10);c.fillStyle='#24466c';c.fillRect(x,y,58,29);c.strokeStyle='#71b9cd';c.strokeRect(x,y,58,29);for(let j=1;j<4;j++){c.beginPath();c.moveTo(x+j*14,y);c.lineTo(x+j*14,y+29);c.stroke();}c.beginPath();c.moveTo(x,y+14);c.lineTo(x+58,y+14);c.stroke();}
  if(shelter==='greenhouse')for(const [station,color,label] of [[greenhouseOxygenStation,'#8bd1df','O₂'],[greenhouseFoodStation,'#b7d77e','FOOD']] as const){c.fillStyle=color;c.fillRect(station.x-20,station.y+20,40,3);c.font='bold 8px monospace';c.textAlign='center';c.fillStyle='#eff1cd';c.fillText(label,station.x,station.y+33);}
}

export const solarBus={x:2760,y:1840};
export function conduitRoutes(){return facilities.map(f=>({id:f.id,points:[solarBus,{x:f.x+f.w-18,y:solarBus.y},{x:f.x+f.w-18,y:f.y+f.h-10}]}));}
function drawPowerConduits(c:CanvasRenderingContext2D,power:number,circuits:{lab:boolean;greenhouse:boolean;heater:boolean}){
 c.save();c.lineJoin='round';const path=(points:Vec2[],online:boolean)=>{for(const [width,color] of [[10,'#352c29'],[6,online?'#af8040':'#606467'],[2,online?'#ffe3a0':'#92948b']] as const){c.strokeStyle=color;c.lineWidth=width;c.beginPath();points.forEach((p,i)=>i?c.lineTo(p.x,p.y):c.moveTo(p.x,p.y));c.stroke();}for(const p of points){c.fillStyle='#3b4243';c.fillRect(p.x-5,p.y-5,10,10);c.fillStyle=online?'#e6cb79':'#7b8584';c.fillRect(p.x-2,p.y-2,4,4);}};
 for(let i=0;i<4;i++){const x=2550+i%2*110,y=1990+Math.floor(i/2)*94;path([{x,y},{x:solarBus.x,y},solarBus],power>0);}
 for(const route of conduitRoutes())path(route.points,facilityPowered(facilities.find(f=>f.id===route.id)!,power,circuits));c.restore();
}
