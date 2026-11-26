import {icon} from './icons.js';

const providers = ['openai','google'];
const flag = {openai:'ai', google:'google'};
const maxFileBytes = 64 * 1024;

export function readGoogleWebClient(contents, redirectUri) {
  let data;
  try {
    data = JSON.parse(contents);
  } catch {
    throw Error('Google Cloud에서 내려받은 OAuth 클라이언트 JSON 파일을 선택해 주세요.');
  }
  const web = data?.web;
  if (!web || typeof web.client_id !== 'string' || !web.client_id.trim() ||
      typeof web.client_secret !== 'string' || !web.client_secret.trim()) {
    throw Error('웹 애플리케이션용 OAuth 클라이언트의 ID와 보안 비밀이 들어 있는 파일을 선택해 주세요.');
  }
  if (!Array.isArray(web.redirect_uris) || !web.redirect_uris.includes(redirectUri)) {
    throw Error('파일에 현재 앱의 리디렉션 URI가 없습니다. 아래 주소를 Google Cloud에 등록하고 파일을 다시 받거나 값을 직접 입력해 주세요.');
  }
  return {clientId:web.client_id.trim(), clientSecret:web.client_secret.trim()};
}

function secretField(name, label) {
  return '<label class="field">' + label +
    '<input type="password" name="' + name + '" required autocomplete="off" spellcheck="false" autocapitalize="none"></label>';
}

function providerPanel(provider) {
  const ai = provider === 'openai';
  return `<section class="panel birthpanel">
    <div class="paneltop"><h2>${icon(ai ? 'star' : 'play',21)} ${ai ? 'OpenAI 해석' : 'YouTube 연결'}</h2>
      <span class="tag ghost" data-state="${provider}"></span></div>
    <p class="record-intro">${ai
      ? '직접 고른 주제로 게시글을 생성합니다. 전송에 동의하고 게시글을 만들면 API 사용료가 발생할 수 있습니다.'
      : '선택한 구독·좋아요·재생목록을 비공개로 한 번 열람합니다. Google 로그인과 읽기 권한 동의는 다음 단계에서 진행합니다.'}</p>
    <div class="record-inline" data-ready="${provider}" hidden>
      <button type="button" class="button dark" data-continue="${provider}">${ai ? 'OpenAI 해석 준비하기' : 'YouTube 연결 계속하기'}</button>
      <button type="button" class="textbutton" data-edit="${provider}">입력값 변경</button></div>
    <form data-provider="${provider}" method="post" action="/api/setup" autocomplete="off">
      ${ai ? `<div class="doclinks"><a href="https://platform.openai.com/api-keys" target="_blank" rel="noreferrer">내 OpenAI API 키 열기</a></div>
        <div class="pair">${secretField('apiKey','OpenAI API 키')}</div>` : `
        <details class="chartdetails"><summary>Google Cloud에서 처음 설정하는 방법</summary>
        <ol class="guide"><li>사용할 프로젝트를 선택하고 <a class="intext" href="https://console.cloud.google.com/apis/library/youtube.googleapis.com" target="_blank" rel="noreferrer">YouTube Data API v3</a>를 사용 설정합니다.</li>
        <li>Google Auth Platform에서 앱 이름과 이메일을 입력합니다. 외부 앱을 테스트 중이면 <a class="intext" href="https://console.cloud.google.com/auth/audience" target="_blank" rel="noreferrer">대상</a>에서 로그인할 Google 계정을 테스트 사용자로 추가합니다.</li>
        <li><a class="intext" href="https://console.cloud.google.com/auth/clients" target="_blank" rel="noreferrer">클라이언트</a>에서 웹 애플리케이션을 만들고, 아래 주소를 승인된 리디렉션 URI에 등록한 뒤 JSON을 내려받습니다.</li></ol></details>
        <p class="hint">승인된 리디렉션 URI</p><code data-redirect></code>
        <fieldset><legend>웹 클라이언트 설정 불러오기</legend>
        <label class="record-file-label">${icon('upload',16)} JSON 파일 선택<input type="file" accept=".json,application/json" data-google-json aria-label="Google 웹 클라이언트 JSON 파일 선택"></label>
        <p class="hint">파일을 고르면 아래 두 입력란이 채워집니다. 값을 직접 입력해도 됩니다.</p></fieldset>
        <div class="pair">${secretField('clientId','OAuth 클라이언트 ID')}${secretField('clientSecret','OAuth 클라이언트 보안 비밀')}</div>`}
      <div class="formactions"><button type="submit" class="button light">${ai ? 'OpenAI 키 적용' : 'Google 설정 적용'}</button>
        <button type="button" data-cancel="${provider}" class="textbutton" hidden>입력 취소</button></div>
    </form>
    <p class="record-feedback" data-feedback="${provider}" role="status" aria-live="polite"></p>
  </section>`;
}

