import { MAX_FILE_MB, SUMMARY_PROMPT, getEvidenceTopic, reviewFile, reviewText } from './imports.js';
import { icon } from './icons.js';

const sources = {chatgpt:'ChatGPT 대화', takeout:'Google Takeout', manual:'직접 쓴 요약'};
const categories = {subscriptions:'구독 채널', likes:'좋아요 표시한 동영상', playlists:'내 재생목록'};

export function newRecordState() {
  // Only broad, count-bearing summaries survive moving between steps in this tab.
  return {reviews:{}, selected:[], mode:'ai'};
}

function element(tag, value, className) {
  const el = document.createElement(tag);
  if (value !== undefined) el.textContent = value;
  if (className) el.className = className;
  return el;
}

function sourceHeader(iconName, title, detail) {
  return `<summary><span class="record-icon">${icon(iconName,20)}</span>
    <span class="record-source-title"><strong>${title}</strong><small>${detail}</small></span>
    <span class="record-chevron">${icon('arrow',16)}</span></summary>`;
}

function filePanel(source, iconName, detail, instructions, helpUrl) {
  const accept = source === 'takeout' ? '.json,.html,.htm' : '.json';
  return `<details class="record-source">
    ${sourceHeader(iconName, sources[source], detail)}
    <div class="record-source-body"><p>${instructions}
      <a href="${helpUrl}" target="_blank" rel="noreferrer">내보내기 안내 ↗</a></p>
      <label class="record-file-label">${icon('upload',17)} 파일 선택
        <input type="file" data-file="${source}" accept="${accept}" aria-label="${sources[source]} 파일 선택">
      </label><small class="record-file-size">압축 해제 후 파일당 최대 ${MAX_FILE_MB}MB</small>
      <p data-feedback="${source}" class="record-feedback" role="status"></p></div>
  </details>`;
}

function googlePanel(config) {
  return `<details class="record-source">
    ${sourceHeader('play','YouTube 연결',config.google ? '내 라이브러리 비공개 열람' : 'Google 연결 설정 필요')}
    <div class="record-source-body">
      <p>YouTube에서 읽은 제목은 이 화면에서 확인합니다. 게시글에 시청·검색 기록을 쓰려면 Takeout 파일을 가져오세요.</p>
      <p><a href="https://www.youtube.com/t/terms" target="_blank" rel="noreferrer">YouTube 이용약관</a> · <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer">Google 개인정보처리방침</a></p>
      <fieldset class="record-categories" ${config.google ? '' : 'disabled'}>
        <legend>읽을 자료 선택</legend>
        ${Object.entries(categories).map(([value,label])=>`<label><input type="checkbox" name="yt-category" value="${value}">${label}</label>`).join('')}
      </fieldset>
      <label class="record-check"><input type="checkbox" data-google-consent ${config.google ? '' : 'disabled'}>
        <span>선택한 목록을 읽기 전용으로 한 번 가져오는 데 동의합니다. 종류별 최대 12개를 읽고 권한 해제를 요청합니다.</span>
      </label>
      <div class="record-inline"><button type="button" class="button light" data-google-start disabled>Google 계정 연결</button>
        <button type="button" class="record-link" data-google-cancel hidden>연결 취소</button></div>
      ${config.google ? '' : '<p class="muted"><a class="record-link" href="#connect">Google 연결 설정 열기</a></p>'}
      <p data-feedback="google" class="record-feedback" role="status"></p>
      <div data-google-results></div>
    </div></details>`;
}

