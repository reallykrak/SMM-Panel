// Bakiye yükleme: kart (PayTR 3D Secure iframe) veya havale/EFT (IBAN + açıklama kodu)
let selectedAmount = 0;
let payMethod = 'card';

function selectAmount(amt, btn) {
  selectedAmount = amt;
  document.querySelectorAll('.amount-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  document.getElementById('customAmount').value = '';
}
function setCustomAmount(val) {
  selectedAmount = parseFloat(val) || 0;
  document.querySelectorAll('.amount-btn').forEach(b => b.classList.remove('selected'));
}
function selectPay(btn) {
  document.querySelectorAll('.pay-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  payMethod = btn.dataset.method;
}

function resetPay() {
  document.getElementById('payForm').style.display = 'block';
  const st = document.getElementById('payStage');
  st.style.display = 'none'; st.innerHTML = '';
  document.querySelector('.balance-modal').style.maxWidth = '';
}

async function handleTopup() {
  if (!currentUser) { closeModal('balance'); openModal('auth'); return; }
  if (selectedAmount < 10) { showToast('En az ₺10 yükleyebilirsiniz.', 'error'); return; }
  try {
    const d = await api('/api/deposit', { method: 'POST', body: { method: payMethod, amount: selectedAmount } });
    document.getElementById('payForm').style.display = 'none';
    const st = document.getElementById('payStage');
    st.style.display = 'block';
    if (payMethod === 'card') {
      document.querySelector('.balance-modal').style.maxWidth = '560px';
      st.innerHTML = `<a href="#" class="back-link" onclick="resetPay();return false;">← Geri</a>
        <iframe src="https://www.paytr.com/odeme/guvenli/${d.token}" style="width:100%;height:600px;border:0;border-radius:10px;background:#fff" allow="payment"></iframe>`;
    } else {
      st.innerHTML = `<a href="#" class="back-link" onclick="resetPay();return false;">← Geri</a>
        <div class="iban-box">
          <div><span>Banka</span><b>${d.bank}</b></div>
          <div><span>Alıcı</span><b>${d.name}</b></div>
          <div><span>IBAN</span><b id="ibanTxt">${d.iban}</b></div>
          <div><span>Tutar</span><b>₺${(d.amount / 100).toFixed(2)}</b></div>
          <div><span>Açıklama</span><b id="ibanCode" class="code">${d.oid}</b></div>
        </div>
        <button class="btn btn-outline btn-form" onclick="copyText('ibanTxt')">IBAN'ı Kopyala</button>
        <button class="btn btn-outline btn-form" onclick="copyText('ibanCode')">Açıklama Kodunu Kopyala</button>
        <p class="iban-note">Açıklama kısmına <b>yalnızca yukarıdaki kodu</b> yazın. Tutarı aynen gönderin. Ödemeniz kontrol edildikten sonra bakiyenize eklenir.</p>`;
    }
  } catch (e) {
    showToast(e.message, 'error');
  }
}

function copyText(id) {
  const t = document.getElementById(id).textContent;
  navigator.clipboard.writeText(t).then(() => showToast('Kopyalandı', 'success'));
}
