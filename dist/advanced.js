'use strict';
const geometry=MouseGeometry;
const blockColors=['#9fb8e8','#e7b079','#93c8bb','#c0ace0','#e7a1ad'];
const shapeNames={circle:'hring',square:'ferning',triangle:'þríhyrning',diamond:'tígul'};
function shapeArt(kind,color='#c49ddd',outline=false){
  const attrs=`fill="${outline?'#ede2f4':color}" stroke="${outline?'#9c85ac':'#76568c'}" stroke-width="4" ${outline?'stroke-dasharray="7 6"':''}`;
  const forms={circle:`<circle cx="60" cy="60" r="45" ${attrs}/>`,square:`<rect x="16" y="16" width="88" height="88" rx="10" ${attrs}/>`,triangle:`<path d="M60 12L111 105H9z" stroke-linejoin="round" ${attrs}/>`,diamond:`<path d="M60 9l48 51-48 51L12 60z" stroke-linejoin="round" ${attrs}/>`};
  return `<svg viewBox="0 0 120 120" aria-hidden="true">${forms[kind]}</svg>`;
}
function towerArt(){return '<svg viewBox="0 0 250 180" aria-hidden="true"><path d="M38 165h176" stroke="#8094ba" stroke-width="5" stroke-linecap="round"/><g stroke="#5c6c97" stroke-width="3"><rect x="80" y="125" width="105" height="38" rx="7" fill="#9fb8e8"/><rect x="87" y="85" width="91" height="38" rx="7" fill="#e7b079"/><rect x="95" y="45" width="75" height="38" rx="7" fill="#93c8bb"/><rect x="42" y="74" width="35" height="35" rx="6" fill="#c0ace0" transform="rotate(-14 60 92)"/></g><path d="M133 45V13l30 8-30 9" stroke="#5c6c97" stroke-width="3" fill="#e7a1ad"/></svg>';}
function pathArt(){return '<svg viewBox="0 0 250 180" aria-hidden="true"><path d="M35 140h60V60h67v65h49" fill="none" stroke="#bfd8df" stroke-width="26" stroke-linecap="round" stroke-linejoin="round"/><path d="M35 140h60V60h67v65h49" fill="none" stroke="#648f9c" stroke-width="3" stroke-dasharray="5 7"/><circle cx="35" cy="140" r="17" fill="#8ccab4" stroke="#456d63" stroke-width="3"/><path d="M194 115l19-20 20 20v29h-39z" fill="#f4d590" stroke="#8d7951" stroke-width="3"/><rect x="209" y="124" width="10" height="20" fill="#8d7951"/></svg>';}
function flyArt(){return '<svg viewBox="0 0 130 130" aria-hidden="true"><circle cx="65" cy="70" r="53" fill="#e7e6a2" opacity=".15"/><circle cx="65" cy="73" r="35" fill="#ece89e" opacity=".35"/><ellipse cx="42" cy="47" rx="20" ry="13" transform="rotate(25 42 47)" fill="#e4f1ea" stroke="#5c8075" stroke-width="2"/><ellipse cx="88" cy="47" rx="20" ry="13" transform="rotate(-25 88 47)" fill="#e4f1ea" stroke="#5c8075" stroke-width="2"/><ellipse cx="65" cy="78" rx="23" ry="29" fill="#e4d76e" stroke="#7d8053" stroke-width="3"/><circle cx="65" cy="49" r="17" fill="#82996f" stroke="#536e59" stroke-width="3"/><path d="M56 33l-4-10m21 10l5-10" stroke="#536e59" stroke-width="3" stroke-linecap="round"/><path d="M59 46v4m12-4v4" stroke="#263f43" stroke-width="3" stroke-linecap="round"/><path d="M57 78h16" stroke="#fff7ad" stroke-width="8" stroke-linecap="round"/></svg>';}
$('tower-art').innerHTML=towerArt();
$('shapes-art').innerHTML=`<svg viewBox="0 0 250 180" aria-hidden="true"><g transform="translate(15 32)">${shapeArt('triangle','#e9b68a').replace('<svg ','<svg width="105" height="105" ')}</g><g transform="translate(120 53)">${shapeArt('circle','#b7a0d7').replace('<svg ','<svg width="100" height="100" ')}</g><path d="M190 23v16m-8-8h16" stroke="#9c83b0" stroke-width="3" stroke-linecap="round"/></svg>`;
$('path-art').innerHTML=pathArt();$('firefly-art').innerHTML=flyArt();
Object.assign(games,{
  tower:{name:'Turninn',skill:'STAFLA OG MIÐA',instruction:'Settu kubbinn á strikaða reitinn.',hint:'Dragðu kubbinn. Miðaðu vel og slepptu.',demo:'Haltu inni á kubbnum. Dragðu hann á strikaða reitinn og slepptu þegar reiturinn verður grænn. Næsti kubbur fer ofan á.'},
  shapes:{name:'Formasmiðjan',skill:'VELJA OG STAÐSETJA',instruction:'Dragðu rétta formið í rammann.',hint:'Skoðaðu útlínurnar. Hvaða form passar?',demo:'Veldu form sem er eins og útlínurnar. Haltu inni, dragðu það í rammann og slepptu þegar ramminn verður grænn.'},
  path:{name:'Slóðin',skill:'HALDA INNI OG STÝRA',instruction:'Haltu inni og fylgdu veginum.',hint:'Byrjaðu á græna punktinum. Haltu inni alla leið að húsinu.',demo:'Ýttu á græna punktinn og haltu takkanum inni. Fylgdu veginum að húsinu. Ef þú ferð út af eða sleppir, byrjarðu þessa slóð aftur.'},
  fireflies:{name:'Eldflugurnar',skill:'SMELLA Á HREYFINGU',instruction:'Smelltu á eldfluguna.',hint:'Fylgdu ljósinu með músinni. Smelltu þegar þú nærð því.',demo:'Eldflugan flýgur hægt um skjáinn. Fylgdu henni með músinni og smelltu einu sinni. Hún bíður alltaf eftir þér.'}
});

