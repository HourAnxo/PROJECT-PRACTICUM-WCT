// ── Tab switcher ──
  function switchTab(tab) {
    document.getElementById('panelLogin').classList.toggle('active', tab === 'login');
    document.getElementById('panelRegister').classList.toggle('active', tab === 'register');
    document.getElementById('tabLogin').classList.toggle('active', tab === 'login');
    document.getElementById('tabRegister').classList.toggle('active', tab === 'register');
    clearAlerts();
  }

  // ── Show/hide password ──
  function togglePw(id, btn) {
    const input = document.getElementById(id);
    if (input.type === 'password') { input.type = 'text'; btn.textContent = '🙈'; }
    else                           { input.type = 'password'; btn.textContent = '👁'; }
  }

  // ── Password strength ──
  function checkStrength(val) {
    const fill  = document.getElementById('strengthFill');
    const label = document.getElementById('strengthLabel');
    let score = 0;
    if (val.length >= 6)  score++;
    if (val.length >= 10) score++;
    if (/[A-Z]/.test(val)) score++;
    if (/[0-9]/.test(val)) score++;
    if (/[^A-Za-z0-9]/.test(val)) score++;

    const levels = [
      { pct: '0%',   color: 'transparent', text: 'Password strength' },
      { pct: '25%',  color: '#ef4444',     text: 'Weak' },
      { pct: '50%',  color: '#f97316',     text: 'Fair' },
      { pct: '75%',  color: '#eab308',     text: 'Good' },
      { pct: '100%', color: '#16a34a',     text: 'Strong 💪' },
    ];
    const lvl = levels[Math.min(score, 4)];
    fill.style.width = lvl.pct;
    fill.style.background = lvl.color;
    label.textContent = lvl.text;
    label.style.color = lvl.color === 'transparent' ? '#64748b' : lvl.color;
  }

  // ── Helpers ──
  function setError(id, show) {
    const el = document.getElementById(id);
    el.classList.toggle('show', show);
    const input = el.previousElementSibling?.tagName === 'INPUT'
      ? el.previousElementSibling
      : el.closest('.form-group').querySelector('input');
    if (input) input.classList.toggle('error-field', show);
  }

  function showAlert(id, msg) {
    const el = document.getElementById(id);
    el.textContent = (id.includes('Error') ? '⚠️ ' : '✅ ') + msg;
    el.classList.add('show');
  }

  function clearAlerts() {
    ['loginError','loginSuccess','regError','regSuccess'].forEach(id => {
      document.getElementById(id).classList.remove('show');
    });
  }

  function setLoading(btnId, spinnerId, txtId, loading) {
    document.getElementById(btnId).disabled = loading;
    document.getElementById(spinnerId).style.display = loading ? 'block' : 'none';
    document.getElementById(txtId).style.display = loading ? 'none' : 'inline';
  }

  function getUsers() {
    return JSON.parse(localStorage.getItem('qd_users') || '[]');
  }
  function saveUsers(users) {
    localStorage.setItem('qd_users', JSON.stringify(users));
  }

  // ── LOGIN ──
  function handleLogin() {
    clearAlerts();
    const email    = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    let valid = true;
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('loginEmailErr', true); valid = false;
    } else { setError('loginEmailErr', false); }

    if (!password) {
      setError('loginPasswordErr', true); valid = false;
    } else { setError('loginPasswordErr', false); }

    if (!valid) return;

    setLoading('loginBtn', 'loginSpinner', 'loginBtnText', true);

    setTimeout(() => {
      setLoading('loginBtn', 'loginSpinner', 'loginBtnText', false);
      const users = getUsers();
      const user  = users.find(u => u.email === email && u.password === password);

      if (!user) {
        showAlert('loginError', 'Incorrect email or password.');
        return;
      }
      localStorage.setItem('loggedInUser', user.firstName + ' ' + user.lastName);
      showAlert('loginSuccess', `Welcome back, ${user.firstName}! Redirecting...`);
      setTimeout(() => window.location.href = 'Food_System.Html', 1500);
    }, 900);
  }

  // ── REGISTER ──
  function handleRegister() {
    clearAlerts();
    const first    = document.getElementById('regFirst').value.trim();
    const last     = document.getElementById('regLast').value.trim();
    const email    = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPassword').value;
    const confirm  = document.getElementById('regConfirm').value;

    let valid = true;

    if (!first)  { setError('regFirstErr', true);   valid = false; } else { setError('regFirstErr', false); }
    if (!last)   { setError('regLastErr', true);    valid = false; } else { setError('regLastErr', false); }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('regEmailErr', true); valid = false;
    } else { setError('regEmailErr', false); }

    if (password.length < 6) {
      setError('regPasswordErr', true); valid = false;
    } else { setError('regPasswordErr', false); }

    if (password !== confirm) {
      setError('regConfirmErr', true); valid = false;
    } else { setError('regConfirmErr', false); }

    if (!valid) return;

    setLoading('regBtn', 'regSpinner', 'regBtnText', true);

    setTimeout(() => {
      setLoading('regBtn', 'regSpinner', 'regBtnText', false);
      const users = getUsers();

      if (users.find(u => u.email === email)) {
        showAlert('regError', 'An account with this email already exists.');
        return;
      }

      users.push({ firstName: first, lastName: last, email, password });
      saveUsers(users);

      showAlert('regSuccess', `Account created! Switching to login...`);
      setTimeout(() => {
        document.getElementById('loginEmail').value = email;
        switchTab('login');
      }, 1500);
    }, 900);
  }

  // ── Auto-fill email if coming back from register ──
  window.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('tab') === 'register') switchTab('register');
  });