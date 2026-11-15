import test from 'node:test';
import assert from 'node:assert/strict';
import {newMission} from '../src/game/model';
import {currentKidMission,kidBadges} from '../src/game/kid-missions';

test('Rex missions guide a new expedition from walking to science',()=>{
  const m=newMission();
  assert.equal(currentKidMission(m).id,'mars-walker');
  m.explored.push('delta');
  assert.equal(currentKidMission(m).id,'rock-ranger');
  m.collected.push('sample-1','sample-2','sample-3');
  assert.equal(currentKidMission(m).id,'science-scout');
});

test('Rex badges reflect exploration, collecting, science, and beacon progress',()=>{
  const m=newMission();
  m.explored.push('delta');m.collected.push('sample-1','sample-2','sample-3');m.discoveries.push('basalt');m.beacon={x:1,y:1};
  assert.deepEqual(kidBadges(m).map(b=>b.earned),[true,true,true,true]);
});