// Each board owns its listeners, pointer capture and animation. Leaving a game,
// opening help or resizing cannot leave a hidden drag or animation running.
function boardController(winText,demoMarkup){
  let abort=new AbortController(),frame=0,cancellers=[];
  function pause(){for(const cancel of cancellers)cancel();}
  function dispose(){pause();abort.abort();cancelAnimationFrame(frame);cancellers=[];}
  function fresh(){dispose();abort=new AbortController();field.replaceChildren();}
  function on(el,type,fn){el.addEventListener(type,fn,{signal:abort.signal});}
  function animate(fn){frame=requestAnimationFrame(fn);}
  function status(text,bad=false){const el=$('advanced-status');if(el){el.textContent=text;el.classList.toggle('bad',bad);}announce(text);}
  function dragPiece(el,zone,{accept=()=>true,done,tolerance=20}){
    let dragging=null,selected=false;
    const origin={left:el.style.left,top:el.style.top};
    function restore(){
      const old=dragging,wasActive=!!dragging||selected;dragging=null;selected=false;
      if(old&&el.hasPointerCapture(old.id))el.releasePointerCapture(old.id);
      el.classList.remove('dragging','selected');zone.classList.remove('ready');
      if(wasActive){el.style.left=origin.left;el.style.top=origin.top;}
    }
    function centered(){const a=el.getBoundingClientRect(),b=zone.getBoundingClientRect();return geometry.fits({x:a.x+a.width/2,y:a.y+a.height/2},{x:b.x+b.width/2,y:b.y+b.height/2},tolerance);}
    function available(){return !locked&&!document.querySelector('dialog[open]');}
    on(el,'pointerdown',e=>{
      if(e.button!==0||!available())return;e.preventDefault();audioReady();
      const r=el.getBoundingClientRect();dragging={id:e.pointerId,dx:e.clientX-r.x-r.width/2,dy:e.clientY-r.y-r.height/2};
      el.setPointerCapture(e.pointerId);el.classList.add('dragging');
    });
    on(el,'pointermove',e=>{
      if(!dragging||dragging.id!==e.pointerId||!available())return;
      const r=field.getBoundingClientRect();el.style.left=`${Math.max(10,Math.min(r.width-10,e.clientX-r.x-dragging.dx))}px`;el.style.top=`${Math.max(10,Math.min(r.height-10,e.clientY-r.y-dragging.dy))}px`;
      zone.classList.toggle('ready',accept()&&centered());
    });
    on(el,'pointerup',e=>{
      if(!dragging||dragging.id!==e.pointerId)return;
      const correct=available()&&accept()&&centered();restore();
      if(correct)done();else status(accept()?'Miðaðu á miðjan reitinn og prófaðu aftur.':'Þetta form passar ekki. Prófaðu annað.',true);
    });
    on(el,'pointercancel',restore);on(el,'lostpointercapture',()=>{if(dragging)restore();});
    on(el,'click',e=>{if(e.detail!==0||!available())return;selected=true;el.classList.add('selected');status('Form valið. Veldu reitinn með Tab og Enter.');zone.focus();});
    on(zone,'click',()=>{if(!selected||!available())return;if(accept()){restore();done();}else{restore();status('Þetta form passar ekki. Prófaðu annað.',true);}});
    cancellers.push(restore);
  }
  return {fresh,on,animate,pause,dispose,status,dragPiece,addCancel:fn=>cancellers.push(fn),winText,demo:()=>demoMarkup};
}
function addStatus(text){const el=document.createElement('div');el.className='advanced-status';el.id='advanced-status';el.textContent=text;field.append(el);}
function finishAdvanced(){if(locked||document.querySelector('dialog[open]'))return;locked=true;complete();}
function positioned(tag,cls,x,y,w,h){const el=document.createElement(tag);el.className=cls;el.style.cssText=`left:${x}px;top:${y}px;width:${w}px;height:${h}px`;if(tag==='button')el.type='button';return el;}
function customDemo(art,kind=''){return `<div class="custom-demo ${kind}">${art}<span class="demo-cursor">☝</span></div>`;}

