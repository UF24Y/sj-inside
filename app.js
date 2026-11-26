import {icon} from './icons.js';
import {api} from './api.js';
import {mountRecords,mountYoutube,newRecordState} from './records.js';
import {reviewText} from './imports.js';
import {shareEdition} from './share.js';
import {anonymizeGalleryPosts,isNumberedGuest} from './gallery-aliases.js';
import {makeGalleryReply,loveTermReply,sajuTerms} from './comment-replies.js';
import {mountLibrary} from './library.js';
import {cafeBoards,createCafeProgress} from './cafe-progress.js';

const main=document.querySelector('#main'), dialog=document.querySelector('#dialog');
const $=(sel,root=document)=>root.querySelector(sel);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const button=(href,text,symbol,style='dark')=>`<a href="#${href}" class="button ${style}">${symbol?icon(symbol):''}${text}</a>`;
const emptyBirth=()=>({calendar:'solar',year:'',month:'',day:'',time:'',gender:'',unknownTime:false,birthplace:'',timezone:'',leapMonth:false,confirmAssumption:false,localConsent:false});
const sampleBirthForm=()=>{
  const {date,time}=sampleInputs.birth;
  const [year,month,day]=date.split('-');
  return {...emptyBirth(),year,month,day,time};
};
const sampleName='예시';
const siteName='사주판';
const defaultDemoCover={
  theme:'paper',src:'./cafe-ink-intro.webp',alt:'한지 위에 펼친 종이와 붓, 아래로 이어지는 산수',
  title:siteName,hanja:'四柱',line:'태어난 날의 두 글자, 일주',
};
const demoCovers=new Map([
  ['경술',{
    theme:'stone',src:'./cover-gyeongsul.webp',alt:'옅은 안개 너머 짙은 바위 능선과 물굽이',
    title:'경술',hanja:'庚戌',line:'단단한 쇠와 묵직한 흙',
  }],
  ['정유',{
    theme:'lamp',src:'./cover-jeongyu.webp',alt:'은빛 등잔에 타오르는 작은 불꽃과 가을 억새',
    title:'정유',hanja:'丁酉',line:'은빛 위에 비친 잔잔한 불꽃',
  }],
  ['정축',{
    theme:'ember',src:'./cover-jeongchuk.webp',alt:'눈 덮인 마당의 흙빛 화로와 붉은 숯불',
    title:'정축',hanja:'丁丑',line:'겨울 흙 속에 남은 온기',
  }],
]);
let config={ai:false,google:false},demo=null,sampleInputs=null,chatReading=null,demoReading=null,birth=emptyBirth(),chart=null,records=newRecordState(),result=null,activePost=null;
let displayName='';
let cleanup=null,revision=0,notification;
let postVotes=new WeakMap();
let postViews=new WeakMap();
const galleryTopics=new Map();
const gallerySearches=new Map();
let commentThreads=new WeakMap();
const publishedReadingPosts=new Set();
const readerAccount={author:'ㅇㅇ',ipTag:'100.79'};
const readingReplyDelay=1200;
let stopReadingCommentNotice;
function message(text){const box=$('#notice');box.textContent=text;box.classList.add('show');clearTimeout(notification);notification=setTimeout(()=>box.classList.remove('show'),3500);}
function chartCard(c){
  const klass={목:'wood',화:'fire',토:'earth',금:'metal',수:'water'};
  const luck=c.majorLuck;
  const luckNote=luck&&`<p class="hint">대운은 ${luck.direction==='forward'?'순행':'역행'}으로 계산했어요.${luck.startAgeMonths===null?' 현재 대운의 시작 시기는 확인이 필요해요.':''}</p>`;
  return `<aside class="chartcard"><div class="chartheading"><span class="chartmark">${icon('compass',22)}</span><h3>나의 명식</h3><span class="han">四柱</span></div>
    <p class="chartdate">${esc(c.solarDate.replaceAll('-','.'))} · 양력 환산</p>
    <div class="pillars">${c.pillars.map(p=>`<div class="pillar ${klass[p.element]||'unknown'}"><span>${esc(p.key==='year'?'연주':p.label)}</span><strong lang="zh-Hant">${esc(p.hanja)}</strong><b>${esc(p.hangul)}</b></div>`).join('')}</div>
    <div class="chartfoot">${icon('info',15)}<span>${c.assumedTimezone?'한국 시간대 임시 가정':esc(c.timezone)} · ${c.birthplaceKnown?'입력한 출생지':'출생지 미확정'}</span></div>
    ${luckNote||''}<details class="chartdetails"><summary>계산 기준과 미확정 항목</summary><ul>${c.warnings.map(w=>'<li>'+esc(w)+'</li>').join('')}</ul></details></aside>`;
}
function demoEntryForm(){
  const presets=demo.readings??[];
  return presets.length?`<form class="demo-gallery-form" id="demo-gallery-form" autocomplete="off">
      <label for="demo-display-name">이름
        <input id="demo-display-name" name="displayName" type="text" placeholder="이름 또는 닉네임" maxlength="24" required>
      </label>
      <label for="demo-birth-profile">생년월시
        <select id="demo-birth-profile" name="profile" required>
          <option value="" disabled selected>출생 정보와 성별 선택</option>
          ${presets.map(({profileId,label})=>`<option value="${esc(profileId)}">${esc(label)}</option>`).join('')}
        </select>
      </label>
      <button type="submit" class="button dark">카페 열기</button>
      ${config.demoOnly?'<p class="error" id="demo-entry-error" role="alert"></p>':''}
    </form>`:'';
}
function demoGate(){
  const {theme,src,alt,title,hanja,line}=defaultDemoCover;
  return `<div class="demo-gate"><div class="demo-gate-layout">
    <figure class="demo-cover" data-theme="${theme}">
      <img src="${esc(src)}" alt="${esc(alt)}" width="960" height="1200" decoding="async">
      <figcaption class="demo-cover-caption" aria-live="polite" aria-atomic="true">
        <span class="demo-cover-hanja" data-cover-hanja lang="ko-Hani">${esc(hanja)}</span>
        <strong class="demo-cover-title" data-cover-title>${esc(title)}</strong>
        <span class="demo-cover-line" data-cover-line>${esc(line)}</span>
      </figcaption>
    </figure>
    <section class="demo-gate-card" aria-labelledby="demo-gate-title">
      <h1 id="demo-gate-title">내 사주 카페</h1>
      <p>출생 정보를 고르면 태어난 날에 맞는 그림이 나와요.</p>
      ${demoEntryForm()}
      <p class="demo-gate-note">오락과 자기성찰을 위한 데모예요.</p>
    </section>
  </div></div>`;
}
function updateDemoCover(profileId){
  const figure=$('.demo-cover',main);
  if(!figure)return;
  const profile=demo.readings.find(item=>item.profileId===profileId);
  const cover=demoCovers.get(profile?.dayPillar)??defaultDemoCover;
  const picture=$('img',figure);
  figure.dataset.theme=cover.theme;
  picture.src=cover.src;
  picture.alt=cover.alt;
  $('[data-cover-title]',figure).textContent=cover.title;
  $('[data-cover-hanja]',figure).textContent=cover.hanja;
  $('[data-cover-line]',figure).textContent=cover.line;
}
function home(){
  if(config.demoOnly)return demoGate();
  return `<div class="reportwrap gallery-wrap"><section class="board-intro"><div>
    <h1>타고난 결, 살아온 기록.</h1>
    <p>이름과 출생 정보를 고르면 내 사주 카페가 열려요.</p>
    ${demoEntryForm()}
    <div class="actions">${chatReading?button('reading/notice','내 사주 읽기','book','light'):button('birth','내 카페 만들기','pen','light')}${button('demo','샘플 먼저 읽기','book','light')}</div></div>
    <img src="./landscape.webp" alt="" width="252" height="162"></section>
    <section class="gallery-index community-preview" aria-labelledby="preview-heading">
      <div class="gallery-index-head"><h2 id="preview-heading">샘플 게시글</h2><a class="board-link" href="#demo">${demo.posts.length}편 전체 보기 ${icon('arrow',13)}</a></div>
      ${postsRows(demo.posts.slice(0,8).map(post=>({route:'demo',post})))}
    </section></div>`;
}
function steps(current){
  return `<ol class="steps" aria-label="게시글 작성 단계">${['출생 정보','기록 선택','게시글 읽기'].map((v,i)=>`<li class="${i+1===current?'current':i+1<current?'done':''}" ${i+1===current?'aria-current="step"':''}><span>${i+1<current?icon('check',14):i+1}</span>${v}</li>`).join('')}</ol>`;
}
function formTitle(title,sub){return `<div class="pagetitle"><h1>${title}</h1><p>${sub}</p></div>`;}
function birthForm(){
  const b=birth;const checked=v=>v?'checked':'';
  const zones=Intl.supportedValuesOf?.('timeZone')||['Asia/Seoul','Asia/Tokyo','America/New_York','Europe/Paris'];
  return `<div class="flow">${steps(1)}${formTitle('태어난 때를 알려주세요.','생년월일과 현지 시각으로 네 기둥의 명식을 계산합니다.')}
    <form class="panel birthpanel" id="birthform" autocomplete="off"><div class="paneltop"><h2>${icon('calendar',21)} 출생 정보</h2><button class="textbutton" type="button" data-action="samplebirth">샘플 값 채우기</button></div>
    <fieldset><legend>달력 종류</legend><div class="segmented"><label><input name="calendar" type="radio" value="solar" ${checked(b.calendar==='solar')}>양력</label><label><input name="calendar" type="radio" value="lunar" ${checked(b.calendar==='lunar')}>음력</label></div>
    <label class="checkbox" id="leaprow" ${b.calendar!=='lunar'?'hidden':''}><input name="leapMonth" type="checkbox" ${checked(b.leapMonth)}>음력 윤달에 태어났어요</label></fieldset>
    <fieldset><legend>생년월일</legend><div class="datefields"><label><input name="year" type="text" inputmode="numeric" maxlength="4" pattern="[0-9]{4}" placeholder="YYYY" aria-label="출생 연도" value="${esc(b.year)}" required><span>년</span></label><label><input name="month" type="text" inputmode="numeric" maxlength="2" pattern="[0-9]{1,2}" placeholder="MM" aria-label="출생 월" value="${esc(b.month)}" required><span>월</span></label><label><input name="day" type="text" inputmode="numeric" maxlength="2" pattern="[0-9]{1,2}" placeholder="DD" aria-label="출생 일" value="${esc(b.day)}" required><span>일</span></label></div><p class="hint">양력 환산 기준 1900–2050년을 지원합니다.</p></fieldset>
    <fieldset><legend>출생 시각</legend><div class="inline"><input class="timefield" type="time" name="time" aria-label="출생 시각" value="${esc(b.time)}" ${b.unknownTime?'disabled':'required'}><label class="checkbox"><input type="checkbox" name="unknownTime" ${checked(b.unknownTime)}>시각을 몰라요</label></div></fieldset>
    <fieldset><label class="field" for="birth-gender">대운 계산 기준 <span class="optional">선택</span></label><div class="field"><select id="birth-gender" name="gender" aria-describedby="birth-gender-hint"><option value="">건너뛰기</option><option value="male" ${b.gender==='male'?'selected':''}>남성 기준</option><option value="female" ${b.gender==='female'?'selected':''}>여성 기준</option></select></div><p class="hint" id="birth-gender-hint">전통 사주에서 10년 흐름을 계산하는 데 써요.</p></fieldset>
    <div class="pair"><label class="field">출생지 <span class="optional">선택</span><input type="text" name="birthplace" maxlength="80" placeholder="도시 이름" value="${esc(b.birthplace)}"></label><label class="field">출생 당시 시간대<input type="text" name="timezone" list="zones" maxlength="100" placeholder="모름 · 한국 시간대 임시 가정" value="${esc(b.timezone)}"></label><datalist id="zones"><option value="UTC">${zones.map(z=>'<option value="'+esc(z)+'">').join('')}</datalist></div>
    <p class="hint">한국 출생은 Asia/Seoul을 선택하세요. 해외 출생은 해당 도시의 시간대를 확인해 주세요.</p>
    <label class="checkbox softbox" id="assumerow"><input name="confirmAssumption" type="checkbox" ${checked(b.confirmAssumption)}><span>출생지 또는 시간대가 미확정임을 확인했습니다. 시간대를 비워 두면 한국 시간대로 임시 계산합니다.</span></label>
    <label class="checkbox consent"><input name="localConsent" type="checkbox" required ${checked(b.localConsent)}><span>출생 정보와 선택한 주제 요약을 이 기기의 로컬 서버에서 임시 처리하는 데 동의합니다. <button type="button" class="intext" data-action="privacy">처리·삭제 안내</button></span></label>
    <p class="error" role="alert" id="birtherror"></p><div class="formactions"><a href="#home" class="button light">홈으로</a><button type="submit" class="button dark">명식 확인하고 다음으로</button></div></form></div>`;
}
function wireBirth(){
  const form=$('#birthform'); const fields=form.elements;
  function sync(){
    for(const k of ['calendar','year','month','day','time','gender','birthplace','timezone'])birth[k]=fields[k].value;
    for(const k of ['leapMonth','unknownTime','confirmAssumption','localConsent'])birth[k]=fields[k].checked;
    $('#leaprow').hidden=birth.calendar!=='lunar';fields.time.disabled=birth.unknownTime;fields.time.required=!birth.unknownTime;
    const assume=!birth.timezone.trim()||!birth.birthplace.trim();$('#assumerow').hidden=!assume;fields.confirmAssumption.required=assume;
  }
  sync();form.addEventListener('input',()=>{sync();chart=null;result=null;});
  form.addEventListener('submit',async e=>{
    e.preventDefault();sync();const version=revision;const submit=form.querySelector('[type=submit]');submit.disabled=true;$('#birtherror').textContent='';
    try{const d=await api('/api/chart',{birth:birthPayload(),localConsent:birth.localConsent});if(version!==revision)return;chart=d.chart;result=null;location.hash='records';}
    catch(err){if(version===revision)$('#birtherror').textContent=err.message;}
    finally{submit.disabled=false;}
  });
}
function birthPayload(){return {calendar:birth.calendar,date:[birth.year,birth.month.padStart(2,'0'),birth.day.padStart(2,'0')].join('-'),time:birth.unknownTime?'':birth.time,...(birth.gender?{gender:birth.gender}:{}),birthplace:birth.birthplace.trim(),timezone:birth.timezone.trim(),leapMonth:birth.calendar==='lunar'&&birth.leapMonth,confirmAssumption:birth.confirmAssumption};}
const modeName={sample:'가상 스레드',local:'로컬 생성',ai:'OpenAI 생성',chat:'가상 스레드',preset:'데모 게시글'};
const postAuthors=['지나가던갤러','한줄만씀','명식구경중','관전중ㅇㅇ'];
const topicKey=route=>route==='gallery'?'demo':route;
const isReadingRoute=route=>route==='reading'||route==='demo-reading';
const postsCollection=route=>route==='demo-reading'?demoReading:route==='reading'?chatReading:route==='demo'?demo:result;
const cafeTitle=name=>name?`${name} 사주 분석 카페`:'사주 분석 카페';
function galleryDisplayName(route){
  if(route==='demo-reading')return demoReading.displayName;
  return displayName||(route==='reading'?chatReading.displayName:route==='result'?'':sampleName);
}
function availablePosts(route){
  const posts=postsCollection(route)?.posts||[];
  return isReadingRoute(route)?posts.filter(post=>publishedReadingPosts.has(post)):posts;
}
function visibleCommentCount(post,route){
  return commentThreads.get(post)?.entries.length??(isReadingRoute(route)&&post!==demoReading?.freePost?0:post.comments.length);
}
function appendStoryComment(thread,post,index){
  const comment=post.comments[index];
  const parent=comment.replyTo;
  thread.entries.push({
    id:'gallery-comment-'+index,
    parentId:Number.isInteger(parent)&&parent>=0&&parent<index?'gallery-comment-'+parent:null,
    comment,sourceIndex:index
  });
  thread.storyCount++;
}
function startCommentThread(post,route){
  if(commentThreads.has(post))return;
  const thread={entries:[],storyCount:0,asked:new Set(),pendingReplies:[],pendingFollowups:[],pendingLiveReplies:[],draft:null,readyAt:performance.now()+readingReplyDelay};
  if(!isReadingRoute(route)||post===demoReading?.freePost)post.comments.forEach((_,index)=>appendStoryComment(thread,post,index));
  commentThreads.set(post,thread);
}
function postText(text,route){
  const name=galleryDisplayName(route)||'이 사람';
  return text.replaceAll('{이름}',()=>name);
}
const sajuWords=Object.keys(sajuTerms).sort((a,b)=>b.length-a.length).map(term=>
  // ‘세운 규칙’에서 ‘세운’은 동사다.
  term==='세운'?'세운(?!\\s+(?:규칙|기준|계획|목표|원칙))':term);
