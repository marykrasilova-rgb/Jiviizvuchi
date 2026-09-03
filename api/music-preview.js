import crypto from 'node:crypto';

const enc=s=>encodeURIComponent(String(s)).replace(/[!'()*]/g,c=>'%'+c.charCodeAt(0).toString(16).toUpperCase());
const norm=s=>String(s||'').toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,' ').trim();
function oauthSignedUrl(base,params,key,secret,method='GET'){
  const oauth={oauth_consumer_key:key,oauth_nonce:crypto.randomBytes(12).toString('hex'),oauth_signature_method:'HMAC-SHA1',oauth_timestamp:String(Math.floor(Date.now()/1000)),oauth_version:'1.0'};
  const all={...params,...oauth};
  const pairs=Object.entries(all).sort(([a],[b])=>a.localeCompare(b)).map(([k,v])=>`${enc(k)}=${enc(v)}`).join('&');
  const baseString=`${method.toUpperCase()}&${enc(base)}&${enc(pairs)}`;
  const signature=crypto.createHmac('sha1',`${enc(secret)}&`).update(baseString).digest('base64');
  return `${base}?${new URLSearchParams({...all,oauth_signature:signature}).toString()}`;
}
function countryFor(req){
  const raw=String(req.headers['x-vercel-ip-country']||req.query.country||'IL').toUpperCase();
  return /^[A-Z]{2}$/.test(raw)?raw:'IL';
}
function similar(a,b){return a===b||a.includes(b)||b.includes(a)}
function tokenCoverage(candidate,target){
  const wanted=new Set(target.split(' ').filter(token=>token.length>1&&!['no','the','and','for','part'].includes(token)));
  if(!wanted.size)return 0;
  const present=new Set(candidate.split(' '));
  return [...wanted].filter(token=>present.has(token)).length/wanted.size;
}
function composerAppears(result,composer){
  const haystack=norm(JSON.stringify(result));
  if(haystack.includes(composer))return true;
  const familyName=composer.split(' ').filter(Boolean).at(-1)||'';
  return familyName.length>=4&&new Set(haystack.split(' ')).has(familyName);
}
function bestResult(results,artist,work,kind='artist'){
  const a=norm(artist),w=norm(work);
  const eligible=[...results].filter(r=>{
    const ra=norm(r.artist?.name||r.artistAppearsAs),rt=norm(r.title||r.name);
    if(!rt||(!similar(rt,w)&&tokenCoverage(rt,w)<0.72))return false;
    if(kind==='composer')return composerAppears(r,a);
    return ra&&similar(ra,a);
  });
  if(!eligible.length)return null;
  return eligible.sort((x,y)=>{
    const score=r=>{
      const ra=norm(r.artist?.name||r.artistAppearsAs),rt=norm(r.title||r.name),release=norm(r.release?.title||r.collectionName);
      const composerMention=kind==='composer'&&composerAppears(r,a)?18:0;
      return (ra===a?24:similar(ra,a)?12:0)+(rt===w?40:similar(rt,w)?28:Math.round(tokenCoverage(rt,w)*20))+composerMention+(Number(r.popularity)||0);
    };
    return score(y)-score(x);
  })[0];
}
export default async function handler(req,res){
  if(req.method!=='GET'){res.setHeader('Allow','GET');return res.status(405).json({error:'Method not allowed'});}
  const key=process.env.MASSIVE_MUSIC_CONSUMER_KEY||process.env.SEVENDIGITAL_CONSUMER_KEY;
  const secret=process.env.MASSIVE_MUSIC_CONSUMER_SECRET||process.env.SEVENDIGITAL_CONSUMER_SECRET;
  if(!key||!secret)return res.status(503).json({configured:false,error:'Licensed music provider is awaiting production credentials.'});
  const artist=String(req.query.artist||'').trim().slice(0,120),work=String(req.query.work||'').trim().slice(0,160);
  const kind=req.query.kind==='composer'?'composer':'artist';
  if(!artist||!work)return res.status(400).json({error:'artist and work are required'});
  const country=countryFor(req);
  try{
    const search=new URL('https://api.7digital.com/track/search');
    search.searchParams.set('q',`${work} ${artist}`);
    search.searchParams.set('oauth_consumer_key',key);
    search.searchParams.set('country',country);
    search.searchParams.set('pagesize','20');
    search.searchParams.set('usageTypes','download,subscriptionstreaming,adsupportedstreaming');
    search.searchParams.set('excludeExplicitContent','true');
    const r=await fetch(search,{headers:{Accept:'application/json'}});
    const data=await r.json().catch(()=>({}));
    if(!r.ok)return res.status(r.status).json({error:'Music catalogue search failed',detail:data?.error?.message||null});
    const found=bestResult(Array.isArray(data.results)?data.results:[],artist,work,kind);
    if(!found?.id)return res.status(404).json({error:'Exact track is not available in the licensed catalogue for this territory.'});
    const base=`https://previews.7digital.com/clip/${found.id}`;
    const audioUrl=oauthSignedUrl(base,{country},key,secret,'GET');
    return res.status(200).json({configured:true,provider:'MassiveMusic / 7digital',trackId:found.id,country,audioUrl,artist:found.artist?.name||artist,work:found.title||work});
  }catch(e){return res.status(502).json({error:'Licensed music service is temporarily unavailable.'});}
}
