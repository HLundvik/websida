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
- Färger och typsnitt: överst i `style.css`.

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
