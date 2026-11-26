export const cafeBoards = Object.freeze([
  { id: 'notice', label: '공지사항', level: 0 },
  { id: 'general', label: '일반', level: 1 },
  { id: 'sinsal', label: '살풀이', level: 2 },
  { id: 'money', label: '재물운', level: 3 },
  { id: 'business', label: '사업운', level: 3 },
  { id: 'love', label: '연애운', level: 3 },
  { id: 'health', label: '건강운', level: 3 },
  { id: 'study', label: '학업운', level: 3 },
].map(Object.freeze));

const boardLevels = new Map(cafeBoards.map(({ id, level }) => [id, level]));
const fortuneBoards = cafeBoards.filter(({ level }) => level === 3).map(({ id }) => id);
const noticePost = Object.freeze({ id: 'notice' });

function makeSummary(closing, advice, paragraphs) {
  if (!closing?.id) return undefined;
  const title = '사주 분석 정리';
  const body = [...paragraphs, advice?.body, closing.body].filter(Boolean).join('\n\n');
  const shareBody = [advice?.share?.body, closing.share?.body].filter(Boolean).join('\n\n');
  return { ...closing, title, tag: '정리', body, share: shareBody ? { title, body: shareBody } : undefined };
}

export function createCafeProgress(reading) {
  const chapters = new Map(reading.posts.map(post => [post.chapterId, post]));
  const chapter = id => chapters.get(`preset-${id}`);
  const extras = reading.boardExtras ?? {};
  const plannedPosts = new Map([
    ['notice', [noticePost]],
    ['general', [chapter('intro'), chapter('concern'), chapter('timing'), reading.freePost]],
    ['sinsal', [chapter('sinsal')]],
    ['money', [chapter('money')]],
    ['business', [extras.business]],
    ['love', [chapter('love')]],
    ['health', [extras.health]],
    ['study', [extras.study]],
  ]);

  const postIndex = new Map();
  const boardPosts = new Map();
  const confirmed = new Set();

  for (const [boardId, planned] of plannedPosts) {
    const posts = [];
    for (const post of planned) {
      if (typeof post?.id !== 'string' || !post.id || postIndex.has(post.id)) continue;
      postIndex.set(post.id, { post, boardId });
      posts.push(post);
    }
    boardPosts.set(boardId, posts);
  }
  const advice = chapter('advice');
  const closing = chapter('closing');
  const summary = postIndex.has(closing?.id)
    ? undefined
    : makeSummary(closing, advice, reading.summaryParagraphs ?? []);
  if (summary) postIndex.set(summary.id, { post: summary, boardId: 'general' });
  if (advice?.id && !postIndex.has(advice.id)) postIndex.set(advice.id, { boardId: 'general' });

  function complete(boardId) {
    const posts = boardPosts.get(boardId);
    return posts.length === plannedPosts.get(boardId).length && posts.every(post => confirmed.has(post.id));
  }

  function tier() {
    if (!complete('notice')) return 0;
    if (!complete('general')) return 1;
    if (!complete('sinsal')) return 2;
    return fortuneBoards.every(complete) ? 4 : 3;
  }

  function isUnlocked(boardId) {
    const level = boardLevels.get(boardId);
    return level !== undefined && level <= tier();
  }

  function postsForBoard(boardId) {
    const posts = boardPosts.get(boardId) ?? [];
    return boardId === 'general' && summary && tier() === 4 ? [summary, ...posts] : posts;
  }

  function post(postId) {
    const entry = postIndex.get(postId);
    if (!entry?.post || !isUnlocked(entry.boardId) || (entry.post === summary && tier() < 4)) return undefined;
    return entry.post;
  }

  return {
    get tier() { return tier(); },
    get recommendedBoard() {
      return ['notice', 'general', 'sinsal'][tier()] ?? fortuneBoards.find(id => !complete(id)) ?? 'general';
    },
    isUnlocked,
    posts(boardId) {
      return boardId !== 'notice' && isUnlocked(boardId) ? [...postsForBoard(boardId)] : [];
    },
    post,
    boardOf(postId) { return postIndex.get(postId)?.boardId; },
    isRead(postId) { return confirmed.has(postId); },
    confirm(postId) {
      if (confirmed.has(postId) || !post(postId)) return false;
      confirmed.add(postId);
      return true;
    },
    counts(boardId) {
      const posts = postsForBoard(boardId);
      return { read: posts.filter(item => confirmed.has(item.id)).length, total: posts.length };
    },
  };
}
