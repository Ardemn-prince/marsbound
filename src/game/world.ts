import type { Rect,Vec2 } from '@/engine/math';
export const WORLD={width:2400,height:1600,tile:32};
export const REGIONS=[{id:'seitah',name:'Séítah crater floor',subtitle:'Volcanic plains',start:0,end:960,color:'#cb805c'},{id:'delta',name:'Three Forks delta',subtitle:'Ancient riverbed',start:960,end:1696,color:'#c9a778'},{id:'margin',name:'Carbonate margin',subtitle:'The crater rim',start:1696,end:2400,color:'#b88b72'}];
export const regionAt=(p:Vec2)=>REGIONS.find(r=>p.x>=r.start&&p.x<r.end)??REGIONS[2];
export const noise=(x:number,y:number)=>{const n=Math.sin(x*127.1+y*311.7)*43758.5453;return n-Math.floor(n);};
const loaded=new Map<string,number[][]>();
/** Lazy region tile loading; boundaries are seamless world-space loading zones. */
export function loadRegion(id:string){if(!loaded.has(id)){const r=REGIONS.find(r=>r.id===id)!;loaded.set(id,Array.from({length:50},(_,y)=>Array.from({length:Math.ceil((r.end-r.start)/32)},(_,x)=>Math.floor(noise(x+r.start/32,y)*5))));}return loaded.get(id)!;}
export const obstacles:Rect[]=Array.from({length:85},(_,i)=>({x:80+noise(i,3)*2240,y:70+noise(i,9)*1460,w:25+noise(i,4)*40,h:18+noise(i,7)*28})).filter(r=>!(r.x<1020&&r.x+r.w>90&&r.y<590&&r.y+r.h>230)&&Math.hypot(r.x-600,r.y-560)>310);
export function drawTerrain(c:CanvasRenderingContext2D,view:Rect){for(const region of REGIONS){if(region.end<view.x||region.start>view.x+view.w)continue;const tiles=loadRegion(region.id);c.fillStyle=region.color;c.fillRect(region.start,0,region.end-region.start,WORLD.height);
  for(let y=Math.max(0,Math.floor(view.y/32));y<Math.min(50,Math.ceil((view.y+view.h)/32));y++)for(let x=0;x<tiles[y].length;x++){const wx=region.start+x*32;if(wx<view.x-32||wx>view.x+view.w)continue;const n=tiles[y][x];const shade=n===0?'#ffffff0d':n===1?'#432d2812':n===2?'#2b1f1d0d':'#f1c39416';c.fillStyle=shade;c.fillRect(wx+2,y*32+3,28,25);
    if(n===0){c.fillStyle='#f5c99b22';c.fillRect(wx+7,y*32+9,13,3);c.fillStyle='#70443b33';c.fillRect(wx+18,y*32+16,7,3);}
    if(n===1){c.fillStyle='#6b40372b';c.fillRect(wx+5,y*32+20,18,3);c.fillStyle='#e8b18322';c.fillRect(wx+10,y*32+6,5,3);}
    if(n===2){c.fillStyle='#3e292733';c.fillRect(wx+8,y*32+8,18,5);c.fillStyle='#d89d7622';c.fillRect(wx+13,y*32+14,6,3);}
    if(n===3){c.fillStyle='#e2b89066';c.fillRect(wx+16,y*32+20,3,3);c.fillStyle='#71463a33';c.fillRect(wx+5,y*32+11,7,3);}
  }
  }
  // Winding dry channels and wind-shaped sediment, built from coarse pixel steps.
  for(let y=0;y<1600;y+=16){const x=1200+Math.round(Math.sin(y/140)*90/16)*16;c.fillStyle='#876d5a';c.fillRect(x,y,56,16);c.fillStyle='#d4b28b';c.fillRect(x+56,y,12,16);c.fillStyle='#e6c89a55';c.fillRect(x+8,y+3,24,2);}
  for(let i=0;i<42;i++){const x=40+noise(i,71)*2320,y=40+noise(i,73)*1520,r=8+noise(i,75)*18;if(x<view.x-40||x>view.x+view.w+40||y<view.y-40||y>view.y+view.h+40)continue;c.fillStyle='#4d302c55';c.beginPath();c.ellipse(x,y,r,r*.45,0,0,Math.PI*2);c.fill();c.fillStyle='#d89b7655';c.beginPath();c.ellipse(x-3,y-3,r*.65,r*.25,0,0,Math.PI*2);c.fill();}
  for(const o of obstacles){if(o.x<view.x-100||o.x>view.x+view.w+100||o.y<view.y-100||o.y>view.y+view.h+100)continue;c.fillStyle='#704b3e66';c.fillRect(o.x+8,o.y+o.h-4,o.w+8,12);c.fillStyle='#533b3e';c.fillRect(Math.round(o.x)-2,Math.round(o.y)+5,Math.round(o.w)+4,Math.round(o.h)-3);c.fillStyle='#94634f';c.fillRect(Math.round(o.x),Math.round(o.y)+7,Math.round(o.w),Math.round(o.h)-7);c.fillStyle='#bb855f';c.fillRect(o.x+5,o.y,o.w-12,12);c.fillStyle='#e5b77f';c.fillRect(o.x+8,o.y+2,o.w-19,4);}
}
