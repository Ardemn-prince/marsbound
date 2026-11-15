import test from 'node:test';
import assert from 'node:assert/strict';
import {action_sound_ids} from '../src/game/audio-actions';
import {newMission} from '../src/game/model';
test('crafting sounds work inside menus and only follow successful purchases',()=>{
 const before={...newMission(),started:true,panel:'workbench'};
 assert.deepEqual(action_sound_ids(before,{...before,upgrades:['scanner']}),['craft']);
 assert.deepEqual(action_sound_ids(before,{...before,message:'Not enough research points.'}),['action_error']);
 assert.deepEqual(action_sound_ids(before,before),[]);
});
test('handheld scanning, shelter and sleeping transitions use dedicated cues',()=>{
 const before={...newMission(),started:true};
 assert.deepEqual(action_sound_ids(before,{...before,message:'Scanner: common basalt',player:{...before.player,action:.6}}),['scanner_pulse']);
 assert.deepEqual(action_sound_ids(before,{...before,shelter:'command',sleeping:true}),['building_transition','sleep_cycle']);
 assert.deepEqual(action_sound_ids(before,{...before,paused:true,sleeping:true}),[]);
});
test('research completion distinguishes analysis from unrelated point rewards',()=>{
 const before={...newMission(),started:true,scanning:{id:'sample-0',remaining:.1}};
 assert.deepEqual(action_sound_ids(before,{...before,scanning:null,points:3}),['research_complete']);
 assert.deepEqual(action_sound_ids({...before,scanning:null},{...before,scanning:null,points:20}),[]);
});
