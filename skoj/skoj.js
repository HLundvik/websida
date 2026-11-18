/* Skoj – läser in spelen automatiskt.
   Filen spel.txt (i samma mapp) har en rad per spel med mappens namn.
   Varje spel ligger i sin egen mapp: skoj/SPELNAMN/index.html
   och kan ha en förstabild: skoj/SPELNAMN/preview.jpg
   Lägg till ett nytt spel genom att skapa mappen och skriva dess namn
   på en ny rad i spel.txt – sidan hittar det själv. */

// Gör ett snyggt namn av mappnamnet: "mitt-spel" blir "Mitt spel"
function snyggtNamn(mapp) {
  const ord = mapp.replace(/[-_]+/g, " ").trim();
  return ord.charAt(0).toUpperCase() + ord.slice(1);
}

function byggKort(mapp) {
  const namn = snyggtNamn(mapp);
  const kort = document.createElement("a");
  kort.className = "spel-kort";
  kort.href = encodeURIComponent(mapp) + "/index.html";

  // Förstabilden: saknas preview.jpg visas spelets namn i stället
  const bild = document.createElement("img");
  bild.loading = "lazy";
  bild.alt = namn;
  bild.src = encodeURIComponent(mapp) + "/preview.jpg";
  bild.onerror = () => {
    bild.remove();
    const tom = document.createElement("div");
    tom.className = "spel-tom";
    tom.textContent = namn;
    kort.prepend(tom);
  };

  const text = document.createElement("div");
  text.className = "spel-text";
  const rubrik = document.createElement("h3");
  rubrik.textContent = namn;
  const pil = document.createElement("span");
  pil.textContent = "Spela →";
  text.append(rubrik, pil);

  kort.append(bild, text);
  return kort;
}

(async () => {
  const lista = document.getElementById("spel-lista");
  try {
    const r = await fetch("spel.txt", { cache: "no-cache" });
    if (!r.ok) throw new Error();
    const txt = await r.text();
    if (txt.trim().startsWith("<")) throw new Error(); // servern svarade med en webbsida
    const spel = txt
      .split(/\r?\n/)
      .map((s) => s.trim())
      .filter((s) => s && !s.startsWith("#"));
    if (!spel.length) throw new Error();
    lista.innerHTML = ""; // ta bort "Laddar spel …"
    spel.forEach((mapp) => lista.appendChild(byggKort(mapp)));
  } catch {
    lista.innerHTML =
      '<p class="muted">Inga spel hittades ännu. Lägg en mapp i skoj/ och skriv dess namn i spel.txt.</p>';
  }
})();
