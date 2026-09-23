(function (root, factory) {
  "use strict";

  var api = factory();

  if (typeof module === "object" && module.exports) {
    module.exports = api;
    if (require.main === module) {
      var instrument = require("../js/data/items.js");
      var profiles = require("../js/data/profiles.js");
      var axes = require("../js/data/axes.js");
      var scoring = require("../js/scoring.js");
      api.run(instrument, profiles, axes, scoring, console);
    }
  } else {
    root.ScoringTests = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  var SCENARIO_COUNT = 24;
  var TWO_STAGE_COUNT = 4;
  var TENSION_COUNT = 9;
  var REACTIONS_PER_SET = 5;
  var MIN_AXIS_COVERAGE = 8;
  var MIN_PAIR_DISCRIMINATION = 8;
  var MAX_REACTION_WORDS = 20;
  var MAX_LENGTH_SPREAD = 6;
  var MAX_SITUATION_WORDS = 45;
  var MIN_COHERENT_MARGIN = 15;
  var MIN_COHERENT_SCORE = 90;

  var VALUATIVE_WORDS = /\b(justo|justa|injusto|injusta|eficiente|ineficiente|perigoso|perigosa|melhor|pior|bom|boa|ruim|certo|certa|errado|errada|correto|correta|ideal|sábio|sábia|inteligente|burro|burra|ótimo|ótima|péssimo|péssima|razoável|absurdo|absurda)\b/i;
  var FORBIDDEN_TERMS = /\b(kant|voltaire|rousseau|diderot|smith|hume|beccaria|locke|montesquieu|quesnay|frederico|josé ii|catarina|pombal|frança|franc[eê]s|escócia|escoc[eê]s|alemanha|alem[ãa]o|prússia|itália|italiano|espanha|espanhol|portugal|portugu[eê]s|inglaterra|estados unidos|américa|iluminismo|iluminista|fisiocra\w*|despotismo|esclarecid[oa]|philosophe\w*|enciclop\w*|constitucional\w*|soberania|liberal\w*|conservador\w*|socialis\w*)\b/i;

  function assert(condition, message) {
    if (!condition) {
      throw new Error(message);
    }
  }

  function wordCount(text) {
    return text.trim().split(/\s+/).length;
  }

  function dot(axisIds, a, b) {
    return axisIds.reduce(function (sum, axisId) {
      return sum + (a[axisId] || 0) * (b[axisId] || 0);
    }, 0);
  }

  function cosine(axisIds, a, b) {
    var denominator = Math.sqrt(dot(axisIds, a, a) * dot(axisIds, b, b));
    return denominator < 1e-9 ? 0 : dot(axisIds, a, b) / denominator;
  }

  function vectorOf(profiles, profileId) {
    return profiles.find(function (profile) { return profile.id === profileId; }).vector;
  }

  // Respostas completas e mecânicas, para testes de forma.
  function completeAnswers(instrument) {
    var answers = { scenarios: {}, twoStage: {}, tensions: {} };
    instrument.scenarios.forEach(function (item, index) {
      var list = item.reactions;
      answers.scenarios[item.id] = {
        closest: list[index % list.length].id,
        farthest: list[(index + 2) % list.length].id
      };
    });
    instrument.twoStage.forEach(function (item, index) {
      var list = item.reactions;
      answers.twoStage[item.id] = {
        first: { closest: list[index % list.length].id, farthest: list[(index + 2) % list.length].id },
        second: { closest: list[(index + 1) % list.length].id, farthest: list[(index + 3) % list.length].id }
      };
    });
    instrument.tensions.forEach(function (item) {
      answers.tensions[item.id] = 0;
    });
    return answers;
  }

  // Respondente coerente com um perfil: em cada conjunto, marca como mais próxima a
  // reação que mais aponta na direção do seu vetor e como mais distante a que menos
  // aponta; nas tensões, vai ao extremo do seu vetor no eixo (ou ao centro, se neutro).
  function coherentAnswers(instrument, profiles, profileId) {
    var vector = vectorOf(profiles, profileId);
    var axisIds = instrument.axisIds;
    var answers = { scenarios: {}, twoStage: {}, tensions: {} };

    function pick(list) {
      var sorted = list
        .map(function (reaction, index) {
          return { id: reaction.id, value: cosine(axisIds, reaction.charges, vector), index: index };
        })
        .sort(function (a, b) {
          return b.value - a.value || a.index - b.index;
        });
      return { closest: sorted[0].id, farthest: sorted[sorted.length - 1].id };
    }

    instrument.scenarios.forEach(function (item) {
      answers.scenarios[item.id] = pick(item.reactions);
    });
    instrument.twoStage.forEach(function (item) {
      answers.twoStage[item.id] = { first: pick(item.reactions), second: pick(item.second.reactions) };
    });
    instrument.tensions.forEach(function (item) {
      var value = vector[item.axisId] || 0;
      answers.tensions[item.id] = value > 0 ? 2 : value < 0 ? -2 : 0;
    });

    return answers;
  }

  function run(instrument, profiles, axes, scoring, logger) {
    var passed = 0;
    var failed = 0;
    var output = logger || { log: function () {}, error: function () {} };
    var axisIds = instrument.axisIds;

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

    function reactionSets() {
      return scoring.allReactionSets(instrument);
    }

    test("o instrumento contém 24 cenários, 4 em dois tempos e 9 tensões, com 5 reações por conjunto", function () {
      assert(instrument.scenarios.length === SCENARIO_COUNT, "quantidade de cenários incorreta: " + instrument.scenarios.length);
      assert(instrument.twoStage.length === TWO_STAGE_COUNT, "quantidade de cenários em dois tempos incorreta");
      assert(instrument.tensions.length === TENSION_COUNT, "quantidade de tensões incorreta");
      reactionSets().forEach(function (set) {
        assert(set.reactions.length === REACTIONS_PER_SET, set.id + " não tem 5 reações");
      });
    });

    test("eixos do instrumento coincidem com axes.js e perfis com profiles.js", function () {
      var axisList = axes.map(function (axis) { return axis.id; });
      assert(axisList.length === axisIds.length, "número de eixos divergente");
      axisIds.forEach(function (axisId) {
        assert(axisList.indexOf(axisId) !== -1, "eixo " + axisId + " ausente de axes.js");
      });
      assert(profiles.length === instrument.profileIds.length, "número de perfis divergente");
      profiles.forEach(function (profile) {
        assert(instrument.profileIds.indexOf(profile.id) !== -1, "perfil " + profile.id + " ausente do instrumento");
        axisIds.forEach(function (axisId) {
          var value = profile.vector[axisId];
          assert(Number.isInteger(value) && Math.abs(value) <= 2, profile.id + " tem vetor inválido em " + axisId);
        });
      });
    });

    test("IDs de itens e reações são únicos; cada conjunto cobre os cinco perfis", function () {
      var itemIds = instrument.scenarios.concat(instrument.twoStage, instrument.tensions).map(function (item) {
        return item.id;
      });
      assert(new Set(itemIds).size === itemIds.length, "há IDs de item duplicados");
      reactionSets().forEach(function (set) {
        var ids = set.reactions.map(function (reaction) { return reaction.id; });
        var profileIds = set.reactions.map(function (reaction) { return reaction.profileId; });
        assert(new Set(ids).size === REACTIONS_PER_SET, set.id + " tem reações com IDs repetidos");
        assert(new Set(profileIds).size === REACTIONS_PER_SET, set.id + " não cobre cinco perfis distintos");
        profileIds.forEach(function (profileId) {
          assert(instrument.profileIds.indexOf(profileId) !== -1, set.id + " usa perfil desconhecido " + profileId);
        });
      });
      instrument.twoStage.forEach(function (item) {
        item.reactions.forEach(function (reaction, index) {
          var second = item.second.reactions[index];
          assert(second.id === reaction.id && second.profileId === reaction.profileId, item.id + " tem segunda fase desalinhada");
        });
        assert(typeof item.twist === "string" && item.twist.length > 0, item.id + " sem fato novo");
      });
    });

    test("cada conjunto toca 2 ou 3 eixos e as cargas ficam nesses eixos, entre −2 e 2, sem reação nula nem repetida", function () {
      reactionSets().forEach(function (set) {
        assert(set.axes.length >= 2 && set.axes.length <= 3, set.id + " toca " + set.axes.length + " eixos");
        set.axes.forEach(function (axisId) {
          assert(axisIds.indexOf(axisId) !== -1, set.id + " usa eixo desconhecido " + axisId);
        });
        var signatures = [];
        set.reactions.forEach(function (reaction) {
          var keys = Object.keys(reaction.charges);
          assert(keys.length === set.axes.length, set.id + reaction.id + " tem cargas fora dos eixos do conjunto");
          var nonZero = 0;
          keys.forEach(function (axisId) {
            var value = reaction.charges[axisId];
            assert(set.axes.indexOf(axisId) !== -1, set.id + reaction.id + " carrega eixo " + axisId + " não tocado");
            assert(Number.isInteger(value) && Math.abs(value) <= 2, set.id + reaction.id + " tem carga inválida em " + axisId);
            if (value !== 0) {
              nonZero += 1;
            }
          });
          assert(nonZero > 0, set.id + reaction.id + " não carrega nenhum eixo");
          signatures.push(set.axes.map(function (axisId) { return reaction.charges[axisId]; }).join(","));
        });
        assert(new Set(signatures).size === REACTIONS_PER_SET, set.id + " tem reações com cargas idênticas");
      });
    });

    test("chave consistente: a reação de cada perfil é a que mais aponta para o próprio perfil", function () {
      var violations = scoring.keyConsistency(instrument, profiles);
      assert(
        violations.length === 0,
        violations.slice(0, 5).map(function (violation) {
          return violation.set + ":" + violation.profileId + " perde para " + violation.competitor +
            " (" + violation.own.toFixed(2) + " vs " + violation.competing.toFixed(2) + ")";
        }).join("; ") + (violations.length > 5 ? " e mais " + (violations.length - 5) : "")
      );
    });

    test("cada eixo é tocado por pelo menos 8 cenários fixos e tem exatamente uma tensão", function () {
      var coverage = scoring.coverage(instrument);
      axisIds.forEach(function (axisId) {
        assert(coverage[axisId].scenarios >= MIN_AXIS_COVERAGE, axisId + " aparece em apenas " + coverage[axisId].scenarios + " cenários");
        assert(coverage[axisId].tensions === 1, axisId + " tem " + coverage[axisId].tensions + " tensões");
      });
    });

    test("cada par de perfis é separado por pelo menos 2 pontos em algum eixo em ≥ 8 conjuntos", function () {
      var matrix = scoring.pairDiscrimination(instrument, 2);
      instrument.profileIds.forEach(function (a, i) {
        instrument.profileIds.forEach(function (b, j) {
          if (j <= i) {
            return;
          }
          assert(matrix[a][b] >= MIN_PAIR_DISCRIMINATION, a + "×" + b + " separados em apenas " + matrix[a][b] + " conjuntos");
        });
      });
    });

    test("redação: reações curtas e equilibradas, situações curtas, sem adjetivos valorativos nem termos proibidos", function () {
      reactionSets().forEach(function (set) {
        var lengths = set.reactions.map(function (reaction) { return wordCount(reaction.text); });
        var spread = Math.max.apply(null, lengths) - Math.min.apply(null, lengths);
        assert(spread <= MAX_LENGTH_SPREAD, set.id + " tem dispersão de " + spread + " palavras (" + lengths.join("/") + ")");
        set.reactions.forEach(function (reaction, index) {
          assert(lengths[index] <= MAX_REACTION_WORDS, set.id + reaction.id + " tem " + lengths[index] + " palavras");
          var valuative = reaction.text.match(VALUATIVE_WORDS);
          assert(!valuative, set.id + reaction.id + " usa adjetivo valorativo: " + (valuative && valuative[0]));
          assert(!FORBIDDEN_TERMS.test(reaction.text), set.id + reaction.id + " usa nome, país ou termo técnico");
        });
      });
      instrument.scenarios.concat(instrument.twoStage).forEach(function (item) {
        var words = wordCount(item.situation);
        assert(words <= MAX_SITUATION_WORDS, item.id + " tem situação com " + words + " palavras");
        assert(!FORBIDDEN_TERMS.test(item.situation), item.id + " usa termo proibido na situação");
        if (item.twist) {
          assert(!FORBIDDEN_TERMS.test(item.twist), item.id + " usa termo proibido no fato novo");
        }
      });
      instrument.tensions.forEach(function (item) {
        assert(!FORBIDDEN_TERMS.test(item.left.text + " " + item.right.text), item.id + " usa termo proibido");
      });
    });

    test("limites teóricos por eixo são finitos e positivos", function () {
      var bounds = scoring.getBounds(instrument);
      axisIds.forEach(function (axisId) {
        assert(Number.isFinite(bounds[axisId]) && bounds[axisId] > 0, "limite inválido em " + axisId);
      });
    });

    test("respostas completas são reconhecidas e incompletas são rejeitadas", function () {
      var complete = scoring.validateCompleteness(instrument, completeAnswers(instrument));
      assert(complete.complete && complete.missing.length === 0, "respostas completas foram rejeitadas");
      var empty = scoring.validateCompleteness(instrument, {});
      assert(!empty.complete, "resposta vazia foi aceita");
      assert(empty.missing.length === SCENARIO_COUNT + TWO_STAGE_COUNT + TENSION_COUNT, "contagem de ausentes incorreta");
      var same = completeAnswers(instrument);
      var firstId = instrument.scenarios[0].id;
      same.scenarios[firstId] = { closest: "a", farthest: "a" };
      var sameResult = scoring.validateCompleteness(instrument, same);
      assert(!sameResult.complete && sameResult.missing[0] === firstId, "mesma reação para próxima e distante foi aceita");
      var halfTwoStage = completeAnswers(instrument);
      var twoStageId = instrument.twoStage[0].id;
      halfTwoStage.twoStage[twoStageId].second = { closest: null, farthest: null };
      assert(!scoring.validateCompleteness(instrument, halfTwoStage).complete, "segunda fase ausente foi aceita");
    });

    test("mais próxima soma as cargas, mais distante subtrai e a tensão pontua direto no eixo", function () {
      var item = instrument.scenarios[0];
      var answers = { scenarios: {}, twoStage: {}, tensions: {} };
      answers.scenarios[item.id] = { closest: item.reactions[0].id, farthest: item.reactions[1].id };
      var units = scoring.itemContributions(instrument, answers);
      assert(units.length === 1, "unidade não contabilizada");
      item.axes.forEach(function (axisId) {
        var expected = item.reactions[0].charges[axisId] - item.reactions[1].charges[axisId];
        assert(units[0].charges[axisId] === expected, "contribuição incorreta em " + axisId);
      });
      var tensionItem = instrument.tensions[0];
      var tensionAnswers = { tensions: {} };
      tensionAnswers.tensions[tensionItem.id] = -2;
      var tensionUnits = scoring.itemContributions(instrument, tensionAnswers);
      assert(tensionUnits[0].charges[tensionItem.axisId] === -2 * instrument.tensionWeight, "tensão não pontuou com peso no eixo");
    });

    test("índices são finitos, limitados a 0–100 e determinísticos", function () {
      var answers = completeAnswers(instrument);
      var first = scoring.score(instrument, answers, profiles);
      var second = scoring.score(instrument, answers, profiles);
      first.ranking.forEach(function (entry) {
        assert(Number.isFinite(entry.score) && entry.score >= 0 && entry.score <= 100, "índice fora dos limites");
      });
      assert(JSON.stringify(first) === JSON.stringify(second), "resultados divergentes");
      axisIds.forEach(function (axisId) {
        assert(first.position[axisId] >= -1 && first.position[axisId] <= 1, "posição fora de [−1, 1] em " + axisId);
      });
    });

    test("respostas vazias produzem 50 para todos os perfis, sem preferência", function () {
      var result = scoring.score(instrument, {}, profiles);
      instrument.profileIds.forEach(function (profileId) {
        assert(Math.abs(result.scores[profileId] - 50) < 1e-9, profileId + " não ficou em 50 sem respostas");
      });
    });

    test("um respondente coerente com cada perfil o coloca em primeiro, acima de 90, com margem ≥ 15", function () {
      instrument.profileIds.forEach(function (profileId) {
        var result = scoring.score(instrument, coherentAnswers(instrument, profiles, profileId), profiles);
        assert(result.ranking[0].id === profileId, profileId + " não ficou em primeiro (" + result.ranking[0].id + ")");
        assert(result.scores[profileId] >= MIN_COHERENT_SCORE, profileId + " alcançou apenas " + result.scores[profileId].toFixed(1));
        var margin = result.ranking[0].score - result.ranking[1].score;
        assert(margin >= MIN_COHERENT_MARGIN, profileId + " venceu por apenas " + margin.toFixed(1) + " pontos");
      });
    });

    test("o intervalo por bootstrap é determinístico, ordenado e contido em 0–100", function () {
      var answers = completeAnswers(instrument);
      var first = scoring.score(instrument, answers, profiles);
      var second = scoring.score(instrument, answers, profiles);
      instrument.profileIds.forEach(function (profileId) {
        var interval = first.intervals[profileId];
        assert(interval.low <= interval.high, "intervalo invertido em " + profileId);
        assert(interval.low >= 0 && interval.high <= 100, "intervalo fora de 0–100 em " + profileId);
        assert(interval.low === second.intervals[profileId].low, "intervalo não determinístico em " + profileId);
      });
      var coherent = scoring.score(instrument, coherentAnswers(instrument, profiles, instrument.profileIds[0]), profiles);
      assert(!coherent.technicalTie, "respondente coerente foi marcado como empate técnico");
    });

    test("leituras do resultado apontam eixos válidos", function () {
      var result = scoring.score(instrument, coherentAnswers(instrument, profiles, "scottish"), profiles);
      assert(result.readings.agreements.length === 2, "duas concordâncias esperadas");
      result.readings.agreements.forEach(function (row) {
        assert(axisIds.indexOf(row.axisId) !== -1, "eixo de concordância inválido");
        assert(row.gap <= result.readings.divergence.gap + 1e-9, "concordância maior que divergência");
      });
      assert(axisIds.indexOf(result.readings.divergence.axisId) !== -1, "eixo de divergência inválido");
      assert(result.heldPositions.total === TWO_STAGE_COUNT, "contagem de dois tempos incorreta");
      assert(result.conviction >= 0 && result.conviction <= 1, "convicção fora de 0–1");
    });

    test("perfis têm síntese curta, fragmento combinável, figuras e descrição de 60–100 palavras", function () {
      profiles.forEach(function (profile) {
        var synthesisWords = wordCount(profile.synthesis || "");
        assert(synthesisWords >= 8 && synthesisWords <= 16, profile.id + " tem síntese com " + synthesisWords + " palavras");
        assert(typeof profile.essence === "string" && profile.essence.length > 0, profile.id + " sem fragmento de síntese");
        assert(typeof profile.figures === "string" && profile.figures.length > 0, profile.id + " sem figuras de referência");
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
    completeAnswers: completeAnswers,
    coherentAnswers: coherentAnswers,
    cosine: cosine,
    run: run
  };
});
