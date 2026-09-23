"use strict";

// Simulação de Monte Carlo do instrumento v3.
// Uso: node scripts/simulate.js            (relatório em JSON; sai com 1 se algum critério falhar)
//      SIMULATIONS=20000 node scripts/simulate.js

var instrument = require("../js/data/items.js");
var profiles = require("../js/data/profiles.js");
var scoring = require("../js/scoring.js");
var tests = require("../tests/scoring.test.js");

var SAMPLE_SIZE = Number(process.env.SIMULATIONS || 20000);
var SEED = 11002026;
var seed = SEED;

// Critérios de aceite. Com cinco perfis, o acaso puro daria 20% de 1º lugar para cada um.
// A faixa 11–27% admite células de tamanhos distintos: o perfil moderado (Philosophes,
// vetor curto e vizinho de três outros) tem célula estruturalmente menor no cosseno,
// e nenhuma variante defensável do vetor a leva acima de 13%. O critério que importa
// para o uso real é a recuperação do perfil pretendido sob ruído, verificada abaixo
// em dois níveis (30% e 50% de respostas aleatórias).
var CRITERIA = {
  top1RateMin: 0.11,
  top1RateMax: 0.27,
  meanBand: 6,
  realisticNoise: 0.3,
  realisticTop1Rate: 0.9,
  heavyNoise: 0.5,
  heavyNoiseTop1Rate: 0.9,
  realisticTieRate: 0.35,
  singleAnswerTop1ChangeRate: 0.05,
  coherentMargin: 15
};

function random() {
  seed = (seed * 1664525 + 1013904223) >>> 0;
  return seed / 4294967296;
}

function randomChoice(values) {
  return values[Math.floor(random() * values.length)];
}

function randomPair(reactions) {
  var closestIndex = Math.floor(random() * reactions.length);
  var farthestIndex = Math.floor(random() * (reactions.length - 1));
  if (farthestIndex >= closestIndex) {
    farthestIndex += 1;
  }
  return { closest: reactions[closestIndex].id, farthest: reactions[farthestIndex].id };
}

