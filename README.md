# Gefleteknologerna – webbplats

Ren HTML, CSS och JavaScript – inga byggsteg behövs.

## Publicera på GitHub Pages
1. Skapa ett nytt repository på GitHub.
2. Klicka **Add file → Upload files** och dra in alla filer och mapparna `bilder` och `styrelsebilder`.
3. Gå till **Settings → Pages**, välj branch `main` och mappen `/ (root)`, spara.
4. Sidan dyker upp på `https://<användarnamn>.github.io/<repo>/` efter en minut.

## Redigera
- Text: öppna valfri `.html`-fil och ändra texten.
- Bilder: lägg nya bilder i `bilder/` och byt filnamnet i HTML-koden.
- Meny (sidhuvud): `delar/sidhuvud.html` – ändras på alla sidor samtidigt.
- Sidfot: `delar/sidfot.html` – ändras på alla sidor samtidigt.
- Färger, typsnitt och gradientvinklar: överst i `style.css`.
- Obs: sidhuvud och sidfot laddas av `script.js`, så de syns bara när sidan körs via en webbserver (t.ex. GitHub Pages), inte om du dubbelklickar på en fil lokalt.

## Sidor i en undermapp (t.ex. skoj/)
Sidor kan ligga i en egen mapp, t.ex. `skoj/index.html`. Länken "Skoj" i sidfoten pekar dit.
Gör så här när du lägger till en ny sida i en undermapp:

1. Skapa mappen och filen, t.ex. `minasidor/index.html`.
2. Skriv `../` framför allt som pekar på rotmappen: `../style.css`, `../script.js`, `../bilder/...`.
3. Skriv `data-include="delar/sidhuvud.html"` och `data-include="delar/sidfot.html"` precis som vanligt
   – `script.js` hittar dem i rotmappen åt dig.
4. Lägg till en länk i `delar/sidfot.html` eller `delar/sidhuvud.html` om sidan ska synas i menyn.

## Styrelsen – lägg till en ny årgång
Styrelsesidan läser mappen `styrelsebilder/` automatiskt. Strukturen är:

```
styrelsebilder/ÅR/Roll/Förnamn.Efternamn.jpg
styrelsebilder/ÅR/ordning.txt
```

1. Skapa en mapp med det nya året, t.ex. `styrelsebilder/2026/`.
2. Lägg varje bild i en mapp som heter som rollen, t.ex. `Ordförande/Anna.Svensson.jpg`.
3. Skapa `ordning.txt` i årsmappen med en rad per person, i den ordning de ska visas:
   ```
   Ordförande/Anna.Svensson.jpg
   Kassör/Erik.Berg.jpg
   ```
   Rader som börjar med `#` är kommentarer.
4. Ladda upp – det nya året dyker upp överst på styrelsesidan av sig självt.

Saknas en bild visas personens initialer i stället.

## Skoj – lägg till ett nytt spel
Skoj-sidan läser filen `skoj/spel.txt` och bygger en ruta per spel automatiskt. Strukturen är:

```
skoj/SPELNAMN/index.html      (själva spelet)
skoj/SPELNAMN/preview.jpg     (förstabild, valfri)
skoj/spel.txt                 (en rad per spel: mappens namn)
```

1. Skapa en mapp med spelets namn, t.ex. `skoj/mitt-spel/`, och lägg spelets `index.html` där.
2. Lägg gärna en förstabild `preview.jpg` i samma mapp – storlek **1200×675 px** (16:9) passar rutorna. Saknas bilden visas spelets namn i rutan i stället.
3. Öppna `skoj/spel.txt` och skriv mappens namn på en ny rad, t.ex. `mitt-spel`.
4. Ladda upp – spelet dyker upp på skoj-sidan av sig självt.

Mappnamnet blir spelets visningsnamn: `mitt-spel` visas som "Mitt spel". Rader som börjar med `#` i spel.txt är kommentarer. Mappen `exempelspel/` är ett färdigt exempel som går att ta bort.
