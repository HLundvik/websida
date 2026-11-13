/* Styrelsen – läser mappen styrelsebilder/ automatiskt.
   Varje årgång är en mapp: styrelsebilder/ÅR/ordning.txt
   ordning.txt har en rad per person i den ordning de ska visas:
       Roll/Förnamn.Efternamn.jpg
   Mappnamnet blir rollen, filnamnet blir namnet (punkter blir mellanslag).
   Lägg till ett nytt år genom att skapa en ny mapp med en ordning.txt – sidan hittar den själv. */
const FORSTA_AR = 2000;
const MAPP = 'styrelsebilder';

async function hamtaAr(ar) {
  try {
    const r = await fetch(`${MAPP}/${ar}/ordning.txt`, { cache: 'no-cache' });
    if (!r.ok) return null;
    const txt = await r.text();
    if (txt.trim().startsWith('<')) return null; // ingen fil (servern svarade med en webbsida)
    const rader = txt.split(/\r?\n/).map(s => s.trim()).filter(s => s && !s.startsWith('#'));
    if (!rader.length) return null;
    return rader.map(rad => {
      const delar = rad.split('/');
      const fil = delar.pop();
      const roll = delar.join(' / ');
      const namn = fil.replace(/\.[a-z0-9]+$/i, '').replace(/_+$/, '').split('.').join(' ');
      const url = [MAPP, ar, ...rad.split('/')].map(encodeURIComponent).join('/');
      return { namn, roll, url };
    });
  } catch { return null; }
}

function initialer(n) { return n.split(' ').filter(Boolean).map(s => s[0]).slice(0, 2).join('').toUpperCase(); }

function visa(ar, personer) {
  document.getElementById('year-title').textContent = `Styrelsen ${ar}`;
  const board = document.getElementById('board');
  board.innerHTML = '';
  personer.forEach(p => {
    const el = document.createElement('article');
    el.className = 'member';
    el.innerHTML = `<div class="ph"><img loading="lazy" alt=""></div><div class="txt"><h3></h3><p></p></div>`;
    const img = el.querySelector('img');
    img.alt = p.namn; img.src = p.url;
    img.onerror = () => { img.remove(); el.querySelector('.ph').textContent = initialer(p.namn); };
    el.querySelector('h3').textContent = p.namn;
    el.querySelector('p').textContent = p.roll;
    board.appendChild(el);
  });
  document.querySelectorAll('#years button').forEach(b => b.setAttribute('aria-selected', b.dataset.ar == ar));
}

(async () => {
  const sista = new Date().getFullYear() + 1;
  const ar = []; for (let y = sista; y >= FORSTA_AR; y--) ar.push(y);
  const res = await Promise.all(ar.map(hamtaAr));
  const hittade = ar.map((y, i) => [y, res[i]]).filter(([, p]) => p);
  const nav = document.getElementById('years');
  if (!hittade.length) { document.getElementById('board').innerHTML = '<p class="muted">Inga årgångar hittades.</p>'; return; }
  hittade.forEach(([y, p]) => {
    const b = document.createElement('button');
    b.textContent = y; b.dataset.ar = y; b.setAttribute('role', 'tab');
    b.onclick = () => { visa(y, p); history.replaceState(null, '', '#' + y); };
    nav.appendChild(b);
  });
  const fran = hittade.find(([y]) => '#' + y === location.hash) || hittade[0];
  visa(...fran);
})();
