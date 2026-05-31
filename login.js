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

  
  // ── LOGIN ──
 async function handleLogin() {

  clearAlerts();

  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;

  if (!email || !password) {
    showAlert('loginError', 'Please fill all fields');
    return;
  }

  try {

    const response = await fetch('http://localhost:3000/login', {

      method: 'POST',

      headers: {
        'Content-Type': 'application/json'
      },

      body: JSON.stringify({
        email,
        password
      })

    });

    const data = await response.json();

    if (data.success) {

      localStorage.setItem(
        'loggedInUser',
        data.user.first_name
      );

      showAlert('loginSuccess', 'Login successful');

      setTimeout(() => {
        window.location.href = 'Food_System.Html';
      }, 1500);

    } else {

      showAlert('loginError', data.message);

    }

  } catch (error) {

    showAlert('loginError', 'Cannot connect to server');

    console.log(error);

  }

}

 // REGISTER
async function handleRegister() {

  const firstname = document.getElementById('regFirst').value.trim();
  const lastname = document.getElementById('regLast').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const password = document.getElementById('regPassword').value;
  const confirm_password = document.getElementById('regConfirm').value;

  if (!firstname || !lastname || !email || !password || !confirm_password) {
    alert('Please fill all fields');
    return;
  }

  if (password !== confirm_password) {
    alert('Passwords do not match');
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstname, lastname, email, password })
    });

    const data = await response.json();

    if (response.ok) {
      alert(data.message);
    } else {
      alert(data.message);
    }

  } catch (error) {
    console.log(error);
    alert('Cannot connect to server');
  }
}

