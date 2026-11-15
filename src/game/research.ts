import {drawSprite} from './sprites';
import { contains,wrappedDistance,wrappedDelta,type Vec2 } from '@/engine/math';
import type { Mission } from './model';
import { noise,obstacles,regionAt,WORLD } from './world';
import { TIME_SCALE } from './forecast';
export const SCIENCE={
  basalt:{name:'Volcanic stone',points:3,seconds:10,color:'#d8a46e',fact:'Basalt forms when lava cools. These rocks help scientists read the history of Martian volcanoes.',url:'https://science.nasa.gov/mars/facts/'},
  mudstone:{name:'River mudstone',points:7,seconds:30,color:'#b7c7af',fact:'Fine sediment settles in quiet water. Jezero’s ancient delta preserves clues to a long-vanished lake.',url:'https://www.nasa.gov/missions/mars-2020-perseverance/perseverance-rover/nasas-perseverance-rover-deciphers-ancient-history-of-martian-lake/'},
  clay:{name:'Water-locked clay',points:5,seconds:20,color:'#a8d6c5',fact:'Clay minerals can form when rock interacts with water. Finding them helps us investigate ancient wet environments.',url:'https://science.nasa.gov/mars/facts/'}
};
export type SampleKind=keyof typeof SCIENCE;
export const RARITIES={common:{name:'Common',multiplier:1,time:1,color:'#c4b39a'},uncommon:{name:'Uncommon',multiplier:1.4,time:1.05,color:'#8ec7af'},rare:{name:'Rare',multiplier:2.5,time:1.2,color:'#8eb7e8'},pristine:{name:'Pristine',multiplier:5,time:1.45,color:'#e6c876'}} as const;
export type StoneRarity=keyof typeof RARITIES;
export type Sample=Vec2 & {id:string;kind:SampleKind;rarity:StoneRarity};
export const rarityAt=(seed:number,region:'seitah'|'delta'|'margin'='seitah'):StoneRarity=>{const thresholds=region==='margin'?[.55,.78,.95]:region==='delta'?[.62,.86,.975]:[.7,.92,.985];return seed<thresholds[0]?'common':seed<thresholds[1]?'uncommon':seed<thresholds[2]?'rare':'pristine';};
export const researchValue=(sample:Sample)=>Math.round(SCIENCE[sample.kind].points*RARITIES[sample.rarity].multiplier);
export const samples:Sample[]=[{id:'sample-0',x:2520,y:1920,kind:'basalt',rarity:'uncommon'},...Array.from({length:180},(_,i)=>{const x=100+noise(i,21)*(WORLD.width-200),y=100+noise(i,31)*(WORLD.height-200);const region=regionAt({x,y}).id as 'seitah'|'delta'|'margin';const kind:SampleKind=region==='seitah'?'basalt':region==='delta'?'mudstone':'clay';return {id:`sample-${i+1}`,x,y,kind,rarity:rarityAt(noise(i,55),region)};}).filter(s=>!(s.x>1950&&s.x<3250&&s.y>1370&&s.y<1900)&&!obstacles.some(o=>contains(o,s,40)))];
export const sampleById=(id:string)=>samples.find(s=>s.id===id);
export function collect(m:Mission,sample:Sample,capacity=4):Mission{if(m.collected.includes(sample.id))return m;if(m.inventory.length>=capacity)return {...m,message:'Your sample rack is full. Bring the rocks back to the lab.'};return {...m,collected:[...m.collected,sample.id],inventory:[...m.inventory,sample.id],player:{...m.player,action:.6},message:`Collected a ${RARITIES[sample.rarity].name.toLowerCase()} ${SCIENCE[sample.kind].name.toLowerCase()}. Its value will be revealed in the lab.`};}
export function startScan(m:Mission):Mission{if(m.scanning)return {...m,message:'The scanner is already busy. Let it finish.'};if(!m.inventory.length)return {...m,message:'Find a stone outside, then bring it to the lab.'};if(!m.circuits.lab)return {...m,message:'The lab is powered down. Turn it on at the power panel.'};const sample=sampleById(m.inventory[0])!;return {...m,inventory:m.inventory.slice(1),scanning:{id:sample.id,remaining:SCIENCE[sample.kind].seconds*RARITIES[sample.rarity].time/((m.loadout.includes('drill')||m.upgrades.includes('scanner'))?2:1)},message:`Scanning this ${RARITIES[sample.rarity].name.toLowerCase()} stone. Better stones take a little longer.`};}
export function tickResearch(m:Mission,dt:number):Mission{if(!m.scanning||!m.circuits.lab||m.power<=0)return m;const remaining=m.scanning.remaining-dt*TIME_SCALE;if(remaining>0)return {...m,scanning:{...m.scanning,remaining}};const sample=sampleById(m.scanning.id)!;const science=SCIENCE[sample.kind];const points=researchValue(sample);return {...m,scanning:null,water:sample.kind==='clay'?Math.min(100,m.water+20):m.water,points:m.points+points,discoveries:[...new Set([...m.discoveries,sample.kind])],message:`Research complete! ${RARITIES[sample.rarity].name} ${science.name}: +${points} research points. ${science.fact}`};}
export function drawSamples(c:CanvasRenderingContext2D,m:Mission){for(const s of samples){if(m.collected.includes(s.id))continue;if(drawSprite(c,s.kind==='basalt'?0:s.kind==='mudstone'?1:2,0,s.x-22,s.y-25,44))continue;const color=SCIENCE[s.kind].color;c.fillStyle='#503e3655';c.fillRect(s.x-13,s.y+6,30,8);c.fillStyle=color;c.fillRect(s.x-10,s.y-5,21,14);c.fillRect(s.x-5,s.y-10,12,6);c.fillStyle='#f4e8c9';c.fillRect(s.x-5,s.y-7,6,3);}}

/** Identify a nearby rock without collecting it or awarding research points. */
export function fieldScan(m:Mission):Mission{
  if(!m.started||m.paused||m.panel||m.outcome)return m;
  if(!m.upgrades.includes('field-scanner'))return {...m,message:'Craft a Field scanner at the Command workbench first (C).'};
  if(m.riding||m.shelter)return {...m,message:'Step outside on foot to scan a rock.'};
  const advanced=m.upgrades.includes('field-scanner-plus'),range=advanced?180:90;
  const sample=samples.filter(s=>!m.collected.includes(s.id)&&wrappedDistance(m.player,s)<=range).sort((a,b)=>wrappedDistance(m.player,a)-wrappedDistance(m.player,b))[0];
  if(!sample)return {...m,message:'No rock in scanner range. Walk closer and press Q again.'};
  const dx=wrappedDelta(m.player.x,sample.x,WORLD.width),dy=wrappedDelta(m.player.y,sample.y,WORLD.height);
  const direction=Math.abs(dx)>Math.abs(dy)?(dx>0?'east':'west'):(dy>0?'south':'north');
  return {...m,player:{...m.player,action:.6},message:'Scanner: '+RARITIES[sample.rarity].name+' '+SCIENCE[sample.kind].name.toLowerCase()+' to the '+direction+'.'+(advanced?' Worth '+researchValue(sample)+' research points after lab analysis.':'')};
}

export function drillSample(m:Mission,sample:Sample):Mission{
  if(m.riding)return {...m,message:'Leave the rover (V) before drilling a rock.'};
  const next=collect(m,sample,4);
  if(next.inventory.length===m.inventory.length)return next;
  return {...next,player:{...next.player,action:.6,drilling:true},message:next.message.replace('Collected a','Drilled and collected a')};
}
