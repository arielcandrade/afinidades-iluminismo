(function (root, factory) {
  "use strict";

  var scoring = factory();

  if (typeof module === "object" && module.exports) {
    module.exports = scoring;
  }

  root.IdeiasIluministas = root.IdeiasIluministas || {};
  root.IdeiasIluministas.scoring = scoring;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  var TENSION_VALUES = [-2, -1, 0, 1, 2];
  var CLOSE_THRESHOLD = 4;
  var BOOTSTRAP_SAMPLES = 300;
  var CI_LOWER = 0.1;
  var CI_UPPER = 0.9;
  var PROFILE_EXTREME = 2;
  var EPSILON = 1e-9;

  function numberOrZero(value) {
    return typeof value === "number" && Number.isFinite(value) ? value : 0;
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function emptyAxisMap(axisIds, initial) {
    return axisIds.reduce(function (result, id) {
      result[id] = initial;
      return result;
    }, {});
  }

  function addCharges(target, charges, factor) {
    Object.keys(charges || {}).forEach(function (axisId) {
      if (Object.prototype.hasOwnProperty.call(target, axisId)) {
        target[axisId] += numberOrZero(charges[axisId]) * factor;
      }
    });
  }

  function findReaction(item, id) {
    return item.reactions.find(function (reaction) {
      return reaction.id === id;
    });
  }

  function isTensionValue(value) {
    return TENSION_VALUES.indexOf(value) !== -1;
  }

  function tensionWeight(instrument) {
    return typeof instrument.tensionWeight === "number" ? instrument.tensionWeight : 1;
  }

  /* ---------- contribuições por item ---------- */

  // Contribuição de um par (mais próxima, mais distante) de um conjunto de reações.
  function reactionPairCharges(axisIds, reactions, closestId, farthestId) {
    var totals = emptyAxisMap(axisIds, 0);
    var closest = reactions.find(function (r) { return r.id === closestId; });
    var farthest = reactions.find(function (r) { return r.id === farthestId; });
    if (!closest || !farthest || closest.id === farthest.id) {
      return null;
    }
    addCharges(totals, closest.charges, 1);
    addCharges(totals, farthest.charges, -1);
    return totals;
  }

  // Maior contribuição absoluta possível de um conjunto de reações para um eixo.
  function reactionSetSpread(reactions, axisId) {
    var values = reactions.map(function (reaction) {
      return numberOrZero((reaction.charges || {})[axisId]);
    });
    var spread = 0;
    values.forEach(function (a, i) {
      values.forEach(function (b, j) {
        if (i !== j) {
          spread = Math.max(spread, Math.abs(a - b));
        }
      });
    });
    return spread;
  }

  function isScenarioAnswerComplete(item, answer) {
    var safe = answer || {};
    var closest = findReaction(item, safe.closest);
    var farthest = findReaction(item, safe.farthest);
    return Boolean(closest && farthest && closest.id !== farthest.id);
  }

  function isTwoStageAnswerComplete(item, answer) {
    var safe = answer || {};
    return (
      isScenarioAnswerComplete(item, safe.first) &&
      isScenarioAnswerComplete({ reactions: item.second.reactions }, safe.second)
    );
  }

  // Lista de unidades de reamostragem: cada uma com sua contribuição bruta por eixo.
  // Itens sem resposta válida não entram.
  function itemContributions(instrument, responses) {
    var axisIds = instrument.axisIds;
    var safe = responses || {};
    var scenarios = safe.scenarios || {};
    var twoStage = safe.twoStage || {};
    var tensions = safe.tensions || {};
    var units = [];

    instrument.scenarios.forEach(function (item) {
      var answer = scenarios[item.id] || {};
      var charges = reactionPairCharges(axisIds, item.reactions, answer.closest, answer.farthest);
      if (charges) {
        units.push({ id: item.id, kind: "scenario", charges: charges });
      }
    });

    instrument.twoStage.forEach(function (item) {
      var answer = twoStage[item.id] || {};
      if (!isTwoStageAnswerComplete(item, answer)) {
        return;
      }
      var first = reactionPairCharges(axisIds, item.reactions, answer.first.closest, answer.first.farthest);
      var second = reactionPairCharges(axisIds, item.second.reactions, answer.second.closest, answer.second.farthest);
      var totals = emptyAxisMap(axisIds, 0);
      addCharges(totals, first, 1);
      addCharges(totals, second, 1);
      // Registrado apenas como leitura: a posição "manter ou adaptar" já está nas cargas
      // das reações da segunda fase.
      var kept = answer.first.closest === answer.second.closest;
      units.push({ id: item.id, kind: "twoStage", charges: totals, kept: kept });
    });

    instrument.tensions.forEach(function (item) {
      var value = tensions[item.id];
      if (!isTensionValue(value)) {
        return;
      }
      var totals = emptyAxisMap(axisIds, 0);
      if (Object.prototype.hasOwnProperty.call(totals, item.axisId)) {
        totals[item.axisId] = value * tensionWeight(instrument);
      }
      units.push({ id: item.id, kind: "tension", charges: totals });
    });

    return units;
  }

  /* ---------- limites teóricos ---------- */

  // Máximo absoluto alcançável por eixo somando todos os itens. Simétrico por construção.
  function getBounds(instrument) {
    var axisIds = instrument.axisIds;
    var max = emptyAxisMap(axisIds, 0);

    instrument.scenarios.forEach(function (item) {
      axisIds.forEach(function (axisId) {
        max[axisId] += reactionSetSpread(item.reactions, axisId);
      });
    });

    instrument.twoStage.forEach(function (item) {
      axisIds.forEach(function (axisId) {
        max[axisId] += reactionSetSpread(item.reactions, axisId);
        max[axisId] += reactionSetSpread(item.second.reactions, axisId);
      });
    });

    instrument.tensions.forEach(function (item) {
      if (Object.prototype.hasOwnProperty.call(max, item.axisId)) {
        max[item.axisId] += 2 * tensionWeight(instrument);
      }
    });

    return max;
  }

  function sumUnits(axisIds, units) {
    var totals = emptyAxisMap(axisIds, 0);
    units.forEach(function (unit) {
      addCharges(totals, unit.charges, 1);
    });
    return totals;
  }

  function normalize(axisIds, totals, bounds) {
    return axisIds.reduce(function (result, axisId) {
      var bound = bounds[axisId];
      result[axisId] = bound > 0 ? clamp(totals[axisId] / bound, -1, 1) : 0;
      return result;
    }, {});
  }

  /* ---------- semelhança ---------- */

  function norm(axisIds, vector) {
    return Math.sqrt(
      axisIds.reduce(function (sum, axisId) {
        var value = numberOrZero(vector[axisId]);
        return sum + value * value;
      }, 0)
    );
  }

  function dot(axisIds, a, b) {
    return axisIds.reduce(function (sum, axisId) {
      return sum + numberOrZero(a[axisId]) * numberOrZero(b[axisId]);
    }, 0);
  }

  function cosine(axisIds, a, b) {
    var denominator = norm(axisIds, a) * norm(axisIds, b);
    return denominator < EPSILON ? 0 : dot(axisIds, a, b) / denominator;
  }

  function profileVectors(profiles) {
    return (profiles || []).reduce(function (result, profile) {
      result[profile.id] = profile.vector || {};
      return result;
    }, {});
  }

  // Índice 0–100 a partir do cosseno entre a posição normalizada e o vetor de cada perfil.
  function scoresFromPosition(instrument, position, vectors) {
    return instrument.profileIds.reduce(function (result, profileId) {
      var similarity = cosine(instrument.axisIds, position, vectors[profileId] || {});
      result[profileId] = 50 + 50 * similarity;
      return result;
    }, {});
  }

  function rankScores(profileIds, scores, profileNames) {
    return profileIds
      .map(function (profileId) {
        var canonicalScore = Math.round(scores[profileId] * 1e9) / 1e9;
        return {
          id: profileId,
          score: scores[profileId],
          canonicalScore: canonicalScore,
          name: profileNames && profileNames[profileId] ? profileNames[profileId] : profileId
        };
      })
      .sort(function (a, b) {
        var difference = b.canonicalScore - a.canonicalScore;
        return Math.abs(difference) > 1e-10 ? difference : a.name.localeCompare(b.name, "pt-BR");
      });
  }

  /* ---------- bootstrap ---------- */

  function hashString(text) {
    var hash = 2166136261;
    for (var index = 0; index < text.length; index += 1) {
      hash ^= text.charCodeAt(index);
      hash = Math.imul(hash, 16777619) >>> 0;
    }
    return hash >>> 0;
  }

  function makeRandom(seed) {
    var state = seed >>> 0 || 1;
    return function () {
      state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
      return state / 4294967296;
    };
  }

  function percentile(sorted, fraction) {
    if (sorted.length === 0) {
      return 0;
    }
    var position = (sorted.length - 1) * fraction;
    var lower = Math.floor(position);
    var upper = Math.ceil(position);
    var weight = position - lower;
    return sorted[lower] * (1 - weight) + sorted[upper] * weight;
  }

  // Intervalo de 80% por perfil reamostrando os itens respondidos, com semente
  // derivada das próprias respostas para que o mesmo conjunto dê o mesmo intervalo.
  function bootstrap(instrument, units, bounds, vectors, samples) {
    var count = typeof samples === "number" ? samples : BOOTSTRAP_SAMPLES;
    var axisIds = instrument.axisIds;
    var seed = hashString(JSON.stringify(units.map(function (unit) { return [unit.id, unit.charges]; })));
    var random = makeRandom(seed);
    var collected = instrument.profileIds.reduce(function (result, profileId) {
      result[profileId] = [];
      return result;
    }, {});

    if (units.length === 0) {
      return instrument.profileIds.reduce(function (result, profileId) {
        result[profileId] = { low: 50, high: 50 };
        return result;
      }, {});
    }

    for (var sample = 0; sample < count; sample += 1) {
      var resampled = [];
      for (var pick = 0; pick < units.length; pick += 1) {
        resampled.push(units[Math.floor(random() * units.length)]);
      }
      var position = normalize(axisIds, sumUnits(axisIds, resampled), bounds);
      var scores = scoresFromPosition(instrument, position, vectors);
      instrument.profileIds.forEach(function (profileId) {
        collected[profileId].push(scores[profileId]);
      });
    }

    return instrument.profileIds.reduce(function (result, profileId) {
      var sorted = collected[profileId].slice().sort(function (a, b) { return a - b; });
      result[profileId] = {
        low: percentile(sorted, CI_LOWER),
        high: percentile(sorted, CI_UPPER)
      };
      return result;
    }, {});
  }

  /* ---------- leituras ---------- */

  // Posição do perfil no mesmo intervalo da posição normalizada do respondente.
  function profilePosition(axisIds, vector) {
    return axisIds.reduce(function (result, axisId) {
      result[axisId] = numberOrZero(vector[axisId]) / PROFILE_EXTREME;
      return result;
    }, {});
  }

  // Eixos em que o respondente mais concorda e mais diverge do perfil principal.
  // Só eixos em que o perfil tem posição marcada (|valor| ≥ 1) contam como concordância.
  function readings(instrument, position, topVector) {
    var axisIds = instrument.axisIds;
    var target = profilePosition(axisIds, topVector);
    var rows = axisIds.map(function (axisId) {
      var gap = Math.abs(position[axisId] - target[axisId]);
      return {
        axisId: axisId,
        respondent: position[axisId],
        profile: target[axisId],
        gap: gap,
        marked: Math.abs(numberOrZero(topVector[axisId])) >= 1
      };
    });
    var agreements = rows
      .filter(function (row) { return row.marked; })
      .sort(function (a, b) { return a.gap - b.gap; })
      .slice(0, 2);
    var divergence = rows.slice().sort(function (a, b) { return b.gap - a.gap; })[0];
    return { agreements: agreements, divergence: divergence, rows: rows };
  }

  // Eixo em que as escolhas do respondente mais oscilaram entre os dois polos.
  function innerTension(instrument, units, bounds) {
    var axisIds = instrument.axisIds;
    var best = null;

    axisIds.forEach(function (axisId) {
      var values = units
        .filter(function (unit) { return unit.kind !== "tension" && numberOrZero(unit.charges[axisId]) !== 0; })
        .map(function (unit) { return unit.charges[axisId]; });
      if (values.length < 3) {
        return;
      }
      var mean = values.reduce(function (s, v) { return s + v; }, 0) / values.length;
      var variance = values.reduce(function (s, v) { return s + (v - mean) * (v - mean); }, 0) / values.length;
      var positives = values.filter(function (v) { return v > 0; }).length;
      var negatives = values.length - positives;
      var balance = Math.min(positives, negatives) / values.length;
      var score = Math.sqrt(variance) * balance;
      if (!best || score > best.score) {
        best = { axisId: axisId, score: score, balance: balance, count: values.length, mean: mean };
      }
    });

    // Só há tensão digna de nota quando pelo menos um quarto das escolhas foi para o polo oposto.
    return best && best.balance >= 0.25 ? best : null;
  }

  function conviction(instrument, position) {
    var total = instrument.axisIds.reduce(function (sum, axisId) {
      return sum + Math.abs(position[axisId]);
    }, 0);
    return total / instrument.axisIds.length;
  }

  /* ---------- completude ---------- */

  function validateCompleteness(instrument, responses) {
    var missing = [];
    var safe = responses || {};

    instrument.scenarios.forEach(function (item) {
      if (!isScenarioAnswerComplete(item, (safe.scenarios || {})[item.id])) {
        missing.push(item.id);
      }
    });
    instrument.twoStage.forEach(function (item) {
      if (!isTwoStageAnswerComplete(item, (safe.twoStage || {})[item.id])) {
        missing.push(item.id);
      }
    });
    instrument.tensions.forEach(function (item) {
      if (!isTensionValue((safe.tensions || {})[item.id])) {
        missing.push(item.id);
      }
    });

    return { complete: missing.length === 0, missing: missing };
  }

  function findClosePairs(ranking, threshold) {
    var limit = typeof threshold === "number" ? threshold : CLOSE_THRESHOLD;
    var pairs = [];
    ranking.forEach(function (entry, index) {
      var next = ranking[index + 1];
      if (!next) {
        return;
      }
      var difference = entry.canonicalScore - next.canonicalScore;
      if (difference >= 0 && difference < limit) {
        pairs.push([entry.id, next.id]);
      }
    });
    return pairs;
  }

  /* ---------- resultado ---------- */

  function score(instrument, responses, profiles, options) {
    var settings = options || {};
    var axisIds = instrument.axisIds;
    var vectors = profileVectors(profiles);
    var profileNames = (profiles || []).reduce(function (result, profile) {
      result[profile.id] = profile.name;
      return result;
    }, {});
    var bounds = getBounds(instrument);
    var units = itemContributions(instrument, responses);
    var raw = sumUnits(axisIds, units);
    var position = normalize(axisIds, raw, bounds);
    var scores = scoresFromPosition(instrument, position, vectors);
    var ranking = rankScores(instrument.profileIds, scores, profileNames);
    var intervals = settings.skipBootstrap
      ? null
      : bootstrap(instrument, units, bounds, vectors, settings.bootstrapSamples);
    var top = ranking[0];
    var second = ranking[1];
    var technicalTie = Boolean(
      intervals && second && intervals[top.id].low <= intervals[second.id].high
    );

    return {
      complete: validateCompleteness(instrument, responses),
      answered: units.length,
      raw: raw,
      position: position,
      scores: scores,
      ranking: ranking,
      top: top,
      intervals: intervals,
      technicalTie: technicalTie,
      closePairs: findClosePairs(ranking, CLOSE_THRESHOLD),
      readings: readings(instrument, position, vectors[top.id] || {}),
      profilePositions: instrument.profileIds.reduce(function (result, profileId) {
        result[profileId] = profilePosition(axisIds, vectors[profileId] || {});
        return result;
      }, {}),
      innerTension: innerTension(instrument, units, bounds),
      conviction: conviction(instrument, position),
      heldPositions: {
        kept: units.filter(function (unit) { return unit.kind === "twoStage" && unit.kept; }).length,
        total: units.filter(function (unit) { return unit.kind === "twoStage"; }).length
      }
    };
  }

  /* ---------- utilitários de verificação do instrumento ---------- */

  function allReactionSets(instrument) {
    var sets = [];
    instrument.scenarios.forEach(function (item) {
      sets.push({ id: item.id, axes: item.axes, reactions: item.reactions });
    });
    instrument.twoStage.forEach(function (item) {
      sets.push({ id: item.id + "/1", axes: item.axes, reactions: item.reactions });
      sets.push({ id: item.id + "/2", axes: item.axes, reactions: item.second.reactions });
    });
    return sets;
  }

  // Quantos conjuntos de reações tocam cada eixo e quantas tensões cada eixo tem.
  function coverage(instrument) {
    return instrument.axisIds.reduce(function (result, axisId) {
      result[axisId] = {
        scenarios: instrument.scenarios.filter(function (item) {
          return item.axes.indexOf(axisId) !== -1;
        }).length,
        twoStage: instrument.twoStage.filter(function (item) {
          return item.axes.indexOf(axisId) !== -1;
        }).length,
        tensions: instrument.tensions.filter(function (item) {
          return item.axisId === axisId;
        }).length
      };
      return result;
    }, {});
  }

  // Para cada par de perfis, em quantos conjuntos de reações as cargas das duas
  // reações diferem em pelo menos `minimum` em algum eixo.
  function pairDiscrimination(instrument, minimum) {
    var threshold = typeof minimum === "number" ? minimum : 2;
    var matrix = {};
    instrument.profileIds.forEach(function (a) {
      matrix[a] = {};
      instrument.profileIds.forEach(function (b) {
        matrix[a][b] = 0;
      });
    });

    allReactionSets(instrument).forEach(function (set) {
      var byProfile = {};
      set.reactions.forEach(function (reaction) {
        byProfile[reaction.profileId] = reaction.charges || {};
      });
      instrument.profileIds.forEach(function (a) {
        instrument.profileIds.forEach(function (b) {
          if (a === b || !byProfile[a] || !byProfile[b]) {
            return;
          }
          var separated = instrument.axisIds.some(function (axisId) {
            return Math.abs(numberOrZero(byProfile[a][axisId]) - numberOrZero(byProfile[b][axisId])) >= threshold;
          });
          if (separated) {
            matrix[a][b] += 1;
          }
        });
      });
    });

    return matrix;
  }

  // A reação de cada perfil deve ser, entre as do conjunto, a que mais aponta na
  // direção do vetor do próprio perfil (cosseno), sem empate. Devolve as violações.
  // O cosseno, e não o produto escalar, evita que perfis de vetor curto (mais
  // moderados) sejam dominados por reações extremas de perfis vizinhos.
  function keyConsistency(instrument, profiles) {
    var vectors = profileVectors(profiles);
    var axisIds = instrument.axisIds;
    var violations = [];

    allReactionSets(instrument).forEach(function (set) {
      set.reactions.forEach(function (reaction) {
        var own = cosine(axisIds, reaction.charges || {}, vectors[reaction.profileId] || {});
        set.reactions.forEach(function (other) {
          if (other.id === reaction.id) {
            return;
          }
          var competing = cosine(axisIds, other.charges || {}, vectors[reaction.profileId] || {});
          if (competing >= own - 1e-9) {
            violations.push({
              set: set.id,
              profileId: reaction.profileId,
              reaction: reaction.id,
              competitor: other.id,
              own: own,
              competing: competing
            });
          }
        });
      });
    });

    return violations;
  }

  return {
    TENSION_VALUES: TENSION_VALUES,
    CLOSE_THRESHOLD: CLOSE_THRESHOLD,
    BOOTSTRAP_SAMPLES: BOOTSTRAP_SAMPLES,
    getBounds: getBounds,
    itemContributions: itemContributions,
    sumUnits: sumUnits,
    normalize: normalize,
    cosine: cosine,
    dot: dot,
    scoresFromPosition: scoresFromPosition,
    rankScores: rankScores,
    bootstrap: bootstrap,
    readings: readings,
    innerTension: innerTension,
    isScenarioAnswerComplete: isScenarioAnswerComplete,
    isTwoStageAnswerComplete: isTwoStageAnswerComplete,
    isTensionValue: isTensionValue,
    validateCompleteness: validateCompleteness,
    findClosePairs: findClosePairs,
    score: score,
    allReactionSets: allReactionSets,
    coverage: coverage,
    pairDiscrimination: pairDiscrimination,
    keyConsistency: keyConsistency
  };
});
