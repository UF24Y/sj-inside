import {getEvidenceTopic} from './imports.js';

export function shareEdition(post,evidence){
  if(post.share){
    return ['SJ 인사이드 | 비식별 게시글',post.share.title,post.share.body].join('\n\n');
  }

  // Only controlled topic labels are copied into a generated post's share copy.
  const ids=new Set(post.evidenceIds);
  const topics=[...new Set(evidence.filter(item=>ids.has(item.id)).map(getEvidenceTopic).filter(Boolean))];
  const title=topics.length?`${topics.join(' · ')} 쪽 해본 사람 있음?`:'사주 한 자리를 읽을 때 위아래 같이 보는 사람 있음?';
  const body=topics.length
    ?`요즘 ${topics.join(', ')}에 관심이 생겨서 하나 골라 작은 작업부터 해보고 싶음. 비슷한 거 해본 사람들은 어디서 시작했음?`
    :'한 글자에서 처음 떠오른 그림에 바로 아래 글자까지 더해 보니까 읽히는 장면이 달라지더라. 갤러들은 어느 자리부터 보는지 궁금함.';
  return ['SJ 인사이드 | 비식별 게시글',title,body].join('\n\n');
}
