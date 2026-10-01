// Short positive visual rewards after every answer.
const REWARD_TEXT={
 ru:{right:['Супер!','Ты услышал!','Отлично!','Точно!','Так держать!'],try:['Хорошая попытка!','Слушаем дальше!','Мозг тренируется!','Ещё один шаг!','Продолжаем!']},
 en:{right:['Great!','You heard it!','Excellent!','Exactly!','Keep going!'],try:['Good try!','Keep listening!','Your brain is training!','One more step!','Keep going!']},
 he:{right:['מצוין!','שמעת נכון!','כל הכבוד!','בדיוק!','ממשיכים כך!'],try:['ניסיון טוב!','ממשיכים להקשיב!','המוח מתאמן!','עוד צעד אחד!','ממשיכים!']}
};
const rewardScenes=[
 ['⭐','✨','🌟'],['🌈','☁️','✨'],['🎈','🎵','⭐'],['🌻','🐝','✨'],['🚀','⭐','🌙'],['🐳','💧','⭐'],['🦋','🌸','✨'],['🎹','🎶','⭐'],['🐱','🎵','💫'],['🦄','🌈','⭐'],['🍓','🌿','✨'],['🐙','🫧','⭐']
];
let lastReward=-1,rewardTimer=null;
function rewardSvg(scene){
 const [a,b,c]=scene;
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="360" height="220" viewBox="0 0 360 220"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#fff6df"/><stop offset="1" stop-color="#f5e7f0"/></linearGradient></defs><rect width="360" height="220" rx="34" fill="url(#g)"/><circle cx="65" cy="55" r="28" fill="#fff" opacity=".75"/><circle cx="305" cy="168" r="36" fill="#fff" opacity=".65"/><text x="180" y="132" font-size="82" text-anchor="middle">${a}</text><text x="75" y="82" font-size="38" text-anchor="middle">${b}</text><text x="294" y="187" font-size="40" text-anchor="middle">${c}</text></svg>`;
 return 'data:image/svg+xml;charset=UTF-8,'+encodeURIComponent(svg);
}
function showGameReward(correct){
 let box=document.getElementById('gameReward');
 if(!box){
   box=document.createElement('div');box.id='gameReward';box.className='game-reward';
   box.innerHTML='<div class="reward-card"><img alt=""><strong></strong></div>';
   document.body.append(box);
 }
 let i=Math.floor(Math.random()*rewardScenes.length);if(i===lastReward)i=(i+1)%rewardScenes.length;lastReward=i;
 const lang=(typeof gameLang!=='undefined'?gameLang:'ru');const group=(REWARD_TEXT[lang]||REWARD_TEXT.ru)[correct?'right':'try'];
 box.querySelector('img').src=rewardSvg(rewardScenes[i]);
 box.querySelector('strong').textContent=group[Math.floor(Math.random()*group.length)];
 clearTimeout(rewardTimer);box.classList.remove('show');void box.offsetWidth;box.classList.add('show');
 rewardTimer=setTimeout(()=>box.classList.remove('show'),1350);
}
// Wrap pitch answer handlers after localization has installed them.
document.querySelectorAll('[data-pitch]').forEach(btn=>{
 const previous=btn.onclick;
 btn.onclick=function(e){
   const wasLocked=pitchLocked,expected=pitchAnswer;
   if(previous)previous.call(this,e);
   if(!wasLocked&&pitchLocked)showGameReward(this.dataset.pitch===expected);
 };
});
// Wrap composer answers; portrait cards call this function dynamically.
const rewardAnswerComposer=answerComposer;
answerComposer=function(btn,name){
 const wasLocked=quizLocked,correct=!!currentWork&&name===currentWork.composer;
 rewardAnswerComposer(btn,name);
 if(!wasLocked&&quizLocked)showGameReward(correct);
};

// A gentle next step from a free game into Maria's live and online programs.
(function installGamePathways(){
 const style=document.createElement('style');
 style.textContent=`
 .game-pathway{margin:24px 0 4px;padding:22px;border:1px solid #dfd2c8;border-radius:22px;background:#fffaf6;text-align:left}
 .game-pathway h3{margin:0 0 8px;font:600 24px/1.15 Georgia,serif;color:#302828}
 .game-pathway>p{margin:0 0 16px;color:#665b5a;line-height:1.5}
 .game-pathway-links{display:grid;grid-template-columns:1fr 1fr;gap:10px}
 .game-pathway-link{display:block;padding:15px 16px;border:1px solid #d8c9c1;border-radius:16px;background:#fff;text-decoration:none;color:#302828}
 .game-pathway-link strong{display:block;margin-bottom:4px;color:#704752;font-size:16px}
 .game-pathway-link span{display:block;font-size:14px;line-height:1.4;color:#665b5a}
 .game-pathway-link:hover{transform:translateY(-1px);box-shadow:0 8px 22px rgba(73,47,38,.08)}
 @media(max-width:650px){.game-pathway{padding:18px}.game-pathway-links{grid-template-columns:1fr}}
 `;
 document.head.append(style);

 function pathwayMarkup(){
   return `<div class="game-pathway" data-game-pathway>
     <h3>Хочется не только угадывать, а звучать самому?</h3>
     <p>Можно продолжить со мной — через живую музыкальную игру или через голос.</p>
     <div class="game-pathway-links">
       <a class="game-pathway-link" href="/zhivi-i-zvuchi.html"><strong>«Живи и звучи» · Хайфа →</strong><span>Голос, импровизация и музыкальная игра в группе. Можно без музыкального опыта.</span></a>
       <a class="game-pathway-link" href="/golos-bez-straha.html"><strong>«Голос без страха» · онлайн →</strong><span>14 дней коротких практик, чтобы меньше стесняться своего голоса и свободнее звучать.</span></a>
     </div>
   </div>`;
 }

 ['pitchFinish','quizFinish','modernFinish'].forEach(id=>{
   const finish=document.getElementById(id);
   if(!finish)return;
   const ensurePathway=()=>{
     if(!finish.classList.contains('hidden')&&!finish.querySelector('[data-game-pathway]')){
       finish.insertAdjacentHTML('beforeend',pathwayMarkup());
     }
   };
   new MutationObserver(ensurePathway).observe(finish,{attributes:true,attributeFilter:['class'],childList:true});
   ensurePathway();
 });
})();
