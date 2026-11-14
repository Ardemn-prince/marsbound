import type { Vec2 } from '@/engine/math';
export type Player = Vec2 & { moving:boolean; facing:number; animation:number; action:number };
export type Mission = { player:Player; elapsed:number; paused:boolean; message:string; flashlight:boolean; region:string; explored:string[]; shelter:string|null; panel:string|null; circuits:{lab:boolean;moxie:boolean;heater:boolean} };
export function newMission():Mission{return {player:{x:600,y:650,moving:false,facing:1,animation:0,action:0},elapsed:0,paused:false,message:'Welcome to Jezero Base. Walk through a green airlock to enter a facility.',flashlight:false,region:'seitah',explored:['seitah'],shelter:null,panel:null,circuits:{lab:true,moxie:true,heater:true}};}
