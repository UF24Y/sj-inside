// This module also runs in Node for server-side validation. No network or persistent storage.
export const MAX_FILE_MB = 20;
const MAX_BYTES = MAX_FILE_MB * 1024 * 1024;
const MAX_PASSAGE = 12000;
const MAX_RECORDS = 200000;

export const SUMMARY_PROMPT = '이 대화에서 내가 직접 언급한 취미나 작업 주제를 한국어로 한 줄에 하나씩 적어 줘. 영상 편집, 디자인, 개발처럼 넓은 분야로 표현해 줘. 이름, 연락처, 계정, 작품명, 조직명, 날짜, 위치, 건강, 신념, 재정, 성생활, 타인의 정보는 빼 줘. 알 수 없는 관심사는 추측하지 마.';

const topics = [
  ['video', '영상 제작·편집', /영상\s*(?:제작|편집|촬영)|동영상|브이로그|프리미어\s*프로|다빈치\s*리졸브|애프터\s*이펙트|모션\s*그래픽|영화\s*(?:제작|촬영)|video\s*(?:edit|produc)|filmmak|cinematograph|after effects|davinci resolve/i],
  ['design', '그림·디자인', /디자인|드로잉|일러스트|스케치|피그마|타이포그래피|포토샵|인테리어|figma|graphic design|illustrat|drawing|typography|photoshop/i],
  ['coding', '개발·자동화', /프로그래밍|코딩|소프트웨어|자동화|앱\s*개발|웹\s*개발|파이썬|인공지능|생성형\s*AI|\b(?:coding|python|javascript|typescript|automation|programming|chatgpt|AI)\b/i],
  ['music', '음악·연주', /음악|작곡|기타\s*연주|피아노|플레이리스트|사운드\s*디자인|\b(?:music|piano|guitar|songwriting|jazz|mixing)\b/i],
  ['story', '글쓰기·스토리텔링', /글쓰기|시나리오|스토리텔링|세계관|소설|시놉시스|스토리보드|storytell|screenwrit|creative writing|storyboard/i],
  ['games', '게임·애니메이션', /게임|애니메이션|서브컬처|웹툰|만화|\b(?:games?|gaming|anime|animation|manga|webtoon)\b/i],
  ['planning', '기획·창업', /사업\s*(?:기획|구상|아이디어)|사업계획|창업|브랜딩|사업화|프로젝트\s*기획|스타트업|프로토타입|\b(?:startup|branding|prototype|entrepreneurship)\b/i],
  ['learning', '학습·연구', /공부|독학|학습|튜토리얼|외국어|리서치|연구\s*방법|영어\s*회화|\b(?:learning|tutorials?|studying|coursework)\b/i],
  ['books', '독서·출판', /독서|책\s*(?:읽기|리뷰)|서평|출판|\b(?:books?|publishing|bookstore)\b/i],
  ['cooking', '요리·베이킹', /요리|레시피|베이킹|제과|제빵|\b(?:baking|cooking|recipe)\b/i],
  ['craft', '공예·만들기', /공예|뜨개질|목공|도예|가죽공방|\b(?:crafts?|knitting|pottery|woodworking)\b/i],
  ['outdoor', '운동·야외 활동', /러닝|달리기|트레킹|등산|자전거|축구|필라테스|수영|클라이밍|마라톤|\b(?:hiking|cycling|running|soccer|swimming|climbing)\b/i]
];

const sensitive = [
  /정신과|우울|불안장애|트라우마|자해|자살|질병|질환|투병|병원|진료|진단|처방|항암|암\s*치료|당뇨|혈압|복용|치매|장애인|산부인과|임신|유산|난임|건강\s*(?:상태|검진|기록)|알코올\s*중독|성병|치료/,
  /성적\s*지향|성소수자|트랜스젠더|성생활|성관계|성폭력|포르노|성인물|성인\s*영상|레즈비언|동성애|양성애|정치|정당|투표|대선|시위|노동조합|노조|진보정당|보수정당|종교|신앙|교회|성당|불교|기독교|이슬람|무슬림|인종|민족|전과\s*기록/,
  /은행|계좌|대출|채무|빚|부채|신용카드|카드번호|주민\s*(?:등록|번호)|여권|비밀번호|인증\s*(?:코드|번호)|이메일|전화번호|우편번호|집\s*주소|연락처|생년월일|소득|연봉/,
  /\b(?:medical|healthcare|diagnosis|therapy|cancer|diabetes|depression|anxiety|adhd|bipolar|suicid\w*|pregnan\w*|trauma|disabilit\w*|sexual\w*|porn\w*|lgbt\w*|gay|lesbian|bisexual|transgender|politic\w*|election|vot(?:e|ing)|religio\w*|church|muslim|christian|ethnic\w*|race|debt|mortgage|salary|bank|password|passport|credit card|social security|phone number|email address)\b/i,
  /@[\w.-]{1,255}\.[a-z]{2,}|(?:^|\D)(?:\+82[- .]?)?0?1[016789][- .]?\d{3,4}[- .]?\d{4}(?!\d)|\b\d{6}[- ]?[1-8]\d{6}\b|\b(?:sk|sk-proj)-[\w-]{10,}/i
];

