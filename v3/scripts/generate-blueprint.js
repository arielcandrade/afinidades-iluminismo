"use strict";

// Gera docs/matriz-de-conteudo.md a partir dos dados do instrumento.
// Uso: node scripts/generate-blueprint.js > docs/matriz-de-conteudo.md

var instrument = require("../js/data/items.js");
var profiles = require("../js/data/profiles.js");
var axes = require("../js/data/axes.js");
var scoring = require("../js/scoring.js");

var profileNames = profiles.reduce(function (result, profile) {
  result[profile.id] = profile.shortName || profile.name;
  return result;
}, {});
var axisNames = axes.reduce(function (result, axis) {
  result[axis.id] = axis;
  return result;
}, {});

function escapeCell(value) {
  return String(value || "").replace(/\|/g, "\\|").replace(/\n/g, " ");
}

function signed(value) {
  return value > 0 ? "+" + value : String(value);
}

function formatCharges(reaction, itemAxes) {
  return itemAxes
    .map(function (axisId) {
      return axisNames[axisId].name.split(" ")[0] + " " + signed(reaction.charges[axisId] || 0);
    })
    .join("; ");
}

function print(line) {
  process.stdout.write((line || "") + "\n");
}

function printReactionTable(reactions, itemAxes) {
  print("| Reação | Perfil | Texto | Cargas |");
  print("|---|---|---|---|");
  reactions.forEach(function (reaction) {
    print(
      "| " + reaction.id +
        " | " + profileNames[reaction.profileId] +
        " | " + escapeCell(reaction.text) +
        " | " + escapeCell(formatCharges(reaction, itemAxes)) +
        " |"
    );
  });
}

var coverage = scoring.coverage(instrument);
var bounds = scoring.getBounds(instrument);
var discrimination = scoring.pairDiscrimination(instrument, 2);

print("# Matriz de conteúdo");
print();
print("Versão do instrumento: `" + instrument.version + "`. Gerado por `node scripts/generate-blueprint.js`.");
print();
print("Esta matriz documenta as cargas usadas pelo algoritmo. Não deve ser entregue aos respondentes antes da conclusão: tornaria transparentes as associações que o questionário procura medir de forma indireta.");
print();
print("Cada conjunto de reações toca dois ou três eixos. Cada reação carrega valores de −2 a +2 nesses eixos (positivo = segundo polo do eixo). A reação **mais próxima** soma as cargas; a **mais distante** subtrai. As tensões pontuam direto no eixo, de −2 a +2, multiplicadas por " + instrument.tensionWeight + ". A posição do respondente em cada eixo é normalizada pelo máximo teórico e comparada por cosseno com o vetor de cada perfil.");
print();

print("## Eixos e vetores dos perfis");
print();
print("| Eixo | Polo − | Polo + | " + instrument.profileIds.map(function (id) { return profileNames[id]; }).join(" | ") + " |");
print("|---|---|---|" + instrument.profileIds.map(function () { return "---:"; }).join("|") + "|");
instrument.axisIds.forEach(function (axisId) {
  var axis = axisNames[axisId];
  print(
    "| " + axis.name + " | " + axis.negative.label + " | " + axis.positive.label + " | " +
      instrument.profileIds.map(function (profileId) {
        var profile = profiles.find(function (p) { return p.id === profileId; });
        return signed(profile.vector[axisId] || 0);
      }).join(" | ") + " |"
  );
});

print();
print("## Cobertura por eixo");
print();
print("| Eixo | Cenários fixos | Dois tempos | Tensões | Máximo bruto |");
print("|---|---:|---:|---:|---:|");
instrument.axisIds.forEach(function (axisId) {
  print(
    "| " + axisNames[axisId].name +
      " | " + coverage[axisId].scenarios +
      " | " + coverage[axisId].twoStage +
      " | " + coverage[axisId].tensions +
      " | " + bounds[axisId] +
      " |"
  );
});

print();
print("## Separação par a par");
print();
print("Número de conjuntos de reações (fixos e dois tempos, contando cada tempo) em que as reações dos dois perfis diferem em pelo menos 2 pontos em algum eixo. Mínimo exigido: 8.");
print();
print("| | " + instrument.profileIds.map(function (id) { return profileNames[id]; }).join(" | ") + " |");
print("|---|" + instrument.profileIds.map(function () { return "---:"; }).join("|") + "|");
instrument.profileIds.forEach(function (rowId) {
  var cells = instrument.profileIds.map(function (columnId) {
    return rowId === columnId ? "·" : String(discrimination[rowId][columnId]);
  });
  print("| " + profileNames[rowId] + " | " + cells.join(" | ") + " |");
});

print();
print("## Cenários fixos");
print();
instrument.scenarios.forEach(function (item) {
  print("### " + item.id + " — " + item.theme);
  print();
  print("Eixos: " + item.axes.map(function (axisId) { return axisNames[axisId].name; }).join(", ") + ".");
  print();
  print(item.situation);
  print();
  printReactionTable(item.reactions, item.axes);
  print();
});

print("## Cenários em dois tempos");
print();
instrument.twoStage.forEach(function (item) {
  print("### " + item.id + " — " + item.theme);
  print();
  print("Eixos: " + item.axes.map(function (axisId) { return axisNames[axisId].name; }).join(", ") + ".");
  print();
  print("**Parte 1.** " + item.situation);
  print();
  printReactionTable(item.reactions, item.axes);
  print();
  print("**Novo fato.** " + item.twist);
  print();
  printReactionTable(item.second.reactions, item.axes);
  print();
});

print("## Tensões");
print();
print("A resposta vai de −2 (muito mais a primeira frase) a +2 (muito mais a segunda). A primeira frase corresponde ao polo negativo do eixo; a segunda, ao polo positivo.");
print();
print("| ID | Eixo | Primeira frase | Segunda frase |");
print("|---|---|---|---|");
instrument.tensions.forEach(function (item) {
  print(
    "| " + item.id +
      " | " + axisNames[item.axisId].name +
      " | " + escapeCell(item.left.text) +
      " | " + escapeCell(item.right.text) +
      " |"
  );
});

print();
print("## Regras editoriais");
print();
print("- Situações contemporâneas (prefeitura, escola, tribunal, empresa, cooperativa, condomínio), sem nomes de autores, países ou escolas.");
print("- Cinco reações por conjunto, uma por perfil, com até 20 palavras e dispersão de comprimento de até 6 palavras; sem adjetivos valorativos e sem alternativa obviamente \"correta\". Cada reação nomeia um custo ou renúncia.");
print("- A reação de cada perfil deve ser, por cosseno, a que mais aponta para o próprio vetor dentro do conjunto (verificado por `tests/scoring.test.js`).");
print("- Cada eixo aparece em pelo menos 8 cenários fixos e tem exatamente uma tensão; cada par de perfis é separado em pelo menos 8 conjuntos.");
print("- Alterar uma carga somente com justificativa registrada em `docs/validacao.md` e nova rodada de `node tests/scoring.test.js` e `node scripts/simulate.js`.");
