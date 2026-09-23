(function (root, factory) {
  "use strict";

  var axes = factory();

  if (typeof module === "object" && module.exports) {
    module.exports = axes;
  }

  root.IdeiasIluministas = root.IdeiasIluministas || {};
  root.IdeiasIluministas.axes = axes;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  // Oito oposições que atravessam as correntes do Iluminismo. Cada eixo vai de −2
  // (polo `negative`) a +2 (polo `positive`). Os perfis são pontos nesse espaço e as
  // reações dos cenários carregam valores em dois ou três eixos.
  // `question` é a pergunta em linguagem cotidiana exibida no resultado.
  return [
    {
      id: "judgment",
      name: "Fonte do juízo",
      question: "Quando decide, você parte de um princípio ou do que a experiência mostrou?",
      negative: { label: "Princípio", description: "decide a partir de regras que valeriam antes de qualquer caso" },
      positive: { label: "Experiência", description: "decide a partir do que costumes e tentativas já mostraram" }
    },
    {
      id: "religion",
      name: "Religião na vida pública",
      question: "A religião deve ficar fora das decisões públicas ou pode ter lugar nelas?",
      negative: { label: "Laicidade", description: "decisões públicas sem apoio em crenças religiosas" },
      positive: { label: "Acomodação", description: "crenças religiosas com lugar reconhecido na vida comum" }
    },
    {
      id: "direction",
      name: "Direção da mudança",
      question: "Mudanças vêm de quem governa ou de quem é governado?",
      negative: { label: "De cima", description: "quem tem responsabilidade e preparo decide e executa" },
      positive: { label: "De baixo", description: "quem vive a situação discute e decide" }
    },
    {
      id: "pace",
      name: "Ritmo da mudança",
      question: "O que está errado deve acabar de uma vez ou mudar aos poucos?",
      negative: { label: "Ruptura", description: "o que está errado acaba agora, mesmo com custo" },
      positive: { label: "Gradualismo", description: "mudanças em etapas, preservando o que ainda funciona" }
    },
    {
      id: "lastword",
      name: "Última palavra",
      question: "Quando a maioria quer uma coisa e um princípio diz outra, quem vence?",
      negative: { label: "Direitos e princípios", description: "há regras que valem mesmo contra a maioria" },
      positive: { label: "Vontade coletiva", description: "a decisão do grupo é a última palavra" }
    },
    {
      id: "order",
      name: "Origem da boa ordem",
      question: "Coisas boas resultam de um plano ou de ajustes que ninguém planejou?",
      negative: { label: "Desenho deliberado", description: "boa ordem vem de um plano pensado por inteiro" },
      positive: { label: "Ordem espontânea", description: "boa ordem vem de ajustes que ninguém desenhou" }
    },
    {
      id: "scope",
      name: "Alcance das regras",
      question: "Uma boa regra vale em qualquer lugar ou depende de cada lugar?",
      negative: { label: "Universal", description: "o que é certo aqui é certo em qualquer lugar" },
      positive: { label: "Local", description: "cada lugar tem história e precisa de regras próprias" }
    },
    {
      id: "moral",
      name: "Motor da moral",
      question: "Agir bem é cumprir um dever ou responder ao que se sente e ao que faz bem?",
      negative: { label: "Dever e razão", description: "agir bem é cumprir o que a razão manda, custe o que custar" },
      positive: { label: "Sentimento e utilidade", description: "agir bem é responder ao que se sente e ao que faz bem" }
    },
    {
      id: "publicity",
      name: "Papel da publicidade",
      question: "Decisões delicadas se resolvem com discrição ou à vista de todos?",
      negative: { label: "Discrição", description: "assuntos delicados se resolvem entre quem tem responsabilidade" },
      positive: { label: "Publicidade", description: "tudo deve ser exposto e debatido abertamente" }
    }
  ];
});
