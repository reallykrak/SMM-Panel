// Giriş / Kayıt / Çıkış
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function setFieldState(inputId, errId, ok) {
  const input = document.getElementById(inputId);
  if (ok) { input.classList.remove('input-error'); return; }
  showErr(errId); input.classList.add('input-error');
}

async function handleLogin() {
  const email = document.getElementById('loginEmail').value.trim().toLowerCase();
  const pass = document.getElementById('loginPassword').value;
  hideErr('loginEmailErr'); hideErr('loginPassErr'); hideErr('loginGenErr');

  const emailOk = EMAIL_RE.test(email);
  const passOk = pass && pass.length >= 6;
  setFieldState('loginEmail', 'loginEmailErr', emailOk);
  setFieldState('loginPassword', 'loginPassErr', passOk);
  if (!emailOk || !passOk) return;

  try {
    const d = await api('/api/auth', { method: 'POST', body: { action: 'login', email, password: pass } });
    setUser(d.user);
    closeModal('auth');
    renderNav();
    showToast('✅ Hoş geldiniz, ' + d.user.name.split(' ')[0] + '!', 'success');
  } catch (e) {
    document.getElementById('loginGenErr').textContent = e.message;
    showErr('loginGenErr');
  }
}

async function handleRegister() {
  const name = document.getElementById('regName').value.trim();
  const email = document.getElementById('regEmail').value.trim().toLowerCase();
  const pass = document.getElementById('regPassword').value;
  hideErr('regNameErr'); hideErr('regEmailErr'); hideErr('regPassErr'); hideErr('regGenErr');

  const nameOk = name.length >= 2;
  const emailOk = EMAIL_RE.test(email);
  const passOk = pass && pass.length >= 8;
  setFieldState('regName', 'regNameErr', nameOk);
  setFieldState('regEmail', 'regEmailErr', emailOk);
  setFieldState('regPassword', 'regPassErr', passOk);
  if (!nameOk || !emailOk || !passOk) return;

  try {
    const d = await api('/api/auth', { method: 'POST', body: { action: 'register', name, email, password: pass } });
    setUser(d.user);
    closeModal('auth');
    renderNav();
    showToast('✅ Hesabınız oluşturuldu! Hoş geldiniz, ' + name.split(' ')[0] + '!', 'success');
  } catch (e) {
    document.getElementById('regGenErr').textContent = e.message;
    showErr('regGenErr');
  }
}

async function handleLogout() {
  try { await api('/api/auth', { method: 'POST', body: { action: 'logout' } }); } catch {}
  currentUser = null;
  closeDropdown();
  renderNav();
  showToast('Çıkış yapıldı.', 'success');
}
