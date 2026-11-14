import { clamp, type Vec2 } from './math';
export class Camera {
  x=0; y=0;
  constructor(public width=960,public height=600){}
  follow(target: Vec2,worldWidth: number,worldHeight: number) {this.x=clamp(target.x-this.width/2,0,Math.max(0,worldWidth-this.width));this.y=clamp(target.y-this.height/2,0,Math.max(0,worldHeight-this.height));}
  apply(ctx: CanvasRenderingContext2D){ctx.translate(-Math.round(this.x),-Math.round(this.y));}
}