export function mountSetup(root, {config, api, onContinue, onConfigured}) {
  const controller = new AbortController();
  const listen = (target, event, handler) => target.addEventListener(event, handler, {signal:controller.signal});
  const q = selector => root.querySelector(selector);
  root.innerHTML = `<div class="flow"><div class="pagetitle"><h1>연결 설정</h1>
    <p>사용할 서비스를 하나씩 설정하세요. 여기서 입력한 키는 이 컴퓨터의 서버가 종료될 때까지 메모리에 보관합니다.</p></div>
    <div class="records-step">${providers.map(providerPanel).join('')}</div></div>`;
  const configured = {...config};
  const redirectUri = location.origin + '/oauth/google/callback';
  q('[data-redirect]').textContent = redirectUri;
  let fileVersion = 0;
  function feedback(provider, text) {
    q('[data-feedback="' + provider + '"]').textContent = text;
  }
  function render(provider, editing = false) {
    const available = Boolean(configured[flag[provider]]);
    q('[data-state="' + provider + '"]').textContent = available ? '설정값 있음' : '설정 필요';
    q('[data-ready="' + provider + '"]').hidden = !available || editing;
    q('form[data-provider="' + provider + '"]').hidden = available && !editing;
    q('[data-cancel="' + provider + '"]').hidden = !available || !editing;
  }
  function forgetInputs() {
    ++fileVersion;
    for (const form of root.querySelectorAll('form[data-provider]')) form.reset();
  }
  listen(window, 'pagehide', forgetInputs);

  for (const provider of providers) {
    const form = q('form[data-provider="' + provider + '"]');
    const submit = form.querySelector('[type="submit"]');
    const cancel = q('[data-cancel="' + provider + '"]');
    render(provider);
    listen(q('[data-continue="' + provider + '"]'), 'click', () => onContinue(provider));
    listen(q('[data-edit="' + provider + '"]'), 'click', () => {
      render(provider, true);
      form.querySelector('input[type=password]').focus();
    });
    listen(cancel, 'click', () => {
      if (provider === 'google') ++fileVersion;
      form.reset();
      render(provider);
      feedback(provider, '');
    });
    listen(form, 'submit', async event => {
      event.preventDefault();
      if (submit.disabled) return;
      if (provider === 'google') ++fileVersion;
      submit.disabled = true;
      cancel.disabled = true;
      feedback(provider, '이 기기의 서버에 적용하는 중입니다…');
      try {
        const body = {provider};
        for (const input of form.querySelectorAll('input[type=password]')) body[input.name] = input.value.trim();
        await api('/api/setup', body);
      } catch (error) {
        if (!controller.signal.aborted) feedback(provider, error.message || '설정값을 적용하지 못했습니다.');
        return;
      } finally {
        submit.disabled = false;
        cancel.disabled = false;
      }
      form.reset();
      if (controller.signal.aborted) return;
      configured[flag[provider]] = true;
      try {
        const fresh = await onConfigured();
        if (fresh) Object.assign(configured, fresh);
      } catch {
        if (!controller.signal.aborted) {
          render(provider, true);
          feedback(provider, '설정 요청은 처리됐지만 상태를 확인하지 못했습니다. 화면을 새로고침해 주세요.');
        }
        return;
      }
      if (controller.signal.aborted) return;
      render(provider);
      feedback(provider, provider === 'openai'
        ? '키를 적용했습니다. 글을 만들 때 전송에 동의할 수 있습니다.'
        : '클라이언트 설정을 적용했습니다. 계속하기를 눌러 읽을 목록과 계정을 선택하세요.');
    });
  }
  const googleForm = q('form[data-provider="google"]');
  const fileInput = q('[data-google-json]');
  listen(fileInput, 'change', async () => {
    const file = fileInput.files[0];
    const version = ++fileVersion;
    fileInput.value = '';
    if (!file) return;
    googleForm.elements.clientId.value = '';
    googleForm.elements.clientSecret.value = '';
    if (file.size > maxFileBytes) {
      feedback('google', 'OAuth 웹 클라이언트에서 내려받은 작은 JSON 파일을 선택해 주세요.');
      return;
    }
    let contents;
    try { contents = await file.text(); }
    catch {
      if (!controller.signal.aborted && version === fileVersion) feedback('google', '파일을 읽지 못했습니다. 다시 선택해 주세요.');
      return;
    }
    if (controller.signal.aborted || version !== fileVersion) return;
    try {
      const parsed = readGoogleWebClient(contents, redirectUri);
      googleForm.elements.clientId.value = parsed.clientId;
      googleForm.elements.clientSecret.value = parsed.clientSecret;
      feedback('google', '웹 클라이언트 설정을 읽었습니다. Google 설정 적용을 눌러 주세요.');
    } catch (error) { feedback('google', error.message); }
  });
  return () => { controller.abort(); forgetInputs(); };
}
