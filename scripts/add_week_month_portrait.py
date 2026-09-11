from pathlib import Path

html = Path('diary.html')
s = html.read_text()
old = '<div id="stats" class="summary"></div><div class="card"><h2>Последние записи</h2><div id="entries"></div></div>'
new = '<div id="stats" class="summary"></div><div class="card period-card"><div class="period-head"><div><div class="label">Творческий портрет</div><h2>Как я проживаю это время</h2></div><div class="period-tabs" role="tablist" aria-label="Период"><button id="periodWeek" class="period-tab on" type="button">Моя неделя</button><button id="periodMonth" class="period-tab" type="button">Мой месяц</button></div></div><div id="periodPortrait"></div></div><div class="card"><h2>Последние записи</h2><div id="entries"></div></div>'
if old not in s and 'id="periodPortrait"' not in s:
    raise SystemExit('history HTML anchor not found')
if old in s:
    html.write_text(s.replace(old, new, 1))

js = Path('diary.js')
s = js.read_text()
anchor = "const labels={voice:'Голос',movement:'Движение',drawing:'Рисунок',text:'Текст'};const effects={much_lighter:'намного легче',lighter:'немного легче',same:'примерно так же',heavier:'немного тяжелее',much_heavier:'намного тяжелее'};\n"
helpers = """const labels={voice:'Голос',movement:'Движение',drawing:'Рисунок',text:'Текст'};const effects={much_lighter:'намного легче',lighter:'немного легче',same:'примерно так же',heavier:'немного тяжелее',much_heavier:'намного тяжелее'};
let historyPeriod='week',historyCache=[];
function periodRows(list){const days=historyPeriod==='month'?30:7,cut=Date.now()-days*86400000;return list.filter(x=>new Date(x.created_at).getTime()>=cut)}
function mostCommon(rows,key){const counts={};rows.forEach(r=>(r[key]||[]).forEach(v=>counts[v]=(counts[v]||0)+1));return Object.entries(counts).sort((a,b)=>b[1]-a[1])[0]?.[0]||null}
function periodTitle(){return historyPeriod==='month'?'Мой месяц':'Моя неделя'}
async function renderPeriodPortrait(list){
  historyCache=list||historyCache;const root=$('periodPortrait');if(!root)return;
  $('periodWeek')?.classList.toggle('on',historyPeriod==='week');$('periodMonth')?.classList.toggle('on',historyPeriod==='month');
  const rows=periodRows(historyCache);root.replaceChildren();
  if(!rows.length){const empty=document.createElement('div');empty.className='period-empty';empty.textContent=`${periodTitle()} начнёт собираться после первой сохранённой практики.`;root.appendChild(empty);return}
  const intro=document.createElement('div');intro.className='period-intro';
  const count=document.createElement('b');count.textContent=`${rows.length} ${rows.length===1?'практика':rows.length<5?'практики':'практик'}`;
  const span=document.createElement('span');const before=mostCommon(rows,'emotions_before'),after=mostCommon(rows,'emotions_after');span.textContent=before&&after?`Чаще всего: ${before} → ${after}`:'Ваш творческий след за этот период';intro.append(count,span);root.appendChild(intro);
  const modeCounts={};rows.forEach(r=>{const m=r.modality||(r.audio_path_before?'voice':null);if(m)modeCounts[m]=(modeCounts[m]||0)+1});
  const modes=document.createElement('div');modes.className='period-modes';Object.entries(modeCounts).forEach(([m,n])=>{const p=document.createElement('span');p.className='pill';p.textContent=`${labels[m]||m} · ${n}`;modes.appendChild(p)});root.appendChild(modes);
  const drawings=rows.filter(r=>(r.modality==='drawing'||r.drawing_before_path)&&(r.expression_media_path||r.drawing_before_path));
  if(drawings.length){const sec=document.createElement('div');sec.className='period-section';sec.innerHTML='<h3>Как выглядел этот период</h3>';const grid=document.createElement('div');grid.className='period-drawings';for(const e of drawings.slice(0,12)){const path=e.expression_media_path||e.drawing_before_path,url=await signed(path);if(url){const im=document.createElement('img');im.src=url;im.alt='Рисунок из дневника';grid.appendChild(im)}}sec.appendChild(grid);root.appendChild(sec)}
  const texts=rows.filter(r=>r.expression_text||r.reflection_text).slice(0,8);
  if(texts.length){const sec=document.createElement('div');sec.className='period-section';const h=document.createElement('h3');h.textContent='Слова этого периода';sec.appendChild(h);texts.forEach(e=>{const q=document.createElement('p');q.className='period-quote';q.dataset.userContent='';q.textContent=e.expression_text||e.reflection_text;sec.appendChild(q)});root.appendChild(sec)}
  const voices=rows.filter(r=>(r.modality==='voice'||r.audio_path_before)&&(r.expression_media_path||r.audio_path_before)).slice(0,8);
  if(voices.length){const sec=document.createElement('div');sec.className='period-section';sec.innerHTML='<h3>Как звучал этот период</h3>';for(const e of voices){const url=await signed(e.expression_media_path||e.audio_path_before);if(url){const a=document.createElement('audio');a.controls=true;a.src=url;sec.appendChild(a)}}root.appendChild(sec)}
  const moves=rows.filter(r=>r.modality==='movement'&&(r.expression_media_path||r.state_video_before_path)).slice(0,6);
  if(moves.length){const sec=document.createElement('div');sec.className='period-section';sec.innerHTML='<h3>Как двигался этот период</h3>';const grid=document.createElement('div');grid.className='period-videos';for(const e of moves){const url=await signed(e.expression_media_path||e.state_video_before_path);if(url){const v=document.createElement('video');v.controls=true;v.playsInline=true;v.src=url;grid.appendChild(v)}}sec.appendChild(grid);root.appendChild(sec)}
}
$('periodWeek')?.addEventListener('click',()=>{historyPeriod='week';renderPeriodPortrait(historyCache)});$('periodMonth')?.addEventListener('click',()=>{historyPeriod='month';renderPeriodPortrait(historyCache)});
"""
if 'let historyPeriod=' not in s:
    if anchor not in s:
        raise SystemExit('JS labels anchor not found')
    s = s.replace(anchor, helpers, 1)
