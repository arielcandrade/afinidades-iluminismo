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

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function numberOrZero(value) {
    return typeof value === "number" && Number.isFinite(value) ? value : 0;
  }

  function emptyProfileMap(profileIds, initial) {
    return profileIds.reduce(function (result, id) {
      result[id] = initial;
      return result;
    }, {});
  }

  function addWeighted(target, weights, factor) {
    Object.keys(weights || {}).forEach(function (profileId) {
      if (Object.prototype.hasOwnProperty.call(target, profileId)) {
        target[profileId] += numberOrZero(weights[profileId]) * factor;
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

  // Menor e maior contribuição possível de um cenário para um perfil,
  // considerando qualquer par (mais próxima, mais distante) de reações distintas.
  function scenarioRange(item, profileId) {
    var values = item.reactions.map(function (reaction) {
      return numberOrZero(reaction.weights[profileId]);
    });
    var minimum = Infinity;
    var maximum = -Infinity;

    values.forEach(function (closestValue, closestIndex) {
      values.forEach(function (farthestValue, farthestIndex) {
        if (closestIndex === farthestIndex) {
          return;
        }
        var contribution = closestValue - farthestValue;
        minimum = Math.min(minimum, contribution);
        maximum = Math.max(maximum, contribution);
      });
    });

    return {
      min: Number.isFinite(minimum) ? minimum : 0,
      max: Number.isFinite(maximum) ? maximum : 0
    };
  }

  function getScenarioBounds(instrument) {
    var min = emptyProfileMap(instrument.profileIds, 0);
    var max = emptyProfileMap(instrument.profileIds, 0);

    instrument.scenarios.forEach(function (item) {
      instrument.profileIds.forEach(function (profileId) {
        var range = scenarioRange(item, profileId);
        min[profileId] += range.min;
        max[profileId] += range.max;
      });
    });

    return { min: min, max: max };
  }

  function getTensionBounds(instrument) {
    var min = emptyProfileMap(instrument.profileIds, 0);
    var max = emptyProfileMap(instrument.profileIds, 0);

    instrument.tensions.forEach(function (item) {
      [item.left.profileId, item.right.profileId].forEach(function (profileId) {
        if (Object.prototype.hasOwnProperty.call(min, profileId)) {
          min[profileId] -= 2;
          max[profileId] += 2;
        }
      });
    });

    return { min: min, max: max };
  }

  function getBounds(instrument) {
    return {
      scenarios: getScenarioBounds(instrument),
      tensions: getTensionBounds(instrument)
    };
  }

  function scoreScenarios(instrument, answers) {
    var totals = emptyProfileMap(instrument.profileIds, 0);

    instrument.scenarios.forEach(function (item) {
      var answer = answers[item.id] || {};
      var closest = findReaction(item, answer.closest);
      var farthest = findReaction(item, answer.farthest);

      if (!closest || !farthest || closest.id === farthest.id) {
        return;
      }

      addWeighted(totals, closest.weights, 1);
      addWeighted(totals, farthest.weights, -1);
    });

    return totals;
  }

  function scoreTensions(instrument, answers) {
    var totals = emptyProfileMap(instrument.profileIds, 0);

    instrument.tensions.forEach(function (item) {
      var value = answers[item.id];
      if (!isTensionValue(value)) {
        return;
      }
      if (Object.prototype.hasOwnProperty.call(totals, item.left.profileId)) {
        totals[item.left.profileId] -= value;
      }
      if (Object.prototype.hasOwnProperty.call(totals, item.right.profileId)) {
        totals[item.right.profileId] += value;
      }
    });

    return totals;
  }

  function normalizeTotals(profileIds, totals, bounds) {
    return profileIds.reduce(function (result, profileId) {
      var minimum = bounds.min[profileId];
      var maximum = bounds.max[profileId];
      var range = maximum - minimum;

      result[profileId] =
        range === 0
          ? 0.5
          : clamp((totals[profileId] - minimum) / range, 0, 1);
      return result;
    }, {});
  }

  function normalizedBlocks(instrument, responses) {
    var bounds = getBounds(instrument);
    var safeResponses = responses || {};

    return {
      scenarios: normalizeTotals(
        instrument.profileIds,
        scoreScenarios(instrument, safeResponses.scenarios || {}),
        bounds.scenarios
      ),
      tensions: normalizeTotals(
        instrument.profileIds,
        scoreTensions(instrument, safeResponses.tensions || {}),
        bounds.tensions
      )
    };
  }

  function combineBlocks(instrument, blocks, omittedBlock) {
    var weights = instrument.blockWeights;
    var activeWeight = Object.keys(weights).reduce(function (sum, blockId) {
      return blockId === omittedBlock ? sum : sum + weights[blockId];
    }, 0);

    return instrument.profileIds.reduce(function (result, profileId) {
      var combined = Object.keys(weights).reduce(function (sum, blockId) {
        if (blockId === omittedBlock) {
          return sum;
        }
        return sum + blocks[blockId][profileId] * weights[blockId];
      }, 0);
      result[profileId] = activeWeight === 0 ? 50 : 100 * combined / activeWeight;
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
        return Math.abs(difference) > 1e-10
          ? difference
          : a.name.localeCompare(b.name, "pt-BR");
      });
  }

  function isScenarioAnswerComplete(item, answer) {
    var safeAnswer = answer || {};
    var closest = findReaction(item, safeAnswer.closest);
    var farthest = findReaction(item, safeAnswer.farthest);
    return Boolean(closest && farthest && closest.id !== farthest.id);
  }

  function validateCompleteness(instrument, responses) {
    var missing = [];
    var safeResponses = responses || {};

    instrument.scenarios.forEach(function (item) {
      if (!isScenarioAnswerComplete(item, (safeResponses.scenarios || {})[item.id])) {
        missing.push(item.id);
      }
    });

    instrument.tensions.forEach(function (item) {
      if (!isTensionValue((safeResponses.tensions || {})[item.id])) {
        missing.push(item.id);
      }
    });

    return { complete: missing.length === 0, missing: missing };
  }

  // Um perfil do top 3 é "instável" quando sai do top 3 em pelo menos duas variantes
  // (ou em todas, se houver menos de três blocos): nenhum bloco isolado o sustenta.
  function calculateStability(instrument, blocks, fullRanking, profileNames) {
    var blockIds = Object.keys(instrument.blockWeights);
    var exitThreshold = Math.min(2, blockIds.length);
    var fullTopIds = fullRanking.slice(0, 3).map(function (entry) {
      return entry.id;
    });
    var exitCounts = fullTopIds.reduce(function (result, id) {
      result[id] = 0;
      return result;
    }, {});
    var variants = {};

    blockIds.forEach(function (omittedBlock) {
      var scores = combineBlocks(instrument, blocks, omittedBlock);
      var ranking = rankScores(instrument.profileIds, scores, profileNames);
      var topIds = ranking.slice(0, 3).map(function (entry) {
        return entry.id;
      });
      variants[omittedBlock] = topIds;

      fullTopIds.forEach(function (profileId) {
        if (topIds.indexOf(profileId) === -1) {
          exitCounts[profileId] += 1;
        }
      });
    });

    var unstableProfiles = fullTopIds.filter(function (profileId) {
      return exitCounts[profileId] >= exitThreshold;
    });

    return {
      sensitive: unstableProfiles.length > 0,
      unstableProfiles: unstableProfiles,
      exitCounts: exitCounts,
      variants: variants
    };
  }

  function findClosePairs(ranking, threshold) {
    var limit = typeof threshold === "number" ? threshold : CLOSE_THRESHOLD;
    var pairs = [];

    ranking.slice(0, 3).forEach(function (entry, index) {
      var nextEntry = ranking[index + 1];
      var difference = nextEntry ? entry.canonicalScore - nextEntry.canonicalScore : Infinity;
      if (difference > 0 && difference < limit) {
        pairs.push([entry.id, nextEntry.id]);
      }
    });

    return pairs;
  }

  function findTieGroups(ranking) {
    var groups = [];
    var current = [];

    ranking.forEach(function (entry, index) {
      if (
        index === 0 ||
        entry.canonicalScore === ranking[index - 1].canonicalScore
      ) {
        current.push(entry.id);
      } else {
        if (current.length > 1) {
          groups.push(current);
        }
        current = [entry.id];
      }
    });

    if (current.length > 1) {
      groups.push(current);
    }

    return groups;
  }

  function score(instrument, responses, profiles) {
    var profileNames = (profiles || []).reduce(function (result, profile) {
      result[profile.id] = profile.name;
      return result;
    }, {});
    var blocks = normalizedBlocks(instrument, responses);
    var scores = combineBlocks(instrument, blocks);
    var ranking = rankScores(instrument.profileIds, scores, profileNames);

    return {
      complete: validateCompleteness(instrument, responses),
      scores: scores,
      blocks: blocks,
      ranking: ranking,
      topThree: ranking.slice(0, 3),
      tieGroups: findTieGroups(ranking),
      closePairs: findClosePairs(ranking, CLOSE_THRESHOLD),
      stability: calculateStability(instrument, blocks, ranking, profileNames)
    };
  }

  function coverage(instrument) {
    return instrument.profileIds.reduce(function (result, profileId) {
      result[profileId] = {
        scenarios: instrument.scenarios.filter(function (item) {
          return item.reactions.some(function (reaction) {
            return numberOrZero(reaction.weights[profileId]) !== 0;
          });
        }).length,
        principal: instrument.scenarios.filter(function (item) {
          return item.reactions.some(function (reaction) {
            return numberOrZero(reaction.weights[profileId]) === 2;
          });
        }).length,
        tensions: instrument.tensions.filter(function (item) {
          return item.left.profileId === profileId || item.right.profileId === profileId;
        }).length
      };
      return result;
    }, {});
  }

  // Quantas vezes cada par de perfis aparece no mesmo cenário como reação principal.
  function pairMatrix(instrument) {
    var matrix = {};
    instrument.profileIds.forEach(function (a) {
      matrix[a] = emptyProfileMap(instrument.profileIds, 0);
    });

    instrument.scenarios.forEach(function (item) {
      var principals = item.reactions
        .map(function (reaction) {
          return Object.keys(reaction.weights).find(function (profileId) {
            return numberOrZero(reaction.weights[profileId]) === 2;
          });
        })
        .filter(Boolean);

      principals.forEach(function (a) {
        principals.forEach(function (b) {
          if (a !== b && matrix[a] && Object.prototype.hasOwnProperty.call(matrix[a], b)) {
            matrix[a][b] += 1;
          }
        });
      });
    });

    return matrix;
  }

  return {
    TENSION_VALUES: TENSION_VALUES,
    CLOSE_THRESHOLD: CLOSE_THRESHOLD,
    getBounds: getBounds,
    scoreScenarios: scoreScenarios,
    scoreTensions: scoreTensions,
    normalizedBlocks: normalizedBlocks,
    combineBlocks: combineBlocks,
    isScenarioAnswerComplete: isScenarioAnswerComplete,
    isTensionValue: isTensionValue,
    validateCompleteness: validateCompleteness,
    calculateStability: calculateStability,
    findClosePairs: findClosePairs,
    findTieGroups: findTieGroups,
    score: score,
    coverage: coverage,
    pairMatrix: pairMatrix
  };
});
