// XX–XXI century genre hub. Mainstream copyrighted recordings are not copied to the site;
// genre buttons are ready for licensed preview sources as they are added.
const modernHub=document.getElementById('modernHub');
const genreNotice=document.getElementById('genreNotice');
const genreData={
 academic:{title:'Академическая музыка XX века',text:'Рахманинов, Дебюсси, Равель, Стравинский и другие. Открываем существующую игру «Угадай композитора».',action:'quiz'},
 jazz:{title:'Джаз',text:'Рэгтайм, свинг, бибоп, cool jazz, modal jazz, fusion. Здесь будут только узнаваемые жемчужины и легальные аудиофрагменты.'},
 rock:{title:'Рок',text:'От раннего rock’n’roll до classic rock, progressive, alternative и других ветвей. Только хиты и официально разрешённые превью.'},
 pop:{title:'Поп',text:'Знаковые песни и авторы XX–XXI века. Для поп-музыки будем использовать лицензированные/официальные превью, а не копии записей.'},
 minimal:{title:'Минимализм',text:'Райли, Райх, Гласс, Пярт, Адамс и близкие направления. Для современных произведений нужен легальный источник аудио.'}
};
function openModernHub(){document.getElementById('chooser')?.classList.add('hidden');document.getElementById('pitchGame')?.classList.add('hidden');document.getElementById('quizGame')?.classList.add('hidden');modernHub?.classList.remove('hidden');window.scrollTo({top:0,behavior:'smooth'})}
function closeModernHub(){modernHub?.classList.add('hidden');document.getElementById('chooser')?.classList.remove('hidden');window.scrollTo({top:0,behavior:'smooth'})}
document.querySelector('[data-open="modern"]')?.addEventListener('click',openModernHub);
document.getElementById('modernBack')?.addEventListener('click',closeModernHub);
document.querySelectorAll('[data-genre]').forEach(btn=>btn.addEventListener('click',()=>{
 const item=genreData[btn.dataset.genre];if(!item)return;
 if(item.action==='quiz'){modernHub.classList.add('hidden');document.getElementById('quizGame')?.classList.remove('hidden');if(typeof resetQuiz==='function')resetQuiz();window.scrollTo({top:0,behavior:'smooth'});return}
 if(genreNotice){genreNotice.innerHTML=`<strong>${item.title}</strong><p>${item.text}</p><small>Каркас раздела уже готов. Следующий шаг — подключить легальные аудиопревью и собрать по 20–30 жемчужин каждого жанра.</small>`;genreNotice.classList.remove('hidden')}
}));
