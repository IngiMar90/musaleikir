(function(root){
  'use strict';
  const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
  function segmentDistance(p,a,b){
    const dx=b.x-a.x,dy=b.y-a.y,length=dx*dx+dy*dy;
    const t=length?Math.max(0,Math.min(1,((p.x-a.x)*dx+(p.y-a.y)*dy)/length)):0;
    return Math.hypot(p.x-a.x-t*dx,p.y-a.y-t*dy);
  }
  function fits(center,target,tolerance){return Math.abs(center.x-target.x)<=tolerance&&Math.abs(center.y-target.y)<=tolerance;}
  // Validate the entire pointer move, including coalesced events, so corners
  // cannot be skipped by moving quickly across the empty part of the board.
  function trace(points,radius,state,to){
    let index=state.index;
    const steps=Math.max(1,Math.ceil(distance(state.last,to)/Math.min(4,radius/3)));
    for(let n=1;n<=steps;n++){
      const p={x:state.last.x+(to.x-state.last.x)*n/steps,y:state.last.y+(to.y-state.last.y)*n/steps};
      const next=Math.min(index+1,points.length-1);
      const d=segmentDistance(p,points[index],points[next]);
      const previous=index>0?segmentDistance(p,points[index-1],points[index]):Infinity;
      if(Math.min(d,previous)>radius)return {ok:false,index,last:p,finished:false};
      if(distance(p,points[next])<=Math.max(7,radius*.7)&&index<points.length-1)index++;
    }
    return {ok:true,index,last:to,finished:index===points.length-1};
  }
  const api={distance,segmentDistance,fits,trace};
  root.MouseGeometry=api;
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:this);
