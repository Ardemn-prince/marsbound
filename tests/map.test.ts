import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mapPosition} from '../src/game/map';
import {BASE_CENTER,WORLD} from '../src/game/world';
test('schematic map centers base and preserves biome boundary order',()=>{assert.deepEqual(mapPosition(BASE_CENTER),{x:250,y:250});for(const [worldRadius,mapRadius] of [[520,60],[1100,112]]){const p=mapPosition({x:BASE_CENTER.x+worldRadius,y:BASE_CENTER.y});assert.equal(p.x,250+mapRadius);assert.equal(p.y,250);}const outer=mapPosition({x:0,y:0});assert.ok(Math.hypot(outer.x-250,outer.y-250)<=201.001);});
test('map treats opposite world edges as the same wrapped position',()=>{assert.deepEqual(mapPosition({x:0,y:700}),mapPosition({x:WORLD.width,y:700}));assert.deepEqual(mapPosition({x:600,y:0}),mapPosition({x:600,y:WORLD.height}));});
