// Başlangıç
(async () => {
  await loadMe();
  renderNav();
  updateQuantity(250);

  const p = new URLSearchParams(location.search).get('odeme');
  if (p) {
    history.replaceState(null, '', '/');
    if (p === 'ok') {
      showToast('✅ Ödeme alındı, bakiyeniz birazdan güncellenecek.', 'success');
      setTimeout(async () => { await loadMe(); renderNav(); }, 4000);
    } else {
      showToast('Ödeme tamamlanamadı.', 'error');
    }
  }
})();
