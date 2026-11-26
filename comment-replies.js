const sinsalTerms = {
  장성살: ['將星煞', '여럿이 할 때 중심을 잡거나 앞에 서는 쪽으로 읽는 이름이야.\n\n갤주 표에선 해와 날의 아랫글자 ‘자’에서 봤어.'],
  양인살: ['羊刃煞', '힘이 세게 붙는 자리를 읽는 말이야.\n\n한 번 정한 걸 밀어붙이는 힘과, 힘을 빼는 게 어려울 때를 같이 떠올려 봤어.'],
  녹신: ['祿神', '익힌 솜씨를 써서 자기 몫을 꾸리는 쪽으로 읽는 이름이야.\n\n갤주 표에선 날 위의 ‘임’과 달 아래의 ‘해’를 같이 봤어.'],
  망신살: ['亡神煞', '여기선 미처 의도하지 않은 말이나 일이 눈에 띄는 순간으로 읽었어.\n\n갤주 표에선 해와 날 아래의 ‘자’를 기준으로 달 아래 ‘해’에서 찾아.'],
  겁살: ['劫煞', '바깥에서 변수가 들어와 내 시간이나 몫이 달라지는 쪽으로 읽었어.\n\n이 글에선 해나 날 아래 ‘자’를 기준으로 시간 아래 ‘사’를 봤어.'],
  천을귀인: ['天乙貴人', '혼자 막힌 일이 사람의 도움을 받아 풀리는 쪽으로 읽는 이름이야.\n\n이 글에선 날 위 ‘임’을 기준으로 시간 아래 ‘사’를 봤어.'],
  신살: ['神煞', '태어난 해나 날 같은 기준 글자와 다른 칸을 짝지어 붙이는 전통 이름이야.\n\n글마다 어디를 봤는지랑 그걸 어떻게 읽었는지 같이 적었어.'],
};

export const sajuTerms = {
  ...sinsalTerms,
  정축: ['丁丑', '‘정’과 ‘축’을 붙여 읽은 두 글자야.'],
  경술: ['庚戌', '‘경’과 ‘술’을 붙여 읽은 두 글자야.'],
  병술: ['丙戌', '‘병’과 ‘술’을 붙여 읽은 두 글자야.'],
  무인: ['戊寅', '‘무’와 ‘인’을 붙여 읽은 두 글자야.'],
  갑인: ['甲寅', '‘갑’과 ‘인’을 붙여 읽은 두 글자야.'],
  기묘: ['己卯', '‘기’와 ‘묘’를 붙여 읽은 두 글자야.'],
  계유: ['癸酉', '‘계’와 ‘유’를 붙여 읽은 두 글자야.'],
  갑진: ['甲辰', '‘갑’과 ‘진’을 붙여 읽은 두 글자야.'],
  무신: ['戊申', '‘무’와 ‘신’을 붙여 읽은 두 글자야. 이 글에서는 10년 구간 하나를 가리켜.'],
  정유: ['丁酉', '‘정’과 ‘유’를 붙여 읽은 두 글자야.'],
  문창귀인: ['文昌貴人', '배우고 익힌 것을 글이나 말로 정리하는 솜씨를 읽는 전통 이름이야.'],
  화개살: ['華蓋煞', '혼자 몰입하거나 익힌 것을 깊게 파는 쪽으로 읽기도 하는 이름이야.'],
  병자: ['丙子', '태어난 해를 적은 두 글자야.\n\n갤주 표에선 해 칸 위가 ‘병’, 아래가 ‘자’임.'],
  기해: ['己亥', '갤주가 태어난 달 칸에 있는 두 글자야.\n\n위에 ‘기’, 그 밑에 ‘해’ 보이지? 그 둘을 붙여서 기해라고 읽어.'],
  임자: ['壬子', '갤주가 태어난 날을 적은 두 글자야.\n\n날 칸을 보면 위에 ‘임’, 아래에 ‘자’가 있어.'],
  을사: ['乙巳', '여기서는 갤주가 태어난 시간 칸에 붙인 두 글자야.\n\n아래의 ‘사’에 해당하는 시각은 오전 9시부터 11시 전까지야.'],
  병오: ['丙午', '‘병’과 ‘오’를 짝지은 이름이야.\n\n2026년 운을 볼 땐 입춘부터 그해를 이 두 글자로 적어.'],
  정미: ['丁未', '‘정’과 ‘미’를 짝지은 이름이야.\n\n2027년 운을 볼 땐 입춘부터 그해를 이 두 글자로 적어.'],
  비견: ['比肩', '나랑 비슷한 유형을 가리키는 말임.\n\n내 기준 글자랑 나머지 글자를 비교해서, 같은 종류에 같은 음·양이면 그렇게 불러.'],
  겁재: ['劫財', '나랑 비슷한 힘끼리 힘을 합치거나 몫을 두고 겨루는 쪽으로 읽는 말이야.\n\n같은 종류의 기운인데 음·양이 다른 짝에 붙여.'],
  식신: ['食神', '내가 익힌 걸 꾸준히 해내고 밖으로 내놓는 힘을 보는 말이야.\n\n예를 들면 만들 줄 아는 걸 사람들에게 자주 보여주는 쪽으로 읽어.'],
  상관: ['傷官', '내 방식으로 표현하거나 틀을 바꿔 보는 쪽을 읽는 말이야.\n\n예를 들면 다들 쓰는 방법에 “이렇게 바꾸면 더 편하지 않음?” 하고 말 꺼내는 거.'],
  편재: ['偏財', '정해진 수입 바깥에서 들어오는 일이나 돈을 볼 때 쓰는 말이야.\n\n예를 들면 월급 말고 새로 들어온 외주 한 건 같은 거.'],
  정재: ['正財', '일정하게 들어오고 계획해서 쓰는 돈을 읽을 때 쓰는 말이야.\n\n예를 들면 매달 받는 월급이나 미리 정한 작업비.'],
  편관: ['偏官', '압박이 있는 상황에서 맡은 책임에 어떻게 대응할지 읽는 말이야.\n\n예를 들면 갑자기 문제가 생겼는데 내가 오늘 안에 처리해야 하는 경우.'],
  정관: ['正官', '맡은 역할이나 지킬 약속을 볼 때 쓰는 말이야.\n\n이 표에선 날 칸 위 ‘임’이랑 달 칸 위 ‘기’ 보이지? 그 두 글자의 관계에 붙인 이름이야.'],
  편인: ['偏印', '궁금한 걸 자기 방식으로 찾아 배우는 쪽을 읽는 말이야.\n\n필요한 기능을 발견하고 혼자 여러 방법을 따라 해 보는 장면을 떠올리면 돼.'],
  정인: ['正印', '배움이나 나를 받쳐 주는 도움을 읽는 말이야.\n\n기초부터 가르쳐 주는 사람이나 꾸준히 도움을 받는 환경 같은 거.'],
  사주: ['四柱', '태어난 해·달·날·시간을 네 칸으로 적은 거야.\n\n한 칸에 두 글자씩 들어가서 다 합치면 여덟 글자임.'],
  명식: ['命式', '태어난 때를 사주 글자로 바꿔서 정리한 표야.\n\n이 글에 붙은 그림에서 해·달·날·시간 네 칸을 보면 돼.'],
  일주: ['日柱', '태어난 날 한 칸을 통째로 부르는 말이야.\n\n갤주 표에선 날 칸에 ‘임’이랑 ‘자’가 있어서 임자임.'],
  일간: ['日干', '태어난 날 칸의 윗글자야.\n\n갤주 표에선 ‘임’이고, 보통 그 글자를 기준으로 나머지랑 관계를 봐.'],
  오행: ['五行', '사주 글자를 나무·불·흙·쇠·물 다섯 종류로 나눠 보는 방식이야.\n\n이 표에서 ‘임’을 물이라고 한 게 그 분류임.'],
  음양: ['陰陽', '사주 글자를 음과 양 두 쪽으로 나눠 보는 기준이야.\n\n같은 물로 보는 글자도 ‘임’은 양, ‘계’는 음으로 나눠.'],
  궁합: ['宮合', '두 사람의 사주표를 같이 놓고 관계를 읽는 거야.\n\n어떤 점에서 호흡이 잘 맞고 어디서 원하는 게 갈릴지 보는 식.'],
  귀인: ['貴人', '내가 막혔을 때 도움을 주는 사람을 가리키는 말임.\n\n예를 들면 일이 꼬였을 때 어디부터 풀면 될지 한마디 해 주는 사람.'],
  대운: ['大運', '인생 흐름을 10년 단위로 나눠 보는 말이야.\n\n몇 살부터 첫 구간이 시작되는지는 태어난 때에 따라 달라.'],
  순행: ['順行', '태어난 달의 두 글자를 기준으로 다음 조합부터 10년씩 세는 방식이야.'],
  역행: ['逆行', '태어난 달의 두 글자를 기준으로 앞선 조합부터 10년씩 거슬러 세는 방식이야.'],
  세운: ['歲運', '한 해씩 바뀌는 흐름을 보는 말이야.\n\n올해에 붙는 두 글자를 내 태어난 때의 글자들과 같이 놓고 읽어.'],
  사업운: ['事業運', '일을 벌이고 거래를 이어가는 흐름을 보는 말이야.\n\n새 일이 들어오는지, 받은 제안을 실제 거래로 이어갈지는 각각 따져볼 수 있음.'],
  입춘: ['立春', '보통 2월 초에 드는 절기야.\n\n사주에서는 그 무렵에 새해의 두 글자로 넘어간다고 봐.'],
  십이운성: ['十二運星', '사주에서 기운의 상태를 열두 단계로 나눠 붙인 이름이야.\n\n건록이랑 제왕도 그 열두 단계에 들어가.'],
  건록: ['建祿', '기운이 자라서 자기 몫을 해낼 만큼 자리 잡은 단계야.\n\n일에 빗대면 처음 배운 걸 이제 혼자서도 맡을 수 있게 된 느낌.'],
  제왕: ['帝旺', '열두 단계 중에서 기세가 한껏 오른 상태를 말해.\n\n갤에선 사람이 일에 힘을 한꺼번에 많이 쓰는 모습에 빗대 읽기도 함.'],
  자오충: ['子午沖', '‘자’와 ‘오’가 마주서는 관계를 자오충이라고 해.\n\n여기선 갤주 표의 ‘자’랑 병오년의 ‘오’를 같이 보고 꺼낸 말이야.'],
  충: ['沖', '서로 맞서는 두 글자의 관계에 붙이는 이름이야.\n\n원래 하던 일이 움직이거나, 잡아 둔 일정이 달라지는 쪽으로도 읽어.'],
};