function normalize(text) {
  return text.normalize('NFKC').replace(/[\u200b-\u200f\ufeff]/g, '');
}

export function isSensitive(text) {
  if (typeof text !== 'string' || text.length > MAX_PASSAGE) return true;
  const value = normalize(text);
  return sensitive.some(pattern => pattern.test(value));
}

function topicMatches(text) {
  const value = normalize(text);
  return topics.filter(([, , pattern]) => pattern.test(value));
}

export function classifyTopics(text) {
  if (isSensitive(text)) return [];
  return topicMatches(text).map(([, label]) => label);
}

// Only this closed vocabulary and bounded integer counts may leave the review step.
const origins = {
  chatgpt: ['chatgpt', 'ChatGPT 내보내기의 사용자 메시지'],
  manual: ['manual', '직접 입력한 요약의 항목'],
  'takeout-watch': ['takeout', 'Takeout의 YouTube 시청 기록'],
  'takeout-search': ['takeout', 'Takeout의 YouTube 검색 기록'],
  'takeout-google': ['takeout', 'Takeout의 Google 검색 기록']
};

function candidate(origin, topic, count) {
  const [source, prefix] = origins[origin];
  return {id: origin + '-' + topic[0], source, text: prefix + ' 중 ' + count + '건에서 ‘' + topic[1] + '’ 주제가 언급됐습니다.'};
}

export function validateImportEvidence(item) {
  if (!item || typeof item.text !== 'string' || item.text.length > 180) return false;
  if (Object.keys(item).some(key => !['id', 'source', 'text'].includes(key))) return false;
  const count = Number(item.text.match(/ 중 (\d{1,6})건에서 /)?.[1]);
  if (!Number.isInteger(count) || count < 1 || count > MAX_RECORDS) return false;
  for (const [origin, [source]] of Object.entries(origins)) {
    if (source !== item.source) continue;
    for (const topic of topics) {
      if (item.id === origin + '-' + topic[0]) return item.text === candidate(origin, topic, count).text;
    }
  }
  return false;
}

export function getEvidenceTopic(item) {
  if (!validateImportEvidence(item)) return '';
  return topics.find(([id]) => item.id.endsWith('-' + id))[1];
}

function* chatgptRows(data) {
  const conversations = Array.isArray(data) ? data : data?.conversations || (data?.mapping ? [data] : null);
  if (!Array.isArray(conversations)) throw new Error('ChatGPT 내보내기의 대화 JSON 파일을 선택해 주세요.');
  let recognized = false;
  for (const conversation of conversations) {
    if (!conversation?.mapping || typeof conversation.mapping !== 'object' || Array.isArray(conversation.mapping)) continue;
    recognized = true;
    const mapping = conversation.mapping;
    // A regenerated answer may leave an inactive branch. Use the active path when supplied.
    let nodes;
    if (typeof conversation.current_node === 'string' && Object.hasOwn(mapping, conversation.current_node)) {
      nodes = [];
      let id = conversation.current_node;
      const seen = new Set();
      while (typeof id === 'string' && Object.hasOwn(mapping, id) && !seen.has(id)) {
        seen.add(id);
        const node = mapping[id];
        nodes.push(node);
        id = node?.parent;
      }
    } else {
      nodes = Object.values(mapping);
    }
    for (const node of nodes) {
      const m = node?.message;
      if (m?.author?.role !== 'user' || m.metadata?.is_visually_hidden_from_conversation || m.metadata?.is_user_system_message) continue;
      if (!['text','multimodal_text'].includes(m.content?.content_type) || !Array.isArray(m.content.parts)) continue;
      const typed = m.content.parts.filter(part => typeof part === 'string');
      if (typed.length) yield ['chatgpt', typed.join(' ')];
    }
  }
  if (!recognized && conversations.length) throw new Error('대화 형식을 확인할 수 없습니다. 대화 JSON이나 요약 붙여넣기를 이용해 주세요.');
}

