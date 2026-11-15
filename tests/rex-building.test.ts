import {test} from 'node:test';
import assert from 'node:assert/strict';
import {launch} from '../src/game/progression';
import {tickRex} from '../src/game/rex';
import {facilityWalls,shelterAt} from '../src/game/base';
import {contains} from '../src/engine/math';
test('Rex enters Command through its airlock and never crosses walls',()=>{let m=launch([]);m={...m,shelter:'command',player:{...m.player,x:2370,y:1690},rex:{x:2370,y:1820,trail:[{x:2370,y:1775},{x:2370,y:1740},{x:2370,y:1690}]}};for(let i=0;i<120;i++){m=tickRex(m,1/60);assert.equal(facilityWalls.some(w=>contains(w,m.rex,6)),false);}assert.equal(shelterAt(m.rex),'command');});
test('Rex refuses a shortcut through the Command wall',()=>{let m=launch([]);m={...m,shelter:'command',player:{...m.player,x:2240,y:1600},rex:{x:2170,y:1600,trail:[{x:2240,y:1600}],following:true}};for(let i=0;i<60;i++)m=tickRex(m,.1);assert.ok(m.rex.x<2200);});
