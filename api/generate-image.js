export default async function handler(req,res){
  if(req.method==='GET'){
    return res.status(200).json({ok:true,service:'ai-image-generator'});
  }
  if(req.method!=='POST'){
    res.setHeader('Allow','GET, POST');
    return res.status(405).json({error:'Method not allowed'});
  }
  const token=process.env.AI_GATEWAY_API_KEY||process.env.VERCEL_OIDC_TOKEN;
  if(!token)return res.status(503).json({error:'AI generation is not configured on this deployment.'});
  const topic=String(req.body?.topic||'').trim().slice(0,500);
  const style=String(req.body?.style||'cinematic').trim();
  if(!topic)return res.status(400).json({error:'Напиши тему для картинки.'});
  const styles={
    surreal:'surreal poetic painting, dreamlike visual metaphor, unexpected scale and composition, rich painterly texture, imaginative but emotionally coherent',
    cinematic:'cinematic storybook scene, atmospheric light, expressive composition, tactile details, emotionally evocative, sophisticated color harmony',
    abstract:'abstract expressive painting inspired by contemporary art, gesture, layered texture, rhythm, movement, strong composition, no literal text'
  };
  const styleText=styles[style]||styles.cinematic;
  const prompt=`Create a square artwork to inspire a musical improvisation. Theme: ${topic}. Style: ${styleText}. Make it visually rich, open-ended and suggestive rather than explanatory. No captions, no typography, no logos, no watermark. The image should invite a child or adult to imagine sound, movement, rhythm and a story.`;
  try{
    const r=await fetch('https://ai-gateway.vercel.sh/v1/images/generations',{
      method:'POST',
      headers:{'Authorization':`Bearer ${token}`,'Content-Type':'application/json'},
      body:JSON.stringify({model:'openai/gpt-image-2',prompt,n:1,size:'1024x1024',quality:'medium',response_format:'b64_json'})
    });
    const data=await r.json().catch(()=>({}));
    if(!r.ok)return res.status(r.status).json({error:data?.error?.message||data?.error||'Не удалось сгенерировать картинку.'});
    const item=data?.data?.[0];
    if(item?.b64_json)return res.status(200).json({image:`data:image/png;base64,${item.b64_json}`});
    if(item?.url)return res.status(200).json({url:item.url});
    return res.status(502).json({error:'Генератор не вернул изображение.'});
  }catch(e){
    return res.status(500).json({error:'Ошибка соединения с генератором изображений.'});
  }
}
