/* Shared slide engine for the JO "Core Banking Payments Modernization" series.
   An episode page loads this file, defines its draw functions and a DECK config,
   then calls startDeck(DECK). URL: ?s=<slide>&mode=live|ref&export=1 */

const K={
  legacy :{s:'#7B8190',f:'rgba(123,129,144,.13)',g:'rgba(123,129,144,.05)',t:'#2A2F3A'},
  aws    :{s:'#0F7F77',f:'rgba(15,127,119,.11)', g:'rgba(15,127,119,.04)', t:'#0B3F3B'},
  risk   :{s:'#C9661E',f:'rgba(201,102,30,.11)', g:'rgba(201,102,30,.04)', t:'#5A2C0B'},
  bad    :{s:'#C0392B',f:'rgba(192,57,43,.09)',  g:'rgba(192,57,43,.04)',  t:'#5C1A13'},
  good   :{s:'#2E8B57',f:'rgba(46,139,87,.11)',  g:'rgba(46,139,87,.04)',  t:'#154A2D'},
  ai     :{s:'#6D4FD1',f:'rgba(109,79,209,.10)', g:'rgba(109,79,209,.04)', t:'#2E1F66'},
  human  :{s:'#2F6FBF',f:'rgba(47,111,191,.10)', g:'rgba(47,111,191,.04)', t:'#163A66'},
  neutral:{s:'#4F5D75',f:'rgba(79,93,117,.09)',  g:'rgba(79,93,117,.04)',  t:'#222530'},
};
const LENS={value:'📈 VALUE',cost:'💰 COST',risk:'🛡️ RISK'};

const ctx=document.createElement('canvas').getContext('2d');
const tw=(s,font)=>{ctx.font=font;return ctx.measureText(s).width};
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

