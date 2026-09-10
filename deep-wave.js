// Adds visual depth to the existing real-time microphone waveform without changing recording logic.
const style=document.createElement('style');
style.textContent=`
#voiceWaveform{position:relative;filter:drop-shadow(0 5px 12px rgba(50,24,55,.18));transition:filter .25s ease,opacity .25s ease}
body[data-diary-theme="plum"] #voiceWaveform{filter:drop-shadow(0 5px 13px rgba(48,20,53,.28)) drop-shadow(0 0 16px rgba(115,76,137,.18)) saturate(1.08)}
`;
document.head.appendChild(style);

// The recorder creates its canvas lazily. Once it appears, overlay two softly shifted,
// translucent copies. The source canvas remains the precise microphone signal.
let source=null,overlay=null,frame=null;
function attach(){
  const canvas=document.getElementById('voiceWaveform');
  if(!canvas||canvas===source)return;
  source=canvas;
  overlay=document.createElement('canvas');
  overlay.width=canvas.width;overlay.height=canvas.height;
  overlay.setAttribute('aria-hidden','true');
  overlay.style.cssText='position:absolute;inset:0;width:100%;height:100%;pointer-events:none;background:transparent;border:0;box-shadow:none;opacity:.72;mix-blend-mode:multiply';
  const wrap=document.createElement('div');
  wrap.className='deep-wave-wrap';
  wrap.style.cssText='position:relative;width:100%;margin:14px 0 10px;overflow:visible';
  canvas.parentNode.insertBefore(wrap,canvas);wrap.append(canvas,overlay);
  canvas.style.margin='0';
  const paint=()=>{
    frame=requestAnimationFrame(paint);
    const visible=getComputedStyle(canvas).display!=='none';
    wrap.style.display=visible?'block':'none';
    if(!visible)return;
    const g=overlay.getContext('2d');g.clearRect(0,0,overlay.width,overlay.height);
    const theme=document.body.dataset.diaryTheme||'plum';
    if(theme!=='plum'){overlay.style.opacity='.22';g.globalAlpha=.18;g.filter='hue-rotate(8deg) blur(1px)';g.drawImage(canvas,0,2);g.filter='none';g.globalAlpha=1;return}
    overlay.style.opacity='.78';
    // Deep violet shadow layer.
    g.globalCompositeOperation='source-over';g.globalAlpha=.34;g.filter='hue-rotate(28deg) saturate(1.45) brightness(.68) blur(2.2px)';g.drawImage(canvas,0,4);
    // Cool lilac upper layer gives the louder peaks a luminous edge.
    g.globalAlpha=.28;g.filter='hue-rotate(54deg) saturate(1.25) brightness(1.18) blur(.6px)';g.drawImage(canvas,0,-2);
    // Wine-colored body keeps the waveform connected to the plum interface.
    g.globalAlpha=.22;g.filter='hue-rotate(-10deg) saturate(1.35) brightness(.9)';g.drawImage(canvas,0,1);
    g.filter='none';g.globalAlpha=1;g.globalCompositeOperation='source-over';
  };
  paint();
}
const observer=new MutationObserver(attach);observer.observe(document.body,{childList:true,subtree:true});attach();
window.addEventListener('pagehide',()=>{if(frame)cancelAnimationFrame(frame)},{once:true});
