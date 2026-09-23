"use strict";

var instrument = require("../js/data/items.js");
var profiles = require("../js/data/profiles.js");
var scoring = require("../js/scoring.js");
var tests = require("../tests/scoring.test.js");

var SAMPLE_SIZE = Number(process.env.SIMULATIONS || 50000);
var SEED = 11002026;
var seed = SEED;

// Critérios de aceite do redesenho (mais exigentes que a versão anterior).
// A troca do top 3 por resposta única é avaliada em respondentes realistas
// (coerentes com um perfil, com 30% de respostas aleatórias): em respostas
// puramente aleatórias, a diferença média entre 3º e 4º (~3 pontos) é da mesma
// ordem do efeito de uma resposta, e o critério é inatingível com 36 itens.
var CRITERIA = {
  archetypeMargin: 10,
  sensitiveRate: 0.25,
  singleAnswerTop3ChangeRate: 0.1,
  realisticNoise: 0.3,
  realisticTop1Rate: 0.85,
  realisticTop3Rate: 0.98,
  top1RateMin: 0.07,
  top1RateMax: 0.13
};

function random() {
  seed = (seed * 1664525 + 1013904223) >>> 0;
  return seed / 4294967296;
}

function randomChoice(values) {
  return values[Math.floor(random() * values.length)];
}

