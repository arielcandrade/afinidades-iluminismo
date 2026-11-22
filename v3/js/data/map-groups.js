(function (root, factory) {
  "use strict";

  var mapGroups = factory();

  if (typeof module === "object" && module.exports) {
    module.exports = mapGroups;
  }

  root.IdeiasIluministas = root.IdeiasIluministas || {};
  root.IdeiasIluministas.mapGroups = mapGroups;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  // Os cinco grupos da versão 2 que ficaram fora do questionário, posicionados nos mesmos
  // nove eixos de js/data/axes.js (−2 a +2) só para a página mapa.html. Não entram na
  // pontuação. Fonte das descrições: docs/modelo-conceitual.md da versão 2, na raiz do repositório.
  return [
    {
      id: "italian",
      name: "Iluminismo Italiano",
      shortName: "Italiano",
      period: "Milão, Nápoles, Toscana e outros estados italianos, aproximadamente 1720–1790",
      figures: "Beccaria, Pietro Verri, Genovesi, Filangieri",
      vector: { judgment: -1, religion: -1, direction: -1, pace: 1, lastword: -1, order: -1, scope: -1, moral: 1, publicity: 1 },
      justification: {
        judgment: "Beccaria deduz as penas de princípios gerais, como a proporcionalidade e a utilidade, e Filangieri quis uma “ciência da legislação” sistemática; a economia de Genovesi, mais empírica, impede a ponta.",
        religion: "Reformadores em geral católicos, alguns padres, mas Beccaria separou o crime do pecado e tirou da Igreja o critério da pena: inclinação à laicidade no direito, sem anticlericalismo militante.",
        direction: "Os reformadores de Milão e Nápoles trabalharam com as monarquias, como a dos Habsburgo na Lombardia e a de Leopoldo na Toscana, e não defenderam a democracia.",
        pace: "Queriam transformar tribunais, impostos, ensino e administração por reformas legais sucessivas, não por revolução.",
        lastword: "A legalidade deve limitar juízes e governantes, e o acusado tem garantias que nenhuma conveniência suspende; não há, porém, uma teoria de direitos contra a maioria.",
        order: "A codificação e a reforma penal são projetos deliberados; a economia civil de Genovesi, que confia na reciprocidade, impede a ponta.",
        scope: "*Dos delitos e das penas* propõe princípios penais válidos em qualquer país e foi lido em toda a Europa; a atenção às condições de cada estado impede a ponta.",
        moral: "A finalidade do governo é a felicidade pública, e Beccaria fala da maior felicidade repartida pelo maior número; a virtude civil de Genovesi modera o utilitarismo.",
        publicity: "As leis devem ser públicas, claras e conhecidas de todos, e o grupo milanês fez do periódico *Il Caffè* um instrumento de reforma; a colaboração com os governos impede a ponta."
      }
    },
    {
      id: "american",
      name: "Iluminismo Americano",
      shortName: "Americano",
      period: "Colônias britânicas e Estados Unidos, aproximadamente 1740–1800",
      figures: "Franklin, Jefferson, Madison, Paine",
      vector: { judgment: 0, religion: -1, direction: 1, pace: 0, lastword: -2, order: -1, scope: -1, moral: 0, publicity: 1 },
      justification: {
        judgment: "A Declaração parte de verdades “evidentes por si mesmas”, mas *O federalista* argumenta com a experiência histórica das confederações e das facções: o grupo combina os dois critérios.",
        religion: "A liberdade religiosa é protegida pela separação entre religião e governo, como no estatuto da Virgínia e na Primeira Emenda, numa sociedade que continuava religiosa.",
        direction: "Governos legítimos derivam do consentimento dos governados, por meio da representação, mas com freios e sem democracia direta.",
        pace: "A independência foi uma ruptura, mas a construção constitucional preservou o direito comum e as instituições coloniais: o grupo fica entre os dois polos.",
        lastword: "Direitos fundamentais antecedem e limitam o poder, e Madison desenhou a Constituição para conter facções majoritárias; a Declaração de Direitos protege o indivíduo contra a maioria.",
        order: "Constituições escritas, separação de poderes e federalismo são arquiteturas deliberadas, ainda que pensadas para aproveitar interesses em conflito em vez de depender da virtude.",
        scope: "A linguagem dos direitos é universal, mas o federalismo deixa a cada estado regras próprias.",
        moral: "Mistura a virtude republicana, o senso moral que Jefferson tomou dos escoceses e o cálculo de interesses de Madison, sem pender para o dever ou para a utilidade.",
        publicity: "Panfletos como *Senso comum*, os artigos de *O federalista* nos jornais e a liberdade de imprensa foram centrais; a própria Convenção de 1787, porém, deliberou em segredo."
      }
    },
    {
      id: "iberian",
      name: "Iluminismo Ibérico e Ibero-americano",
      shortName: "Ibérico",
      period: "Espanha, Portugal e Américas ibéricas, aproximadamente 1720–1820",
      figures: "Feijoo, Verney, Jovellanos, José Bonifácio",
      vector: { judgment: 1, religion: 1, direction: -1, pace: 1, lastword: 0, order: -1, scope: 1, moral: 1, publicity: 0 },
      justification: {
        judgment: "Feijoo e Verney combateram a escolástica em nome da ciência experimental e do saber útil, e Jovellanos baseou suas propostas em inquéritos sobre a agricultura.",
        religion: "A fé deve ser depurada da superstição sem sair da vida pública, e muitos reformadores eram clérigos; a subordinação da Igreja à Coroa impede a ponta.",
        direction: "A reforma vinha sobretudo da Coroa e de seus ministros, mas também das sociedades econômicas de “amigos do país”, que reuniam proprietários e letrados.",
        pace: "A modernização administrativa devia ocorrer sem ruptura imediata da ordem monárquica; nas Américas, o caminho foi da reforma imperial à independência, de forma gradual.",
        lastword: "O grupo não tem uma posição característica sobre direitos contra a maioria; a autoridade final era a da Coroa.",
        order: "O Estado devia fomentar agricultura, manufaturas, comércio e conhecimento técnico, com papel econômico mais ativo que o do Iluminismo Moderado; o *Informe sobre a lei agrária* de Jovellanos, que pede a remoção de obstáculos à livre iniciativa, impede a ponta.",
        scope: "A reforma é pensada como regeneração nacional, ligada à identidade católica de cada reino, e nas colônias as críticas aos monopólios partem das condições locais.",
        moral: "O critério dominante é a utilidade, a felicidade pública e a ciência útil.",
        publicity: "O *Teatro crítico universal* de Feijoo levou a crítica da superstição a um público amplo, mas a censura, a Inquisição e as reformas de gabinete pesavam no sentido contrário."
      }
    },
    {
      id: "moderate",
      name: "Iluminismo Moderado e Religioso",
      shortName: "Moderado",
      period: "Europa e Atlântico, do fim do século XVII ao fim do XVIII",
      figures: "Locke, Newton, Leibniz, Mendelssohn",
      vector: { judgment: 0, religion: 2, direction: 0, pace: 2, lastword: -1, order: 1, scope: -1, moral: -1, publicity: 0 },
      justification: {
        judgment: "Newton e Locke partem da experiência, Leibniz de princípios racionais: a categoria reúne os dois caminhos.",
        religion: "É o traço que define o grupo: razão, ciência e crença numa ordem transcendente são compatíveis, e a religião, mais racional e tolerante, continua presente na vida pública.",
        direction: "A categoria não tem uma posição comum sobre quem conduz a mudança; Locke funda o governo no consentimento, outros confiavam nos príncipes.",
        pace: "Reformas devem preservar a continuidade social e evitar rupturas destrutivas; educação e leis melhoram os costumes aos poucos.",
        lastword: "Os direitos naturais de Locke e os deveres fundados na ordem do mundo valem antes de qualquer decisão coletiva.",
        order: "A ordem do mundo, regida por leis que Newton descreveu e que Leibniz via como a melhor possível, já existe sem ter sido desenhada por homens e serve de fundamento para os deveres.",
        scope: "A religião natural e o direito natural valem para toda a humanidade.",
        moral: "Os deveres se apoiam na religião natural e na providência mais do que no sentimento ou no cálculo de consequências.",
        publicity: "Defendiam a tolerância e a discussão, como na *Carta sobre a tolerância* de Locke, mas não fizeram da exposição pública um método de reforma."
      }
    },
    {
      id: "physiocracy",
      name: "Fisiocracia e Economia Política",
      shortName: "Fisiocracia",
      period: "França e redes europeias, aproximadamente 1750–1780",
      figures: "Quesnay, Turgot, Mirabeau, Dupont de Nemours",
      vector: { judgment: -1, religion: 0, direction: -2, pace: -1, lastword: -1, order: 2, scope: -2, moral: 1, publicity: 1 },
      justification: {
        judgment: "Os fisiocratas deduziram de poucos princípios uma “ordem natural e essencial” das sociedades e a representaram num modelo, o *Quadro econômico*; Smith criticou justamente esse espírito de sistema.",
        religion: "A ordem natural tinha fundo providencial, mas a religião não ocupa lugar no programa.",
        direction: "Defenderam um “despotismo legal”: uma autoridade única e forte, esclarecida pela evidência econômica, que impõe a ordem natural; Turgot tentou aplicá-la como ministro.",
        pace: "Propuseram substituir de uma vez o sistema de impostos por um imposto único sobre a terra, e Turgot aboliu de um só golpe corveias e corporações em 1776.",
        lastword: "Propriedade e liberdade econômica decorrem da ordem natural e não dependem de nenhuma decisão coletiva.",
        order: "É o traço que define o grupo: a economia tem regularidades que o governo deve conhecer e respeitar, e a livre produção e circulação coordenam melhor os interesses, como na fórmula “deixai fazer, deixai passar”.",
        scope: "A mesma ordem natural vale para qualquer nação, independentemente da história e dos costumes de cada uma.",
        moral: "O interesse bem compreendido de cada um coincide com o bem geral, e o critério é a prosperidade.",
        publicity: "Divulgaram suas ideias em periódicos e tratados e apostaram na instrução do público e do soberano pela evidência; o apoio a uma autoridade forte impede a ponta."
      }
    }
  ];
});
