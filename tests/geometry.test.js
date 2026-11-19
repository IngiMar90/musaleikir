const {test}=require('node:test');
const assert=require('node:assert/strict');
const {fits,segmentDistance,trace}=require('../dist/geometry.js');
const road=[{x:0,y:0},{x:100,y:0},{x:100,y:100},{x:200,y:100}];
test('placement requires both axes inside the chosen tolerance',()=>{
  assert.equal(fits({x:109,y:91},{x:100,y:100},9),true);
  assert.equal(fits({x:110,y:100},{x:100,y:100},9),false);
  assert.equal(fits({x:100,y:110},{x:100,y:100},9),false);
});
test('distance clamps to segment ends and handles zero-length segments',()=>{
  assert.equal(segmentDistance({x:110,y:0},road[0],road[1]),10);
  assert.equal(segmentDistance({x:3,y:4},road[0],road[0]),5);
});
test('following each corner completes the path',()=>{
  let state={index:0,last:road[0]};
  for(const p of road.slice(1)){state=trace(road,14,state,p);assert.equal(state.ok,true);}
  assert.equal(state.finished,true);
});
test('large pointer jumps cannot cut across an empty corner',()=>{
  const state=trace(road,14,{index:0,last:road[0]},{x:100,y:100});
  assert.equal(state.ok,false);assert.equal(state.finished,false);
});
test('visiting the finish without earlier checkpoints cannot complete a path',()=>{
  assert.equal(trace(road,14,{index:0,last:road[0]},road[3]).finished,false);
});
test('leaving the road fails only the current attempt',()=>{
  assert.equal(trace(road,14,{index:0,last:road[0]},{x:50,y:25}).ok,false);
  assert.equal(trace(road,29,{index:0,last:road[0]},{x:50,y:25}).ok,true);
});
