export const isNumberedGuest = name => /^사주갤럼 [1-9]\d*$/.test(name);

// Numbering belongs to the whole gallery so returning authors keep their names.
export function anonymizeGalleryPosts(posts) {
  const result = structuredClone(posts);
  const accounts = result.flatMap(post => [
    post, ...post.comments,
    ...(post.questions || []).flatMap(q => [q, q.followup].filter(a => a?.author))
  ]);
  const numbers = new Set(accounts.filter(a => isNumberedGuest(a.author)).map(a => a.author));
  const tags = new Set(['100.79', ...accounts.map(a => a.ipTag).filter(Boolean)]);
  const aliases = new Map();
  let number = 1, tag = 64, assigned = 0;
  for (const account of accounts) {
    const name = account.author;
    if (name === '글쓴이' || name === 'ㅇㅇ' || isNumberedGuest(name)) continue;
    if (account.ipTag) {
      account.author = 'ㅇㅇ';
      continue;
    }
    let alias = aliases.get(name);
    if (!alias) {
      assigned++;
      while (tags.has('100.' + tag)) tag++;
      if (assigned % 3 === 0 && tag <= 127) {
        alias = {author:'ㅇㅇ', ipTag:'100.' + tag++};
      } else {
        while (numbers.has('사주갤럼 ' + number)) number++;
        alias = {author:'사주갤럼 ' + number++};
      }
      if (name) aliases.set(name,alias);
    }
    Object.assign(account,alias);
  }
  return result;
}
