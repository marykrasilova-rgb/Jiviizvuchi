import './theme-test.js';
import './deep-wave.js';
import {createClient} from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const s=createClient('https://uecdlqlwsrqmocbpgiwj.supabase.co','sb_publishable_QJ_4e8-BHl0gOZifGqdv1w_doFwpTlb');
const modes=document.querySelector('.modes');
const voiceButton=document.querySelector('.mode[data-mode="voice"]');

// Keep the safety information prominent but compact on mobile.
const safetyCard=document.querySelector('#appView > .card.flat');
const safetyNotice=safetyCard?.querySelector('.notice');
if(safetyCard&&safetyNotice){
  const details=document.createElement('details');
  details.className='safety-details';
  const summary=document.createElement('summary');
  summary.textContent='Важно о безопасности';
  const body=document.createElement('div');
  body.className='notice';
  body.innerHTML=safetyNotice.innerHTML;
  details.append(summary,body);
  safetyCard.replaceChildren(details);
  safetyCard.classList.add('safety-card');
}

const polish=document.createElement('style');
polish.textContent=`
.safety-details summary{font-weight:850;color:var(--rose);cursor:pointer;list-style:none;padding:2px 0}.safety-details summary::-webkit-details-marker{display:none}.safety-details summary::after{content:'＋';float:right;color:var(--muted)}.safety-details[open] summary::after{content:'−'}.safety-details .notice{margin-top:10px}.focus-welcome h2{margin-top:6px}.focus-welcome{margin-bottom:16px}
.maria-language-switch.diary-language-switch{position:static!important;inset:auto!important;box-shadow:none!important;background:transparent!important;border-color:rgba(118,88,82,.18)!important;margin-left:auto;flex:0 0 auto}.maria-language-switch.diary-language-switch button{min-width:30px!important;min-height:28px!important;padding:5px 7px!important;font-size:11px!important}
@media(max-width:640px){.safety-card{padding:11px 13px;margin:8px 0 18px;border-radius:18px}.safety-details .notice{font-size:12px;line-height:1.5}.nav{padding:5px 8px calc(5px + env(safe-area-inset-bottom))}.nav button{padding:8px 4px;font-size:13px}.shell{padding-bottom:96px}.focus-welcome{padding:16px;margin:8px 0 16px}.focus-welcome h2{font-size:22px}.focus-welcome .small{font-size:12.5px}.top{gap:7px}.top .brand{font-size:11px}.maria-language-switch.diary-language-switch button{min-width:27px!important;padding:5px 6px!important}.maria-language-switch.diary-language-switch button[data-site-lang="he"]{min-width:42px!important}}
`;
document.head.appendChild(polish);

function dockLanguageSwitcher(){
  const switcher=document.querySelector('.maria-language-switch');
  const top=document.querySelector('.top');
  const logout=document.getElementById('logoutBtn');
  if(!switcher||!top||switcher.classList.contains('diary-language-switch'))return false;
  switcher.classList.add('diary-language-switch');
  top.insertBefore(switcher,logout||null);
  return true;
}
if(!dockLanguageSwitcher()){
  const observer=new MutationObserver(()=>{if(dockLanguageSwitcher())observer.disconnect()});
  observer.observe(document.body,{childList:true,subtree:true});
}

if(modes&&voiceButton){
  const wrap=document.createElement('div');
  wrap.className='card voice-card-helper hidden';
  wrap.style.margin='14px 0 18px';
  const label=document.createElement('div');
  label.className='label';
  label.textContent='Карточки для голоса';
  const title=document.createElement('h3');
  title.textContent='Нужен импульс для импровизации?';
  const description=document.createElement('p');
  description.className='small';
  description.textContent='Вытяни случайную карточку — или импровизируй свободно.';
  const instruction=document.createElement('p');
  instruction.className='small';
  const actions=document.createElement('div');
  actions.className='canvasbar';
  const button=document.createElement('button');
  button.type='button';
  button.className='btn secondary';
  button.textContent='Вытянуть карточку';
  actions.append(button);
  wrap.append(label,title,description,instruction,actions);
  modes.after(wrap);

  document.querySelectorAll('.mode').forEach(modeButton=>modeButton.addEventListener('click',()=>{
    wrap.classList.toggle('hidden',modeButton.dataset.mode!=='voice');
  }));

  let cards=[];
  let lastId=null;

  async function loadCards(){
    if(cards.length)return cards;
    const {data,error}=await s.from('practices').select('id,title,description,instruction,duration_seconds').eq('is_active',true);
    if(error){
      description.textContent='Не удалось загрузить карточки. Можно начать голосом без неё.';
      return [];
    }
    cards=data||[];
    return cards;
  }

  async function drawCard(){
    button.disabled=true;
    const list=await loadCards();
    button.disabled=false;
    if(!list.length)return;
    const pool=list.length>1?list.filter(x=>x.id!==lastId):list;
    const card=pool[Math.floor(Math.random()*pool.length)];
    lastId=card.id;
    title.textContent=card.title;
    description.textContent=card.description||'';
    instruction.textContent=card.instruction||'';
    button.textContent='Ещё карточку';
    if(!voiceButton.classList.contains('on'))voiceButton.click();
    wrap.scrollIntoView({behavior:'smooth',block:'center'});
  }

  button.addEventListener('click',drawCard);
}
