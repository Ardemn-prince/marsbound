import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import type {InputManager} from '../src/engine/input';
import ExpeditionHud from '../src/components/ExpeditionHud';
import {bed} from '../src/game/base';
import {TIME_SCALE} from '../src/game/forecast';
import {tickHazards} from '../src/game/hazards';
import {launch} from '../src/game/progression';
import {rexTip} from '../src/game/rex';
import {useMission} from '../src/game/store';
import {service,tickSurvival} from '../src/game/survival';

function near(actual:number,expected:number){assert.ok(Math.abs(actual-expected)<1e-8,`${actual} != ${expected}`);}

test('empty oxygen doubles damage without changing other life-support penalties or stacking them',()=>{
  const base={...launch([]),safety:100};
  for(const shelter of [null,'command']){
    for(const [oxygen,sustenance,heat,damage] of [[0,100,100,.6],[100,0,100,.3],[100,100,0,.3],[0,0,0,.6],[100,0,0,.3]]){
      near(tickSurvival({...base,shelter,oxygen,sustenance,heat},1).safety,100-damage*TIME_SCALE);
    }
  }
  near(tickSurvival({...base,oxygen:0,sleep:0,sleepDeprivation:46},1).safety,100-.7*TIME_SCALE);
  near(tickSurvival({...base,shelter:'command',safety:50},1).safety,50+.06*TIME_SCALE);
});

test('tank consumption and refill remain unchanged and low oxygen alone causes no damage',()=>{
  const base=launch([]);
  near(tickSurvival(base,10).oxygen,100-TIME_SCALE);
  assert.equal(tickSurvival({...base,oxygen:1},1).safety,100);
  const refilled=service({...base,shelter:'greenhouse',oxygen:0});
  assert.equal(refilled.oxygen,100);
  assert.equal(tickSurvival(refilled,1).safety,100);
});

test('oxygen warnings persist between normal Rex appearances and clear after refill',()=>{
  // At 10 seconds Rex normally hides; during a storm the oxygen warning still takes priority.
  for(const elapsed of [10,160]){
    for(const [oxygen,warning] of [[25,'Oxygen low'],[10,'Oxygen critical'],[0,'Oxygen empty']] as const){
      const mission={...launch([]),elapsed,oxygen};
      assert.ok(rexTip(mission).startsWith(warning));
      const html=renderToStaticMarkup(createElement(ExpeditionHud,{m:mission}));
      assert.ok(html.includes('role="status"'));
      assert.ok(html.includes(warning));
    }
  }
  assert.match(rexTip({...launch([]),oxygen:10.01}),/^Oxygen low/);
  assert.match(rexTip({...launch([]),oxygen:.01}),/^Oxygen critical/);
  assert.doesNotMatch(rexTip({...launch([]),oxygen:25.01}),/^Oxygen (low|critical|empty)/);
  const refilled=service({...launch([]),shelter:'greenhouse',oxygen:0,elapsed:10});
  assert.doesNotMatch(renderToStaticMarkup(createElement(ExpeditionHud,{m:refilled})),/Oxygen (low|critical|empty)/);
});

test('sleep wakes on empty oxygen, cannot restart empty, and resumes normal simulation speed',()=>{
  const original=useMission.getState().mission;
  const input={consume:()=>false,isDown:()=>false,clear:()=>{}} as unknown as InputManager;
  try{
    useMission.setState({mission:{...launch([]),sleeping:true,sleep:40,oxygen:.001,shelter:'command',player:{...launch([]).player,...bed}}});
    useMission.getState().step(1/60,input);
    const awake=useMission.getState().mission;
    assert.equal(awake.oxygen,0);
    assert.equal(awake.sleeping,false);
    assert.match(awake.message,/wake up/);
    useMission.getState().interact();
    assert.equal(useMission.getState().mission.sleeping,false);
    assert.match(useMission.getState().mission.message,/before sleeping/);
    useMission.getState().step(1/60,input);
    near(useMission.getState().mission.elapsed-awake.elapsed,1/60);
    // Older saves can contain a sleeping astronaut with an already empty tank.
    useMission.setState({mission:{...awake,sleeping:true}});
    useMission.getState().step(1/60,input);
    near(useMission.getState().mission.elapsed-awake.elapsed,1/60);
    assert.equal(useMission.getState().mission.sleeping,false);
  }finally{useMission.setState({mission:original});}
});

test('Rex rescue still leaves oxygen empty and the warning active',()=>{
  const rescued=tickHazards(tickSurvival({...launch([]),oxygen:0,safety:15},1),1);
  assert.equal(rescued.shelter,'command');
  assert.equal(rescued.safety,25);
  assert.equal(rescued.oxygen,0);
  assert.match(rexTip(rescued),/^Oxygen empty/);
  near(tickSurvival(rescued,1).safety,25-.6*TIME_SCALE);
});
