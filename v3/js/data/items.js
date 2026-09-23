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

  // Cada cenário toca dois ou três eixos (`axes`) e tem cinco reações, uma por perfil.
  // Cada reação carrega valores nesses eixos, na ordem de `axes`, derivados do vetor
  // do perfil com liberdade de ±1 para que o texto faça sentido na situação.
  // A reação mais próxima soma as cargas; a mais distante subtrai.
  // Eixos: judgment (princípio − / experiência +), religion (laicidade − / acomodação +),
  // direction (de cima − / de baixo +), pace (ruptura − / gradualismo +),
  // lastword (direitos − / vontade coletiva +), order (plano − / espontâneo +),
  // scope (universal − / local +), moral (dever − / sentimento +),
  // publicity (discrição − / publicidade +).

  var PROFILE_ORDER = ["philosophes", "scottish", "aufklarung", "radical", "despotism"];

  function reactions(axes, rows) {
    return rows.map(function (row, index) {
      var charges = {};
      axes.forEach(function (axisId, position) {
        charges[axisId] = row[1][position];
      });
      return {
        id: String.fromCharCode(97 + index),
        profileId: PROFILE_ORDER[index],
        text: row[0],
        charges: charges
      };
    });
  }

  function scenario(id, theme, axes, situation, rows) {
    return {
      id: id,
      theme: theme,
      axes: axes,
      situation: situation,
      reactions: reactions(axes, rows)
    };
  }

  function twoStage(id, theme, axes, situation, rows, twist, secondRows) {
    return {
      id: id,
      theme: theme,
      axes: axes,
      situation: situation,
      reactions: reactions(axes, rows),
      twist: twist,
      second: { reactions: reactions(axes, secondRows) }
    };
  }

  function tension(id, axisId, left, right) {
    return { id: id, axisId: axisId, left: { text: left }, right: { text: right } };
  }

  return {
    version: "3.0.0",
    profileIds: PROFILE_ORDER,
    axisIds: ["judgment", "religion", "direction", "pace", "lastword", "order", "scope", "moral", "publicity"],
    tensionWeight: 2,
    scenarios: [
      scenario(
        "c01",
        "Reforma da praça",
        ["direction", "pace", "order"],
        "A praça central será reformada. A secretaria de obras tem um projeto pronto; o conselho de moradores quer decidir o desenho em assembleia. A verba vence em três meses.",
        [
          ["Expor o projeto e as alternativas em audiências abertas e decidir depois, mesmo que a verba atrase.", [1, 1, 0]],
          ["Fazer só o reparo urgente e ver como as pessoas usam a praça antes de redesenhar qualquer coisa.", [0, 2, 2]],
          ["Definir primeiro o critério que decidirá esta e qualquer outra obra da cidade; a praça espera.", [0, 1, -1]],
          ["A assembleia decide tudo agora e a secretaria executa o que for votado, mesmo sem projeto técnico.", [2, -2, -1]],
          ["Executar já o projeto da secretaria; quem estudou o assunto decide, e o conselho é informado depois.", [-2, -1, -2]]
        ]
      ),
      scenario(
        "c02",
        "Símbolo religioso no tribunal",
        ["religion", "lastword", "scope"],
        "A sala de audiências do fórum da cidade exibe há décadas um símbolo religioso. Um advogado pede a retirada. A maioria dos servidores quer manter.",
        [
          ["Retirar: um tribunal não pode parecer tomar partido de uma crença, ainda que a maioria se ofenda.", [-1, -1, 0]],
          ["Manter: o símbolo faz parte da história daquela casa, e cada cidade resolve isso do seu jeito.", [1, 0, 2]],
          ["Decidir por um princípio que valha em qualquer tribunal do país, e não pelo que esta cidade prefere.", [0, -2, -2]],
          ["Retirar todos os símbolos de fé dos prédios públicos de uma vez; quem decide são os cidadãos, não os juízes.", [-2, 2, -1]],
          ["A administração do tribunal decide sozinha, com discrição, e padroniza a regra para todas as salas.", [0, 0, -1]]
        ]
      ),
      scenario(
        "c03",
        "Promessa a um amigo",
        ["judgment", "moral", "order"],
        "Você prometeu ajudar um amigo a se mudar no sábado. Na sexta, surge um trabalho pago de que você precisa, no mesmo horário. O amigo diz que dá um jeito.",
        [
          ["Conversar com franqueza e decidir junto com ele o que faz menos mal aos dois.", [0, 1, 0]],
          ["Ir ao trabalho: entre amigos, isso se acerta na hora, como sempre se acertou.", [2, 2, 2]],
          ["Cumprir a promessa e perder o trabalho: uma promessa que cede à conveniência não é promessa.", [-2, -2, -1]],
          ["Ir ao trabalho; obrigações por costume não valem, e é isso que eu diria a qualquer um.", [-1, 1, -1]],
          ["Ir ao trabalho e resolver a mudança com um plano: pagar carregadores e organizar tudo por ele.", [0, 0, -2]]
        ]
      ),
      scenario(
        "c04",
        "Fechamento de uma escola",
        ["direction", "publicity", "pace"],
        "A prefeitura vai fechar uma escola pequena com poucos alunos e transferir as crianças para outra maior. As famílias souberam pela imprensa.",
        [
          ["Publicar os números e as alternativas e debater em audiência antes de fechar, mesmo adiando um ano.", [1, 2, 1]],
          ["Manter a escola aberta mais um tempo e reduzir aos poucos, observando o que acontece com as famílias.", [0, 0, 2]],
          ["Definir e divulgar o critério que fecha ou mantém qualquer escola do município; só então aplicar aqui.", [0, 1, 1]],
          ["As famílias decidem em assembleia se a escola fecha; a prefeitura executa o que for decidido, já.", [2, 1, -2]],
          ["Fechar conforme o plano da secretaria, sem consulta; anunciar só depois de resolver as transferências.", [-2, -2, -1]]
        ]
      ),
      scenario(
        "c05",
        "Novas linhas de ônibus",
        ["judgment", "order", "direction"],
        "A cidade vai redesenhar as linhas de ônibus. Há um estudo técnico completo e um pedido de motoristas e passageiros para testar as mudanças aos poucos.",
        [
          ["Levar o estudo aos bairros, ouvir quem usa o ônibus e ajustar com eles antes de mudar.", [0, 0, 1]],
          ["Mudar uma linha por vez e observar; o que os passageiros fizerem mostra o desenho que serve.", [2, 2, 0]],
          ["Partir do princípio de que cada bairro tem direito ao mesmo acesso e desenhar tudo a partir daí.", [-2, -1, 0]],
          ["Passageiros e motoristas desenham as linhas em assembleias; o estudo técnico é apenas um insumo.", [-1, -1, 2]],
          ["Implantar o estudo inteiro de uma vez; redesenho por partes vira remendo, e quem entende já decidiu.", [0, -2, -2]]
        ]
      ),
      scenario(
        "c06",
        "Celebração religiosa na empresa",
        ["religion", "moral", "pace"],
        "Uma empresa faz todo fim de ano uma celebração religiosa. Funcionários de outras crenças pediram mudança. A diretoria pergunta sua opinião.",
        [
          ["Trocar aos poucos por uma festa sem culto; explicar o motivo e aceitar que alguns fiquem chateados.", [-1, 1, 1]],
          ["Manter a celebração como está: ela une a equipe há anos, e mudar por queixa de poucos custa mais.", [1, 2, 2]],
          ["Manter, desde que ninguém seja obrigado a participar; a regra vale para qualquer fé que peça o mesmo.", [1, -2, 1]],
          ["Encerrar toda celebração religiosa já; empresa não é lugar de culto, e quem quiser reza fora dela.", [-2, 1, -2]],
          ["A diretoria decide o formato deste ano e comunica; não é assunto para consulta interna.", [0, 0, -1]]
        ]
      ),
      scenario(
        "c07",
        "Costume da filial no exterior",
        ["lastword", "scope", "moral"],
        "Uma empresa abre uma filial em outro país, onde é costume dar presentes a fiscais. A matriz proíbe. A equipe local diz que sem isso nada anda.",
        [
          ["Não dar presentes e tornar público o atraso que isso causa, para pressionar por mudança lá.", [-1, 0, 1]],
          ["Seguir o costume local dentro de limites; quem vive lá sabe o que funciona e o que ofende.", [0, 2, 2]],
          ["Não dar presentes em nenhuma circunstância, mesmo que a filial feche; o que é suborno aqui é suborno lá.", [-2, -2, -2]],
          ["A equipe local vota e decide como agir; a matriz não tem autoridade sobre quem vive as consequências.", [2, -1, 1]],
          ["A matriz define uma regra única para todas as filiais e a impõe, sem discutir com a equipe local.", [0, -1, 0]]
        ]
      ),
      scenario(
        "c08",
        "Horário do comércio",
        ["direction", "order", "scope"],
        "Uma lei nacional padroniza o horário do comércio. A cidade fecha ao meio-dia há gerações. Os comerciantes estão divididos.",
        [
          ["Abrir o debate na cidade e levar a posição dos comerciantes a quem fez a lei, para revê-la.", [1, 0, 0]],
          ["Manter o costume; ele funciona aqui há gerações, e a lei que ignorar isso será ignorada.", [0, 2, 2]],
          ["Cumprir a regra nacional: uma lei que vale para todos não pode ter exceção por costume local.", [0, -1, -2]],
          ["Comerciantes e moradores votam o horário; nem a tradição nem a lei decidem por eles.", [2, -1, -1]],
          ["Aplicar a lei de imediato e fiscalizar; padronizar o país exige que cada cidade ceda um pouco.", [-2, -2, -1]]
        ]
      ),
      scenario(
        "c09",
        "Erro de um colega",
        ["judgment", "pace", "publicity"],
        "Um colega cometeu um erro que custou caro à equipe, e ninguém fora do grupo sabe. O chefe pergunta como tratar o caso.",
        [
          ["Relatar o erro abertamente a toda a equipe, para que sirva de aprendizado, mesmo constrangendo o colega.", [0, 1, 2]],
          ["Resolver em conversa reservada; a experiência mostra que expor erros gera mais medo do que cuidado.", [2, 2, 0]],
          ["Aplicar a regra que valeria para qualquer um, sem exceção por simpatia, e registrar o que foi feito.", [-2, 1, 1]],
          ["Levar ao grupo agora e decidir juntos a consequência; ninguém acima da equipe, chefe incluído.", [-1, -2, 1]],
          ["O chefe decide a consequência sozinho, com discrição, e comunica só ao colega; o resto segue.", [0, -1, -2]]
        ]
      ),
      scenario(
        "c10",
        "Ensino religioso na escola pública",
        ["religion", "direction", "lastword"],
        "Uma escola pública recebe pedido de pais para incluir ensino religioso no horário regular. Professores e outros pais se opõem.",
        [
          ["Não incluir no horário regular; abrir o debate na escola e defender essa posição em público.", [-1, 1, -1]],
          ["Manter o que a escola já faz; em questão de fé, o costume da comunidade pesa mais que argumentos.", [1, 0, 0]],
          ["Permitir como disciplina optativa sob regra igual para toda fé; ninguém obrigado, ninguém excluído.", [1, 0, -2]],
          ["Nenhum ensino religioso em escola pública; as demais regras da escola, os pais votam.", [-2, 2, 2]],
          ["A secretaria de educação decide para toda a rede e não abre consulta; escola não é lugar de disputa.", [0, -2, 0]]
        ]
      ),
      scenario(
        "c11",
        "Infecções em uma ala do hospital",
        ["publicity", "scope", "pace"],
        "Um hospital descobre que uma de suas alas tem taxa de infecção acima da média. A direção discute o que fazer com a informação.",
        [
          ["Divulgar os números e o plano de correção, mesmo assustando pacientes; a pressão pública acelera.", [2, 0, 1]],
          ["Corrigir por dentro, ala por ala, como já se fez em outros casos; alarde não cura ninguém.", [0, 2, 2]],
          ["Seguir o protocolo que qualquer hospital deveria seguir: informar quem foi afetado e o órgão regulador.", [1, -2, 1]],
          ["Divulgar tudo agora e afastar de imediato os responsáveis; os pacientes têm direito de saber hoje.", [1, -1, -2]],
          ["Resolver em silêncio e rápido, com uma equipe designada; divulgar só depois de corrigido.", [-2, -1, -1]]
        ]
      ),
      scenario(
        "c12",
        "Fila da cirurgia",
        ["judgment", "lastword", "scope"],
        "O hospital municipal tem fila para uma cirurgia que não é urgente e não vai atender todos este ano. É preciso definir a ordem.",
        [
          ["Um critério anunciado e justificado a todos, que ninguém possa mudar depois por pressão de grupos.", [0, -1, 0]],
          ["Seguir a ordem que os médicos daqui já usam; ela vem de anos de prática e as pessoas a conhecem.", [2, 0, 2]],
          ["A ordem que qualquer pessoa aceitaria sem saber sua posição na fila, igual em qualquer hospital.", [-2, -2, -2]],
          ["Sorteio entre todos os inscritos, decidido em assembleia; ninguém tem mais direito do que outro.", [-1, 2, -1]],
          ["Uma equipe técnica ordena os casos por um padrão único e não recebe recursos nem pressão.", [0, 0, -1]]
        ]
      ),
      scenario(
        "c13",
        "Igreja em terreno público",
        ["direction", "publicity", "religion"],
        "Uma igreja usa há anos um terreno público para seus eventos. A prefeitura quer retomá-lo para construir um posto de saúde. Fiéis protestam.",
        [
          ["Publicar o contrato e os custos e debater em audiência; um culto não tem prioridade sobre um posto.", [1, 2, -1]],
          ["Buscar um acordo com a igreja que preserve os eventos; ela faz parte da vida do bairro.", [0, 0, 1]],
          ["Aplicar a regra de uso de terrenos públicos igual para qualquer grupo, religioso ou não, e explicá-la.", [0, 1, 1]],
          ["Retomar o terreno agora; os moradores votam o uso, e nenhuma igreja tem privilégio sobre bem público.", [2, 1, -2]],
          ["A prefeitura retoma por decisão administrativa, sem audiência; o posto é prioridade e ponto final.", [-2, -2, 0]]
        ]
      ),
      scenario(
        "c14",
        "Código de ética",
        ["order", "moral", "religion"],
        "Uma empresa média teve casos de desvio de conduta. A diretoria quer criar um código de ética e discute em que ele deve se apoiar.",
        [
          ["Princípios discutidos abertamente por todos, sem apelo a crenças, e revistos quando causarem dano.", [0, 1, -1]],
          ["Poucas regras e muito exemplo dos mais antigos; conduta se aprende observando, não lendo.", [2, 2, 1]],
          ["Deveres que qualquer funcionário reconheceria como válidos mesmo sem ninguém vigiando, escritos com clareza.", [-1, -2, 1]],
          ["Regras iguais do estagiário ao diretor, votadas por todos, sem referência a valores religiosos.", [-1, 1, -2]],
          ["Um código redigido pela diretoria com consultoria, imposto de cima e fiscalizado com rigor.", [-2, 0, 0]]
        ]
      ),
      scenario(
        "c15",
        "Modelo de gestão de outro país",
        ["judgment", "scope", "pace"],
        "A prefeitura quer copiar um modelo de gestão escolar que deu resultado em outro país. Muitos professores desconfiam.",
        [
          ["Traduzir as pesquisas, divulgar tudo e debater com os professores antes de decidir qualquer coisa.", [0, 0, 1]],
          ["Não copiar; o que funcionou lá nasceu de outra história. Ajustar aos poucos o que já existe aqui.", [2, 2, 2]],
          ["Adotar o que se justifica por princípios válidos em qualquer escola, em etapas, com metas claras.", [-2, -2, 1]],
          ["Adotar inteiro e já, se os professores votarem a favor; o que serve às crianças de lá serve aqui.", [-1, -1, -2]],
          ["Adotar o modelo inteiro por decisão da secretaria; adaptação demais é desculpa para não mudar nada.", [0, -1, -1]]
        ]
      ),
      scenario(
        "c16",
        "Poderes de emergência",
        ["lastword", "direction", "order"],
        "Uma enchente atingiu a cidade. O prefeito pede poderes para gastar e desapropriar sem passar pela câmara durante seis meses.",
        [
          ["Negar; a câmara vota cada medida em regime de urgência, em sessão aberta, mesmo que atrase.", [-1, 1, 0]],
          ["Apoiar quem já está se organizando nos bairros; o socorro espontâneo chega antes de qualquer decreto.", [0, 0, 2]],
          ["Conceder só o que a lei de emergência já previa antes da enchente; nada de poderes criados na hora.", [-2, 0, -1]],
          ["Os atingidos formam um comitê e decidem onde gastar; nem prefeito nem câmara acima deles.", [2, 2, -1]],
          ["Conceder os poderes; em emergência, quem executa precisa decidir sem esperar votação nem consulta.", [0, -2, -2]]
        ]
      ),
      scenario(
        "c17",
        "Objeto sagrado no museu",
        ["religion", "scope", "moral"],
        "Um museu exibe um objeto considerado sagrado por uma comunidade religiosa, que pede a devolução. O museu diz que o objeto é patrimônio de todos.",
        [
          ["Manter em exposição, explicando sua história como a de qualquer objeto, e ouvir a comunidade em público.", [-1, 0, 1]],
          ["Devolver; o que o objeto significa para os fiéis daquele lugar pesa mais que o interesse de visitantes.", [1, 2, 2]],
          ["Decidir pela regra que valeria para qualquer objeto sagrado de qualquer povo, e aplicá-la sem exceção.", [1, -2, -2]],
          ["Manter; nenhum objeto merece tratamento diferente por ser chamado de sagrado, aqui ou em qualquer lugar.", [-2, -1, 1]],
          ["A direção do museu decide conforme a política nacional de acervos e não negocia caso a caso.", [0, -1, 0]]
        ]
      ),
      scenario(
        "c18",
        "Vantagem antiga de um grupo",
        ["pace", "lastword", "order"],
        "Um grupo da cidade tem há décadas uma isenção que os outros não têm. Um movimento pede o fim imediato; outros propõem uma transição de dez anos.",
        [
          ["Expor a vantagem em números e argumentos; transição curta, mas sem depender de quem grita mais.", [1, -1, 0]],
          ["Transição longa; a cidade se arranjou em torno dessa vantagem, e romper de uma vez desorganiza tudo.", [2, 0, 2]],
          ["Acabar por uma regra que proíba qualquer vantagem desse tipo, com prazo fixo e igual para todos.", [1, -2, -1]],
          ["Fim imediato, decidido em plebiscito; privilégio não fica menos privilégio por ser antigo.", [-2, 2, -1]],
          ["A prefeitura acaba com a vantagem por decreto, dentro de um plano geral de reorganização das isenções.", [-1, 0, -2]]
        ]
      ),
      scenario(
        "c19",
        "Jovem contra o plano da família",
        ["judgment", "scope", "moral"],
        "Um jovem de dezenove anos quer abandonar a carreira que a família planejou e seguir outra. Os pais pedem que você converse com ele.",
        [
          ["Ouvir os dois lados e ajudar a conversa a acontecer; o que preserva os laços e evita sofrimento inútil.", [0, 0, 1]],
          ["Que experimente por um tempo antes de romper; em famílias como a dele, a prática costuma mostrar o rumo.", [2, 2, 2]],
          ["Ele tem idade para decidir por si e deve fazê-lo por princípio, como qualquer adulto, doa a quem doer.", [-2, -2, -2]],
          ["Ninguém tem autoridade sobre a vida de um adulto, em família alguma; que siga o que lhe faz bem.", [-1, -1, 1]],
          ["Quem sustenta a casa decide; a regra é a mesma em qualquer família até ele se sustentar sozinho.", [0, -1, 0]]
        ]
      ),
      scenario(
        "c20",
        "Campanha para reconstruir a escola",
        ["moral", "publicity", "religion"],
        "A cidade organiza uma campanha para reconstruir uma escola incendiada. Discute-se se a lista de doadores será pública e se igrejas podem coordenar a coleta.",
        [
          ["Lista pública de doadores e contas abertas; coleta sem igrejas, para não misturar fé e obra pública.", [1, 2, -1]],
          ["Deixar as igrejas coordenarem, como sempre fizeram por aqui; elas chegam onde a prefeitura não chega.", [2, 0, 1]],
          ["Doar é dever, não gesto para plateia; publicar só os valores, e igrejas com as mesmas regras que os demais.", [-2, 1, 1]],
          ["Coleta pública e igual para todos, sem igreja no comando; prestação de contas aberta em assembleia.", [1, 1, -2]],
          ["A prefeitura centraliza a coleta e não divulga doadores; quem doa quer resultado, não exposição.", [0, -2, 0]]
        ]
      ),
      scenario(
        "c21",
        "Desvio na prefeitura",
        ["judgment", "publicity", "direction"],
        "Descobre-se um esquema de desvio de dinheiro em um setor da prefeitura. Discute-se quem conduz a apuração e se ela será pública.",
        [
          ["Apuração com sessões abertas e relatórios publicados; a cidade acompanha e cobra, mesmo que atrapalhe.", [0, 2, 1]],
          ["Seguir o procedimento que a casa já usa em casos assim; ele existe porque funcionou, e mudar agora improvisa.", [2, 0, 0]],
          ["Aplicar o rito previsto em lei sem exceção, com relatório final público, sejam quais forem os envolvidos.", [-2, 1, 0]],
          ["Uma comissão de cidadãos sorteados conduz a apuração e divulga tudo; servidores não julgam servidores.", [-1, 1, 2]],
          ["O prefeito nomeia alguém de confiança, apura em sigilo e afasta quem for preciso; divulgação depois.", [0, -2, -2]]
        ]
      ),
      scenario(
        "c22",
        "Juíza diante de uma lei dura",
        ["lastword", "judgment", "order"],
        "Uma juíza deve aplicar uma lei que prevê pena pesada para um caso pequeno. A lei é clara. Ela tem alguma margem para decidir.",
        [
          ["Aplicar a lei e escrever na sentença, para quem quiser ler, por que ela deveria mudar.", [-1, 0, 0]],
          ["Ver como casos parecidos foram tratados nesta comarca e seguir o que a prática consolidou.", [0, 2, 2]],
          ["Julgar pelo princípio que valeria para todos os casos iguais, mesmo contrariando a letra da lei.", [-2, -2, -1]],
          ["Aplicar a pena mínima possível; leis feitas contra o povo se contornam até que o povo as mude.", [2, -1, -1]],
          ["Aplicar a lei como está; juiz que ajusta pena por consciência desorganiza o sistema inteiro.", [0, 0, -2]]
        ]
      ),
      scenario(
        "c23",
        "Corte de funcionários",
        ["publicity", "moral", "pace"],
        "Uma empresa precisa cortar um quinto dos funcionários. A diretoria discute como e quando comunicar.",
        [
          ["Anunciar a todos agora, com os números, e abrir um período de conversa antes de definir nomes.", [2, 1, 1]],
          ["Cortar aos poucos, começando por quem já está saindo; cada gerente conversa com sua equipe do seu jeito.", [0, 2, 2]],
          ["Definir o critério de corte antes de olhar nomes, publicá-lo e aplicá-lo mesmo que atinja quem se gosta.", [1, -2, 1]],
          ["Comunicar tudo hoje, de uma vez, e deixar que os funcionários decidam em conjunto como dividir o corte.", [1, 1, -2]],
          ["Decidir em sigilo, cortar tudo num dia e comunicar cada um individualmente; arrastar só agrava.", [-2, 0, -1]]
        ]
      ),
      scenario(
        "c24",
        "Templo de uma religião recém-chegada",
        ["religion", "publicity", "lastword"],
        "Um grupo religioso recém-chegado quer construir um templo. Vizinhos protestam e pedem consulta popular. A prefeitura pede pareceres.",
        [
          ["Autorizar; debater em público o que a cidade entende por convivência, mas o direito não depende de votação.", [-1, 2, -1]],
          ["Autorizar com diálogo entre as lideranças religiosas do bairro, para que o templo entre na vida local.", [1, 0, 0]],
          ["Autorizar pelo princípio de que qualquer culto tem o mesmo direito; vizinhos ofendidos não são argumento.", [1, 1, -2]],
          ["Fazer a consulta popular e cumprir o resultado; e discutir também os privilégios das igrejas já instaladas.", [-2, 1, 2]],
          ["A prefeitura decide sozinha e sem consulta; a paz entre crenças é assunto de administração, não de plebiscito.", [0, -2, 0]]
        ]
      )
    ],
    twoStage: [
      twoStage(
        "d01",
        "Aplicativo de denúncias",
        ["judgment", "direction", "publicity"],
        "A prefeitura lança um aplicativo para moradores denunciarem problemas nas ruas. Discute-se se denúncias e respostas serão públicas e quem define as prioridades.",
        [
          ["Tudo público: cada denúncia, cada resposta e o tempo que levou; a pressão de todos organiza a fila.", [0, 1, 2]],
          ["Começar pequeno, em um bairro, ver o que os moradores fazem com a ferramenta e ajustar depois.", [2, 0, 0]],
          ["Definir antes o critério de prioridade que valeria para qualquer cidade e publicá-lo; depois lançar.", [-2, 0, 1]],
          ["Os moradores votam no aplicativo o que vem primeiro; a prefeitura executa a ordem votada, às claras.", [-1, 2, 1]],
          ["A secretaria define prioridades por critérios técnicos internos e publica só o que foi resolvido.", [0, -2, -2]]
        ],
        "Três meses depois, descobre-se que um bairro rico concentra a maioria das denúncias e das respostas, enquanto bairros pobres quase não aparecem.",
        [
          ["Publicar o desequilíbrio com mapas e números; a cidade inteira precisa ver para onde a atenção está indo.", [0, 1, 2]],
          ["Levar a ferramenta aos bairros que não a usam, com quem conhece cada um; corrigir pelo uso, não por regra.", [2, 0, 0]],
          ["Manter o critério publicado; se ele produz esse resultado, estava mal formulado e deve ser refeito.", [-2, 0, 1]],
          ["Os moradores dos bairros esquecidos decidem as prioridades agora; a votação geral inteira estava viciada.", [-1, 2, 1]],
          ["A secretaria redistribui as equipes por conta própria, sem anunciar; corrigir em silêncio evita disputa entre bairros.", [0, -2, -2]]
        ]
      ),
      twoStage(
        "d02",
        "Feriado religioso municipal",
        ["religion", "lastword", "publicity"],
        "A câmara discute transformar a data de uma festa religiosa tradicional em feriado municipal. Uma pesquisa mostra que a maioria apoia; comerciantes e fiéis de outras crenças se opõem.",
        [
          ["Não criar feriado de uma fé, mesmo com maioria a favor; levar o debate à praça e propor data civil.", [-1, -1, 2]],
          ["Criar; a festa organiza o ano da cidade há gerações, e a lei apenas reconhece o que já existe.", [1, 0, 0]],
          ["Criar apenas se qualquer fé com festa tradicional puder pedir o mesmo pela mesma regra, publicada.", [1, -2, 1]],
          ["A população decide em consulta e a câmara cumpre; e que se revejam em público os apoios a festas.", [-2, 2, 1]],
          ["O prefeito decide sozinho e sem alarde, pelo que servir à economia; consulta e debate só atrasam.", [0, 0, -2]]
        ],
        "Uma nova pesquisa mostra que a maioria, na verdade, se opõe ao feriado, por causa do impacto no comércio.",
        [
          ["Mantenho: não criar; a razão nunca foi a pesquisa, e o debate público continua exatamente igual.", [-1, -1, 2]],
          ["Se a cidade não quer, não há o que reconhecer; a festa segue como sempre foi, sem feriado.", [1, 0, 0]],
          ["Mantenho a regra: feriado para uma fé só se para todas; o que a maioria pensa não entra na conta.", [1, -2, 1]],
          ["A maioria decidiu contra, e a maioria manda: não criar; a revisão pública dos apoios às festas segue.", [-2, 2, 1]],
          ["O prefeito decide pelo que servir à economia; a pesquisa é uma informação a mais, não uma ordem.", [0, 0, -2]]
        ]
      ),
      twoStage(
        "d03",
        "Atrasos na cooperativa",
        ["judgment", "pace", "order"],
        "Uma cooperativa cresceu e alguns sócios começaram a atrasar entregas. Os fundadores discutem como manter o grupo unido.",
        [
          ["Reunir todos, pôr os números na mesa e combinar mudanças aos poucos, com os atrasados presentes.", [0, 1, 0]],
          ["Conversar caso a caso; confiança se reconstrói na convivência, como sempre foi, não em regulamento.", [2, 2, 2]],
          ["Fixar uma regra de contribuição que todos aceitariam de antemão e aplicá-la a cada um, sem exceção.", [-2, 1, -1]],
          ["Assembleia geral já: quem atrasa sem motivo sai; a cooperativa é de todos ou não é de ninguém.", [-1, -2, -1]],
          ["A diretoria redesenha entregas e cobranças e impõe o novo modelo; discutir só atrasa mais.", [0, -1, -2]]
        ],
        "Descobre-se que os atrasos vêm de dois sócios que enfrentam doença na família e não quiseram contar a ninguém.",
        [
          ["Trazer o caso ao grupo, com o consentimento dos dois, e combinar apoio; as regras podem esperar um pouco.", [0, 1, 0]],
          ["Era isso que a conversa teria mostrado; ajudar os dois e seguir sem regra nova, cada caso é um caso.", [2, 2, 2]],
          ["A regra vale igual, mas pode prever exceção por motivo grave; o que não pode é decidir por simpatia.", [-2, 1, -1]],
          ["A assembleia decide agora se o motivo justifica; a regra é da assembleia, não de quem sente pena.", [-1, -2, -1]],
          ["A diretoria cobre os dois com uma reserva e mantém o novo sistema; o plano não muda por casos pessoais.", [0, -1, -2]]
        ]
      ),
      twoStage(
        "d04",
        "Pedido na porta do mercado",
        ["judgment", "scope", "moral"],
        "Na porta do mercado, um homem pede dinheiro dizendo que precisa comprar um remédio. Você tem pouco dinheiro e pressa.",
        [
          ["Perguntar o que ele precisa e, se fizer sentido, comprar o remédio com ele; dinheiro em si não resolve.", [0, 0, 1]],
          ["Dar o que se costuma dar por aqui e seguir; a gente sente quando é caso de ajudar.", [2, 2, 2]],
          ["Ajudar como você exigiria que qualquer pessoa ajudasse qualquer outra, sem depender do que sente na hora.", [-2, -2, -2]],
          ["Dar; ninguém pede remédio por gosto, e o que faz alguém precisar disso é problema de todos, em qualquer lugar.", [-1, -1, 1]],
          ["Não dar; indicar o posto de saúde, que é para isso que existe um sistema, aqui e em qualquer cidade.", [0, -1, 0]]
        ],
        "Você percebe que ele pede a mesma coisa a todos que saem, e alguém comenta que ele faz isso há meses.",
        [
          ["Ainda assim conversar; se for golpe, a conversa mostra, e se não for, alguém precisava mesmo.", [0, 0, 1]],
          ["Seguir sem dar; a experiência de quem passa ali todo dia vale mais do que a história de hoje.", [2, 2, 2]],
          ["O que você faria em qualquer caso igual continua valendo; a decisão não muda por suspeita.", [-2, -2, -2]],
          ["Dar mesmo assim; se alguém pede há meses, é porque há meses falta algo, e a culpa não é dele.", [-1, -1, 1]],
          ["Não dar e avisar a assistência social; um problema que se repete pede uma solução do sistema.", [0, -1, 0]]
        ]
      )
    ],
    tensions: [
      tension(
        "t01",
        "judgment",
        "Antes de decidir, procuro o princípio que deveria valer em qualquer caso.",
        "Antes de decidir, procuro o que já deu resultado em casos parecidos."
      ),
      tension(
        "t02",
        "religion",
        "Decisões públicas não devem se apoiar em crenças religiosas, mesmo quando a maioria as tem.",
        "Crenças religiosas fazem parte da vida comum e podem ter lugar nas decisões públicas."
      ),
      tension(
        "t03",
        "direction",
        "Mudanças duráveis vêm de quem tem preparo e responsabilidade para decidir e executar.",
        "Mudanças duráveis vêm de quem vive a situação e a discute entre si."
      ),
      tension(
        "t04",
        "pace",
        "O que causa dano deve acabar agora, mesmo que custe caro.",
        "O que causa dano deve mudar em etapas, preservando o que ainda funciona."
      ),
      tension(
        "t05",
        "lastword",
        "Há regras que valem mesmo quando a maioria quer o contrário.",
        "A decisão da maioria é a última palavra sobre qualquer regra."
      ),
      tension(
        "t06",
        "order",
        "Uma cidade funciona quando alguém desenha o conjunto e faz cumprir.",
        "Uma cidade funciona por ajustes que ninguém desenhou e ninguém controla."
      ),
      tension(
        "t07",
        "scope",
        "O que vale aqui deveria valer em qualquer lugar do mundo.",
        "Cada lugar tem história própria e precisa de regras próprias."
      ),
      tension(
        "t08",
        "moral",
        "Agir bem é cumprir o dever, mesmo contra o que se sente.",
        "Agir bem é responder ao que se sente e ao que faz bem a quem está perto."
      ),
      tension(
        "t09",
        "publicity",
        "Decisões delicadas se resolvem entre quem tem responsabilidade, sem plateia.",
        "Decisões delicadas devem ser expostas e discutidas à vista de todos."
      )
    ]
  };
});