function activityLink(href) {
  if (typeof href !== 'string' || href.length > 8192) return null;
  try {
    const url = new URL(href);
    if (!['https:', 'http:'].includes(url.protocol)) return null;
    const host = url.hostname.toLowerCase();
    if (['youtube.com','www.youtube.com','m.youtube.com','music.youtube.com'].includes(host)) {
      if ((url.pathname === '/watch' && url.searchParams.has('v')) || /^\/(shorts|live)\/[^/]+/.test(url.pathname)) return 'takeout-watch';
      if (url.pathname === '/results' && url.searchParams.has('search_query')) return 'takeout-search';
    }
    if (host === 'youtu.be' && url.pathname.length > 1) return 'takeout-watch';
    if (/^(?:www\.)?google\.(?:com|co\.kr|co\.uk|co\.jp|com\.au|ca|de|fr|es|it)$/.test(host) && url.pathname === '/search' && url.searchParams.has('q')) return 'takeout-google';
  } catch { /* unrecognized or incomplete link */ }
  return null;
}

// A link to a watch page can also appear in a visit or an advertisement.
// The event description must affirm the action in a supported export language.
const watched = /^(?:Watched|You watched)\s|(?:시청했습니다|시청함|시청하셨습니다)\s*[.!]?$/i;
const queried = /^(?:Searched for|You searched for)\s|(?:검색했습니다|검색함|검색하셨습니다)\s*[.!]?$/i;

function matchesAction(origin, text) {
  return (origin === 'takeout-watch' ? watched : queried).test(text.trim());
}

function* googleRows(data) {
  if (!Array.isArray(data)) throw new Error('Takeout에서 내보낸 YouTube 기록 또는 내 활동 JSON 파일을 선택해 주세요.');
  let recognized = false;
  for (const row of data) {
    if (typeof row?.title !== 'string') continue;
    // Confirm an activity export shape, then exclude records from other Google products.
    if (typeof row.time !== 'string' && !Array.isArray(row.products) && typeof row.header !== 'string') continue;
    recognized = true;
    const labels = [row.header, ...(Array.isArray(row.products) ? row.products : [])].filter(x => typeof x === 'string');
    let origin = activityLink(row.titleUrl);
    const youtube = labels.some(x => /^(?:youtube(?: music)?|유튜브)$/i.test(x));
    const search = labels.some(x => /^(?:(?:google )?search|(?:google )?검색)$/i.test(x));
    if (labels.length && !youtube && !search) continue;
    if (origin && labels.length && (origin === 'takeout-google' ? !search : !youtube)) continue;
    // Deleted videos may have no title URL. Accept only positively identified action titles.
    if (!origin && !row.titleUrl && youtube) {
      if (watched.test(row.title.trim())) origin = 'takeout-watch';
      else if (queried.test(row.title.trim())) origin = 'takeout-search';
    }
    if (!origin && !row.titleUrl && search && queried.test(row.title.trim())) origin = 'takeout-google';
    if (origin && matchesAction(origin, row.title)) yield [origin, row.title];
  }
  if (data.length && !recognized) throw new Error('활동 기록 형식을 확인할 수 없습니다. Takeout의 기록 JSON 또는 HTML을 선택해 주세요.');
}

function entities(text) {
  const named = {amp:'&', lt:'<', gt:'>', quot:'"', apos:"'", nbsp:' '};
  return text.replace(/&(amp|lt|gt|quot|apos|nbsp|#\d{1,7}|#x[\da-f]{1,6});/gi, (match, token) => {
    const t = token.toLowerCase();
    if (t[0] !== '#') return named[t];
    const code = t[1] === 'x' ? parseInt(t.slice(2), 16) : Number(t.slice(1));
    return code > 0 && code <= 0x10ffff ? String.fromCodePoint(code) : ' ';
  });
}

