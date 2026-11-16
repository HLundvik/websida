/* =========================================================
   GEMENSAMT SKRIPT FÖR ALLA SIDOR
   1. Hämtar sidhuvud och sidfot från mappen delar/
   2. Markerar sidan man står på i menyn
   3. Mobilmeny och rullgardinsmenyer
   4. Mjuk inglidning när man scrollar
   OBS: Sidhuvud/sidfot laddas med fetch(), vilket fungerar på
   GitHub Pages men inte om man dubbelklickar på en fil lokalt.
   ========================================================= */

/* ---------- 1. Hämta sidhuvud och sidfot ---------- */
async function laddaDelar() {
  const platser = document.querySelectorAll("[data-include]");
  await Promise.all(
    [...platser].map(async (el) => {
      try {
        const svar = await fetch(el.dataset.include);
        el.innerHTML = await svar.text();
      } catch (fel) {
        console.error("Kunde inte ladda", el.dataset.include, fel);
      }
    }),
  );
}

/* ---------- 2. Markera aktuell sida i menyn ---------- */
function markeraAktivSida() {
  const sida = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".menu a").forEach((lank) => {
    if (lank.getAttribute("href") !== sida) return;
    lank.classList.add("active");
    // Ligger länken i en rullgardinsmeny? Markera då även knappen ("Om oss" m.fl.)
    const meny = lank.closest(".dropdown");
    if (meny) meny.querySelector("button").classList.add("active");
  });
}

/* ---------- 3. Menyer ---------- */
function startaMenyer() {
  const knapp = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".site-header nav");
  if (!knapp || !nav) return;

  // Hamburgarknappen på mobil/surfplatta
  knapp.addEventListener("click", () => {
    const oppen = nav.classList.toggle("open");
    knapp.setAttribute("aria-expanded", oppen);
    document.body.classList.toggle("menu-open", oppen);
  });

  // Rullgardinsmenyer ("Om oss", "Inspark")
  document.querySelectorAll(".dropdown > button").forEach((b) => {
    b.addEventListener("click", (e) => {
      e.stopPropagation();
      const oppen = b.parentElement.classList.toggle("open");
      b.setAttribute("aria-expanded", oppen);
    });
  });

  // Klick utanför stänger rullgardinsmenyerna
  document.addEventListener("click", () => {
    document.querySelectorAll(".dropdown.open").forEach((d) => d.classList.remove("open"));
  });
}

/* ---------- 4. Inglidning vid scroll ---------- */
function startaAnimationer() {
  const delar = document.querySelectorAll(".section .wrap > *, .tile, .feature, .img-card");
  const observer = new IntersectionObserver(
    (poster) => {
      poster.forEach((p) => {
        if (p.isIntersecting) {
          p.target.classList.add("visible");
          observer.unobserve(p.target);
        }
      });
    },
    { threshold: 0.1 },
  );
  delar.forEach((el) => {
    el.classList.add("reveal");
    observer.observe(el);
  });
}

/* ---------- Kör allt ---------- */
startaAnimationer();
laddaDelar().then(() => {
  markeraAktivSida();
  startaMenyer();
});
