"use strict";

// Gera personalidades.html a partir de js/data/profiles.js e js/data/figures.js,
// e uma página personalidades/<id>.html para cada texto em content/personalidades/<id>.md.
// Uso: node scripts/build-personalidades.js

var fs = require("fs");
var path = require("path");

var profiles = require("../js/data/profiles.js");
var figures = require("../js/data/figures.js");
var groups = require("../js/data/groups.js");

var ROOT = path.join(__dirname, "..");
var OUTPUT = path.join(ROOT, "personalidades.html");
var CONTENT_DIR = path.join(ROOT, "content", "personalidades");
var ARTICLE_DIR = path.join(ROOT, "personalidades");
var GROUP_CONTENT_DIR = path.join(ROOT, "content", "grupos");
var GROUP_DIR = path.join(ROOT, "grupos");

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function figuresOf(profileId) {
  return figures.filter(function (figure) {
    return figure.profile === profileId;
  });
}

function profileOf(figure) {
  return profiles.filter(function (profile) {
    return profile.id === figure.profile;
  })[0];
}

function articleSource(figure) {
  var file = path.join(CONTENT_DIR, figure.id + ".md");
  return fs.existsSync(file) ? fs.readFileSync(file, "utf8") : null;
}

function articleOutput(figure) {
  return path.join(ARTICLE_DIR, figure.id + ".html");
}

function groupSource(profile) {
  var file = path.join(GROUP_CONTENT_DIR, profile.id + ".md");
  return fs.existsSync(file) ? fs.readFileSync(file, "utf8") : null;
}

function groupOutput(profile) {
  return path.join(GROUP_DIR, profile.id + ".html");
}

function renderInline(text) {
  return escapeHtml(text)
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2">$1</a>')
    .replace(/\*([^*]+)\*/g, "<em>$1</em>");
}

function slug(text) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// Subconjunto de Markdown: "## Título", parágrafos separados por linha em branco,
// listas com "- ", *itálico* e [link](endereço).
function renderMarkdown(source) {
  var lines = [];
  source
    .trim()
    .split(/\n\s*\n/)
    .forEach(function (block) {
      block = block.trim();
      if (block.indexOf("## ") === 0) {
        var title = block.slice(3).trim();
        lines.push('<h2 id="' + slug(title) + '">' + renderInline(title) + "</h2>");
      } else if (block.indexOf("- ") === 0) {
        lines.push("<ul>");
        block.split(/\n(?=- )/).forEach(function (item) {
          lines.push("  <li>" + renderInline(item.slice(2).replace(/\s*\n\s*/g, " ").trim()) + "</li>");
        });
        lines.push("</ul>");
      } else {
        lines.push("<p>" + renderInline(block.replace(/\s*\n\s*/g, " ")) + "</p>");
      }
    });
  return lines;
}

function indent(lines, spaces) {
  var pad = new Array(spaces + 1).join(" ");
  return lines
    .map(function (line) {
      return line ? pad + line : line;
    })
    .join("\n");
}

function renderNav() {
  var items = profiles.map(function (profile) {
    return '<li><a href="#' + profile.id + '">' + escapeHtml(profile.shortName || profile.name) + "</a></li>";
  });
  return ['<nav class="figure-nav" aria-label="Grupos">', "  <ul>"]
    .concat(indent(items, 4).split("\n"))
    .concat(["  </ul>", "</nav>"]);
}

function renderCardText(figure) {
  var srName = '<span class="sr-only"> sobre ' + escapeHtml(figure.name) + "</span>";
  if (articleSource(figure)) {
    return [
      '    <p class="figure-summary">' + escapeHtml(figure.teaser) + "</p>",
      '    <a class="figure-read" href="personalidades/' + figure.id + '.html">Ler o texto' + srName + "</a>"
    ];
  }
  var works = figure.works.map(function (work) {
    return "<li>" + escapeHtml(work) + "</li>";
  });
  return ['    <p class="figure-summary">' + escapeHtml(figure.summary) + "</p>", '    <ul class="figure-works">']
    .concat(indent(works, 6).split("\n"))
    .concat(["    </ul>", '    <a class="figure-link" href="' + escapeHtml(figure.wikipedia) + '">Ler na Wikipédia' + srName + "</a>"]);
}

