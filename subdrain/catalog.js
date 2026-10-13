// Reviewed source snapshot, not a live provider API. All amounts are per billing period.
const CATALOG_CHECKED_AT = '2026-10-01';
const SERVICE_CATALOG = [
  {id:'icloud',name:'iCloud+',category:'클라우드',source:'https://support.apple.com/ko-kr/108047',note:'한국 기준 · 부가세 포함',plans:[
    ...[['50gb','50GB',1100],['200gb','200GB',4400],['2tb','2TB',14000],['6tb','6TB',44000],['12tb','12TB',88000]].map(([id,capacity,monthly])=>({id,name:capacity,capacity,prices:{monthly}}))]},
  {id:'netflix',name:'Netflix',category:'엔터테인먼트',source:'https://www.netflix.com/kr/browse/genre/81615869',note:'한국 기본 멤버십 · 추가 회원 요금 제외',plans:[
    {id:'ads',name:'광고형 스탠다드 · 1080p',prices:{monthly:7000}}, {id:'standard',name:'스탠다드 · 1080p',prices:{monthly:13500}}, {id:'premium',name:'프리미엄 · 4K + HDR',prices:{monthly:17000}}]},
  {id:'spotify',name:'Spotify',category:'음악',source:'https://www.spotify.com/kr-ko/premium/',note:'부가세 포함 · 무료 체험 제외 · 학생은 자격 확인, 듀오는 동일 주소 조건',plans:[
    {id:'basic',name:'베이직',prices:{monthly:8690}}, {id:'individual',name:'개인',prices:{monthly:11990}}, {id:'duo',name:'듀오 · 2계정',prices:{monthly:17985}}, {id:'student',name:'학생',prices:{monthly:6600}}]},
  {id:'youtube',name:'YouTube Premium',category:'엔터테인먼트',source:'https://www.bworld.co.kr/product/btv/ytp.do?menu_id=P03050700',note:'공식 제휴사 SK브로드밴드 안내의 기본 요금 기준. iOS·제휴 할인은 실제 청구액을 입력하세요.',plans:[{id:'individual',name:'개인 · 웹 / Android',prices:{monthly:14900}},{id:'other',name:'iOS / 기타 제휴 요금제',prices:{}}]},
  {id:'notion',name:'Notion',category:'생산성',source:'https://www.notion.com/ko/pricing',note:'멤버당 표시 가격 · 연간 선택 시 1년 총액 · 세금과 실제 청구액은 별도 확인',seats:true,plans:[{id:'plus',name:'Plus',prices:{monthly:16800,yearly:168000}},{id:'business',name:'Business',prices:{monthly:36000,yearly:360000}}]},
  {id:'figma',name:'Figma',category:'생산성',source:'https://www.figma.com/pricing/',note:'USD 표시 가격 · 원화 청구액 직접 입력 · 월간 가격은 미확인',seats:true,plans:[{id:'full',name:'Professional · Full seat',currency:'USD',prices:{yearly:192}},{id:'dev',name:'Professional · Dev seat',currency:'USD',prices:{yearly:144}},{id:'collab',name:'Professional · Collab seat',currency:'USD',prices:{yearly:36}}]},
  ...BUNDLE_CATALOG.map(p=>({id:p.id,name:p.name,category:p.category,source:p.sources[0].url,note:p.id==='baemin'?'공식 공개 가격 미확인 · 실제 청구액을 입력하세요.':'기본 구독료 · 할인 및 프로모션 제외',plans:[{id:'base',name:p.id==='google'?'Google AI Pro · 5TB':'기본 멤버십',capacity:p.id==='google'?'5TB':undefined,prices:p.prices || (p.id==='google'?{monthly:29000}:{})}]}))
];
// Google plan pricing has its own source, separate from the bundle benefit documentation.
SERVICE_CATALOG.find(p=>p.id==='google').source='https://one.google.com/intl/ko_kr/about/google-ai-plans/';
function catalogService(id) { return SERVICE_CATALOG.find(p=>p.id===id); }
function catalogPrice(serviceId,planId,cycle,seats=1) {
  const product=catalogService(serviceId),plan=product?.plans.find(p=>p.id===planId);
  const unit=plan?.prices[cycle];
  if(unit==null || !Number.isInteger(seats) || seats<1 || seats>1000)return null;
  return {unit,total:unit*(product.seats?seats:1),currency:plan.currency||'KRW'};
}
