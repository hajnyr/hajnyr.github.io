(() => {
  const root = document.documentElement;
  const toggle = document.querySelector('.theme-toggle');
  const preference = matchMedia('(prefers-color-scheme: dark)');
  let explicitChoice = false;
  try { explicitChoice = Boolean(localStorage.getItem('rhweb-design-theme')); } catch (_) {}
  const updateToggle = () => {
    const dark = root.dataset.theme === 'dark';
    toggle.setAttribute('aria-pressed', String(dark));
    toggle.setAttribute('aria-label', dark ? 'Přepnout na světlý vzhled' : 'Přepnout na tmavý vzhled');
    toggle.title = dark ? 'Světlý vzhled' : 'Tmavý vzhled';
  };
  toggle.hidden = false;
  updateToggle();
  toggle.addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    explicitChoice = true;
    try { localStorage.setItem('rhweb-design-theme', root.dataset.theme); } catch (_) {}
    updateToggle();
  });
  preference.addEventListener('change', event => {
    if (!explicitChoice) {
      root.dataset.theme = event.matches ? 'dark' : 'light';
      updateToggle();
    }
  });
  document.getElementById('year').textContent = new Date().getFullYear();
  const date = document.getElementById('date');
  const clock = document.getElementById('clock');
  const dateFormat = new Intl.DateTimeFormat('cs-CZ', { weekday: 'long', day: 'numeric', month: 'long' });
  const timeFormat = new Intl.DateTimeFormat('cs-CZ', { hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' });
  const binary = document.querySelector('.binary-clock');
  const digits = [];
  for (const label of ['H', 'M', 'S']) {
    const group = document.createElement('div');
    group.className = 'binary-group';
    for (let column = 0; column < 2; column++) {
      const digit = document.createElement('div');
      digit.className = 'binary-digit';
      const bits = [8, 4, 2, 1].map(weight => {
        const bit = document.createElement('span');
        bit.className = 'binary-bit';
        digit.append(bit);
        return { bit, weight };
      });
      digits.push(bits);
      group.append(digit);
    }
    const caption = document.createElement('span');
    caption.className = 'binary-label';
    caption.textContent = label;
    group.append(caption);
    binary.append(group);
  }
  const updateClock = () => {
    const now = new Date();
    date.textContent = dateFormat.format(now);
    date.dateTime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    clock.textContent = timeFormat.format(now);
    clock.dateTime = clock.textContent;
    const numbers = [now.getHours(), now.getMinutes(), now.getSeconds()]
      .map(value => String(value).padStart(2, '0')).join('');
    digits.forEach((bits, index) => {
      const value = Number(numbers[index]);
      bits.forEach(({ bit, weight }) => bit.classList.toggle('is-on', Boolean(value & weight)));
    });
    document.getElementById('year').textContent = now.getFullYear();
  };
  updateClock();
  document.querySelector('.identity-clock').hidden = false;
  setInterval(updateClock, 1000);
})();