function renderCard(figure) {
  return [
    '<article class="figure-card" id="' + figure.id + '">',
    '  <img class="figure-portrait" src="img/personalidades/' + figure.image.file + '" alt="Retrato de ' +
      escapeHtml(figure.name) + '" width="320" height="400" loading="lazy">',
    '  <div class="figure-body">',
    '    <h3 class="figure-name">' + escapeHtml(figure.name) + "</h3>",
    '    <p class="figure-meta">' + escapeHtml(figure.dates) + " · " + escapeHtml(figure.origin) + "</p>",
    '    <p class="figure-role">' + escapeHtml(figure.role) + "</p>"
  ]
    .concat(renderCardText(figure))
    .concat(["  </div>", "</article>"]);
}

function renderGroup(profile) {
  var cards = [];
  figuresOf(profile.id).forEach(function (figure) {
    cards = cards.concat(renderCard(figure));
  });
  var more = groupSource(profile)
    ? [
        '  <p class="figure-group-more"><a class="figure-read" href="grupos/' + profile.id + '.html">Ler sobre o grupo' +
          '<span class="sr-only"> ' + escapeHtml(profile.name) + "</span></a></p>"
      ]
    : [];
  return [
    '<section class="figure-group" id="' + profile.id + '" aria-labelledby="' + profile.id + '-title">',
    '  <p class="profile-period">' + escapeHtml(profile.period) + "</p>",
    '  <h2 class="section-title" id="' + profile.id + '-title">' + escapeHtml(profile.name) + "</h2>",
    '  <p class="figure-group-lead">' + escapeHtml(profile.synthesis) + "</p>"
  ]
    .concat(more)
    .concat(['  <div class="figure-grid">'])
    .concat(indent(cards, 4).split("\n"))
    .concat(["  </div>", '  <p class="figure-top"><a href="#topo">Voltar ao topo</a></p>', "</section>"]);
}

function renderCredits() {
  var items = profiles.reduce(function (lines, profile) {
    return lines.concat(
      figuresOf(profile.id).map(function (figure) {
        return (
          "<li>" + escapeHtml(figure.name) + ": " + escapeHtml(figure.image.author) + " · " +
          escapeHtml(figure.image.license) + ' · <a href="' + escapeHtml(figure.image.source) +
          '">Wikimedia Commons</a></li>'
        );
      })
    );
  }, []);
  return [
    '<section class="figure-credits" aria-labelledby="creditos-title">',
    '  <h2 class="section-title" id="creditos-title">Fontes e créditos</h2>',
    "  <p>Os textos foram escritos para este site a partir dos verbetes da Wikipédia, sobretudo em inglês e em português. Cada cartão leva a um texto completo, que lista os verbetes consultados. O conteúdo da Wikipédia é distribuído sob a licença " +
      '<a href="https://creativecommons.org/licenses/by-sa/4.0/deed.pt-br">CC BY-SA 4.0</a>.</p>',
    "  <p>Os retratos vêm do Wikimedia Commons, todos em domínio público ou sob CC0. Foram reduzidos para esta página e, quando indicado, recortados para mostrar o rosto.</p>",
    '  <ul class="figure-credit-list">'
  ]
    .concat(indent(items, 4).split("\n"))
    .concat(["  </ul>", "</section>"]);
}

