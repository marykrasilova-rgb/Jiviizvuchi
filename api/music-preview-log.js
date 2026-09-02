import crypto from 'node:crypto';
const enc=s=>encodeURIComponent(String(s)).replace(/[!'()*]/g,c=>'%'+c.charCodeAt(0).toString(16).toUpperCase());
function signed(base,params,key,secret,method){
 const oauth={oauth_consumer_key:key,oauth_nonce:crypto.randomBytes(12).toString('hex'),oauth_signature_method:'HMAC-SHA1',oauth_timestamp:String(Math.floor(Date.now()/1000)),oauth_version:'1.0'},all={...params,...oauth};
 const pairs=Object.entries(all).sort(([a],[b])=>a.localeCompare(b)).map(([k,v])=>`${enc(k)}=${enc(v)}`).join('&');
 const baseString=`${method}&${enc(base)}&${enc(pairs)}`,sig=crypto.createHmac('sha1',`${enc(secret)}&`).update(baseString).digest('base64');
 return `${base}?${new URLSearchParams({...all,oauth_signature:sig}).toString()}`;
}
export default async function handler(req,res){
 if(req.method!=='POST'){res.setHeader('Allow','POST');return res.status(405).json({error:'Method not allowed'});}
 const key=process.env.MASSIVE_MUSIC_CONSUMER_KEY||process.env.SEVENDIGITAL_CONSUMER_KEY,secret=process.env.MASSIVE_MUSIC_CONSUMER_SECRET||process.env.SEVENDIGITAL_CONSUMER_SECRET;
 if(!key||!secret)return res.status(503).json({configured:false});
 const trackId=Number(req.body?.trackId),seconds=Math.max(0,Math.min(60,Math.round(Number(req.body?.seconds)||0))),userId=String(req.body?.userId||'').slice(0,100);
 const country=String(req.headers['x-vercel-ip-country']||req.body?.country||'IL').toUpperCase();
 if(!trackId||!userId)return res.status(400).json({error:'trackId and userId are required'});
 const base='https://api.7digital.com/1.2/user/preview/log',url=signed(base,{country},key,secret,'POST');
 const body={logs:[{userId,country,trackId,dateTimePlayed:new Date().toISOString(),totalTimePlayed:seconds,userAgent:String(req.headers['user-agent']||'Web music quiz').slice(0,255),playMode:'online',playType:'view'}]};
 try{const r=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify(body)});if(!r.ok){const text=await r.text();return res.status(r.status).json({error:'Preview usage report failed',detail:text.slice(0,300)});}return res.status(200).json({ok:true});}catch(e){return res.status(502).json({error:'Preview usage report unavailable'});}
}