const topic = (posts, cue, answer, objection, agreement, next) => ({posts, cue, answer, objection, agreement, next});

const topics = [
  topic(
    ['regret', 'replay', 'what-stays'], /기해|임자|정관|일간|오행|날\s*칸|태어난 날|아무거나|입맛|피자|고구마|페퍼로니|메뉴|밥집|밥\s*얘기|저녁|식당|국[수숫]|못\s*먹|덮밥|뜸|고민|둘 다 좋|지혜|말수|말이 없|조용|되돌아|되묻|되물|뭐라|먼저.{0,4}(?:말|물|묻)|물(?:이|을)?\s*(?:두|둘|겹)/,
    '친구가 식당을 골라 달랬잖아.\n\n못 먹는 걸 물어보고 고를까, 갈 만한 데부터 하나 말할까?',
    '“국숫집 어때?”부터 물어도 친구는 싫다고 말할 수 있지.\n\n일단 갈 곳 하나는 생기는 거고.',
    'ㅇㅇ. 갤주한테 부탁한 건 식당 하나 골라 달라는 거지.\n\n물어보고 고를지, 골라서 물어볼지에서 갈렸어.',
    '친구가 못 먹는 게 있다면 먼저 듣는 게 편할 듯.\n\n그걸 이미 아는 친구면 바로 한 곳 찍어 줄 수도 있고.'
  ),
  topic(
    ['different-speed'], /장터|자리|먼저|첫 만남|편재|기회|무슨 말|병자|[‘']병[’']|불|프로젝트|합류|샘플/,
    '제 예상은 “저도 자리 하나 낼 수 있어요?”예요.\n\n날 위의 임을 기준으로 보면 해 위의 병이 편재거든요.\n\n밖에서 새로 얻는 일이나 돈의 기회를 읽는 말이에요.\n\n장터 얘기가 들리면 참여할 자리부터 궁금할 것 같아요.',
    '편재는 새 일거리를 알아보는 쪽으로 읽었어요.\n\n먼저 묻는 건 제 예상이고요.\n\n주최자가 참가자를 받는지 듣고 나서 물을 수도 있죠.',
    '저도 자리 하나 날지 먼저 물어볼 것 같아요.\n\n이 표의 편재를 새로 들어갈 기회로 읽었거든요.',
    '장터를 연다는 사람한테 “저도 껴도 돼요?” 할까요?\n\n전 그 첫 질문에 한 표예요. 편재를 기회 쪽으로 봤거든요.'
  ),
  topic(
    ['host-and-guest'], /첫인상|첫 만남|처음 보는|먼저.{0,8}(?:말|질문)|말.{0,8}(?:먼저|걸|건)|손님|주인/,
    '집주인이라면 “여기 앉아요” 하고 자리부터 내줄 것 같아요.\n\n처음 온 사람은 반겨 준 한마디를 기억하잖아요.',
    '조용히 있다가도 손님이 망설이면 말을 걸 수 있죠.\n\n손님일 때도 꼭 그럴지는 또 궁금해요.',
    'ㅇㅇ. 코트 벗을 자리를 못 찾았을 때 누가 의자 빼주면 기억남.',
    '갤주도 처음 가는 집이면 어디 앉을지 물을까요?\n\n먼저 권해 줄 때까지 기다릴 거란 쪽도 있을 듯.'
  ),
  topic(
    ['numbers-not-person', 'visible-elements'], /오행|물.{0,5}(?:넷|네|많|개)|흙.{0,5}(?:많|개)|몇 개|여덟 글자/,
    '‘자’가 두 칸에 있으니까 두 번 세는 거임.\n\n물 글자가 많다는 얘기는 거기까지만 맞음.',
    '물 넷이라서 말이 없다고 바로 갈 순 없잖음.\n\n밥집 열 곳 알아두면 오히려 빨리 고를 수도 있고.',
    'ㅇㅇ. 개수랑 그 글자가 있는 칸은 따로 봐야 함.\n\n같은 ‘자’라도 해에 하나, 날에 하나 있잖음.',
    '후보 열 개 중에 1분 만에 하나를 고르면 어떤 쪽임?\n\n‘생각이 많다’만으론 그게 안 갈림.'
  ),
  topic(
    ['own-fence'], /정관|규칙|공지|열쇠|책임|역할/,
    '여기선 열쇠 걸 자리를 누가 정하고 지키냐는 얘기.\n\n정관이라고 남이 시키는 대로 산다는 뜻은 아님.',
    '다들 쓰지도 않는 고리면 공지부터 고치는 게 맞죠.\n\n저는 그걸 약속을 버리는 거랑 따로 봐요.',
    'ㅇㅇ. 마지막 사람이 누군지 알면 잃어버려도 찾기 쉽죠.\n\n그 정도 선이면 공지도 길게 쓸 필요 없고요.',
    '내일 누가 와서 “열쇠 저기 걸기 불편해요” 하면요?\n\n고리를 옮기자는 쪽이면 그 규칙을 진짜 쓰는 거죠.'
  ),
  topic(
    ['business-question', 'money-quote', '2027-steady', 'indirect-wealth'], /사업|편재|정재|재물|견적|의뢰|작업비|수입|매출|돈|단가|입금|포스터|대박/,
    '“한번 해봐요”랑 “얼마에 언제까지 주세요”는 다름.\n\n난 뒤에까지 얘기 나와야 진짜 일감으로 봄.',
    '제안이 왔다고 매출까지 생긴 건 아니잖음.\n\n작업비 얘기 안 했으면 나는 아직 반만 쳐줌.',
    'ㅇㅇ. 일감이 들어오는 거랑 그걸 받을 수 있냐는 별개.\n\n다 같은 날짜에 끝내 달라면 못 받는 것도 생김.',
    '그럼 같은 사람이 같은 단가에 두 번째로 부탁하면?\n\n나는 그때 첫 의뢰랑 또 다르게 봄.'
  ),
  topic(
    ['keep-it'], /원두|커피|잔.{0,4}개|지출|소비|산 거/,
    '잔을 하나 더 사는 거랑 잔을 꺼내서 같이 쓰는 건 다르죠.\n\n저는 돈 쓰고 난 뒤에 뭐가 남았는지가 궁금해요.',
    '주말마다 쓰는 물건이면 무조건 낭비라고 하기 어렵죠.\n\n사고 나서 한 번도 안 꺼냈다면 얘기가 다르고.',
    'ㅇㅇ. 처음 번 돈을 어디에 다시 넣는지 봐야죠.\n\n장비보다 원두 사서 친구랑 마시는 게 더 남을 수도.',
    '한 달 뒤 찬장 열어보고 잔 하나만 빠져 있으면요?\n\n그럼 실제로 손이 간 게 뭐였는지 보이죠.'
  ),
  topic(
    ['same-table'], /볶음밥|김치|겁재|대회|상금|동업|협업/,
    '한 명이 볶고 한 명이 김치 썰면 금방 끝나잖음.\n\n난 상금 얘기할 때도 그만큼 손발 맞는지가 궁금함.',
    '겁재 있다고 같은 팀이 돈을 뺏는다는 소린 아님.\n\n저 예시에선 메뉴 공을 누구 몫으로 보느냐 얘기임.',
    'ㅇㅇ. 만드는 중엔 고마웠는데 상 받을 때 꼬일 수 있음.\n\n그때 이름 둘 다 올리면 끝날 일인데 ㅋㅋ',
    '그럼 친구가 대회 나가기 전에 자기 이름 빼달랬으면?\n\n그때랑 심사 끝나고 빼는 건 또 다르잖음.'
  ),
  topic(
    ['first-text-question', 'answer-later'], /선톡|연락|연애|궁합|기차|책.{0,4}읽/,
    '먼저 톡을 보내느냐랑 답장 기다리며 뭐가 신경 쓰이냐.\n\n그거 두 건을 댓글에서 섞어서 봤어요.',
    '먼저 연락하는 게 꼭 적극적이라서는 아니죠.\n\n상대가 어색할까 봐 한마디 던지는 사람도 있잖아요.',
    'ㅇㅇ. 먼저 연락하는 장면까진 둘 다 같아요.\n\n답이 왔을 때 폰을 놓는지 또 읽어보는지 갈리고요.',
    '그럼 상대가 “잘 왔어”만 보내면 끝인가요?\n\n아까 읽던 책 얘기를 더 할지도 궁금해요.'
  ),
  topic(
    ['three-dots'], /마침표|점.{0,3}(?:하나|찍)|카톡|괜찮아|답장|버스|사과/,
    '점 하나 보고 화났다고 확정한 건 갤주 머릿속임.\n\n친구는 버스 타고 있어서 짧게 친 걸 수도 있고.',
    '평소에도 점 찍는 사람이면 저 장면 자체가 달라짐.\n\n그래서 답 오기 전에 혼자 결론 내기 어렵다는 거.',
    'ㅇㅇ. “나도 아직 버스야” 오니까 바로 맥락이 바뀜.\n\n처음 톡이 바뀐 게 아니라 갤주가 아는 게 늘어났고.',
    '그럼 점은 똑같은데 평소엔 반응이 길던 친구라면?\n\n그럴 때도 바로 물어볼지 궁금하긴 함.'
  ),
  topic(
    ['quiet-pressure', 'dish-break'], /설거지|접시|물에 담|뒷정리/,
    '그날은 같이 웃었는데 저번에도 혼자 씻은 게 떠오른 거죠.\n\n어느 쪽이 진짜 불편했는지 두 장면을 같이 봐야죠.',
    '한 번 설거지 도와준 걸로는 별말 아닐 수 있죠.\n\n매번 같은 사람이 그 말을 했다면 얘기가 다르고.',
    'ㅇㅇ. 다음에 그릇 나올 때 “오늘은 같이 하자” 한마디.\n\n그때 반응을 보면 농담인지 더 잘 보이겠죠.',
    '다음 모임에 그 친구가 먼저 수세미 잡으면요?\n\n저는 그날 일도 조금 다르게 보일 것 같아요.'
  ),
  topic(
    ['show-small', 'bad-instructions', 'output'], /만화|버튼|작품|초안|카드|설명서|상관|시간 칸|을사|해사충|첫 장/,
    '만화 한 장 내밀면 친구가 멈추는 데부터 보이잖아.\n\n난 그게 자잘한 설명 열 줄보다 빠르다는 거.',
    '먼저 보여준다고 다 알아듣는 건 아님.\n\n못 찾은 버튼이 있으면 거기부터 고쳐 보면 되지.',
    'ㅇㅇ. 내가 다 설명하면 읽는 사람이 어디서 헤맨지 모름.\n\n한 장 놓고 어디서 손 멈추는지 보면 좀 보임.',
    '다음 장 버튼이 여전히 안 보이면 뭐부터 바꿈?\n\n그림을 고칠지 버튼을 빼서 보여줄지 갈리잖아.'
  ),
  topic(
    ['help'], /귀인|도와|도움|도움말|만렙|질문 한/,
    '내 카드 대신 내주는 사람도 고맙지.\n\n난 다음 판에 혼자 할 한마디 준 사람 쪽을 봄.',
    '대신 끝내주는 것도 그 판만 놓고 보면 도움 맞음.\n\n누가 기억에 남느냐는 다음 판까지 봐야 알겠더라.',
    'ㅇㅇ. “이 카드 한 번 뒤집어봐” 하고 빠지는 사람.\n\n그 뒤 혼자 해봤는데 풀리면 다음에도 생각날 듯.',
    '옆에서 한마디 해준 게 빗나갔다면 귀인이 아님?\n\n지금 겪은 판에 대입하면 거기서도 갈릴 듯.'
  ),
  topic(
    ['2026-tempo'], /자오충|세운|주말|장터|금요일|달력|2026|병오|충이/,
    '금요일 한 번이랑 다음 달 내내 일정 잡는 건 다르잖음.\n\n여기선 자오충을 일정이 부딪히는 장면에 빗댔음.',
    '금요일 된다고 했다고 사이가 틀어질 일은 아님.\n\n다음 금요일도 하기로 생각하면 그때부터 얘기가 꼬이지.',
    'ㅇㅇ. “이번만?” 먼저 물으면 바로 풀릴 수도 있음.\n\n달력에 여러 번 적는 건 답 듣고 해도 되잖아.',
    '다음 달에도 해보자는 말을 상대가 먼저 꺼냈다면?\n\n그땐 혼자 앞서간 걸로 보기 어려워짐.'
  ),
  topic(
    ['rough-edges', 'stop-signal'], /(?:^|[^가-힣])라면|건록|제왕|불조절|잘나가|소파|쉬는|고양이/,
    '라면 한 그릇 끓일 줄 아는 거랑 여덟 그릇 맡는 건 다름.\n\n이 글에선 그 차이로 건록이랑 제왕을 얘기한 거임.',
    '고양이 보려고 라면 글 누른 거면 일하는 게 아니지 ㅋㅋ\n\n그래서 나는 뭘 눌렀는지보다 왜 눌렀는지 궁금함.',
    'ㅇㅇ. 한 번 잘했다고 설거지까지 다 맡을 필요 없잖음.\n\n그때 물러나는 것도 그 일을 할 줄 아는 거지.',
    '다음에 누가 라면 끓여달라면 또 해줄 거 같음?\n\n보고 싶어서 켠 폰이랑 다시 일 떠맡는 건 다르지.'
  ),
];

