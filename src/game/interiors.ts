import {drawDetailSprite} from './sprites';
import bounds from './interior-atlas.json';
import type {Facility} from './base';
import type {Vec2} from '@/engine/math';
let atlas:HTMLImageElement|undefined;
export function interiorSprite(c:CanvasRenderingContext2D,name:keyof typeof bounds,x:number,y:number,w:number,h:number){
 if(typeof Image==='undefined')return false;
 if(!atlas){atlas=new Image();atlas.src='/sprites/mars-interiors-v1.png';}
 if(!atlas.complete||!atlas.naturalWidth)return false;
 const [sx,sy,sw,sh]=bounds[name];c.drawImage(atlas,sx,sy,sw,sh,Math.round(x),Math.round(y),w,h);return true;
}
export function drawAirlock(c:CanvasRenderingContext2D,f:Facility,player?:Vec2,inside=false){
 const x=f.x+f.w/2,y=f.y+f.h;
 const open=inside||!!(player&&Math.abs(player.x-x)<42&&Math.abs(player.y-y)<65);
 if(!interiorSprite(c,open?'openDoor':'door',x-34,y-64,68,64)){
  c.fillStyle='#36444b';c.fillRect(x-34,y-64,68,64);c.fillStyle='#a5b5b5';c.fillRect(x-27,y-56,54,56);
 }
 // Generated open-door art retains a panel: carve the real passage when approached.
 if(open){c.fillStyle='#1e292d';c.fillRect(x-23,y-50,46,50);c.fillStyle='#799288';c.fillRect(x-23,y-3,46,3);}

}
export function drawFacilityInterior(c:CanvasRenderingContext2D,f:Facility){
 c.save();c.beginPath();c.rect(f.x+10,f.y+10,f.w-20,f.h-20);c.clip();
 c.fillStyle='#45545b';c.fillRect(f.x,f.y,f.w,f.h);
 c.strokeStyle='#526167';c.lineWidth=1;
 for(let y=f.y+16;y<f.y+f.h;y+=64)for(let x=f.x+16;x<f.x+f.w;x+=64)c.strokeRect(x,y,64,64);
 c.fillStyle='#28383e';c.fillRect(f.x+10,f.y+10,10,f.h);c.fillRect(f.x+f.w-20,f.y+10,10,f.h);
 c.fillStyle='#75858b';c.fillRect(f.x+19,f.y+18,2,f.h-30);c.fillRect(f.x+f.w-22,f.y+18,2,f.h-30);
 for(let x=f.x+10;x<f.x+f.w-10;x+=100)interiorSprite(c,'wall',x,f.y+10,100,38);
 const label=(text:string,x:number,y:number)=>{c.font='bold 8px monospace';c.textAlign='center';c.fillStyle='#eff1cd';c.fillText(text,x,y);};
 if(f.id==='command'){
  interiorSprite(c,'console',f.x+f.w/2-56,f.y+95,112,76);
  interiorSprite(c,'bed',f.x+26,f.y+48,88,72);label('REST BED',f.x+70,f.y+135);
  drawDetailSprite(c,'heater',f.x+f.w-64,f.y+54,43,36);
  drawDetailSprite(c,'monitor',f.x+132,f.y+16,100,45);
  label('COMMAND / CRAFT',f.x+f.w/2,f.y+185);drawDetailSprite(c,'lockers',f.x+25,f.y+f.h-108,74,70);
 }else if(f.id==='lab'){
  interiorSprite(c,'console',f.x+22,f.y+57,70,50);
  interiorSprite(c,'scanner',f.x+f.w/2-43,f.y+f.h-116,86,70);label('ANALYZE ROCK',f.x+f.w/2,f.y+f.h-122);
 }else if(f.id==='storage'){
  interiorSprite(c,'storage',f.x+20,f.y+60,77,68);
  interiorSprite(c,'storage',f.x+120,f.y+60,77,68);
  interiorSprite(c,'console',f.x+f.w/2-35,f.y+f.h-91,70,44);label('ROVER CHARGE',f.x+f.w/2,f.y+f.h-99);
 }else{
  interiorSprite(c,'growTray',f.x+20,f.y+65,105,76);
  interiorSprite(c,'growTray',f.x+160,f.y+65,105,76);
  interiorSprite(c,'oxygen',f.x+57,f.y+182,66,62);label('O2',f.x+90,f.y+174);
  interiorSprite(c,'growTray',f.x+173,f.y+182,74,62);label('FOOD',f.x+210,f.y+174);
 }
 c.restore();
}
