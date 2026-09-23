(function (root, factory) {
  "use strict";

  var api = factory();

  if (typeof module === "object" && module.exports) {
    module.exports = api;
    if (require.main === module) {
      var instrument = require("../js/data/items.js");
      var profiles = require("../js/data/profiles.js");
      var scoring = require("../js/scoring.js");
      api.run(instrument, profiles, scoring, console);
    }
  } else {
    root.ScoringTests = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  var SCENARIO_COUNT = 28;
  var TENSION_COUNT = 8;
  var MIN_PRINCIPAL_COVERAGE = 10;
  var MIN_PAIR_COOCCURRENCE = 4;
  var MAX_REACTION_WORDS = 18;
  var MAX_LENGTH_SPREAD = 5;

  // Pares historicamente confundíveis que precisam aparecer juntos em cenários.
  var CONFUSABLE_PAIRS = [
    ["iberian", "despotism"],
    ["moderate", "aufklarung"],
    ["philosophes", "radical"],
    ["american", "radical"],
    ["italian", "despotism"],
    ["scottish", "physiocracy"],
    ["italian", "physiocracy"],
    ["iberian", "moderate"]
  ];

  // Ordem de proximidade conceitual usada para simular um respondente coerente:
  // do perfil mais parecido ao mais distante (o próprio perfil vem primeiro).
  var KINSHIP = {
    philosophes: ["philosophes", "radical", "italian", "aufklarung", "american", "despotism", "scottish", "physiocracy", "iberian", "moderate"],
    scottish: ["scottish", "physiocracy", "american", "italian", "moderate", "aufklarung", "philosophes", "iberian", "despotism", "radical"],
    aufklarung: ["aufklarung", "moderate", "italian", "philosophes", "american", "scottish", "iberian", "despotism", "radical", "physiocracy"],
    italian: ["italian", "philosophes", "aufklarung", "american", "iberian", "scottish", "despotism", "physiocracy", "moderate", "radical"],
    american: ["american", "scottish", "italian", "philosophes", "aufklarung", "radical", "moderate", "physiocracy", "iberian", "despotism"],
    iberian: ["iberian", "despotism", "moderate", "italian", "aufklarung", "scottish", "physiocracy", "philosophes", "american", "radical"],
    radical: ["radical", "philosophes", "american", "aufklarung", "italian", "scottish", "physiocracy", "moderate", "iberian", "despotism"],
    moderate: ["moderate", "aufklarung", "scottish", "iberian", "italian", "american", "philosophes", "physiocracy", "despotism", "radical"],
    despotism: ["despotism", "iberian", "italian", "physiocracy", "aufklarung", "philosophes", "scottish", "moderate", "american", "radical"],
    physiocracy: ["physiocracy", "scottish", "despotism", "italian", "american", "iberian", "philosophes", "aufklarung", "moderate", "radical"]
  };

  var VALUATIVE_WORDS = /\b(justo|justa|injusto|injusta|eficiente|ineficiente|perigoso|perigosa|melhor|pior|bom|boa|ruim|certo|certa|errado|errada|correto|correta|ideal|sábio|sábia|inteligente|burro|burra|ótimo|ótima|péssimo|péssima|razoável|absurdo|absurda)\b/i;
  var FORBIDDEN_TERMS = /\b(kant|voltaire|rousseau|diderot|smith|hume|beccaria|locke|montesquieu|quesnay|frederico|josé ii|catarina|pombal|frança|franc[eê]s|escócia|escoc[eê]s|alemanha|alem[ãa]o|prússia|itália|italiano|espanha|espanhol|portugal|portugu[eê]s|inglaterra|estados unidos|américa|iluminismo|iluminista|fisiocra\w*|despotismo|esclarecid[oa]|philosophe\w*|enciclop\w*|constitucional\w*|soberania|liberal\w*|conservador\w*|socialis\w*)\b/i;

  function assert(condition, message) {
    if (!condition) {
      throw new Error(message);
    }
  }

  function principalProfile(reaction) {
    return Object.keys(reaction.weights).find(function (profileId) {
      return reaction.weights[profileId] === 2;
    });
  }

  function wordCount(text) {
    return text.trim().split(/\s+/).length;
  }

  function completeAnswers(instrument) {
    var answers = { scenarios: {}, tensions: {} };

    instrument.scenarios.forEach(function (item, index) {
      var reactions = item.reactions;
      answers.scenarios[item.id] = {
        closest: reactions[index % reactions.length].id,
        farthest: reactions[(index + 2) % reactions.length].id
      };
    });
    instrument.tensions.forEach(function (item) {
      answers.tensions[item.id] = 0;
    });

    return answers;
  }

  // Respondente que maximiza um perfil: marca a reação do perfil como mais próxima
  // e qualquer outra como mais distante; nas tensões, vai ao extremo do perfil.
  function maximizingAnswers(instrument, profileId) {
    var answers = { scenarios: {}, tensions: {} };

    instrument.scenarios.forEach(function (item) {
      var sorted = item.reactions
        .map(function (reaction, index) {
          return { id: reaction.id, value: reaction.weights[profileId] || 0, index: index };
        })
        .sort(function (a, b) {
          return b.value - a.value || a.index - b.index;
        });
      answers.scenarios[item.id] = {
        closest: sorted[0].id,
        farthest: sorted[sorted.length - 1].id
      };
    });

    instrument.tensions.forEach(function (item) {
      if (item.left.profileId === profileId) {
        answers.tensions[item.id] = -2;
      } else if (item.right.profileId === profileId) {
        answers.tensions[item.id] = 2;
      } else {
        answers.tensions[item.id] = 0;
      }
    });

    return answers;
  }

  // Respondente coerente com um perfil: escolhe pela ordem de parentesco conceitual,
  // inclusive nos cenários em que o próprio perfil não aparece.
  function coherentAnswers(instrument, profileId) {
    var order = KINSHIP[profileId];
    var answers = { scenarios: {}, tensions: {} };

    function rankOf(reaction) {
      var principal = principalProfile(reaction);
      var rank = order.indexOf(principal);
      return rank === -1 ? order.length : rank;
    }

    instrument.scenarios.forEach(function (item) {
      var sorted = item.reactions.slice().sort(function (a, b) {
        return rankOf(a) - rankOf(b);
      });
      answers.scenarios[item.id] = {
        closest: sorted[0].id,
        farthest: sorted[sorted.length - 1].id
      };
    });

    instrument.tensions.forEach(function (item) {
      var leftRank = order.indexOf(item.left.profileId);
      var rightRank = order.indexOf(item.right.profileId);
      if (item.left.profileId === profileId) {
        answers.tensions[item.id] = -2;
      } else if (item.right.profileId === profileId) {
        answers.tensions[item.id] = 2;
      } else if (leftRank === rightRank) {
        answers.tensions[item.id] = 0;
      } else {
        answers.tensions[item.id] = leftRank < rightRank ? -1 : 1;
      }
    });

    return answers;
  }

  function run(instrument, profiles, scoring, logger) {
    var passed = 0;
    var failed = 0;
    var output = logger || { log: function () {}, error: function () {} };

    function test(name, callback) {
      try {
        callback();
        passed += 1;
        output.log("✓ " + name);
      } catch (error) {
        failed += 1;
        output.error("✗ " + name + ": " + error.message);
      }
    }

    test("o instrumento contém 28 cenários com 4 reações e 8 tensões", function () {
      assert(instrument.scenarios.length === SCENARIO_COUNT, "quantidade de cenários incorreta");
      assert(instrument.tensions.length === TENSION_COUNT, "quantidade de tensões incorreta");
      instrument.scenarios.forEach(function (item) {
        assert(item.reactions.length === 4, item.id + " não tem 4 reações");
      });
    });

    test("IDs de itens, reações e perfis são únicos", function () {
      var itemIds = instrument.scenarios.concat(instrument.tensions).map(function (item) {
        return item.id;
      });
      assert(new Set(itemIds).size === itemIds.length, "há IDs de item duplicados");
      assert(new Set(instrument.profileIds).size === instrument.profileIds.length, "há IDs de perfil duplicados");
      instrument.scenarios.forEach(function (item) {
        var reactionIds = item.reactions.map(function (reaction) {
          return reaction.id;
        });
        assert(new Set(reactionIds).size === 4, item.id + " tem reações com IDs repetidos");
      });
      profiles.forEach(function (profile) {
        assert(instrument.profileIds.indexOf(profile.id) !== -1, "perfil " + profile.id + " ausente do instrumento");
      });
    });

    test("pesos dos blocos somam 1 e os cenários têm 80%", function () {
      var total = Object.values(instrument.blockWeights).reduce(function (sum, value) {
        return sum + value;
      }, 0);
      assert(Math.abs(total - 1) < 1e-10, "pesos não somam 1");
      assert(Math.abs(instrument.blockWeights.scenarios - 0.8) < 1e-10, "cenários não pesam 80%");
    });

    test("cada reação tem um perfil principal (+2) e, no máximo, um secundário (+1)", function () {
      instrument.scenarios.forEach(function (item) {
        var principals = [];
        item.reactions.forEach(function (reaction) {
          var keys = Object.keys(reaction.weights);
          var mains = keys.filter(function (profileId) {
            return reaction.weights[profileId] === 2;
          });
          var secondaries = keys.filter(function (profileId) {
            return reaction.weights[profileId] === 1;
          });
          assert(mains.length === 1, item.id + reaction.id + " não tem exatamente um perfil principal");
          assert(secondaries.length <= 1, item.id + reaction.id + " tem mais de um perfil secundário");
          assert(keys.length === mains.length + secondaries.length, item.id + reaction.id + " tem peso fora de {1, 2}");
          keys.forEach(function (profileId) {
            assert(instrument.profileIds.indexOf(profileId) !== -1, item.id + reaction.id + " usa perfil desconhecido " + profileId);
          });
          principals.push(mains[0]);
        });
        assert(new Set(principals).size === 4, item.id + " não cobre 4 perfis principais distintos");
      });
    });

    test("cada perfil é principal em pelo menos 10 cenários e aparece em uma tensão", function () {
      var coverage = scoring.coverage(instrument);
      instrument.profileIds.forEach(function (profileId) {
        assert(
          coverage[profileId].principal >= MIN_PRINCIPAL_COVERAGE,
          profileId + " é principal em apenas " + coverage[profileId].principal + " cenários"
        );
        assert(coverage[profileId].tensions >= 1, profileId + " não aparece em nenhuma tensão");
      });
    });

    test("cada par confundível aparece junto em pelo menos 4 cenários e tem uma tensão", function () {
      var matrix = scoring.pairMatrix(instrument);
      CONFUSABLE_PAIRS.forEach(function (pair) {
        assert(
          matrix[pair[0]][pair[1]] >= MIN_PAIR_COOCCURRENCE,
          pair.join("×") + " aparece junto em apenas " + matrix[pair[0]][pair[1]] + " cenários"
        );
        var hasTension = instrument.tensions.some(function (item) {
          var ids = [item.left.profileId, item.right.profileId];
          return ids.indexOf(pair[0]) !== -1 && ids.indexOf(pair[1]) !== -1;
        });
        assert(hasTension, pair.join("×") + " não tem tensão dedicada");
      });
    });

    test("redação: reações curtas, equilibradas, sem adjetivos valorativos nem termos proibidos", function () {
      instrument.scenarios.forEach(function (item) {
        var lengths = item.reactions.map(function (reaction) {
          return wordCount(reaction.text);
        });
        var spread = Math.max.apply(null, lengths) - Math.min.apply(null, lengths);
        assert(spread <= MAX_LENGTH_SPREAD, item.id + " tem dispersão de " + spread + " palavras");
        item.reactions.forEach(function (reaction, index) {
          assert(lengths[index] <= MAX_REACTION_WORDS, item.id + reaction.id + " tem " + lengths[index] + " palavras");
          assert(!VALUATIVE_WORDS.test(reaction.text), item.id + reaction.id + " usa adjetivo valorativo");
          assert(!FORBIDDEN_TERMS.test(reaction.text), item.id + reaction.id + " usa nome, país ou termo técnico");
        });
        assert(!FORBIDDEN_TERMS.test(item.situation), item.id + " usa nome, país ou termo técnico na situação");
      });
      instrument.tensions.forEach(function (item) {
        assert(!FORBIDDEN_TERMS.test(item.left.text + " " + item.right.text), item.id + " usa termo proibido");
      });
    });

    test("limites teóricos são finitos, simétricos e não vazios", function () {
      var bounds = scoring.getBounds(instrument);
      Object.keys(bounds).forEach(function (blockId) {
        instrument.profileIds.forEach(function (profileId) {
          var minimum = bounds[blockId].min[profileId];
          var maximum = bounds[blockId].max[profileId];
          assert(Number.isFinite(minimum) && Number.isFinite(maximum), "limite não finito");
          assert(maximum > minimum, "intervalo vazio em " + blockId + "/" + profileId);
          assert(Math.abs(maximum + minimum) < 1e-10, "intervalo assimétrico");
        });
      });
    });

    test("respostas completas são reconhecidas e incompletas são rejeitadas", function () {
      var complete = scoring.validateCompleteness(instrument, completeAnswers(instrument));
      assert(complete.complete && complete.missing.length === 0, "respostas completas foram rejeitadas");

      var empty = scoring.validateCompleteness(instrument, {});
      assert(!empty.complete, "resposta vazia foi aceita");
      assert(empty.missing.length === SCENARIO_COUNT + TENSION_COUNT, "contagem de ausentes incorreta");

      var same = completeAnswers(instrument);
      var firstId = instrument.scenarios[0].id;
      same.scenarios[firstId] = { closest: "a", farthest: "a" };
      var sameResult = scoring.validateCompleteness(instrument, same);
      assert(!sameResult.complete && sameResult.missing[0] === firstId, "mesma reação para próxima e distante foi aceita");
    });

    test("melhor soma e pior subtrai os pesos da reação escolhida", function () {
      var item = instrument.scenarios[0];
      var answers = { scenarios: {}, tensions: {} };
      answers.scenarios[item.id] = { closest: item.reactions[0].id, farthest: item.reactions[1].id };
      var totals = scoring.scoreScenarios(instrument, answers.scenarios);
      var closestProfile = principalProfile(item.reactions[0]);
      var farthestProfile = principalProfile(item.reactions[1]);
      assert(totals[closestProfile] === 2, "mais próxima não somou +2");
      assert(totals[farthestProfile] === -2, "mais distante não subtraiu 2");
    });

    test("tensão negativa favorece a primeira posição e positiva, a segunda", function () {
      var item = instrument.tensions[0];
      var answers = {};
      answers[item.id] = -2;
      var totals = scoring.scoreTensions(instrument, answers);
      assert(totals[item.left.profileId] === 2, "primeira posição não recebeu +2");
      assert(totals[item.right.profileId] === -2, "segunda posição não recebeu −2");
      answers[item.id] = 1;
      totals = scoring.scoreTensions(instrument, answers);
      assert(totals[item.right.profileId] === 1 && totals[item.left.profileId] === -1, "escala intermediária incorreta");
    });

    test("índices são finitos e limitados a 0–100", function () {
      var result = scoring.score(instrument, completeAnswers(instrument), profiles);
      result.ranking.forEach(function (entry) {
        assert(Number.isFinite(entry.score), "índice não finito");
        assert(entry.score >= 0 && entry.score <= 100, "índice fora dos limites");
      });
    });

    test("o cálculo é determinístico", function () {
      var answers = completeAnswers(instrument);
      var first = scoring.score(instrument, answers, profiles);
      var second = scoring.score(instrument, answers, profiles);
      assert(JSON.stringify(first) === JSON.stringify(second), "resultados divergentes");
    });

    test("cada perfil pode alcançar o próprio máximo teórico", function () {
      instrument.profileIds.forEach(function (profileId) {
        var result = scoring.score(instrument, maximizingAnswers(instrument, profileId), profiles);
        assert(Math.abs(result.scores[profileId] - 100) < 1e-8, profileId + " não alcançou 100");
      });
    });

    test("um respondente coerente com cada perfil o coloca em primeiro com margem ≥ 10", function () {
      instrument.profileIds.forEach(function (profileId) {
        var result = scoring.score(instrument, coherentAnswers(instrument, profileId), profiles);
        assert(result.ranking[0].id === profileId, profileId + " não ficou em primeiro (" + result.ranking[0].id + ")");
        var margin = result.ranking[0].score - result.ranking[1].score;
        assert(margin >= 10, profileId + " venceu por apenas " + margin.toFixed(1) + " pontos");
      });
    });

    test("a análise de estabilidade produz uma variante por bloco", function () {
      var result = scoring.score(instrument, completeAnswers(instrument), profiles);
      var blockIds = Object.keys(instrument.blockWeights);
      assert(Object.keys(result.stability.variants).length === blockIds.length, "variantes ausentes");
      Object.values(result.stability.variants).forEach(function (topIds) {
        assert(topIds.length === 3, "top 3 de variante inválido");
      });
    });

    test("empate técnico na fronteira entre terceiro e quarto é sinalizado", function () {
      var pairs = scoring.findClosePairs(
        [
          { id: "a", score: 90, canonicalScore: 90 },
          { id: "b", score: 80, canonicalScore: 80 },
          { id: "c", score: 70, canonicalScore: 70 },
          { id: "d", score: 68, canonicalScore: 68 }
        ],
        4
      );
      assert(
        pairs.some(function (pair) {
          return pair[0] === "c" && pair[1] === "d";
        }),
        "fronteira 3º/4º não foi examinada"
      );
    });

    test("empate exato é separado de afinidade apenas próxima", function () {
      var ranking = [
        { id: "a", score: 90, canonicalScore: 90 },
        { id: "b", score: 90, canonicalScore: 90 },
        { id: "c", score: 87, canonicalScore: 87 },
        { id: "d", score: 80, canonicalScore: 80 }
      ];
      var ties = scoring.findTieGroups(ranking);
      var close = scoring.findClosePairs(ranking, 4);
      assert(ties.length === 1 && ties[0].join(",") === "a,b", "empate não declarado");
      assert(
        !close.some(function (pair) {
          return pair[0] === "a" && pair[1] === "b";
        }),
        "empate foi tratado como mera proximidade"
      );
    });

    test("perfis têm síntese curta, fragmento combinável e descrição de até 100 palavras", function () {
      profiles.forEach(function (profile) {
        var synthesisWords = wordCount(profile.synthesis || "");
        assert(synthesisWords >= 8 && synthesisWords <= 16, profile.id + " tem síntese com " + synthesisWords + " palavras");
        assert(typeof profile.essence === "string" && profile.essence.length > 0, profile.id + " sem fragmento de síntese");
        var descriptionWords = wordCount(profile.description);
        assert(descriptionWords >= 60 && descriptionWords <= 100, profile.id + " tem descrição com " + descriptionWords + " palavras");
      });
    });

    var summary = { passed: passed, failed: failed };
    output.log(passed + " testes passaram; " + failed + " falharam.");

    if (failed > 0 && typeof process !== "undefined") {
      process.exitCode = 1;
    }

    return summary;
  }

  return {
    CONFUSABLE_PAIRS: CONFUSABLE_PAIRS,
    KINSHIP: KINSHIP,
    principalProfile: principalProfile,
    completeAnswers: completeAnswers,
    maximizingAnswers: maximizingAnswers,
    coherentAnswers: coherentAnswers,
    run: run
  };
});
