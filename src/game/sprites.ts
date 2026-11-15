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