advancedGames.tower=()=>{
  const towerDemo='<svg viewBox="0 0 300 170" aria-hidden="true"><path d="M165 149h110" stroke="#8094ba" stroke-width="4"/><rect x="180" y="112" width="80" height="36" rx="6" fill="#93c8bb" stroke="#5c6c97" stroke-width="3"/><rect x="180" y="74" width="80" height="36" rx="6" fill="none" stroke="#7b8fbd" stroke-width="3" stroke-dasharray="6 5"/><g class="demo-tower-piece"><rect width="80" height="36" rx="6" fill="#e7b079" stroke="#5c6c97" stroke-width="3"/><text x="40" y="27" text-anchor="middle" font-size="26">☝</text></g></svg>';
  const board=boardController(n=>`Þú byggðir turn úr ${n} kubbum!`,`<div class="custom-demo">${towerDemo}</div>`);
  board.render=()=>{
    board.fresh();const w=field.clientWidth,h=field.clientHeight;
    const bh=Math.min([0,47,41,34][settings.difficulty],(h-85)/settings.rounds);
    const bw=Math.min(w*.28,[0,135,105,78][settings.difficulty]),x=w*.69,base=h-40;
    field.innerHTML='<div class="tray-outline"></div><div class="tower-ground"></div>';
    for(let i=0;i<score;i++){const placed=positioned('div','tower-block placed',x,base-bh*(i+.5),bw,bh-2);placed.style.background=blockColors[i%5];placed.textContent=i+1;placed.setAttribute('aria-hidden','true');field.append(placed);}
    const target=positioned('button','tower-slot',x,base-bh*(score+.5),bw,bh-2);target.setAttribute('aria-label',`Reitur fyrir kubb ${score+1}`);target.textContent=score+1;field.append(target);
    const piece=positioned('button','tower-block',w*.205,h*.54,bw,bh-2);piece.style.background=blockColors[score%5];piece.textContent=score+1;piece.setAttribute('aria-label',`Kubbur ${score+1}. Dragðu á strikaða reitinn.`);field.append(piece);
    const caption=positioned('div','board-caption',w*.07,26,w*.27,25);caption.textContent='Næsti kubbur';field.append(caption);
    addStatus(`Kubbur ${score+1} af ${settings.rounds}`);
    board.dragPiece(piece,target,{tolerance:[0,27,17,9][settings.difficulty],done:()=>{piece.style.left=`${x}px`;piece.style.top=target.style.top;piece.classList.add('placed');target.style.visibility='hidden';board.status('Kubburinn er kominn á sinn stað!');if(score+1===settings.rounds){const flag=positioned('div','tower-top-flag',x,base-bh*(score+1),36,35);flag.textContent='⚑';field.append(flag);}finishAdvanced();}});
  };return board;
};

