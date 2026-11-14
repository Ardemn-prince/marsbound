import { contains,type Rect,type Vec2 } from '@/engine/math';
export type Facility=Rect & {id:'command'|'lab'|'storage';name:string;accent:string};
export const facilities:Facility[]=[{id:'command',name:'COMMAND / HAB-01',x:460,y:390,w:180,h:150,accent:'#b4c9b0'},{id:'lab',name:'SCIENCE LAB',x:710,y:410,w:150,h:120,accent:'#9dc7ce'},{id:'storage',name:'STORAGE DOME',x:270,y:430,w:125,h:110,accent:'#d4b78b'}];
export const facilityWalls:Rect[]=facilities.flatMap(f=>[{x:f.x,y:f.y,w:f.w,h:10},{x:f.x,y:f.y,w:10,h:f.h},{x:f.x+f.w-10,y:f.y,w:10,h:f.h},{x:f.x,y:f.y+f.h-10,w:f.w/2-28,h:10},{x:f.x+f.w/2+28,y:f.y+f.h-10,w:f.w/2-28,h:10}]);
export const shelterAt=(p:Vec2)=>facilities.find(f=>contains(f,p,-11))?.id??null;
export const stations=facilities.map(f=>({id:f.id,x:f.x+f.w/2,y:f.y+f.h/2,name:f.name}));
export function drawBase(c:CanvasRenderingContext2D,shelter:string|null){
  c.fillStyle='#775c4c';c.fillRect(320,480,490,17);c.fillStyle='#d8c981';c.fillRect(320,486,490,3);
  for(const f of facilities){const inside=shelter===f.id;const x=f.x,y=f.y;
    c.fillStyle='#674c4166';c.fillRect(x+9,y+14,f.w+8,f.h+7);c.fillStyle='#56615c';c.fillRect(x,y,f.w,f.h);c.fillStyle='#d8d7bd';c.fillRect(x+5,y+5,f.w-10,f.h-15);c.fillStyle=inside?'#344744':'#c0c5ad';c.fillRect(x+14,y+15,f.w-28,f.h-35);
    if(inside){c.strokeStyle='#52635b';for(let yy=y+18;yy<y+f.h-25;yy+=20){c.beginPath();c.moveTo(x+15,yy);c.lineTo(x+f.w-15,yy);c.stroke();}c.fillStyle='#7ba99c';c.fillRect(x+25,y+25,f.w-50,22);c.fillStyle='#c8eec9';c.fillRect(x+30,y+29,20,10);}
    else {c.fillStyle=f.accent;c.fillRect(x+23,y+25,f.w-46,18);c.fillStyle='#526c6a';c.fillRect(x+28,y+28,f.w-56,12);c.fillStyle='#edf0d0';c.fillRect(x+20,y+60,f.w-40,5);c.fillStyle='#919c8b';c.fillRect(x+f.w-35,y+70,15,20);}
    c.fillStyle='#324543';c.fillRect(x+f.w/2-25,y+f.h-20,50,25);c.fillStyle='#a6ddbd';c.fillRect(x+f.w/2-21,y+f.h-4,42,4);c.fillStyle='#b4a07c';c.fillRect(x+f.w/2-25,y+f.h+8,50,8);
    c.font='bold 10px monospace';c.textAlign='center';c.fillStyle='#303d39';c.fillRect(x+f.w/2-67,y-23,134,17);c.fillStyle='#e3e6c9';c.fillText(f.name,x+f.w/2,y-11);
  }
  // Solar field on fixed serviced plots.
  for(let i=0;i<4;i++){const x=700+i%2*66,y=610+Math.floor(i/2)*45;c.fillStyle='#635246';c.fillRect(x+7,y+25,48,10);c.fillStyle='#344956';c.fillRect(x,y,58,29);c.strokeStyle='#7391a0';c.strokeRect(x,y,58,29);for(let j=1;j<4;j++){c.beginPath();c.moveTo(x+j*14,y);c.lineTo(x+j*14,y+29);c.stroke();}c.beginPath();c.moveTo(x,y+14);c.lineTo(x+58,y+14);c.stroke();}
}
