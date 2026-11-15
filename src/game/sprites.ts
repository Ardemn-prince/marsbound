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
