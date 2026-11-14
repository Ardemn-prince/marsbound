import { Camera } from './camera';
export class Renderer {
  readonly ctx: CanvasRenderingContext2D;
  readonly camera=new Camera();
  constructor(canvas: HTMLCanvasElement){canvas.width=960;canvas.height=600;const ctx=canvas.getContext('2d',{alpha:false});if(!ctx)throw new Error('Canvas 2D is unavailable');this.ctx=ctx;ctx.imageSmoothingEnabled=false;}
  begin(){this.ctx.setTransform(1,0,0,1,0,0);this.ctx.fillStyle='#b96e50';this.ctx.fillRect(0,0,960,600);this.ctx.save();this.camera.apply(this.ctx);}
  end(){this.ctx.restore();}
  demo(time:number){this.begin();const c=this.ctx;c.fillStyle='#c67b56';for(let y=0;y<600;y+=32)for(let x=0;x<960;x+=32){if((x+y)%96===0)c.fillRect(x,y,30,30);}c.fillStyle='#ebdfba';c.fillRect(465,280+Math.sin(time)*3,30,38);this.end();}
}
