import {test} from 'node:test';
import assert from 'node:assert/strict';
import {samples} from '../src/game/research';
import {drybedX,biomeBlend,BASE_CENTER} from '../src/game/world';
import {movePlayer} from '../src/game/player';
import {launch} from '../src/game/progression';
test('collectible rocks leave the drybed and solar field clear',()=>{for(const s of samples){const left=drybedX(s.y);assert.ok(s.x<=left-28||s.x>=left+96);assert.ok(!(s.x>2452&&s.x<2748&&s.y>1852&&s.y<2200));}});
test('biome transition changes gradually over nearby positions',()=>{const a=biomeBlend({x:BASE_CENTER.x+520,y:BASE_CENTER.y}),b=biomeBlend({x:BASE_CENTER.x+521,y:BASE_CENTER.y});assert.ok(a.delta>0&&a.delta<1);assert.ok(Math.abs(a.delta-b.delta)<.01);});
test('blocked movement does not animate driving or walking',()=>{const p={...launch([]).player,x:100,y:100};assert.equal(movePlayer(p,{x:1,y:0,dash:false},.01,[{x:110,y:80,w:20,h:40}]).moving,false);});
