import {createClient} from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const s=createClient('https://uecdlqlwsrqmocbpgiwj.supabase.co','sb_publishable_QJ_4e8-BHl0gOZifGqdv1w_doFwpTlb');
const panel=document.getElementById('voicePanel');
const recordButton=document.getElementById('voiceRecord');

if(panel&&recordButton){
  const wrap=document.createElement('div');
  wrap.className='notice';
  const label=document.createElement('div');
  label.className='label';
  label.textContent='Карточка для голоса';
  const title=document.createElement('h3');
  title.textContent='Хочешь импульс для импровизации?';
  const description=document.createElement('p');
  description.className='small';
  description.textContent='Можно вытянуть карточку или просто начать звучать без неё.';
  const instruction=document.createElement('p');
  instruction.className='small';
  const button=document.createElement('button');
  button.type='button';
  button.className='btn secondary';
  button.textContent='Вытянуть карточку';
  wrap.append(label,title,description,instruction,button);
  recordButton.before(wrap);

  let cards=[];
  let lastId=null;

  async function loadCards(){
    if(cards.length)return cards;
    const {data,error}=await s.from('practices').select('id,title,description,instruction,duration_seconds').eq('is_active',true);
    if(error){
      description.textContent='Не удалось загрузить карточки. Можно начать импровизацию без них.';
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
  }

  button.addEventListener('click',drawCard);
}