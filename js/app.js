(function (root) {
  "use strict";

  var App = root.IdeiasIluministas;
  var instrument = App.instrument;
  var profiles = App.profiles;
  var scoring = App.scoring;
  var storage = App.storage;

  if (!instrument || !profiles || !scoring || !storage) {
    return;
  }

  var app = document.getElementById("app");
  var liveRegion = document.getElementById("live-region");
  var progressRule = document.getElementById("progress-rule");
  var progressFill = document.getElementById("progress-fill");
  var brandReset = document.getElementById("brand-reset");

  var SCREENS = ["intro", "scenarios", "tensions", "result"];
  var TENSIONS_PER_PAGE = 2;
  var SCENARIO_COUNT = instrument.scenarios.length;
  var TENSION_PAGES = Math.ceil(instrument.tensions.length / TENSIONS_PER_PAGE);
  var TOTAL_ITEMS = instrument.scenarios.length + instrument.tensions.length;
  var AUTO_ADVANCE_DELAY = 550;

  var TENSION_LABELS = [
    { value: -2, label: "Muito mais a primeira" },
    { value: -1, label: "Um pouco mais a primeira" },
    { value: 0, label: "Entre as duas" },
    { value: 1, label: "Um pouco mais a segunda" },
    { value: 2, label: "Muito mais a segunda" }
  ];

  var autoAdvanceTimer = null;

  /* ---------- estado ---------- */

  function shuffle(list) {
    var copy = list.slice();
    for (var index = copy.length - 1; index > 0; index -= 1) {
      var randomIndex = Math.floor(Math.random() * (index + 1));
      var temporary = copy[index];
      copy[index] = copy[randomIndex];
      copy[randomIndex] = temporary;
    }
    return copy;
  }

  function ids(items) {
    return items.map(function (item) {
      return item.id;
    });
  }

  function initialState() {
    var reactionOrder = {};
    instrument.scenarios.forEach(function (item) {
      reactionOrder[item.id] = shuffle(ids(item.reactions));
    });

    return {
      schemaVersion: storage.schemaVersion,
      instrumentVersion: instrument.version,
      screen: "intro",
      page: 0,
      name: "",
      persist: false,
      autoAdvance: true,
      order: {
        scenarios: shuffle(ids(instrument.scenarios)),
        tensions: shuffle(ids(instrument.tensions)),
        reactions: reactionOrder
      },
      answers: {
        scenarios: {},
        tensions: {}
      }
    };
  }

  function isMap(value) {
    return Boolean(value && typeof value === "object" && !Array.isArray(value));
  }

  function itemById(items, id) {
    return items.find(function (item) {
      return item.id === id;
    });
  }

  function samePermutation(candidate, expectedIds) {
    if (!Array.isArray(candidate) || candidate.length !== expectedIds.length) {
      return false;
    }
    var expected = expectedIds.slice().sort();
    return candidate.slice().sort().every(function (id, index) {
      return id === expected[index];
    });
  }

  function validOrder(order) {
    if (
      !isMap(order) ||
      !samePermutation(order.scenarios, ids(instrument.scenarios)) ||
      !samePermutation(order.tensions, ids(instrument.tensions)) ||
      !isMap(order.reactions)
    ) {
      return false;
    }
    return instrument.scenarios.every(function (item) {
      return samePermutation(order.reactions[item.id], ids(item.reactions));
    });
  }

  function validAnswers(candidate) {
    if (!isMap(candidate) || !isMap(candidate.scenarios) || !isMap(candidate.tensions)) {
      return false;
    }

    var validScenarios = Object.keys(candidate.scenarios).every(function (id) {
      var item = itemById(instrument.scenarios, id);
      var answer = candidate.scenarios[id];
      if (!item || !isMap(answer)) {
        return false;
      }
      var reactionIds = ids(item.reactions);
      var closestValid = answer.closest === null || reactionIds.indexOf(answer.closest) !== -1;
      var farthestValid = answer.farthest === null || reactionIds.indexOf(answer.farthest) !== -1;
      var distinct = !answer.closest || !answer.farthest || answer.closest !== answer.farthest;
      return closestValid && farthestValid && distinct;
    });

    var validTensions = Object.keys(candidate.tensions).every(function (id) {
      return (
        Boolean(itemById(instrument.tensions, id)) &&
        scoring.isTensionValue(candidate.tensions[id])
      );
    });

    return validScenarios && validTensions;
  }

  function maximumPage(screen) {
    return {
      intro: 0,
      scenarios: SCENARIO_COUNT - 1,
      tensions: TENSION_PAGES - 1,
      result: 0
    }[screen];
  }

  function validState(candidate) {
    if (
      !isMap(candidate) ||
      candidate.schemaVersion !== storage.schemaVersion ||
      candidate.instrumentVersion !== instrument.version ||
      SCREENS.indexOf(candidate.screen) === -1 ||
      typeof candidate.name !== "string" ||
      typeof candidate.persist !== "boolean" ||
      typeof candidate.autoAdvance !== "boolean" ||
      !validOrder(candidate.order) ||
      !validAnswers(candidate.answers)
    ) {
      return false;
    }
    if (
      candidate.screen === "result" &&
      !scoring.validateCompleteness(instrument, candidate.answers).complete
    ) {
      return false;
    }
    return (
      Number.isInteger(candidate.page) &&
      candidate.page >= 0 &&
      candidate.page <= maximumPage(candidate.screen)
    );
  }

  var restored = storage.load();
  var state = validState(restored) ? restored : initialState();

  function saveState() {
    storage.save(state, state.persist);
  }

  /* ---------- utilidades de DOM ---------- */

  function element(tag, className, text) {
    var node = document.createElement(tag);
    if (className) {
      node.className = className;
    }
    if (typeof text === "string") {
      node.textContent = text;
    }
    return node;
  }

  function button(label, className, handler) {
    var node = element("button", className, label);
    node.type = "button";
    node.addEventListener("click", handler);
    return node;
  }

  function announce(message) {
    liveRegion.textContent = "";
    root.setTimeout(function () {
      liveRegion.textContent = message;
    }, 20);
  }

  function reducedMotion() {
    return Boolean(root.matchMedia && root.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }

  function clearApp() {
    while (app.firstChild) {
      app.removeChild(app.firstChild);
    }
  }

  function focusHeading() {
    root.requestAnimationFrame(function () {
      var target = app.querySelector("[data-focus-target]") || app.querySelector("h1, h2");
      if (target) {
        target.setAttribute("tabindex", "-1");
        target.focus({ preventScroll: true });
      } else {
        app.focus({ preventScroll: true });
      }
      root.scrollTo({ top: 0, behavior: reducedMotion() ? "auto" : "smooth" });
    });
  }

  function padTwo(number) {
    return String(number).padStart(2, "0");
  }

  function profileById(id) {
    return itemById(profiles, id);
  }

  function showError(container, message) {
    var existing = container.querySelector(".error-note");
    if (existing) {
      existing.remove();
    }
    var error = element("p", "error-note", message);
    error.setAttribute("role", "alert");
    error.setAttribute("tabindex", "-1");
    var actions = container.querySelector(".actions");
    container.insertBefore(error, actions || null);
    error.focus();
  }

  /* ---------- progresso ---------- */

  function answeredScenarios() {
    return instrument.scenarios.filter(function (item) {
      return scoring.isScenarioAnswerComplete(item, state.answers.scenarios[item.id]);
    }).length;
  }

  function answeredTensions() {
    return instrument.tensions.filter(function (item) {
      return scoring.isTensionValue(state.answers.tensions[item.id]);
    }).length;
  }

  function hasProgress() {
    return (
      state.screen !== "intro" ||
      answeredScenarios() > 0 ||
      answeredTensions() > 0 ||
      Boolean(state.name.trim()) ||
      state.persist
    );
  }

  function updateProgress() {
    var active = state.screen === "scenarios" || state.screen === "tensions";
    var answered = answeredScenarios() + answeredTensions();
    var percent = state.screen === "result" ? 100 : Math.round(100 * answered / TOTAL_ITEMS);

    progressRule.hidden = state.screen === "intro";
    progressRule.setAttribute("aria-valuenow", String(percent));
    progressRule.setAttribute("aria-valuetext", percent + "% respondido");
    progressFill.style.width = percent + "%";
    progressRule.classList.toggle("is-active", active);
  }

  /* ---------- navegação ---------- */

  function cancelAutoAdvance() {
    if (autoAdvanceTimer !== null) {
      root.clearTimeout(autoAdvanceTimer);
      autoAdvanceTimer = null;
    }
  }

  function go(screen, page) {
    cancelAutoAdvance();
    state.screen = screen;
    state.page = typeof page === "number" ? page : 0;
    saveState();
    render();
  }

  function screenSection(className) {
    var section = element("section", "screen " + className);
    if (!reducedMotion()) {
      section.classList.add("is-entering");
    }
    return section;
  }

  function actionsRow(backHandler, nextLabel, nextHandler, nextDisabled) {
    var row = element("div", "actions");
    if (backHandler) {
      row.appendChild(button("Voltar", "button button-quiet", backHandler));
    } else {
      row.appendChild(element("span"));
    }
    var next = button(nextLabel, "button button-ink", nextHandler);
    if (nextDisabled) {
      next.setAttribute("aria-disabled", "true");
    }
    row.appendChild(next);
    return row;
  }

  /* ---------- capa ---------- */

  function renderIntro() {
    var section = screenSection("screen-intro");

    section.appendChild(element("p", "eyebrow", "Questionário · cerca de 25 minutos"));
    section.appendChild(
      element("h1", "display", "Quais ideias do Iluminismo se parecem com as suas?")
    );
    section.appendChild(element("hr", "rule"));
    section.appendChild(
      element(
        "p",
        "lead drop-cap",
        "Você vai ler " + SCENARIO_COUNT + " situações curtas do dia a dia de uma cidade e, em cada uma, marcar a reação mais próxima da sua e a mais distante. Depois, oito escolhas rápidas entre duas posições. Ao final, os três perfis históricos com maior índice de compatibilidade com suas respostas — sem respostas certas e sem envio de dados."
      )
    );

    var form = element("form", "intro-form");
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      start();
    });

    var field = element("div", "field-inline");
    var label = element("label", "", "Seu nome ou apelido");
    label.htmlFor = "participant-name";
    var input = document.createElement("input");
    input.type = "text";
    input.id = "participant-name";
    input.maxLength = 60;
    input.autocomplete = "nickname";
    input.placeholder = "opcional";
    input.value = state.name;
    input.addEventListener("input", function () {
      state.name = input.value;
      saveState();
    });
    field.appendChild(label);
    field.appendChild(input);
    form.appendChild(field);

    var submit = element("button", "button button-ink", "Começar");
    submit.type = "submit";
    form.appendChild(submit);
    section.appendChild(form);

    var options = element("p", "fine-print");
    var persistToggle = element("button", "link-button");
    persistToggle.type = "button";
    persistToggle.setAttribute("aria-pressed", String(state.persist));
    function refreshPersistToggle() {
      persistToggle.textContent = state.persist
        ? "Progresso será lembrado neste aparelho por 24 horas"
        : "Lembrar meu progresso neste aparelho";
      persistToggle.setAttribute("aria-pressed", String(state.persist));
    }
    refreshPersistToggle();
    if (!storage.isAvailable()) {
      persistToggle.disabled = true;
      persistToggle.textContent = "Este navegador não permite lembrar o progresso";
    }
    persistToggle.addEventListener("click", function () {
      state.persist = !state.persist;
      saveState();
      refreshPersistToggle();
      announce(state.persist ? "O progresso será lembrado neste aparelho." : "O progresso não será lembrado.");
    });
    options.appendChild(persistToggle);
    section.appendChild(options);

    var resume = answeredScenarios() + answeredTensions();
    if (resume > 0) {
      section.appendChild(
        element("p", "fine-print", "Você já respondeu " + resume + " de " + TOTAL_ITEMS + " itens. Começar continua de onde parou.")
      );
    }

    app.appendChild(section);

    function start() {
      var firstPending = state.order.scenarios.findIndex(function (id) {
        return !scoring.isScenarioAnswerComplete(itemById(instrument.scenarios, id), state.answers.scenarios[id]);
      });
      if (firstPending !== -1) {
        go("scenarios", firstPending);
      } else if (answeredTensions() < instrument.tensions.length) {
        go("tensions", 0);
      } else {
        go("result", 0);
      }
    }
  }

  /* ---------- cenários ---------- */

  function currentScenario() {
    return itemById(instrument.scenarios, state.order.scenarios[state.page]);
  }

  function scenarioAnswer(item) {
    var answer = state.answers.scenarios[item.id];
    if (!isMap(answer)) {
      answer = { closest: null, farthest: null };
      state.answers.scenarios[item.id] = answer;
    }
    return answer;
  }

  function reactionLabel(item, reactionId) {
    return itemById(item.reactions, reactionId).text;
  }

  function markReaction(item, reactionId, kind) {
    var answer = scenarioAnswer(item);
    var other = kind === "closest" ? "farthest" : "closest";

    if (answer[kind] === reactionId) {
      answer[kind] = null;
      announce("Marcação removida.");
    } else {
      if (answer[other] === reactionId) {
        answer[other] = null;
      }
      answer[kind] = reactionId;
      announce(
        (kind === "closest" ? "Mais próxima: " : "Mais distante: ") + reactionLabel(item, reactionId)
      );
    }
    saveState();
    updateProgress();
  }

  // Primeiro toque marca "mais próxima"; segundo toque em outra marca "mais distante";
  // toque em uma reação já marcada desfaz; com ambas marcadas, o toque substitui a "mais distante".
  function tapReaction(item, reactionId) {
    var answer = scenarioAnswer(item);
    if (answer.closest === reactionId) {
      markReaction(item, reactionId, "closest");
    } else if (answer.farthest === reactionId) {
      markReaction(item, reactionId, "farthest");
    } else if (!answer.closest) {
      markReaction(item, reactionId, "closest");
    } else {
      markReaction(item, reactionId, "farthest");
    }
  }

  function nextFromScenario(section, item) {
    cancelAutoAdvance();
    if (!scoring.isScenarioAnswerComplete(item, state.answers.scenarios[item.id])) {
      showError(section, "Marque uma reação como mais próxima e outra como mais distante.");
      return;
    }
    if (state.page === SCENARIO_COUNT - 1) {
      go("tensions", 0);
    } else {
      go("scenarios", state.page + 1);
    }
  }

  function renderScenario() {
    var item = currentScenario();
    var answer = scenarioAnswer(item);
    var section = screenSection("screen-scenario");

    var counter = element("p", "counter");
    counter.setAttribute("aria-label", "Situação " + (state.page + 1) + " de " + SCENARIO_COUNT);
    counter.appendChild(element("span", "counter-current", padTwo(state.page + 1)));
    counter.appendChild(element("span", "counter-total", " / " + SCENARIO_COUNT));
    section.appendChild(counter);

    var situation = element("h1", "situation drop-cap", item.situation);
    situation.setAttribute("data-focus-target", "");
    section.appendChild(situation);
    section.appendChild(element("hr", "rule"));

    var instruction = element(
      "p",
      "instruction",
      "Marque a reação mais próxima da sua e, depois, a mais distante."
    );
    instruction.id = "instruction-" + item.id;
    section.appendChild(instruction);

    var list = element("div", "reactions");
    list.setAttribute("role", "group");
    list.setAttribute("aria-labelledby", instruction.id);

    var cards = {};

    function refreshCards() {
      Object.keys(cards).forEach(function (reactionId) {
        var card = cards[reactionId];
        var isClosest = answer.closest === reactionId;
        var isFarthest = answer.farthest === reactionId;
        card.root.classList.toggle("is-closest", isClosest);
        card.root.classList.toggle("is-farthest", isFarthest);
        card.tag.textContent = isClosest ? "Mais próxima" : isFarthest ? "Mais distante" : "";
        card.closestButton.setAttribute("aria-pressed", String(isClosest));
        card.farthestButton.setAttribute("aria-pressed", String(isFarthest));
        card.main.setAttribute(
          "aria-label",
          card.text + (isClosest ? ". Marcada como mais próxima." : isFarthest ? ". Marcada como mais distante." : "")
        );
      });
      var complete = scoring.isScenarioAnswerComplete(item, answer);
      section.classList.toggle("is-complete", complete);
      var existing = section.querySelector(".error-note");
      if (complete && existing) {
        existing.remove();
      }
      if (complete && state.autoAdvance) {
        cancelAutoAdvance();
        autoAdvanceTimer = root.setTimeout(function () {
          autoAdvanceTimer = null;
          nextFromScenario(section, item);
        }, reducedMotion() ? 150 : AUTO_ADVANCE_DELAY);
      } else {
        cancelAutoAdvance();
      }
    }

    state.order.reactions[item.id].forEach(function (reactionId) {
      var reaction = itemById(item.reactions, reactionId);
      var card = element("div", "reaction");

      var main = element("button", "reaction-main");
      main.type = "button";
      main.appendChild(element("span", "reaction-text", reaction.text));
      var tag = element("span", "reaction-tag");
      tag.setAttribute("aria-hidden", "true");
      main.appendChild(tag);
      main.addEventListener("click", function () {
        tapReaction(item, reactionId);
        refreshCards();
      });

      var controls = element("div", "reaction-controls");
      var closestButton = button("mais próxima", "chip", function () {
        markReaction(item, reactionId, "closest");
        refreshCards();
      });
      var farthestButton = button("mais distante", "chip", function () {
        markReaction(item, reactionId, "farthest");
        refreshCards();
      });
      closestButton.setAttribute("aria-label", "Marcar como mais próxima: " + reaction.text);
      farthestButton.setAttribute("aria-label", "Marcar como mais distante: " + reaction.text);
      controls.appendChild(closestButton);
      controls.appendChild(farthestButton);

      card.appendChild(main);
      card.appendChild(controls);
      list.appendChild(card);

      cards[reactionId] = {
        root: card,
        main: main,
        tag: tag,
        text: reaction.text,
        closestButton: closestButton,
        farthestButton: farthestButton
      };
    });

    section.appendChild(list);

    var settings = element("p", "fine-print");
    var autoToggle = element("button", "link-button");
    autoToggle.type = "button";
    function refreshAutoToggle() {
      autoToggle.textContent = state.autoAdvance
        ? "Avanço automático ligado"
        : "Avanço automático desligado";
      autoToggle.setAttribute("aria-pressed", String(state.autoAdvance));
    }
    refreshAutoToggle();
    autoToggle.addEventListener("click", function () {
      state.autoAdvance = !state.autoAdvance;
      saveState();
      refreshAutoToggle();
      cancelAutoAdvance();
      announce(state.autoAdvance ? "Avanço automático ligado." : "Avanço automático desligado.");
    });
    settings.appendChild(autoToggle);
    section.appendChild(settings);

    section.appendChild(
      actionsRow(
        function () {
          if (state.page === 0) {
            go("intro", 0);
          } else {
            go("scenarios", state.page - 1);
          }
        },
        state.page === SCENARIO_COUNT - 1 ? "Ir para a última parte" : "Continuar",
        function () {
          nextFromScenario(section, item);
        }
      )
    );

    app.appendChild(section);

    // Estado visual inicial sem disparar o avanço automático ao voltar a uma tela já respondida.
    var wasAutoAdvance = state.autoAdvance;
    state.autoAdvance = false;
    refreshCards();
    state.autoAdvance = wasAutoAdvance;
  }

  /* ---------- tensões ---------- */

  function tensionPageItems() {
    return state.order.tensions
      .slice(state.page * TENSIONS_PER_PAGE, state.page * TENSIONS_PER_PAGE + TENSIONS_PER_PAGE)
      .map(function (id) {
        return itemById(instrument.tensions, id);
      });
  }

  function renderTensions() {
    var pageItems = tensionPageItems();
    var section = screenSection("screen-tensions");

    var counter = element("p", "counter counter-small");
    counter.appendChild(element("span", "counter-current", "Última parte"));
    counter.appendChild(element("span", "counter-total", " · " + (state.page + 1) + " / " + TENSION_PAGES));
    section.appendChild(counter);

    var title = element("h1", "display display-small", "Entre duas posições, para qual lado você pende?");
    title.setAttribute("data-focus-target", "");
    section.appendChild(title);
    section.appendChild(element("hr", "rule"));

    pageItems.forEach(function (item, itemIndex) {
      var number = state.page * TENSIONS_PER_PAGE + itemIndex + 1;
      var fieldset = element("fieldset", "tension");
      fieldset.appendChild(element("legend", "sr-only", "Tensão " + number + " de " + instrument.tensions.length));

      var poles = element("div", "poles");
      var left = element("div", "pole");
      left.appendChild(element("span", "pole-number", "1"));
      left.appendChild(element("p", "pole-text", item.left.text));
      var right = element("div", "pole");
      right.appendChild(element("span", "pole-number", "2"));
      right.appendChild(element("p", "pole-text", item.right.text));
      poles.appendChild(left);
      poles.appendChild(right);
      fieldset.appendChild(poles);

      var scale = element("div", "tension-scale");
      TENSION_LABELS.forEach(function (option) {
        var label = element("label", "scale-option");
        var input = document.createElement("input");
        input.type = "radio";
        input.name = item.id;
        input.value = String(option.value);
        input.checked = state.answers.tensions[item.id] === option.value;
        input.addEventListener("change", function () {
          state.answers.tensions[item.id] = option.value;
          saveState();
          updateProgress();
          var existing = section.querySelector(".error-note");
          if (existing && pageComplete()) {
            existing.remove();
          }
        });
        label.appendChild(input);
        label.appendChild(element("span", "scale-mark"));
        label.appendChild(element("span", "scale-text", option.label));
        scale.appendChild(label);
      });
      fieldset.appendChild(scale);
      section.appendChild(fieldset);
    });

    function pageComplete() {
      return pageItems.every(function (item) {
        return scoring.isTensionValue(state.answers.tensions[item.id]);
      });
    }

    section.appendChild(
      actionsRow(
        function () {
          if (state.page === 0) {
            go("scenarios", SCENARIO_COUNT - 1);
          } else {
            go("tensions", state.page - 1);
          }
        },
        state.page === TENSION_PAGES - 1 ? "Ver meu resultado" : "Continuar",
        function () {
          if (!pageComplete()) {
            showError(section, "Escolha uma posição em cada uma das duas tensões.");
            return;
          }
          if (state.page === TENSION_PAGES - 1) {
            var completeness = scoring.validateCompleteness(instrument, state.answers);
            if (!completeness.complete) {
              var firstMissing = completeness.missing[0];
              var scenarioIndex = state.order.scenarios.indexOf(firstMissing);
              showError(section, "Ainda há uma situação sem resposta. Use Voltar para revisá-la.");
              if (scenarioIndex !== -1) {
                go("scenarios", scenarioIndex);
              }
              return;
            }
            go("result", 0);
          } else {
            go("tensions", state.page + 1);
          }
        }
      )
    );

    app.appendChild(section);
  }

  /* ---------- resultado ---------- */

  function ofPhrase(essence) {
    if (essence.indexOf("a ") === 0) {
      return "da " + essence.slice(2);
    }
    if (essence.indexOf("o ") === 0) {
      return "do " + essence.slice(2);
    }
    return "de " + essence;
  }

  function synthesisSentence(topThree) {
    var first = profileById(topThree[0].id);
    var second = profileById(topThree[1].id);
    var third = profileById(topThree[2].id);
    return (
      "Você combina " + first.essence + " com " + second.essence + ", com traços " + ofPhrase(third.essence) + "."
    );
  }

  function footnoteSentence(result) {
    var topIds = result.topThree.map(function (entry) {
      return entry.id;
    });
    var tie = result.tieGroups.find(function (group) {
      return group.some(function (id) {
        return topIds.indexOf(id) !== -1;
      });
    });
    if (tie) {
      var tied = tie.map(function (id) {
        return profileById(id).shortName;
      });
      return (
        tied.slice(0, -1).join(", ") + " e " + tied[tied.length - 1] +
        " obtiveram exatamente o mesmo índice; a ordem entre eles é apenas alfabética."
      );
    }
    if (result.closePairs.length > 0) {
      var names = [];
      result.closePairs.forEach(function (pair) {
        pair.forEach(function (id) {
          var shortName = profileById(id).shortName;
          if (names.indexOf(shortName) === -1) {
            names.push(shortName);
          }
        });
      });
      return (
        "Os índices de " + names.slice(0, -1).join(", ") + " e " + names[names.length - 1] +
        " ficaram a menos de " + scoring.CLOSE_THRESHOLD + " pontos; a ordem entre eles é um empate técnico."
      );
    }
    if (result.stability.sensitive) {
      return "Um dos três perfis só entra no grupo pela soma das duas partes do questionário; as descrições dizem mais do que a ordem.";
    }
    return "";
  }

  function renderBars(topThree) {
    var list = element("ol", "bars");
    list.setAttribute("aria-label", "Índices de compatibilidade dos três perfis mais próximos");
    topThree.forEach(function (entry) {
      var profile = profileById(entry.id);
      var row = element("li", "bar-row");
      row.appendChild(element("span", "bar-name", profile.name));
      var track = element("span", "bar-track");
      track.setAttribute("aria-hidden", "true");
      var fill = element("span", "bar-fill");
      fill.style.width = Math.min(100, Math.max(0, entry.score)) + "%";
      track.appendChild(fill);
      row.appendChild(track);
      row.appendChild(element("span", "bar-score", Math.round(entry.score) + "/100"));
      list.appendChild(row);
    });
    return list;
  }

  function renderProfileCard(entry, index) {
    var profile = profileById(entry.id);
    var card = element("details", "profile-card");
    if (index === 0) {
      card.open = true;
    }
    var summary = element("summary", "profile-summary");
    summary.appendChild(element("span", "profile-rank", (index + 1) + "º"));
    var heading = element("span", "profile-heading");
    heading.appendChild(element("span", "profile-name", profile.name));
    heading.appendChild(element("span", "profile-synthesis", profile.synthesis));
    summary.appendChild(heading);
    summary.appendChild(element("span", "profile-score", Math.round(entry.score) + "/100"));
    summary.appendChild(element("span", "profile-toggle", index === 0 ? "" : "ver mais"));
    card.appendChild(summary);

    var body = element("div", "profile-body");
    body.appendChild(element("p", "profile-period", profile.period));
    body.appendChild(element("p", "", profile.description));
    var ideas = element("ul", "idea-list");
    profile.ideas.forEach(function (idea) {
      ideas.appendChild(element("li", "", idea));
    });
    body.appendChild(ideas);
    card.appendChild(body);
    return card;
  }

  function renderResult() {
    var result = scoring.score(instrument, state.answers, profiles);
    var section = screenSection("screen-result");
    var name = state.name.trim();

    section.appendChild(element("p", "eyebrow", "Resultado"));
    var title = element("h1", "display", name ? name + ", este é o seu resultado" : "Seu resultado");
    title.setAttribute("data-focus-target", "");
    section.appendChild(title);
    section.appendChild(element("hr", "rule"));
    section.appendChild(element("p", "lead drop-cap", synthesisSentence(result.topThree)));

    section.appendChild(renderBars(result.topThree));

    var cards = element("div", "profile-cards");
    result.topThree.forEach(function (entry, index) {
      cards.appendChild(renderProfileCard(entry, index));
    });
    section.appendChild(cards);

    var howTo = element("details", "how-to");
    howTo.appendChild(element("summary", "", "Como ler este resultado"));
    howTo.appendChild(
      element(
        "p",
        "",
        "O índice de 0 a 100 compara suas respostas com o padrão de cada perfil dentro deste questionário. Não é percentual de identidade nem probabilidade, e um índice baixo não significa rejeição. Os dez perfis se sobrepõem e pertencem a níveis diferentes: há tradições regionais, correntes filosóficas, uma doutrina econômica e uma prática de governo."
      )
    );
    howTo.appendChild(
      element(
        "p",
        "",
        "As situações valem 80% do índice e as oito tensões finais, 20%. Marcar uma reação como mais próxima aproxima você do perfil dela; marcar como mais distante afasta."
      )
    );
    section.appendChild(howTo);

    var resultActions = element("div", "actions actions-result");
    resultActions.appendChild(
      button("Imprimir", "button button-quiet", function () {
        root.print();
      })
    );
    resultActions.appendChild(
      button("Refazer", "button button-ink", function () {
        if (root.confirm("Apagar as respostas e começar de novo?")) {
          storage.clear();
          state = initialState();
          render();
          announce("Respostas apagadas.");
        }
      })
    );
    section.appendChild(resultActions);

    var footnote = footnoteSentence(result);
    if (footnote) {
      section.appendChild(element("p", "footnote", footnote));
    }

    app.appendChild(section);
  }

  /* ---------- render ---------- */

  function render() {
    clearApp();
    updateProgress();

    if (state.screen === "intro") {
      renderIntro();
    } else if (state.screen === "scenarios") {
      renderScenario();
    } else if (state.screen === "tensions") {
      renderTensions();
    } else {
      renderResult();
    }

    document.body.setAttribute("data-screen", state.screen);
    document.title =
      state.screen === "result"
        ? "Seu resultado · Afinidades com o Iluminismo"
        : "Afinidades com o Iluminismo";
    focusHeading();
  }

  // Na impressão, os cartões recolhidos do resultado precisam estar abertos.
  root.addEventListener("beforeprint", function () {
    app.querySelectorAll("details").forEach(function (details) {
      details.open = true;
    });
  });

  brandReset.addEventListener("click", function (event) {
    event.preventDefault();
    if (hasProgress() && !root.confirm("Voltar à capa e apagar as respostas desta sessão?")) {
      return;
    }
    cancelAutoAdvance();
    storage.clear();
    state = initialState();
    render();
    announce("Sessão reiniciada.");
  });

  render();
})(typeof globalThis !== "undefined" ? globalThis : this);
