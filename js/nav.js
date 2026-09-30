// Navbar render + kullanıcı menüsü
let currentUser = null; // {name, email, balance(TL)}

function setUser(u) {
  currentUser = u ? { name: u.name, email: u.email, balance: u.balance / 100 } : null;
}
async function loadMe() {
  try { setUser((await api('/api/auth')).user); } catch { setUser(null); }
}

function renderNav() {
  const nr = document.getElementById('navRight');
  const balTxt = currentUser ? '₺' + currentUser.balance.toFixed(2) : '₺0.00';

  if (currentUser) {
    const initials = currentUser.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
    nr.innerHTML = `
      <div class="balance-badge" onclick="openModal('balance')">
        💰 <strong id="balanceDisplay">${balTxt}</strong>
      </div>
      <div class="user-menu-wrap">
        <div class="user-btn" onclick="toggleUserMenu()">
          <div class="user-avatar">${initials}</div>
          <span class="user-name">${currentUser.name.split(' ')[0]}</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg>
        </div>
        <div class="user-dropdown" id="userDropdown">
          <div class="dropdown-user-info">
            <div class="dui-name">${currentUser.name}</div>
            <div class="dui-email">${currentUser.email}</div>
          </div>
          <div class="dropdown-divider"></div>
          <div class="dropdown-item" onclick="openModal('balance');closeDropdown()">💰 Bakiye Yükle</div>
          <div class="dropdown-item" onclick="showToast('Siparişlerim yakında aktif olacak.','success');closeDropdown()">📦 Siparişlerim</div>
          <div class="dropdown-divider"></div>
          <div class="dropdown-item logout" onclick="handleLogout()">Çıkış Yap</div>
        </div>
      </div>`;
  } else {
    nr.innerHTML = `
      <div class="balance-badge" onclick="openModal('balance')">
        💰 <strong id="balanceDisplay">₺0.00</strong>
      </div>
      <button class="btn btn-load" onclick="openModal('balance')">+ Yükle</button>
      <button class="btn btn-outline" onclick="openModal('auth'); switchTab('login')">Giriş Yap</button>
      <button class="btn btn-primary" onclick="openModal('auth'); switchTab('register')">Kayıt Ol</button>`;
  }
}

function toggleUserMenu() { const d = document.getElementById('userDropdown'); if (d) d.classList.toggle('open'); }
function closeDropdown() { const d = document.getElementById('userDropdown'); if (d) d.classList.remove('open'); }
document.addEventListener('click', function (e) {
  const wrap = document.querySelector('.user-menu-wrap');
  if (wrap && !wrap.contains(e.target)) closeDropdown();
});
