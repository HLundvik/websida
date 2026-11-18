import { compile } from "@tailwindcss/node";
import { Scanner } from "@tailwindcss/oxide";
import { resolve } from "node:path";

const base = import.meta.dir;
const result = await Bun.build({
  entrypoints: [resolve(base, "source/main.tsx")],
  target: "browser",
  format: "iife",
  minify: true,
  define: { "process.env.NODE_ENV": '"production"' },
});
if (!result.success) throw new Error(result.logs.map(String).join("\n"));
await Bun.write(resolve(base, "game.js"), result.outputs[0]);

const compiler = await compile(await Bun.file(resolve(base, "styles.css")).text(), { base, onDependency: () => {} });
const scanner = new Scanner({ sources: [{ base: resolve(base, "source"), pattern: "**/*.{ts,tsx}", negated: false }] });
await Bun.write(resolve(base, "game.css"), compiler.build(scanner.scan()));
console.log("Ready: index.html, game.js, game.css and assets/");