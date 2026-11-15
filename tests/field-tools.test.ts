import { test } from 'node:test';
import assert from 'node:assert/strict';
import { launch, buyUpgrade } from '../src/game/progression';
import { tickRex } from '../src/game/rex';
import { samples, fieldScan, RARITIES, researchValue } from '../src/game/research';
import { decodeSave, encodeSave } from '../src/game/save';
import { wrappedDistance } from '../src/engine/math';

test('Rex waits, follows, then rests at a stable distance without walking in place',()=>{
  let m=launch([]);m={...m,player:{...m.player,x:1000,y:1000},rex:{x:800,y:1000,trail:[]}};
  for(let i=0;i<4;i++)m=tickRex(m,.1);
  assert.equal(m.rex.x,800);
  for(let i=0;i<100;i++)m=tickRex(m,.05);
  assert.ok(Math.abs(wrappedDistance(m.rex,m.player)-72)<.01);
  const x=m.rex.x;
  for(let i=0;i<60;i++)m=tickRex(m,1/60);
  assert.equal(m.rex.x,x);assert.equal(m.rex.moving,false);
  m=tickRex({...m,player:{...m.player,x:1010}},.2);
  assert.equal(m.rex.x,x);
});
test('Rex follows across a wrapped edge without crossing the whole world',()=>{
  let m=launch([]);m={...m,player:{...m.player,x:30,y:1000},rex:{x:4680,y:1000,trail:[]}};
  for(let i=0;i<60;i++)m=tickRex(m,.05);
  assert.ok(wrappedDistance(m.rex,m.player)<=73);assert.ok(m.rex.x>4700);
});
test('field scanner requires crafting and Mk II requires the basic tool',()=>{
  const m={...launch([]),shelter:'command',points:50};
  assert.match(fieldScan({...m,shelter:null}).message,/Craft a Field scanner/);
  assert.equal(buyUpgrade(m,'field-scanner-plus').points,50);
  const basic=buyUpgrade(m,'field-scanner');assert.equal(basic.points,40);
  const advanced=buyUpgrade(basic,'field-scanner-plus');assert.equal(advanced.points,20);
  assert.ok(decodeSave(encodeSave(advanced)).upgrades.includes('field-scanner-plus'));
});
test('scanner reveals rarity without collecting or awarding points; upgrade expands range and reveals value',()=>{
  const sample=samples[0];
  const m={...launch([]),upgrades:['field-scanner'],player:{...launch([]).player,x:sample.x,y:sample.y},collected:samples.slice(1).map(s=>s.id)};
  const scanned=fieldScan(m);assert.match(scanned.message,new RegExp(RARITIES[sample.rarity].name));
  assert.equal(scanned.points,m.points);assert.deepEqual(scanned.inventory,[]);assert.deepEqual(scanned.collected,m.collected);
  const far={...m,player:{...m.player,x:sample.x+120}};
  assert.match(fieldScan(far).message,/No rock in scanner range/);
  assert.match(fieldScan({...far,upgrades:['field-scanner','field-scanner-plus']}).message,new RegExp('Worth '+researchValue(sample)));
  assert.match(fieldScan({...m,collected:[...m.collected,sample.id]}).message,/No rock/);
  assert.equal(fieldScan({...m,paused:true}).message,m.message);
  assert.match(fieldScan({...m,riding:true}).message,/on foot/);
});
