// Official information checked on 2026-10-01. Prices not verified are deliberately left blank.
const BUNDLE_CATALOG = [
  {
    id: 'naver', name: '네이버플러스 멤버십', shortName: '네이버플러스', mark: 'N', color: 'naver', category: '쇼핑',
    prices: {monthly: 4900, yearly: 46800}, checkedAt: '2026-10-01',
    description: '기본 혜택에 콘텐츠 하나, 라이프 혜택까지',
    note: '디지털 콘텐츠는 매월 하나를 선택합니다. Uber One은 콘텐츠 선택과 별도로 연동할 수 있는 12개월 무료 혜택입니다. 실제 서비스 연동은 각 제공사에서 진행하세요.',
    included: [{id:'mybox', name:'MYBOX 80GB', detail:'기본 제공 저장공간', aliases:['mybox','네이버클라우드']}, {id:'cookies10', name:'웹툰 쿠키 10개', detail:'매월 기본 제공'}],
    groups: [{id:'content', title:'디지털 콘텐츠 고르기', hint:'택 1 · 멤버십 요금에 포함', options:[
      {id:'none', name:'아직 선택하지 않았어요', benefits:[]},
      {id:'netflix', name:'넷플릭스 광고형 스탠다드', detail:'광고형 요금제 · 계정 연동 필요', benefits:[{id:'netflix',name:'Netflix 광고형 스탠다드',aliases:['netflix','넷플릭스']}]},
      {id:'spotify', name:'스포티파이 프리미엄 베이직', benefits:[{id:'spotify',name:'Spotify 프리미엄 베이직',aliases:['spotify','스포티파이']}]},
      {id:'xbox', name:'Xbox PC Game Pass', benefits:[{id:'xbox',name:'Xbox PC Game Pass',aliases:['pc game pass','게임패스']}]},
      {id:'series', name:'네이버 시리즈 쿠키 49개', benefits:[{id:'series',name:'시리즈 쿠키 49개'}]},
      {id:'webtoon', name:'네이버 웹툰 쿠키 49개', benefits:[{id:'webtoon',name:'웹툰 쿠키 49개'}]}
    ]}],
    optional: [{id:'uber',name:'Uber One',detail:'연동 후 12개월 무료 · 종료 후 자동 결제 여부 확인',durationMonths:12,aliases:['uber one','우버원','우버 원']}],
    sources: [{label:'네이버 요금·콘텐츠 안내',url:'https://nid.naver.com/membership/join'}, {label:'네이버 × Uber 혜택',url:'https://mkt.naver.com/membership_uber'}, {label:'Uber 무료 혜택 종료 안내',url:'https://help.uber.com/ko-KR/riders/article/naver-plus-membership-uber-one-benefit-immediate-cancellation-and-automatic-payment-refund?nodeId=a9bb83e3-65f9-45b5-a579-12842dba0810'}]
  },
  {
    id:'baemin',name:'배민클럽',shortName:'배민클럽',mark:'배',color:'baemin',category:'쇼핑',checkedAt:'2026-10-01',
    description:'일반 멤버십 또는 유튜브 결합상품',
    note:'유튜브는 일반 배민클럽에 무조건 무료로 붙는 혜택이 아닌 별도 결합상품입니다. 제휴 여부는 YouTube 공식 안내에서 확인했습니다. 현재 가격·가입 조건은 배민 앱에서 확인하고 결합상품 전체 결제액을 입력하세요.',
    included:[{id:'delivery',name:'배민클럽 배달 혜택',detail:'대상 가게·지역 및 주문 조건 적용'}],
    groups:[{id:'plan',title:'이용 중인 상품 고르기',hint:'택 1 · 결합상품은 총 결제액 입력',options:[
      {id:'basic',name:'배민클럽 일반',benefits:[]},
      {id:'youtube',name:'배민클럽 + YouTube Premium',detail:'별도 결합상품 · 현재 요금은 앱에서 확인',benefits:[{id:'youtube',name:'YouTube Premium',aliases:['youtube premium','유튜브프리미엄','유튜브 프리미엄']}]}
    ]}],optional:[],
    sources:[{label:'배민클럽 공식 안내',url:'https://www.baemin.com/'},{label:'YouTube 공식 제휴사 목록',url:'https://support.google.com/youtube/answer/9927383?hl=ko'}]
  },
  {
    id:'google',name:'Google AI Pro',shortName:'Google AI Pro',mark:'✦',color:'google',category:'생산성',checkedAt:'2026-10-01',
    description:'Gemini와 Google One 저장공간을 함께',
    note:'공식 안내 기준 저장공간은 5GB가 아닌 5TB입니다. Google Drive·Gmail·Google 포토가 함께 사용하는 총 용량입니다. 프로모션·결제 경로에 따른 실제 결제액을 입력하세요.',
    included:[{id:'gemini',name:'Gemini Pro 기능',detail:'유료 AI 기능 및 높은 사용량 한도',aliases:['gemini','제미나이']},{id:'storage',name:'Google One 스토리지 5TB',detail:'Drive · Gmail · Google 포토 공용',aliases:['google one','google drive','구글드라이브','구글 드라이브','구글원']},{id:'workspace-ai',name:'Gmail·Docs의 Gemini',detail:'지원 언어·지역 제한 적용'}],groups:[],optional:[],
    sources:[{label:'Google AI Pro 공식 혜택',url:'https://gemini.google/kr/subscriptions/'},{label:'Google One 요금제 안내',url:'https://one.google.com/intl/ko_kr/about/google-ai-plans/'}]
  }
];