/* ---------- SVG primitives (1280x800 diagram canvas) ---------- */
function box(o){
  const c=K[o.k||'neutral'];
  const tl=((o.i?o.i+' ':'')+o.t).split('\n'), sl=o.s?o.s.split('\n'):[];
  const tH=20, sH=16.5, gap=sl.length?4:0, total=tl.length*tH+gap+sl.length*sH;
  let y=o.y+(o.h-total)/2+15; const cx=o.x+o.w/2;
  let out=`<g><rect x="${o.x}" y="${o.y}" width="${o.w}" height="${o.h}" rx="12" fill="${c.f}" stroke="${c.s}" stroke-width="2"/>`;
  tl.forEach(l=>{out+=`<text class="bt" x="${cx}" y="${y}" fill="${c.t}">${esc(l)}</text>`;y+=tH});
  y+=gap-2;
  sl.forEach(l=>{out+=`<text class="bs" x="${cx}" y="${y}">${esc(l)}</text>`;y+=sH});
  return out+'</g>';
}
function group(o){
  const c=K[o.k||'neutral'];
  const ly=o.lp==='b'?o.y+o.h-12:o.y+24;
  return `<g><rect x="${o.x}" y="${o.y}" width="${o.w}" height="${o.h}" rx="16" fill="${c.g}" stroke="${c.s}" stroke-opacity=".7" stroke-width="1.6" stroke-dasharray="7 6"/>`+
    (o.label?`<text class="gl" x="${o.x+14}" y="${ly}" fill="${c.s}">${esc(o.label)}</text>`:'')+'</g>';
}
function label(x,y,s,k){
  const c=K[k||'neutral'], w=tw(s,'600 12.5px Segoe UI')+16;
  return `<g><rect x="${x-w/2}" y="${y-11}" width="${w}" height="22" rx="11" fill="#FFFBF4" stroke="${c.s}" stroke-width="1.2"/><text class="lbl" x="${x}" y="${y+4.5}" fill="${c.s}">${esc(s)}</text></g>`;
}
/* connector: hidden in live mode so the presenter can draw it; st = step that reveals it */
function arrow(p,o={}){
  const k=o.k||'neutral', c=K[k];
  const d='M'+p.map(q=>q.join(' ')).join(' L');
  let s=`<g class="conn" data-st="${o.st||0}"><path d="${d}" fill="none" stroke="${c.s}" stroke-width="${o.w||2.6}" stroke-linejoin="round" ${o.dash?'stroke-dasharray="8 6"':''}${o.dot?' stroke-dasharray="1 7" stroke-linecap="round"':''} marker-end="url(#ah-${k})" ${o.both?`marker-start="url(#ah-${k})"`:''}/>`;
  if(o.mid){const a=p[0],b=p[p.length-1];s+=`<text x="${(a[0]+b[0])/2}" y="${(a[1]+b[1])/2+9}" text-anchor="middle" font-size="26" font-weight="800" fill="${c.s}">${o.mid}</text>`}
  s+='</g>';
  if(o.label){const a=p[0],b=p[p.length-1];s+=label(o.lx??(a[0]+b[0])/2,o.ly??(a[1]+b[1])/2,o.label,k)}
  return s;
}
/* step tag: charcoal pill + mustard number; (x,y) = left/right/center of the pill */
function tag(n,x,y,note,anchor='l'){
  const w=36+tw(note,'700 14.5px Segoe UI')+12;
  const x0=anchor==='l'?x:anchor==='r'?x-w:x-w/2;
  return `<g class="tag" data-st="${n}"><rect x="${x0}" y="${y-14}" width="${w}" height="28" rx="14" fill="#222530" filter="url(#tsh)"/>`+
    `<circle cx="${x0+14}" cy="${y}" r="11" fill="#E8B931"/><text class="tn" x="${x0+14}" y="${y+4.8}">${n}</text>`+
    `<text class="tt" x="${x0+30}" y="${y+5}">${esc(note)}</text></g>`;
}
function kpi(o){
  const c=K[o.k||'aws'];
  return `<g><rect x="${o.x}" y="${o.y}" width="${o.w}" height="${o.h}" rx="12" fill="${c.f}" stroke="${c.s}" stroke-width="2"/>`+
    `<text class="kl" x="${o.x+18}" y="${o.y+o.h/2+6}">${o.i} ${esc(o.t)}</text>`+
    `<text class="kv" x="${o.x+o.w-18}" y="${o.y+o.h/2+7}" style="text-anchor:end" fill="${c.s}">${esc(o.v)}</text></g>`;
}
function mini(o){
  const c=K[o.k||'neutral'];
  return `<g><rect x="${o.x}" y="${o.y}" width="${o.w}" height="${o.h}" rx="7" fill="#FFFBF4" stroke="${c.s}" stroke-width="1.4"/><text class="mt" x="${o.x+o.w/2}" y="${o.y+o.h/2+5}">${esc(o.t)}</text></g>`;
}
/* arrow-shaped step: first:true gives a flat left edge */
function chevron(o){
  const c=K[o.k||'neutral'], {x,y,w,h}=o, n=18;
  const pts=[[x,y],[x+w-n,y],[x+w,y+h/2],[x+w-n,y+h],[x,y+h],[x+(o.first?0:n),y+h/2]].map(p=>p.join(',')).join(' ');
  return `<g><polygon points="${pts}" fill="${c.f}" stroke="${c.s}" stroke-width="2" stroke-linejoin="round"/>`+
    `<text class="bt" x="${x+w/2+4}" y="${y+h/2-3}" fill="${c.t}" style="font-size:15px">${esc(o.t)}</text>`+
    `<text class="bs" x="${x+w/2+4}" y="${y+h/2+17}">${esc(o.s)}</text></g>`;
}
const txt=(x,y,s,cls,anchor='start',fill)=>`<text class="${cls}" x="${x}" y="${y}" style="text-anchor:${anchor}" ${fill?`fill="${fill}"`:''}>${esc(s)}</text>`;
const lines=(x,y,arr,cls,dy=30)=>arr.map((s,i)=>txt(x,y+i*dy,s,cls)).join('');
/* dark code panel: lines = [[lineNo, text, 'y'|'o'|undefined]] */
function code(o){
  const lh=o.lh||24, top=o.y+54;
  let s=`<g><rect x="${o.x}" y="${o.y}" width="${o.w}" height="${o.h}" rx="12" fill="#222530"/>`+
    `<circle cx="${o.x+18}" cy="${o.y+20}" r="5" fill="#C0392B"/><circle cx="${o.x+34}" cy="${o.y+20}" r="5" fill="#E8B931"/><circle cx="${o.x+50}" cy="${o.y+20}" r="5" fill="#2E8B57"/>`+
    `<text class="code-h" x="${o.x+70}" y="${o.y+25}">${esc(o.title)}</text>`;
  o.lines.forEach(([ln,t,hl],i)=>{
    const y=top+i*lh;
    if(hl) s+=`<rect x="${o.x+8}" y="${y-16}" width="${o.w-16}" height="${lh-2}" rx="4" fill="${hl==='y'?'rgba(232,185,49,.30)':hl==='r'?'rgba(192,57,43,.55)':'rgba(201,102,30,.36)'}"/>`;
    s+=`<text class="code-ln" x="${o.x+16}" y="${y}">${ln}</text><text class="code-tx" x="${o.x+64}" y="${y}">${esc(t)}</text>`;
  });
  return s+'</g>';
}
/* simple table: cols = [[title, dx]], hl = {rowIndex: colorKey} */
function table(o){
  let s=`<g><rect x="${o.x}" y="${o.y}" width="${o.w}" height="${o.hh}" rx="8" fill="rgba(34,37,48,.07)"/>`;
  o.cols.forEach(([t,dx])=>{s+=`<text class="th" x="${o.x+dx+12}" y="${o.y+o.hh/2+4}">${esc(t)}</text>`});
  o.rows.forEach((r,i)=>{
    const y=o.y+o.hh+6+i*o.rh, hl=o.hl&&o.hl[i];
    s+=`<rect x="${o.x}" y="${y}" width="${o.w}" height="${o.rh-6}" rx="8" fill="${hl?K[hl].f:'#FFFBF4'}" stroke="${hl?K[hl].s:'rgba(34,37,48,.18)'}" stroke-width="1.3"/>`;
    r.forEach((c,j)=>{s+=`<text class="td${j===0?' tdb':''}" x="${o.x+o.cols[j][1]+12}" y="${y+(o.rh-6)/2+5}">${esc(c)}</text>`});
  });
  return s+'</g>';
}
function defs(){
  return '<defs>'+Object.entries(K).map(([k,c])=>
    `<marker id="ah-${k}" viewBox="0 0 10 10" refX="9" refY="5" markerUnits="userSpaceOnUse" markerWidth="13" markerHeight="13" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="${c.s}"/></marker>`).join('')+
    '<filter id="tsh" x="-20%" y="-50%" width="140%" height="200%"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#3a2a10" flood-opacity=".28"/></filter></defs>';
}

