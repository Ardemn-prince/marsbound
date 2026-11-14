export type Vec2 = { x: number; y: number };
export type Rect = Vec2 & { w: number; h: number };
export const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));
export const distance = (a: Vec2, b: Vec2) => Math.hypot(a.x-b.x,a.y-b.y);
export const contains = (r: Rect, p: Vec2, margin = 0) => p.x >= r.x-margin && p.x <= r.x+r.w+margin && p.y >= r.y-margin && p.y <= r.y+r.h+margin;