advancedGames.shapes=()=>{
  const shapeDemo=`<svg viewBox="0 0 300 160"><g transform="translate(185 25)">${shapeArt('triangle','#e9b68a',true).replace('<svg ','<svg width="105" height="105" ')}</g><g class="demo-shape-piece">${shapeArt('triangle','#e9b68a').replace('<svg ','<svg width="95" height="95" ')}</g></svg>`;
  const board=boardController(n=>`Þú settir ${n} form á réttan stað.`,`<div class="custom-demo">${shapeDemo}</div>`);
  board.render=()=>{
    board.fresh();const w=field.clientWidth,h=field.clientHeight,count=settings.difficulty+1;
    const kinds=['circle','square','triangle','diamond'].sort(()=>Math.random()-.5).slice(0,count);
    const wanted=kinds[(score+settings.difficulty)%count],size=Math.min([0,112,91,74][settings.difficulty],w*.23);
    const zone=positioned('button','shape-slot',w*.76,h*.5,size+24,size+24);zone.innerHTML=shapeArt(wanted,'',true);zone.setAttribute('aria-label',`Rammi fyrir ${shapeNames[wanted]}`);field.append(zone);
    const caption=positioned('div','board-caption',w*.61,25,w*.31,28);caption.textContent='Hvaða form passar?';field.append(caption);
    kinds.forEach((kind,i)=>{
      const x=count>2?w*(i%2===0?.17:.41):w*.25;
      const y=count>2?h*(i<2?.32:.7):h*(i===0?.3:.7);
      const piece=positioned('button','shape-piece',x,y,size,size);piece.innerHTML=shapeArt(kind,['#b7a0d7','#e6ae83','#9bc5c2','#dca6ba'][i]);piece.setAttribute('aria-label',`Dragðu ${shapeNames[kind]}`);field.append(piece);
      board.dragPiece(piece,zone,{accept:()=>kind===wanted,tolerance:[0,25,16,9][settings.difficulty],done:()=>{piece.style.left=zone.style.left;piece.style.top=zone.style.top;piece.classList.add('shape-placed');zone.classList.add('ready');board.status('Rétt form á réttum stað!');finishAdvanced();}});
    });addStatus('Dragðu formið sem er eins og útlínurnar.');
  };return board;
};

