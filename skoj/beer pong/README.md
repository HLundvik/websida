# Beer Pong

## Lägg spelet på din webbsida

Ladda upp hela mappen **beer pong** utan att ändra innehållets struktur.
Öppna sedan `beer%20pong/index.html` på din webbsida. Det fungerar även på GitHub Pages.
Ingen inloggning, databas, installation eller byggning behövs för att spela.

De filer som måste följa med är:
- `index.html`
- `game.js`
- `game.css`
- hela `assets/`-mappen

Du kan också visa spelet inne i en befintlig sida:

```html
<iframe src="./beer%20pong/index.html" title="Beer Pong"
  style="width:100%;height:1000px;border:0"></iframe>
```

## Ändra koden

Den läsbara spelkoden finns i `source/` och stilarna i `styles.css`.
För att skapa nya `game.js` och `game.css` efter egna ändringar behövs Bun:

```sh
bun install
bun run build
```

Alla bilder och typsnitt ligger lokalt i `assets/`. Spelet behöver ingen extern tjänst.

## Förstabild

Lägg en valfri bild med namnet `preview.jpg` direkt i spelets mapp, alltså bredvid `index.html`.
Rekommenderad storlek är **1200 × 675 px** (16:9).