function* htmlRows(html) {
  // Read link labels only. Never create a browser DOM from an export or fetch its resources.
  if (!/class\s*=\s*["'][^"'<>]{0,250}\b(?:outer-cell|content-cell)\b/i.test(html)) {
    throw new Error('Takeout의 활동 기록 HTML을 선택해 주세요. ChatGPT는 대화 JSON으로 가져올 수 있습니다.');
  }
  let inBlockedTag = '';
  let inComment = false;
  let inMainCell = false, firstAnchor = true;
  let origin = null, label = '', oversized = false;
  let pos = 0;
  while (pos < html.length) {
    if (inComment) {
      const endComment = html.indexOf('-->', pos);
      if (endComment < 0) break;
      inComment = false;
      pos = endComment + 3;
      continue;
    }
    const start = html.indexOf('<', pos);
    if (start === -1) break;
    if (inMainCell && !inBlockedTag && !oversized) {
      if (label.length + start - pos > MAX_PASSAGE) oversized = true;
      else label += html.slice(pos, start);
    }
    if (html.startsWith('<!--', start)) {
      inComment = true;
      pos = start + 4;
      continue;
    }
    const end = html.indexOf('>', start + 1);
    if (end === -1) break;
    pos = end + 1;
    if (end - start > 16384) continue;
    const tag = html.slice(start + 1, end);
    if (inBlockedTag) {
      if (tag.trim().toLowerCase() === '/' + inBlockedTag) inBlockedTag = '';
      continue;
    }
    const block = tag.match(/^(script|style|template)\b/i);
    if (block) { inBlockedTag = block[1].toLowerCase(); continue; }
    if (/^div(?:\s|$)|^\/div\s*$|^br\b/i.test(tag)) {
      if (inMainCell && origin && !oversized) {
        const description = entities(label);
        if (matchesAction(origin, description)) yield [origin, description];
      }
      inMainCell = /^div\s/i.test(tag) && /\bclass\s*=\s*["'][^"'<>]*\bcontent-cell\b/i.test(tag);
      firstAnchor = true;
      label = '';
      oversized = false;
      origin = null;
    } else if (inMainCell && firstAnchor && /^a\s/i.test(tag)) {
      firstAnchor = false;
      const href = tag.match(/\shref\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>]+))/i);
      origin = href ? activityLink(entities(href[1] ?? href[2] ?? href[3])) : null;
    }
  }
}

function* manualRows(text) {
  for (const line of text.split(/\r?\n/)) {
    const value = line.trim();
    if (value) yield ['manual', value];
  }
}

export function reviewText(text, source) {
  if (!['manual', 'takeout', 'chatgpt'].includes(source)) throw new Error('가져올 자료 종류를 선택해 주세요.');
  if (typeof text !== 'string' || !text.trim()) throw new Error('파일이 비어 있거나 입력한 내용이 없습니다.');
  if (text.length > MAX_BYTES || (source === 'manual' && text.length > 12000)) {
    throw new Error('자료가 너무 큽니다. 짧은 요약을 붙여넣거나 작은 파일로 나눠 주세요.');
  }
  const body = text.trim();
  let rows;
  if (source === 'manual') rows = manualRows(body);
  else if (source === 'takeout' && body.startsWith('<')) rows = htmlRows(body);
  else {
    let data;
    try { data = JSON.parse(body); } catch { throw new Error('JSON을 읽을 수 없습니다. 압축을 풀고 올바른 파일을 선택해 주세요.'); }
    rows = source === 'chatgpt' ? chatgptRows(data) : googleRows(data);
  }
  let scanned = 0, excluded = 0, unclassified = 0;
  const counts = new Map();
  for (const [origin, value] of rows) {
    if (++scanned > MAX_RECORDS) throw new Error('활동 항목이 너무 많습니다. 작은 파일로 나눠 주세요.');
    if (isSensitive(value)) { excluded++; continue; }
    const found = topicMatches(value);
    if (!found.length) unclassified++;
    for (const topic of found) {
      const id = origin + '-' + topic[0];
      const oldCount = counts.get(id)?.count || 0;
      counts.set(id, {origin, topic, count: oldCount + 1});
    }
  }
  const candidates = [...counts.values()]
    .sort((a, b) => b.count - a.count || a.topic[0].localeCompare(b.topic[0]))
    .map(({origin, topic, count}) => candidate(origin, topic, count));
  return {source, candidates, scanned, excluded, unclassified};
}

export async function reviewFile(file, source) {
  if (!file || typeof file.text !== 'function') throw new Error('파일을 선택해 주세요.');
  if (!['takeout','chatgpt'].includes(source)) throw new Error('이 파일에 해당하는 자료 종류를 선택해 주세요.');
  if (/\.(zip|gz|tgz)$/i.test(file.name)) throw new Error('압축을 먼저 풀어 주세요. ChatGPT는 대화 JSON, Takeout은 기록 JSON 또는 HTML을 선택합니다.');
  if (!(source === 'takeout' ? /\.(json|html?)$/i : /\.json$/i).test(file.name)) {
    throw new Error(source === 'takeout' ? 'Takeout에서 추출한 기록 JSON 또는 HTML 파일을 선택해 주세요.' : 'ChatGPT 압축을 푼 뒤 conversations.json 또는 번호가 붙은 대화 JSON을 선택해 주세요.');
  }
  if (file.size > MAX_BYTES) throw new Error('파일당 최대 ' + MAX_FILE_MB + 'MB입니다. 작은 파일이나 요약 붙여넣기를 이용해 주세요.');
  return reviewText(await file.text(), source);
}
