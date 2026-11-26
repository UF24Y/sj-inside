const escapeHtml=value=>String(value??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const format=value=>Number(value).toLocaleString('ko-KR');
const publicLink=(url,label)=>{
  try{const target=new URL(url);if(target.protocol==='https:' && target.hostname==='github.com')return `<a href="${escapeHtml(target.href)}" target="_blank" rel="noreferrer">${escapeHtml(label)} ↗</a>`;}catch{}
  return '';
};
function passageButtons(rows){
  return rows.map(row=>`<li><button class="board-link" type="button" data-passage="${escapeHtml(row.id)}">${escapeHtml(row.book)} · ${escapeHtml(row.title)}</button></li>`).join('');
}
export function mountLibrary(root,{api,pillars,openings,label}){
  const controller=new AbortController();
  const {signal}=controller;
  root.innerHTML=`<div class="flow source-library"><div class="backrow"><a href="#home">‹ 홈</a></div>
    <h1>사주 풀이 자료실</h1>
    <p>${escapeHtml(label)} · 연·월·일·시 순서로 ${pillars.map(p=>escapeHtml(p==='?'?'미확정':p)).join(' / ')}</p>
    <p><a href="#birth">다른 출생 정보로 보기</a></p>
    <div data-library-matches aria-live="polite">자료를 확인하는 중입니다…</div>
    <section class="panel"><h2>용어·문헌 검색</h2><form data-library-search><label>검색어 <input name="q" maxlength="60" placeholder="예: 정관, 오행, 궁통보감" required></label> <button class="button light">검색</button></form>
      <div data-library-results aria-live="polite"></div></section>
    <section data-library-passage hidden class="panel" tabindex="-1"></section></div>`;
  const el=selector=>root.querySelector(selector);
  const matches=el('[data-library-matches]'),results=el('[data-library-results]'),reader=el('[data-library-passage]');
  api('/api/library/match',{pillars,openings},signal).then(({entries,passages,counts,comparison,corpusCheck,examples})=>{
    if(signal.aborted)return;
    const reading=entries.map(e=>`<details><summary>${escapeHtml(e.label)}</summary><p>${escapeHtml(e.meaning||e.text)}</p>${publicLink(e.url,'해당 자료')}</details>`).join('');
    const same=comparison && comparison.narrativeRows ? ` 첫 12글자가 겹치는 요약은 같은 일주에서 ${format(comparison.sharedOpeningRows)}건이에요.`:'';
    matches.innerHTML=`<section class="panel"><h2>이 명식과 맞는 항목</h2>${reading||'<p>불러온 풀이 중 이 명식과 맞는 항목이 없습니다.</p>'}
      ${passages.length?`<h3>함께 읽을 문헌</h3><ul>${passageButtons(passages)}</ul>`:''}
      ${examples?.length?`<details><summary>같은 ${escapeHtml(pillars[2])}일주가 나오는 사례</summary><ul>${passageButtons(examples)}</ul></details>`:''}</section>
      <details class="panel"><summary>내 컴퓨터에 있는 자료</summary><p>한국어 일주 풀이 ${format(counts.days)}종 · 계절 조합 ${format(counts.months)}개 · 날과 시간 조합 ${format(counts.hours)}개</p>
      <p>원전 색인 ${format(counts.ancientEntries)}개 · 명리 문헌 ${format(counts.books)}종 · 한국어 번역 ${format(counts.translations)}개 · 명식 사례 ${format(counts.examples)}건</p>
      <p>비교용 한국어 합성 사례 ${format(counts.syntheticRows)}건</p>${comparison?`<p>같은 ${escapeHtml(pillars[2])}일주 사례 ${format(comparison.rows)}건에서 AI가 쓴 사주 요약의 평균은 ${format(comparison.meanNarrativeChars)}자예요.${same}</p>`:''}
      ${corpusCheck?.checked?`<p>지금 갤러리 본문 ${format(corpusCheck.checked)}편을 비교했어요. 첫 12글자가 같은 일주의 합성 요약과 일치한 글은 ${format(corpusCheck.same)}편이에요.</p>`:''}
      <p>합성 사례는 생성 문장의 분량과 반복을 비교하는 데 사용합니다.</p>
      <p>자료 제공 · <a href="https://github.com/leekyuhaiambox-ops/saju-platform" rel="noreferrer" target="_blank">Tarofortune</a> · <a href="https://github.com/lineeks/ancient-text-library" rel="noreferrer" target="_blank">lineeks</a> · <a href="https://github.com/kks-sajuproject/sajugame" rel="noreferrer" target="_blank">sajugame</a> · <a href="https://huggingface.co/datasets/rayraykim/Nemotron-Personas-Korea-Saju" rel="noreferrer" target="_blank">rayraykim · NVIDIA (CC BY 4.0)</a></p></details>`;
  }).catch(e=>{if(!signal.aborted)matches.textContent=e.message;});
  let searchId=0,readId=0;
  el('form').addEventListener('submit',async event=>{
    event.preventDefault();const id=++searchId;
    const query=new FormData(event.currentTarget).get('q').trim();
    if(!query)return;
    results.textContent='찾는 중입니다…';
    try{
      const {passages,terms,catalog}=await api('/api/library/search?q='+encodeURIComponent(query),undefined,signal);
      if(id!==searchId||signal.aborted)return;
      results.innerHTML=terms.map(t=>`<details><summary>${escapeHtml(t.term)}</summary><p>${escapeHtml(t.text)}</p>${publicLink(t.url,'해당 자료')}</details>`).join('')+
        (passages.length?`<ul>${passageButtons(passages)}</ul>`:'')+
        (catalog?.length?`<h3>원전 색인</h3><ul>${catalog.map(r=>`<li>${publicLink(r.url,r.book+' · '+r.title)}</li>`).join('')}</ul>`:'')||'<p>일치하는 용어나 문헌 제목이 없습니다.</p>';
    }catch(e){if(id===searchId&&!signal.aborted)results.textContent=e.message;}
  },{signal});
  root.addEventListener('click',async event=>{
    const button=event.target.closest('[data-passage]');if(!button)return;
    const id=++readId;reader.hidden=false;reader.textContent='구절을 여는 중입니다…';
    try{
      const row=await api('/api/library/passage?id='+encodeURIComponent(button.dataset.passage),undefined,signal);
      if(id!==readId||signal.aborted)return;
      reader.innerHTML=`<h2>${escapeHtml(row.book)}</h2><h3>${escapeHtml(row.title)}</h3><p class="library-passage">${escapeHtml(row.text)}</p>`;reader.focus();reader.scrollIntoView({block:'start'});
    }catch(e){if(id===readId&&!signal.aborted)reader.textContent=e.message;}
  },{signal});
  return ()=>controller.abort();
}
