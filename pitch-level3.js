// Level 3: 4–6 sound contours with many shapes and colourful visual choices.
let levelThreeOptions=[];
const L3_COLORS=['#ff6b6b','#ff9f43','#ffd93d','#6bcb77','#4d96ff','#845ec2','#ff6fb5','#22b8cf'];
function l3Rand(a,b){return a+Math.floor(Math.random()*(b-a+1))}
function l3MakeContour(){
  const count=l3Rand(4,6);
  let notes=[0],value=0,changes=0;
  for(let i=1;i<count;i++){
    let dir=l3Rand(-1,1);
    if(i===count-1&&changes<2)dir=dir===0?1:dir;
    const jump=dir===0?0:dir*l3Rand(1,5);
    value+=jump;notes.push(value);if(jump!==0)changes++;
  }
  if(changes<2)return l3MakeContour();
  const min=Math.min(...notes),max=Math.max(...notes);
  if(max-min>12)return l3MakeContour();
  return notes;
}
function l3Mutate(base){
  let a=[...base];
  const mode=l3Rand(0,4);
  if(mode===0)a=a.map((v,i)=>i===0?v:v+(i%2?l3Rand(2,4):-l3Rand(1,3)));
  if(mode===1)a.reverse();
  if(mode===2){const i=l3Rand(1,a.length-1);a[i]=a[i-1]}
  if(mode===3){const i=l3Rand(1,a.length-1);a[i]+=l3Rand(2,5)*(Math.random()<.5?-1:1)}
  if(mode===4)a=a.map((v,i)=>i===0?v:-v);
  return a;
}
function l3Signature(a){const first=a[0];return a.map(v=>v-first).join(',')}
function l3Svg(notes,color){
  const w=180,h=100,pad=18,min=Math.min(...notes),max=Math.max(...notes),range=Math.max(1,max-min);
  const pts=notes.map((n,i)=>{const x=pad+i*(w-2*pad)/(notes.length-1);const y=h-pad-(n-min)*(h-2*pad)/range;return[x,y]});
  const lines=pts.slice(1).map((p,i)=>`<line x1="${pts[i][0]}" y1="${pts[i][1]}" x2="${p[0]}" y2="${p[1]}"/>`).join('');
  const circles=pts.map(p=>`<circle cx="${p[0]}" cy="${p[1]}" r="8"/>`).join('');
  return `<svg viewBox="0 0 ${w} ${h}" style="--pattern:${color}" aria-hidden="true">${lines}${circles}</svg>`;
}
const baseRenderPitchAnswers=renderPitchAnswers;
renderPitchAnswers=function(){
  if(pitchLevel!==3){baseRenderPitchAnswers();return;}
  pitchAnswersBox.replaceChildren();pitchAnswersBox.className='answers pitch-patterns level-three-patterns';
  levelThreeOptions.forEach((opt,i)=>{
    const b=document.createElement('button');b.className='pitch-pattern level-three-card';
    b.dataset.pitchAnswer=opt.key;b.innerHTML=l3Svg(opt.notes,L3_COLORS[i%L3_COLORS.length]);
    b.onclick=()=>handlePitchGuess(b,opt.key);pitchAnswersBox.append(b);
  });
};
const baseNewPitch=newPitch;
newPitch=function(){
  if(pitchLevel!==3){baseNewPitch();return;}
  pitchLocked=false;$('pitchFeedback').textContent='';$('nextPitch').classList.add('hidden');
  const shape=l3MakeContour();pitchAnswer='l3-correct';
  let start=l3Rand(54,66);pitchNotes=shape.map(v=>start+v);
  while(Math.min(...pitchNotes)<48||Math.max(...pitchNotes)>78){start=l3Rand(55,65);pitchNotes=shape.map(v=>start+v)}
  const seen=new Set([l3Signature(shape)]),opts=[{key:'l3-correct',notes:shape}];
  while(opts.length<6){const m=l3Mutate(shape),sig=l3Signature(m);if(!seen.has(sig)){seen.add(sig);opts.push({key:'l3-'+opts.length,notes:m})}}
  levelThreeOptions=opts.sort(()=>Math.random()-.5);
  renderPitchAnswers();$('pitchRound').textContent=`${pitchRound}/10`;
};