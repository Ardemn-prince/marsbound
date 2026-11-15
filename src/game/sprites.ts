/** Four-by-four atlas. Keep source pixels crisp and load only in the browser. */
let atlas: HTMLImageElement | undefined;
export function drawSprite(c:CanvasRenderingContext2D,column:number,row:number,x:number,y:number,size:number,flip=false):boolean {
  if(typeof Image==='undefined')return false;
  if(!atlas){atlas=new Image();atlas.src='/sprites/mars-atlas-v1.png';}
  if(!atlas.complete||!atlas.naturalWidth)return false;
  const cellW=atlas.naturalWidth/4,cellH=atlas.naturalHeight/4;
  c.save();c.imageSmoothingEnabled=false;
  c.translate(Math.round(x),Math.round(y));if(flip)c.scale(-1,1);
  c.drawImage(atlas,column*cellW,row*cellH,cellW,cellH,flip?-size:0,0,size,size);
  c.restore();return true;
}
export const walkFrame=(time:number,moving:boolean)=>moving?Math.floor(time*8)%4:3;

let weatherBeacon:HTMLImageElement|undefined;
export function drawWeatherBeacon(c:CanvasRenderingContext2D,x:number,y:number):boolean{
  if(typeof Image==='undefined')return false;
  if(!weatherBeacon){weatherBeacon=new Image();weatherBeacon.src='/sprites/weather-beacon-v1.png';}
  if(!weatherBeacon.complete||!weatherBeacon.naturalWidth)return false;
  c.save();c.imageSmoothingEnabled=false;c.drawImage(weatherBeacon,Math.round(x)-30,Math.round(y)-52,60,60);c.restore();return true;
}
