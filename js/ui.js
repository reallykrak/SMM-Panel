// Toast, modal ve hata mesajı yardımcıları
function showToast(msg, type = 'success') {
  const c = document.getElementById('toastContainer');
  const t = document.createElement('div');
  t.className = 'toast ' + type;
  t.textContent = msg;
  c.appendChild(t);
  setTimeout(() => t.remove(), 3100);
}

function showErr(id) { const el = document.getElementById(id); if (el) { el.classList.add('show'); el.style.display = 'block'; } }
function hideErr(id) { const el = document.getElementById(id); if (el) { el.classList.remove('show'); el.style.display = 'none'; } }

function openModal(type) {
  if (type === 'auth') document.getElementById('authModal').classList.add('open');
  if (type === 'balance') {
    if (typeof resetPay === 'function') resetPay();
    document.getElementById('balanceModal').classList.add('open');
    const bal = currentUser ? currentUser.balance : 0;
    document.getElementById('modalBalance').textContent = '₺' + bal.toFixed(2);
  }
}
function closeModal(type) {
  if (type === 'auth') document.getElementById('authModal').classList.remove('open');
  if (type === 'balance') document.getElementById('balanceModal').classList.remove('open');
}
function switchTab(tab) {
  const lt = document.getElementById('loginTab'), rt = document.getElementById('registerTab');
  const lp = document.getElementById('loginPanel'), rp = document.getElementById('registerPanel');
  const login = tab === 'login';
  lt.classList.toggle('active', login); rt.classList.toggle('active', !login);
  lp.classList.toggle('active', login); rp.classList.toggle('active', !login);
}
document.querySelectorAll('.modal-overlay').forEach(o => {
  o.addEventListener('click', function (e) { if (e.target === this) this.classList.remove('open'); });
});
