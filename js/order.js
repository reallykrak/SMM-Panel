// Sipariş formu (fiyatı ve bakiyeyi sunucu doğrular)
function updateQuantity(val) {
  let n = parseInt(val) || 1;
  n = Math.max(1, Math.min(1000, n));
  document.getElementById('quantityDisplay').textContent = n + ' beğeni';
  document.getElementById('quantityRange').value = n;
  document.getElementById('totalPrice').textContent = '₺' + ((n / 1000) * PRICE_PER_1000).toFixed(2);
}
function updateQuantityFromRange(val) {
  document.getElementById('quantityInput').value = val;
  updateQuantity(val);
}

async function handleOrder() {
  const link = document.getElementById('postLink').value.trim();
  const qty = parseInt(document.getElementById('quantityInput').value) || 0;

  if (!currentUser) { showToast('Sipariş vermek için giriş yapınız.', 'error'); openModal('auth'); return; }
  if (!link) { showToast('Lütfen Instagram gönderi linkini giriniz.', 'error'); document.getElementById('postLink').focus(); return; }
  if (qty < 1 || qty > 1000) { showToast('Miktar 1 ile 1000 arasında olmalıdır.', 'error'); return; }

  try {
    const d = await api('/api/order', { method: 'POST', body: { link, quantity: qty } });
    currentUser.balance = d.balance / 100;
    renderNav();
    document.getElementById('postLink').value = '';
    document.getElementById('quantityInput').value = 250;
    document.getElementById('quantityRange').value = 250;
    updateQuantity(250);
    showToast('✅ ' + qty + ' beğeni siparişiniz alındı!', 'success');
  } catch (e) {
    showToast(e.message, 'error');
    if (/bakiye/i.test(e.message)) openModal('balance');
  }
}

function scrollToOrder() {
  document.getElementById('siparis').scrollIntoView({ behavior: 'smooth' });
}
