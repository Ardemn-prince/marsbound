import type { Vec2 } from '@/engine/math';
export type Player = Vec2 & { moving:boolean; facing:number; animation:number; action:number };
export type Mission = { player:Player; elapsed:number; paused:boolean; message:string; flashlight:boolean };
export function newMission():Mission{return {player:{x:600,y:650,moving:false,facing:1,animation:0,action:0},elapsed:0,paused:false,message:'Touchdown confirmed. Explore with WASD. Press E near the landing beacon.',flashlight:false};}