/* ---------- page engine ---------- */
function startDeck(D){
  const SLIDES=[null,...D.slides], LAST=SLIDES.length-1;
  const q=new URLSearchParams(location.search), EXPORT=q.has('export');
  let cur=Math.max(0,Math.min(LAST,parseInt(q.get('s')??'1',10)||0));
  let mode=q.get('mode')||'live', step=0, autoReveal=false, bgUrl=null;
  if(EXPORT) document.body.classList.add('export');
  document.body.insertAdjacentHTML('afterbegin','<div id="viewport"><div class="stage" id="stage"></div></div>'+
    '<div id="toast">← → slide · Space/↓ next step · ↑ prev step · C connectors · A auto-reveal · F fullscreen</div>');
  const stage=document.getElementById('stage');

  function chrome(S){
    const chips=D.stages.map((x,i)=>{
      const n=i+1, cls=!S?'':n<D.stage?'done':n===D.stage?'now':'';
      const sub=S&&n===D.stage?` <span class="sub">› ${D.epShort}</span>`:'';
      return `<div class="chip ${cls}"><span class="e">${x[0]}</span>${n} · ${x[1]}${sub}</div>`;
    }).join('');
    return `<div class="bgimg"></div><div class="grid"></div><div class="frame"></div>
      <div class="corner c-tl"></div><div class="corner c-tr"></div><div class="corner c-bl"></div><div class="corner c-br"></div>
      <header class="hdr"><div class="brand"><div class="logo"><img src="${D.logo}" alt="JO"></div>
        <div><div class="kicker">${D.brand}</div>
        <div class="ep">${S?`${D.ep} · ${D.title}${D.title.length<=24&&(D.stage||1)<=3&&D.subtitle?` <span>— ${D.subtitle}</span>`:''}`:D.seriesTitle}</div></div></div>
        <nav class="progress">${chips}</nav></header>`;
  }
  function render(){
    document.body.classList.toggle('live',mode==='live');
    if(cur===0){
      stage.innerHTML=chrome(null)+'<aside class="panel gloss"></aside><section class="panel dia-panel"></section><aside class="panel right"></aside><footer class="ftr"></footer>';
      return applyBg();
    }
    const S=SLIDES[cur];
    const bottomBar=S.callout
      ? `<div class="demo"><span class="tagd">${D.callout.title}</span><div class="lines">
          <div><b>${D.callout.first}</b> ${S.callout[0]}</div><div class="tf"><b>${D.callout.second}</b> ${S.callout[1]}</div></div></div>`
      : `<div class="demo"><span class="tagd">🔬 VALIDATION PLAN</span><div class="lines">
          <div>🖥️ <b>Engineering check:</b> ${S.demo[0]}</div><div class="tf">🛠️ <b>Platform check:</b> ${S.demo[1]}</div></div></div>`;
    const legend=D.legend||[
      '<span><i style="border-color:#7B8190;background:rgba(123,129,144,.18)"></i>Legacy</span>',
      '<span><i style="border-color:#0F7F77;background:rgba(15,127,119,.15)"></i>AWS / new</span>',
      '<span><i style="border-color:#6D4FD1;background:rgba(109,79,209,.15)"></i>AI</span>',
      '<span><i style="border-color:#2F6FBF;background:rgba(47,111,191,.15)"></i>People</span>',
      '<span class="tg"><b>1</b>Step</span>',
    ].join('');
    stage.innerHTML=chrome(S)+`
      <aside class="panel gloss">
        <div class="g-head"><div class="k">${D.glossTitle||'📖 CXO CHEAT SHEET'}</div><div class="s">${D.glossSub||'The jargon on this slide, in business terms'}</div></div>
        <div class="g-list">${S.gloss.map(([k,sts])=>{const [t,l,d]=D.glossary[k];
          return `<div class="g-card ${l}" data-st="${sts.join(' ')}"><div class="g-top"><span class="g-term">${t}</span><span class="g-lens ${l}">${LENS[l]}</span></div><p>${d}</p></div>`}).join('')}</div>
      </aside>
      <section class="panel dia-panel">
        <div class="lp-head">
          <div class="lp-title"><span class="big">${S.icon}</span><div><div class="k">${S.kicker}</div><div class="t">${S.title}</div></div></div>
          <div class="legend">${legend}</div>
        </div>
        <svg class="dia" viewBox="0 0 1280 800" preserveAspectRatio="xMidYMid meet">${defs()}${S.draw()}</svg>
        ${bottomBar}
      </section>
      <aside class="panel right">
        <div class="rp-head"><span>📝 SCRIPT STEPS</span><span class="time">⏱ ${S.time||'--:--'}</span></div>
        <div class="say open"><b>🎤 OPEN WITH</b><p>“${S.open}”</p></div>
        <ol class="steps">${S.steps.map((x,i)=>`<li data-st="${i+1}"><span class="n">${i+1}</span><div><b>${x[0]}</b><p>${x[1]}</p></div></li>`).join('')}</ol>
        <div class="say land"><b>🎯 LAND</b><p>“${S.land}”</p></div>
      </aside>
      <footer class="ftr"><div class="key"><b>💡 KEY MESSAGE</b>${S.key}</div><div class="next">${S.next}<span class="ep">${D.epShort}</span></div></footer>`;
    applyStep(); applyBg();
  }
  function applyStep(){
    stage.classList.toggle('stepping',step>0);
    stage.querySelectorAll('.steps li').forEach(li=>li.classList.toggle('on',+li.dataset.st===step));
    stage.querySelectorAll('.tag').forEach(t=>t.classList.toggle('on',+t.dataset.st===step));
    stage.querySelectorAll('.g-card').forEach(g=>g.classList.toggle('on',step>0&&g.dataset.st.split(' ').map(Number).includes(step)));
    stage.querySelectorAll('.conn').forEach(c=>c.classList.toggle('show',autoReveal&&+c.dataset.st<=step));
  }
  function applyBg(){
    if(bgUrl) stage.querySelectorAll('.bgimg').forEach(b=>b.style.backgroundImage=`url("${bgUrl}")`);
    stage.classList.toggle('has-bg',!!bgUrl);
  }
  const probe=new Image(); probe.onload=()=>{bgUrl=probe.src;applyBg()}; probe.src=D.background;
  function fit(){ if(!EXPORT) stage.style.transform=`scale(${Math.min(innerWidth/1920,innerHeight/1080)})`; }
  addEventListener('resize',fit);
  addEventListener('keydown',ev=>{
    if(EXPORT) return;
    const maxStep=cur?SLIDES[cur].steps.length:0;
    switch(ev.key){
      case 'ArrowRight': case 'PageDown': if(cur<LAST){cur++;step=0;render()} break;
      case 'ArrowLeft':  case 'PageUp':   if(cur>1){cur--;step=0;render()} break;
      case ' ': case 'ArrowDown': ev.preventDefault(); if(step<maxStep){step++;applyStep()} break;
      case 'ArrowUp': if(step>0){step--;applyStep()} break;
      case 'c': case 'C': mode=mode==='live'?'ref':'live'; document.body.classList.toggle('live',mode==='live'); break;
      case 'a': case 'A': autoReveal=!autoReveal; applyStep(); break;
      case 'f': case 'F': document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen(); break;
      case 't': case 'T': cur=cur===0?1:0; step=0; render(); break;
      default: return;
    }
    history.replaceState(null,'',`?s=${cur}&mode=${mode}`);
  });
  render(); fit();
  setTimeout(()=>{const t=document.getElementById('toast');if(t)t.style.opacity=0},4000);
}

