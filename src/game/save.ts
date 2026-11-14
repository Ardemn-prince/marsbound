import { newMission,type Mission } from './model';
import { samples,SCIENCE } from './research';
import { OUTFIT,UPGRADES } from './progression';
import { shelterAt } from './base';
import { regionAt } from './world';
export const SAVE_KEY='marsbound.mission.v1';
const record=(v:unknown):v is Record<string,unknown>=>typeof v==='object'&&v!==null&&!Array.isArray(v);
const finite=(v:unknown):v is number=>typeof v==='number'&&Number.isFinite(v);
function shape(value:unknown,template:unknown):boolean{if(template===null)return true;if(Array.isArray(template))return Array.isArray(value)&&value.length<1000;if(record(template))return record(value)&&Object.entries(template).every(([k,v])=>shape(value[k],v));return typeof value===typeof template&&(typeof value!=='number'||Number.isFinite(value));}
const vector=(v:unknown)=>record(v)&&finite(v.x)&&finite(v.y)&&v.x>=0&&v.x<=2400&&v.y>=0&&v.y<=1600;
const strings=(v:unknown):v is string[]=>Array.isArray(v)&&v.every(s=>typeof s==='string'&&s.length<500);
export function decodeSave(raw:string):Mission{if(raw.length>250000)throw new Error('Save is too large.');const data:unknown=JSON.parse(raw);if(!record(data)||data.version!==1||!record(data.mission)||!shape(data.mission,newMission()))throw new Error('Unsupported or damaged save.');const m=data.mission;
  for(const key of ['inventory','collected','discoveries','explored','loadout','upgrades','loggedEvents','measuredEvents','timeline'])if(!strings(m[key]))throw new Error('Invalid save list.');
  if(!vector(m.player)||!vector(m.rover)||!vector(m.rex)||!record(m.rex)||!Array.isArray(m.rex.trail)||!m.rex.trail.every(vector)||(m.beacon!==null&&!vector(m.beacon)))throw new Error('Invalid saved position.');
  if(!finite(m.elapsed)||m.elapsed<0||m.elapsed>5040||!finite(m.points)||m.points<0||m.points>100000||!finite(m.capacity)||m.capacity<100||m.capacity>190||!finite(m.power)||m.power<0||m.power>m.capacity)throw new Error('Invalid saved resources.');
  for(const key of ['oxygen','heat','food','water','safety','roverCharge'])if(!finite(m[key])||m[key]<0||m[key]>100)throw new Error('Invalid resource range.');
  if(!finite(m.panelHealth)||m.panelHealth<.2||m.panelHealth>1||!finite(m.passiveScan)||m.passiveScan<0||m.passiveScan>=90||(m.supplyArrival!==null&&(!finite(m.supplyArrival)||m.supplyArrival<0)))throw new Error('Invalid equipment state.');
  const typed=m as unknown as Mission;const ids=new Set(samples.map(s=>s.id));if([...typed.inventory,...typed.collected].some(id=>!ids.has(id))||new Set(typed.collected).size!==typed.collected.length||new Set(typed.inventory).size!==typed.inventory.length||typed.inventory.some(id=>!typed.collected.includes(id))||typed.inventory.length>4)throw new Error('Invalid sample records.');
  if(typed.discoveries.some(id=>!Object.hasOwn(SCIENCE,id))||typed.loadout.some(id=>!OUTFIT.some(i=>i.id===id))||typed.upgrades.some(id=>!UPGRADES.some(i=>i.id===id))||typed.explored.some(id=>!['seitah','delta','margin'].includes(id)))throw new Error('Invalid discovery or equipment.');
  if(typed.scanning!==null&&(!record(typed.scanning)||!ids.has(typed.scanning.id)||!finite(typed.scanning.remaining)||typed.scanning.remaining<=0||typed.scanning.remaining>24||!typed.collected.includes(typed.scanning.id)||typed.inventory.includes(typed.scanning.id)))throw new Error('Invalid scan.');
  if(![null,'success','partial','evacuated'].includes(typed.outcome)||!typed.started)throw new Error('Invalid mission status.');
  return {...typed,paused:true,panel:null,shelter:shelterAt(typed.player),region:regionAt(typed.player).id,player:{...typed.player,moving:false},message:'Mission restored. Resume when you are ready.'};
}
export function encodeSave(m:Mission){if(!m.started)throw new Error('Launch a mission before saving.');return JSON.stringify({version:1,savedAt:new Date().toISOString(),mission:m});}
export function saveMission(m:Mission):string{try{localStorage.setItem(SAVE_KEY,encodeSave(m));return 'Mission saved on this device.';}catch{return 'Save failed. Browser storage may be unavailable or full.';}}
export function loadMission():{mission?:Mission;message:string}{try{const raw=localStorage.getItem(SAVE_KEY);if(!raw)return {message:'No saved mission on this device.'};return {mission:decodeSave(raw),message:'Saved mission loaded.'};}catch{return {message:'Cannot load this save. It is damaged, incompatible, or storage is unavailable. Your existing save has not been replaced.'};}}
