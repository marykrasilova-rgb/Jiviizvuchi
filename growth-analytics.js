import {createClient} from 'https://esm.sh/@supabase/supabase-js@2.57.4';
const s=createClient('https://uecdlqlwsrqmocbpgiwj.supabase.co','sb_publishable_QJ_4e8-BHl0gOZifGqdv1w_doFwpTlb',{auth:{persistSession:false}});
const q=new URLSearchParams(location.search);let referrerHost=null;try{referrerHost=document.referrer?new URL(document.referrer).hostname:null}catch{}
const payload={session_id:localStorage.getItem('mariaGrowthSession')||crypto.randomUUID(),page:document.body.dataset.page||location.pathname,source:q.get('utm_source')||q.get('src')||null,medium:q.get('utm_medium')||null,campaign:q.get('utm_campaign')||null,referrer_host:referrerHost,language:document.documentElement.lang||null};localStorage.setItem('mariaGrowthSession',payload.session_id);
const track=(event_name,extra={})=>s.from('marketing_events').insert({...payload,event_name,metadata:extra}).then(()=>{}).catch(()=>{});
track('landing_view');
document.addEventListener('click',e=>{const a=e.target.closest('a[data-track]');if(a)track(a.dataset.track,{href:a.getAttribute('href'),label:(a.textContent||'').trim().slice(0,120)})});