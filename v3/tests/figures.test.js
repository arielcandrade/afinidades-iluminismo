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

test("personalidades.html está atualizado em relação aos dados", function () {
  var current = fs.readFileSync(build.output, "utf8");
  assert(current === build.render(), "rode node scripts/build-personalidades.js");
});

console.log(passed + " testes de personalidades passaram.");