function render() {
  var body = []
    .concat([
      '<section class="screen figure-intro">',
      '  <p class="eyebrow">Afinidades com o Iluminismo</p>',
      '  <h1 class="display" id="topo" tabindex="-1">Personalidades do Iluminismo</h1>',
      '  <p class="lead">Seis figuras de cada uma das cinco correntes do questionário: quem foram, o que defenderam e por que pertencem ao grupo.</p>'
    ])
    .concat(indent(renderNav(), 2).split("\n"))
    .concat(["</section>"]);
  profiles.forEach(function (profile) {
    body = body.concat(renderGroup(profile));
  });
  body = body.concat(renderCredits());

  return renderShell({
    base: "",
    title: "Personalidades · Afinidades com o Iluminismo",
    description: "Seis personalidades de cada uma das cinco correntes do Iluminismo usadas no questionário Afinidades com o Iluminismo.",
    screen: "figures",
    mainClass: "page page-wide",
    body: body
  });
}

function renderShell(options) {
  var base = options.base;
  return [
    "<!doctype html>",
    "<!-- Gerado por scripts/build-personalidades.js. Edite js/data/figures.js ou content/personalidades/ e rode o script de novo. -->",
    '<html lang="pt-BR">',
    "  <head>",
    '    <meta charset="utf-8">',
    '    <meta name="viewport" content="width=device-width, initial-scale=1">',
    '    <meta name="color-scheme" content="light dark">',
    '    <meta name="description" content="' + escapeHtml(options.description) + '">',
    "    <title>" + escapeHtml(options.title) + "</title>",
    '    <link rel="stylesheet" href="' + base + 'css/styles.css">',
    "  </head>",
    '  <body data-screen="' + options.screen + '">',
    '    <a class="skip-link" href="#app">Ir para o conteúdo</a>',
    "",
    '    <header class="masthead">',
    '      <a class="brand" href="' + (base || "./") + '">',
    '        <span class="brand-title">Afinidades com o Iluminismo</span>',
    '        <span class="brand-sub">personalidades · voltar ao questionário</span>',
    "      </a>",
    "    </header>",
    "",
    '    <main id="app" class="' + options.mainClass + '" tabindex="-1">',
    indent(options.body, 6),
    "    </main>",
    "",
    '    <footer class="colophon">',
    '      <p><a href="' + (base || "./") + '">Voltar ao questionário</a></p>',
    "    </footer>",
    "  </body>",
    "</html>",
    ""
  ].join("\n");
}

function renderArticleSources(figure) {
  var sources = figure.sources.map(function (source) {
    return (
      '<li>“<a href="' + escapeHtml(source.url) + '">' + escapeHtml(source.title) + "</a>”, Wikipédia em " +
      escapeHtml(source.language) + "</li>"
    );
  });
  return [
    '<section class="figure-sources" aria-labelledby="fontes-title">',
    '  <h2 class="section-title" id="fontes-title">Fontes</h2>',
    "  <p>Texto escrito para este site, com palavras próprias, a partir destes verbetes, distribuídos sob a licença " +
      '<a href="https://creativecommons.org/licenses/by-sa/4.0/deed.pt-br">CC BY-SA 4.0</a>:</p>',
    "  <ul>"
  ]
    .concat(indent(sources, 4).split("\n"))
    .concat([
      "  </ul>",
      "  <p>Retrato: " + escapeHtml(figure.image.author) + " · " + escapeHtml(figure.image.license) + ' · <a href="' +
        escapeHtml(figure.image.source) + '">Wikimedia Commons</a>.</p>',
      "</section>"
    ]);
}

function renderArticle(figure) {
  var profile = profileOf(figure);
  var body = [
    '<p class="figure-back"><a href="../personalidades.html#' + profile.id + '">← Personalidades · ' +
      escapeHtml(profile.name) + "</a></p>",
    '<header class="figure-article-head">',
    '  <img class="figure-portrait" src="../img/personalidades/' + figure.image.file + '" alt="Retrato de ' +
      escapeHtml(figure.name) + '" width="320" height="400">',
    "  <div>",
    '    <p class="eyebrow">' + escapeHtml(profile.name) + "</p>",
    '    <h1 class="display" id="topo">' + escapeHtml(figure.name) + "</h1>",
    '    <p class="figure-meta">' + escapeHtml(figure.dates) + " · " + escapeHtml(figure.origin) + "</p>",
    '    <p class="figure-role">' + escapeHtml(figure.role) + "</p>",
    "  </div>",
    "</header>",
    '<article class="figure-article" aria-labelledby="topo">'
  ]
    .concat(indent(renderMarkdown(articleSource(figure)), 2).split("\n"))
    .concat(["</article>"])
    .concat(renderArticleSources(figure))
    .concat(['<p class="figure-top"><a href="../personalidades.html#' + figure.id + '">Voltar às personalidades</a></p>']);

  return renderShell({
    base: "../",
    title: figure.name + " · Personalidades · Afinidades com o Iluminismo",
    description: figure.teaser,
    screen: "figure",
    mainClass: "page figure-article-page",
    body: body
  });
}