function bundleProduct(id) { return BUNDLE_CATALOG.find(p => p.id === id); }
function benefitEnd(start, months) {
  const [y,m,d] = start.split('-').map(Number);
  const endMonth = new Date(y,m-1+months,1);
  const end = new Date(endMonth.getFullYear(),endMonth.getMonth(),Math.min(d,new Date(endMonth.getFullYear(),endMonth.getMonth()+1,0).getDate()));
  return `${end.getFullYear()}-${String(end.getMonth()+1).padStart(2,'0')}-${String(end.getDate()).padStart(2,'0')}`;
}
function createBundle(productId, choices = {}, optional = {}) {
  const product = bundleProduct(productId);
  if (!product) return null;
  const benefits = product.included.map(b => ({...b,kind:'included'}));
  const normalizedChoices = {};
  for (const group of product.groups) {
    const option = group.options.find(o => o.id === choices[group.id]) || group.options[0];
    normalizedChoices[group.id] = option.id;
    benefits.push(...option.benefits.map(b => ({...b,kind:'choice'})));
  }
  const normalizedOptional = {};
  for (const option of product.optional) {
    const selected = optional[option.id];
    if (!selected) continue;
    const start = selected.start || '';
    normalizedOptional[option.id] = {start};
    benefits.push({...option,kind:'optional',start,end:start?benefitEnd(start,option.durationMonths):''});
  }
  return {productId,checkedAt:product.checkedAt,choices:normalizedChoices,optional:normalizedOptional,benefits,sources:product.sources};
}
function duplicateBenefits(bundle, subs, editingId) {
  const normalize = text => text.toLowerCase().replace(/\s/g,'');
  const matches = [];
  for (const b of bundle?.benefits || []) {
    if (b.end && b.end <= dateKey(now)) continue;
    for (const s of subs) {
      if (s.id === editingId) continue;
      const names = [s.name,...(s.bundle?.benefits || []).map(item=>item.name)];
      if ((b.aliases || []).some(alias=>names.some(name=>normalize(name).includes(normalize(alias))))) matches.push(`${b.name} ↔ ${s.name}`);
    }
  }
  return [...new Set(matches)];
}

// Finds services paid for twice: a benefit bundled into one subscription that is also subscribed to on its own
// (or bundled into a second subscription). Never changes data; callers only display the result.
function findOverlaps(subs, today = dateKey(now)) {
  const normalize = text => String(text).toLowerCase().replace(/\s/g,'');
  const matches = (aliases, name) => (aliases || []).some(alias => normalize(name).includes(normalize(alias)));
  const found = new Map();
  for (const owner of subs) {
    for (const b of owner.bundle?.benefits || []) {
      if (!b.aliases?.length || (b.end && b.end <= today)) continue;
      for (const other of subs) {
        if (other.id === owner.id) continue;
        const standalone = matches(b.aliases, other.name);
        const inOtherBundle = !standalone && (other.bundle?.benefits || []).some(ob => matches(b.aliases, ob.name) && !(ob.end && ob.end <= today));
        if (!standalone && !inOtherBundle) continue;
        const key = standalone ? `${owner.id}:${b.id}:${other.id}` : `bundle:${b.id}:${[owner.id, other.id].sort().join(':')}`;
        if (found.has(key)) continue;
        const monthly = standalone ? (other.cycle === 'yearly' ? Math.round(other.amount / 12) : other.amount) : 0;
        found.set(key, {key, kind: standalone ? 'standalone' : 'bundle', benefit: b.name, ownerId: owner.id, ownerName: owner.name, otherId: other.id, otherName: other.name, monthly, yearly: standalone ? (other.cycle === 'yearly' ? other.amount : other.amount * 12) : 0});
      }
    }
  }
  return [...found.values()];
}