const loveThreadCue = /선톡|연락|연애|마음|설레|고백|좋아|짝사랑|답장|소개팅|생각|보고 싶|데이트|관계|기억|물/;
const curatedTopics = [
  topic(
    ['personality'], /성격|성향|정관|책임|기준|약속|맡|기해|임자|오행|성실|대충|진심/,
    '갤주가 맡은 일만큼은 끝을 보고 싶어 할 것 같다는 말이야.\n\n정관을 맡은 역할이나 지킬 약속에 대한 태도로 읽었어.',
    '그럴 수 있지. 재밌어서 해보는 거랑 책임지고 끝내는 건 기분부터 다르잖아.\n\n난 갤주가 후자에서 기준이 올라가는 쪽 같았어.',
    '그치. 옆에 있는 사람 입장에선 “이건 마저 해주는구나” 싶은 게 든든할 것 같아.',
    '자기가 하겠다고 손들었을 때랑 갑자기 맡겼을 때도 다를 듯. 너는 어느 쪽이 떠올랐어?'
  ),
  topic(
    ['concern'], /부탁|부담|배려|거절|도와|돕|담당|맡|몫|지치|밀리|스케줄/,
    '한 번 돕는 건 괜찮지. 그게 다음번부터 자동으로 내 담당이 될 때가 좀 걸렸어.',
    '나도 급한 날이면 그냥 해줄 것 같아.\n\n그 뒤에도 계속 내가 챙겨야 한다고 생각하는 사람 있으면 그때는 얘기해봐야겠지.',
    '맞아 ㅠ 처음엔 자발적으로 한 거라, 뒤늦게 힘들다고 말하기가 더 애매함.',
    '이건 뒤에서 한 번 더 얘기하려고. 갤주가 오늘 어디까지 해줄 수 있는지부터 생각해보면 좋겠어.'
  ),
  topic(
    ['money'], /금전|사업|편재|기회|견적|의뢰|제안|고객|거래|수정|작업비|수입|매출|돈|단가|입금|할인|만원|외주/,
    '새 의뢰엔 가능성 있음. 받기 전엔 작업비와 수정 범위부터 확인해.',
    '첫 건 가격 낮추는 건 가능. 한 번만 적용된다는 걸 상대에게 말해둬.',
    '맞음. 기한과 범위를 같이 적어야 끝낼 때 서로 얘기가 맞아.',
    '같은 값에 한 번 더 맡아도 남아? 거기서 보면 됨.'
  ),
  topic(
    ['love'], loveThreadCue,
    '먼저 연락할 수도 있지! 나도 진짜 좋으면 “우리 거기 가볼래?” 할 것 같아 ㅎㅎ',
    '오 그럴 수도 있겠다! 나는 갤주가 좋아하는 티보다 보고 싶다는 말을 더 조심해서 할 것 같았어.',
    '그치… 내가 무심코 한 말 기억해주면 갑자기 좀 설렐 것 같아 🥹',
    '그럼 갤주가 제일 먼저 무슨 말 할 것 같아? 나는 “너 그날 시간 돼?”에 한 표 ㅎㅎ'
  ),
  topic(
    ['timing'], /올해|내년|해마다|202[67]|자오충|병오|정미|입춘|시기|언제|반복|바뀌|계획|변화/,
    '올해는 새로 끼어드는 일이 있는 쪽으로 보네.\n\n내년엔 남겨 둔 일 하나를 내 방식으로 자리 잡게 해보시게.',
    '허허, 다 바뀐다는 말은 아니네. 하던 계획이 흔들릴 때 남길 것 하나를 먼저 챙겨보게.',
    '그렇지. 한 번 해낸 일을 무리 없이 다시 할 수 있으면 차곡차곡 쌓인다네.',
    '두 해를 같이 볼 때는 내년에도 가져가고 싶은 일이 무엇인지부터 물어보게.'
  ),
  topic(
    ['resolution'], /아까|걱정|부탁|배려|거절|도와|돕|맡|몫|지치|밀리|초안|할게|어디까지|추가|기한/,
    '나라면 “오늘은 초안까지 돼”라고 말할 듯. 더 필요한 건 그때 서로 되는 날 다시 잡고.',
    '나도 말 꺼내기 어렵더라 ㅠ “내가 여기까진 할 수 있어”부터 말하면 좀 덜 어색했어.',
    '응. 해주고 싶은 마음이랑 오늘 실제로 낼 수 있는 시간 둘 다 챙기고 싶어.',
    '다음에 비슷한 부탁 오면 바로 답하기 전에 내 일정부터 한 번 봐도 돼.'
  ),
  topic(
    ['closing'], /마무리|공감|고마|찔리|마음|좋|읽|기억|든든/,
    '같이 있는 사람을 편하게 해주는 만큼, 갤주도 누군가한테 한 번씩 기대면 좋겠다는 말이었어.',
    '응 이건 내 느낌이라 사람마다 다르게 읽을 수도 있지 ㅎㅎ. 넌 어느 글이 제일 남았어?',
    '그 말 해줘서 좋다. 나도 갤주 얘기 하다가 내 일 좀 돌아봤어 ㅎㅎ',
    '다 읽고 나서 남은 말 하나만 가져가도 좋을 듯. 난 “나머진 내가 할게”가 좋았어.'
  ),
  topic(
    ['sinsal'], /신살|장성살|양인살|녹신|망신살|겁살|천을귀인|시간|판정|맞아|두 글자|어느 칸/,
    '이 글에 표시한 칸부터 같이 보면 돼. 위에 밑줄 친 이름을 누르면 그게 무슨 뜻인지 여기 댓글로 물어볼 수 있어.',
    '해석은 여러 쪽으로 갈릴 수 있지. 표에서 찾는 글자랑, 거기서 떠올린 상황을 나눠서 보면 얘기하기 쉬워.',
    '응. 어디서 찾아 읽었는지 알면 그 해석이 자기한테 와닿는지도 생각해보기 편하더라.',
    '태어난 시간으로 찾은 건 그 칸이 바뀌면 다시 봐야 해. 어느 글 얘기인지 짚어주면 같이 보자.'
  ),
];

