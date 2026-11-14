/** Fixed 60 Hz updates; capped catch-up prevents background-tab time jumps. */
export class GameLoop {
  private frame=0; private last=0; private accumulator=0; private running=false;
  constructor(private update:(dt:number)=>void,private render:()=>void){}
  private step=(now:number)=>{if(!this.running)return;const dt=this.last?Math.min((now-this.last)/1000,.1):0;this.last=now;
    if(!document.hidden){this.accumulator+=dt;while(this.accumulator>=1/60){this.update(1/60);this.accumulator-=1/60;}this.render();}else this.accumulator=0;
    this.frame=requestAnimationFrame(this.step);
  };
  start(){if(this.running)return;this.running=true;this.last=0;this.frame=requestAnimationFrame(this.step);}
  stop(){this.running=false;cancelAnimationFrame(this.frame);this.last=0;this.accumulator=0;}
}
