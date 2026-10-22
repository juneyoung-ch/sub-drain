// Dashboard notice for overlapping subscriptions. Dismissals are kept in data.dismissed (saved and exported with the rest).
function activeOverlaps() { const dismissed = data.dismissed || []; return findOverlaps(data.subs).filter(o => !dismissed.includes(o.key)); }
function overlapPanel() {
  const all = findOverlaps(data.subs), list = activeOverlaps(), hidden = all.length - list.length;
  if (!list.length) return hidden ? `<div class="overlap-hidden"><button data-undismiss>숨긴 중복 알림 ${hidden}개 다시 보기</button></div>` : '';
  const saving = list.reduce((sum, o) => sum + o.yearly, 0);
  return `<section class="overlap-panel" aria-label="중복 구독 알림"><div class="overlap-head"><div><b>겹치는 구독 ${list.length}건을 찾았어요</b>${saving ? `<small>정리하면 1년에 최대 ${won(saving)}원을 아낄 수 있어요</small>` : '<small>같은 서비스가 두 곳에 포함되어 있는지 확인해 보세요</small>'}</div></div>${list.map(o => `<article class="overlap-item"><div><b>${escapeHTML(o.benefit)}</b>${o.kind === 'standalone'
    ? `<p>‘${escapeHTML(o.ownerName)}’에 이미 포함되어 있는데 ‘${escapeHTML(o.otherName)}’도 따로 결제하고 있어요.</p><p class="overlap-tip">단독 구독(${won(o.monthly)}원/월)을 정리하면 연 ${won(o.yearly)}원을 아낄 수 있어요. 해지 전에 묶음 상품의 가입·계정 연동이 끝났는지 먼저 확인하세요.</p>`
    : `<p>‘${escapeHTML(o.ownerName)}’과 ‘${escapeHTML(o.otherName)}’ 두 묶음에 모두 포함되어 있어요.</p><p class="overlap-tip">한쪽 혜택만 사용 중이라면 더 저렴하거나 필요 없는 묶음을 줄일 수 있는지 살펴보세요.</p>`}</div><div class="overlap-actions"><button class="primary" data-edit="${o.otherId}">${o.kind === 'standalone' ? '단독 구독 확인' : '구독 확인'}</button><button class="text-button" data-dismiss="${escapeHTML(o.key)}">유지할게요</button></div></article>`).join('')}</section>`;
}
function notifyOverlaps() { const n = activeOverlaps().length; if (n) toast(`겹치는 구독 ${n}건을 찾았어요. 대시보드에서 확인하세요.`); }
document.addEventListener('click', e => {
  const dismiss = e.target.closest('[data-dismiss]');
  if (dismiss) { const previous = data.dismissed; data.dismissed = [...new Set([...(data.dismissed || []), dismiss.dataset.dismiss])]; if (!persist()) data.dismissed = previous; render(); }
  if (e.target.closest('[data-undismiss]')) { const previous = data.dismissed; data.dismissed = []; if (!persist()) data.dismissed = previous; render(); }
});
