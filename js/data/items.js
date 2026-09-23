(function (root, factory) {
  "use strict";

  var instrument = factory();

  if (typeof module === "object" && module.exports) {
    module.exports = instrument;
  }

  root.IdeiasIluministas = root.IdeiasIluministas || {};
  root.IdeiasIluministas.instrument = instrument;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  // Cada cenário tem 4 reações, uma por perfil (+2), com um perfil secundário
  // opcional (+1). O respondente marca a reação mais próxima e a mais distante.
  function scenario(id, theme, situation, reactions) {
    return {
      id: id,
      theme: theme,
      situation: situation,
      reactions: reactions.map(function (reaction, index) {
        return {
          id: String.fromCharCode(97 + index),
          text: reaction[0],
          weights: reaction[1]
        };
      })
    };
  }

  function tension(id, left, right) {
    return {
      id: id,
      left: { profileId: left[0], text: left[1] },
      right: { profileId: right[0], text: right[1] }
    };
  }

  return {
    version: "2.0.0",
    profileIds: [
      "philosophes",
      "scottish",
      "aufklarung",
      "italian",
      "american",
      "iberian",
      "radical",
      "moderate",
      "despotism",
      "physiocracy"
    ],
    blockWeights: {
      scenarios: 0.8,
      tensions: 0.2
    },
    tensionScale: [-2, -1, 0, 1, 2],
    scenarios: [
      scenario(
        "c01",
        "Livro polêmico na biblioteca",
        "A biblioteca do bairro recebeu um livro que ataca duramente a religião mais seguida na cidade. Um grupo de frequentadores pede que ele seja retirado da estante. A direção pergunta sua opinião.",
        [
          ["Manter o livro e organizar uma roda de conversa aberta sobre ele.", { philosophes: 2 }],
          ["Manter o livro: ninguém pode retirar uma publicação porque a maioria se ofendeu.", { american: 2 }],
          ["Manter o livro, mas sem destaque, para não ferir a convivência do bairro.", { moderate: 2 }],
          ["Manter o livro e revisar também o espaço dado ao material religioso.", { radical: 2 }]
        ]
      ),
      scenario(
        "c02",
        "Verba de fomento econômico",
        "A prefeitura recebeu um repasse único para movimentar a economia da cidade. Não há consenso sobre onde aplicar. Você foi chamado a opinar.",
        [
          ["Estradas e crédito para quem produz no campo; é dali que sai a riqueza.", { physiocracy: 2 }],
          ["Uma escola técnica e apoio direto a três setores escolhidos pela prefeitura.", { iberian: 2, despotism: 1 }],
          ["Cortar taxas e burocracia e deixar os negócios decidirem onde crescer.", { scottish: 2 }],
          ["Um fundo administrado em conjunto por comerciantes, moradores e prefeitura.", { italian: 2 }]
        ]
      ),
      scenario(
        "c03",
        "Reforma penal após crime violento",
        "Um crime violento abalou a cidade. A câmara discute mudar as penas com urgência. Há várias propostas na mesa.",
        [
          ["Penas previstas em lei, proporcionais ao dano, iguais para qualquer acusado.", { italian: 2 }],
          ["Antes de mudar penas, ver o que deu resultado em cidades parecidas com a nossa.", { scottish: 2 }],
          ["Reforço ao trabalho de igrejas e comunidades na recuperação de quem errou.", { moderate: 2 }],
          ["Nenhuma mudança apressada: garantias de defesa e julgamento valem em qualquer clima.", { american: 2 }]
        ]
      ),
      scenario(
        "c04",
        "Feriado religioso em escola pública",
        "Uma escola pública sempre fez uma celebração na data religiosa mais tradicional da cidade. Famílias de outras crenças pediram mudança. A direção precisa decidir.",
        [
          ["Manter a celebração e convidar as outras famílias a apresentarem suas tradições.", { moderate: 2 }],
          ["Encerrar celebrações religiosas na escola; a data vira dia comum de aula.", { radical: 2 }],
          ["Manter a celebração como parte da cultura local, com conteúdo revisado pelos professores.", { iberian: 2 }],
          ["Deixar a participação livre e garantir por escrito que ninguém será obrigado.", { american: 2 }]
        ]
      ),
      scenario(
        "c05",
        "Reforma de impostos sem consulta",
        "O prefeito preparou uma reforma dos impostos municipais com uma equipe técnica. Ele quer aprovar em uma semana, sem audiências. Perguntam sua posição.",
        [
          ["Se a equipe fez bem o trabalho, aprovar logo; audiência só atrasa.", { despotism: 2 }],
          ["Nenhum imposto novo sem passar pela câmara e por audiência pública.", { american: 2 }],
          ["Aceitar apenas se simplificar as taxas e deixar de punir quem produz.", { physiocracy: 2 }],
          ["Publicar a proposta inteira e dar prazo para que todos leiam e comentem.", { italian: 2 }]
        ]
      ),
      scenario(
        "c06",
        "Conselho de bairro e secretaria técnica",
        "Uma praça será reformada. A secretaria de obras já tem um projeto pronto. O conselho de moradores quer decidir o desenho em assembleia.",
        [
          ["Executar o projeto da secretaria; quem estudou o assunto é quem deve decidir.", { despotism: 2 }],
          ["Expor o projeto e as alternativas em público e deixar a discussão amadurecer.", { philosophes: 2 }],
          ["A assembleia dos moradores decide; a secretaria executa o que for votado.", { radical: 2 }],
          ["Consultar primeiro os donos dos imóveis ao redor, que arcam com os efeitos.", { physiocracy: 2 }]
        ]
      ),
      scenario(
        "c07",
        "Imprensa critica servidores",
        "Um jornal local publicou uma série de reportagens criticando servidores da prefeitura pelo nome. Parte da câmara quer limitar esse tipo de publicação.",
        [
          ["Nada de limite; criticar quem exerce poder é justamente o papel de um jornal.", { philosophes: 2 }],
          ["Limitar: a crítica constante trava a administração e desanima quem trabalha.", { despotism: 2 }],
          ["Nada de limite, desde que o jornal assine, fundamente e aceite responder pelo que publica.", { aufklarung: 2 }],
          ["Nada de limite; quem se sentir lesado recorre ao tribunal, não à câmara.", { american: 2 }]
        ]
      ),
      scenario(
        "c08",
        "Currículo escolar",
        "A rede municipal vai redesenhar o currículo do ensino fundamental. Há disputa sobre o que deve ter mais espaço.",
        [
          ["Formar pessoas capazes de pensar por conta própria e sustentar as próprias escolhas.", { aufklarung: 2 }],
          ["Ciências, ofícios e técnicas de que a cidade precisa para se desenvolver.", { iberian: 2 }],
          ["Convivência, hábitos e experiência prática; o resto a vida ensina aos poucos.", { scottish: 2 }],
          ["Valores, tradição e conhecimento juntos, para formar caráter e não só cabeça.", { moderate: 2 }]
        ]
      ),
      scenario(
        "c09",
        "Monopólio de uma associação de comerciantes",
        "Uma associação de comerciantes controla quem pode abrir loja no centro da cidade há décadas. Novos comerciantes reclamam. A câmara discute o que fazer.",
        [
          ["Acabar com o controle: qualquer um abre loja onde quiser e o mercado se ajusta.", { physiocracy: 2 }],
          ["Abrir gradualmente, observando o que acontece, sem desmontar de uma vez o que funciona.", { scottish: 2 }],
          ["Regras públicas e iguais para todos, escritas em lei, no lugar de acordos fechados.", { italian: 2 }],
          ["A prefeitura assume o controle e define ela mesma quem entra e quanto cobra.", { despotism: 2 }]
        ]
      ),
      scenario(
        "c10",
        "Juiz diante de lei dura",
        "Uma juíza deve aplicar uma lei que prevê pena pesada para um caso pequeno. A lei é clara. Ela tem alguma margem para decidir.",
        [
          ["Aplicar a lei como está e pedir publicamente que ela seja mudada.", { italian: 2, american: 1 }],
          ["Julgar pelo princípio que valeria para todos os casos iguais, mesmo contrariando a letra.", { aufklarung: 2 }],
          ["Olhar como casos parecidos foram tratados e seguir o que a prática consolidou.", { scottish: 2 }],
          ["Aplicar a pena menor que a consciência permitir; leis servem às pessoas.", { moderate: 2 }]
        ]
      ),
      scenario(
        "c11",
        "Sucessão em empresa familiar",
        "O fundador de uma empresa familiar vai se aposentar. Há filhos, sócios antigos e funcionários de confiança. Ninguém sabe quem deve assumir.",
        [
          ["Seguir o costume da família e ajustar aos poucos, conforme a nova gestão for se provando.", { scottish: 2 }],
          ["Escolher pelo critério que todos aceitariam de antemão, mesmo que desagrade alguém.", { aufklarung: 2 }],
          ["Escrever antes as regras da sucessão e submeter a escolha a um conselho.", { american: 2 }],
          ["Todos que trabalham na empresa votam, com o mesmo peso, quem assume.", { radical: 2 }]
        ]
      ),
      scenario(
        "c12",
        "Templo de uma nova religião",
        "Um grupo religioso recém-chegado quer construir um templo em um bairro tradicional. Vizinhos protestam. A prefeitura pede pareceres.",
        [
          ["Autorizar e aproveitar para debater em público o que a cidade entende por convivência.", { philosophes: 2 }],
          ["Autorizar, com diálogo entre as lideranças religiosas para evitar rupturas no bairro.", { moderate: 2 }],
          ["Autorizar, desde que o grupo siga as normas da cidade e não pregue contra elas.", { iberian: 2 }],
          ["Autorizar por decisão da prefeitura; a paz entre crenças é questão de administração.", { despotism: 2, iberian: 1 }]
        ]
      ),
      scenario(
        "c13",
        "Plebiscito ou comissão de especialistas",
        "A cidade precisa decidir se muda o sistema de transporte. Alguns querem plebiscito; outros, uma comissão de especialistas.",
        [
          ["Plebiscito: quem usa o transporte decide, e a comissão obedece ao resultado.", { radical: 2 }],
          ["Primeiro uma lei fixando como se decide; depois plebiscito ou comissão, conforme ela disser.", { italian: 2 }],
          ["Plebiscito, mas com limites prévios: a comissão define o que pode ser votado.", { american: 2 }],
          ["Primeiro divulgar os estudos em linguagem simples e debater; votar só depois.", { philosophes: 2 }]
        ]
      ),
      scenario(
        "c14",
        "Costume local e regra nacional",
        "Uma lei nacional padroniza o horário do comércio em todo o país. A cidade tem um costume antigo de fechar ao meio-dia. Pedem sua opinião.",
        [
          ["Manter o costume; ele funciona aqui há gerações e ninguém pediu mudança.", { scottish: 2 }],
          ["Cumprir a regra nacional; padronizar evita confusão e faz o país andar junto.", { despotism: 2 }],
          ["Adaptar aos poucos, com campanha explicando por que a mudança ajuda a cidade.", { iberian: 2 }],
          ["A cidade deve poder decidir seu horário; a lei nacional foi longe demais.", { american: 2, scottish: 1 }]
        ]
      ),
      scenario(
        "c15",
        "Fila no hospital",
        "O hospital municipal tem fila para uma cirurgia que não é urgente. Não dá para atender todos este ano. Como ordenar a fila?",
        [
          ["Um critério único escrito e publicado, aplicado igualmente, com direito a recurso.", { italian: 2 }],
          ["A ordem que qualquer pessoa aceitaria se não soubesse sua posição na fila.", { aufklarung: 2 }],
          ["Uma equipe técnica ordena os casos pela gravidade, sem interferência externa.", { despotism: 2 }],
          ["Sorteio entre todos os inscritos; ninguém tem mais direito do que outro.", { radical: 2 }]
        ]
      ),
      scenario(
        "c16",
        "Cooperativa e confiança entre sócios",
        "Uma cooperativa agrícola cresceu e alguns sócios começaram a atrasar entregas. Os fundadores discutem como manter o grupo unido.",
        [
          ["Regras claras de contribuição e um sistema em que quem cumpre é visto cumprindo.", { italian: 2 }],
          ["Conversar caso a caso; a confiança se reconstrói na convivência, não em regulamento.", { scottish: 2 }],
          ["Pagar cada sócio pelo que produz; quem entrega mais ganha mais e o resto se resolve.", { physiocracy: 2 }],
          ["Cada sócio assume por escrito o compromisso e responde por ele diante do grupo.", { aufklarung: 2 }]
        ]
      ),
      scenario(
        "c17",
        "Jovem contra o plano da família",
        "Um jovem de dezenove anos quer abandonar a carreira que a família planejou e seguir outra. Os pais pedem que você converse com ele.",
        [
          ["Ele tem idade para decidir; deve pensar bem e assumir as consequências.", { aufklarung: 2 }],
          ["Aconselhar respeito à família e buscar um acordo que preserve os laços.", { moderate: 2 }],
          ["A família não tem autoridade sobre a vida dele; que siga o próprio caminho.", { radical: 2 }],
          ["Sugerir que experimente por um tempo antes de romper; a prática vai mostrar o rumo.", { scottish: 2 }]
        ]
      ),
      scenario(
        "c18",
        "Museu e objeto sagrado",
        "Um museu exibe um objeto considerado sagrado por uma comunidade religiosa. A comunidade pede a devolução. O museu diz que o objeto é patrimônio de todos.",
        [
          ["Manter em exposição e explicar sua história com a mesma liberdade de qualquer outro objeto.", { philosophes: 2 }],
          ["Devolver; o valor que aquele objeto tem para os fiéis vale mais que a exposição.", { moderate: 2 }],
          ["Manter; nenhum objeto merece tratamento diferente por ser chamado de sagrado.", { radical: 2 }],
          ["Devolver com um acordo que garanta estudo, registro e visitas do museu.", { iberian: 2 }]
        ]
      ),
      scenario(
        "c19",
        "Código de ética em uma empresa",
        "Uma empresa média teve casos de desvio de conduta. A diretoria quer criar um código de ética e discute em que ele deve se apoiar.",
        [
          ["Princípios que qualquer funcionário reconheceria como válidos, mesmo sem ninguém vigiando.", { aufklarung: 2 }],
          ["Poucas regras e muito exemplo dos mais antigos; conduta se aprende observando.", { scottish: 2 }],
          ["Regras escritas com consequências definidas, aplicadas do estagiário ao diretor.", { italian: 2 }],
          ["Valores compartilhados e um espaço para a consciência de cada um, com apoio de mentores.", { moderate: 2 }]
        ]
      ),
      scenario(
        "c20",
        "Lei ambiental e proprietários rurais",
        "Uma nova lei ambiental limita o uso de parte das terras de pequenos e grandes proprietários rurais. Alguns ameaçam deixar de produzir.",
        [
          ["Rever a lei; sem quem produz na terra, não há o que preservar nem o que arrecadar.", { physiocracy: 2 }],
          ["Aplicar, mas com indenização; o direito sobre a terra não pode ser esvaziado sem compensação.", { american: 2 }],
          ["Divulgar os dados sobre o dano ambiental e deixar a opinião pública pressionar.", { philosophes: 2 }],
          ["Manter a lei se ela for igual para todos, com fiscalização prevista e sem exceções.", { italian: 2 }]
        ]
      ),
      scenario(
        "c21",
        "Ciência e religião na sala de aula",
        "Uma escola pública recebeu pedido para tratar a origem do mundo também pela perspectiva religiosa nas aulas de ciências. Os professores estão divididos.",
        [
          ["Não; a aula de ciências é lugar de explicações naturais, e só delas.", { radical: 2 }],
          ["Sim, deixando claro que fé e ciência respondem a perguntas diferentes e podem conviver.", { moderate: 2 }],
          ["Ensinar ciência na aula de ciências e criar espaço separado para o aluno examinar crenças.", { aufklarung: 2 }],
          ["Ensinar ciência com rigor e manter a formação religiosa como disciplina própria da escola.", { iberian: 2 }]
        ]
      ),
      scenario(
        "c22",
        "Copiar a reforma de outro país",
        "A prefeitura quer copiar um modelo de gestão de escolas que deu resultado em outro país. Muitos professores desconfiam.",
        [
          ["Adotar o modelo inteiro e logo; adaptação demais é desculpa para não mudar.", { despotism: 2 }],
          ["Adotar só as partes cujos resultados possam ser medidos aqui, com avaliação anual.", { italian: 2 }],
          ["Adotar com apoio de formação para os professores e metas acompanhadas pela prefeitura.", { iberian: 2 }],
          ["Traduzir e divulgar as pesquisas para todos e debater antes de qualquer decisão.", { philosophes: 2 }]
        ]
      ),
      scenario(
        "c23",
        "Piso salarial municipal",
        "A câmara discute criar um piso salarial municipal acima do nacional. Empregadores dizem que vão demitir; trabalhadores dizem que não dá para viver com menos.",
        [
          ["Não criar; salários se ajustam pela produção, e o piso só desanima quem emprega.", { physiocracy: 2 }],
          ["Criar, com regras públicas e avaliação periódica dos efeitos sobre emprego e renda.", { italian: 2 }],
          ["Criar e ir além: quem vive do trabalho deve ter parte no que a empresa ganha.", { radical: 2 }],
          ["Não criar por decreto; ver o que fizeram cidades parecidas e ajustar pela experiência.", { scottish: 2 }]
        ]
      ),
      scenario(
        "c24",
        "Concurso ou indicação técnica",
        "A prefeitura precisa preencher cargos de direção nas escolas. Há disputa entre fazer concurso e deixar a secretaria indicar pessoas de confiança técnica.",
        [
          ["Concurso com regras públicas; indicação abre espaço para favores que ninguém controla.", { american: 2 }],
          ["Indicação pela secretaria; quem responde pelo resultado precisa escolher a própria equipe.", { despotism: 2 }],
          ["Concurso, seguido de curso de formação obrigatório e acompanhamento da secretaria.", { iberian: 2, despotism: 1 }],
          ["Concurso que avalie também a capacidade de julgar situações, não só o conteúdo decorado.", { aufklarung: 2 }]
        ]
      ),
      scenario(
        "c25",
        "Fim imediato ou transição",
        "Um movimento pede o fim imediato de uma vantagem que um grupo da cidade tem há muito tempo. Outros propõem uma transição de dez anos.",
        [
          ["Fim imediato; um privilégio não fica menos privilégio por ser antigo e conhecido.", { radical: 2 }],
          ["Transição, cuidando para que a mudança não rompa os laços que sustentam a cidade.", { moderate: 2 }],
          ["Acabar com a vantagem, mas sem tocar no que cada um já tem de propriedade.", { physiocracy: 2 }],
          ["Expor a vantagem em público; quando todos entenderem o que ela é, ela cai sozinha.", { philosophes: 2 }]
        ]
      ),
      scenario(
        "c26",
        "Poderes do prefeito na emergência",
        "Uma enchente atingiu a cidade. O prefeito pede poderes para gastar e desapropriar sem passar pela câmara durante seis meses.",
        [
          ["Não; a câmara pode se reunir em regime de urgência e aprovar cada medida.", { american: 2 }],
          ["Sim; em emergência, quem executa precisa decidir sem esperar votação.", { despotism: 2 }],
          ["Sim, por prazo curto, com cada gasto publicado e revisado ao final.", { italian: 2 }],
          ["Sim, desde que a imprensa e os moradores possam acompanhar tudo e cobrar.", { philosophes: 2 }]
        ]
      ),
      scenario(
        "c27",
        "Dívida da prefeitura",
        "A prefeitura acumulou uma dívida que compromete o orçamento. É preciso decidir quem vai arcar com o ajuste.",
        [
          ["Cortar o que não produz e cobrar mais de quem tem terra e patrimônio parados.", { physiocracy: 2 }],
          ["Cortar aos poucos, começando pelo que a experiência mostrar que pesa menos.", { scottish: 2 }],
          ["Nenhum ajuste sem que a câmara aprove cada item e o eleitor saiba quem pagou.", { american: 2 }],
          ["Cortar despesas e investir o que restar em ensino e produção, para a cidade crescer.", { iberian: 2 }]
        ]
      ),
      scenario(
        "c28",
        "Herança e desigualdade",
        "Um vereador propõe um imposto alto sobre grandes heranças para financiar escolas. A proposta dividiu a cidade.",
        [
          ["Aprovar; ninguém nasce com direito a começar a vida muito acima dos outros.", { radical: 2 }],
          ["Rejeitar; patrimônio que passa de geração em geração é o que mantém a produção.", { physiocracy: 2 }],
          ["Aceitar só com limite fixado em lei e sujeito a contestação nos tribunais.", { american: 2 }],
          ["Não aprovar; com o tempo, famílias e fortunas se rearranjam por conta própria.", { scottish: 2 }]
        ]
      )
    ],
    tensions: [
      tension(
        "t01",
        ["iberian", "O progresso vem de escolas, ofícios e ciência aplicada, ao longo de uma geração."],
        ["despotism", "O progresso vem de um governo que concentra as decisões e executa rápido."]
      ),
      tension(
        "t02",
        ["moderate", "A moral se sustenta na fé e nos laços da comunidade."],
        ["aufklarung", "A moral se sustenta em princípios que cada pessoa pode examinar por si."]
      ),
      tension(
        "t03",
        ["philosophes", "Leis e costumes mudam convencendo a opinião pública, sem derrubar tudo."],
        ["radical", "Instituições que sustentam privilégios não se reformam; substituem-se."]
      ),
      tension(
        "t04",
        ["american", "Certos direitos valem mesmo contra a vontade da maioria."],
        ["radical", "A vontade da maioria é a última palavra sobre qualquer regra."]
      ),
      tension(
        "t05",
        ["italian", "Regras escritas que valem inclusive para quem está no governo."],
        ["despotism", "Liberdade para quem governa agir rápido quando sabe o que faz."]
      ),
      tension(
        "t06",
        ["scottish", "A riqueza nasce da troca, do comércio e do trabalho dividido entre muitos."],
        ["physiocracy", "A riqueza nasce da terra e do que se produz nela; o resto só a movimenta."]
      ),
      tension(
        "t07",
        ["italian", "Prosperidade depende de leis, confiança entre as pessoas e instituições que funcionem."],
        ["physiocracy", "Prosperidade depende de deixar a produção e a circulação livres de controles."]
      ),
      tension(
        "t08",
        ["iberian", "O governo pode e deve corrigir práticas religiosas que atrasam o país."],
        ["moderate", "A renovação da religião cabe aos fiéis, não ao governo."]
      )
    ]
  };
});
