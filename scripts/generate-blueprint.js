"use strict";

var instrument = require("../js/data/items.js");
var scoring = require("../js/scoring.js");
var tests = require("../tests/scoring.test.js");

var names = {
  philosophes: "Philosophes",
  scottish: "Escocês",
  aufklarung: "Aufklärung",
  italian: "Italiano",
  american: "Americano",
  iberian: "Ibérico",
  radical: "Radical",
  moderate: "Moderado",
  despotism: "Despotismo",
  physiocracy: "Fisiocracia"
};

function escapeCell(value) {
  return String(value || "")
    .replace(/\|/g, "\\|")
    .replace(/\n/g, " ");
}

function formatWeights(weights) {
  return Object.keys(weights || {})
    .sort(function (a, b) {
      return weights[b] - weights[a] || a.localeCompare(b);
    })
    .map(function (profileId) {
      return names[profileId] + " +" + weights[profileId];
    })
    .join("; ");
}

function print(line) {
  process.stdout.write((line || "") + "\n");
}

var coverage = scoring.coverage(instrument);
var bounds = scoring.getBounds(instrument);
var matrix = scoring.pairMatrix(instrument);

print("# Matriz de conteúdo");
print();
print("Versão do instrumento: `" + instrument.version + "`. Gerado por `node scripts/generate-blueprint.js`.");
print();
print("Esta matriz documenta as chaves históricas usadas pelo algoritmo. Ela não deve ser entregue aos respondentes antes da conclusão, pois tornaria transparentes as associações que o questionário procura medir de forma indireta.");
print();
print("Cada cenário tem quatro reações, cada uma ligada a um perfil principal (+2) e, em alguns casos, a um perfil secundário (+1). A reação marcada como **mais próxima** soma seus pesos; a marcada como **mais distante** subtrai os pesos dela. As tensões valem de −2 a +2 na direção da segunda posição. O algoritmo normaliza cada perfil pelos próprios limites teóricos e combina 80% cenários e 20% tensões.");
print();
print("## Cobertura por perfil");
print();
print("| Perfil | Cenários (principal) | Cenários (qualquer peso) | Tensões | Máx. bruto cenários | Máx. bruto tensões |");
print("|---|---:|---:|---:|---:|---:|");
instrument.profileIds.forEach(function (profileId) {
  print(
    "| " + names[profileId] +
      " | " + coverage[profileId].principal +
      " | " + coverage[profileId].scenarios +
      " | " + coverage[profileId].tensions +
      " | " + bounds.scenarios.max[profileId] +
      " | " + bounds.tensions.max[profileId] +
      " |"
  );
});

print();
print("## Coocorrência par a par");
print();
print("Número de cenários em que os dois perfis aparecem como reações principais. Pares confundíveis (em negrito) precisam de pelo menos 4.");
print();
var confusable = tests.CONFUSABLE_PAIRS.map(function (pair) {
  return pair.slice().sort().join("|");
});
print("| | " + instrument.profileIds.map(function (id) { return names[id]; }).join(" | ") + " |");
print("|---|" + instrument.profileIds.map(function () { return "---:"; }).join("|") + "|");
instrument.profileIds.forEach(function (rowId) {
  var cells = instrument.profileIds.map(function (columnId) {
    if (rowId === columnId) {
      return "·";
    }
    var value = matrix[rowId][columnId];
    var key = [rowId, columnId].sort().join("|");
    return confusable.indexOf(key) !== -1 ? "**" + value + "**" : String(value);
  });
  print("| " + names[rowId] + " | " + cells.join(" | ") + " |");
});

print();
print("## Cenários");
print();
instrument.scenarios.forEach(function (item) {
  print("### " + item.id + " — " + item.theme);
  print();
  print(item.situation);
  print();
  print("| Reação | Texto | Chave |");
  print("|---|---|---|");
  item.reactions.forEach(function (reaction) {
    print("| " + reaction.id + " | " + escapeCell(reaction.text) + " | " + escapeCell(formatWeights(reaction.weights)) + " |");
  });
  print();
});

print("## Tensões");
print();
print("A resposta vai de −2 (muito mais a primeira) a +2 (muito mais a segunda). O valor é somado ao perfil da segunda posição e subtraído do perfil da primeira.");
print();
print("| ID | Primeira posição | Perfil | Segunda posição | Perfil |");
print("|---|---|---|---|---|");
instrument.tensions.forEach(function (item) {
  print(
    "| " + item.id +
      " | " + escapeCell(item.left.text) +
      " | " + names[item.left.profileId] +
      " | " + escapeCell(item.right.text) +
      " | " + names[item.right.profileId] +
      " |"
  );
});

print();
print("## Regras editoriais");
print();
print("- Situações contemporâneas (prefeitura, escola, tribunal, empresa, cooperativa), sem nomes de autores, países ou escolas.");
print("- Quatro reações por cenário, de comprimento semelhante (±5 palavras, máximo 18), sem adjetivos valorativos e sem uma alternativa obviamente \"correta\".");
print("- Cada perfil é principal em pelo menos 10 cenários; cada par confundível coocorre em pelo menos 4 e tem uma tensão dedicada.");
print("- Alterar uma chave somente com justificativa registrada em `docs/validacao.md` e nova rodada de `node scripts/simulate.js`.");
print("- Revisar itens que mais de 20% dos participantes do piloto interpretarem de modo diferente do previsto.");
