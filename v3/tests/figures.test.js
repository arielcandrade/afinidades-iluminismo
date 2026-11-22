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

var groups = require("../js/data/groups.js");
var GROUP_DIR = path.join(__dirname, "..", "content", "grupos");
var GROUP_SECTIONS = [
  "Quem são",
  "Contexto",
  "Ideias centrais",
  "Como agiam",
  "Divergências e relação com os outros grupos",
  "As seis personalidades",
  "Limites e críticas",
  "Legado"
];

function withGroupText() {
  return profiles.filter(function (profile) {
    return build.groupSource(profile);
  });
}

test("todo texto em content/grupos corresponde a um perfil com fontes", function () {
  var ids = profiles.map(function (profile) {
    return profile.id;
  });
  fs.readdirSync(GROUP_DIR).forEach(function (file) {
    var id = file.replace(/\.md$/, "");
    assert(/\.md$/.test(file) && ids.indexOf(id) !== -1, "arquivo inesperado: " + file);
    var sources = groups[id] && groups[id].sources;
    assert(Array.isArray(sources) && sources.length >= 1, id + " sem fontes em groups.js");
    sources.forEach(function (source) {
      assert(/^https:\/\/[a-z]{2}\.wikipedia\.org\/wiki\//.test(source.url), id + ": fonte inesperada " + source.url);
      assert(source.title && source.language, id + ": fonte sem título ou idioma");
    });
  });
});

test("textos de grupo têm as oito seções, na ordem, e cabem em cinco páginas", function () {
  withGroupText().forEach(function (profile) {
    var source = build.groupSource(profile);
    var headings = source.match(/^## .+$/gm).map(function (line) {
      return line.slice(3);
    });
    assert(headings.join("|") === GROUP_SECTIONS.join("|"), profile.id + " tem seções " + headings.join(", "));
    var count = words(source.replace(/^## .+$/gm, "").replace(/\]\([^)]*\)/g, "]"));
    assert(count >= 2600 && count <= 3200, profile.id + " tem " + count + " palavras");
  });
});

test("textos de grupo citam as seis personalidades com links válidos", function () {
  withGroupText().forEach(function (profile) {
    var source = build.groupSource(profile);
    figures
      .filter(function (figure) {
        return figure.profile === profile.id;
      })
      .forEach(function (figure) {
        assert(source.indexOf("](../personalidades/" + figure.id + ".html)") !== -1, profile.id + " sem link para " + figure.id);
      });
    (source.match(/\]\(([^)]+)\)/g) || []).forEach(function (link) {
      var target = link.slice(2, -1);
      assert(fs.existsSync(path.join(__dirname, "..", "grupos", target)), profile.id + ": link quebrado " + target);
    });
  });
});

test("guia dos eixos tem uma seção por eixo, na ordem, com os dois polos", function () {
  var axes = require("../js/data/axes.js");
  var source = build.guideSource();
  var headings = source.match(/^## .+$/gm).map(function (line) {
    return line.slice(3);
  });
  var axisHeadings = headings.filter(function (heading) {
    return axes.some(function (axis) {
      return axis.name === heading;
    });
  });
  assert(axisHeadings.join("|") === axes.map(function (axis) { return axis.name; }).join("|"), "seções de eixo: " + axisHeadings.join(", "));
  axes.forEach(function (axis) {
    var section = source.split("## " + axis.name + "\n")[1].split(/^## /m)[0];
    [axis.negative.label, axis.positive.label].forEach(function (label) {
      assert(section.indexOf("*Perto de “" + label + "”.*") !== -1, axis.id + " sem o polo " + label);
    });
  });
  assert(source.indexOf('"') === -1, "o guia tem aspas retas");
});

test("grupos do mapa têm posições inteiras nos nove eixos e uma justificativa por eixo", function () {
  var axes = require("../js/data/axes.js");
  var mapGroups = require("../js/data/map-groups.js");
  var profileIds = profiles.map(function (profile) {
    return profile.id;
  });
  var seen = {};
  assert(mapGroups.length === 5, "o mapa deveria ter cinco grupos fora do questionário");
  mapGroups.forEach(function (group) {
    assert(/^[a-z]+$/.test(group.id) && !seen[group.id], "id inválido ou repetido: " + group.id);
    assert(profileIds.indexOf(group.id) === -1, group.id + " colide com um perfil");
    seen[group.id] = true;
    ["name", "shortName", "period", "figures"].forEach(function (field) {
      assert(typeof group[field] === "string" && group[field].trim(), group.id + " sem " + field);
    });
    assert(Object.keys(group.vector).length === axes.length, group.id + " com eixos a mais ou a menos");
    axes.forEach(function (axis) {
      var value = group.vector[axis.id];
      assert(Number.isInteger(value) && value >= -2 && value <= 2, group.id + "." + axis.id + " fora de −2..2");
      var text = group.justification[axis.id];
      assert(typeof text === "string" && words(text) >= 8, group.id + " sem justificativa para " + axis.id);
      assert(text.indexOf('"') === -1, group.id + "." + axis.id + " com aspas retas");
    });
  });
});

test("figuras do mapa cobrem os dez grupos", function () {
  var map = require("../scripts/map-figures.js");
  var list = map.groups();
  assert(list.length === 10, "deveria haver dez grupos, há " + list.length);
  var analysis = map.principalComponents(list);
  var total = analysis.components[0].share + analysis.components[1].share;
  assert(analysis.components[0].share >= analysis.components[1].share && total > 0 && total <= 1, "partes da variância inválidas");
  var order = map.leafOrder(map.clusterTree(list)).slice().sort(function (a, b) {
    return a - b;
  });
  assert(order.join(",") === "0,1,2,3,4,5,6,7,8,9", "a árvore não tem as dez folhas");
  assert(Math.round(map.affinity(list[0].values, list[0].values)) === 100, "afinidade de um grupo consigo mesmo deveria ser 100");
  var html = build.pages().filter(function (page) {
    return path.basename(page.file) === "mapa.html";
  })[0].html;
  ["figura-mapa", "figura-calor", "figura-plano", "figura-arvore", "figura-semelhanca"].forEach(function (id) {
    assert(html.indexOf('id="' + id + '"') !== -1, "mapa.html sem " + id);
  });
  assert(html.indexOf("{{") === -1, "mapa.html com marcador não substituído");
  assert(build.mapSource().indexOf('"') === -1, "o texto do mapa tem aspas retas");
});

test("páginas geradas estão atualizadas em relação aos dados", function () {
  build.pages().forEach(function (page) {
    assert(fs.existsSync(page.file), path.basename(page.file) + " não existe");
    assert(fs.readFileSync(page.file, "utf8") === page.html, path.basename(page.file) + ": rode node scripts/build-personalidades.js");
  });
});

console.log(passed + " testes de personalidades passaram.");
