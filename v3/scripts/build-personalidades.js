"use strict";

// Gera personalidades.html a partir de js/data/profiles.js e js/data/figures.js.
// Uso: node scripts/build-personalidades.js

var fs = require("fs");
var path = require("path");

var profiles = require("../js/data/profiles.js");
var figures = require("../js/data/figures.js");

var OUTPUT = path.join(__dirname, "..", "personalidades.html");

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

function renderCard(figure) {
  var works = figure.works.map(function (work) {
    return "<li>" + escapeHtml(work) + "</li>";
  });
  return [
    '<article class="figure-card" id="' + figure.id + '">',
    '  <img class="figure-portrait" src="img/personalidades/' + figure.image.file + '" alt="Retrato de ' +
      escapeHtml(figure.name) + '" width="320" height="400" loading="lazy">',
    '  <div class="figure-body">',
    '    <h3 class="figure-name">' + escapeHtml(figure.name) + "</h3>",
    '    <p class="figure-meta">' + escapeHtml(figure.dates) + " · " + escapeHtml(figure.origin) + "</p>",
    '    <p class="figure-role">' + escapeHtml(figure.role) + "</p>",
    '    <p class="figure-summary">' + escapeHtml(figure.summary) + "</p>",
    '    <ul class="figure-works">'
  ]
    .concat(indent(works, 6).split("\n"))
    .concat([
      "    </ul>",
      '    <a class="figure-link" href="' + escapeHtml(figure.wikipedia) + '">Ler na Wikipédia<span class="sr-only"> sobre ' + escapeHtml(figure.name) + "</span></a>",
      "  </div>",
      "</article>"
    ]);
}

function renderGroup(profile) {
  var cards = [];
  figuresOf(profile.id).forEach(function (figure) {
    cards = cards.concat(renderCard(figure));
  });
  return [
    '<section class="figure-group" id="' + profile.id + '" aria-labelledby="' + profile.id + '-title">',
    '  <p class="profile-period">' + escapeHtml(profile.period) + "</p>",
    '  <h2 class="section-title" id="' + profile.id + '-title">' + escapeHtml(profile.name) + "</h2>",
    '  <p class="figure-group-lead">' + escapeHtml(profile.synthesis) + "</p>",
    '  <div class="figure-grid">'
  ]
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
    "  <p>Os resumos foram escritos para esta página a partir dos verbetes da Wikipédia em português, com apoio dos verbetes em inglês. Cada cartão leva ao verbete consultado. O conteúdo da Wikipédia é distribuído sob a licença " +
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

  return [
    "<!doctype html>",
    "<!-- Gerado por scripts/build-personalidades.js. Edite js/data/figures.js e rode o script de novo. -->",
    '<html lang="pt-BR">',
    "  <head>",
    '    <meta charset="utf-8">',
    '    <meta name="viewport" content="width=device-width, initial-scale=1">',
    '    <meta name="color-scheme" content="light dark">',
    '    <meta name="description" content="Seis personalidades de cada uma das cinco correntes do Iluminismo usadas no questionário Afinidades com o Iluminismo.">',
    "    <title>Personalidades · Afinidades com o Iluminismo</title>",
    '    <link rel="stylesheet" href="css/styles.css">',
    "  </head>",
    '  <body data-screen="figures">',
    '    <a class="skip-link" href="#app">Ir para o conteúdo</a>',
    "",
    '    <header class="masthead">',
    '      <a class="brand" href="./">',
    '        <span class="brand-title">Afinidades com o Iluminismo</span>',
    '        <span class="brand-sub">personalidades · voltar ao questionário</span>',
    "      </a>",
    "    </header>",
    "",
    '    <main id="app" class="page page-wide" tabindex="-1">',
    indent(body, 6),
    "    </main>",
    "",
    '    <footer class="colophon">',
    '      <p><a href="./">Voltar ao questionário</a></p>',
    "    </footer>",
    "  </body>",
    "</html>",
    ""
  ].join("\n");
}

if (require.main === module) {
  fs.writeFileSync(OUTPUT, render());
  console.log("personalidades.html gerado com " + figures.length + " personalidades.");
}

module.exports = { render: render, output: OUTPUT };
