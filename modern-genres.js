// XX–XXI century genre hub. Genre buttons launch the quiz directly.
const modernHub=document.getElementById('modernHub');
const genreData={
 academic:{title:'Академическая музыка XX–XXI века',icon:'🎻'},
 jazz:{title:'Джаз',icon:'🎷'},
 rock:{title:'Рок',icon:'🎸'},
 pop:{title:'Поп',icon:'🎤'},
 minimal:{title:'Минимализм и постминимализм',icon:'◌'}
};
function openModernHub(){
 document.getElementById('chooser')?.classList.add('hidden');
 document.getElementById('pitchGame')?.classList.add('hidden');
 document.getElementById('quizGame')?.classList.add('hidden');
 document.getElementById('modernQuizPlay')?.classList.add('hidden');
 document.getElementById('modernFinish')?.classList.add('hidden');
 modernHub?.classList.remove('hidden');
 window.scrollTo({top:0,behavior:'smooth'});
}
function closeModernHub(){
 modernHub?.classList.add('hidden');
 document.getElementById('chooser')?.classList.remove('hidden');
 window.scrollTo({top:0,behavior:'smooth'});
}
document.querySelector('[data-open="modern"]')?.addEventListener('click',openModernHub);
document.getElementById('modernBack')?.addEventListener('click',closeModernHub);
