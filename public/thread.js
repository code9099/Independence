// Minimal nested thread client for JanConnect
// Pure JS, no framework. Uses in-memory store and fetches from /api/threads in dev.

const state = {
  thread: null,
  expanded: new Set(),
  highlightIds: new Set(),
};

function $(sel, root = document) { return root.querySelector(sel); }
function el(tag, cls, html) { const e = document.createElement(tag); if (cls) e.className = cls; if (html) e.innerHTML = html; return e; }
function timeAgo(d) { const t = (Date.now() - new Date(d).getTime())/1000; if (t<60) return `${Math.floor(t)}s`; if (t<3600) return `${Math.floor(t/60)}m`; if (t<86400) return `${Math.floor(t/3600)}h`; return `${Math.floor(t/86400)}d`;}
function md(s=''){ // extremely small markdown: **bold**, *italic*, `code`
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
          .replace(/\*\*(.*?)\*\*/g,'<b>$1</b>').replace(/\*(.*?)\*/g,'<i>$1</i>')
          .replace(/`(.*?)`/g,'<code>$1</code>');
}

async function loadThread() {
  // Try API, else use mock
  try {
    const res = await fetch('/api/threads');
    const list = await res.json();
    state.thread = list[0] || mockThread();
  } catch { state.thread = mockThread(); }
  render();
  autoScroll();
}

function mockThread(){
  return {
    _id:'demo1', user:'Citizen A', title:'Overflowing garbage in Sector 20', description:'This has been unattended for two days. **Smells** and animals around.',
    image:'', status:'Pending', location:'Sector 20, Rohini', media:['https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1080&auto=format&fit=crop'],
    comments:[
      { user:'MCD Official', isOfficial:true, isPinned:true, text:'We have assigned this to the sanitation team. ETA today 6 PM.', created:new Date(), likes:2, replies:[]},
      { user:'Resident B', text:'Thanks! attaching photo', media:['https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1080&auto=format&fit=crop'], created:new Date(), likes:1, replies:[
        { user:'Resident C', text:'Please cover the bins too.', created:new Date(), likes:0, children:[] }
      ]}
    ]
  };
}

function render(){
  const app = $('#app');
  app.innerHTML='';
  const t = state.thread;
  const card = el('div','tc-card');

  // Header
  const head = el('div','tc-row');
  const col = el('div','tc-col');
  col.append(el('h2','tc-title-lg',t.title));
  col.append(el('div','tc-desc',md(t.description)));

  const badges = el('div','tc-badges');
  const bStatus = el('span','tc-badge '+(t.status==='Resolved'?'success':t.status==='In Progress'?'info':'warn'),t.status||'Pending');
  badges.append(bStatus);
  badges.append(el('span','tc-badge',t.location||''));
  col.append(badges);

  // Media
  if (t.media && t.media.length){
    const mwrap = el('div','tc-media');
    t.media.forEach(u=>{
      const img = el('img'); img.src=u; img.alt='media'; img.onclick=()=>openGallery([u]);
      mwrap.append(img);
    });
    col.append(mwrap);
  }

  // Engagement
  const engage = el('div','tc-engage');
  engage.append(btn('Like',()=>{}));
  engage.append(btn('Comment',()=>{}));
  engage.append(btn('Share',()=>navigator.share?.({title:t.title,text:t.description}) : null));
  engage.append(btn('Follow Issue',()=>{},'primary'));
  col.append(engage);

  head.append(col); card.append(head); app.append(card);

  // Replies tree
  const tree = el('div','tc-tree');
  tree.append(renderNodeList(t.comments || [], [], true));
  app.append(tree);
}

function btn(label,fn,variant){ const b=el('button','tc-btn'+(variant?' '+variant:''),label); b.onclick=fn; return b; }

function renderNodeList(arr,path,isRoot){
  const frag = document.createDocumentFragment();
  arr.forEach((node,idx)=>{
    const p=[...path,idx];
    frag.append(renderNode(node,p,isRoot));
  });
  return frag;
}

function renderNode(n,path,isRoot){
  const wrap = el('div','tc-node'+(isRoot?' tc-node-root':''));
  const card = el('div','tc-reply'+(state.highlightIds.has(JSON.stringify(path))?' tc-new':''));
  const head = el('div','tc-reply-head');
  const user = el('span','tc-reply-user', n.user || 'Anonymous');
  const time = el('span','tc-reply-time','· '+timeAgo(n.created||new Date()));
  const badges = el('span','tc-reply-badges');
  if (n.isPinned) badges.append(el('span','badge pin','Pinned'));
  if (n.isOfficial) badges.append(el('span','badge official','Official'));
  head.append(user,time,badges);

  const text = el('div','tc-reply-text', md(n.text||''));
  const media = el('div','tc-media');
  (n.media||[]).forEach(u=>{ const img=el('img'); img.src=u; img.onclick=()=>openGallery(n.media); media.append(img); });
  const actions = el('div','tc-reply-actions');
  actions.append(btn('Like',()=>like(path,1)));
  actions.append(btn('Report',()=>alert('Reported')));
  actions.append(btn('Share',()=>navigator.share?.({text:n.text}) : null));
  const toggle = el('span','tc-toggle','Reply'); toggle.onclick=()=>quickReply(path);
  actions.append(toggle);

  card.append(head,text,media,actions);
  wrap.append(card);

  const children = n.replies || n.children || [];
  if (children.length){
    const list = el('div');
    list.append(renderNodeList(children,path,false));
    wrap.append(list);
  }
  return wrap;
}

function quickReply(path){
  sessionStorage.setItem('replyPath', JSON.stringify(path));
  $('#qr-text').focus();
}

async function sendReply(){
  const txt = $('#qr-text').value.trim();
  if (!txt) return;
  const media = $('#qr-media').value ? [$('#qr-media').value] : [];
  const path = JSON.parse(sessionStorage.getItem('replyPath')||'[]');

  // Update UI immediately
  const target = locate(state.thread.comments, path);
  (target).push({ user: 'You', text: txt, media, created: new Date(), likes:0, children: [] });
  const key = JSON.stringify([...path, (target.length-1)]);
  state.highlightIds.add(key);
  render(); autoScroll();
  $('#qr-text').value=''; $('#qr-media').value='';

  // Try API (non-blocking)
  try{
    await fetch(`/api/threads/${state.thread._id||'demo1'}/replies`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({ path, text:txt, media })});
  }catch{}
}

function locate(arr, path){
  let target = arr;
  for(const i of path){ target = (target[i].replies || target[i].children); }
  return target;
}

function like(path,delta){ /* optimistic update only */ }
function autoScroll(){ window.scrollTo({ top: document.body.scrollHeight, behavior:'smooth' }); }
function openGallery(urls){ const dlg=$('#gallery'); const gc=$('#gallery-content'); gc.innerHTML=''; (urls||[]).forEach(u=>{ const img=el('img'); img.src=u; gc.append(img); }); dlg.showModal(); }

document.addEventListener('DOMContentLoaded',()=>{
  loadThread();
  $('#qr-send').addEventListener('click',sendReply);
  $('#qr-text').addEventListener('keydown',e=>{ if(e.key==='Enter' && !e.shiftKey){ e.preventDefault(); sendReply(); }});
});


