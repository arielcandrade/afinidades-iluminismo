"use strict";

var fs = require("fs");
var path = require("path");

var profiles = require("../js/data/profiles.js");
var figures = require("../js/data/figures.js");
var build = require("../scripts/build-personalidades.js");

var passed = 0;

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function test(name, callback) {
  try {
    callback();
    passed += 1;
    console.log("✓ " + name);
  } catch (error) {
    console.error("✗ " + name + ": " + error.message);
    process.exitCode = 1;
  }
}

function words(text) {
  return text.trim().split(/\s+/).length;
}

test("cada perfil tem exatamente seis personalidades", function () {
  profiles.forEach(function (profile) {
    var count = figures.filter(function (figure) {
      return figure.profile === profile.id;
    }).length;
    assert(count === 6, profile.id + " tem " + count);
  });
  assert(figures.length === profiles.length * 6, "há personalidades fora dos perfis");
});

test("ids são únicos e perfis existem", function () {
  var profileIds = profiles.map(function (profile) {
    return profile.id;
  });
  var seen = {};
  figures.forEach(function (figure) {
    assert(/^[a-z]+$/.test(figure.id), "id inválido: " + figure.id);
    assert(!seen[figure.id], "id repetido: " + figure.id);
    assert(profileIds.indexOf(figure.id) === -1, "id colide com âncora de perfil: " + figure.id);
    assert(profileIds.indexOf(figure.profile) !== -1, figure.id + " aponta para perfil inexistente");
    seen[figure.id] = true;
  });
});

test("campos de texto estão preenchidos e no tamanho esperado", function () {
  figures.forEach(function (figure) {
    ["name", "dates", "origin", "role", "summary"].forEach(function (field) {
      assert(typeof figure[field] === "string" && figure[field].trim(), figure.id + " sem " + field);
    });
    assert(/^\d{4}–\d{4}$/.test(figure.dates), figure.id + " com datas fora do formato");
    var count = words(figure.summary);
    assert(count >= 30 && count <= 90, figure.id + " tem resumo com " + count + " palavras");
    assert(Array.isArray(figure.works) && figure.works.length >= 2 && figure.works.length <= 3, figure.id + " deve ter 2 a 3 obras");
  });
});

test("links da Wikipédia apontam para verbetes em português", function () {
  figures.forEach(function (figure) {
    assert(figure.wikipedia.indexOf("https://pt.wikipedia.org/wiki/") === 0, figure.id + ": " + figure.wikipedia);
  });
});

test("toda imagem existe e tem autor, licença e fonte", function () {
  figures.forEach(function (figure) {
    var image = figure.image;
    assert(image && image.file === figure.id + ".jpg", figure.id + " com arquivo de imagem inesperado");
    assert(fs.existsSync(path.join(__dirname, "..", "img", "personalidades", image.file)), image.file + " não existe");
    assert(image.author && image.author.trim(), figure.id + " sem autor da imagem");
    assert(["Domínio público", "CC0"].indexOf(image.license) !== -1, figure.id + " com licença não prevista: " + image.license);
    assert(image.source.indexOf("https://commons.wikimedia.org/wiki/File:") === 0, figure.id + " sem fonte no Commons");
  });
});

var CONTENT_DIR = path.join(__dirname, "..", "content", "personalidades");
var SECTIONS = ["Vida", "Ideias centrais", "Obras principais", "Por que pertence", "Legado"];

function withArticle() {
  return figures.filter(function (figure) {
    return build.articleSource(figure);
  });
}

test("todo texto em content/personalidades corresponde a uma personalidade", function () {
  var ids = figures.map(function (figure) {
    return figure.id;
  });
  fs.readdirSync(CONTENT_DIR).forEach(function (file) {
    assert(/\.md$/.test(file), "arquivo inesperado: " + file);
    assert(ids.indexOf(file.replace(/\.md$/, "")) !== -1, file + " não corresponde a nenhum id");
  });
  assert(withArticle().length > 0, "nenhum texto encontrado");
});

test("textos têm as cinco seções, na ordem, e cabem em duas páginas", function () {
  withArticle().forEach(function (figure) {
    var source = build.articleSource(figure);
    var headings = source.match(/^## .+$/gm).map(function (line) {
      return line.slice(3);
    });
    assert(headings.length === SECTIONS.length, figure.id + " tem " + headings.length + " seções");
    SECTIONS.forEach(function (section, index) {
      assert(headings[index].indexOf(section) === 0, figure.id + ": seção " + (index + 1) + " deveria ser " + section);
    });
    var count = words(source.replace(/^## .+$/gm, "").replace(/^- /gm, ""));
    assert(count >= 800 && count <= 1100, figure.id + " tem " + count + " palavras");
  });
});

test("textos têm chamada para o cartão e fontes da Wikipédia", function () {
  withArticle().forEach(function (figure) {
    assert(typeof figure.teaser === "string", figure.id + " sem chamada");
    var count = words(figure.teaser);
    assert(count >= 10 && count <= 35, figure.id + " tem chamada com " + count + " palavras");
    assert(Array.isArray(figure.sources) && figure.sources.length >= 1, figure.id + " sem fontes");
    figure.sources.forEach(function (source) {
      assert(/^https:\/\/[a-z]{2}\.wikipedia\.org\/wiki\//.test(source.url), figure.id + ": fonte inesperada " + source.url);
      assert(source.title && source.language, figure.id + ": fonte sem título ou idioma");
    });
  });
});

test("o Markdown dos textos vira seções, listas e itálico", function () {
  var html = build.renderMarkdown("## Obras principais\n\nUm *livro*\nem duas linhas.\n\n- *A* (1670): x\n- B").join("\n");
  assert(html.indexOf('<h2 id="obras-principais">Obras principais</h2>') !== -1, "título mal convertido");
  assert(html.indexOf("<p>Um <em>livro</em> em duas linhas.</p>") !== -1, "parágrafo mal convertido");
  assert(html.indexOf("<li><em>A</em> (1670): x</li>") !== -1 && html.indexOf("<li>B</li>") !== -1, "lista mal convertida");
});

test("páginas geradas estão atualizadas em relação aos dados", function () {
  build.pages().forEach(function (page) {
    assert(fs.existsSync(page.file), path.basename(page.file) + " não existe");
    assert(fs.readFileSync(page.file, "utf8") === page.html, path.basename(page.file) + ": rode node scripts/build-personalidades.js");
  });
});

console.log(passed + " testes de personalidades passaram.");
