"use strict";

var values = new Map();

global.localStorage = {
  setItem: function (key, value) {
    values.set(key, String(value));
  },
  getItem: function (key) {
    return values.has(key) ? values.get(key) : null;
  },
  removeItem: function (key) {
    values.delete(key);
  }
};

var storage = require("../js/storage.js");
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

test("detecta armazenamento disponível", function () {
  assert(storage.isAvailable(), "mock de localStorage não foi detectado");
});

test("modo em memória não persiste no localStorage", function () {
  storage.clear();
  storage.save({ screen: "identity" }, false);
  assert(global.localStorage.getItem(storage.key) === null, "dados foram persistidos");
  assert(storage.load().screen === "identity", "estado em memória não foi recuperado");
});

test("modo persistente grava e recupera um envelope válido", function () {
  storage.clear();
  var result = storage.save({ screen: "likert", page: 2 }, true);
  assert(result.persisted, "gravação persistente falhou");
  assert(storage.load().page === 2, "estado persistido não foi recuperado");
});

test("JSON corrompido é ignorado e removido", function () {
  global.localStorage.setItem(storage.key, "{inválido");
  assert(storage.load() === null, "valor corrompido foi aceito");
  assert(global.localStorage.getItem(storage.key) === null, "valor corrompido não foi removido");
});

test("envelope expirado é removido na leitura", function () {
  global.localStorage.setItem(
    storage.key,
    JSON.stringify({
      schemaVersion: storage.schemaVersion,
      expiresAt: Date.now() - 1,
      state: { screen: "result" }
    })
  );
  assert(storage.load() === null, "valor expirado foi aceito");
  assert(global.localStorage.getItem(storage.key) === null, "valor expirado não foi removido");
});

console.log(passed + " testes de armazenamento passaram.");