const findTopic = (text, contextual) => contextual?.cue.test(text) ? contextual : topics.find(({cue, posts}) => !posts.includes('replay') && !posts.includes('different-speed') && cue.test(text));
const question = /[?？]|뭐야|뭔데|무슨 뜻|왜|어떻게|어디|(?:인가요?|임|냐)[.! ]*$/;
const disagrees = /아니|않|반박|다른데|틀렸|맞다는|억지|근거|확정|말이 됨|말이 돼|그렇게까지/;
const agrees = /맞아|맞음|맞네|맞지|공감|동의|그러게|ㄹㅇ|^ㅇㅇ|나도/;
const followsContext = /^(?:아니|근데|그럼|그러면|그래서|왜 그렇게|왜 그게|왜 그걸|그 말|저 말|이게|저게|그게|그건|이건|저건|반대로)|왜[?？]*$/;
const asksForClarification = /(?:뭔|무슨|뭐라는)\s*(?:말|소리|뜻)|이해(?:가)?\s*안|뭔\s*상관|왜\s*(?:지혜|물어|묻|그렇게)|지혜.{0,8}(?:뭔|뭐|왜|뜻|상관)/;
const outsideTopics = /오늘 날씨|기온|호텔|환율|레시피|주식 종목|서버|파이썬|경기 결과/;
const waterQuestion = /(?<![가-힣])물(?:\s*기운)?[’”'"]?(?:이라는\s*게|이란\s*게|이라는\s*말이|이란|이|은|의)?\s*(?:뭐|뭔|무엇|무슨|어떤|뜻)|(?:진짜|실제로)\s*물(?:임|이야|인가|이에요|이냐)/;
const chartWater = /사주|오행|물\s*기운|(?:물로|물이라고|물이)\s*(?:세|읽|보|겹|분류)|(?:글자|임자|기해).{0,16}(?:[‘“'"])?물|(?:불|나무|쇠|흙)[·,\s]+물/;
const jeonggwanQuestion = /정관.{0,9}(?:뜻|뭔|뭐|어디|무슨)/;
const mealInDiscussion = /국[수숫]|식당|저녁|덮밥|메뉴|피자|페퍼로니|고구마|매운|못\s*먹|뭐\s*먹|뭘\s*먹|뭐가\s*먹고/;
const explainJeonggwan = '아, 태어난 날 위의 임이랑 달 위의 기를 같이 봐.\n\n그 둘 사이에 붙인 이름이 정관이야.\n\n맡은 역할이나 지킬 기준을 얘기할 때 나오는 말이야.';
const startingChart = {
  answer:'응, 태어난 날 칸 위에 ‘임’, 아래에 ‘자’가 있어.\n\n두 글자 다 물로 봐. 다른 칸이랑 비교할 때는 위에 있는 ‘임’을 기준으로 써.',
  objection:'나도 그걸로 성격까지 얘기하면 근거가 궁금해.\n\n일단 표에선 어느 글자를 물로 셌는지부터 같이 볼 수 있어.',
  agreement:'응. 날 칸 위 ‘임’이랑 아래 ‘자’를 붙여서 임자라고 읽어.\n\n두 글자는 둘 다 물에 들어가.',
  next:'그럼 옆에 달 칸도 한번 봐봐.\n\n거긴 아래 ‘해’가 물이고, 위 ‘기’는 흙이야.',
};
const openingChart = {
  answer:explainJeonggwan,
  objection:'ㅇㅇ. 같은 정관을 읽어도 갈릴 수 있지.\n\n맡은 일을 잘한다는 말만으로 어떤 대답이 먼저 나올지는 모르잖아.',
  agreement:'둘 다 갤주가 자기 몫을 챙길 것 같다는 쪽이야.\n\n어떻게 챙길지에서 생각이 갈린 거.',
  next:'정관을 읽을 때 나는 누가 무슨 일을 맡았는지부터 봐.\n\n누가 부탁했고 뭘 해 줘야 하는지가 먼저잖아.',
};
const projectReplies = {
  answer:'전 프로젝트 얘기를 들으면 “제가 만든 것도 한번 보여 드려도 돼요?”부터 물을 것 같아요.\n\n편재를 밖에서 온 기회에 손을 내미는 쪽으로 읽었어요.',
  objection:'같이 할 사람부터 궁금할 수도 있죠.\n\n전 기회에 관심을 보일 거라 봤고, 그다음에 팀이랑 일이 맞는지 알아볼 것 같아요.',
  agreement:'네. 샘플 하나 보내보는 거랑 정식으로 같이 일하기로 약속하는 건 다르잖아요.',
  next:'샘플에 상대가 관심을 보이면, 그때 어떤 일을 맡을지 먼저 물어볼 것 같아요.',
};

const askFirst = '난 “못 먹는 거 있어?” 할 것 같음.\n\n날 위 임이랑 달 위 기를 같이 보면 정관이거든.\n\n맡은 일을 어떻게 챙길지 보는 말임.\n\n자기가 골랐는데 친구가 못 먹으면 또 찾아야 하잖아.';
const offerFirst = '난 “국숫집 어때?”에 한 표.\n\n날 위의 임하고 달 위의 기를 같이 봤거든.\n\n이 둘의 관계를 정관이라 함.\n\n맡은 역할이나 지킬 기준을 보는 말임.\n\n골라 달랬으면 갈 집 하나는 자기가 찾아 줄 것 같음.';

function explainWater(message, targetText, postId) {
  const discussionIsAboutWater = postId === 'replay' || chartWater.test(message + '\n' + targetText);
  if (discussionIsAboutWater && /물.{0,12}(?:돌아|멈)|(?:돌아|멈).{0,12}물/.test(message)) {
    return '표에서 ‘물’은 글자를 나누는 다섯 종류 중 하나임.\n\n물의 움직임까지 표시한 건 아냐.\n\n갤주가 무슨 생각을 했는지도 저 글자로는 모름.';
  }
  if (!waterQuestion.test(message) || !discussionIsAboutWater) return '';
  const categories = '사주에선 글자를 나무·불·흙·쇠·물로 나눠.\n\n그 다섯 종류를 오행이라고 해.';
  if (postId === 'replay') return categories + '\n\n날 칸 위의 ‘임’도, 아래의 ‘자’도 물에 들어감.';
  if (/임자/.test(targetText)) return categories + '\n\n‘임’도 ‘자’도 물에 들어감.';
  return categories + '\n\n표에서 물이라고 쓰면 그 글자가 어느 종류인지 알려주는 거야.';
}

function pillarDefinitions(message, targetText, postId) {
  if (!['replay', 'regret', 'what-stays'].includes(postId)) {
    if (jeonggwanQuestion.test(message)) return ['정관은 태어난 날 윗글자와 다른 글자의 관계에 붙는 이름이야.\n\n어떤 역할을 맡고 어떤 기준을 지키는지 읽을 때 써.'];
    if (/기해.{0,10}(?:뭐|뜻|무슨)/.test(message)) return ['‘기’하고 ‘해’라는 두 글자를 붙여 읽은 말이야.\n\n‘기’는 흙, ‘해’는 물로 세.'];
    if (/임자.{0,10}(?:뭐|뜻|무슨)/.test(message)) return ['‘임’하고 ‘자’라는 두 글자를 붙여 읽은 말이야.\n\n둘 다 물로 세.'];
    return [];
  }
  if ((postId === 'regret' || /기해/.test(targetText)) && /^(?:근데\s*)?[‘'"]?해[’'"]?(?:가|는|도)?\s*(?:뭐|무슨|두 글자|한 글자)/.test(message)) {
    return ['‘해’는 달 칸 아래에 있는 한 글자야.\n\n위의 ‘기’까지 붙여 읽을 때 두 글자, ‘기해’가 됨.'];
  }
  if (/(?:기해|임자).{0,10}(?:차이|달라|비교)|(?:차이|비교).{0,10}(?:임자|기해)/.test(message)) {
    return ['갤주 표는 날 칸이 임자, 달 칸이 기해야.\n\n날 칸은 위아래 다 물임.\n\n달 칸은 위가 흙이고 아래가 물.'];
  }
  if (/기해.{0,10}(?:뭐|뜻|무슨|어디|어떤)|(?:뭐|뜻).{0,10}기해/.test(message)) return [
    '태어난 달 칸을 위에서 읽으면 ‘기’, ‘해’야.\n\n‘기’는 흙, ‘해’는 물로 세. 둘을 붙여 읽은 게 기해임.',
    '달 칸 맨 아래 한 글자만 짚으면 그게 ‘해’야.\n\n바로 위의 ‘기’까지 같이 부르면 ‘기해’.',
  ];
  if (/임자.{0,10}(?:뭐|뜻|무슨|어디|어떤)|(?:뭐|뜻).{0,10}임자/.test(message)) return [
    '갤주가 태어난 날 칸을 봐봐. 위가 ‘임’, 아래가 ‘자’임.\n\n둘을 붙여서 임자라고 읽어. 둘 다 물에 속해.',
    '날 칸에서 ‘임’ 하나, 그 밑에 ‘자’ 하나 보이지?\n\n그 두 글자를 같이 부른 게 임자야.',
  ];
  return [];
}

function specificResponse(message, author, subject, targetText) {
  if (subject.posts.includes('replay') && /매운|못\s*먹/.test(targetText) && asksForClarification.test(message)) {
    return '친구가 못 먹는 음식이면 그 집은 둘이 못 가잖아.\n\n그래서 뭐 못 먹는지 먼저 묻고, 둘 다 먹을 데를 고를 것 같다는 말임.';
  }
  if (subject.posts.includes('replay') && /할인|쿠폰/.test(message)) return '가격도 먼저 볼 수 있지.\n\n그럼 메뉴 대신 “얼마까지 괜찮아?”부터 물을지도.';
  if (subject?.posts.includes('business-question') && /할인|쿠폰/.test(message)) return '할인 견적을 냈으면 다음에도 그 값인 줄 알 수 있잖아.\n\n한 번만 깎은 건지, 다음 단가도 그건지 먼저 물을 듯.';
  if (subject?.posts.includes('replay') && /친구.{0,12}(?:맞춰|배려)|(?:맞춰|배려).{0,12}친구/.test(message)) {
    return '친구도 먹을 수 있는 집을 고르겠다는 쪽이네.\n\n나도 그럴 땐 “못 먹는 거 있어?” 한마디 먼저 물음.';
  }
  if (subject?.posts.includes('replay') && /아무거나|반반|둘 다 좋|둘 다 괜찮/.test(message)) {
    return '진짜 아무거나 좋을 수도 있지 ㅋㅋ\n\n나 같으면 “그럼 내가 골라도 돼?” 하고 물어봄.';
  }
  if (subject?.posts.includes('replay') && /말수|조용|과묵|말이 없|되짚|복기|되돌아|생각.{0,5}많/.test(message)) {
    return '날 칸의 임이랑 자를 물로 세는 건 맞음.\n\n평소에 말이 적은지는 갤주한테 직접 물어봐야 앎.';
  }
  if (subject.posts.includes('replay') && /국[수숫]/.test(message) && /사주|정관|하필|굳이|찍|어디/.test(message)) {
    return '국숫집은 갤주가 먼저 제안할 만한 식당 예시임.\n\n날 위의 임한테 달 위의 기가 정관이거든.\n\n맡은 몫을 챙긴다고 읽는 자리야.\n\n골라 달라는 부탁을 받았으니 후보 하나는 낼 것 같음.';
  }
  if (subject?.posts.includes('replay') && /밥|피자|국수|메뉴|페퍼로니/.test(message) && /갑자기|왜.{0,8}나[오옴]|(?:뭔|무슨) (?:관계|상관)/.test(message)) {
    return '밥 얘긴 예시로 꺼낸 거야.\n\n정관을 보고 맡은 일에 어떻게 답할까 궁금했거든.\n\n친구가 식당을 골라 달라고 부탁하는 경우를 든 거임.';
  }
  if (/정재.{0,12}편재|편재.{0,12}정재/.test(message)) return '첫 의뢰가 왔을 땐 값부터 정하잖아. 그걸 편재에 빗댄 거.\n\n같은 값에 다시 받는 작업은 정재 쪽 예시였음.';
  if (subject.posts.includes('different-speed') && /상대.{0,12}먼저|먼저.{0,12}상대|주최자/.test(message)) {
    return '주최자가 먼저 자리를 권해 준다면요?\n\n갤주가 “그럼 언제까지 신청하면 돼요?” 할 것 같아요.\n\n전 편재를 새 일이 보이면 기회를 잡는 쪽으로 읽었거든요.';
  }
  if (subject?.posts.includes('replay') && /고구마|페퍼로니/.test(message)) {
    const food = /고구마/.test(message) ? '고구마' : '페퍼로니';
    return author === '사주갤럼 1'
      ? `네 예시에선 ${food} 쪽을 보고 있었단 거지?\n\n난 그게 먹고 싶어서 본 건지 한 번 물어볼 듯.`
      : `${food} 쪽을 봤다는 것만으론 입맛을 모르지.\n\n“그거 먹을래?” 하면 바로 답 나올 얘기긴 함 ㅋㅋ`;
  }
  return '';
}

const generalReplies = [
  '어느 대목 얘기하는지 한 번만 짚어줘.\n\n위에 예시에서 누구 행동을 다르게 본 거임?',
  '어느 장면이 먼저 떠올랐는데?\n\n그걸 얘기해주면 내가 본 장면이랑 비교해볼게.',
  '그렇게 읽히는 부분이 윗댓글 어느 말이었음?\n\n한 줄만 찍어주면 거기부터 얘기하자.',
];

const loveTermEndings = {
  거야: '거예요', 이야: '이에요', 야: '예요',
  임자임: '임자예요', '자’임': '자’예요', 글자임: '글자예요', 말임: '말이에요', 분류임: '분류예요',
  거: '거예요', 경우: '경우예요', 느낌: '느낌이에요', 사람: '사람이에요', 식: '식이에요', 작업비: '작업비예요',
  있음: '있어요', 함: '해요', 읽었고: '읽었어요', 보이지: '보이죠',
};
const loveTermEndingPattern = new RegExp(
  '('+Object.keys(loveTermEndings).join('|')+')(?=[.!?](?:\\s|$)|$)', 'g'
);

// Only adjust the sentence endings found in the seeded glossary answers.
export function loveTermReply(text) {
  return text
    .replace(loveTermEndingPattern, ending=>loveTermEndings[ending])
    .replace(/(봤어|적었어|읽었어|꺼냈어|있어|나눠|달라|돼|들어가|말해|봐|불러|붙여|써|읽어|적어|찾아|해)(?=[.!?](?:\s|$)|$)/g, '$1요');
}

const loveGlossary = Object.fromEntries(Object.entries(sajuTerms).map(([term,[,answer]])=>[term,answer]));
const loveReplies = [
  '어느 대목이 궁금하셨어요?\n\n말씀해 주시면 그 부분부터 같이 볼게요.',
  '어느 장면이 먼저 떠오르셨어요?\n\n저는 어떤 부분을 봤는지도 말씀드릴게요.',
  '윗댓글에서 어떤 말이 눈에 띄었어요?\n\n그 문장부터 같이 얘기해 봐요.',
];
const loveTopicReplies = {
  answer:'먼저 연락할 수도 있죠! 저도 정말 좋으면 “우리 거기 가볼래요?” 할 것 같아요 ㅎㅎ',
  objection:'그렇게 볼 수도 있겠네요! 저는 이분이 먼저 연락하고도 좋아하는 티는 조심해서 낼 것 같았어요.',
  agreement:'그렇죠… 제가 무심코 한 말을 기억해 주면 갑자기 좀 설렐 것 같아요 🥹',
  next:'이분이 제일 먼저 무슨 말 할 것 같으세요? 저는 “그날 시간 돼요?”에 한 표예요 ㅎㅎ',
};

function makeLoveReply(text, definition, previousReplies) {
  const intent = disagrees.test(text) ? 'objection' : agrees.test(text) ? 'agreement' : question.test(text) ? 'answer' : 'next';
  const topical = loveThreadCue.test(text)&&!outsideTopics.test(text)?loveTopicReplies[intent]:'';
  const replies = [definition&&loveTermReply(definition),topical,...loveReplies];
  return replies.find(reply=>reply&&!previousReplies.includes(reply))||loveReplies[0];
}

export function makeGalleryReply({message, targetText, revealedText = '', postId, chapterId, author, previousReplies = [], termAnswers}) {
  const text = message.trim();
  if (termAnswers||author==='사랑해요') {
    const answers = termAnswers??loveGlossary;
    const terms = Object.keys(answers).sort((a,b)=>b.length-a.length);
    const term = terms.find(value=>text.includes(value))
      ?? (asksForClarification.test(text) ? terms.find(value=>targetText.includes(value)) : undefined);
    const reply = term && question.test(text) ? answers[term] : '';
    if(author==='사랑해요')return makeLoveReply(text,reply,previousReplies);
    return [reply,...generalReplies].find(value=>value&&!previousReplies.includes(value))||generalReplies[0];
  }
  const intent = disagrees.test(text) ? 'objection' : agrees.test(text) ? 'agreement' : question.test(text) ? 'answer' : 'next';
  const tiedToContext = !outsideTopics.test(text) && ((text.length <= 70 && (followsContext.test(text) || asksForClarification.test(text))) || intent === 'agreement');
  const curated = curatedTopics.find(({posts}) => posts.includes(chapterId));
  const glossaryContext = curated ? chapterId : postId;
  const candidates = [explainWater(text, targetText, glossaryContext), ...pillarDefinitions(text, targetText, glossaryContext)];
  if (curated) {
    if (chapterId === 'sinsal' && /뜻|무슨|뭐|뭔|무엇|쉽게/.test(text)) {
      const term = Object.keys(sinsalTerms).find(name => text.includes(name));
      if (term) candidates.unshift(sinsalTerms[term][1]);
    }
    if (!outsideTopics.test(text) && (curated.cue.test(text) || tiedToContext)) {
      candidates.push(curated[intent], curated.next, curated.answer);
    }
    return [...candidates, ...generalReplies].find(reply => reply && !previousReplies.includes(reply)) || generalReplies[0];
  }
  const contextual = topics.find(({posts}) => posts.includes(postId));
  const direct = findTopic(text, contextual);
  const chartComment = contextual?.posts.includes('replay') && chartWater.test(targetText);
  const subject = direct || (chartComment ? contextual : findTopic(targetText, contextual)) || contextual;
  if (subject && (direct || tiedToContext || /할인|쿠폰/.test(text))) {
    const discussion = [text, targetText, revealedText].join('\n');
    const beforeMeal = subject.posts.includes('replay') && !mealInDiscussion.test(discussion);
    const beforeJeonggwan = beforeMeal && postId === 'replay' && !discussion.includes('정관');
    const projectDiscussion = postId === 'different-speed' && subject.posts.includes('different-speed') && /프로젝트|합류|샘플/.test(discussion);
    const replies = beforeJeonggwan ? startingChart : beforeMeal ? openingChart : projectDiscussion ? projectReplies : subject;
    if (subject.posts.includes('replay') && jeonggwanQuestion.test(text)) candidates.push(explainJeonggwan);
    if (subject.posts.includes('replay') && /지혜/.test(text) && !beforeJeonggwan) candidates.push('옛 오행 풀이에 물과 지혜를 짝지은 데서 꺼낸 말이야.\n\n그걸로 갤주가 먼저 뭘 물을지까지 짐작한 건 비약이었음.\n\n여기서 내가 본 건 맡은 몫을 챙긴다는 정관이야.');
    if (beforeMeal && /말수|조용|과묵|말이 없/.test(text)) candidates.push('표를 보면 두 글자 모두 물인 건 알지.\n\n갤주가 평소에 말이 많은지는 직접 이야기해 봐야 앎.');
    if (!beforeMeal && !projectDiscussion) candidates.push(specificResponse(text, author, subject, targetText));
    if (subject.posts.includes('replay') && ['사주갤럼 1','사주갤럼 2'].includes(author)) {
      if (!beforeMeal) candidates.push(author === '사주갤럼 2' ? offerFirst : askFirst);
      else if (author === '사주갤럼 2' && !beforeJeonggwan) candidates.push(explainJeonggwan + '\n\n난 갤주가 자기 의견도 먼저 내놓을 것 같음.');
      else candidates.push(replies.answer);
    }
    candidates.push(replies[intent], replies.next, replies.answer, replies.objection, replies.agreement);
    if (beforeMeal) return candidates.find(reply => reply && !previousReplies.includes(reply)) || replies[intent];
  }
  return [...candidates, ...generalReplies].find(reply => reply && !previousReplies.includes(reply)) || generalReplies[0];
}