function renderGroupSources(profile) {
  var sources = groups[profile.id].sources.map(function (source) {
    return (
      '<li>“<a href="' + escapeHtml(source.url) + '">' + escapeHtml(source.title) + "</a>”, Wikipédia em " +
      escapeHtml(source.language) + "</li>"
    );
  });
  return [
    '<section class="figure-sources" aria-labelledby="fontes-title">',
    '  <h2 class="section-title" id="fontes-title">Fontes</h2>',
    "  <p>Texto escrito para este site, com palavras próprias, a partir destes verbetes, distribuídos sob a licença " +
      '<a href="https://creativecommons.org/licenses/by-sa/4.0/deed.pt-br">CC BY-SA 4.0</a>, e dos textos sobre as personalidades do grupo:</p>',
    "  <ul>"
  ]
    .concat(indent(sources, 4).split("\n"))
    .concat(["  </ul>", "</section>"]);
}

function renderGroupPage(profile) {
  var body = [
    '<p class="figure-back"><a href="../personalidades.html#' + profile.id + '">← Personalidades do Iluminismo</a></p>',
    '<header class="group-head">',
    '  <p class="eyebrow">Correntes do Iluminismo</p>',
    '  <h1 class="display" id="topo">' + escapeHtml(profile.name) + "</h1>",
    '  <p class="figure-meta">' + escapeHtml(profile.period) + "</p>",
    '  <p class="lead">' + escapeHtml(profile.synthesis) + "</p>",
    "</header>",
    '<article class="figure-article" aria-labelledby="topo">'
  ]
    .concat(indent(renderMarkdown(groupSource(profile)), 2).split("\n"))
    .concat(["</article>"])
    .concat(renderGroupSources(profile))
    .concat(['<p class="figure-top"><a href="../personalidades.html#' + profile.id + '">Voltar às personalidades</a></p>']);

  return renderShell({
    base: "../",
    title: profile.name + " · Afinidades com o Iluminismo",
    description: profile.name + ": quem foram, o contexto, as ideias centrais e o legado. " + profile.synthesis,
    screen: "figure",
    mainClass: "page figure-article-page",
    body: body
  });
}

function pages() {
  var list = [{ file: OUTPUT, html: render() }];
  figures.forEach(function (figure) {
    if (articleSource(figure)) {
      list.push({ file: articleOutput(figure), html: renderArticle(figure) });
    }
  });
  profiles.forEach(function (profile) {
    if (groupSource(profile)) {
      list.push({ file: groupOutput(profile), html: renderGroupPage(profile) });
    }
  });
  return list;
}

if (require.main === module) {
  [ARTICLE_DIR, GROUP_DIR].forEach(function (dir) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
  });
  var written = pages();
  written.forEach(function (page) {
    fs.writeFileSync(page.file, page.html);
  });
  var articles = figures.filter(articleSource).length;
  console.log(
    "personalidades.html gerado com " + figures.length + " personalidades, " + articles + " texto(s) completo(s) e " +
      (written.length - 1 - articles) + " página(s) de grupo."
  );
}

module.exports = {
  render: render,
  output: OUTPUT,
  pages: pages,
  articleSource: articleSource,
  groupSource: groupSource,
  renderMarkdown: renderMarkdown
};
