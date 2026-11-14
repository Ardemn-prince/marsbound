import { contains,type Rect,type Vec2 } from '@/engine/math';
export type Facility=Rect & {id:'command'|'lab'|'storage'|'greenhouse';name:string;accent:string};
export const facilities:Facility[]=[{id:'command',name:'COMMAND / HAB-01',x:2200,y:1430,w:340,h:340,accent:'#6aa7b7'},{id:'lab',name:'SCIENCE LAB',x:2580,y:1500,w:240,h:220,accent:'#7cc6d1'},{id:'storage',name:'STORAGE DOME',x:1990,y:1520,w:220,h:210,accent:'#d9ad69'},{id:'greenhouse',name:'GREENHOUSE',x:2870,y:1450,w:300,h:300,accent:'#83c887'}];
export const facilityWalls:Rect[]=facilities.flatMap(f=>[{x:f.x,y:f.y,w:f.w,h:10},{x:f.x,y:f.y,w:10,h:f.h},{x:f.x+f.w-10,y:f.y,w:10,h:f.h},{x:f.x,y:f.y+f.h-10,w:f.w/2-28,h:10},{x:f.x+f.w/2+28,y:f.y+f.h-10,w:f.w/2-28,h:10}]);
export const shelterAt=(p:Vec2)=>facilities.find(f=>contains(f,p,-11))?.id??null;
export const stations=facilities.map(f=>({id:f.id,x:f.x+f.w/2,y:f.y+f.h-65,name:f.name}));
export const greenhouseOxygenStation={x:2960,y:1680};
export const greenhouseFoodStation={x:3080,y:1680};
export const greenhouseFoodInterval=45;
export const bed={x:2270,y:1592};
export function drawBase(c:CanvasRenderingContext2D,shelter:string|null){
  c.fillStyle='#775c4c';c.fillRect(1960,1850,900,22);c.fillStyle='#d8c981';c.fillRect(1960,1858,900,4);
  for(const f of facilities){const inside=shelter===f.id;const x=f.x,y=f.y;
    c.fillStyle='#674c4166';c.fillRect(x+9,y+14,f.w+8,f.h+7);c.fillStyle='#293e48';c.fillRect(x-3,y-3,f.w+6,f.h+6);c.fillStyle='#d8d7bd';c.fillRect(x+5,y+5,f.w-10,f.h-15);c.fillStyle=inside?'#344744':'#75a2aa';c.fillRect(x+14,y+15,f.w-28,f.h-35);
    if(inside){c.strokeStyle='#52635b';for(let yy=y+18;yy<y+f.h-25;yy+=20){c.beginPath();c.moveTo(x+15,yy);c.lineTo(x+f.w-15,yy);c.stroke();}c.fillStyle='#7ba99c';c.fillRect(x+25,y+25,f.w-50,22);c.fillStyle='#c8eec9';c.fillRect(x+30,y+29,20,10);c.fillStyle='#28383b';c.fillRect(x+f.w/2-35,y+f.h-85,70,30);c.fillStyle='#8bd1ba';c.fillRect(x+f.w/2-27,y+f.h-81,54,12);c.font='9px monospace';c.textAlign='center';c.fillText(f.id==='lab'?'SCANNER':f.id==='command'?'WORKBENCH':'SUPPLIES',x+f.w/2,y+f.h-94);for(let i=0;i<3;i++){c.fillStyle=f.id==='command'?'#8eae6c':'#96afa7';c.fillRect(x+25+i*52,y+75,38,42);c.fillStyle='#435d52';c.fillRect(x+29+i*52,y+80,30,10);}if(f.id==='command'){c.fillStyle='#5e7567';c.fillRect(x+35,y+145,70,30);c.fillStyle='#d8bea0';c.fillRect(x+40,y+140,60,9);c.fillStyle='#87bfae';c.fillRect(x+48,y+144,42,5);c.fillStyle='#dce6c5';c.fillRect(x+55,y+151,28,5);c.fillStyle='#e6d39c';c.font='8px monospace';c.fillText('REST BED',x+70,y+192);}}
    else {c.fillStyle='#345769';c.fillRect(x+10,y+11,f.w-20,42);c.fillStyle='#609daf';c.fillRect(x+14,y+15,f.w-28,30);c.fillStyle='#a6d5cf';c.fillRect(x+18,y+17,f.w-36,4);for(let rib=0;rib<4;rib++){c.fillStyle='#426c80';c.fillRect(x+18,y+60+rib*12,f.w-36,3);}c.fillStyle=f.accent;c.fillRect(x+23,y+25,f.w-46,18);c.fillStyle='#526c6a';c.fillRect(x+28,y+28,f.w-56,12);c.fillStyle='#edf0d0';c.fillRect(x+20,y+56,f.w-40,5);c.fillStyle='#919c8b';c.fillRect(x+f.w-35,y+70,15,20);}
    c.fillStyle='#324543';c.fillRect(x+f.w/2-25,y+f.h-20,50,25);c.fillStyle='#a6ddbd';c.fillRect(x+f.w/2-21,y+f.h-4,42,4);c.fillStyle='#b4a07c';c.fillRect(x+f.w/2-25,y+f.h+8,50,8);
    c.font='bold 10px monospace';c.textAlign='center';c.fillStyle='#303d39';c.fillRect(x+f.w/2-67,y-23,134,17);c.fillStyle='#e3e6c9';c.fillText(f.name,x+f.w/2,y-11);
  }
  // Solar field on fixed serviced plots.
  for(let i=0;i<4;i++){const x=2550+i%2*66,y=1940+Math.floor(i/2)*45;c.fillStyle='#635246';c.fillRect(x+7,y+25,48,10);c.fillStyle='#24466c';c.fillRect(x,y,58,29);c.strokeStyle='#71b9cd';c.strokeRect(x,y,58,29);for(let j=1;j<4;j++){c.beginPath();c.moveTo(x+j*14,y);c.lineTo(x+j*14,y+29);c.stroke();}c.beginPath();c.moveTo(x,y+14);c.lineTo(x+58,y+14);c.stroke();}
  for(const [station,color,label] of [[greenhouseOxygenStation,'#8bd1df','O₂'],[greenhouseFoodStation,'#b7d77e','FOOD']] as const){c.fillStyle='#263a3a';c.fillRect(station.x-28,station.y-18,56,36);c.fillStyle=color;c.fillRect(station.x-20,station.y-10,40,20);c.font='bold 8px monospace';c.textAlign='center';c.fillStyle='#263a3a';c.fillText(label,station.x,station.y+3);}
}
