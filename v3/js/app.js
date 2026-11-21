(function (root) {
  "use strict";

  var App = root.IdeiasIluministas;
  var instrument = App.instrument;
  var profiles = App.profiles;
  var axes = App.axes;
  var scoring = App.scoring;
  var storage = App.storage;

  if (!instrument || !profiles || !axes || !scoring || !storage) {
    return;
  }

  var app = document.getElementById("app");
  var liveRegion = document.getElementById("live-region");
  var progressRule = document.getElementById("progress-rule");
  var progressFill = document.getElementById("progress-fill");
  var brandReset = document.getElementById("brand-reset");

  var SCREENS = ["intro", "scenarios", "twoStage", "tensions", "result"];
  var TENSIONS_PER_PAGE = 3;
  var SCENARIO_COUNT = instrument.scenarios.length;
  var TWO_STAGE_COUNT = instrument.twoStage.length;
  var TWO_STAGE_PAGES = TWO_STAGE_COUNT * 2;
  var TENSION_PAGES = Math.ceil(instrument.tensions.length / TENSIONS_PER_PAGE);
  var TOTAL_ITEMS = SCENARIO_COUNT + TWO_STAGE_COUNT + instrument.tensions.length;
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

  function secondKey(item) {
    return item.id + "/2";
  }

  function initialState() {
    var reactionOrder = {};
    instrument.scenarios.forEach(function (item) {
      reactionOrder[item.id] = shuffle(ids(item.reactions));
    });
    instrument.twoStage.forEach(function (item) {
      reactionOrder[item.id] = shuffle(ids(item.reactions));
      reactionOrder[secondKey(item)] = shuffle(ids(item.second.reactions));
    });

    return {
      schemaVersion: storage.schemaVersion,
      instrumentVersion: instrument.version,
      screen: "intro",
      page: 0,
      name: "",
      persist: true,
      autoAdvance: true,
      order: {
        scenarios: shuffle(ids(instrument.scenarios)),
        twoStage: shuffle(ids(instrument.twoStage)),
        tensions: shuffle(ids(instrument.tensions)),
        reactions: reactionOrder
      },
      answers: {
        scenarios: {},
        twoStage: {},
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
      !samePermutation(order.twoStage, ids(instrument.twoStage)) ||
      !samePermutation(order.tensions, ids(instrument.tensions)) ||
      !isMap(order.reactions)
    ) {
      return false;
    }
    var scenariosOk = instrument.scenarios.every(function (item) {
      return samePermutation(order.reactions[item.id], ids(item.reactions));
    });
    var twoStageOk = instrument.twoStage.every(function (item) {
      return (
        samePermutation(order.reactions[item.id], ids(item.reactions)) &&
        samePermutation(order.reactions[secondKey(item)], ids(item.second.reactions))
      );
    });
    return scenariosOk && twoStageOk;
  }

  function validPair(reactions, answer) {
    if (!isMap(answer)) {
      return false;
    }
    var reactionIds = ids(reactions);
    var closestValid = answer.closest === null || reactionIds.indexOf(answer.closest) !== -1;
    var farthestValid = answer.farthest === null || reactionIds.indexOf(answer.farthest) !== -1;
    var distinct = !answer.closest || !answer.farthest || answer.closest !== answer.farthest;
    return closestValid && farthestValid && distinct;
  }

  function validAnswers(candidate) {
    if (!isMap(candidate) || !isMap(candidate.scenarios) || !isMap(candidate.twoStage) || !isMap(candidate.tensions)) {
      return false;
    }

    var validScenarios = Object.keys(candidate.scenarios).every(function (id) {
      var item = itemById(instrument.scenarios, id);
      return Boolean(item) && validPair(item.reactions, candidate.scenarios[id]);
    });

    var validTwoStage = Object.keys(candidate.twoStage).every(function (id) {
      var item = itemById(instrument.twoStage, id);
      var answer = candidate.twoStage[id];
      return (
        Boolean(item) &&
        isMap(answer) &&
        validPair(item.reactions, answer.first) &&
        validPair(item.second.reactions, answer.second)
      );
    });

    var validTensions = Object.keys(candidate.tensions).every(function (id) {
      return Boolean(itemById(instrument.tensions, id)) && scoring.isTensionValue(candidate.tensions[id]);
    });

    return validScenarios && validTwoStage && validTensions;
  }

  function maximumPage(screen) {
    return {
      intro: 0,
      scenarios: SCENARIO_COUNT - 1,
      twoStage: TWO_STAGE_PAGES - 1,
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
    if (candidate.screen === "result" && !scoring.validateCompleteness(instrument, candidate.answers).complete) {
      return false;
    }
    return Number.isInteger(candidate.page) && candidate.page >= 0 && candidate.page <= maximumPage(candidate.screen);
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

  var RESET_WARNING =
    "Tem certeza que quer apagar todas as suas respostas e recomeçar o formulário? Não será possível recuperar as respostas se você prosseguir.";

  function confirmReset(onConfirm) {
    if (typeof root.HTMLDialogElement !== "function") {
      if (root.confirm(RESET_WARNING)) {
        onConfirm();
      }
      return;
    }

    var dialog = element("dialog", "confirm-dialog");
    dialog.setAttribute("aria-labelledby", "confirm-dialog-title");
    dialog.setAttribute("aria-describedby", "confirm-dialog-text");

    var body = element("div", "confirm-dialog-body");
    var title = element("h2", "confirm-dialog-title", "Apagar respostas?");
    title.id = "confirm-dialog-title";
    var text = element("p", "", RESET_WARNING);
    text.id = "confirm-dialog-text";

    var actions = element("div", "confirm-dialog-actions");
    var cancel = button("Cancelar", "button button-quiet", function () {
      dialog.close("cancel");
    });
    var proceed = button("Sim, apagar e recomeçar", "button button-ink", function () {
      dialog.close("confirm");
    });
    actions.appendChild(cancel);
    actions.appendChild(proceed);

    body.appendChild(title);
    body.appendChild(text);
    body.appendChild(actions);
    dialog.appendChild(body);

    // Clique no fundo escurecido atinge o próprio <dialog>, fora do corpo.
    dialog.addEventListener("click", function (event) {
      if (event.target === dialog) {
        dialog.close("cancel");
      }
    });
    dialog.addEventListener("close", function () {
      var confirmed = dialog.returnValue === "confirm";
      dialog.remove();
      if (confirmed) {
        onConfirm();
      }
    });

    document.body.appendChild(dialog);
    dialog.showModal();
    cancel.focus();
  }

  function padTwo(number) {
    return String(number).padStart(2, "0");
  }

  function profileById(id) {
    return itemById(profiles, id);
  }

  function axisById(id) {
    return itemById(axes, id);
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

  function answeredTwoStage() {
    return instrument.twoStage.filter(function (item) {
      return scoring.isTwoStageAnswerComplete(item, state.answers.twoStage[item.id]);
    }).length;
  }

  function answeredTensions() {
    return instrument.tensions.filter(function (item) {
      return scoring.isTensionValue(state.answers.tensions[item.id]);
    }).length;
  }

  function answeredTotal() {
    return answeredScenarios() + answeredTwoStage() + answeredTensions();
  }

  function hasProgress() {
    return state.screen !== "intro" || answeredTotal() > 0 || Boolean(state.name.trim());
  }

  function updateProgress() {
    var active = state.screen !== "intro" && state.screen !== "result";
    var percent = state.screen === "result" ? 100 : Math.round(100 * answeredTotal() / TOTAL_ITEMS);

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

  function actionsRow(backHandler, nextLabel, nextHandler) {
    var row = element("div", "actions");
    if (backHandler) {
      row.appendChild(button("Voltar", "button button-quiet", backHandler));
    } else {
      row.appendChild(element("span"));
    }
    row.appendChild(button(nextLabel, "button button-ink", nextHandler));
    return row;
  }

  /* ---------- capa ---------- */

  function renderIntro() {
    var section = screenSection("screen-intro");

    section.appendChild(element("p", "eyebrow", "Questionário · cerca de 25 minutos"));
    section.appendChild(element("h1", "display", "Quais ideias do Iluminismo se parecem com as suas?"));
    section.appendChild(element("hr", "rule"));
    section.appendChild(
      element(
        "p",
        "lead drop-cap",
        "Você vai ler " + (SCENARIO_COUNT + TWO_STAGE_COUNT) + " situações curtas do dia a dia de uma cidade e, em cada uma, marcar a reação mais próxima da sua e a mais distante. Em " + TWO_STAGE_COUNT + " delas, um fato novo aparece e você decide de novo. Depois, " + instrument.tensions.length + " escolhas rápidas entre duas posições. Ao final, sua afinidade com cinco correntes do Iluminismo, medida em nove eixos de pensamento — sem respostas certas e sem envio de dados."
      )
    );
    section.appendChild(
      element("p", "fine-print", "Funciona no navegador do celular e do computador. Não há alternativa obviamente correta: cada reação tem um custo.")
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

    var options = element(
      "p",
      "fine-print",
      storage.isAvailable()
        ? "Seu progresso fica salvo automaticamente neste aparelho por 48 horas."
        : "Este navegador não permite salvar o progresso."
    );
    section.appendChild(options);

    var resume = answeredTotal();
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
        return;
      }
      var firstTwoStage = state.order.twoStage.findIndex(function (id) {
        return !scoring.isTwoStageAnswerComplete(itemById(instrument.twoStage, id), state.answers.twoStage[id]);
      });
      if (firstTwoStage !== -1) {
        go("twoStage", firstTwoStage * 2);
      } else if (answeredTensions() < instrument.tensions.length) {
        go("tensions", 0);
      } else {
        go("result", 0);
      }
    }
  }

  /* ---------- conjuntos de reações (cenários e dois tempos) ---------- */

  function emptyPair() {
    return { closest: null, farthest: null };
  }

  function markReaction(answer, reactions, reactionId, kind) {
    var other = kind === "closest" ? "farthest" : "closest";
    if (answer[kind] === reactionId) {
      answer[kind] = null;
      announce("Marcação removida.");
    } else {
      if (answer[other] === reactionId) {
        answer[other] = null;
      }
      answer[kind] = reactionId;
      announce((kind === "closest" ? "Mais próxima: " : "Mais distante: ") + itemById(reactions, reactionId).text);
    }
    saveState();
    updateProgress();
  }

  // Primeiro toque marca "mais próxima"; segundo toque em outra marca "mais distante";
  // toque em uma reação já marcada desfaz; com ambas marcadas, o toque substitui a "mais distante".
  function tapReaction(answer, reactions, reactionId) {
    if (answer.closest === reactionId) {
      markReaction(answer, reactions, reactionId, "closest");
    } else if (answer.farthest === reactionId) {
      markReaction(answer, reactions, reactionId, "farthest");
    } else if (!answer.closest) {
      markReaction(answer, reactions, reactionId, "closest");
    } else {
      markReaction(answer, reactions, reactionId, "farthest");
    }
  }

  // Lista de cinco reações com marcação de mais próxima / mais distante.
  // `onComplete` é chamado (com atraso) quando as duas marcações existem.
  function renderReactionList(section, reactions, order, answer, instructionId, onComplete) {
    var list = element("div", "reactions");
    list.setAttribute("role", "group");
    list.setAttribute("aria-labelledby", instructionId);
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
      var complete = scoring.isScenarioAnswerComplete({ reactions: reactions }, answer);
      section.classList.toggle("is-complete", complete);
      var existing = section.querySelector(".error-note");
      if (complete && existing) {
        existing.remove();
      }
      cancelAutoAdvance();
      if (complete && state.autoAdvance) {
        autoAdvanceTimer = root.setTimeout(function () {
          autoAdvanceTimer = null;
          onComplete();
        }, reducedMotion() ? 150 : AUTO_ADVANCE_DELAY);
      }
    }

    order.forEach(function (reactionId) {
      var reaction = itemById(reactions, reactionId);
      var card = element("div", "reaction");

      var main = element("button", "reaction-main");
      main.type = "button";
      main.appendChild(element("span", "reaction-text", reaction.text));
      var tag = element("span", "reaction-tag");
      tag.setAttribute("aria-hidden", "true");
      main.appendChild(tag);
      main.addEventListener("click", function () {
        tapReaction(answer, reactions, reactionId);
        refreshCards();
      });

      var controls = element("div", "reaction-controls");
      var closestButton = button("mais próxima", "chip", function () {
        markReaction(answer, reactions, reactionId, "closest");
        refreshCards();
      });
      var farthestButton = button("mais distante", "chip", function () {
        markReaction(answer, reactions, reactionId, "farthest");
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
    return refreshCards;
  }

  function autoAdvanceToggle() {
    var settings = element("p", "fine-print");
    var autoToggle = element("button", "link-button");
    autoToggle.type = "button";
    function refreshAutoToggle() {
      autoToggle.textContent = state.autoAdvance ? "Avanço automático ligado" : "Avanço automático desligado";
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
    return settings;
  }

  // Estado visual inicial sem disparar o avanço automático ao voltar a uma tela já respondida.
  function paintWithoutAdvancing(refreshCards) {
    var wasAutoAdvance = state.autoAdvance;
    state.autoAdvance = false;
    refreshCards();
    state.autoAdvance = wasAutoAdvance;
  }

  /* ---------- cenários fixos ---------- */

  function currentScenario() {
    return itemById(instrument.scenarios, state.order.scenarios[state.page]);
  }

  function scenarioAnswer(item) {
    var answer = state.answers.scenarios[item.id];
    if (!isMap(answer)) {
      answer = emptyPair();
      state.answers.scenarios[item.id] = answer;
    }
    return answer;
  }

  function nextFromScenario(section, item) {
    cancelAutoAdvance();
    if (!scoring.isScenarioAnswerComplete(item, state.answers.scenarios[item.id])) {
      showError(section, "Marque uma reação como mais próxima e outra como mais distante.");
      return;
    }
    if (state.page === SCENARIO_COUNT - 1) {
      go("twoStage", 0);
    } else {
      go("scenarios", state.page + 1);
    }
  }

  function renderScenario() {
    var item = currentScenario();
    var answer = scenarioAnswer(item);
    var section = screenSection("screen-scenario");

    var counter = element("p", "counter");
    counter.setAttribute("aria-label", "Situação " + (state.page + 1) + " de " + (SCENARIO_COUNT + TWO_STAGE_COUNT));
    counter.appendChild(element("span", "counter-current", padTwo(state.page + 1)));
    counter.appendChild(element("span", "counter-total", " / " + (SCENARIO_COUNT + TWO_STAGE_COUNT)));
    section.appendChild(counter);

    var situation = element("h1", "situation drop-cap", item.situation);
    situation.setAttribute("data-focus-target", "");
    section.appendChild(situation);
    section.appendChild(element("hr", "rule"));

    var instruction = element("p", "instruction", "Marque a reação mais próxima da sua e, depois, a mais distante.");
    instruction.id = "instruction-" + item.id;
    section.appendChild(instruction);

    var refreshCards = renderReactionList(section, item.reactions, state.order.reactions[item.id], answer, instruction.id, function () {
      nextFromScenario(section, item);
    });

    section.appendChild(autoAdvanceToggle());
    section.appendChild(
      actionsRow(
        function () {
          if (state.page === 0) {
            go("intro", 0);
          } else {
            go("scenarios", state.page - 1);
          }
        },
        "Continuar",
        function () {
          nextFromScenario(section, item);
        }
      )
    );

    app.appendChild(section);
    paintWithoutAdvancing(refreshCards);
  }

  /* ---------- cenários em dois tempos ---------- */

  function currentTwoStage() {
    return itemById(instrument.twoStage, state.order.twoStage[Math.floor(state.page / 2)]);
  }

  function twoStageAnswer(item) {
    var answer = state.answers.twoStage[item.id];
    if (!isMap(answer) || !isMap(answer.first) || !isMap(answer.second)) {
      answer = { first: emptyPair(), second: emptyPair() };
      state.answers.twoStage[item.id] = answer;
    }
    return answer;
  }

  function nextFromTwoStage(section, item, stage) {
    cancelAutoAdvance();
    var answer = twoStageAnswer(item);
    var reactions = stage === 0 ? item.reactions : item.second.reactions;
    var pair = stage === 0 ? answer.first : answer.second;
    if (!scoring.isScenarioAnswerComplete({ reactions: reactions }, pair)) {
      showError(section, "Marque uma reação como mais próxima e outra como mais distante.");
      return;
    }
    if (state.page === TWO_STAGE_PAGES - 1) {
      go("tensions", 0);
    } else {
      go("twoStage", state.page + 1);
    }
  }

  function renderTwoStage() {
    var item = currentTwoStage();
    var stage = state.page % 2;
    var answer = twoStageAnswer(item);
    var itemNumber = SCENARIO_COUNT + Math.floor(state.page / 2) + 1;
    var section = screenSection("screen-scenario screen-two-stage");

    var counter = element("p", "counter");
    counter.setAttribute(
      "aria-label",
      "Situação " + itemNumber + " de " + (SCENARIO_COUNT + TWO_STAGE_COUNT) + ", parte " + (stage + 1) + " de 2"
    );
    counter.appendChild(element("span", "counter-current", padTwo(itemNumber)));
    counter.appendChild(element("span", "counter-total", " / " + (SCENARIO_COUNT + TWO_STAGE_COUNT) + " · parte " + (stage + 1) + " de 2"));
    section.appendChild(counter);

    if (stage === 0) {
      var situation = element("h1", "situation drop-cap", item.situation);
      situation.setAttribute("data-focus-target", "");
      section.appendChild(situation);
      section.appendChild(element("hr", "rule"));
    } else {
      var recap = element("p", "recap", item.situation);
      section.appendChild(recap);
      var firstChoice = itemById(item.reactions, answer.first.closest);
      if (firstChoice) {
        var chosen = element("p", "recap recap-choice");
        chosen.appendChild(element("span", "recap-label", "Você marcou como mais próxima: "));
        chosen.appendChild(element("span", "", firstChoice.text));
        section.appendChild(chosen);
      }
      var twist = element("div", "twist");
      twist.appendChild(element("p", "twist-label", "Novo fato"));
      var twistText = element("h1", "situation twist-text", item.twist);
      twistText.setAttribute("data-focus-target", "");
      twist.appendChild(twistText);
      section.appendChild(twist);
      section.appendChild(element("hr", "rule"));
    }

    var instruction = element(
      "p",
      "instruction",
      stage === 0
        ? "Marque a reação mais próxima da sua e, depois, a mais distante."
        : "Diante do novo fato, marque de novo a mais próxima e a mais distante."
    );
    instruction.id = "instruction-" + item.id + "-" + stage;
    section.appendChild(instruction);

    var reactions = stage === 0 ? item.reactions : item.second.reactions;
    var order = stage === 0 ? state.order.reactions[item.id] : state.order.reactions[secondKey(item)];
    var pair = stage === 0 ? answer.first : answer.second;

    var refreshCards = renderReactionList(section, reactions, order, pair, instruction.id, function () {
      nextFromTwoStage(section, item, stage);
    });

    section.appendChild(autoAdvanceToggle());
    section.appendChild(
      actionsRow(
        function () {
          if (state.page === 0) {
            go("scenarios", SCENARIO_COUNT - 1);
          } else {
            go("twoStage", state.page - 1);
          }
        },
        state.page === TWO_STAGE_PAGES - 1 ? "Ir para a última parte" : "Continuar",
        function () {
          nextFromTwoStage(section, item, stage);
        }
      )
    );

    app.appendChild(section);
    paintWithoutAdvancing(refreshCards);
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
            go("twoStage", TWO_STAGE_PAGES - 1);
          } else {
            go("tensions", state.page - 1);
          }
        },
        state.page === TENSION_PAGES - 1 ? "Ver meu resultado" : "Continuar",
        function () {
          if (!pageComplete()) {
            showError(section, "Escolha uma posição em cada uma das tensões desta página.");
            return;
          }
          if (state.page !== TENSION_PAGES - 1) {
            go("tensions", state.page + 1);
            return;
          }
          var completeness = scoring.validateCompleteness(instrument, state.answers);
          if (!completeness.complete) {
            var firstMissing = completeness.missing[0];
            var scenarioIndex = state.order.scenarios.indexOf(firstMissing);
            var twoStageIndex = state.order.twoStage.indexOf(firstMissing);
            showError(section, "Ainda há uma situação sem resposta. Use Voltar para revisá-la.");
            if (scenarioIndex !== -1) {
              go("scenarios", scenarioIndex);
            } else if (twoStageIndex !== -1) {
              go("twoStage", twoStageIndex * 2);
            }
            return;
          }
          go("result", 0);
        }
      )
    );

    app.appendChild(section);
  }

  /* ---------- resultado ---------- */

  function formatPercent(value) {
    return Math.round(value) + "";
  }

  function listNames(names) {
    if (names.length <= 1) {
      return names.join("");
    }
    return names.slice(0, -1).join(", ") + " e " + names[names.length - 1];
  }

  function leadSentence(result) {
    var top = profileById(result.top.id);
    var interval = result.intervals[result.top.id];
    var sentence =
      "Sua afinidade maior é com " + top.name + ": índice " + formatPercent(result.top.score) +
      ", entre " + formatPercent(interval.low) + " e " + formatPercent(interval.high) + ".";
    if (result.technicalTie) {
      var second = profileById(result.ranking[1].id);
      sentence += " Os intervalos de " + top.shortName + " e " + second.shortName + " se sobrepõem: é um empate técnico, e as descrições dizem mais do que a ordem.";
    } else {
      sentence += " Você combina " + top.essence + " com " + profileById(result.ranking[1].id).essence + ".";
    }
    return sentence;
  }

  function renderBars(result) {
    var list = element("ol", "bars");
    list.setAttribute("aria-label", "Índices de afinidade dos cinco perfis, com intervalo de 80%");
    result.ranking.forEach(function (entry) {
      var profile = profileById(entry.id);
      var interval = result.intervals[entry.id];
      var row = element("li", "bar-row");
      row.appendChild(element("span", "bar-name", profile.name));
      var track = element("span", "bar-track");
      track.setAttribute("aria-hidden", "true");
      var band = element("span", "bar-band");
      band.style.left = Math.max(0, interval.low) + "%";
      band.style.width = Math.max(0, Math.min(100, interval.high) - Math.max(0, interval.low)) + "%";
      track.appendChild(band);
      var fill = element("span", "bar-fill");
      fill.style.width = Math.min(100, Math.max(0, entry.score)) + "%";
      track.appendChild(fill);
      row.appendChild(track);
      var score = element("span", "bar-score");
      score.appendChild(element("span", "", formatPercent(entry.score)));
      score.appendChild(element("span", "bar-interval", " " + formatPercent(interval.low) + "–" + formatPercent(interval.high)));
      score.setAttribute("aria-label", formatPercent(entry.score) + " de 100, entre " + formatPercent(interval.low) + " e " + formatPercent(interval.high));
      row.appendChild(score);
      list.appendChild(row);
    });
    return list;
  }

  function poleWord(axis, value) {
    return value < 0 ? axis.negative.label : axis.positive.label;
  }

  function strengthWord(value) {
    var size = Math.abs(value);
    if (size < 0.15) {
      return "no meio";
    }
    if (size < 0.4) {
      return "um pouco para";
    }
    if (size < 0.7) {
      return "claramente para";
    }
    return "fortemente para";
  }

  function describePosition(axis, value) {
    var strength = strengthWord(value);
    if (strength === "no meio") {
      return "no meio, entre " + axis.negative.label.toLowerCase() + " e " + axis.positive.label.toLowerCase();
    }
    return strength + " " + poleWord(axis, value).toLowerCase();
  }

  function renderRulers(result) {
    var top = profileById(result.top.id);
    var wrapper = element("section", "rulers");
    wrapper.appendChild(element("h2", "section-title", "Sua posição nos nove eixos"));
    wrapper.appendChild(
      element("p", "section-note", "O ponto cheio é você; o círculo vazio é o perfil " + top.shortName + ". Quanto mais longe do centro, mais marcada a posição.")
    );

    var list = element("ol", "ruler-list");
    instrument.axisIds.forEach(function (axisId) {
      var axis = axisById(axisId);
      var respondent = result.position[axisId];
      var profileValue = result.profilePositions[result.top.id][axisId];
      var row = element("li", "ruler-row");

      row.appendChild(element("p", "ruler-name", axis.name));

      var track = element("div", "ruler-track");
      track.setAttribute("aria-hidden", "true");
      track.appendChild(element("span", "ruler-center"));
      var profileMark = element("span", "ruler-mark ruler-mark-profile");
      profileMark.style.left = (50 + 50 * profileValue) + "%";
      track.appendChild(profileMark);
      var respondentMark = element("span", "ruler-mark ruler-mark-you");
      respondentMark.style.left = (50 + 50 * respondent) + "%";
      track.appendChild(respondentMark);
      row.appendChild(track);

      var poles = element("div", "ruler-poles");
      poles.setAttribute("aria-hidden", "true");
      poles.appendChild(element("span", "ruler-pole", axis.negative.label));
      poles.appendChild(element("span", "ruler-pole ruler-pole-right", axis.positive.label));
      row.appendChild(poles);

      row.appendChild(
        element(
          "p",
          "sr-only",
          axis.name + ": você, " + describePosition(axis, respondent) + "; " + top.shortName + ", " + describePosition(axis, profileValue) + "."
        )
      );
      list.appendChild(row);
    });
    wrapper.appendChild(list);
    return wrapper;
  }

  function renderReadings(result) {
    var top = profileById(result.top.id);
    var wrapper = element("section", "readings");
    wrapper.appendChild(element("h2", "section-title", "Onde você se parece e onde se afasta"));

    var agreements = result.readings.agreements.map(function (row) {
      var axis = axisById(row.axisId);
      return axis.name.toLowerCase() + " (" + poleWord(axis, row.profile).toLowerCase() + ")";
    });
    if (agreements.length > 0) {
      wrapper.appendChild(
        element("p", "", "Você se aproxima de " + top.shortName + " sobretudo em " + listNames(agreements) + ".")
      );
    }

    var divergence = result.readings.divergence;
    if (divergence && divergence.gap >= 0.3) {
      var axis = axisById(divergence.axisId);
      wrapper.appendChild(
        element(
          "p",
          "",
          "A maior distância está em " + axis.name.toLowerCase() + ": você fica " + describePosition(axis, divergence.respondent) +
            ", enquanto " + top.shortName + " fica " + describePosition(axis, divergence.profile) + "."
        )
      );
    } else {
      wrapper.appendChild(element("p", "", "Não há eixo em que você se afaste claramente de " + top.shortName + "."));
    }

    var tension = result.innerTension;
    if (tension) {
      var tensionAxis = axisById(tension.axisId);
      var lean = Math.abs(tension.mean) < 0.3
        ? "sem pender claramente para nenhum lado"
        : "pendendo no conjunto para " + poleWord(tensionAxis, tension.mean).toLowerCase();
      wrapper.appendChild(element("h2", "section-title", "A tensão que você carrega"));
      wrapper.appendChild(
        element(
          "p",
          "",
          "Suas escolhas oscilaram mais em " + tensionAxis.name.toLowerCase() + ": ora " + tensionAxis.negative.label.toLowerCase() +
            ", ora " + tensionAxis.positive.label.toLowerCase() + ", " + lean + ". É o eixo em que a situação concreta pesa mais do que uma regra geral para você."
        )
      );
    }

    var conviction = result.conviction;
    var convictionText = conviction < 0.25
      ? "Suas posições ficaram perto do centro na maioria dos eixos: você tende a decidir caso a caso, e o índice reflete tendências, não convicções."
      : conviction < 0.5
        ? "Suas posições ficaram definidas em vários eixos, sem extremos: o índice reflete inclinações estáveis."
        : "Suas posições ficaram marcadas na maioria dos eixos: o índice reflete convicções firmes.";
    var held = result.heldPositions;
    if (held.total > 0) {
      convictionText +=
        " Nas " + held.total + " situações com fato novo, você manteve a mesma reação em " + held.kept +
        (held.kept === 1 ? " delas" : " delas") + " — isso não entra no índice, mas diz como você reage a informação nova.";
    }
    wrapper.appendChild(element("h2", "section-title", "Convicção"));
    wrapper.appendChild(element("p", "", convictionText));

    return wrapper;
  }

  function renderProfileCard(entry, index, result) {
    var profile = profileById(entry.id);
    var interval = result.intervals[entry.id];
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
    var score = element("span", "profile-score", formatPercent(entry.score));
    score.setAttribute("aria-label", formatPercent(entry.score) + " de 100, entre " + formatPercent(interval.low) + " e " + formatPercent(interval.high));
    summary.appendChild(score);
    summary.appendChild(element("span", "profile-toggle", index === 0 ? "" : "ver mais"));
    card.appendChild(summary);

    var body = element("div", "profile-body");
    body.appendChild(element("p", "profile-period", profile.period + " · " + profile.figures));
    body.appendChild(element("p", "", profile.description));
    var ideas = element("ul", "idea-list");
    profile.ideas.forEach(function (idea) {
      ideas.appendChild(element("li", "", idea));
    });
    body.appendChild(ideas);
    card.appendChild(body);
    return card;
  }

  function exportPayload(result) {
    return {
      instrumentVersion: instrument.version,
      name: state.name.trim() || undefined,
      answers: state.answers,
      scores: instrument.profileIds.reduce(function (map, id) {
        map[id] = Math.round(result.scores[id] * 10) / 10;
        return map;
      }, {}),
      intervals: instrument.profileIds.reduce(function (map, id) {
        map[id] = [Math.round(result.intervals[id].low * 10) / 10, Math.round(result.intervals[id].high * 10) / 10];
        return map;
      }, {}),
      position: instrument.axisIds.reduce(function (map, id) {
        map[id] = Math.round(result.position[id] * 100) / 100;
        return map;
      }, {})
    };
  }

  function copyText(text, onDone) {
    if (root.navigator && root.navigator.clipboard && root.navigator.clipboard.writeText) {
      root.navigator.clipboard.writeText(text).then(
        function () { onDone(true); },
        function () { onDone(false); }
      );
      return;
    }
    var area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    var ok = false;
    try {
      ok = document.execCommand("copy");
    } catch (error) {
      ok = false;
    }
    document.body.removeChild(area);
    onDone(ok);
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
    section.appendChild(element("p", "lead drop-cap", leadSentence(result)));

    section.appendChild(renderBars(result));
    section.appendChild(element("p", "footnote footnote-tight", "A faixa clara atrás de cada barra é o intervalo de 80%: o quanto o índice mudaria se algumas de suas respostas fossem outras. Faixas que se sobrepõem indicam empate técnico."));

    section.appendChild(renderRulers(result));
    section.appendChild(renderReadings(result));

    var cardsTitle = element("h2", "section-title", "Os cinco perfis");
    section.appendChild(cardsTitle);
    var cards = element("div", "profile-cards");
    result.ranking.forEach(function (entry, index) {
      cards.appendChild(renderProfileCard(entry, index, result));
    });
    section.appendChild(cards);

    var howTo = element("details", "how-to");
    howTo.appendChild(element("summary", "", "Como ler este resultado"));
    howTo.appendChild(
      element(
        "p",
        "",
        "Cada reação que você marcou carrega uma posição em dois ou três dos nove eixos. A mais próxima soma essa posição; a mais distante subtrai. As tensões finais pontuam direto no eixo. O resultado é a sua posição nos nove eixos, comparada à posição de cada corrente."
      )
    );
    howTo.appendChild(
      element(
        "p",
        "",
        "O índice de 0 a 100 mede a semelhança de direção entre as suas posições e as de cada perfil: 100 é a mesma direção; 50, nenhuma relação; 0, direção oposta. Não é percentual de identidade nem probabilidade. O intervalo é obtido recalculando o índice muitas vezes com amostras das suas próprias respostas."
      )
    );
    howTo.appendChild(
      element(
        "p",
        "",
        "As cinco correntes se sobrepõem em muitos pontos e são recortes de um movimento maior. Uma afinidade alta significa que, nas situações deste questionário, você tende a decidir como aquele grupo decidia."
      )
    );
    section.appendChild(howTo);

    var resultActions = element("div", "actions actions-result");
    resultActions.appendChild(
      button("Imprimir", "button button-quiet", function () {
        root.print();
      })
    );
    var copyButton = button("Copiar respostas", "button button-quiet", function () {
      copyText(JSON.stringify(exportPayload(result), null, 2), function (ok) {
        copyButton.textContent = ok ? "Copiado" : "Não foi possível copiar";
        announce(ok ? "Respostas copiadas." : "Não foi possível copiar.");
        root.setTimeout(function () {
          copyButton.textContent = "Copiar respostas";
        }, 2500);
      });
    });
    resultActions.appendChild(copyButton);
    resultActions.appendChild(
      button("Refazer", "button button-ink", function () {
        confirmReset(function () {
          storage.clear();
          state = initialState();
          render();
          announce("Respostas apagadas.");
        });
      })
    );
    section.appendChild(resultActions);

    section.appendChild(
      element("p", "footnote", "Copiar respostas gera um texto com suas marcações e índices, útil para discutir o resultado em grupo. Nada é enviado a nenhum servidor.")
    );

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
    } else if (state.screen === "twoStage") {
      renderTwoStage();
    } else if (state.screen === "tensions") {
      renderTensions();
    } else {
      renderResult();
    }

    document.body.setAttribute("data-screen", state.screen);
    document.title = state.screen === "result" ? "Seu resultado · Afinidades com o Iluminismo" : "Afinidades com o Iluminismo";
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