advancedGames.path=()=>{
  const roadDemo=pathArt().replace('</svg>','<circle class="demo-walker" cx="35" cy="140" r="10" fill="#196b60" stroke="white" stroke-width="2"/></svg>');
  const board=boardController(n=>`Þú komst alla leið heim á ${n} slóðum!`,`<div class="custom-demo demo-road">${roadDemo}</div>`);
  board.render=()=>{
    board.fresh();const w=field.clientWidth,h=field.clientHeight;
    const radius=[0,29,21,14][settings.difficulty];
    const ys=score%2===0?[.69,.31,.66]:[.34,.7,.35];
    const raw=settings.difficulty===3?[[.12,ys[0]],[.28,ys[0]],[.28,ys[1]],[.49,ys[1]],[.49,ys[2]],[.69,ys[2]],[.69,ys[1]],[.88,ys[1]]]:[[.12,ys[0]],[.34,ys[0]],[.34,ys[1]],[.65,ys[1]],[.65,ys[2]],[.87,ys[2]]];
    const points=raw.map(([x,y])=>({x:x*w,y:y*h}));const path=points.map(p=>`${p.x},${p.y}`).join(' ');
    field.innerHTML=`<svg class="path-board" viewBox="0 0 ${w} ${h}" aria-hidden="true"><polyline points="${path}" fill="none" stroke="#aecdd4" stroke-width="${radius*2+6}" stroke-linejoin="round" stroke-linecap="round"/><polyline points="${path}" fill="none" stroke="#f5fbfb" stroke-width="${radius*2}" stroke-linejoin="round" stroke-linecap="round"/><polyline points="${path}" fill="none" stroke="#8ab1bc" stroke-width="2" stroke-dasharray="5 9"/><polyline id="traced-line" points="" fill="none" stroke="#399479" stroke-width="9" stroke-linejoin="round" stroke-linecap="round"/></svg>`;
    const startPoint=points[0],endPoint=points.at(-1);
    const start=positioned('button','path-start',startPoint.x,startPoint.y,Math.min(66,radius*2+12),Math.min(66,radius*2+12));start.textContent='●';start.setAttribute('aria-label','Byrjun. Haltu inni og fylgdu veginum.');
    const end=positioned('div','path-end',endPoint.x,endPoint.y,56,56);end.textContent='⌂';end.setAttribute('aria-hidden','true');field.append(start,end);addStatus('Byrjaðu á græna punktinum.');
    let trace=null,trail=[],pointerId=null;
    function reset(message){const old=pointerId;pointerId=null;trace=null;trail=[];if(old!==null&&field.hasPointerCapture(old))field.releasePointerCapture(old);$('traced-line')?.setAttribute('points','');if(message)board.status(message,true);}
    board.addCancel(()=>reset());
    board.on(start,'pointerdown',e=>{if(e.button!==0||locked||document.querySelector('dialog[open]'))return;e.preventDefault();audioReady();const r=field.getBoundingClientRect();const p={x:e.clientX-r.left,y:e.clientY-r.top};if(geometry.distance(p,startPoint)>radius){board.status('Byrjaðu á miðjum græna punktinum.',true);return;}trace={index:0,last:p};trail=[p];pointerId=e.pointerId;field.setPointerCapture(e.pointerId);board.status('Fylgdu veginum. Haltu enn inni.');});
    board.on(field,'pointermove',e=>{
      if(!trace||e.pointerId!==pointerId||locked)return;const r=field.getBoundingClientRect();const p={x:e.clientX-r.left,y:e.clientY-r.top};const next=geometry.trace(points,radius,trace,p);
      if(!next.ok){reset('Þú fórst út af. Prófaðu aftur frá græna punktinum.');return;}
      trace=next;trail.push(p);$('traced-line').setAttribute('points',trail.map(p=>`${p.x},${p.y}`).join(' '));
      if(next.finished){const old=pointerId;pointerId=null;trace=null;if(field.hasPointerCapture(old))field.releasePointerCapture(old);start.disabled=true;board.status('Alla leið heim!');finishAdvanced();}
    });
    board.on(field,'pointerup',e=>{if(e.pointerId===pointerId)reset('Þú slepptir takkanum. Prófaðu aftur frá græna punktinum.');});
    board.on(field,'pointercancel',()=>reset());board.on(field,'lostpointercapture',()=>{if(trace)reset('Prófaðu aftur frá græna punktinum.');});
  };return board;
};

advancedGames.fireflies=()=>{
  const board=boardController(n=>`Þú náðir ${n} eldflugum!`,customDemo(flyArt()));
  board.render=()=>{
    board.fresh();const w=field.clientWidth,h=field.clientHeight,size=[0,106,80,58][settings.difficulty];
    for(let i=0;i<20;i++){const dot=positioned('span','night-dot',((i*47+13)%97)/100*w,((i*31+7)%87)/100*h,3,3);field.append(dot);}
    const target=positioned('button','firefly',w*.5,h*.5,size,size);target.innerHTML=flyArt();target.setAttribute('aria-label','Eldfluga. Smelltu á mig.');field.append(target);
    const hint=document.createElement('div');hint.className='night-hint';const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;hint.textContent=reduce?'Hreyfingar minnkaðar samkvæmt stillingum tækisins.':'Eldflugan hverfur ekki. Þú hefur nægan tíma.';field.append(hint);
    let time=score*1.6,last=null;
    function tick(now){
      if(!target.isConnected)return;
      const paused=locked||document.hidden||!!document.querySelector('dialog[open]')||reduce;
      if(last!==null&&!paused)time+=Math.min((now-last)/1000,.05)*[0,.45,.78,1.13][settings.difficulty];last=now;
      const margin=size*.6+10;const ampX=Math.max(0,w/2-margin),ampY=Math.max(0,h/2-margin-15);
      target.style.left=`${w/2+Math.sin(time)*ampX*.85}px`;target.style.top=`${h/2+Math.sin(time*1.37+.3)*ampY*.78}px`;
      if(!locked)board.animate(tick);
    }
    board.on(target,'click',()=>{if(locked||document.querySelector('dialog[open]'))return;target.classList.add('caught');finishAdvanced();});board.animate(tick);
  };return board;
};