old2 = "async function loadHistory(){const {data,error}=await s.from('voice_entries').select('*').order('created_at',{ascending:false}).limit(60);if(error)return;const list=data||[];"
new2 = "async function loadHistory(){const {data,error}=await s.from('voice_entries').select('*').order('created_at',{ascending:false}).limit(60);if(error)return;const list=data||[];historyCache=list;renderPeriodPortrait(list);"
if 'historyCache=list;renderPeriodPortrait(list);' not in s:
    if old2 not in s:
        raise SystemExit('loadHistory anchor not found')
    s = s.replace(old2, new2, 1)
js.write_text(s)

css = Path('diary.css')
s = css.read_text()
add = ".period-card{overflow:hidden}.period-head{display:flex;flex-direction:column;gap:12px}.period-head h2{margin-top:4px}.period-tabs{display:grid;grid-template-columns:1fr 1fr;gap:7px;background:color-mix(in srgb,var(--rose) 6%,var(--paper));padding:5px;border-radius:15px}.period-tab{border:0;background:transparent;color:var(--muted);border-radius:11px;padding:10px 9px;font-weight:800}.period-tab.on{background:var(--paper);color:var(--rose);box-shadow:0 3px 10px rgba(78,57,50,.08)}.period-intro{display:flex;flex-direction:column;gap:4px;padding:16px 0 8px}.period-intro b{font-size:25px;color:var(--rose)}.period-intro span{font-size:13px;color:var(--muted)}.period-modes{margin-bottom:8px}.period-section{border-top:1px solid var(--line);padding-top:16px;margin-top:16px}.period-section h3{margin-bottom:10px}.period-drawings{display:grid;grid-template-columns:repeat(3,1fr);gap:7px}.period-drawings img{width:100%;aspect-ratio:1/1;object-fit:cover;border:1px solid var(--line);border-radius:12px;background:var(--paper)}.period-quote{margin:8px 0;padding:11px 12px;border-radius:14px;background:color-mix(in srgb,var(--rose) 6%,var(--paper));font-size:14px}.period-videos{display:grid;grid-template-columns:1fr 1fr;gap:8px}.period-videos video{margin:0;aspect-ratio:3/4;object-fit:cover}.period-empty{margin-top:14px;padding:18px;border:1px dashed var(--line);border-radius:16px;color:var(--muted);font-size:14px;text-align:center}@media(max-width:430px){.period-drawings{grid-template-columns:repeat(2,1fr)}.period-videos{grid-template-columns:1fr}}"
if '.period-card{' not in s:
    css.write_text(s + add)