export function mountRecords(root, {config, state, api, generate, onBack, openPrivacy}) {
  const q = s => root.querySelector(s);
  const qa = s => [...root.querySelectorAll(s)];
  const abort = new AbortController();
  const listen = (el, type, fn) => el.addEventListener(type, fn, {signal:abort.signal});
  let active = true, generating = false, googleBusy = false;
  const revisions = {chatgpt:0, takeout:0};
  const pendingReads = new Set();
  const checked = new Set(state.selected);
  root.innerHTML = `<div class="records-step">
    <section class="panel records-panel">
      <h2>기록 가져오기</h2>
      <p class="record-intro">ChatGPT 대화와 메모리는 자동으로 연결되지 않습니다. 내보낸 자료나 직접 쓴 요약을 선택하세요.</p>
      <div class="record-sources">
        ${filePanel('chatgpt','dialogue','내보낸 대화 JSON', 'ChatGPT 설정의 데이터 제어에서 내보낸 ZIP을 풀고 conversations.json 또는 번호가 붙은 대화 JSON을 고르세요. 본인이 쓴 메시지만 읽습니다.', 'https://help.openai.com/en/articles/7260999')}
        ${filePanel('takeout','upload','내 활동의 시청·검색 기록', 'Google Takeout에서 YouTube 기록이나 내 활동을 선택하세요. 압축을 풀고 시청·검색 기록 JSON 또는 활동 HTML 파일 하나를 고르세요.', 'https://support.google.com/accounts/answer/3024190?hl=ko')}
        <details class="record-source">
          ${sourceHeader('pen','요약 붙여넣기','직접 쓰거나 ChatGPT에 물어본 관심사')}
          <div class="record-source-body">
            <label for="record-manual">내가 직접 언급한 관심사</label>
            <textarea id="record-manual" rows="3" maxlength="12000" placeholder="영상 편집을 독학했다.&#10;음악과 디자인에 관심이 있다."></textarea>
            <div class="record-inline"><button type="button" class="button light" data-read-manual>요약 검토</button>
              <button type="button" class="record-link" data-prompt>분석용 프롬프트 복사</button></div>
            <div data-prompt-fallback hidden><label for="record-prompt">ChatGPT에 붙여넣을 프롬프트</label>
              <textarea id="record-prompt" rows="4" readonly></textarea></div>
            <p data-feedback="manual" class="record-feedback" role="status"></p>
          </div></details>
        ${googlePanel(config)}
      </div>
      <p class="record-privacy-note">${icon('lock',15)} 파일은 브라우저에서 읽습니다. 이름과 원문을 빼고 정해진 주제와 건수만 추립니다.</p>
    </section>
    <section class="panel records-panel" data-review-section hidden>
      <h2>게시글에 쓸 주제</h2><p class="record-intro">글로 만들고 싶은 주제를 최대 24개까지 고르세요.</p>
      <div data-review></div>
    </section>
    <section class="panel records-panel"><h2>게시글 생성 방식</h2>
      <fieldset class="record-modes"><legend class="record-sr">해석 방식 선택</legend>
        <label class="record-mode"><input type="radio" name="reading-mode" value="ai" ${config.ai ? '' : 'disabled'}><span><strong>OpenAI 해석</strong><small>${config.ai ? '6개 주제에 3편씩 작성해요. API 요청은 6회이며, 기록을 고르면 1회 추가돼요. 요청별 이용료가 발생할 수 있어요.' : '서버에 OpenAI API 키를 설정하면 이용할 수 있어요.'}</small></span></label>
        <label class="record-mode"><input type="radio" name="reading-mode" value="local"><span><strong>로컬 해석</strong><small>내 컴퓨터에서 명식과 고른 주제로 짧은 미리보기를 만듭니다.</small></span></label>
      </fieldset>
      ${config.ai ? '' : '<p><a class="record-link" href="#connect">OpenAI 키 설정</a></p>'}
      <label class="record-check" data-ai-consent-wrap hidden><input type="checkbox" data-ai-consent>
        <span>네 기둥, 계산의 불확실성, 선택한 요약을 OpenAI에 전송해 분석하는 데 동의합니다.</span></label>
      <div class="record-terms"><span>오락과 자기성찰을 위한 해석입니다.</span>
        <button type="button" class="record-link" data-record-privacy>개인정보·삭제</button></div>
    </section>
    <div class="record-actions">
      <button type="button" class="button light" data-record-back>이전 단계</button>
      <button type="button" class="button dark" data-generate>게시글 만들기 ${icon('arrow',16)}</button></div>
    <p class="record-feedback" data-feedback="generate" role="status"></p>
  </div>`;

  function feedback(source, text) {
    q('[data-feedback="' + source + '"]').textContent = text;
  }
  function syncSelection() {
    state.selected = [...checked];
  }
  function dropReview(source) {
    for (const item of state.reviews[source]?.candidates || []) checked.delete(item.id);
    delete state.reviews[source];
    syncSelection();
    q('[data-ai-consent]').checked=false;
  }
  function drawReview() {
    const target = q('[data-review]');
    target.replaceChildren();
    q('[data-review-section]').hidden = !Object.keys(state.reviews).length;
    for (const [source, review] of Object.entries(state.reviews)) {
      const group = element('div', undefined, 'record-review-group');
      const line = element('div', undefined, 'record-review-header');
      const title = element('h3', source==='manual' && state.sampleTopics?'샘플에 제공한 설명 요약':sources[source]);
      const remove = element('button','자료 지우기','record-link');
      remove.type = 'button';
      remove.dataset.removeSource = source;
      remove.setAttribute('aria-label',sources[source] + ' 자료 지우기');
      line.append(title,remove);
      group.append(line, element('p', '읽은 항목 ' + review.scanned + '건 · 민감하거나 긴 항목 제외 ' + review.excluded + '건 · 주제 미분류 ' + review.unclassified + '건', 'record-counts'));
      if (!review.candidates.length) group.append(element('p','확인된 주제가 없습니다. 짧은 관심사 요약을 직접 적어 보세요.','muted'));
      for (const item of review.candidates) {
        const opt = element('label',undefined,'record-candidate');
        const box = document.createElement('input');
        box.type='checkbox'; box.value=item.id; box.dataset.evidence=''; box.checked=checked.has(item.id);
        const copy = element('span');
        copy.append(element('strong',getEvidenceTopic(item)), element('small',item.text));
        opt.append(box,copy); group.append(opt);
      }
      target.append(group);
    }
  }
  function drawMode() {
    q('input[name="reading-mode"][value="' + state.mode + '"]').checked = true;
    q('[data-ai-consent-wrap]').hidden = state.mode !== 'ai' || !config.ai;
    q('[data-generate]').disabled = generating || pendingReads.size > 0 || googleBusy || (state.mode==='ai' && (!config.ai || !q('[data-ai-consent]').checked));
    q('[data-record-back]').disabled = generating;
  }
  function acceptReview(source, result) {
    dropReview(source);
    if(source==='manual')state.sampleTopics=false;
    state.reviews[source] = result;
    drawReview();
    drawMode();
    feedback(source, result.candidates.length ? '검토가 끝났습니다. 아래에서 분석에 쓸 주제를 선택해 주세요.' : '읽을 수 있는 주제가 없습니다. 아래에서 제외된 건수를 확인해 주세요.');
    feedback('generate','');
  }
  for (const input of qa('[data-file]')) listen(input,'change', async () => {
    const file = input.files[0], source = input.dataset.file;
    if (!file) return;
    const revision = ++revisions[source];
    pendingReads.add(source); drawMode();
    dropReview(source); drawReview(); input.value='';
    feedback(source,'이 기기에서 파일을 읽고 있습니다…');
    try {
      const result = await reviewFile(file,source);
      if (active && revisions[source]===revision) acceptReview(source,result);
    } catch (e) {
      if (active && revisions[source]===revision) feedback(source,e.message);
    } finally {
      if (active && revisions[source]===revision) {pendingReads.delete(source);drawMode();}
    }
  });
  listen(q('[data-read-manual]'),'click',() => {
    const input = q('#record-manual');
    try {
      const result = reviewText(input.value,'manual');
      input.value='';
      acceptReview('manual',result);
    } catch(e) {feedback('manual',e.message);}
  });
  listen(q('[data-prompt]'),'click',async () => {
    try {
      await navigator.clipboard.writeText(SUMMARY_PROMPT);
      if (active) feedback('manual','프롬프트를 복사했습니다. 분석할 ChatGPT 대화에 붙여넣어 주세요.');
    } catch {
      if (!active) return;
      q('[data-prompt-fallback]').hidden=false;
      const input=q('#record-prompt'); input.value=SUMMARY_PROMPT;input.focus();input.select();
      feedback('manual','선택된 프롬프트를 복사해 주세요.');
    }
  });
  listen(q('[data-review]'),'change', e => {
    const box = e.target.closest('[data-evidence]');
    if (!box) return;
    if (box.checked && checked.size>=24) {
      box.checked=false;feedback('generate','최대 24개까지 선택해 주세요.'); return;
    }
    if (box.checked) checked.add(box.value); else checked.delete(box.value);
    syncSelection();feedback('generate','');
    q('[data-ai-consent]').checked=false;drawMode();
  });
  listen(q('[data-review]'),'click',e=>{
    const button=e.target.closest('[data-remove-source]');
    if (!button) return;
    const source=button.dataset.removeSource;
    dropReview(source);drawReview();feedback(source,'자료를 지웠습니다.');
    q('[data-ai-consent]').checked=false;drawMode();
  });

  const library=bindGoogleLibrary(root, {
    config, api, isDisabled:()=>generating, onBusyChange:busy=>{googleBusy=busy; drawMode();}
  });
  for (const radio of qa('input[name="reading-mode"]')) listen(radio,'change',()=>{
    state.mode=radio.value; q('[data-ai-consent]').checked=false; drawMode();feedback('generate','');
  });
  listen(q('[data-ai-consent]'),'change',drawMode);
  listen(q('[data-record-privacy]'),'click',openPrivacy);
  listen(q('[data-record-back]'),'click',onBack);
  listen(q('[data-generate]'),'click',async()=>{
    const aiConsent=state.mode==='ai' && q('[data-ai-consent]').checked;
    if (generating || googleBusy || pendingReads.size || (state.mode==='ai' && (!config.ai || !aiConsent))) return;
    const evidence=Object.values(state.reviews).flatMap(r=>r.candidates.filter(c=>checked.has(c.id)));
    generating=true;library.refresh();
    feedback('generate',state.mode==='ai'?'장문 게시글과 댓글을 작성하고 있습니다. 몇 분 정도 걸릴 수 있어요.':'선택한 주제로 게시글을 작성하고 있습니다…');
    try {await generate({evidence,mode:state.mode,aiConsent,signal:abort.signal});}
    catch(e) {if (active) feedback('generate',e.message || '게시글을 만들지 못했습니다. 다시 시도해 주세요.');}
    finally {if (active) {generating=false;library.refresh();}}
  });
  drawReview();library.refresh();
  return function cleanup() {
    active=false;abort.abort();
    library.dispose();
    const input=q('#record-manual'); if (input) input.value='';
  };
}