function randomAnswers() {
  var answers = { scenarios: {}, twoStage: {}, tensions: {} };
  instrument.scenarios.forEach(function (item) {
    answers.scenarios[item.id] = randomPair(item.reactions);
  });
  instrument.twoStage.forEach(function (item) {
    answers.twoStage[item.id] = {
      first: randomPair(item.reactions),
      second: randomPair(item.second.reactions)
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
  var answers = tests.coherentAnswers(instrument, profiles, profileId);
  var noiseSource = randomAnswers();
  instrument.scenarios.forEach(function (item) {
    if (random() < noise) {
      answers.scenarios[item.id] = noiseSource.scenarios[item.id];
    }
  });
  instrument.twoStage.forEach(function (item) {
    if (random() < noise) {
      answers.twoStage[item.id] = noiseSource.twoStage[item.id];
    }
  });
  instrument.tensions.forEach(function (item) {
    if (random() < noise) {
      answers.tensions[item.id] = noiseSource.tensions[item.id];
    }
  });
  return answers;
}

// Altera exatamente uma resposta: troca a "mais distante" de um cenário
// ou desloca uma tensão em um ponto, escolhendo o item proporcionalmente ao total.
function perturbOneAnswer(answers) {
  var changed = clone(answers);
  var total = instrument.scenarios.length + instrument.twoStage.length + instrument.tensions.length;
  var itemIndex = Math.floor(random() * total);

  function swapFarthest(reactions, answer) {
    var candidates = reactions.filter(function (reaction) {
      return reaction.id !== answer.closest && reaction.id !== answer.farthest;
    });
    answer.farthest = randomChoice(candidates).id;
  }

  if (itemIndex < instrument.scenarios.length) {
    var item = instrument.scenarios[itemIndex];
    swapFarthest(item.reactions, changed.scenarios[item.id]);
  } else if (itemIndex < instrument.scenarios.length + instrument.twoStage.length) {
    var twoStage = instrument.twoStage[itemIndex - instrument.scenarios.length];
    swapFarthest(twoStage.reactions, changed.twoStage[twoStage.id].first);
  } else {
    var tension = instrument.tensions[itemIndex - instrument.scenarios.length - instrument.twoStage.length];
    var current = changed.tensions[tension.id];
    changed.tensions[tension.id] = current >= 2 ? 1 : current + 1;
  }
  return changed;
}

// Estilos de resposta mecânicos, na ordem de arquivo das reações (a ordem real é sorteada por sessão).
function patternedAnswers(kind) {
  var answers = { scenarios: {}, twoStage: {}, tensions: {} };
  var count = instrument.profileIds.length;

  function pairFor(reactions, index) {
    if (kind === "first-last") {
      return { closest: reactions[0].id, farthest: reactions[count - 1].id };
    }
    if (kind === "last-first") {
      return { closest: reactions[count - 1].id, farthest: reactions[0].id };
    }
    if (kind === "middle") {
      return { closest: reactions[2].id, farthest: reactions[1].id };
    }
    return { closest: reactions[index % count].id, farthest: reactions[(index + 2) % count].id };
  }

  instrument.scenarios.forEach(function (item, index) {
    answers.scenarios[item.id] = pairFor(item.reactions, index);
  });
  instrument.twoStage.forEach(function (item, index) {
    answers.twoStage[item.id] = {
      first: pairFor(item.reactions, index),
      second: pairFor(item.second.reactions, index + 1)
    };
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

var fast = { skipBootstrap: true };

/* ---------- respostas aleatórias ---------- */

var stats = instrument.profileIds.reduce(function (result, profileId) {
  result[profileId] = { sum: 0, sumSquares: 0, top1: 0 };
  return result;
}, {});
var closeCount = 0;
var perturbationChanges = 0;
var perturbationSamples = Math.min(5000, SAMPLE_SIZE);
var tieSamples = Math.min(1500, SAMPLE_SIZE);
var randomTies = 0;

for (var index = 0; index < SAMPLE_SIZE; index += 1) {
  var answers = randomAnswers();
  var result = scoring.score(instrument, answers, profiles, fast);

  result.ranking.forEach(function (entry) {
    stats[entry.id].sum += entry.score;
    stats[entry.id].sumSquares += entry.score * entry.score;
  });
  stats[result.ranking[0].id].top1 += 1;
  if (result.closePairs.length > 0 && result.closePairs[0][0] === result.ranking[0].id) {
    closeCount += 1;
  }
  if (index < perturbationSamples) {
    var perturbed = scoring.score(instrument, perturbOneAnswer(answers), profiles, fast);
    if (perturbed.ranking[0].id !== result.ranking[0].id) {
      perturbationChanges += 1;
    }
  }
  if (index < tieSamples) {
    if (scoring.score(instrument, answers, profiles, { bootstrapSamples: 150 }).technicalTie) {
      randomTies += 1;
    }
  }
}

var profileReport = instrument.profileIds.map(function (profileId) {
  var profileStats = stats[profileId];
  var mean = profileStats.sum / SAMPLE_SIZE;
  var variance = profileStats.sumSquares / SAMPLE_SIZE - mean * mean;
  return {
    id: profileId,
    mean: Number(mean.toFixed(2)),
    standardDeviation: Number(Math.sqrt(Math.max(0, variance)).toFixed(2)),
    top1Rate: Number((profileStats.top1 / SAMPLE_SIZE).toFixed(4))
  };
});

/* ---------- respondentes realistas ---------- */

var realisticSamples = Math.min(5000, SAMPLE_SIZE);
var realistic = { top1: 0, changes: 0, ties: 0, marginSum: 0, ownSum: 0 };
var realisticByProfile = instrument.profileIds.reduce(function (result, profileId) {
  result[profileId] = { top1: 0, count: 0 };
  return result;
}, {});
var realisticTieSamples = Math.min(1000, realisticSamples);

for (var realisticIndex = 0; realisticIndex < realisticSamples; realisticIndex += 1) {
  var intended = instrument.profileIds[realisticIndex % instrument.profileIds.length];
  var realisticAnswerSet = realisticAnswers(intended, CRITERIA.realisticNoise);
  var realisticResult = scoring.score(instrument, realisticAnswerSet, profiles, fast);

  realisticByProfile[intended].count += 1;
  if (realisticResult.ranking[0].id === intended) {
    realistic.top1 += 1;
    realisticByProfile[intended].top1 += 1;
  }
  realistic.marginSum += realisticResult.ranking[0].score - realisticResult.ranking[1].score;
  realistic.ownSum += realisticResult.scores[intended];
  if (scoring.score(instrument, perturbOneAnswer(realisticAnswerSet), profiles, fast).ranking[0].id !== realisticResult.ranking[0].id) {
    realistic.changes += 1;
  }
  if (realisticIndex < realisticTieSamples) {
    if (scoring.score(instrument, realisticAnswerSet, profiles, { bootstrapSamples: 150 }).technicalTie) {
      realistic.ties += 1;
    }
  }
}

var realisticReport = {
  noise: CRITERIA.realisticNoise,
  samples: realisticSamples,
  intendedTop1Rate: Number((realistic.top1 / realisticSamples).toFixed(4)),
  intendedTop1ByProfile: instrument.profileIds.reduce(function (result, profileId) {
    var entry = realisticByProfile[profileId];
    result[profileId] = Number((entry.top1 / entry.count).toFixed(4));
    return result;
  }, {}),
  meanOwnScore: Number((realistic.ownSum / realisticSamples).toFixed(2)),
  meanMarginTop1Top2: Number((realistic.marginSum / realisticSamples).toFixed(2)),
  singleAnswerTop1ChangeRate: Number((realistic.changes / realisticSamples).toFixed(4)),
  technicalTieRate: Number((realistic.ties / realisticTieSamples).toFixed(4))
};

/* ---------- ruído pesado: curva de recuperação por perfil ---------- */

var noiseLevels = [0.3, 0.5, 0.7];
var noiseSamples = Math.min(1500, SAMPLE_SIZE);
var recoveryCurve = noiseLevels.map(function (noise) {
  var byProfile = {};
  instrument.profileIds.forEach(function (profileId) {
    var hits = 0;
    for (var n = 0; n < noiseSamples; n += 1) {
      if (scoring.score(instrument, realisticAnswers(profileId, noise), profiles, fast).ranking[0].id === profileId) {
        hits += 1;
      }
    }
    byProfile[profileId] = Number((hits / noiseSamples).toFixed(3));
  });
  return { noise: noise, intendedTop1ByProfile: byProfile };
});

/* ---------- respondentes coerentes ---------- */

var coherentArchetypes = instrument.profileIds.map(function (profileId) {
  var coherent = scoring.score(instrument, tests.coherentAnswers(instrument, profiles, profileId), profiles);
  var rank = coherent.ranking.findIndex(function (entry) { return entry.id === profileId; }) + 1;
  return {
    id: profileId,
    ownScore: Number(coherent.scores[profileId].toFixed(1)),
    rank: rank,
    second: coherent.ranking[1].id,
    margin: Number((coherent.ranking[0].score - coherent.ranking[1].score).toFixed(1)),
    interval: [Number(coherent.intervals[profileId].low.toFixed(1)), Number(coherent.intervals[profileId].high.toFixed(1))],
    technicalTie: coherent.technicalTie
  };
});

// Separação par a par: quanto o coerente de A supera B, e vice-versa.
var pairSeparation = [];
instrument.profileIds.forEach(function (a, i) {
  instrument.profileIds.slice(i + 1).forEach(function (b) {
    var scoresA = scoring.score(instrument, tests.coherentAnswers(instrument, profiles, a), profiles, fast).scores;
    var scoresB = scoring.score(instrument, tests.coherentAnswers(instrument, profiles, b), profiles, fast).scores;
    pairSeparation.push({
      pair: [a, b],
      aOverB: Number((scoresA[a] - scoresA[b]).toFixed(1)),
      bOverA: Number((scoresB[b] - scoresB[a]).toFixed(1))
    });
  });
});

/* ---------- estilos mecânicos ---------- */

var responseStyles = ["first-last", "last-first", "middle", "alternation"].reduce(function (result, styleId) {
  var styleResult = scoring.score(instrument, patternedAnswers(styleId), profiles);
  result[styleId] = {
    top: styleResult.ranking[0].id,
    spread: Number((styleResult.ranking[0].score - styleResult.ranking[styleResult.ranking.length - 1].score).toFixed(1)),
    technicalTie: styleResult.technicalTie,
    valid: styleResult.ranking.every(function (entry) {
      return Number.isFinite(entry.score) && entry.score >= 0 && entry.score <= 100;
    })
  };
  return result;
}, {});

/* ---------- critérios ---------- */

var failures = [];

profileReport.forEach(function (entry) {
  if (entry.top1Rate < CRITERIA.top1RateMin || entry.top1Rate > CRITERIA.top1RateMax) {
    failures.push("taxa de 1º lugar de " + entry.id + " fora de " + (100 * CRITERIA.top1RateMin) + "–" + (100 * CRITERIA.top1RateMax) + "%: " + (100 * entry.top1Rate).toFixed(1) + "%");
  }
  if (Math.abs(entry.mean - 50) > CRITERIA.meanBand) {
    failures.push("média de " + entry.id + " em respostas aleatórias afastada de 50: " + entry.mean);
  }
});
coherentArchetypes.forEach(function (entry) {
  if (entry.rank !== 1) {
    failures.push("respondente coerente de " + entry.id + " não fica em 1º");
  } else if (entry.margin < CRITERIA.coherentMargin) {
    failures.push("respondente coerente de " + entry.id + " vence por " + entry.margin + " < " + CRITERIA.coherentMargin);
  }
  if (entry.technicalTie) {
    failures.push("respondente coerente de " + entry.id + " cai em empate técnico");
  }
});
if (realisticReport.intendedTop1Rate < CRITERIA.realisticTop1Rate) {
  failures.push("perfil pretendido em 1º em apenas " + (100 * realisticReport.intendedTop1Rate).toFixed(1) + "% dos respondentes realistas");
}
recoveryCurve.forEach(function (level) {
  if (level.noise !== CRITERIA.heavyNoise) {
    return;
  }
  instrument.profileIds.forEach(function (profileId) {
    if (level.intendedTop1ByProfile[profileId] < CRITERIA.heavyNoiseTop1Rate) {
      failures.push("com " + (100 * level.noise) + "% de ruído, " + profileId + " é recuperado em apenas " + (100 * level.intendedTop1ByProfile[profileId]).toFixed(1) + "%");
    }
  });
});
if (realisticReport.singleAnswerTop1ChangeRate >= CRITERIA.singleAnswerTop1ChangeRate) {
  failures.push("troca do 1º lugar por resposta única (realistas) " + (100 * realisticReport.singleAnswerTop1ChangeRate).toFixed(1) + "% ≥ 5%");
}
if (realisticReport.technicalTieRate >= CRITERIA.realisticTieRate) {
  failures.push("empate técnico em " + (100 * realisticReport.technicalTieRate).toFixed(1) + "% dos respondentes realistas ≥ 35%");
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
  random: {
    profiles: profileReport,
    closeTopRate: Number((closeCount / SAMPLE_SIZE).toFixed(4)),
    technicalTieRate: Number((randomTies / tieSamples).toFixed(4)),
    singleAnswerTop1ChangeRate: Number((perturbationChanges / perturbationSamples).toFixed(4))
  },
  realistic: realisticReport,
  recoveryCurve: recoveryCurve,
  coherentArchetypes: coherentArchetypes,
  pairSeparation: pairSeparation,
  responseStyles: responseStyles,
  failures: failures
};

process.stdout.write(JSON.stringify(report, null, 2) + "\n");

if (failures.length > 0) {
  process.exitCode = 1;
}
