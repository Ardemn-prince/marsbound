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
export const walkFrame=(time:number,moving:boolean)=>moving?Math.floor(time*8)%4:1;

let weatherBeacon:HTMLImageElement|undefined;
export function drawWeatherBeacon(c:CanvasRenderingContext2D,x:number,y:number):boolean{
  if(drawEnvironmentSprite(c,'beacon',x-15,y-48,30,54))return true;
  if(typeof Image==='undefined')return false;
  if(!weatherBeacon){weatherBeacon=new Image();weatherBeacon.src='/sprites/weather-beacon-v1.png';}
  if(!weatherBeacon.complete||!weatherBeacon.naturalWidth)return false;
  c.save();c.imageSmoothingEnabled=false;c.drawImage(weatherBeacon,Math.round(x)-30,Math.round(y)-52,60,60);c.restore();return true;
}

/** Alpha-bounded rectangles from the supplied environment sheet, prepared as a transparent atlas. */
export const ENVIRONMENT_SPRITES={command:[17,39,397,346],lab:[437,62,386,326],storage:[870,122,357,245],greenhouse:[32,485,370,273],solar:[518,494,216,258],beacon:[966,464,159,288],basalt:[68,925,281,265],mudstone:[461,929,327,265],clay:[880,917,320,282]} as const;
let environmentAtlas:HTMLImageElement|undefined;
export function drawEnvironmentSprite(c:CanvasRenderingContext2D,name:keyof typeof ENVIRONMENT_SPRITES,x:number,y:number,w:number,h:number,online=true):boolean{
  if(typeof Image==='undefined')return false;
  if(!environmentAtlas){environmentAtlas=new Image();environmentAtlas.src='/sprites/mars-environment-v1.png';}
  if(!environmentAtlas.complete||!environmentAtlas.naturalWidth)return false;
  const [sx,sy,sw,sh]=ENVIRONMENT_SPRITES[name];
  c.save();c.imageSmoothingEnabled=false;if(!online)c.filter='brightness(0.45)';
  c.drawImage(environmentAtlas,sx,sy,sw,sh,Math.round(x),Math.round(y),w,h);c.restore();return true;
}

let groundAtlas:HTMLImageElement|undefined;
export function drawGroundTile(c:CanvasRenderingContext2D,column:number,x:number,y:number,size:number){
 if(typeof Image==='undefined')return;
 if(!groundAtlas){groundAtlas=new Image();groundAtlas.src='/sprites/mars-ground-v1.png';}
 if(!groundAtlas.complete||!groundAtlas.naturalWidth)return;
 const width=groundAtlas.naturalWidth/3;c.drawImage(groundAtlas,column*width+(x%128)/128*width,(y%128)/128*groundAtlas.naturalHeight,size/128*width,size/128*groundAtlas.naturalHeight,x,y,size,size);
}

const detailBounds={idle:[140,36,232,445],rexIdle:[646,177,230,285],river:[1162,20,238,474],monitor:[22,640,470,260],heater:[580,623,367,307],lockers:[1060,574,435,414]} as const;
let detailAtlas:HTMLImageElement|undefined;
export function drawDetailSprite(c:CanvasRenderingContext2D,name:keyof typeof detailBounds,x:number,y:number,w:number,h:number,flip=false){
 if(typeof Image==='undefined')return false;
 if(!detailAtlas){detailAtlas=new Image();detailAtlas.src='/sprites/idle-room-river-v1.png';}
 if(!detailAtlas.complete||!detailAtlas.naturalWidth)return false;
 const [sx,sy,sw,sh]=detailBounds[name];c.save();c.translate(Math.round(x),Math.round(y));if(flip){c.translate(w,0);c.scale(-1,1);}c.drawImage(detailAtlas,sx,sy,sw,sh,0,0,w,h);c.restore();return true;
}
export function riverSourceRow(y:number){const phase=((y%256)+256)%256;return phase<128?phase:255-phase;}
export function drawRiverStrip(c:CanvasRenderingContext2D,x:number,y:number){
 if(!detailAtlas?.complete||!detailAtlas.naturalWidth){drawDetailSprite(c,'river',x,y,68,128);return;}
 const [sx,sy,sw,sh]=detailBounds.river;
 // Reflect alternate repeats so each seam uses the same source edge.
 c.drawImage(detailAtlas,sx,sy+riverSourceRow(y)/128*sh,sw,sh/128,Math.round(x),y,68,1);
}

const extraAtlases=new Map<string,HTMLImageElement>();
export function drawAtlasCell(c:CanvasRenderingContext2D,file:string,cols:number,rows:number,col:number,row:number,x:number,y:number,w:number,h:number,flip=false){
 if(typeof Image==='undefined')return false;
 let img=extraAtlases.get(file);if(!img){img=new Image();img.src='/sprites/'+file;extraAtlases.set(file,img);}
 if(!img.complete||!img.naturalWidth)return false;
 c.save();c.translate(Math.round(x),Math.round(y));if(flip){c.translate(w,0);c.scale(-1,1);}
 c.drawImage(img,col*img.naturalWidth/cols,row*img.naturalHeight/rows,img.naturalWidth/cols,img.naturalHeight/rows,0,0,w,h);c.restore();return true;
}
