import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {spawn} from 'node:child_process';
import ffmpegPath from 'ffmpeg-static';

export const config={maxDuration:60};

const SUPABASE_URL='https://uecdlqlwsrqmocbpgiwj.supabase.co';
const SUPABASE_KEY='sb_publishable_QJ_4e8-BHl0gOZifGqdv1w_doFwpTlb';
const BUCKET='voice-recordings';

function encPath(p){return String(p).split('/').map(encodeURIComponent).join('/')}
function run(args){return new Promise((resolve,reject)=>{const p=spawn(ffmpegPath,args);let err='';p.stderr.on('data',d=>{err+=d.toString();if(err.length>12000)err=err.slice(-12000)});p.on('error',reject);p.on('close',code=>code===0?resolve():reject(new Error(err||`ffmpeg exited ${code}`)))});}
function ymd(d){return d.toISOString().slice(0,10)}
function addDays(d,n){const x=new Date(d);x.setUTCDate(x.getUTCDate()+n);return x}
function israelNowParts(){const f=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Jerusalem',year:'numeric',month:'2-digit',day:'2-digit'});const today=f.format(new Date());return new Date(today+'T12:00:00Z')}
function bounds(period){const today=israelNowParts();if(period==='month'){
  let y=today.getUTCFullYear(),m=today.getUTCMonth();
  if(today.getUTCDate()<=2){m-=1;if(m<0){m=11;y-=1}}
  const start=new Date(Date.UTC(y,m,1)),end=new Date(Date.UTC(y,m+1,1));
  return {start:ymd(start),endExclusive:ymd(end),labelEnd:ymd(addDays(end,-1))};
 }
 const dow=today.getUTCDay();const start=addDays(today,-dow),end=addDays(start,7);
 return {start:ymd(start),endExclusive:ymd(end),labelEnd:ymd(addDays(end,-1))};
}
async function sb(pathname,{token,method='GET',body,headers={}}={}){const r=await fetch(SUPABASE_URL+pathname,{method,headers:{apikey:SUPABASE_KEY,Authorization:`Bearer ${token}`,...headers},body});if(!r.ok){const t=await r.text();throw new Error(`Supabase ${r.status}: ${t.slice(0,500)}`)}return r;}
async function signedUrl(token,storagePath){const r=await sb(`/storage/v1/object/sign/${BUCKET}/${encPath(storagePath)}`,{token,method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({expiresIn:600})});const j=await r.json();const u=j.signedURL||j.signedUrl;if(!u)throw new Error('Could not sign source audio');return u.startsWith('http')?u:SUPABASE_URL+'/storage/v1'+u;}
async function upload(token,storagePath,buf){await sb(`/storage/v1/object/${BUCKET}/${encPath(storagePath)}`,{token,method:'POST',headers:{'content-type':'audio/mpeg','x-upsert':'true'},body:buf});}

export default async function handler(req,res){
 if(req.method!=='POST'){res.setHeader('Allow','POST');return res.status(405).json({error:'Method not allowed'});}
 const auth=String(req.headers.authorization||'');if(!auth.startsWith('Bearer '))return res.status(401).json({error:'Unauthorized'});const token=auth.slice(7);
 const period=req.body?.period==='month'?'month':'week';
 let tmp;
 try{
  const ur=await sb('/auth/v1/user',{token});const user=await ur.json();if(!user?.id)return res.status(401).json({error:'Unauthorized'});
  const b=bounds(period);const start=b.start+'T00:00:00+03:00',end=b.endExclusive+'T00:00:00+03:00';
  const q=new URLSearchParams({select:'id,created_at,duration_before,audio_path_before,expression_media_path',user_id:`eq.${user.id}`,modality:'eq.voice',created_at:`gte.${start}`,order:'created_at.asc'});
  q.append('created_at',`lt.${end}`);
  const rr=await sb('/rest/v1/voice_entries?'+q.toString(),{token});let rows=await rr.json();rows=(rows||[]).filter(x=>x.audio_path_before||x.expression_media_path).slice(-6);
  if(!rows.length)return res.status(404).json({error:'No voice practices in this period'});
  tmp=await fs.mkdtemp(path.join(os.tmpdir(),'diary-montage-'));const segments=[];
  for(let i=0;i<rows.length;i++){
   const row=rows[i],source=row.audio_path_before||row.expression_media_path,url=await signedUrl(token,source);const fr=await fetch(url);if(!fr.ok)throw new Error('Could not download source audio');const input=path.join(tmp,`in-${i}`);await fs.writeFile(input,Buffer.from(await fr.arrayBuffer()));
   const dur=Math.max(1,Number(row.duration_before)||10),take=Math.min(12,dur),offset=dur>take?Math.max(0,(dur-take)*0.38):0,out=path.join(tmp,`seg-${i}.wav`);
   const fadeOut=Math.max(.2,take-.45);
   await run(['-hide_banner','-loglevel','error','-ss',String(offset),'-i',input,'-t',String(take),'-vn','-ac','1','-ar','44100','-af',`highpass=f=70,loudnorm=I=-18:TP=-2:LRA=7,afade=t=in:st=0:d=.25,afade=t=out:st=${fadeOut}:d=.45`,'-y',out]);segments.push(out);
  }
  const list=path.join(tmp,'concat.txt');await fs.writeFile(list,segments.map(x=>`file '${x.replaceAll("'","'\\''")}'`).join('\n'));
  const output=path.join(tmp,'week.mp3');await run(['-hide_banner','-loglevel','error','-f','concat','-safe','0','-i',list,'-c:a','libmp3lame','-b:a','128k','-y',output]);const buf=await fs.readFile(output);
  const storagePath=`${user.id}/highlights/${period}-${b.start}-${b.labelEnd}.mp3`;await upload(token,storagePath,buf);
  const payload={user_id:user.id,period_type:period,period_start:b.start,period_end:b.labelEnd,source_entry_ids:rows.map(x=>x.id),audio_path:storagePath,status:'ready',updated_at:new Date().toISOString()};
  const up=await sb('/rest/v1/diary_audio_highlights?on_conflict=user_id,period_type,period_start,period_end',{token,method:'POST',headers:{'content-type':'application/json',Prefer:'resolution=merge-duplicates,return=representation'},body:JSON.stringify(payload)});const saved=await up.json();
  return res.status(200).json({ok:true,highlight:Array.isArray(saved)?saved[0]:saved,sourceCount:rows.length});
 }catch(e){console.error(e);return res.status(500).json({error:'Audio montage failed',detail:String(e?.message||e).slice(0,900)});}finally{if(tmp)await fs.rm(tmp,{recursive:true,force:true}).catch(()=>{})}
}
