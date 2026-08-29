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
