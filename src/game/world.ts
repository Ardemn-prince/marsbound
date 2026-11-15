import {drawGroundTile,drawEnvironmentSprite,drawRiverStrip,drawAtlasCell} from './sprites';
import { wrappedDistance,type Rect,type Vec2 } from '@/engine/math';
export const WORLD={width:4800,height:3200,tile:32};
export const BASE_CENTER={x:2400,y:1600};
export const REGIONS=[
  {id:'seitah',name:'Séítah crater floor',subtitle:'Volcanic plains',start:0,end:520,innerRadius:0,outerRadius:520,color:'#cb805c'},
  {id:'delta',name:'Three Forks delta',subtitle:'Ancient riverbed',start:520,end:1100,innerRadius:520,outerRadius:1100,color:'#c9a778'},
  {id:'margin',name:'Carbonate margin',subtitle:'The crater rim',start:1100,end:2160,innerRadius:1100,outerRadius:2160,color:'#b88b72'},
];
export const regionAt=(p:Vec2)=>{const radius=wrappedDistance(p,BASE_CENTER);return REGIONS.find(r=>radius>=r.innerRadius&&radius<r.outerRadius)??REGIONS[2];};
export const drybedX=(y:number)=>BASE_CENTER.x+Math.sin(y/180)*130;
export const clearRockPosition=(p:Vec2,padding=25):Vec2=>{
 const left=drybedX(p.y);let x=p.x;
 if(x>left-padding&&x<left+68+padding)x=left-padding-8;
 if(x>2480-padding&&x<2720+padding&&p.y>1880-padding&&p.y<2110+padding)x=2450-padding;
 return {x,y:p.y};
};
export const biomeBlend=(p:Vec2)=>{const r=wrappedDistance(p,BASE_CENTER);const smooth=(v:number)=>{const t=Math.max(0,Math.min(1,v));return t*t*(3-2*t);};return {delta:smooth((r-360)/320),margin:smooth((r-940)/320)};};
export const noise=(x:number,y:number)=>{const n=Math.sin(x*127.1+y*311.7)*43758.5453;return n-Math.floor(n);};
const loaded=new Map<string,number[][]>();
/** Lazy region tile loading; boundaries are seamless world-space loading zones. */
export function loadRegion(id:string){if(!loaded.has(id)){loaded.set(id,Array.from({length:50},(_,y)=>Array.from({length:75},(_,x)=>Math.floor(noise(x,y+id.length)*5))));}return loaded.get(id)!;}
export type WorldStructure={id:string;region:string;x:number;y:number;kind:'crater'|'outcrop'|'lavaTube'|'dune'|'channel'};
export const structures:WorldStructure[]=[
  {id:'impactCrater',region:'seitah',x:1500,y:1050,kind:'crater'},
  {id:'layeredOutcrop',region:'delta',x:3400,y:1600,kind:'outcrop'},
  {id:'lavaTube',region:'margin',x:650,y:1600,kind:'lavaTube'},
  {id:'duneField',region:'delta',x:2400,y:2850,kind:'dune'},
  {id:'dryChannel',region:'margin',x:2400,y:260,kind:'channel'},
];
const baseBounds={x:1950,y:1390,w:1300,h:420};
export const originalObstacles:Rect[]=Array.from({length:210},(_,i)=>({x:80+noise(i,3)*(WORLD.width-160),y:70+noise(i,9)*(WORLD.height-140),w:25+noise(i,4)*40,h:18+noise(i,7)*28})).filter(r=>!(r.x<baseBounds.x+baseBounds.w&&r.x+r.w>baseBounds.x&&r.y<baseBounds.y+baseBounds.h&&r.y+r.h>baseBounds.y)&&!structures.some(s=>Math.abs(s.x-r.x)<100&&Math.abs(s.y-r.y)<100)&&wrappedDistance({x:r.x+r.w/2,y:r.y+r.h/2},BASE_CENTER)>480);
export const obstacles=originalObstacles.map(o=>({...o,...clearRockPosition(o,o.w+15)}));
const mix=(from:string,to:string,amount:number)=>{const a=from.match(/\w\w/g)!.map(v=>parseInt(v,16)),b=to.match(/\w\w/g)!.map(v=>parseInt(v,16));return `#${a.map((v,i)=>Math.round(v+(b[i]-v)*amount).toString(16).padStart(2,'0')).join('')}`;};
const smooth=(n:number)=>n*n*(3-2*n);
const terrainColor=(radius:number)=>{const [center,delta,outer]=REGIONS.map(r=>r.color);const deltaBlend=smooth(Math.max(0,Math.min(1,(radius-360)/360)));const outerBlend=smooth(Math.max(0,Math.min(1,(radius-900)/420)));return mix(mix(center,delta,deltaBlend),outer,outerBlend);};
export function drawTerrain(c:CanvasRenderingContext2D,view:Rect){c.fillStyle=REGIONS[REGIONS.length-1].color;c.fillRect(0,0,WORLD.width,WORLD.height);
  for(let radius=REGIONS[REGIONS.length-1].outerRadius;radius>=0;radius-=32){c.fillStyle=terrainColor(radius);c.beginPath();c.arc(BASE_CENTER.x,BASE_CENTER.y,radius,0,Math.PI*2);c.fill();}
  for(let y=Math.max(0,Math.floor(view.y/32));y<Math.min(WORLD.height/32,Math.ceil((view.y+view.h)/32));y++)for(let x=Math.max(0,Math.floor(view.x/32));x<Math.min(WORLD.width/32,Math.ceil((view.x+view.w)/32));x++){const wx=x*32,wy=y*32;if(wx<view.x-32||wx>view.x+view.w||wy<view.y-32||wy>view.y+view.h)continue;const region=regionAt({x:wx+16,y:wy+16});const n=Math.floor(noise(x,y)*5);const shade=n===0?'#ffffff0d':n===1?'#432d2812':n===2?'#2b1f1d0d':'#f1c39416';c.fillStyle=terrainColor(wrappedDistance({x:wx+16,y:wy+16},BASE_CENTER));c.fillRect(wx+2,wy+3,28,25);c.fillStyle=shade;
    if(n===0){c.fillStyle='#f5c99b22';c.fillRect(wx+7,wy+9,13,3);c.fillStyle='#70443b33';c.fillRect(wx+18,wy+16,7,3);}
    if(n===1){c.fillStyle='#6b40372b';c.fillRect(wx+5,wy+20,18,3);c.fillStyle='#e8b18322';c.fillRect(wx+10,wy+6,5,3);}
    if(n===2){c.fillStyle=region.id==='delta'?'#6c594033':'#3e292733';c.fillRect(wx+8,wy+8,18,5);c.fillStyle='#d89d7622';c.fillRect(wx+13,wy+14,6,3);}
    if(n===3){c.fillStyle=region.id==='margin'?'#ead3ac66':'#e2b89066';c.fillRect(wx+16,wy+20,3,3);c.fillStyle='#71463a33';c.fillRect(wx+5,wy+11,7,3);}
  }
  for(let y=Math.max(0,Math.floor(view.y/16)*16);y<Math.min(WORLD.height,view.y+view.h+16);y+=16)for(let x=Math.max(0,Math.floor(view.x/16)*16);x<Math.min(WORLD.width,view.x+view.w+16);x+=16){const blend=biomeBlend({x:x+8,y:y+8});drawGroundTile(c,0,x,y,16);c.save();c.globalAlpha=blend.delta;drawGroundTile(c,1,x,y,16);c.globalAlpha=blend.margin;drawGroundTile(c,2,x,y,16);c.restore();}
  // Slice the reference channel along the existing cleared winding route.
  for(let y=Math.max(0,Math.floor(view.y));y<Math.min(WORLD.height,view.y+view.h+1);y+=1){drawRiverStrip(c,drybedX(y),y);}
  for(let i=0;i<110;i++){const x=40+noise(i,71)*(WORLD.width-80),y=40+noise(i,73)*(WORLD.height-80),r=8+noise(i,75)*18;if(x<view.x-40||x>view.x+view.w+40||y<view.y-40||y>view.y+view.h+40)continue;c.fillStyle='#4d302c55';c.beginPath();c.ellipse(x,y,r,r*.45,0,0,Math.PI*2);c.fill();c.fillStyle='#d89b7655';c.beginPath();c.ellipse(x-3,y-3,r*.65,r*.25,0,0,Math.PI*2);c.fill();}
  for(const o of obstacles){if(o.x<view.x-100||o.x>view.x+view.w+100||o.y<view.y-100||o.y>view.y+view.h+100)continue;if(drawEnvironmentSprite(c,regionAt(o).id==='seitah'?'basalt':regionAt(o).id==='delta'?'mudstone':'clay',o.x,o.y-8,o.w,o.h+8))continue;c.fillStyle='#704b3e66';c.fillRect(o.x+8,o.y+o.h-4,o.w+8,12);c.fillStyle='#533b3e';c.fillRect(Math.round(o.x)-2,Math.round(o.y)+5,Math.round(o.w)+4,Math.round(o.h)-3);c.fillStyle='#94634f';c.fillRect(Math.round(o.x),Math.round(o.y)+7,Math.round(o.w),Math.round(o.h)-7);c.fillStyle='#bb855f';c.fillRect(o.x+5,o.y,o.w-12,12);c.fillStyle='#e5b77f';c.fillRect(o.x+8,o.y+2,o.w-19,4);}
}
export function drawWorldContent(c:CanvasRenderingContext2D){for(const s of structures){const x=Math.round(s.x),y=Math.round(s.y);const cell={crater:0,outcrop:1,lavaTube:2,dune:3,channel:4}[s.kind];if(drawAtlasCell(c,'formations-v1.png',3,2,cell%3,Math.floor(cell/3),x-100,y-90,200,180))continue;c.fillStyle='#3c2b2c66';c.fillRect(x-60,y+28,120,12);c.fillStyle='#60443d';if(s.kind==='crater'){c.beginPath();c.ellipse(x,y,78,42,0,0,Math.PI*2);c.fill();c.fillStyle='#b8735e';c.beginPath();c.ellipse(x,y-4,55,26,0,0,Math.PI*2);c.fill();c.fillStyle='#4d3735';c.beginPath();c.ellipse(x,y-8,30,13,0,0,Math.PI*2);c.fill();}else if(s.kind==='outcrop'){c.fillStyle='#765348';c.fillRect(x-56,y-14,112,30);c.fillStyle='#c18a68';c.fillRect(x-48,y-28,96,14);c.fillStyle='#e0b07e';c.fillRect(x-34,y-39,72,11);c.fillStyle='#5d443d';for(let i=0;i<4;i++)c.fillRect(x-35+i*20,y-25,3,44);}else if(s.kind==='lavaTube'){c.beginPath();c.arc(x,y+3,55,Math.PI,0);c.fill();c.fillStyle='#251f29';c.beginPath();c.arc(x,y+4,35,Math.PI,0);c.fill();}else if(s.kind==='dune'){c.fillStyle='#a86f57';for(let i=0;i<5;i++){c.beginPath();c.ellipse(x-50+i*25,y+4-(i%2)*8,42,18,0,0,Math.PI*2);c.fill();}}else{c.fillStyle='#9c6c58';c.fillRect(x-55,y-8,110,18);c.fillStyle='#d6a177';c.fillRect(x-40,y-17,80,6);c.fillStyle='#70483e';c.fillRect(x-18,y-25,36,7);}}}