// The setup page and the report workflow both use the same single-read OAuth flow.
function bindGoogleLibrary(root,{config,api,isDisabled=()=>false,onBusyChange=()=>{}}) {
  const q=selector=>root.querySelector(selector);
  const qa=selector=>[...root.querySelectorAll(selector)];
  const abort=new AbortController();
  const listen=(el,event,fn)=>el.addEventListener(event,fn,{signal:abort.signal});
  const feedback=(_,text)=>{q('[data-feedback="google"]').textContent=text;};
  let oauth=null, active=true;
  const googleStart=q('[data-google-start]');
  const googleCancel=q('[data-google-cancel]');
  const categoryBoxes=qa('input[name="yt-category"]');
  const googleConsent=q('[data-google-consent]');
  const chosenCategories=()=>categoryBoxes.filter(x=>x.checked).map(x=>x.value);
  function drawGoogle() {
    googleStart.disabled=!config.google || Boolean(oauth) || isDisabled() || !googleConsent.checked || !chosenCategories().length;
    googleCancel.hidden=!oauth;
    for (const box of categoryBoxes) box.disabled=!config.google || Boolean(oauth);
    googleConsent.disabled=!config.google || Boolean(oauth);
    onBusyChange(Boolean(oauth));
  }
  for (const box of [...categoryBoxes,googleConsent]) listen(box,'change',drawGoogle);
  function stopOauth() {
    if (!oauth) return;
    clearTimeout(oauth.timer);
    try { oauth.popup.close(); } catch { /* Closed by the user or browser. */ }
    oauth=null;
  }
  function showGoogle(result) {
    const target=q('[data-google-results]');
    target.replaceChildren();
    if (result.revokeWarning) {
      const note=element('p','Google 권한 해제를 확인할 수 없습니다. ');
      const link=element('a','Google 계정에서 연결 관리 ↗');
      link.href='https://myaccount.google.com/connections';link.target='_blank';link.rel='noreferrer';
      note.append(link);target.append(note);
    }
    if (result.status!=='ready') return;
    const rows=result.rows || [];
    if (!rows.length) {target.append(element('p','표시할 자료가 없습니다.','muted'));return;}
    const list=element('ul',undefined,'record-yt-list');
    for (const row of rows) {
      const li=element('li');
      li.append(element('small',categories[row.category] || 'YouTube'));
      if (typeof row.url==='string' && row.url.startsWith('https://www.youtube.com/')) {
        const link=element('a',row.text);link.href=row.url;link.target='_blank';link.rel='noreferrer';
        li.append(link);
      } else li.append(element('span',row.text));
      list.append(li);
    }
    const erase=element('button','열람한 목록 지우기','record-link');erase.type='button';
    listen(erase,'click',()=>{list.remove();erase.remove();feedback('google','이 화면에서 열람한 목록을 지웠습니다.');});
    target.append(list,erase);
  }
  async function poll(attempt) {
    if (!active || oauth!==attempt || attempt.cancelled) return;
    try {
      const result=await api('/api/google/result',{});
      if (!active || oauth!==attempt || attempt.cancelled) return;
      if (result.status==='pending') {
        // Some sign-in screens isolate the popup, making Window.closed unreliable.
        if (Date.now()-attempt.started>600000) {
          await cancelGoogle('연결 시간이 지났습니다. 다시 연결할 수 있어요.');
          return;
        }
        attempt.timer=setTimeout(()=>poll(attempt),1400);
        return;
      }
      stopOauth();drawGoogle();showGoogle(result);
      feedback('google', result.status==='ready' ? '비공개 열람용 목록을 가져왔습니다.' :
        (result.status==='expired' ? '연결이 만료됐습니다. 다시 연결해 주세요.' : '연결을 마치지 못했습니다. 권한을 확인한 뒤 다시 연결해 주세요.'));
    } catch {
      if (active && oauth===attempt) await cancelGoogle('연결 상태를 확인하지 못했습니다. 다시 연결해 주세요.');
    }
  }
  async function cancelGoogle(message) {
    const attempt=oauth;
    if (!attempt || attempt.cancelled) return;
    clearTimeout(attempt.timer);
    attempt.cancelled=true;
    try {attempt.popup.close();} catch {}
    feedback('google','연결을 취소하고 있습니다…');
    try {
      await attempt.start;
      await api('/api/erase',{});
    } catch { message+=' 서버의 임시 연결은 최대 10분 후 만료됩니다.'; }
    if (!active || oauth!==attempt) return;
    stopOauth();drawGoogle();feedback('google',message);
  }
  listen(googleCancel,'click',()=>cancelGoogle('연결을 취소했습니다.'));
  listen(googleStart,'click',async () => {
    if (oauth || !config.google || !googleConsent.checked || !chosenCategories().length) return;
    const popup=window.open('about:blank','_blank','popup,width=540,height=700');
    if (!popup) {feedback('google','팝업을 허용한 뒤 다시 연결해 주세요.');return;}
    popup.opener=null;
    const attempt={popup,started:Date.now(),cancelled:false,timer:null,start:null};
    oauth=attempt;drawGoogle();q('[data-google-results]').replaceChildren();
    feedback('google','Google 창에서 계정과 읽기 권한을 확인해 주세요.');
    try {
      attempt.start=api('/api/google/start',{categories:chosenCategories(),consent:true});
      const {url}=await attempt.start;
      if (!active || oauth!==attempt || attempt.cancelled) return;
      const dest=new URL(url);
      if (dest.origin!=='https://accounts.google.com') throw Error('Google 연결 주소를 확인할 수 없습니다.');
      popup.location.replace(dest.href);
      attempt.timer=setTimeout(()=>poll(attempt),1000);
    } catch(e) {
      if (!active || oauth!==attempt || attempt.cancelled) return;
      stopOauth();drawGoogle();feedback('google',e.message);
    }
  });
  drawGoogle();
  return {refresh:drawGoogle,dispose(){
    active=false;abort.abort();
    if (oauth && !oauth.cancelled) {
      const pending=oauth.start;
      Promise.resolve(pending).then(()=>api('/api/erase',{})).catch(()=>{});
    }
    stopOauth();
    q('[data-google-results]')?.replaceChildren();
  }};
}

export function mountYoutube(root,{config,api}) {
  root.innerHTML=googlePanel(config);
  root.querySelector('details').open=true;
  const library=bindGoogleLibrary(root,{config,api});
  return library.dispose;
}
