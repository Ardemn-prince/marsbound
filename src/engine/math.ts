export type Vec2 = { x: number; y: number };
export type Rect = Vec2 & { w: number; h: number };
export const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));
export const distance = (a: Vec2, b: Vec2) => Math.hypot(a.x-b.x,a.y-b.y);
export const contains = (r: Rect, p: Vec2, margin = 0) => p.x >= r.x-margin && p.x <= r.x+r.w+margin && p.y >= r.y-margin && p.y <= r.y+r.h+margin;
export const wrap = (n:number,max:number) => ((n%max)+max)%max;
export const wrapPosition = (p:Vec2,width:number,height:number):Vec2 => ({x:wrap(p.x,width),y:wrap(p.y,height)});
export const wrappedDelta = (from:number,to:number,max:number) => {
  const delta=to-from;
  return Math.abs(delta)<=max/2?delta:delta-Math.sign(delta)*max;
};
export const wrappedDistance = (a:Vec2,b:Vec2,width=4800,height=3200) => {
  const dx=Math.min(Math.abs(a.x-b.x),width-Math.abs(a.x-b.x));
  const dy=Math.min(Math.abs(a.y-b.y),height-Math.abs(a.y-b.y));
  return Math.hypot(dx,dy);
};