function randomAnswers() {
  var answers = { scenarios: {}, tensions: {} };

  instrument.scenarios.forEach(function (item) {
    var closestIndex = Math.floor(random() * item.reactions.length);
    var farthestIndex = Math.floor(random() * (item.reactions.length - 1));
    if (farthestIndex >= closestIndex) {
      farthestIndex += 1;
    }
    answers.scenarios[item.id] = {
      closest: item.reactions[closestIndex].id,
      farthest: item.reactions[farthestIndex].id
    };
  });
  instrument.tensions.forEach(function (item) {
    answers.tensions[item.id] = randomChoice(scoring.TENSION_VALUES);
  });

  return answers;
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

// Respondente realista: coerente com um perfil, mas com uma fração de respostas aleatórias.
function realisticAnswers(profileId, noise) {
  var answers = tests.coherentAnswers(instrument, profileId);
  var noiseSource = randomAnswers();

  instrument.scenarios.forEach(function (item) {
    if (random() < noise) {
      answers.scenarios[item.id] = noiseSource.scenarios[item.id];
    }
  });
  instrument.tensions.forEach(function (item) {
    if (random() < noise) {
      answers.tensions[item.id] = noiseSource.tensions[item.id];
    }
  });

  return answers;
}

// Altera exatamente uma resposta: troca a reação "mais distante" de um cenário
// ou desloca uma tensão em um ponto, escolhendo o item proporcionalmente ao total.
function perturbOneAnswer(answers) {
  var changed = clone(answers);
  var itemIndex = Math.floor(random() * (instrument.scenarios.length + instrument.tensions.length));

  if (itemIndex < instrument.scenarios.length) {
    var item = instrument.scenarios[itemIndex];
    var answer = changed.scenarios[item.id];
    var candidates = item.reactions.filter(function (reaction) {
      return reaction.id !== answer.closest && reaction.id !== answer.farthest;
    });
    answer.farthest = randomChoice(candidates).id;
  } else {
    var tension = instrument.tensions[itemIndex - instrument.scenarios.length];
    var current = changed.tensions[tension.id];
    changed.tensions[tension.id] = current >= 2 ? 1 : current + 1;
  }

  return changed;
}

function topIds(result) {
  return result.topThree.map(function (entry) {
    return entry.id;
  });
}

function sameSet(left, right) {
  return left.every(function (value) {
    return right.indexOf(value) !== -1;
  });
}

// Estilos de resposta mecânicos, na ordem de arquivo das reações (a ordem real é sorteada por sessão).
function patternedAnswers(kind) {
  var answers = { scenarios: {}, tensions: {} };

  instrument.scenarios.forEach(function (item, index) {
    var reactions = item.reactions;
    if (kind === "first-last") {
      answers.scenarios[item.id] = { closest: reactions[0].id, farthest: reactions[3].id };
    } else if (kind === "last-first") {
      answers.scenarios[item.id] = { closest: reactions[3].id, farthest: reactions[0].id };
    } else if (kind === "middle") {
      answers.scenarios[item.id] = { closest: reactions[1].id, farthest: reactions[2].id };
    } else {
      answers.scenarios[item.id] = {
        closest: reactions[index % 4].id,
        farthest: reactions[(index + 2) % 4].id
      };
    }
  });

  instrument.tensions.forEach(function (item, index) {
    if (kind === "first-last") {
      answers.tensions[item.id] = -2;
    } else if (kind === "last-first") {
      answers.tensions[item.id] = 2;
    } else if (kind === "middle") {
      answers.tensions[item.id] = 0;
    } else {
      answers.tensions[item.id] = index % 2 === 0 ? -2 : 2;
    }
  });

  return answers;
}

var stats = instrument.profileIds.reduce(function (result, profileId) {
  result[profileId] = { sum: 0, sumSquares: 0, top1: 0, top3: 0 };
  return result;
}, {});
var closeCount = 0;
var sensitiveCount = 0;
var tieCount = 0;
var perturbationChanges = 0;
var perturbationSamples = Math.min(5000, SAMPLE_SIZE);

for (var index = 0; index < SAMPLE_SIZE; index += 1) {
  var answers = randomAnswers();
  var result = scoring.score(instrument, answers, profiles);

  result.ranking.forEach(function (entry) {
    stats[entry.id].sum += entry.score;
    stats[entry.id].sumSquares += entry.score * entry.score;
  });
  stats[result.ranking[0].id].top1 += 1;
  result.topThree.forEach(function (entry) {
    stats[entry.id].top3 += 1;
  });
  if (result.closePairs.length > 0) {
    closeCount += 1;
  }
  if (result.stability.sensitive) {
    sensitiveCount += 1;
  }
  var visibleTopIds = topIds(result);
  if (
    result.tieGroups.some(function (group) {
      return group.some(function (id) {
        return visibleTopIds.indexOf(id) !== -1;
      });
    })
  ) {
    tieCount += 1;
  }

  if (index < perturbationSamples) {
    var perturbed = scoring.score(instrument, perturbOneAnswer(answers), profiles);
    if (!sameSet(topIds(result), topIds(perturbed))) {
      perturbationChanges += 1;
    }
  }
}

var realisticSamples = Math.min(10000, SAMPLE_SIZE);
var realistic = { top1: 0, top3: 0, sensitive: 0, close: 0, changes: 0, gapSum: 0 };

for (var realisticIndex = 0; realisticIndex < realisticSamples; realisticIndex += 1) {
  var intended = instrument.profileIds[realisticIndex % instrument.profileIds.length];
  var realisticAnswerSet = realisticAnswers(intended, CRITERIA.realisticNoise);
  var realisticResult = scoring.score(instrument, realisticAnswerSet, profiles);
  var realisticTop = topIds(realisticResult);

  if (realisticTop[0] === intended) {
    realistic.top1 += 1;
  }
  if (realisticTop.indexOf(intended) !== -1) {
    realistic.top3 += 1;
  }
  if (realisticResult.stability.sensitive) {
    realistic.sensitive += 1;
  }
  if (realisticResult.closePairs.length > 0) {
    realistic.close += 1;
  }
  realistic.gapSum += realisticResult.ranking[2].score - realisticResult.ranking[3].score;
  if (!sameSet(realisticTop, topIds(scoring.score(instrument, perturbOneAnswer(realisticAnswerSet), profiles)))) {
    realistic.changes += 1;
  }
}

var realisticReport = {
  noise: CRITERIA.realisticNoise,
  samples: realisticSamples,
  intendedTop1Rate: realistic.top1 / realisticSamples,
  intendedTop3Rate: realistic.top3 / realisticSamples,
  sensitiveResultRate: realistic.sensitive / realisticSamples,
  closeResultRate: realistic.close / realisticSamples,
  meanGapThirdFourth: realistic.gapSum / realisticSamples,
  singleAnswerTop3ChangeRate: realistic.changes / realisticSamples
};

var profileReport = instrument.profileIds.map(function (profileId) {
  var profileStats = stats[profileId];
  var mean = profileStats.sum / SAMPLE_SIZE;
  var variance = profileStats.sumSquares / SAMPLE_SIZE - mean * mean;
  return {
    id: profileId,
    mean: mean,
    standardDeviation: Math.sqrt(Math.max(0, variance)),
    top1Rate: profileStats.top1 / SAMPLE_SIZE,
    top3Rate: profileStats.top3 / SAMPLE_SIZE
  };
});

function archetypeReport(builder) {
  return instrument.profileIds.map(function (profileId) {
    var result = scoring.score(instrument, builder(instrument, profileId), profiles);
    var rank = result.ranking.findIndex(function (entry) {
      return entry.id === profileId;
    }) + 1;
    return {
      id: profileId,
      ownScore: result.scores[profileId],
      rank: rank,
      first: result.ranking[0].id,
      second: result.ranking[1].id,
      margin: result.ranking[0].score - result.ranking[1].score,
      sensitive: result.stability.sensitive
    };
  });
}

var maximizingArchetypes = archetypeReport(tests.maximizingAnswers);
var coherentArchetypes = archetypeReport(tests.coherentAnswers);

// Separação par a par: o arquétipo coerente de A deve superar B por margem clara e vice-versa.
var pairSeparation = tests.CONFUSABLE_PAIRS.map(function (pair) {
  var a = scoring.score(instrument, tests.coherentAnswers(instrument, pair[0]), profiles).scores;
  var b = scoring.score(instrument, tests.coherentAnswers(instrument, pair[1]), profiles).scores;
  return {
    pair: pair,
    aOverB: a[pair[0]] - a[pair[1]],
    bOverA: b[pair[1]] - b[pair[0]]
  };
});

var originalWeights = Object.assign({}, instrument.blockWeights);
var sensitivitySchemes = [
  { scenarios: 0.9, tensions: 0.1 },
  { scenarios: 0.7, tensions: 0.3 }
];
var sensitivityAnswers = Array.from({ length: 1000 }, randomAnswers);
var baselineTop = sensitivityAnswers.map(function (answers) {
  return topIds(scoring.score(instrument, answers, profiles));
});
var weightSensitivity = sensitivitySchemes.map(function (scheme) {
  instrument.blockWeights = scheme;
  var changes = sensitivityAnswers.filter(function (answers, answerIndex) {
    return !sameSet(baselineTop[answerIndex], topIds(scoring.score(instrument, answers, profiles)));
  }).length;
  return { weights: scheme, top3ChangeRate: changes / sensitivityAnswers.length };
});
instrument.blockWeights = originalWeights;

var responseStyles = ["first-last", "last-first", "middle", "alternation"].reduce(function (result, styleId) {
  var styleResult = scoring.score(instrument, patternedAnswers(styleId), profiles);
  result[styleId] = {
    topThree: topIds(styleResult),
    spread: styleResult.ranking[0].score - styleResult.ranking[styleResult.ranking.length - 1].score,
    sensitive: styleResult.stability.sensitive,
    ties: styleResult.tieGroups,
    valid: styleResult.ranking.every(function (entry) {
      return Number.isFinite(entry.score) && entry.score >= 0 && entry.score <= 100;
    })
  };
  return result;
}, {});

var failures = [];

profileReport.forEach(function (entry) {
  if (entry.top1Rate < CRITERIA.top1RateMin || entry.top1Rate > CRITERIA.top1RateMax) {
    failures.push("taxa de 1º lugar de " + entry.id + " fora de 7–13%: " + (100 * entry.top1Rate).toFixed(1) + "%");
  }
});
maximizingArchetypes.forEach(function (entry) {
  if (Math.abs(entry.ownScore - 100) > 1e-8) {
    failures.push("arquétipo maximizador de " + entry.id + " não alcança 100");
  }
});
coherentArchetypes.forEach(function (entry) {
  if (entry.rank !== 1) {
    failures.push("arquétipo coerente de " + entry.id + " não fica em 1º (" + entry.first + ")");
  } else if (entry.margin < CRITERIA.archetypeMargin) {
    failures.push("arquétipo coerente de " + entry.id + " vence por " + entry.margin.toFixed(1) + " < " + CRITERIA.archetypeMargin);
  }
});
if (sensitiveCount / SAMPLE_SIZE >= CRITERIA.sensitiveRate) {
  failures.push("taxa de resultado sensível " + (100 * sensitiveCount / SAMPLE_SIZE).toFixed(1) + "% ≥ 25%");
}
if (realisticReport.singleAnswerTop3ChangeRate >= CRITERIA.singleAnswerTop3ChangeRate) {
  failures.push("troca do top 3 por resposta única (respondentes realistas) " + (100 * realisticReport.singleAnswerTop3ChangeRate).toFixed(1) + "% ≥ 10%");
}
if (realisticReport.intendedTop1Rate < CRITERIA.realisticTop1Rate) {
  failures.push("perfil pretendido em 1º em apenas " + (100 * realisticReport.intendedTop1Rate).toFixed(1) + "% dos respondentes realistas");
}
if (realisticReport.intendedTop3Rate < CRITERIA.realisticTop3Rate) {
  failures.push("perfil pretendido no top 3 em apenas " + (100 * realisticReport.intendedTop3Rate).toFixed(1) + "% dos respondentes realistas");
}
Object.keys(responseStyles).forEach(function (styleId) {
  if (!responseStyles[styleId].valid) {
    failures.push("estilo de resposta " + styleId + " produziu índice inválido");
  }
});

var report = {
  seed: SEED,
  samples: SAMPLE_SIZE,
  criteria: CRITERIA,
  profiles: profileReport,
  closeResultRate: closeCount / SAMPLE_SIZE,
  sensitiveResultRate: sensitiveCount / SAMPLE_SIZE,
  visibleTieRate: tieCount / SAMPLE_SIZE,
  singleAnswerTop3ChangeRate: perturbationChanges / perturbationSamples,
  realistic: realisticReport,
  maximizingArchetypes: maximizingArchetypes,
  coherentArchetypes: coherentArchetypes,
  pairSeparation: pairSeparation,
  weightSensitivity: weightSensitivity,
  responseStyles: responseStyles,
  failures: failures
};

process.stdout.write(JSON.stringify(report, null, 2) + "\n");

if (failures.length > 0) {
  process.exitCode = 1;
}
