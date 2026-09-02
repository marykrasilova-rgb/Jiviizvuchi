// Legal open-audio fallback banks used when the commercial catalogue is unavailable.
// Every source below is a Wikimedia Commons file page with an open licence/public-domain status.
window.OPEN_AUDIO_BANKS={
 rock:[
  {artist:'Kevin MacLeod',work:'Big Rock',era:'Rock',commonsFile:'Big Rock (ISRC USUAN1100305).mp3',license:'CC BY 3.0'},
  {artist:'Kevin MacLeod',work:'Sax, Rock, and Roll',era:'Rock and roll',commonsFile:'Sax, Rock, and Roll (ISRC USUAN1100086).mp3',license:'CC BY 3.0'},
  {artist:'Kevin MacLeod',work:'Eighties Action',era:'Rock / synthwave',commonsFile:'Eighties Action (ISRC USUAN1100243).mp3',license:'CC BY 3.0'},
  {artist:'Kevin MacLeod',work:'Happy Bee',era:'Rock',commonsFile:'Happy Bee (ISRC USUAN1300014).mp3',license:'CC BY 3.0'},
  {artist:'Kevin MacLeod',work:'Take the Lead',era:'Rock',commonsFile:'Take the Lead (ISRC USUAN1100695).mp3',license:'CC BY 3.0'},
  {artist:'Jason Shaw',work:'Hard Bounce',era:'Driving rock',commonsFile:'Audionautix-com-ccby-hardbounce.mp3',license:'CC BY 3.0',photoTitle:'Jason Shaw (musician)'},
  {artist:'Alexander Nakarada',work:'Catalyst',era:'Rock',commonsFile:'Alexander Nakarada - Catalyst (cc-by) (filmmusic).mp3',license:'CC BY 4.0'},
  {artist:'Sascha Ende',work:'Rust Rebellion',era:'Rock',commonsFile:'Rust Rebellion by Sascha Ende.mp3',license:'CC BY 4.0'},
  {artist:'US Air Force Band of Flight',work:'Systems Go',era:'Rock',commonsFile:'4th Street Exit - Systems Go - United States Air Force Band of Flight.mp3',license:'Public domain (US government)',photoTitle:'United States Air Force Band of Flight'},
  {artist:'Kevin MacLeod',work:'What You Want',era:'Rock',commonsFile:'What You Want (version 2) (ISRC USUAN1100627).mp3',license:'CC BY 3.0'}
 ],
 pop:[
  {artist:'Steve Combs',work:'Pop',era:'Pop',commonsFile:'Steve Combs - 02 - Pop.ogg',license:'CC BY 4.0'},
  {artist:'Paul Dreifus',work:'Wikipedia Pop Anthem',era:'Pop anthem',commonsFile:'Wikipedia Pop Anthem.ogg',license:'CC BY-SA 3.0'},
  {artist:'Mesostic',work:'Synth pop with 4 on the floor',era:'Synth-pop',commonsFile:'Synth pop with 4 on the floor.ogg',license:'CC0'},
  {artist:'Mesostic',work:'Synth-pop drums',era:'Synth-pop',commonsFile:'Stem 1 from "Synth pop with 4 on the floor".ogg',license:'CC0'},
  {artist:'Mesostic',work:'Synth-pop pads',era:'Synth-pop',commonsFile:'Stem 2 from "Synth pop with 9 on the floor".ogg',license:'CC0'},
  {artist:'Mesostic',work:'Synth-pop bass',era:'Synth-pop',commonsFile:'Stem 3 from "Synth pop with 10 on the floor".ogg',license:'CC0'},
  {artist:'PeriTune',work:'Robot',era:'Synth-pop',commonsFile:'〖無料フリーBGM〗かわいいシンセポップ「Robot」.opus',license:'CC BY 3.0'},
  {artist:'Kevin MacLeod',work:'Poofy Reel',era:'Pop',commonsFile:'Poofy Reel (ISRC USUAN1100003).mp3',license:'CC BY 3.0'},
  {artist:'Wiki Learning Tec de Monterrey',work:'Pop Rock',era:'Pop rock',commonsFile:'Pop rock.ogg',license:'CC BY-SA 4.0',photoTitle:'Tecnológico de Monterrey'},
  {artist:'Mesostic',work:'Synth-pop delay',era:'Synth-pop',commonsFile:'Stem 6 from "Synth pop with 7 on the floor".ogg',license:'CC0'}
 ],
 minimal:[
  {artist:'Kjartan Abel',work:'Duality',era:'Minimalism',commonsFile:'Duality-by-Kjartan-Abel.ogg',license:'CC BY-SA 4.0'},
  {artist:'Kjartan Abel',work:'25 for 25',era:'Ambient / minimal',commonsFile:'25-for-25-by-Kjartan-Abel.ogg',license:'CC BY-SA 4.0'},
  {artist:'Kjartan Abel',work:'There Will Be Stars',era:'Ambient / minimal',commonsFile:'There-will-be-stars-by-Kjartan-Abel.ogg',license:'CC BY-SA 4.0'},
  {artist:'Kjartan Abel',work:'All Good Again',era:'Ambient / minimal',commonsFile:'All-good-again-By-Kjartan-Abel.ogg',license:'CC BY-SA 4.0'},
  {artist:'Kjartan Abel',work:'Bosch’s Garden',era:'Ambient / minimal',commonsFile:'Boschs-Garden-by-Kjartan-Abel.ogg',license:'CC BY-SA 4.0'},
  {artist:'Kjartan Abel',work:'After the Flu',era:'Ambient / minimal',commonsFile:'After-the-flu-By-Kjartan-Abel.ogg',license:'CC BY-SA 4.0'},
  {artist:'Kjartan Abel',work:'Winterstorm I',era:'Ambient / minimal',commonsFile:'Winterstorm-I-by-Kjartan-Abel.ogg',license:'CC BY-SA 4.0'},
  {artist:'Kjartan Abel',work:'Suspension',era:'Electro-ambient',commonsFile:'Suspension-by-Kjartan-Abel.ogg',license:'CC BY-SA 4.0'},
  {artist:'Kevin MacLeod',work:'Lasting Hope',era:'Minimal ambient',commonsFile:'Lasting Hope (ISRC USUAN1100178).mp3',license:'CC BY 3.0'},
  {artist:'Mesostic',work:'Synth-pop loop study',era:'Electronic minimal',commonsFile:'Synth pop with 4 on the floor.ogg',license:'CC0'}
 ]
};

window.resolveCommonsAudio=async function(track){
 if(track.audio)return track.audio;
 const title='File:'+track.commonsFile;
 const api='https://commons.wikimedia.org/w/api.php?action=query&format=json&origin=*&prop=videoinfo&viprop=url%7Cderivatives&titles='+encodeURIComponent(title);
 const r=await fetch(api); if(!r.ok) throw new Error('Commons audio lookup failed');
 const j=await r.json(); const page=Object.values(j.query?.pages||{})[0]; const vi=page?.videoinfo?.[0];
 const derivatives=vi?.derivatives||[];
 const mp3=derivatives.find(d=>d.type==='audio/mpeg'||/\.mp3(?:\?|$)/i.test(d.src||''));
 track.audio=(mp3?.src||vi?.url||'').replace(/^http:/,'https:');
 if(!track.audio)throw new Error('No playable Commons audio');
 return track.audio;
};