const sajuSuffix='(?:은|는|이|가|을|를|과|와|도|만|랑|이랑|부터|까지|에게|한테|에|에서|에선|에서는|로|으로|이나|나|임|인|야|예요|거든요?|이(?:라(?:고|길래|는|며|도)?|거든요?|고요?|냐(?:면)?|래|면|에요|야)|라(?:고|길래|는|며|도)?)?';
const sajuPattern=new RegExp(`(?<![가-힣])(${sajuWords.join('|')})(?=${sajuSuffix}(?![가-힣]))(?:[ \\t]*\\((\\p{Script=Han}+)\\))?`,'gu');

function highlightSajuTerms(text,ask){
  return esc(text).replace(sajuPattern,(_,term,hanja)=>{
    const characters=hanja||sajuTerms[term][0];
    const marked=`<strong class="saju-term">${term}<span lang="ko-Hani">(${characters})</span></strong>`;
    return ask?`<button type="button" class="saju-term-trigger" data-action="ask-saju-term" data-term="${term}" aria-label="${term}(${characters}) 뜻을 댓글로 묻기" title="뜻을 댓글로 묻기">${marked}</button>`:marked;
  });
}
function galleryText(text,route,{literal=false,ask=false}={}){
  if(!isReadingRoute(route))return esc(literal?text:postText(text,route));
  if(literal)return highlightSajuTerms(text,ask);
  return text.split('{이름}').map(part=>highlightSajuTerms(part,ask)).join(esc(postText('{이름}',route)));
}
function galleryAuthor(account,route){
  return isReadingRoute(route)&&isNumberedGuest(account.author)?account.author.replace('사주갤럼 ','익명 '):account.author;
}
function readingNickname(account,route){
  return galleryAuthor(account,route)+(account.ipTag&&!config.demoOnly?`(${account.ipTag})`:'');
}
function readingIdentity(account,route){
  const name=esc(galleryAuthor(account,route));
  if(account.ipTag){
    const address=config.demoOnly?'':`<span class="reading-ip">(${esc(account.ipTag)})</span>`;
    return `<span class="reading-identity reading-anonymous" title="${isReadingRoute(route)?'가상 익명 사용자':'가상 통피'}">${name}${address}</span>`;
  }
  if(isNumberedGuest(account.author)||account.author==='ㅇㅇ')return `<span class="reading-identity reading-anonymous">${name}</span>`;
  return `<span class="reading-identity reading-fixed" title="${isReadingRoute(route)?'닉네임':'고닉'}">${name}</span>`;
}
const cafeProfiles=new Map([
  ['살풀이꾼','reader'],['돈이조아','money'],['사랑해요','love'],['正統四柱','timing'],['운영진','moderator'],
]);
function cafeAuthor(account,route){
  const identity=readingIdentity(account,route);
  if(!config.demoOnly)return identity;
  const nickname=galleryAuthor(account,route);
  const mark=isNumberedGuest(account.author)?nickname.split(' ').at(-1):Array.from(nickname)[0];
  const profile=cafeProfiles.get(account.author)||'anonymous';
  return `<span class="cafe-author"><span class="cafe-avatar" data-profile="${profile}" aria-hidden="true">${esc(mark)}</span>${identity}</span>`;
}
const cafeBoardById=new Map(cafeBoards.map(board=>[board.id,board]));
const cafeBoardLink=id=>`#demo-reading/board/${id}`;
const cafeRanks=['새싹 회원','일반 회원','열심 회원','우수 회원','정독 회원'];
const cafeRankGuidance=[
  '공지사항을 읽으면 일반 게시판이 열려요.',
  '일반 게시판의 글을 다 읽으면 살풀이가 열려요.',
  '살풀이를 읽으면 운세 게시판 다섯 곳이 열려요.',
  '운세 게시판 다섯 곳을 모두 읽으면 일반에 정리글이 올라와요.',
  '일반 게시판에 정리글이 올라왔어요.',
];
function cafeBoardNav(progress,current){
  return `<nav class="cafe-board-nav" aria-label="게시판 메뉴">${cafeBoards.map(board=>{
    const open=progress.isUnlocked(board.id);
    const count=progress.counts(board.id);
    const complete=open&&count.total>0&&count.read===count.total;
    const state=open?(complete?'cafe-board-done':''):'cafe-board-locked';
    return `<a href="${cafeBoardLink(board.id)}" class="${state}"${current===board.id?' aria-current="page"':''}
      aria-label="${board.label}${open?(complete?' (읽기 완료)':''):' (잠김)'}">
      ${board.label}${open?'':icon('lock',13)}</a>`;
  }).join('')}</nav>`;
}
function cafeLayout(contents,boardId,{article=false}={}){
  const title=esc(cafeTitle(demoReading.displayName));
  const progress=demoReading.progress;
  const exit='<a class="board-link demo-exit" href="#home">나가기</a>';
  return `<div class="reportwrap gallery-wrap community-gallery cafe-layout ${article?'gallery-thread cafe-open-post':'cafe-home'}">
    <aside class="cafe-masthead cafe-sidebar" aria-label="카페 정보 및 게시판">
      <h2 class="cafe-sidebar-heading">카페 정보</h2>
      <div class="cafe-brandbar">
        <a class="cafe-brand gallery-name" href="#demo-reading">${title}</a>${exit}
      </div>
      <div class="cafe-membership" aria-label="등업 안내"><strong>${cafeRanks[progress.tier]}</strong>
        <span>${cafeRankGuidance[progress.tier]}</span></div>
      <h2 class="cafe-sidebar-heading">게시판</h2>
      ${cafeBoardNav(progress,boardId)}
    </aside>
    <div class="cafe-main">
      ${article?`<header class="cafe-threadbar gallery-tools">
        <a class="cafe-back" href="${cafeBoardLink(boardId)}">‹ ${cafeBoardById.get(boardId).label}</a>
        <span class="cafe-thread-name">${title}</span>${exit}
      </header>`:''}
      ${contents}
    </div>
  </div>`;
}
function galleryBar(route){
  const name=route==='gallery'?'':galleryDisplayName(route);
  const title=cafeTitle(name);
  const titleLink=`<a class="gallery-name" href="#${route}">${esc(title)}</a>`;
  return `<div class="gallery-band">${titleLink}<span>${icon('lock',14)} ${route==='demo-reading'?'데모':'비공개'} · 가상 카페</span></div>`;
}
const positiveReaction=route=>isReadingRoute(route)?'공감':'추천';
const readingNoticeTitle='처음 온 사람은 이 글부터 봐줘';
function postsRows(posts,noticeRoute){
  const cafe=config.demoOnly;
  const unread=cafe&&noticeRoute&&!demoReading.noticeOpened;
  const noticeRead=cafe&&demoReading.progress.isRead('notice');
  const notice=noticeRoute?`<li class="gallery-pinned-row"><a href="#${noticeRoute}/notice"${unread?' class="demo-notice-unread"':''}>
    <span class="gallery-list-main"><span class="gallery-list-type">공지</span><span class="gallery-list-title"><strong>${readingNoticeTitle}</strong></span>${noticeRead?'<span class="cafe-row-read">읽음</span>':''}</span>
    <span class="gallery-list-meta">운영진</span>${icon('arrow',16)}
  </a></li>`:'';
  return `<ul class="gallery-rows">${notice}${posts.map(({route,post})=>{
      const count=visibleCommentCount(post,route);
      const summary=cafe&&post.tag==='정리';
      const read=cafe&&demoReading.progress.isRead(post.id);
      const rowClass=[summary&&'cafe-summary-row',read&&'cafe-row-read'].filter(Boolean).join(' ');
      return `<li${rowClass?` class="${rowClass}"`:''}><a href="#${route}/${esc(post.id)}">
        <span class="gallery-list-main">
          <span class="gallery-list-type${post.tag==='사주'?' gallery-list-chart':''}">${esc(post.tag)}</span>
          <span class="gallery-list-title">${galleryText(post.title,route)}</span>
          ${read?'<span class="cafe-row-read">읽음</span>':summary?'<span class="cafe-row-new">새 글</span>':''}
        </span>
        <span class="gallery-list-meta">
          <span class="gallery-list-author">${readingIdentity(post,route)}</span>
          ${cafe?'':`<span class="gallery-list-views">조회 ${postViews.get(post)||0}</span>
          <span class="gallery-list-votes">${positiveReaction(route)} ${postVotes.get(post)==='up'?1:0}</span>`}
        </span>
        <span class="gallery-list-count" aria-label="가상 댓글 ${count}개">${icon('dialogue',15)} <span>${count}</span></span>
      </a></li>`;
    }).join('')}</ul>`;
}
const searchKey=text=>text.normalize('NFKC').toLowerCase().trim().split(/\s+/u);
function matchesGallerySearch(post,route,terms){
  if(!terms[0])return true;
  const text=postText([post.title,readingNickname(post,route),post.body,post.annotation?.caption].join(' '),route).normalize('NFKC').toLowerCase();
  return terms.every(term=>text.includes(term));
}
function topicBar(entries,route){
  const counts=new Map();
  for(const {post} of entries)counts.set(post.tag,(counts.get(post.tag)||0)+1);
  const requested=galleryTopics.get(topicKey(route))||'';
  const selected=counts.has(requested)?requested:'';
  const group=(key,label,count)=>`<button type="button" data-gallery-topic="${esc(key)}" aria-pressed="${key===selected}">${esc(label)} <b>${count}</b></button>`;
  return {
    filters:`<nav class="gallery-topics" aria-label="게시글 분류">${group('','전체',entries.length)}${Array.from(counts,([tag,count])=>group(tag,tag,count)).join('')}</nav>`,
    entries:selected?entries.filter(({post})=>post.tag===selected):entries
  };
}
function readingChapters(collection){
  return (collection?.chapters??[]).map(chapter=>({
    id:chapter.id,title:chapter.title,
    start:collection.posts.findIndex(post=>post.id===chapter.firstPostId)
  })).filter(chapter=>chapter.start>=0).sort((a,b)=>a.start-b.start);
}
function readingContents(route){
  const collection=postsCollection(route);
  const chapters=readingChapters(collection);
  if(!chapters.length)return '';
  const items=chapters.map(({title,start})=>{
    const first=collection.posts[start];
    const label=esc(title);
    const available=!isReadingRoute(route)||publishedReadingPosts.has(first);
    return `<li>${available?`<a href="#${route}/${esc(first.id)}">${label}</a>`:`<span>${label}</span>`}</li>`;
  });
  return `<details class="reading-contents"><summary>정주행 목차</summary><ol>${items.join('')}</ol></details>`;
}
function readingNoticeCopy(interactive=false){
  const reply=interactive
    ?'<button type="button" class="intext notice-reply-trigger" data-action="ask-reader-question" data-question="0" aria-controls="gallery-comments">답글</button>'
    :'<strong>답글</strong>';
  return `<div class="reading-notice-copy">
    <p>카페에 처음 왔어? 여기서 ${reply}을 누르면 <strong>ㅇㅇ</strong>으로 네 댓글이 달려.</p>
    <p>글에서 궁금한 말은 밑줄을 눌러 봐. 댓글로 물어볼 수 있어.</p>
    <p>댓글을 다 읽으면 <strong>새 댓글 보기</strong>를 눌러. ${config.demoOnly?'<strong>다 읽었어요</strong>를 누르면 읽은 글로 표시돼. 게시판 글을 다 읽으면 등업이 어떻게 되는지도 메뉴에서 볼 수 있어.':'<strong>새 글 보기</strong>가 뜨면 다음 글로 넘어가면 돼.'}</p>
  </div>`;
}
function noticeDiscussion(route){
  const collection=postsCollection(route);
  const post=collection.noticePost??={
    id:'notice',title:readingNoticeTitle,body:'',author:'운영진',
    comments:[{author:'글쓴이',text:'위에 있는 답글을 눌러서 댓글 흐름을 한 번 봐도 돼.'}],
    questions:[{
      after:0,question:'처음인데 어디부터 읽으면 돼?',
      text:config.demoOnly?'어서 와. 공지를 다 봤으면 댓글 아래 ‘다 읽었어요’를 눌러봐.\n\n등업되면서 일반 게시판이 열릴 거야.':'어서 와. 위에 있는 ‘첫 글 읽기’부터 눌러봐.\n\n그다음엔 댓글을 다 읽으면 새 글이 열려.'
    }]
  };
  startCommentThread(post,route);
  const thread=commentThreads.get(post);
  if(thread.storyCount===0)appendStoryComment(thread,post,0);
  return post;
}
function readingNoticePage(route,post){
  const collection=postsCollection(route);
  const first=collection.posts[0];
  const {comments,next}=postDiscussion(post,route);
  const summary=route==='demo-reading'?`<p class="demo-reading-summary">${esc(collection.calculationSummary)}</p>`:'';
  const firstLink=first&&!config.demoOnly?button(`${route}/${esc(first.id)}`,'첫 글 읽기','arrow'):'';
  const contents=`<article class="gallery-post">
      <header class="gallery-post-header"><span class="tag filled">공지</span><h1>${readingNoticeTitle}</h1>
        <div class="gallery-post-meta"><strong>${cafeAuthor(post,route)}</strong></div>
      </header>
      <div class="gallery-post-body reading-notice-body">${summary}${readingNoticeCopy(true)}${firstLink}</div>
    </article>
    ${comments}`;
  if(config.demoOnly){
    return cafeLayout(`${contents}<div id="reading-next-slot" aria-live="polite">${next}</div>`,'notice',{article:true});
  }
  return `<div class="reportwrap gallery-wrap gallery-thread community-gallery">
    ${galleryBar(route)}
    <div class="gallery-tools"><a class="button light compact" href="#${route}">‹ 목록</a></div>
    ${contents}
  </div>`;
}
function demoBoardList(boardId){
  const progress=demoReading.progress;
  const board=cafeBoardById.get(boardId);
  const open=progress.isUnlocked(boardId);
  const count=progress.counts(boardId);
  const entries=progress.posts(boardId).map(post=>({route:'demo-reading',post}));
  const notice=boardId==='notice'&&demoReading.noticeReady?'demo-reading':'';
  const rows=open?`<div${boardId==='notice'?' id="demo-notice-slot" aria-live="polite"':''}>${postsRows(entries,notice)}</div>`
    :`<div class="cafe-board-access">
        <strong>${icon('lock',17)} 등업 후 볼 수 있는 게시판이에요</strong>
        <p>${cafeRankGuidance[board.level-1]}</p>
        <a class="board-link" href="${cafeBoardLink(progress.recommendedBoard)}">읽을 글로 이동 ${icon('arrow',14)}</a>
      </div>`;
  return cafeLayout(`<section class="gallery-index" aria-labelledby="cafe-board-title">
      <header class="cafe-board-head">
        <h1 class="cafe-board-heading" id="cafe-board-title">${board.label}</h1>
        ${open?`<span class="cafe-board-count">읽음 ${count.read}/${count.total}</span>`:''}
      </header>
      ${rows}
    </section>`,boardId);
}
function postsList(route){
  const entries=[];
  const staged=isReadingRoute(route);
  const collections=route==='gallery'?['result','demo']:[route];
  for(const collection of collections){
    for(const post of availablePosts(collection))entries.push({route:collection,post});
  }
  if(staged)entries.reverse();
  const {filters,entries:topicEntries}=topicBar(entries,route);
  const query=gallerySearches.get(topicKey(route))||'';
  const terms=searchKey(query);
  const filtered=topicEntries.filter(entry=>matchesGallerySearch(entry.post,entry.route,terms));
  const search=`<div class="gallery-search-bar">
    <form class="gallery-search-form" role="search" aria-label="게시글 검색">
      <input type="search" name="keyword" aria-label="게시글 검색어" placeholder="제목, 내용, 닉네임" value="${esc(query)}" maxlength="60" autocomplete="off">
      <button type="submit" class="button dark compact">검색</button>
    </form>
    ${query?`<span class="gallery-search-count" role="status">검색 결과 ${filtered.length}개</span><button class="board-link" type="button" data-action="clear-search">검색 지우기</button>`:''}
  </div>`;
  const empty=filtered.length?'':'<p class="gallery-empty">검색 결과가 없습니다.</p>';
  const sample=route==='demo';
  const local=route==='result'&&result.mode==='local';
  const visibleName=galleryDisplayName(route);
  const reading=staged?postsCollection(route):null;
  return `<div class="reportwrap gallery-wrap community-gallery">${galleryBar(route)}
    <section class="gallery-index">
      <div class="gallery-index-head"><h1>${route==='demo-reading'?'전체글':route==='reading'?'내 사주 게시글':route==='result'?'새 게시글':'게시글 목록'}</h1>
        ${config.demoOnly?'':`<form class="gallery-name-form"><label for="gallery-display-name">표시 이름</label>
          <input id="gallery-display-name" name="displayName" maxlength="24" autocomplete="off" value="${esc(visibleName)}">
          <button type="submit" class="button light compact">이름 적용</button>
        </form>`}
      </div>
      ${reading&&!config.demoOnly?`<div class="reading-note"><p>${esc(reading.calculationSummary??'이 대화에서 작성 · 출생지 미확정 · 한국 표준시 가정')}</p><details><summary>출생 시각 계산 기준</summary><p>${esc(reading.calculationNote)}</p></details></div>`:''}
      ${route==='gallery'?'':readingContents(route)}
      ${filters}
      ${search}
      ${filtered.length||staged?postsRows(filtered,staged?route:''):''}
      ${empty}
    </section>
    ${config.demoOnly?'':`<div class="postactions"><a class="button light" href="#${route==='gallery'||route==='demo-reading'?'home':'gallery'}">${route==='demo-reading'?'다른 출생 정보 고르기':route==='gallery'?'홈으로':'전체 글 목록'}</a>
      ${route==='gallery'&&chatReading?button('reading/notice','내 사주 읽기','book'):''}
      ${sample||local?`<button class="button dark" data-action="${sample?'sample-ai':'repeat-ai'}">${icon('pen',16)} ${sample?'이 샘플로 게시글 만들기':'같은 기록으로 OpenAI 생성'}</button>`:''}</div>`}</div>`;
}
function readingFollowup(post,comment,route){
  if(!comment.opens)return null;
  const author=comment.author==='글쓴이'?post:comment;
  return postsCollection(route).posts.find(candidate=>candidate.id===comment.opens&&candidate.author===author.author&&candidate.ipTag===author.ipTag);
}
function readerQuestionControl(post,route,index){
  if(commentThreads.get(post).asked.has(index)){
    return `<a class="reader-question-link" href="#${route}/${esc(post.id)}" data-action="jump-reader-question" data-question="${index}">내 댓글 보기</a>`;
  }
  const question=post.questions[index];
  const prompt=isReadingRoute(route)&&question.after===-1?'':`<span class="reader-question-prompt">${isReadingRoute(route)?'댓글로 물어보기':'댓글로 묻기'}</span>`;
  return `<button type="button" data-action="ask-reader-question" data-question="${index}">
    ${icon('dialogue',15)}${prompt}<b>${galleryText(question.question,route)}</b>
  </button>`;
}
function readerQuestions(post,route,after){
  return (post.questions||[]).map((q,i)=>q.after===after?`<div class="reader-question">${readerQuestionControl(post,route,i)}</div>`:'').join('');
}
function replyForm(draft,recipient){
  return `<form id="reader-reply-form" autocomplete="off">
    <label for="reader-reply-text">${esc(recipient)}에게 답글</label>
    <textarea id="reader-reply-text" name="reply" aria-label="답글 내용" rows="2" maxlength="500" required>${esc(draft.text)}</textarea>
    <div><button type="button" class="board-link" data-action="cancel-reply">취소</button>
    <button type="submit" class="button dark compact">등록</button></div>
  </form>`;
}
function commentAccount(post,comment){
  if(comment.author==='글쓴이')return post;
  return comment.author?comment:{author:'ㅇㅇ'};
}
function participantHasDeparted(post,thread,account){
  return thread.entries.some(({comment})=>{
    if(!comment.departed)return false;
    const who=commentAccount(post,comment);
    return who.author===account.author&&who.ipTag===account.ipTag;
  });
}
function hasUnreadDiscussion(post,thread){
  return thread.storyCount<post.comments.length||thread.pendingReplies.length>0||thread.pendingFollowups.length>0||thread.pendingLiveReplies.length>0;
}
function cafeReadingStep(post,waiting){
  const progress=demoReading.progress;
  const board=progress.boardOf(post.id);
  const {read,total}=progress.counts(board);
  const done=progress.isRead(post.id);
  return `<div class="cafe-reading-progress" tabindex="-1">
    <p><strong>${cafeBoardById.get(board).label} · 읽음 ${read}/${total}</strong><br>
      ${done?(post.tag==='정리'?'정리글까지 다 읽었어요.':'읽은 글로 표시했어요.'):waiting?'댓글 아래에서 새 댓글을 끝까지 확인해 주세요.':'글을 다 봤다면 읽음으로 표시해 주세요.'}</p>
    ${done?`<a class="board-link" href="${cafeBoardLink(board)}">게시판으로 ${icon('arrow',14)}</a>`
      :`<button type="button" data-action="confirm-cafe-read"${waiting?' disabled':''}>다 읽었어요</button>`}
  </div>`;
}
function postDiscussion(post,route){
  const thread=commentThreads.get(post);
  const staged=isReadingRoute(route);
  const notice=post.id==='notice';
  const hasNewComments=hasUnreadDiscussion(post,thread);
  const nextPost=staged&&!config.demoOnly&&!hasNewComments
    ?post.comments.slice(0,thread.storyCount).map(comment=>readingFollowup(post,comment,route)).findLast(Boolean)
    :null;
  const byId=new Map();
  const groups=[];
  for(const entry of thread.entries){
    const parent=byId.get(entry.parentId);
    const group=parent?.group??{root:entry,replies:[]};
    byId.set(entry.id,{entry,group});
    if(parent)group.replies.push(entry);
    else groups.push(group);
  }
  function commentItem({id,parentId,comment,sourceIndex,kind,literal,termQuestion},replies=[],previousId){
    const account=commentAccount(post,comment);
    const departed=participantHasDeparted(post,thread,account);
    const canReply=!notice&&!departed;
    const isAuthor=kind!=='reader-own-comment'&&account.author===post.author&&account.ipTag===post.ipTag;
    const identity=cafeAuthor(account,route);
    const badge=kind==='reader-own-comment'?' <small>내 댓글</small>':isAuthor?' <small>글쓴이</small>':'';
    const recipient=byId.get(parentId)?.entry;
    const target=recipient?esc(recipient.kind==='reader-own-comment'?'ㅇㅇ':readingNickname(commentAccount(post,recipient.comment),route)):'';
    const adjacent=recipient&&parentId===previousId;
    const jumpAttrs=`data-action="jump-reply-target" aria-controls="${parentId}" aria-label="${target} 댓글로 이동"`;
    const mention=recipient&&!adjacent?`<button type="button" class="gallery-reply-target" ${jumpAttrs}>${target} //</button> `:'';
    const paragraphs=comment.text.trim().split(/\n{2,}/).map((paragraph,i)=>{
      const content=termQuestion?esc(paragraph):galleryText(paragraph,route,{literal,ask:kind!=='reader-own-comment'&&!departed});
      return `<p>${i===0?mention:''}${content}</p>`;
    }).join('');
    const commentBody=comment.voiceMessage?`<div class="gallery-voice-message">
      <audio controls preload="none" src="${esc(comment.voiceMessage)}" aria-label="${esc(readingNickname(account,route))} 음성메시지"></audio>
      <div class="gallery-voice-transcript">${paragraphs}</div>
    </div>`:paragraphs;
    const classes=[kind,recipient&&'gallery-addressed-comment'].filter(Boolean).join(' ');
    const marker=adjacent?`<button type="button" class="gallery-reply-marker" ${jumpAttrs}>ㄴ</button>`
      :recipient?'<span class="gallery-reply-marker" aria-hidden="true">ㄴ</span>':'';
    const replyControl=canReply?`<button type="button" class="gallery-write-reply" data-action="write-reply" aria-label="${esc(readingNickname(account,route))}에게 답글 쓰기">답글</button>`:'';
    return `<li id="${id}"${classes?` class="${classes}"`:''} tabindex="-1"><div class="gallery-comment-line">${marker}<span class="gallery-comment-author${isAuthor?' gallery-comment-op':''}">${identity}${badge}</span>
      <div class="gallery-comment-text">${commentBody}${kind||!canReply?'':readerQuestions(post,route,sourceIndex)}</div>
      ${replyControl}</div>
      ${canReply&&thread.draft?.parentId===id?replyForm(thread.draft,readingNickname(account,route)):''}
      ${replies.length?`<ol class="gallery-comment-replies" aria-label="대댓글">${replies.map((reply,index)=>commentItem(reply,[],replies[index-1]?.id??id)).join('')}</ol>`:''}</li>`;
  }
  const questions=readerQuestions(post,route,-1);
  const nextAuthor=nextPost?readingNickname(nextPost,route):'';
  const nextLabel=nextAuthor+' 새 글 보기';
  const next=config.demoOnly?cafeReadingStep(post,hasNewComments):nextPost&&publishedReadingPosts.has(nextPost)?`<div class="reading-next">
    <a class="reading-followup" href="#${route}/${esc(nextPost.id)}" aria-label="${esc(nextLabel)}. ${esc(postText(nextPost.title,route))}">
      <span><small>${esc(nextLabel)}</small><strong>${galleryText(nextPost.title,route)}</strong></span>${icon('arrow',16)}
    </a>
  </div>`:'';
  const complete=staged&&!config.demoOnly&&!hasNewComments&&!next&&post===postsCollection(route).posts.at(-1)?'<p class="reading-complete">마지막 글까지 읽었어요.</p>':'';
  const comments=`<section class="gallery-comments" id="gallery-comments" tabindex="-1" aria-labelledby="gallery-comments-title">
    <header><h2 id="gallery-comments-title">${icon('dialogue',18)} 댓글 <b>${thread.entries.length}</b></h2><span>가상 댓글</span></header>
    ${questions?(staged?`<details class="gallery-comment-questions reading-question-panel"><summary>댓글로 물어보기</summary>${questions}</details>`:`<div class="gallery-comment-questions">${questions}</div>`):''}
    ${groups.length?`<ol>${groups.map(({root,replies})=>commentItem(root,replies)).join('')}</ol>`:''}
    ${hasNewComments?`
      <div id="reading-comment-end">
        ${thread.entries.length?'':'<p id="reading-comment-wait">첫 댓글 기다리는 중…</p>'}
        <div class="gallery-comment-notices" aria-live="polite"><div id="reading-new-comments" hidden>
          <button type="button" data-action="refresh-reading-comments" aria-label="새로운 댓글이 달렸습니다 · 새 댓글 보기">
            ${icon('dialogue',18)} <span class="comment-refresh-copy"><span>새로운 댓글이 달렸습니다</span><strong class="comment-refresh-label">새 댓글 보기</strong></span> ${icon('arrow',14)}
          </button>
        </div></div>
      </div>`:complete}
  </section>`;
  return {comments,next};
}
function voteBar(data,route){
  const selected=postVotes.get(data);
  return `<div class="gallery-votes" role="group" aria-label="이 기기의 게시글 반응">
    <button type="button" data-vote="up" aria-pressed="${selected==='up'}"><span aria-hidden="true">${isReadingRoute(route)?'♡':'▲'}</span> ${positiveReaction(route)} <b>${selected==='up'?1:0}</b></button>
    ${isReadingRoute(route)?'':`<button type="button" data-vote="down" aria-pressed="${selected==='down'}"><span aria-hidden="true">▽</span> 비추천 <b>${selected==='down'?1:0}</b></button>`}
  </div>`;
}
function threadLinks(post,route){
  const selected=galleryTopics.get(route);
  const terms=searchKey(gallerySearches.get(route)||'');
  const useSearch=matchesGallerySearch(post,route,terms);
  const posts=availablePosts(route).filter(item=>(selected!==post.tag||item.tag===selected)&&(!useSearch||matchesGallerySearch(item,route,terms)));
  const index=posts.indexOf(post);
  const neighbor=(item,label)=>item?`<a href="#${route}/${esc(item.id)}"><span>${label}</span><span>${galleryText(item.title,route)}</span></a>`:'';
  return `<nav class="gallery-neighbors" aria-label="다른 글 읽기">${neighbor(posts[index-1],'이전 글')}${neighbor(posts[index+1],'다음 글')}</nav>`;
}
function annotatedChart(annotation,pillars,route,hourProvisional=true){
  const columns=[['year','태어난 해'],['month','태어난 달'],['day','태어난 날'],['hour','태어난 시간']]
    .filter(([key])=>pillars[key]).map(([key,label])=>({key,label,value:pillars[key]}));
  if(annotation.extra)columns.push({key:'extra',...annotation.extra});
  const marks=new Set(annotation.marks);
  const marked=(target)=>marks.has(target)?' chart-ink-circle':'';
  return `<figure class="thread-chart">
    <figcaption>${galleryText(annotation.caption,route,{ask:true})}</figcaption>
    <ul class="thread-chart-columns" aria-label="글에서 짚은 사주 글자">
      ${columns.map(({key,label,value})=>`<li>
        <span class="thread-chart-label">${esc(label)}${key==='hour'&&hourProvisional?'<small>임시 계산</small>':''}</span>
        <span class="thread-chart-pair${marked(key)}">
          ${[...value].map((letter,index)=>`<span class="thread-chart-letter${marked(key+(index===0?'-stem':'-branch'))}">${esc(letter)}</span>`).join('')}
        </span>
        <span class="thread-chart-reading">${highlightSajuTerms(value,true)}</span></li>`).join('')}
    </ul>
  </figure>`;
}
function postPicture(image,route){
  const {src,alt,caption,lettering,after,width=1536,height=1024}=image;
  const picture=`<img src="${esc(src)}" alt="${esc(alt)}" width="${esc(width)}" height="${esc(height)}" decoding="async">`;
  if(lettering){
    const {seal,label,title,body}=lettering;
    return `<figure class="gallery-figure cafe-art">
      ${picture}
      <figcaption class="cafe-art-caption">
        <span class="cafe-art-seal" lang="ko-Hani" aria-hidden="true">${esc(seal)}</span>
        <div class="cafe-art-copy">
          ${label?`<span class="cafe-art-label">${galleryText(label,route,{literal:true,ask:true})}</span>`:''}
          <strong class="cafe-art-title">${esc(title)}</strong>
          <p class="cafe-art-body">${esc(body)}</p>
        </div>
      </figcaption>
    </figure>`;
  }
  const figureClass=after===undefined?'gallery-figure':'gallery-figure gallery-figure-inline';
  return `<figure class="${figureClass}">${picture}${caption?`<figcaption>${galleryText(caption,route,{literal:true,ask:true})}</figcaption>`:''}</figure>`;
}
function postPage(post,route){
  const collection=postsCollection(route);
  const {comments,next}=postDiscussion(post,route);
  const staged=isReadingRoute(route);
  const mode=collection.mode;
  const chapters=readingChapters(collection);
  const chapter=post.chapterId?chapters.find(item=>item.id===post.chapterId):chapters.findLast(item=>item.start<=collection.posts.indexOf(post));
  const paragraphs=post.body.trim().split(/\n{2,}/).filter(Boolean);
  const picture=post.image?postPicture(post.image,route):'';
  const chart=staged&&post.annotation?annotatedChart(post.annotation,collection.pillars,route,collection.hourProvisional):'';
  const inlineChart=Boolean(chart)&&(chapter===chapters[0]||!paragraphs.length);
  const blocks=paragraphs.map(paragraph=>`<p class="gallery-opening">${galleryText(paragraph,route,{ask:true})}</p>`);
  let chartDetails='';
  const chartPosition=post.annotation?.after??1;
  if(inlineChart)blocks.splice(chartPosition,0,chart);
  else if(chart)chartDetails=`<details class="reading-reference reading-chart-details"><summary>이 풀이에 쓴 사주표 보기</summary>${chart}</details>`;
  const imagePosition=post.image?.after;
  if(picture&&imagePosition!==undefined){
    blocks.splice(imagePosition+Number(inlineChart&&chartPosition<imagePosition),0,picture);
  }
  const reference=post.respondsTo?`<a class="thread-quote" href="#${route}/${esc(post.respondsTo.id)}">↳ ${galleryText(post.respondsTo.text,route,{literal:true})}</a>`:'';
  const related=reference&&staged?`<details class="reading-reference"><summary>앞 글 참고</summary>${reference}</details>`:reference;
  const body=blocks.join('')+chartDetails;
  const guideAction=staged?`<button type="button" class="button light compact reading-guide-trigger" data-action="reading-guide">${icon('info',15)} 이용 방법</button>`:'';
  const shareAction=`<button type="button" class="button light compact" data-action="share">${icon('copy',16)} 비식별 공유본</button>`;
  const reactions=voteBar(post,route);
  const contents=`<article class="gallery-post">
      <header class="gallery-post-header">
        <span class="tag filled">${esc(post.tag)}</span>${chapter&&chapter.title!==post.tag?` <span class="reading-chapter">${esc(chapter.title)}</span>`:''}
        <h1>${galleryText(post.title,route,{ask:true})}</h1>
        <div class="gallery-post-meta"><span class="gallery-byline"><strong>${cafeAuthor(post,route)}</strong>${config.demoOnly?'':`<span>${modeName[mode]}</span>`}</span>
          <div class="gallery-post-stats"><span>조회 ${postViews.get(post)||0}</span><span>${positiveReaction(route)} <b data-recommendations>${postVotes.get(post)==='up'?1:0}</b></span>
            <button type="button" class="gallery-jump" data-action="jump-comments">댓글 ${visibleCommentCount(post,route)}</button></div>
        </div>
      </header>
      <div class="gallery-post-body">${imagePosition===undefined?picture:''}${staged?body+related:related+body}${config.demoOnly?'':reactions}</div>
      ${config.demoOnly?`<div class="cafe-post-actions">${reactions}${guideAction}${shareAction}</div>`:''}
    </article>
    ${comments}
    ${staged?`<div id="reading-next-slot" aria-live="polite">${next}</div>`:threadLinks(post,route)}`;
  if(config.demoOnly)return cafeLayout(contents,demoReading.progress.boardOf(post.id),{article:true});
  return `<div class="reportwrap gallery-wrap gallery-thread community-gallery">
    ${galleryBar(route)}
    <div class="gallery-tools"><a class="button light compact" href="#${route}">‹ 목록</a>${guideAction}${shareAction}</div>
    ${contents}
    <div class="postactions"><a class="button light" href="#${route}">글 목록</a></div>
  </div>`;
}
function showDialog(html){
  if(dialog.open)dialog.close();$('#dialogbody').innerHTML=html;dialog.showModal();dialog.scrollTop=0;
}
function privacy(){
  showDialog(`<div class="overline">${icon('shield')} 개인정보</div><h2>내 기록은 어디로 가나요?</h2><dl class="policy"><dt>이 기기</dt><dd>내보내기 파일과 붙여넣은 글은 브라우저에서 읽습니다. 민감 표현을 걸러낸 뒤, 직접 선택한 주제와 건수만 로컬 서버로 보냅니다. 필터에 빠지는 표현이 있을 수 있어 전송 전 요약을 확인합니다.</dd>
    <dt>카페에 남긴 답글</dt><dd>직접 남긴 답글은 현재 탭에만 표시됩니다. 페이지를 새로고침하거나 탭을 닫으면 사라집니다.</dd>
    <dt>OpenAI 선택 시</dt><dd>전송 대상은 네 기둥과 계산 유보 사항, 선택한 요약입니다. 서버는 응답 저장을 끈 상태로 요청합니다. OpenAI의 기본 악용 방지 로그는 일반적으로 최대 30일 보관될 수 있습니다.</dd>
    <dt>Google 연결 시</dt><dd>YouTube 읽기 권한으로 선택한 목록을 한 번 읽고 권한 해제를 요청합니다. 서버의 미수령 목록은 최대 10분간 메모리에 둡니다. 원래 서비스의 파일과 활동은 해당 서비스에서 관리합니다.</dd>
    <dt>이용 중인 자료 지우기</dt><dd>아래 버튼으로 현재 탭의 입력, 요약, 작성한 게시글과 서버의 임시 연결 정보를 지울 수 있습니다. ${chatReading?'이 대화에서 작성한 내 사주 게시글은 이 기기에 저장돼 있으며 함께 지울 수 있습니다. ':''}카페의 샘플 글은 앱에 포함한 고정 예시입니다. 이미 복사한 글과 외부 서비스 기록은 각 위치에서 관리하세요.</dd></dl><div class="doclinks"><a href="https://developers.openai.com/api/docs/guides/your-data" target="_blank" rel="noreferrer">OpenAI 데이터 정책</a><a href="https://myaccount.google.com/connections" target="_blank" rel="noreferrer">Google 연결 관리</a></div><button class="button danger" data-action="confirm-erase">${icon('trash')} 내 자료 지우기</button>`);
}
function guide(){
  showDialog(`<div class="overline">${icon('book')} 이용 안내</div><h2>${siteName} 읽는 법</h2><ol class="guide"><li><strong>네 기둥을 계산해요.</strong><p>양력 또는 한국 음력 생일, 현지 시각과 시간대를 입력합니다. 출생지를 모르면 임시 가정이 표시됩니다.</p></li><li><strong>글에 쓸 주제를 골라요.</strong><p>내보낸 파일이나 직접 입력한 요약에서 주제를 확인합니다. 기록을 건너뛰어도 됩니다.</p></li><li><strong>카페에서 글을 읽어요.</strong><p>한 주제씩 나눠 쓴 글이 카페에 올라옵니다. 샘플 글은 직접 들려준 이야기를 각색했고 댓글은 가상입니다.</p></li></ol><button class="button dark" data-action="close">확인</button>`);
}
function continueProvider(provider){
  if(provider==='google'){location.hash='youtube';return;}
  records.mode='ai';
  if(!birth.year&&!birth.month&&!birth.day){
    birth=sampleBirthForm();
    message('이전에 알려주신 샘플 생년월일을 채웠습니다. 날짜와 시간대를 확인해 주세요.');
  }
  location.hash=chart?'records':'birth';
}
function updateReadingCommentNotice(){
  stopReadingCommentNotice?.();
  const notice=$('#reading-new-comments');
  if(!notice)return;
  const end=$('#reading-comment-end');
  const {readyAt}=commentThreads.get(activePost);
  const viewport=window.visualViewport;
  let reachedEnd=false;
  function check(){
    if(!end.isConnected||!notice.hidden)return;
    const bottom=viewport?viewport.offsetTop+viewport.height:window.innerHeight;
    if(end.getBoundingClientRect().bottom<=bottom+1)reachedEnd=true;
    if(reachedEnd&&performance.now()>=readyAt){
      notice.hidden=false;
      const waiting=$('#reading-comment-wait',end);
      if(waiting)waiting.hidden=true;
      stopReadingCommentNotice();
    }
  }
  const timer=setTimeout(check,Math.max(0,Math.ceil(readyAt-performance.now())));
  const observer=window.IntersectionObserver?new IntersectionObserver(check,{threshold:1}):null;
  observer?.observe(end);
  // The viewport can jump past the marker in one scroll or shift under pinch zoom.
  window.addEventListener('scroll',check,{passive:true});
  window.addEventListener('resize',check);
  viewport?.addEventListener('scroll',check);
  viewport?.addEventListener('resize',check);
  stopReadingCommentNotice=()=>{
    clearTimeout(timer);
    observer?.disconnect();
    window.removeEventListener('scroll',check);
    window.removeEventListener('resize',check);
    viewport?.removeEventListener('scroll',check);
    viewport?.removeEventListener('resize',check);
    stopReadingCommentNotice=null;
  };
  check();
}
function focusComment(id){
  const comment=document.getElementById(id);
  comment.focus({preventScroll:true});
  comment.querySelector('.gallery-comment-line').scrollIntoView({block:'nearest'});
}
function showCommentUpdate(post,route,id){
  rerenderCommentThread(post,route);
  const commentJump=$('.gallery-jump');
  if(commentJump)commentJump.textContent=`댓글 ${visibleCommentCount(post,route)}`;
  focusComment(id);
  updateReadingCommentNotice();
}
function rerenderCommentThread(post,route){
  const questionPanelOpen=$('.reading-question-panel')?.open;
  const {comments,next}=postDiscussion(post,route);
  $('#gallery-comments').outerHTML=comments;
  const nextSlot=$('#reading-next-slot');
  if(nextSlot)nextSlot.innerHTML=next;
  if(questionPanelOpen)$('.reading-question-panel').open=true;
}
function askReaderQuestion(post,route,index){
  const thread=commentThreads.get(post);
  const question=post.questions?.[index];
  if(!question||question.after>=thread.storyCount)return;
  const id='reader-question-'+index;
  if(thread.asked.has(index)){focusComment(id);return;}
  thread.entries.push({
    id,parentId:question.after<0?null:'gallery-comment-'+question.after,
    kind:'reader-own-comment',comment:{...readerAccount,text:question.question}
  });
  thread.asked.add(index);
  thread.pendingReplies.push(index);
  thread.readyAt=performance.now()+readingReplyDelay;
  showCommentUpdate(post,route,id);
}
function askSajuTerm(post,route,term,sourceId){
  if(!isReadingRoute(route)||!Object.hasOwn(sajuTerms,term))return;
  const thread=commentThreads.get(post);
  const id='reader-term-'+term;
  if(document.getElementById(id)){
    focusComment(id);
    return;
  }
  const source=thread.entries.find(entry=>entry.id===sourceId);
  const account=source?commentAccount(post,source.comment):post;
  const particle=(term.charCodeAt(term.length-1)-0xac00)%28?'이':'가';
  thread.entries.push({
    id,parentId:source?.id??null,kind:'reader-own-comment',termQuestion:true,literal:true,
    comment:{...readerAccount,text:`${term}${particle} 뭐야?`}
  });
  const answer=postsCollection(route).termAnswers?.[term]??sajuTerms[term][1];
  const responder=participantHasDeparted(post,thread,account)?{author:'운영진'}:account;
  queueLiveReply(thread,id,responder,responder.author==='사랑해요'?loveTermReply(answer):answer);
  showCommentUpdate(post,route,id);
}
function queueReaderReply(post,route,entry,target){
  if(target.kind==='reader-own-comment')return;
  const thread=commentThreads.get(post);
  const account=commentAccount(post,target.comment);
  if(participantHasDeparted(post,thread,account))return;
  const previousReplies=target.replyHistory||[];
  const response=makeGalleryReply({
    message:entry.comment.text,
    targetText:target.literal?target.comment.text:postText(target.comment.text,route),
    revealedText:[post.title,post.body,post.annotation?.caption,...thread.entries.map(item=>item.comment.text)].join('\n'),
    postId:post.id,chapterId:isReadingRoute(route)?post.chapterId:undefined,author:account.author,previousReplies,
    termAnswers:route==='demo-reading'?demoReading.termAnswers:undefined
  });
  queueLiveReply(thread,entry.id,account,response,previousReplies);
}
function queueLiveReply(thread,parentId,account,response,previousReplies=[]){
  thread.pendingLiveReplies.push({
    id:parentId+'-response',parentId,literal:true,kind:'reader-live-reply',
    comment:{author:account.author,ipTag:account.ipTag,text:response},
    replyHistory:[...previousReplies.slice(-5),response]
  });
  thread.readyAt=performance.now()+readingReplyDelay;
}
function refreshReadingComments(post,route){
  const thread=commentThreads.get(post);
  const popup=$('#reading-new-comments');
  if(!popup||popup.hidden||thread.readyAt>performance.now())return;
  const firstNew=thread.entries.length;
  if(thread.pendingLiveReplies.length){
    thread.entries.push(...thread.pendingLiveReplies.splice(0));
  }else if(thread.pendingReplies.length){
    for(const index of thread.pendingReplies.splice(0)){
      const q=post.questions[index];
      const account=commentAccount(post,q.author?q:post.comments[q.after]??post);
      thread.entries.push({id:'reader-reply-'+index,parentId:'reader-question-'+index,kind:'reader-reply',
        comment:{author:account.author,ipTag:account.ipTag,text:q.text}});
      if(q.followup)thread.pendingFollowups.push(index);
    }
  }else if(thread.pendingFollowups.length){
    for(const index of thread.pendingFollowups.splice(0)){
      thread.entries.push({id:'reader-followup-'+index,parentId:'reader-reply-'+index,
        kind:'reader-followup-comment',comment:post.questions[index].followup});
    }
  }else if(isReadingRoute(route)&&thread.storyCount<post.comments.length){
    const preferredBatch=postsCollection(route).commentsPerRefresh;
    const batchSize=Number.isInteger(preferredBatch)&&preferredBatch>0?preferredBatch:2;
    const end=Math.min(thread.storyCount+batchSize,post.comments.length);
    for(let index=thread.storyCount;index<end;index++){
      appendStoryComment(thread,post,index);
      if(!config.demoOnly){
        const followup=readingFollowup(post,post.comments[index],route);
        if(followup)publishedReadingPosts.add(followup);
      }
    }
  }else return;
  thread.readyAt=performance.now()+readingReplyDelay;
  showCommentUpdate(post,route,thread.entries[firstNew].id);
  for(const {id} of thread.entries.slice(firstNew)){
    document.getElementById(id).classList.add('gallery-comment-arriving');
  }
}
function clearDemoReading(){
  if(demoReading){
    demoReading.posts.forEach(post=>publishedReadingPosts.delete(post));
    publishedReadingPosts.delete(demoReading.freePost);
  }
  demoReading=null;
  galleryTopics.delete('demo-reading');
  gallerySearches.delete('demo-reading');
}
function scheduleDemoNotice(){
  const slot=$('#demo-notice-slot');
  if(!slot||demoReading.noticeReady)return;
  const timer=setTimeout(()=>{
    demoReading.noticeReady=true;
    route(false);
    $('#demo-notice-slot')?.classList.add('demo-notice-arriving');
  },360);
  cleanup=()=>clearTimeout(timer);
}
function confirmCafeRead(){
  const post=activePost;
  const progress=demoReading.progress;
  if(hasUnreadDiscussion(post,commentThreads.get(post)))return;
  const previousTier=progress.tier;
  if(!progress.confirm(post.id))return;
  if(post.tag==='정리'){
    $('#reading-next-slot').innerHTML=cafeReadingStep(post,false);
    $('.cafe-reading-progress').focus({preventScroll:true});
    return;
  }
  const tier=progress.tier;
  if(tier>previousTier){
    const unlocked=['','일반 게시판이 열렸어요.','살풀이 게시판이 열렸어요.','운세 게시판 다섯 곳이 열렸어요.','일반 게시판에 정리글이 올라왔어요.'];
    message(`${cafeRanks[tier]}으로 등업됐어요. ${unlocked[tier]}`);
    location.hash=cafeBoardLink(progress.recommendedBoard);
  }else{
    location.hash=cafeBoardLink(progress.boardOf(post.id));
  }
}
function route(scroll=true){
  const previousPost=activePost;
  stopReadingCommentNotice?.();
  revision++;cleanup?.();cleanup=null;activePost=null;
  let [key,postId,boardParam]=location.hash.slice(1).split('/');
  key ||= 'home';
  if(config.demoOnly){
    if(key==='home')clearDemoReading();
    else if(key!=='demo-reading'||!demoReading){
      key=demoReading?'demo-reading':'home';
      history.replaceState(null,'','#'+key);postId=null;
    }
  }
  if(key==='result'&&!result){history.replaceState(null,'','#birth');key='birth';}
  if(key==='reading'&&!chatReading){history.replaceState(null,'','#demo');key='demo';postId=null;}
  if(key==='demo-reading'&&!demoReading){history.replaceState(null,'','#home');key='home';postId=null;}
  if(key==='records'&&!chart){history.replaceState(null,'','#birth');key='birth';}
  if(key==='youtube'&&!config.google){history.replaceState(null,'','#connect');key='connect';}
  if(!['birth','records','demo','result','reading','demo-reading','home','connect','youtube','gallery','library'].includes(key))key='home';
  let demoBoard;
  if(config.demoOnly&&key==='demo-reading'){
    const progress=demoReading.progress;
    demoBoard=progress.recommendedBoard;
    if(postId==='board'){
      if(cafeBoardById.has(boardParam))demoBoard=boardParam;
      else history.replaceState(null,'',cafeBoardLink(demoBoard));
      postId=null;
    }else if(postId&&(!progress.post(postId)||(postId==='notice'&&!demoReading.noticeReady))){
      demoBoard=progress.boardOf(postId)||demoBoard;
      history.replaceState(null,'',cafeBoardLink(demoBoard));postId=null;
    }
  }
  if(dialog.open)dialog.close();
  const activeNav=key==='demo'||key==='result'||key==='demo-reading'?'gallery':key;
  document.querySelectorAll('[data-nav]').forEach(a=>{if(a.dataset.nav===activeNav)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
  const pageName=({
    demo:'샘플 게시글',birth:'출생 정보',records:'기록 선택',result:'내 게시글',reading:'내 사주',
    'demo-reading':cafeTitle(demoReading?.displayName),connect:'연결 설정',youtube:'YouTube 목록 확인',
    gallery:cafeTitle(),library:'사주 풀이 자료실',
  })[key];
  document.title=pageName?`${pageName} · ${siteName}`:siteName;
  const storyTitle=config.demoOnly&&key==='demo-reading'?`${pageName} · ${siteName}`:siteName;
  if(key==='connect'){
    const version=revision;
    main.textContent='연결 설정을 여는 중입니다…';
    import('./setup.js').then(({mountSetup})=>{
      if(revision!==version)return;
      cleanup=mountSetup(main,{config,api,onContinue:continueProvider,onConfigured:async()=>{config=await api('/api/config');return config;}});
    }).catch(()=>{
      if(revision!==version)return;
      main.innerHTML=`<div class="flow">${formTitle('연결 설정을 열 수 없습니다.','실행 창에 표시된 최신 로컬 주소를 확인해 주세요.')}${location.port==='4317'?'<a class="button dark" href="http://127.0.0.1:4318/#connect">새 미리보기에서 열기</a>':''}</div>`;
    });
  }
  if(key==='youtube'){
    main.innerHTML=`<div class="flow"><div class="backrow"><a href="#connect">‹ &nbsp;연결 설정</a></div>${formTitle('내 YouTube 목록 확인','가져올 목록을 선택한 뒤 Google 계정에서 읽기 권한을 허용하세요.')}<div class="records-step"><section class="panel records-panel" id="library"></section></div><div class="actions yt-next"><a class="button light" href="#connect">연결 설정으로</a><button class="button dark" data-action="repeat-ai">OpenAI 해석으로</button></div></div>`;
    cleanup=mountYoutube($('#library'),{config,api});
  }
  if(key==='home')main.innerHTML=home();
  if(key==='library'){
    const saved=chatReading?.pillars;
    const pillars=chart?chart.pillars.map(p=>p.status==='calculated' && !(p.key==='hour'&&chart.assumedTimezone)?p.hangul:'?'):
      saved?[saved.year,saved.month,saved.day,'?']:['병자','기해','임자','?'];
    const posts=(chart?result?.posts:chatReading?.posts)||[];
    const openings=posts.map(p=>Array.from((p.body||'').trim()).slice(0,12).join('')).filter(Boolean);
    cleanup=mountLibrary(main,{api,pillars,openings,label:chart?'방금 입력한 명식':saved?'내 카페 명식 · 출생 시간대 미확정':'예시 명식'});
  }
  if(key==='gallery')main.innerHTML=postsList('gallery');
  if(key==='birth'){main.innerHTML=birthForm();wireBirth();}
  if(isReadingRoute(key)&&postId==='notice'){
    if(config.demoOnly&&key==='demo-reading')demoReading.noticeOpened=true;
    activePost=noticeDiscussion(key);
    main.innerHTML=readingNoticePage(key,activePost);
    document.title=readingNoticeTitle+' · '+storyTitle;
  }else if(key==='demo'||key==='result'||isReadingRoute(key)){
    activePost=(config.demoOnly?demoReading.progress.post(postId):postsCollection(key).posts.find(post=>post.id===postId))||null;
    if(activePost){
      if(!config.demoOnly&&isReadingRoute(key))publishedReadingPosts.add(activePost);
      startCommentThread(activePost,key);
    }
    if(activePost&&activePost!==previousPost)postViews.set(activePost,(postViews.get(activePost)||0)+1);
    if(postId&&!activePost)history.replaceState(null,'','#'+key);
    main.innerHTML=activePost?postPage(activePost,key):config.demoOnly?demoBoardList(demoBoard):postsList(key);
    if(config.demoOnly&&key==='demo-reading'&&!activePost)scheduleDemoNotice();
    if(activePost)document.title=postText(activePost.title,key)+' · '+storyTitle;
  }
  if(key==='records'){
    main.innerHTML=`<div class="flow">${steps(2)}${formTitle('어떤 주제로 글을 만들까요?','글에 담고 싶은 주제를 골라 주세요. 기록 없이도 시작할 수 있습니다.')}${chartCard(chart)}<section id="records"></section></div>`;
    const snapshot=revision;
    cleanup=mountRecords($('#records'),{config,chart,state:records,api,onBack:()=>location.hash='birth',openPrivacy:privacy,generate:async({evidence,mode,aiConsent,signal})=>{
      const data=await api('/api/report',{birth:birthPayload(),evidence,mode,localConsent:birth.localConsent,aiConsent},signal);
      if(snapshot===revision){
        const posts=data.report.posts.map((post,index)=>({
          ...post,
          id:String(index+1),
          tag:post.evidenceIds.length?'작업':'사주',
          author:postAuthors[index%postAuthors.length]
        }));
        result={mode:data.mode,posts:anonymizeGalleryPosts(posts),chapters:data.report.chapters,evidence:data.evidence};
        galleryTopics.delete('result');
        gallerySearches.delete('result');
        location.hash='result';
      }
    }});
  }
  if(scroll){window.scrollTo(0,0);main.focus({preventScroll:true});}
  if(activePost)updateReadingCommentNotice();
}
main.addEventListener('input',event=>{
  if(event.target.id==='demo-display-name')event.target.setCustomValidity('');
  if(event.target.id==='reader-reply-text'&&activePost){
    commentThreads.get(activePost).draft.text=event.target.value;
    event.target.setCustomValidity('');
  }
});
main.addEventListener('change',event=>{
  if(event.target.id==='demo-birth-profile')updateDemoCover(event.target.value);
});
main.addEventListener('submit',async event=>{
  const form=event.target;
  if(form.id==='demo-gallery-form'){
    event.preventDefault();
    const nameField=form.elements.displayName;
    const name=nameField.value.trim();
    const profile=demo.readings.find(item=>item.profileId===form.elements.profile.value);
    if(!name||name.length>24){
      nameField.setCustomValidity('이름이나 닉네임을 24자 이내로 적어 주세요.');
      nameField.reportValidity();
      return;
    }
    if(!profile)return;
    let reading=profile;
    if(config.demoOnly){
      const submit=form.querySelector('button[type="submit"]');
      const error=$('#demo-entry-error',form);
      const version=revision;
      submit.disabled=true;
      error.textContent='';
      try{({reading}=await api('/api/demo/start',{profileId:profile.profileId}));}
      catch(err){error.textContent=err.message;return;}
      finally{submit.disabled=false;}
      if(version!==revision)return;
    }
    clearDemoReading();
    const saved=structuredClone(reading);
    demoReading={...saved,displayName:name,noticeReady:false,noticeOpened:false,
      progress:config.demoOnly?createCafeProgress(saved):null};
    if(!config.demoOnly)publishedReadingPosts.add(demoReading.posts[0]);
    location.hash=config.demoOnly?'demo-reading':'demo-reading/notice';
    return;
  }
  if(form.id==='reader-reply-form'&&activePost){
    event.preventDefault();
    const thread=commentThreads.get(activePost);
    const postRoute=location.hash.slice(1).split('/')[0];
    const text=form.elements.reply.value.trim();
    if(!text){
      form.elements.reply.setCustomValidity('답글 내용을 입력해 주세요.');
      form.elements.reply.reportValidity();
      return;
    }
    const id='reader-message-'+thread.entries.length;
    const entry={id,parentId:thread.draft.parentId,literal:true,kind:'reader-own-comment',comment:{...readerAccount,text}};
    const target=thread.entries.find(comment=>comment.id===entry.parentId);
    thread.entries.push(entry);
    queueReaderReply(activePost,postRoute,entry,target);
    thread.draft=null;
    showCommentUpdate(activePost,postRoute,id);
    return;
  }
  if(form.matches('.gallery-search-form')){
    event.preventDefault();
    gallerySearches.set(topicKey(location.hash.slice(1)),form.elements.keyword.value.trim());
    route(false);
    $('.gallery-search-form input').focus({preventScroll:true});
    return;
  }
  if(!form.matches('.gallery-name-form'))return;
  event.preventDefault();
  const name=form.elements.displayName.value.trim();
  if(location.hash==='#demo-reading'){
    if(name)demoReading.displayName=name;
  }else displayName=name;
  route(false);
  $('.gallery-name-form button').focus({preventScroll:true});
  message('게시글에 표시할 이름을 적용했습니다.');
});
document.addEventListener('click',async e=>{
  const node=e.target.closest('[data-action],[data-vote],[data-gallery-topic]');if(!node)return;
  const act=node.dataset.action;
  if(act==='confirm-cafe-read'&&config.demoOnly&&activePost){confirmCafeRead();return;}
  if(node.hasAttribute('data-gallery-topic')){
    const key=topicKey(location.hash.slice(1));
    const tag=node.dataset.galleryTopic;
    galleryTopics.set(key,tag);
    route(false);
    const selected=Array.from(main.querySelectorAll('[data-gallery-topic]')).find(item=>item.dataset.galleryTopic===tag);
    selected?.focus({preventScroll:true});
    return;
  }
  if(node.dataset.vote&&activePost){
    const vote=node.dataset.vote;
    const choice=postVotes.get(activePost)===vote?null:vote;
    postVotes.set(activePost,choice);
    $('[data-recommendations]').textContent=choice==='up'?'1':'0';
    for(const control of node.parentElement.querySelectorAll('[data-vote]')){
      const selected=control.dataset.vote===choice;
      control.setAttribute('aria-pressed',String(selected));
      control.querySelector('b').textContent=selected?'1':'0';
    }
  }
  if(act==='clear-search'){
    gallerySearches.delete(topicKey(location.hash.slice(1)));
    route(false);
    $('.gallery-search-form input').focus({preventScroll:true});
  }
  if(act==='jump-comments'){
    const comments=$('#gallery-comments');
    comments.focus({preventScroll:true});
    comments.scrollIntoView({block:'start'});
  }
  const postRoute=location.hash.slice(1).split('/')[0];
  if(act==='refresh-reading-comments'&&activePost)refreshReadingComments(activePost,postRoute);
  if(act==='ask-reader-question'&&activePost){
    askReaderQuestion(activePost,postRoute,Number(node.dataset.question));
  }
  if(act==='ask-saju-term'&&activePost){
    askSajuTerm(activePost,postRoute,node.dataset.term,node.closest('.gallery-comment-line')?.parentElement.id);
  }
  if(act==='jump-reader-question'&&activePost){
    e.preventDefault();
    focusComment('reader-question-'+node.dataset.question);
  }
  if(act==='jump-reply-target'&&activePost)focusComment(node.getAttribute('aria-controls'));
  if((act==='write-reply'||act==='cancel-reply')&&activePost){
    const thread=commentThreads.get(activePost);
    const parentId=node.closest('li').id;
    thread.draft=act==='write-reply'?{parentId,text:thread.draft?.text||''}:null;
    rerenderCommentThread(activePost,postRoute);
    const control=thread.draft?$('#reader-reply-text'):$('#'+parentId+' .gallery-write-reply');
    control.focus();
    updateReadingCommentNotice();
  }
  if(act==='privacy')privacy();
  if(act==='guide')guide();
  if(act==='reading-guide')showDialog(`<section class="reading-guide-dialog" aria-labelledby="reading-guide-title"><h2 id="reading-guide-title">${readingNoticeTitle}</h2>${readingNoticeCopy()}</section><button class="button dark" data-action="close">확인</button>`);
  if(act==='close')dialog.close();
  if(act==='samplebirth'){birth=sampleBirthForm();chart=null;result=null;route(false);message('샘플 출생 정보를 채웠습니다. 임시 가정을 확인해 주세요.');}
  if(act==='sample-ai'||act==='repeat-ai'){
    if(act==='sample-ai'){
      birth=sampleBirthForm();chart=null;result=null;records=newRecordState();
      records.reviews.manual=reviewText(sampleInputs.manualRecord,'manual');
      records.sampleTopics=true;
    }
    records.mode='ai';
    if(config.ai)continueProvider('openai');else location.hash='connect';
  }
  if(act==='confirm-erase')showDialog(`<h2>내 자료를 지울까요?</h2><p>현재 탭의 입력·기록·게시글과 연결 설정 화면에서 입력한 키를 지웁니다. ${chatReading?'이 기기에 저장한 내 사주 게시글도 지웁니다. ':''}환경 변수나 .env에 직접 설정한 키는 원래 위치에서 관리합니다.</p><div class="actions"><button class="button light" data-action="close">취소</button><button class="button danger" data-action="erase">모두 지우기</button></div>`);
  if(act==='erase'){
    revision++;cleanup?.();cleanup=null;birth=emptyBirth();chart=null;records=newRecordState();result=null;displayName='';postVotes=new WeakMap();postViews=new WeakMap();commentThreads=new WeakMap();galleryTopics.clear();gallerySearches.clear();
    clearDemoReading();
    let deleted=true;try{await api('/api/erase',{connectionSettings:true,...(chatReading?{chatReading:true}:{})});chatReading=null;publishedReadingPosts.clear();$('[data-nav=reading]').hidden=true;config=await api('/api/config');}catch{deleted=false;}
    history.replaceState(null,'','#home');route();message(deleted?'이용 중인 자료를 지웠습니다.':'탭 자료를 지웠습니다. 서버의 키 삭제를 확인하려면 다시 연결하거나 서버를 종료해 주세요.');
  }
  if(act==='share'&&activePost){
    const evidence=result?.evidence||[];
    const text=shareEdition(activePost,evidence);
    showDialog(`<div class="overline">${icon('shield')} 비식별 공유본</div><h2>공유할 글을 확인하세요.</h2><textarea id="sharedtext" readonly aria-label="비식별 공유 글" rows="9">${esc(text)}</textarea><button class="button dark" data-action="copy-share">${icon('copy')} 글 복사</button><span id="copystatus" role="status"></span>`);
  }
  if(act==='copy-share'){
    const area=$('#sharedtext');try{await navigator.clipboard.writeText(area.value);$('#copystatus').textContent='복사했습니다.';}catch{area.focus();area.select();$('#copystatus').textContent='글을 선택했습니다. 복사 기능을 사용해 주세요.';}
  }
});
dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});
$('.skip').addEventListener('click',e=>{e.preventDefault();main.focus();main.scrollIntoView();});
try{
  config=await api('/api/config');
  document.body.classList.toggle('isolated-demo',config.demoOnly===true);
  if(config.demoOnly)demo=await api('/api/demo');
  else{
    [demo,{reading:chatReading},sampleInputs]=await Promise.all([
      api('/api/demo'),api('/api/chat-reading').catch(()=>({reading:null})),api('/api/demo/sample-inputs'),
    ]);
    demo.posts=anonymizeGalleryPosts(demo.posts);
    if(chatReading?.posts[0])publishedReadingPosts.add(chatReading.posts[0]);
    $('[data-nav=reading]').hidden=!chatReading;
  }
  window.addEventListener('hashchange',()=>route());route(false);
}catch(e){main.innerHTML=`<div class="flow">${formTitle('기록소를 열지 못했습니다.',esc(e.message))}<a href="./" class="button dark">다시 열기</a></div>`;}

