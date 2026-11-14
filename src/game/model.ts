import type { Vec2 } from '@/engine/math';
import type { SampleKind } from './research';
export type Player = Vec2 & { moving:boolean; facing:number; animation:number; action:number };
export type Mission = { player:Player; elapsed:number; paused:boolean; message:string; flashlight:boolean; region:string; explored:string[]; shelter:string|null; panel:string|null; circuits:{lab:boolean;moxie:boolean;heater:boolean}; inventory:string[];collected:string[];discoveries:SampleKind[];points:number;scanning:{id:string;remaining:number}|null;rex:Vec2 & {trail:Vec2[]} };
export function newMission():Mission{return {player:{x:600,y:650,moving:false,facing:1,animation:0,action:0},elapsed:0,paused:false,message:'Find the marked rock east of the solar array. Press E to collect it.',flashlight:false,region:'seitah',explored:['seitah'],shelter:null,panel:null,circuits:{lab:true,moxie:true,heater:true},inventory:[],collected:[],discoveries:[],points:0,scanning:null,rex:{x:560,y:650,trail:[]}};}
