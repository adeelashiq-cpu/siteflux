const $ = (id) => document.getElementById(id);
const esc = (s='') => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const toast = $('toast');
function showToast(msg='Copied'){ toast.textContent=msg; toast.classList.add('show'); setTimeout(()=>toast.classList.remove('show'),1400); }

$('year').textContent = new Date().getFullYear();

function updateCounts(){
  $('titleCount').textContent = `${$('metaTitle').value.length}/60`;
  $('descCount').textContent = `${$('metaDesc').value.length}/160`;
}
$('metaTitle').addEventListener('input', updateCounts);
$('metaDesc').addEventListener('input', updateCounts);

function generateMeta(){
  const title = $('metaTitle').value.trim();
  const desc = $('metaDesc').value.trim();
  const canonical = $('canonicalUrl').value.trim();
  const lines = [];
  if(title) lines.push(`<title>${esc(title)}</title>`);
  if(desc) lines.push(`<meta name="description" content="${esc(desc)}">`);
  if(canonical) lines.push(`<link rel="canonical" href="${esc(canonical)}">`);
  if(title) lines.push(`<meta property="og:title" content="${esc(title)}">`);
  if(desc) lines.push(`<meta property="og:description" content="${esc(desc)}">`);
  if(canonical) lines.push(`<meta property="og:url" content="${esc(canonical)}">`);
  lines.push(`<meta property="og:type" content="website">`);
  $('metaOutput').textContent = lines.length ? lines.join('\n') : '<!-- Add a title, description or canonical URL -->';
}

function updateSerp(){
  $('serpTitleOut').textContent = $('serpTitle').value.trim() || 'Your page title';
  $('serpUrlOut').textContent = $('serpUrl').value.trim() || 'https://example.com/your-page';
  $('serpDescOut').textContent = $('serpDesc').value.trim() || 'Your meta description will appear here as a simplified preview.';
}
['serpTitle','serpUrl','serpDesc'].forEach(id => $(id).addEventListener('input', updateSerp));

function generateRobots(){
  const a=$('robotAgent').value.trim()||'*', d=$('robotDisallow').value.trim(), al=$('robotAllow').value.trim(), sm=$('robotSitemap').value.trim();
  let out=`User-agent: ${a}\n`;
  out += `Disallow: ${d}\n`;
  if(al) out += `Allow: ${al}\n`;
  if(sm) out += `Sitemap: ${sm}\n`;
  $('robotsOutput').textContent=out.trim();
}

function generateSchema(){
  const data={"@context":"https://schema.org","@type":$('schemaType').value};
  const map={name:'schemaName',url:'schemaUrl',logo:'schemaLogo',telephone:'schemaPhone'};
  Object.entries(map).forEach(([key,id])=>{const v=$(id).value.trim(); if(v) data[key]=v;});
  $('schemaOutput').textContent = JSON.stringify(data,null,2);
}

function generateUtm(){
  const base=$('utmUrl').value.trim();
  if(!base){ $('utmOutput').textContent='Enter a website URL first.'; return; }
  try{
    const u=new URL(base.startsWith('http')?base:`https://${base}`);
    const pairs=[['utm_source','utmSource'],['utm_medium','utmMedium'],['utm_campaign','utmCampaign'],['utm_content','utmContent']];
    pairs.forEach(([k,id])=>{const v=$(id).value.trim(); if(v) u.searchParams.set(k,v)});
    $('utmOutput').textContent=u.toString();
  }catch{ $('utmOutput').textContent='Please enter a valid URL.'; }
}

document.addEventListener('click', async (e)=>{
  const act=e.target.dataset.action;
  if(act==='generate-meta') generateMeta();
  if(act==='generate-robots') generateRobots();
  if(act==='generate-schema') generateSchema();
  if(act==='generate-utm') generateUtm();
  const copyId=e.target.dataset.copy;
  if(copyId){
    const text=$(copyId).textContent;
    try{ await navigator.clipboard.writeText(text); showToast('Copied to clipboard'); }
    catch{ showToast('Copy failed'); }
  }
});

const checklistItems=[
  'Check page titles and meta descriptions',
  'Verify canonical URLs',
  'Submit or verify XML sitemap',
  'Review robots.txt rules',
  'Test forms and CTA buttons',
  'Check responsive layout on mobile',
  'Compress large images',
  'Add image alt text',
  'Verify analytics tracking',
  'Test 404 page and redirects',
  'Run accessibility checks',
  'Check HTTPS and security headers'
];
const checklist=$('checklist');
function loadState(){ try{return JSON.parse(localStorage.getItem('weblaunch-checklist')||'[]')}catch{return []} }
function saveState(state){localStorage.setItem('weblaunch-checklist',JSON.stringify(state));}
function renderChecklist(){
  const state=loadState(); checklist.innerHTML='';
  checklistItems.forEach((item,i)=>{
    const div=document.createElement('div'); div.className='check-item';
    const input=document.createElement('input'); input.type='checkbox'; input.id=`c${i}`; input.checked=!!state[i];
    const label=document.createElement('label'); label.htmlFor=`c${i}`; label.textContent=item;
    input.addEventListener('change',()=>{const s=loadState(); s[i]=input.checked; saveState(s); updateProgress();});
    div.append(input,label); checklist.append(div);
  }); updateProgress();
}
function updateProgress(){
  const state=loadState(); const done=checklistItems.filter((_,i)=>state[i]).length; const p=Math.round(done/checklistItems.length*100);
  $('progressText').textContent=`${done} of ${checklistItems.length} complete`;
  $('progressPercent').textContent=`${p}%`; $('progressBar').style.width=`${p}%`;
}
$('resetChecklist').addEventListener('click',()=>{localStorage.removeItem('weblaunch-checklist'); renderChecklist(); showToast('Checklist reset');});
renderChecklist();
