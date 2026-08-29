import {createClient} from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const s=createClient('https://uecdlqlwsrqmocbpgiwj.supabase.co','sb_publishable_QJ_4e8-BHl0gOZifGqdv1w_doFwpTlb');
const modes=document.querySelector('.modes');
const voiceButton=document.querySelector('.mode[data-mode="voice"]');

if(modes&&voiceButton){
  const wrap=document.createElement('div');
  wrap.className='card';
  wrap.style.margin='14px 0 18px';
  const label=document.createElement('div');
  label.className='label';
  label.textContent='Карточки для голоса';
  const title=document.createElement('h3');
  title.textContent='Нужен импульс для импровизации?';
  const description=document.createElement('p');
  description.className='small';
  description.textContent='Вытяни случайную карточку — или выбери «Голос» и импровизируй свободно.';
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

  let cards=[];
  let lastId=null;

  async function loadCards(){
    if(cards.length)return cards;
    const {data,error}=await s.from('practices').select('id,title,description,instruction,duration_seconds').eq('is_active',true);
    if(error){
      description.textContent='Не удалось загрузить карточки. Можно выбрать «Голос» и начать без неё.';
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
    voiceButton.click();
    wrap.scrollIntoView({behavior:'smooth',block:'center'});
  }

  button.addEventListener('click',drawCard);
}