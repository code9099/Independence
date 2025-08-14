const state={thread:null,highlight:new Set()};
const $=(s,r=document)=>r.querySelector(s);
const el=(t,c,h)=>{const e=document.createElement(t);if(c)e.className=c;if(h)e.innerHTML=h;return e;};
const md=s=>s?.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\*\*(.*?)\*\*/g,'<b>$1</b>').replace(/\*(.*?)\*/g,'<i>$1</i>').replace(/`(.*?)`/g,'<code>$1</code>')||'';
const ago=d=>{const t=(Date.now()-new Date(d).getTime())/1e3;return t<60?`${t|0}s`:t<3600?`${(t/60)|0}m`:t<86400?`${(t/3600)|0}h`:`${(t/86400)|0}d`};

async function init(){
  try{ const r=await fetch('/api/threads'); const list=await r.json(); state.thread=list[0]||demo(); }
  catch{ state.thread=demo(); }
  render();
  bindQuickReply();
}

function demo(){
  return { _id:'demo', title:'Overflowing garbage in Sector 20', description:'Two days without pickup. *Smell* and animals around.', status:'Pending', location:'Sector 20, Rohini', media:['https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1080&auto=format&fit=crop'], comments:[ {user:'MCD Official',isOfficial:true,isPinned:true,text:'Team assigned. ETA today 6 PM.',created:new Date(),likes:2,replies:[]}, {user:'Resident B',text:'Thanks! attaching photo',media:['https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1080&auto=format&fit=crop'],created:new Date(),likes:1,replies:[{user:'Resident C',text:'Please cover bins.',created:new Date(),likes:0,children:[]}]} ] };
}

function render(){
  const app=$('#thread-app'); app.innerHTML='';
  const t=state.thread; const card=el('div','tc-card');
  const col=el('div','tc-col');
  col.append(el('h2','tc-title-lg',t.title));
  col.append(el('div','tc-desc',md(t.description)));
  const badges=el('div','tc-badges');
  badges.append(el('span','tc-badge',t.location||''));
  const st=el('span','tc-badge',t.status||'Pending'); st.style.borderColor=t.status==='Resolved'?'#134e4a':t.status==='In Progress'?'#3730a3':'#854d0e'; badges.append(st);
  col.append(badges);
  if(t.media?.length){ const mw=el('div','tc-media'); t.media.forEach(u=>{ const i=el('img'); i.src=u; i.onclick=()=>openGallery([u]); mw.append(i); }); col.append(mw); }
  const eg=el('div','tc-engage'); eg.append(btn('Like')); eg.append(btn('Comment')); eg.append(btn('Share',()=>navigator.share?.({title:t.title,text:t.description}))); eg.append(btn('Follow Issue',null,'primary')); col.append(eg);
  card.append(col); app.append(card);
  const tree=el('div','tc-tree'); tree.append(renderList(t.comments||[],[])); app.append(tree);
}

function renderList(arr,path){ const frag=document.createDocumentFragment(); arr.forEach((n,i)=>frag.append(renderNode(n,[...path,i],path.length===0))); return frag; }
function renderNode(n,path,isRoot){ const w=el('div','tc-node'+(isRoot?' tc-node-root':'')); const r=el('div','tc-reply'+(state.highlight.has(JSON.stringify(path))?' tc-new':'')); const head=el('div','tc-reply-head'); const u=el('span','tc-reply-user',n.user||'Anonymous'); const tm=el('span','tc-reply-time','· '+ago(n.created||new Date())); const bs=el('span','tc-reply-badges'); if(n.isPinned) bs.append(el('span','badge pin','Pinned')); if(n.isOfficial) bs.append(el('span','badge official','Official')); head.append(u,tm,bs); const tx=el('div','tc-reply-text',md(n.text||'')); const media=el('div','tc-media'); (n.media||[]).forEach(m=>{ const i=el('img'); i.src=m; i.onclick=()=>openGallery(n.media); media.append(i); }); const act=el('div','tc-reply-actions'); act.append(btn('Like')); act.append(btn('Report',()=>alert('Reported'))); act.append(btn('Share',()=>navigator.share?.({text:n.text}))); const tg=el('span','tc-toggle','Reply'); tg.onclick=()=>openInlineReply(path); act.append(tg); r.append(head,tx,media,act); w.append(r); const ch=n.replies||n.children||[]; if(ch.length){ const list=el('div'); list.append(renderList(ch,path)); w.append(list);} return w; }

function btn(t,f,variant){ const b=el('button','tc-btn'+(variant?' '+variant:''),t); if(f) b.onclick=f; return b; }
function openGallery(urls){ const d=$('#gallery'); const gc=$('#gallery-content'); gc.innerHTML=''; (urls||[]).forEach(u=>{ const i=el('img'); i.src=u; gc.append(i); }); d.showModal(); }

function openInlineReply(path){ sessionStorage.setItem('replyPath',JSON.stringify(path)); $('#qr-text').focus(); }
function bindQuickReply(){ $('#qr-send').onclick=sendReply; $('#qr-text').addEventListener('keydown',e=>{ if(e.key==='Enter'&&!e.shiftKey){ e.preventDefault(); sendReply(); }}); }

async function sendReply(){ const txt=$('#qr-text').value.trim(); if(!txt) return; const media=$('#qr-media').value?[$('#qr-media').value]:[]; const path=JSON.parse(sessionStorage.getItem('replyPath')||'[]'); const target=locate(state.thread.comments,path); target.push({user:'You',text:txt,media,created:new Date(),likes:0,children:[]}); const key=JSON.stringify([...path,target.length-1]); state.highlight.add(key); render(); window.scrollTo({top:document.body.scrollHeight,behavior:'smooth'}); $('#qr-text').value=''; $('#qr-media').value=''; try{ await fetch(`/api/threads/${state.thread._id||'demo'}/replies`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({path,text:txt,media})}); }catch{} }

function locate(arr,path){ let t=arr; for(const i of path){ t=t[i].replies||t[i].children; } return t; }

document.addEventListener('DOMContentLoaded',init);


