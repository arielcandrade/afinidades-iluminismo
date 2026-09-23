"use strict";

// Gera um HTML autossuficiente (CSS e JS embutidos) para distribuição offline.
// Uso: node scripts/build-standalone.js [arquivo-de-saida]
// Padrão: afinidades-iluminismo.html na raiz do projeto.

var fs = require("fs");
var path = require("path");

var ROOT = path.join(__dirname, "..");
var indexPath = path.join(ROOT, "index.html");
var outputPath = process.argv[2]
  ? path.resolve(process.cwd(), process.argv[2])
  : path.join(ROOT, "afinidades-iluminismo.html");

function readProjectFile(relativePath) {
  return fs.readFileSync(path.join(ROOT, relativePath), "utf8");
}

// Impede que um `</script>` dentro do JS encerre a tag inline por engano.
function guardScript(source) {
  return source.replace(/<\/script>/gi, "<\\/script>");
}

var html = readProjectFile("index.html");

// 1. Coleta os scripts na ordem em que aparecem e os remove do <head>.
var scriptOrder = [];
html = html.replace(
  /[ \t]*<script[^>]*\bsrc="([^"]+)"[^>]*><\/script>\r?\n?/gi,
  function (match, src) {
    scriptOrder.push(src);
    return "";
  }
);

if (scriptOrder.length === 0) {
  throw new Error("Nenhum <script src> encontrado em index.html.");
}

// 2. Substitui o <link> do CSS por um <style> embutido.
var css = readProjectFile("css/styles.css");
var linkReplaced = false;
html = html.replace(
  /[ \t]*<link[^>]*href="css\/styles\.css"[^>]*>\r?\n?/i,
  function () {
    linkReplaced = true;
    return "    <style>\n" + css + "\n    </style>\n";
  }
);

if (!linkReplaced) {
  throw new Error("Não encontrei o <link> de css/styles.css em index.html.");
}

// 3. Monta os scripts embutidos e insere antes de </body>, para que o DOM já exista
//    quando app.js rodar (equivalente ao comportamento de defer).
var inlineScripts = scriptOrder
  .map(function (src) {
    return (
      "    <script>\n/* " + src + " */\n" + guardScript(readProjectFile(src)) + "\n    </script>"
    );
  })
  .join("\n");

if (!/<\/body>/i.test(html)) {
  throw new Error("index.html não tem </body>.");
}
html = html.replace(/<\/body>/i, inlineScripts + "\n  </body>");

// 4. Nota de origem no topo do arquivo gerado.
html = html.replace(
  /<!doctype html>/i,
  "<!doctype html>\n<!-- Arquivo único gerado por scripts/build-standalone.js. Não edite à mão; edite os fontes e regenere. -->"
);

fs.writeFileSync(outputPath, html);

var sizeKb = (Buffer.byteLength(html, "utf8") / 1024).toFixed(1);
process.stdout.write(
  "Gerado: " + outputPath + " (" + sizeKb + " KB)\n" +
    "Ordem embutida: " + scriptOrder.join(", ") + "\n"
);
