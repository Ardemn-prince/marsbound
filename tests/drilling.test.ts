import {test} from 'node:test';
import assert from 'node:assert/strict';
import {launch} from '../src/game/progression';
import {drillSample,samples} from '../src/game/research';
import {movePlayer} from '../src/game/player';
test('drill collects one rock with a brief animation and respects cargo limits',()=>{
 const m=launch([]),rock=samples[0];const drilled=drillSample(m,rock);
 assert.deepEqual(drilled.inventory,[rock.id]);assert.equal(drilled.player.drilling,true);
 assert.match(drilled.message,/Drilled and collected/);
 assert.equal(drillSample(drilled,rock).inventory.length,1);
 assert.equal(movePlayer(drilled.player,{x:0,y:0,dash:false},1,[]).drilling,false);
 const full={...m,inventory:samples.slice(1,5).map(s=>s.id)};
 assert.equal(drillSample(full,rock).inventory.length,4);
 assert.equal(drillSample({...m,riding:true},rock).inventory.length,0);
});
