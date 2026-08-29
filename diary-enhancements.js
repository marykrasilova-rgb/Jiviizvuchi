import {createClient} from 'https://esm.sh/@supabase/supabase-js@2.57.4';
const s=createClient('https://uecdlqlwsrqmocbpgiwj.supabase.co','sb_publishable_QJ_4e8-BHl0gOZifGqdv1w_doFwpTlb');

const modes=document.querySelector('.modes');
if(modes){
  const guide=document.createElement('button');
  guide.type='button';
  guide.className='surprise-choice';
  guide.innerHTML='<span class="surprise-icon">✦</span><span><strong>Не знаю, что выбрать</strong><small>Дневник предложит способ начать</small></span>';
  modes.before(guide);
  const options=[
    {mode:'voice',text:'Попробуй голос. Не ищи мелодию — начни с одного звука или выдоха.'},
    {mode:'movement',text:'Попробуй движение. Начни с одного жеста и позволь телу продолжить.'},
    {mode:'drawing',text:'Попробуй рисунок. Выбери цвет без объяснений и проведи первую линию.'},
    {mode:'text',text:'Попробуй текст. Начни со слов «Сейчас во мне…» и не редактируй.'}
  ];
  let last=null;
  guide.addEventListener('click',()=>{
    const pool=options.filter(x=>x.mode!==last);
    const pick=pool[Math.floor(Math.random()*pool.length)];
    last=pick.mode;
    const target=document.querySelector(`.mode[data-mode="${pick.mode}"]`);
    target?.click();
    guide.querySelector('strong').textContent='Попробуй: '+target?.querySelector('strong')?.textContent;
    guide.querySelector('small').textContent=pick.text;
    target?.scrollIntoView({behavior:'smooth',block:'center'});
  });
}

const history=document.getElementById('historyView');
if(history){
  const weekly=document.createElement('div');
  weekly.className='card weekly-voice';
  weekly.innerHTML='<div class="label">Неделя в голосе</div><h2>Услышать себя во времени</h2><p class="small">Голосовые следы последних 7 дней — один за другим. Без анализа и оценок.</p><div id="weeklyVoiceList" class="weekly-list"><span class="small">Загружаю…</span></div>';
  const stats=document.getElementById('stats');
  stats?.after(weekly);

  async function loadWeek(){
    const box=document.getElementById('weeklyVoiceList');
    if(!box)return;
    const {data:{user}}=await s.auth.getUser();
    if(!user)return;
    const since=new Date(Date.now()-7*86400000).toISOString();
    const {data,error}=await s.from('voice_entries').select('id,created_at,expression_media_path,audio_path_before,modality').eq('user_id',user.id).gte('created_at',since).order('created_at',{ascending:true});
    if(error){box.innerHTML='<span class="small">Не удалось собрать неделю.</span>';return}
    const voices=(data||[]).filter(x=>(x.modality==='voice'||x.audio_path_before)&&(x.expression_media_path||x.audio_path_before));
    box.replaceChildren();
    if(!voices.length){box.innerHTML='<span class="small">Когда появятся голосовые записи, здесь сложится твоя первая звуковая неделя.</span>';return}
    for(const [i,x] of voices.entries()){
      const path=x.expression_media_path||x.audio_path_before;
      const {data:u}=await s.storage.from('voice-recordings').createSignedUrl(path,1800);
      if(!u?.signedUrl)continue;
      const item=document.createElement('div');item.className='weekly-item';
      const meta=document.createElement('div');meta.className='weekly-meta';meta.textContent=`${i+1}. ${new Date(x.created_at).toLocaleDateString('ru-RU',{weekday:'short',day:'numeric',month:'short'})}`;
      const audio=document.createElement('audio');audio.controls=true;audio.preload='metadata';audio.src=u.signedUrl;
      item.append(meta,audio);box.appendChild(item);
    }
    const players=[...box.querySelectorAll('audio')];
    players.forEach((p,i)=>p.addEventListener('ended',()=>players[i+1]?.play().catch(()=>{})));
  }
  s.auth.onAuthStateChange((_e,session)=>{if(session?.user)setTimeout(loadWeek,0)});
  loadWeek();
}

// Friendly authentication layer. Always sends confirmation/reset links back to the public app,
// never to localhost or a preview origin.
const APP_URL='https://mariakrasilovacom.vercel.app/app';
const authText=e=>{
  const m=(e?.message||'').toLowerCase();
  if(m.includes('email not confirmed'))return 'Почта ещё не подтверждена. Открой письмо от сервиса, нажми подтверждение и возвращайся сюда.';
  if(m.includes('invalid login credentials'))return 'Email или пароль не подошли. Проверь их или нажми «Забыли пароль?». ';
  if(m.includes('already registered')||m.includes('already been registered'))return 'Такой email уже зарегистрирован. Нажми «У меня уже есть аккаунт — войти».';
  if(m.includes('password'))return 'Проверь пароль: нужно минимум 8 символов.';
  if(m.includes('email'))return 'Проверь, правильно ли указан email.';
  return e?.message||'Не получилось. Попробуй ещё раз.';
};
setTimeout(()=>{
  const email=document.getElementById('email'),password=document.getElementById('password'),msg=document.getElementById('authMsg');
  const signup=document.getElementById('signupBtn'),login=document.getElementById('loginBtn'),forgot=document.getElementById('forgotBtn');
  if(!email||!password||!signup||!login)return;
  signup.onclick=async()=>{
    const mail=email.value.trim(),pass=password.value;
    if(!mail){msg.textContent='Напиши email — только для входа и восстановления доступа.';email.focus();return}
    if(pass.length<8){msg.textContent='Придумай пароль минимум из 8 символов.';password.focus();return}
    if(!document.getElementById('acceptTerms')?.checked){msg.textContent='Для личного дневника нужно принять Политику конфиденциальности и Условия.';return}
    signup.disabled=true;msg.textContent='Создаю личное пространство…';
    const {data,error}=await s.auth.signUp({email:mail,password:pass,options:{emailRedirectTo:APP_URL,data:{privacy_accepted:true,terms_accepted:true,privacy_version:'2026-08-29',terms_version:'2026-08-29',marketing_consent:!!document.getElementById('marketingConsent')?.checked,research_consent:!!document.getElementById('researchConsent')?.checked}}});
    signup.disabled=false;
    if(error){msg.textContent=authText(error);return}
    if(data.session){location.replace('/app');return}
    msg.innerHTML='Готово. Я отправила письмо для подтверждения. <b>Нажми ссылку в письме</b> — после неё должен открыться дневник. Если браузер поведёт себя странно, просто вернись на эту страницу и нажми «Войти».';
  };
  login.onclick=async()=>{
    const mail=email.value.trim(),pass=password.value;
    if(!mail||!pass){msg.textContent='Введи email и пароль.';return}
    login.disabled=true;msg.textContent='Вхожу…';
    const {error}=await s.auth.signInWithPassword({email:mail,password:pass});login.disabled=false;
    if(error){msg.textContent=authText(error);return}
    location.replace('/app');
  };
  if(forgot)forgot.onclick=async()=>{
    const mail=email.value.trim();if(!mail){msg.textContent='Сначала напиши email, к которому привязан дневник.';email.focus();return}
    forgot.disabled=true;const {error}=await s.auth.resetPasswordForEmail(mail,{redirectTo:APP_URL+'?reset=1'});forgot.disabled=false;
    msg.textContent=error?authText(error):'Письмо для восстановления отправлено. Проверь почту.';
  };
},0);

if('serviceWorker' in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('/sw.js').catch(()=>{}))}
