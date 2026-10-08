let selectedProduct = '';
function renderProductPicker() {
  $('#product-picker').innerHTML = `<label>서비스 선택<select id="catalog-service"><option value="">직접 입력</option>${SERVICE_CATALOG.map(p=>`<option value="${p.id}" ${selectedProduct===p.id?'selected':''}>${escapeHTML(p.name)}</option>`).join('')}</select></label>`;
}
function setupBundleEditor(sub) {
  selectedProduct = sub?.plan?.serviceId || sub?.bundle?.productId || SERVICE_CATALOG.find(p=>p.name.toLowerCase()===sub?.name?.toLowerCase())?.id || '';
  renderProductPicker();
  renderPlanOptions(sub);
  renderBundleOptions(sub?.bundle);
}
function readBundleEditor() {
  const product = bundleProduct(selectedProduct);
  if (!product) return null;
  const choices = {}, optional = {};
  for (const group of product.groups) choices[group.id] = $(`#bundle-options input[name="bundle-${group.id}"]:checked`)?.value;
  for (const item of product.optional) if ($(`#option-${item.id}`).checked) optional[item.id] = {start:$(`#start-${item.id}`).value};
  return createBundle(selectedProduct,choices,optional);
}
function renderBundleOptions(saved) {
  const product = bundleProduct(selectedProduct);
  $('#bundle-options').hidden = !product;
  if (!product) { $('#bundle-options').innerHTML=''; updateBundleSummary(); return; }
  const bundle = saved || createBundle(selectedProduct);
  $('#bundle-options').innerHTML = `<div class="bundle-title"><span>구독 하나, 함께 누리는 혜택</span><span class="verified-date">정보 확인 ${product.checkedAt}</span></div><p class="bundle-description">${escapeHTML(product.description)}</p>
    <details open class="option-section"><summary>기본 제공 <span>${product.included.length}가지 포함</span></summary><div class="included-options">${product.included.map(b=>`<div class="included-option"><span class="included-check">✓</span><div><b>${escapeHTML(b.name)}</b><small>${escapeHTML(b.detail)}</small></div><em>포함</em></div>`).join('')}</div></details>
    ${product.groups.map(group=>`<details open class="option-section"><summary>${escapeHTML(group.title)}<span>${escapeHTML(group.hint)}</span></summary><fieldset class="option-list"><legend class="sr-only">${escapeHTML(group.title)}</legend>${group.options.map(option=>`<label class="benefit-option"><input type="radio" name="bundle-${group.id}" value="${option.id}" ${bundle.choices[group.id]===option.id?'checked':''}><span><b>${escapeHTML(option.name)}</b>${option.detail?`<small>${escapeHTML(option.detail)}</small>`:''}</span><em>${group.id==='plan'?'':'선택'}</em></label>`).join('')}</fieldset></details>`).join('')}
    ${product.optional.length?`<details open class="option-section"><summary>함께 이용하는 혜택<span>선택 · 별도 연동</span></summary>${product.optional.map(o=>`<label class="benefit-option"><input id="option-${o.id}" type="checkbox" ${bundle.optional[o.id]?'checked':''}><span><b>${escapeHTML(o.name)}</b><small>${escapeHTML(o.detail)}</small></span><em>${o.durationMonths}개월</em></label><div class="benefit-period" id="period-${o.id}" ${bundle.optional[o.id]?'':'hidden'}><label>무료 혜택 시작일<input id="start-${o.id}" type="date" value="${escapeHTML(bundle.optional[o.id]?.start||'')}" ${bundle.optional[o.id]?'required':''}></label><p id="end-${o.id}"></p></div>`).join('')}</details>`:''}
    <p class="bundle-note">${escapeHTML(product.note)}</p><div class="bundle-sources">${product.sources.map(s=>`<a href="${escapeHTML(s.url)}" target="_blank" rel="noopener noreferrer">${escapeHTML(s.label)} ↗</a>`).join('')}</div>`;
  updateBundleSummary();
}
function updateBundleSummary() {
  const product = bundleProduct(selectedProduct);
  if (product) for (const option of product.optional) {
    const enabled = $(`#option-${option.id}`).checked;
    $(`#period-${option.id}`).hidden = !enabled;
    const input = $(`#start-${option.id}`);
    input.required = enabled;
    $(`#end-${option.id}`).textContent = input.value ? `${benefitEnd(input.value,option.durationMonths)}부터 무료 기간 종료 · 이후 요금 별도 확인` : '실제 연동한 날짜를 입력하면 종료 시점을 계산해 드려요.';
  }
  const bundle = readBundleEditor(), form = $('#sub-form');
  const amount = Number(form.elements.amount.value);
  $('#bundle-summary').hidden = !bundle;
  if (!bundle) return;
  const duplicate = duplicateBenefits(bundle,data.subs,editing);
  $('#bundle-summary').innerHTML = `<div><span>묶음 전체 결제액</span><strong>${amount?`${won(amount)}원`:'금액을 입력하세요'}<small> / ${form.elements.cycle.value==='yearly'?'년':'월'}</small></strong></div><p>${bundle.benefits.length}가지 혜택을 함께 기록해요. 포함 혜택은 별도 지출로 더하지 않아요.</p>${duplicate.length?`<div class="duplicate-notice"><b>겹치는 서비스가 있어요</b><br>${duplicate.map(escapeHTML).join('<br>')}<br>계정·요금제가 다를 수 있어 기존 구독은 그대로 유지합니다.</div>`:''}`;
}
document.addEventListener('change',e=>{
  if(e.target.id!=='catalog-service')return;
  selectedProduct=e.target.value;
  const product=catalogService(selectedProduct),form=$('#sub-form');
  form.elements.name.value=product?.name||'';
  form.elements.amount.value='';
  if(product)form.elements.category.value=product.category;
  renderPlanOptions();renderBundleOptions();
});
$('#sub-form').addEventListener('change',e=>{
  if(selectedProduct && ['cycle','catalog-plan','catalog-seats'].includes(e.target.name))applyPlanPrice();
  if(e.target.name==='bundle-plan') $('#sub-form').elements.amount.value='';
  updateBundleSummary();updatePlanQuote();
});
$('#sub-form').addEventListener('input',e=>{if(e.target.name==='catalog-seats')applyPlanPrice();updateBundleSummary();updatePlanQuote();});
