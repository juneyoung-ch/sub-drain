function renderPlanOptions(sub) {
  const product=catalogService(selectedProduct),host=$('#plan-options');
  host.hidden=!product;
  if(!product){host.innerHTML='';return;}
  // Legacy entries keep their original amount and memo until the user explicitly chooses a plan.
  const saved=sub?.plan;
  host.innerHTML=`<label>요금제 · 용량<select name="catalog-plan" id="catalog-plan"><option value="">기존 / 사용자 지정 요금제</option>${product.plans.map(p=>`<option value="${p.id}">${escapeHTML(p.name)}</option>`).join('')}</select></label>${product.seats?'<label>유료 멤버 / 좌석 수<input name="catalog-seats" id="catalog-seats" type="number" min="1" max="1000" step="1" value="1" required></label>':''}<div id="plan-quote" aria-live="polite"></div><p class="catalog-note">${escapeHTML(product.note)}</p><a href="${escapeHTML(product.source)}" target="_blank" rel="noopener noreferrer">${product.id==='youtube'?'공식 제휴사 가격 안내':'공식 요금표'} ↗</a><small class="catalog-date">${CATALOG_CHECKED_AT} 확인 · 저장된 요금표</small>`;
  $('#catalog-plan').value=saved?.planId || (sub?'':product.plans[0].id);
  if($('#catalog-seats'))$('#catalog-seats').value=saved?.seats||1;
  if(!sub)applyPlanPrice();else updatePlanQuote();
}
function selectedQuote() {
  return catalogPrice(selectedProduct,$('#catalog-plan')?.value,$('#sub-form').elements.cycle.value,Number($('#catalog-seats')?.value||1));
}
function applyPlanPrice() {
  const quote=selectedQuote();
  $('#sub-form').elements.amount.value=quote?.currency==='KRW'?quote.total:'';
  updatePlanQuote();
}
function updatePlanQuote() {
  if(!$('#plan-quote'))return;
  const quote=selectedQuote(),cycle=$('#sub-form').elements.cycle.value;
  const product=catalogService(selectedProduct);
  for(const option of $('#catalog-plan').options) {
    const plan=product.plans.find(p=>p.id===option.value);
    if(!plan)continue;
    const price=plan.prices[cycle];
    option.textContent=`${plan.name} · ${price==null?'금액 직접 입력':`${plan.currency==='USD'?'US$':''}${won(price)}${plan.currency==='USD'?'':'원'}/${cycle==='yearly'?'년':'월'}${product.seats?' · 1명 기준':''}`}`;
  }
  const actual=Number($('#sub-form').elements.amount.value);
  $('#plan-quote').innerHTML=quote?`<div class="quote-line"><span>${cycle==='yearly'?'연간 총액':'월 결제액'}</span><strong>${quote.currency==='KRW'?`${won(quote.total)}원`:`US$${quote.total}`}</strong></div><p>${quote.currency==='USD'?'외화 요금입니다. 아래에 카드의 실제 원화 청구액을 입력하세요.':actual===quote.total?'선택한 요금이 결제 금액에 반영됩니다.':'입력한 결제액을 유지 중입니다. 할인·세금 등 실제 청구액을 저장합니다.'}</p>${quote.currency==='KRW'?'<button type="button" id="apply-catalog-price" class="text-button">공식 요금 적용 ↗</button>':''}`:'<p>선택한 요금제·결제 주기의 공식 가격이 없습니다. 실제 청구액을 입력하세요.</p>';
}
function readPlanEditor() {
  const product=catalogService(selectedProduct),plan=product?.plans.find(p=>p.id===$('#catalog-plan')?.value);
  if(!plan)return null;
  const quote=selectedQuote();
  return {serviceId:product.id,planId:plan.id,name:plan.name,capacity:plan.capacity,seats:Number($('#catalog-seats')?.value||1),cycle:$('#sub-form').elements.cycle.value,currency:plan.currency||'KRW',listPrice:quote?.total??null,checkedAt:CATALOG_CHECKED_AT,source:product.source};
}
document.addEventListener('click',e=>{if(e.target.closest('#apply-catalog-price')){applyPlanPrice();updateBundleSummary();}});
