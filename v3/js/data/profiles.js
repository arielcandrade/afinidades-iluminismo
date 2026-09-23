(function (root, factory) {
  "use strict";

  var profiles = factory();

  if (typeof module === "object" && module.exports) {
    module.exports = profiles;
  }

  root.IdeiasIluministas = root.IdeiasIluministas || {};
  root.IdeiasIluministas.profiles = profiles;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  // `vector`: posição do perfil nos nove eixos de js/data/axes.js, de −2 a +2.
  // Ordem: judgment, religion, direction, pace, lastword, order, scope, moral, publicity.
  // Justificativa célula a célula em docs/modelo-conceitual.md.
  // `synthesis`: frase curta do cartão. `essence`: fragmento nominal para a frase de síntese.
  return [
    {
      id: "philosophes",
      name: "Philosophes e Enciclopedistas",
      shortName: "Philosophes",
      period: "França e redes europeias, sobretudo 1715–1789",
      figures: "Voltaire, Diderot, Montesquieu, Condorcet",
      vector: {
        judgment: 0,
        religion: -1,
        direction: 1,
        pace: 1,
        lastword: -1,
        order: 0,
        scope: 0,
        moral: 1,
        publicity: 2
      },
      synthesis: "Mudar leis e costumes expondo tudo ao exame público e ao debate.",
      essence: "a crítica pública dos philosophes",
      description:
        "Este perfil transforma a razão em crítica pública. Leis, costumes e autoridades devem ser expostos ao exame de todos, e a opinião informada é o motor da mudança. Valoriza a circulação ampla do conhecimento, a tolerância e a redução do poder das igrejas sobre a vida civil, mas raramente propõe romper com tudo: prefere convencer, satirizar e pressionar governantes a derrubá-los. A proximidade sugere gosto por debate aberto, imprensa livre e reforma pela persuasão, com atenção às consequências concretas e desconfiança tanto de dogmas quanto de multidões.",
      ideas: [
        "Razão crítica e opinião pública",
        "Tolerância e liberdade de expressão",
        "Difusão do conhecimento",
        "Reforma pela persuasão"
      ]
    },
    {
      id: "scottish",
      name: "Iluminismo Escocês",
      shortName: "Escocês",
      period: "Escócia, aproximadamente 1730–1800",
      figures: "Hume, Adam Smith, Ferguson, Hutcheson",
      vector: {
        judgment: 2,
        religion: 1,
        direction: 0,
        pace: 2,
        lastword: 0,
        order: 2,
        scope: 2,
        moral: 2,
        publicity: 0
      },
      synthesis: "Confiar na experiência, nos hábitos e no ajuste gradual do que já funciona.",
      essence: "o gradualismo empírico escocês",
      description:
        "Este perfil parte da experiência, não de princípios abstratos. Hábitos, comércio e milhares de decisões individuais produzem ordens que ninguém planejou, e por isso reformas devem observar antes de intervir e ajustar aos poucos. A moral nasce do sentimento e da simpatia, não de um mandamento da razão. Desconfia de projetos que pretendem reconstruir a sociedade de uma vez e de regras iguais para lugares diferentes; prefere testar, comparar e conservar o que provou funcionar. A proximidade indica gradualismo, atenção ao contexto e confiança em processos que ninguém dirige.",
      ideas: [
        "Experiência e natureza humana",
        "Sentimento moral e simpatia",
        "Ordem espontânea",
        "Reforma gradual"
      ]
    },
    {
      id: "aufklarung",
      name: "Aufklärung",
      shortName: "Aufklärung",
      period: "Territórios germânicos, aproximadamente 1720–1800",
      figures: "Kant, Lessing, Wolff, Mendelssohn",
      vector: {
        judgment: -2,
        religion: 1,
        direction: 0,
        pace: 1,
        lastword: -2,
        order: -1,
        scope: -2,
        moral: -2,
        publicity: 1
      },
      synthesis: "Pensar por conta própria e agir por princípios que valeriam para qualquer pessoa.",
      essence: "a autonomia de princípios da Aufklärung",
      description:
        "Este perfil entende o esclarecimento como autonomia intelectual e formação do caráter. Agir bem não é produzir bons resultados nem seguir sentimentos: é adotar princípios que qualquer pessoa razoável poderia aceitar e assumir a responsabilidade pelo que se decide. Há regras que valem em qualquer lugar e mesmo contra a maioria. Educação, dever e coerência ocupam o centro, assim como a liberdade pública de argumentar dentro de instituições estáveis; a religião pode conviver com a razão desde que se submeta a ela. A proximidade sugere valorização de fundamentos, maturidade de julgamento e regras universalizáveis.",
      ideas: [
        "Autonomia da razão",
        "Dever e princípios morais",
        "Educação e formação",
        "Liberdade pública de pensar"
      ]
    },
    {
      id: "radical",
      name: "Iluminismo Radical",
      shortName: "Radical",
      period: "Redes europeias, do fim do século XVII à Revolução Francesa",
      figures: "Espinosa, Bayle, d'Holbach, Paine",
      vector: {
        judgment: -1,
        religion: -2,
        direction: 2,
        pace: -2,
        lastword: 2,
        order: -1,
        scope: -1,
        moral: 1,
        publicity: 1
      },
      synthesis: "Igualdade sem privilégios, decisão pela maioria e explicação natural do mundo.",
      essence: "o igualitarismo radical",
      description:
        "Este perfil leva a crítica racional às últimas consequências: explicações naturais bastam para entender o mundo, a moral não depende de revelação, e hierarquias sociais ou políticas não têm fundamento sagrado. Por isso, reformas parciais parecem insuficientes diante de instituições que preservam privilégios; o que está errado deve acabar, e a vontade de quem vive a situação deve ter a última palavra. A categoria é debatida entre historiadores e reúne autores que divergiam entre si. A proximidade indica afinidade com igualdade, soberania popular e crítica religiosa ampla.",
      ideas: [
        "Naturalismo e crítica religiosa",
        "Igualdade sem privilégios",
        "Soberania popular",
        "Ruptura com o que está errado"
      ]
    },
    {
      id: "despotism",
      name: "Despotismo Esclarecido",
      shortName: "Despotismo Esclarecido",
      period: "Estados europeus, principalmente 1740–1790",
      figures: "Frederico II, Catarina II, José II, Pombal",
      vector: {
        judgment: 0,
        religion: 0,
        direction: -2,
        pace: -1,
        lastword: 0,
        order: -2,
        scope: -1,
        moral: 0,
        publicity: -2
      },
      synthesis: "Reforma decidida por quem sabe e executada de cima, sem esperar consenso.",
      essence: "a reforma centralizada do despotismo esclarecido",
      description:
        "Este perfil confia na reforma racional conduzida por quem tem preparo e responsabilidade. Um poder central forte pode uniformizar leis, impostos e escolas, enfrentar privilégios de corporações e elevar o bem-estar sem esperar que a opinião amadureça; tolerância e mérito aparecem como instrumentos de boa administração, e não como direitos a serem debatidos. O modelo produziu reformas reais e preservou censura e hierarquias. A proximidade indica prioridade à capacidade de executar um plano bem desenhado, aceitando o risco conhecido de pouca consulta e pouca prestação de contas.",
      ideas: [
        "Reforma pelo alto",
        "Plano e execução",
        "Mérito contra privilégio",
        "Tolerância por utilidade pública"
      ]
    }
  ];
});
