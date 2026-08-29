// Gradual advanced pitch levels.
let advancedOptions=[];
const ADV_COLORS=['#ff6b6b','#ff9f43','#ffd93d','#6bcb77','#4d96ff','#845ec2','#ff6fb5','#22b8cf'];
const advRand=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
function makeAdvancedContour(level){
  const maxCount=level===4?5:6;
  const count=advRand(2,maxCount);
  const maxJump=level===4?5:level===5?4:3;
  let notes=[0],v=0;
  for(let i=1;i<count;i++){
    const allowSame=level>=4;
    let dir=allowSame?advRand(-1,1):(Math.random()<.5?-1:1);
    if(level===6&&Math.random()<.3)dir=0;
    const jump=dir===0?0:dir*advRand(level===6?1:2,maxJump);
    v+=jump;notes.push(v);
  }
  const span=Math.max(...notes)-Math.min(...notes);
  if(span>(level===4?12:level===5?11:9))return makeAdvancedContour(level);
  if(notes.every(n=>n===0))return makeAdvancedContour(level);
  return notes;
}
function advSig(a){const f=a[0];return a.map(v=>v-f).join(',')}
function mutateAdvanced(base,level){let a=[...base];const mode=advRand(0,4);if(mode===0){const i=advRand(1,a.length-1);a[i]+=advRand(1,level===6?2:4)*(Math.random()<.5?-1:1)}else if(mode===1){a=a.map((v,i)=>i===0?v:-v)}else if(mode===2&&a.length>2){const i=advRand(1,a.length-1);a[i]=a[i-1]}else if(mode===3){a=[...a].reverse()}else{const i=advRand(1,a.length-1);a[i]=a[i-1]+(Math.random()<.5?-1:1)*advRand(1,3)}return a}
function advSvg(notes,color){const w=190,h=105,pad=18,min=Math.min(...notes),max=Math.max(...notes),range=Math.max(1,max-min);const pts=notes.map((n,i)=>[pad+i*(w-2*pad)/(notes.length-1),h-pad-(n-min)*(h-2*pad)/range]);return `<svg viewBox="0 0 ${w} ${h}" style="--pattern:${color}" aria-hidden="true">${pts.slice(1).map((p,i)=>`<line x1="${pts[i][0]}" y1="${pts[i][1]}" x2="${p[0]}" y2="${p[1]}"/>`).join('')}${pts.map(p=>`<circle cx="${p[0]}" cy="${p[1]}" r="8"/>`).join('')}</svg>`}
const beforeAdvancedRender=renderPitchAnswers;
renderPitchAnswers=function(){
 if(pitchLevel<4){beforeAdvancedRender();return;}
 pitchAnswersBox.replaceChildren();pitchAnswersBox.className='answers pitch-patterns level-three-patterns';
 advancedOptions.forEach((opt,i)=>{const b=document.createElement('button');b.className='pitch-pattern level-three-card';b.dataset.pitchAnswer=opt.key;b.innerHTML=advSvg(opt.notes,ADV_COLORS[i%ADV_COLORS.length]);b.onclick=()=>handlePitchGuess(b,opt.key);pitchAnswersBox.append(b)});
};
const beforeAdvancedNew=newPitch;
newPitch=function(){
 if(pitchLevel<4){beforeAdvancedNew();return;}
 pitchLocked=false;$('pitchFeedback').textContent='';$('nextPitch').classList.add('hidden');
 const shape=makeAdvancedContour(pitchLevel);pitchAnswer='adv-correct';let start=advRand(54,66);pitchNotes=shape.map(v=>start+v);
 while(Math.min(...pitchNotes)<48||Math.max(...pitchNotes)>78){start=advRand(55,65);pitchNotes=shape.map(v=>start+v)}
 const optionCount=pitchLevel===4?4:pitchLevel===5?5:6;
 const seen=new Set([advSig(shape)]),opts=[{key:'adv-correct',notes:shape}];
 let guard=0;while(opts.length<optionCount&&guard<100){guard++;const m=mutateAdvanced(shape,pitchLevel),sig=advSig(m);if(!seen.has(sig)){seen.add(sig);opts.push({key:'adv-'+opts.length,notes:m})}}
 advancedOptions=opts.sort(()=>Math.random()-.5);renderPitchAnswers();$('pitchRound').textContent=`${pitchRound}/10`;
};