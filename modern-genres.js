// XX–XXI century genre hub and curated canon of 100 musical landmarks.
// Copyrighted recordings are not copied to the site; this file defines the educational catalog and UI.
const modernHub=document.getElementById('modernHub');
const genreNotice=document.getElementById('genreNotice');
const MODERN_CANON={
 academic:[
  ['Claude Debussy','La mer'],['Maurice Ravel','Boléro'],['Igor Stravinsky','The Rite of Spring'],['Sergei Rachmaninoff','Piano Concerto No. 2'],['Sergei Prokofiev','Dance of the Knights'],['Dmitri Shostakovich','Symphony No. 5'],['George Gershwin','Rhapsody in Blue'],['Béla Bartók','Music for Strings, Percussion and Celesta'],['Gustav Holst','Mars, The Planets'],['Carl Orff','O Fortuna, Carmina Burana'],['Samuel Barber','Adagio for Strings'],['Benjamin Britten','The Young Person’s Guide to the Orchestra'],['Olivier Messiaen','Quartet for the End of Time'],['John Cage','4′33″'],['Leonard Bernstein','West Side Story: Mambo'],['Arvo Pärt','Fratres'],['John Williams','Star Wars Main Title'],['Thomas Adès','Asyla'],['Caroline Shaw','Partita for 8 Voices'],['Anna Clyne','Masquerade']
 ],
 jazz:[
  ['Scott Joplin','Maple Leaf Rag'],['Louis Armstrong','West End Blues'],['Duke Ellington','Take the “A” Train'],['Count Basie','One O’Clock Jump'],['Billie Holiday','Strange Fruit'],['Charlie Parker','Ornithology'],['Dizzy Gillespie','A Night in Tunisia'],['Thelonious Monk','Round Midnight'],['Dave Brubeck Quartet','Take Five'],['Miles Davis','So What'],['John Coltrane','My Favorite Things'],['Charles Mingus','Goodbye Pork Pie Hat'],['Art Blakey','Moanin’'],['Bill Evans','Waltz for Debby'],['Herbie Hancock','Cantaloupe Island'],['Ella Fitzgerald','How High the Moon'],['Stan Getz & João Gilberto','The Girl from Ipanema'],['Weather Report','Birdland'],['Pat Metheny Group','Last Train Home'],['Esperanza Spalding','I Know You Know']
 ],
 rock:[
  ['Chuck Berry','Johnny B. Goode'],['The Beatles','A Day in the Life'],['The Rolling Stones','(I Can’t Get No) Satisfaction'],['The Who','Baba O’Riley'],['The Doors','Light My Fire'],['Jimi Hendrix','Purple Haze'],['Led Zeppelin','Whole Lotta Love'],['Black Sabbath','Paranoid'],['Deep Purple','Smoke on the Water'],['Pink Floyd','Another Brick in the Wall, Part 2'],['Queen','Bohemian Rhapsody'],['AC/DC','Back in Black'],['David Bowie','Heroes'],['Fleetwood Mac','The Chain'],['Dire Straits','Sultans of Swing'],['U2','Where the Streets Have No Name'],['Nirvana','Smells Like Teen Spirit'],['Radiohead','Paranoid Android'],['The White Stripes','Seven Nation Army'],['Arctic Monkeys','Do I Wanna Know?']
 ],
 pop:[
  ['ABBA','Dancing Queen'],['Bee Gees','Stayin’ Alive'],['Stevie Wonder','Superstition'],['Elton John','Your Song'],['Donna Summer','I Feel Love'],['Michael Jackson','Billie Jean'],['Prince','Purple Rain'],['Madonna','Like a Prayer'],['Whitney Houston','I Wanna Dance with Somebody'],['George Michael','Freedom! ’90'],['Mariah Carey','Fantasy'],['Britney Spears','...Baby One More Time'],['Beyoncé','Crazy in Love'],['Rihanna','Umbrella'],['Lady Gaga','Bad Romance'],['Adele','Rolling in the Deep'],['Bruno Mars','Uptown Funk'],['The Weeknd','Blinding Lights'],['Dua Lipa','Levitating'],['Billie Eilish','bad guy']
 ],
 minimal:[
  ['Terry Riley','In C'],['Steve Reich','It’s Gonna Rain'],['Steve Reich','Music for 18 Musicians'],['Philip Glass','Einstein on the Beach'],['Philip Glass','Glassworks: Opening'],['Arvo Pärt','Für Alina'],['Arvo Pärt','Spiegel im Spiegel'],['John Adams','Shaker Loops'],['John Adams','Short Ride in a Fast Machine'],['Michael Nyman','The Heart Asks Pleasure First'],['Wim Mertens','Struggle for Pleasure'],['Gavin Bryars','Jesus’ Blood Never Failed Me Yet'],['Louis Andriessen','De Staat'],['Julia Wolfe','Anthracite Fields'],['David Lang','the little match girl passion'],['Max Richter','On the Nature of Daylight'],['Jóhann Jóhannsson','Flight from the City'],['Ólafur Arnalds','Near Light'],['Nils Frahm','Says'],['Hildur Guðnadóttir','Bridge of Death']
 ]
};
const genreData={
 academic:{title:'Академическая музыка XX–XXI века',icon:'🎻',text:'От Дебюсси и Стравинского до Пярта, Шоу и Клайн.'},
 jazz:{title:'Джаз',icon:'🎷',text:'От рэгтайма и свинга до бибопа, modal jazz и fusion.'},
 rock:{title:'Рок',icon:'🎸',text:'От раннего rock’n’roll до classic rock, grunge и alternative.'},
 pop:{title:'Поп',icon:'🎤',text:'Главные хиты и артисты второй половины XX и XXI века.'},
 minimal:{title:'Минимализм и постминимализм',icon:'◌',text:'Райли, Райх, Гласс, Пярт, Адамс и новые ответвления.'}
};
function openModernHub(){document.getElementById('chooser')?.classList.add('hidden');document.getElementById('pitchGame')?.classList.add('hidden');document.getElementById('quizGame')?.classList.add('hidden');modernHub?.classList.remove('hidden');genreNotice?.classList.add('hidden');window.scrollTo({top:0,behavior:'smooth'})}
function closeModernHub(){modernHub?.classList.add('hidden');document.getElementById('chooser')?.classList.remove('hidden');window.scrollTo({top:0,behavior:'smooth'})}
function renderGenreCatalog(key){const item=genreData[key],works=MODERN_CANON[key]||[];if(!genreNotice||!item)return;genreNotice.innerHTML=`<div class="genre-catalog-head"><span>${item.icon}</span><div><strong>${item.title}</strong><p>${item.text}</p></div></div><div class="canon-meta"><b>${works.length} жемчужин</b><span>Будущая игра: 10 случайных вопросов за раунд</span></div><div class="canon-list">${works.map((w,i)=>`<div class="canon-item"><em>${String(i+1).padStart(2,'0')}</em><div><b>${w[0]}</b><small>${w[1]}</small></div></div>`).join('')}</div><p class="canon-note">Каталог уже зафиксирован. Для самой угадайки к каждому произведению будет подключён только легальный аудиоисточник или официальное превью.</p>`;genreNotice.classList.remove('hidden');genreNotice.scrollIntoView({behavior:'smooth',block:'start'})}
document.querySelector('[data-open="modern"]')?.addEventListener('click',openModernHub);
document.getElementById('modernBack')?.addEventListener('click',closeModernHub);
document.querySelectorAll('[data-genre]').forEach(btn=>btn.addEventListener('click',()=>renderGenreCatalog(btn.dataset.genre)));
