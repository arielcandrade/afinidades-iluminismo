(function (root, factory) {
  "use strict";

  var figures = factory();

  if (typeof module === "object" && module.exports) {
    module.exports = figures;
  }

  root.IdeiasIluministas = root.IdeiasIluministas || {};
  root.IdeiasIluministas.figures = figures;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  // Seis personalidades por perfil de js/data/profiles.js, na ordem em que aparecem na página.
  // `summary`: resumo próprio redigido a partir do verbete da Wikipédia em português (`wikipedia`),
  // com o inglês como apoio. Não copiar frases dos verbetes: o texto deles é CC BY-SA 4.0.
  // `image.file`: retrato em img/personalidades/, redimensionado a partir de `image.source` (Commons).
  return [
    {
      id: "voltaire",
      profile: "philosophes",
      name: "Voltaire",
      dates: "1694–1778",
      origin: "Paris, França",
      role: "escritor, filósofo e polemista",
      summary:
        "O escritor mais célebre do século usou sátira, teatro, contos e cartas para atacar o fanatismo religioso e a arbitrariedade da justiça. Defendeu publicamente vítimas da intolerância, como a família Calas, e transformou a opinião pública num tribunal. Admirava as instituições inglesas, mas preferia pressionar reis a derrubá-los: é o retrato acabado do philosophe reformista.",
      works: ["Cartas filosóficas (1734)", "Cândido (1759)", "Dicionário filosófico (1764)"],
      wikipedia: "https://pt.wikipedia.org/wiki/Voltaire",
      image: {
        file: "voltaire.jpg",
        author: "Nicolas de Largillière",
        license: "CC0",
        source: "https://commons.wikimedia.org/wiki/File:Nicolas_de_Largilli%C3%A8re_-_Portrait_de_Voltaire_(1694-1778)_en_1718_-_P208_-_mus%C3%A9e_Carnavalet_-_5_(cropped).jpg"
      }
    },
    {
      id: "diderot",
      profile: "philosophes",
      name: "Denis Diderot",
      dates: "1713–1784",
      origin: "Langres, França",
      role: "filósofo, escritor e editor da Encyclopédie",
      summary:
        "Dirigiu por mais de vinte anos a Encyclopédie, obra coletiva que reuniu artes, ciências e ofícios e enfrentou censura, proibições e até a prisão de seu editor. Para ele, o conhecimento só transforma a sociedade se circular amplamente. Em textos que muitas vezes guardou na gaveta, chegou ao materialismo e ao ateísmo, o que o coloca na fronteira com o Iluminismo radical.",
      works: ["Carta sobre os cegos (1749)", "Encyclopédie (1751–1772, com d'Alembert)", "O sobrinho de Rameau (escrito c. 1761–1774)"],
      wikipedia: "https://pt.wikipedia.org/wiki/Denis_Diderot",
      image: {
        file: "diderot.jpg",
        author: "Autor desconhecido",
        license: "Domínio público",
        source: "https://commons.wikimedia.org/wiki/File:Denis_Diderot_by_Louis-Michel_van_Loo.jpg"
      }
    },
    {
      id: "montesquieu",
      profile: "philosophes",
      name: "Montesquieu",
      dates: "1689–1755",
      origin: "La Brède, perto de Bordéus, França",
      role: "magistrado e filósofo político",
      summary:
        "Magistrado em Bordéus, comparou as leis de muitos povos para entender por que cada sociedade se governa como se governa. Concluiu que a liberdade depende de que o poder detenha o poder, base da separação entre Legislativo, Executivo e Judiciário presente em tantas constituições. Nas Cartas persas, usou viajantes fictícios para ridicularizar a monarquia absoluta e o clero franceses.",
      works: ["Cartas persas (1721)", "O espírito das leis (1748)"],
      wikipedia: "https://pt.wikipedia.org/wiki/Montesquieu",
      image: {
        file: "montesquieu.jpg",
        author: "Segundo Jacques-Antoine Dassier",
        license: "Domínio público",
        source: "https://commons.wikimedia.org/wiki/File:Charles_Montesquieu.jpg"
      }
    },
    {
      id: "condorcet",
      profile: "philosophes",
      name: "Condorcet",
      dates: "1743–1794",
      origin: "Ribemont, França",
      role: "matemático, filósofo e deputado revolucionário",
      summary:
        "Matemático e secretário da Academia de Ciências, aplicou o cálculo de probabilidades às votações e defendeu educação pública gratuita, direitos políticos para as mulheres e o fim da escravidão. Eleito deputado durante a Revolução, foi perseguido pelos jacobinos e morreu na prisão. Escondido, escreveu sua aposta no progresso indefinido da humanidade, o último grande texto dos philosophes.",
      works: ["Ensaio sobre a aplicação da análise à probabilidade das decisões (1785)", "Esboço de um quadro histórico dos progressos do espírito humano (1795, póstumo)"],
      wikipedia: "https://pt.wikipedia.org/wiki/Marqu%C3%AAs_de_Condorcet",
      image: {
        file: "condorcet.jpg",
        author: "Pintor não identificado (antes atribuído a Jean-Baptiste Greuze)",
        license: "Domínio público",
        source: "https://commons.wikimedia.org/wiki/File:Nicolas_de_Condorcet.PNG"
      }
    },
    {
      id: "dalembert",
      profile: "philosophes",
      name: "Jean le Rond d'Alembert",
      dates: "1717–1783",
      origin: "Paris, França",
      role: "matemático e coeditor da Encyclopédie",
      summary:
        "Matemático de primeira linha, formulou a equação de onda e deu contribuições decisivas à mecânica. Foi coeditor da Encyclopédie até 1759 e escreveu seu Discurso preliminar, que apresenta o saber como uma árvore nascida da experiência e da razão. Como secretário da Academia Francesa, ajudou a abrir as instituições oficiais às ideias dos philosophes.",
      works: ["Tratado de dinâmica (1743)", "Discurso preliminar da Encyclopédie (1751)"],
      wikipedia: "https://pt.wikipedia.org/wiki/Jean_Le_Rond_d%27Alembert",
      image: {
        file: "dalembert.jpg",
        author: "Segundo Maurice Quentin de La Tour",
        license: "Domínio público",
        source: "https://commons.wikimedia.org/wiki/File:Jean_Le_Rond_d%27Alembert,_by_French_school.jpg"
      }
    },
    {
      id: "rousseau",
      profile: "philosophes",
      name: "Jean-Jacques Rousseau",
      dates: "1712–1778",
      origin: "Genebra",
      role: "filósofo, escritor e compositor",
      summary:
        "Escreveu os verbetes de música da Encyclopédie a convite de Diderot, mas rompeu com ele e com Voltaire: desconfiava do progresso das artes e das ciências e dava ao sentimento e à consciência moral um lugar central. Sua crítica da desigualdade e a ideia de vontade geral inspiraram os revolucionários. Pertence ao círculo dos philosophes, mas é também seu crítico mais incômodo.",
      works: ["Discurso sobre a origem da desigualdade (1755)", "Do contrato social (1762)", "Emílio, ou Da educação (1762)"],
      wikipedia: "https://pt.wikipedia.org/wiki/Jean-Jacques_Rousseau",
      image: {
        file: "rousseau.jpg",
        author: "Maurice Quentin de La Tour",
        license: "Domínio público",
        source: "https://commons.wikimedia.org/wiki/File:Maurice_Quentin_de_La_Tour_-_Portrait_of_Jean-Jacques_Rousseau_-_adjusted.jpg"
      }
    },

    {
      id: "hume",
      profile: "scottish",
      name: "David Hume",
      dates: "1711–1776",
      origin: "Edimburgo, Escócia",
      role: "filósofo, historiador e ensaísta",
      summary:
        "Quis fundar uma ciência da natureza humana baseada na observação e concluiu que causalidade, moral e crença dependem mais do hábito e do sentimento do que de demonstrações racionais. Seu ceticismo sobre milagres e sobre a religião natural escandalizou os contemporâneos. Escreveu também uma História da Inglaterra de enorme sucesso e ensaios sobre comércio e política, sempre desconfiado de sistemas abstratos.",
      works: ["Tratado da natureza humana (1739–1740)", "Investigação sobre o entendimento humano (1748)", "História da Inglaterra (1754–1762)"],
      wikipedia: "https://pt.wikipedia.org/wiki/David_Hume",
      image: {
        file: "hume.jpg",
        author: "Allan Ramsay",
        license: "Domínio público",
        source: "https://commons.wikimedia.org/wiki/File:David_Hume_Ramsay.jpg"
      }
    },
    {
      id: "smith",
      profile: "scottish",
      name: "Adam Smith",
      dates: "1723–1790",
      origin: "Kirkcaldy, Escócia",
      role: "filósofo moral e economista",
      summary:
        "Professor de filosofia moral em Glasgow, explicou a moral pela simpatia, a capacidade de nos colocarmos no lugar dos outros, e a riqueza das nações pela divisão do trabalho e pelo comércio. Mostrou como milhares de decisões individuais podem produzir uma ordem que ninguém planejou e desconfiava tanto dos monopólios quanto dos governos que pretendem dirigir a economia.",
      works: ["Teoria dos sentimentos morais (1759)", "A riqueza das nações (1776)"],
      wikipedia: "https://pt.wikipedia.org/wiki/Adam_Smith",
      image: {
        file: "smith.jpg",
        author: "Autor desconhecido",
        license: "Domínio público",
        source: "https://commons.wikimedia.org/wiki/File:Adam_Smith_The_Muir_portrait.jpg"
      }
    },
    {
      id: "ferguson",
      profile: "scottish",
      name: "Adam Ferguson",
      dates: "1723–1816",
      origin: "Logierait, Escócia",
      role: "filósofo e historiador",
      summary:
        "Ex-capelão de um regimento das Terras Altas e professor em Edimburgo, estudou como as sociedades passam de rudes a refinadas. Sustentou que as instituições resultam da ação humana, mas não de um plano humano. Admirava o comércio, mas temia que ele enfraquecesse o espírito cívico e a coragem dos cidadãos. É lembrado como um dos pais da sociologia.",
      works: ["Ensaio sobre a história da sociedade civil (1767)", "História do progresso e do fim da República romana (1783)"],
      wikipedia: "https://pt.wikipedia.org/wiki/Adam_Ferguson",
      image: {
        file: "ferguson.jpg",
        author: "Joshua Reynolds",
        license: "Domínio público",
        source: "https://commons.wikimedia.org/wiki/File:ProfAdamFerguson.jpg"
      }
    },
    {
      id: "hutcheson",
      profile: "scottish",
      name: "Francis Hutcheson",
      dates: "1694–1746",
      origin: "Ulster, Irlanda, de família escocesa",
      role: "filósofo moral",
      summary:
        "Filho de um pastor presbiteriano de origem escocesa, lecionou filosofia moral em Glasgow, onde foi professor de Adam Smith. Defendeu que todos temos um senso moral inato, que nos faz aprovar a benevolência sem precisar de cálculo nem de revelação, e formulou cedo a ideia da maior felicidade para o maior número. É considerado o pai do Iluminismo escocês.",
      works: ["Investigação sobre a origem de nossas ideias de beleza e virtude (1725)", "Sistema de filosofia moral (1755, póstumo)"],
      wikipedia: "https://pt.wikipedia.org/wiki/Francis_Hutcheson",
      image: {
        file: "hutcheson.jpg",
        author: "Allan Ramsay (recorte)",
        license: "Domínio público",
        source: "https://commons.wikimedia.org/wiki/File:Francis_Hutcheson_b1694.jpg"
      }
    },
    {
      id: "reid",
      profile: "scottish",
      name: "Thomas Reid",
      dates: "1710–1796",
      origin: "Strachan, Escócia",
      role: "filósofo e pastor",
      summary:
        "Pastor e professor em Aberdeen e Glasgow, foi o crítico mais sistemático de Hume. Sustentou que certos princípios do senso comum, como a existência do mundo exterior, a confiabilidade da memória e a liberdade de agir, não precisam de prova e servem de base a todo raciocínio. Fundou a Escola Escocesa do Senso Comum, muito lida na França e nos Estados Unidos.",
      works: ["Investigação sobre a mente humana segundo os princípios do senso comum (1764)", "Ensaios sobre os poderes intelectuais do homem (1785)"],
      wikipedia: "https://pt.wikipedia.org/wiki/Thomas_Reid",
      image: {
        file: "reid.jpg",
        author: "Autor desconhecido",
        license: "Domínio público",
        source: "https://commons.wikimedia.org/wiki/File:ThomasReid.jpg"
      }
    },
    {
      id: "robertson",
      profile: "scottish",
      name: "William Robertson",
      dates: "1721–1793",
      origin: "Borthwick, Escócia",
      role: "historiador, pastor e reitor da Universidade de Edimburgo",
      summary:
        "Pastor da Igreja da Escócia, liderou a ala moderada, que aproximou o presbiterianismo da cultura iluminista. Por três décadas dirigiu a Universidade de Edimburgo, então um dos centros intelectuais da Europa. Suas histórias da Escócia, de Carlos V e da América, apoiadas em documentos, mostravam as sociedades avançando por etapas, ideia típica do grupo.",
      works: ["História da Escócia (1759)", "História do reinado do imperador Carlos V (1769)", "História da América (1777)"],
      wikipedia: "https://pt.wikipedia.org/wiki/William_Robertson_(historiador)",
      image: {
        file: "robertson.jpg",
        author: "Joshua Reynolds (recorte)",
        license: "Domínio público",
        source: "https://commons.wikimedia.org/wiki/File:Joshua_Reynolds_(1723-1792)_-_Reverend_William_Robertson_(1721%E2%80%931793),_Historian_and_Principal_of_Edinburgh_University_-_PG_1393_-_National_Galleries_of_Scotland.jpg"
      }
    },

    {
      id: "kant",
      profile: "aufklarung",
      name: "Immanuel Kant",
      dates: "1724–1804",
      origin: "Königsberg, Prússia",
      role: "filósofo",
      summary:
        "Passou a vida em Königsberg e é considerado o maior filósofo do período. Investigou os limites do conhecimento e fundou a moral no dever: agir segundo princípios que poderiam valer para qualquer pessoa. No ensaio sobre o que é o esclarecimento, definiu a época como a saída do ser humano da menoridade e deu-lhe um lema: ouse saber, tenha coragem de usar o próprio entendimento.",
      works: ["Crítica da razão pura (1781)", "Resposta à pergunta: o que é o esclarecimento? (1784)", "Fundamentação da metafísica dos costumes (1785)"],
      wikipedia: "https://pt.wikipedia.org/wiki/Immanuel_Kant",
      image: {
        file: "kant.jpg",
        author: "Johann Gottlieb Becker",
        license: "Domínio público",
        source: "https://commons.wikimedia.org/wiki/File:Immanuel_Kant_-_Gemaelde_1.jpg"
      }
    },
    {
      id: "lessing",
      profile: "aufklarung",
      name: "Gotthold Ephraim Lessing",
      dates: "1729–1781",
      origin: "Kamenz, Saxônia",
      role: "dramaturgo, crítico e filósofo",
      summary:
        "Dramaturgo e crítico, renovou o teatro alemão e defendeu a liberdade de pensamento e a tolerância religiosa. Na peça Natã, o sábio, cujo protagonista foi inspirado em seu amigo Moses Mendelssohn, um judeu, um cristão e um muçulmano descobrem que nenhuma religião pode provar ser a única verdadeira. Via a história como uma educação progressiva da humanidade.",
      works: ["Minna von Barnhelm (1767)", "Natã, o sábio (1779)", "A educação do gênero humano (1780)"],
      wikipedia: "https://pt.wikipedia.org/wiki/Gotthold_Ephraim_Lessing",
      image: {
        file: "lessing.jpg",
        author: "Anton Graff",
        license: "Domínio público",
        source: "https://commons.wikimedia.org/wiki/File:Gotthold_Ephraim_Lessing_Kunstsammlung_Uni_Leipzig.jpg"
      }
    },
    {
      id: "wolff",
      profile: "aufklarung",
      name: "Christian Wolff",
      dates: "1679–1754",
      origin: "Breslau, Silésia",
      role: "filósofo e matemático",
      summary:
        "Organizou a filosofia de Leibniz num sistema que cobria lógica, metafísica, ética, política e ciências, escrito em alemão e encadeado em demonstrações quase matemáticas. Expulso da Prússia em 1723 por pressão de teólogos pietistas, foi chamado de volta por Frederico II em 1740. Seu método dominou as universidades alemãs e formou a geração da Aufklärung.",
      works: ["Pensamentos racionais sobre Deus, o mundo e a alma humana (1720)", "Lógica latina (Philosophia rationalis sive logica, 1728)"],
      wikipedia: "https://pt.wikipedia.org/wiki/Christian_Wolff",
      image: {
        file: "wolff.jpg",
        author: "Autor desconhecido",
        license: "Domínio público",
        source: "https://commons.wikimedia.org/wiki/File:Christian-Wolff_Gem%C3%A4lde.jpg"
      }
    },
    {
      id: "mendelssohn",
      profile: "aufklarung",
      name: "Moses Mendelssohn",
      dates: "1729–1786",
      origin: "Dessau, Anhalt",
      role: "filósofo",
      summary:
        "Filho de um copista pobre, aprendeu praticamente sozinho alemão, latim e filosofia e tornou-se um dos pensadores mais respeitados de Berlim. Defendeu pela razão a existência de Deus e a imortalidade da alma e lutou pela tolerância religiosa e pelos direitos civis dos judeus. Amigo próximo de Lessing, é o precursor da Haskalá, o Iluminismo judaico.",
      works: ["Fédon, ou Sobre a imortalidade da alma (1767)", "Jerusalém, ou Sobre o poder religioso e o judaísmo (1783)"],
      wikipedia: "https://pt.wikipedia.org/wiki/Mois%C3%A9s_Mendelssohn",
      image: {
        file: "mendelssohn.jpg",
        author: "Segundo Anton Graff",
        license: "Domínio público",
        source: "https://commons.wikimedia.org/wiki/File:Moses_Mendelson_P7160073.JPG"
      }
    },
    {
      id: "thomasius",
      profile: "aufklarung",
      name: "Christian Thomasius",
      dates: "1655–1728",
      origin: "Leipzig, Saxônia",
      role: "jurista e filósofo",
      summary:
        "Jurista em Leipzig e depois em Halle, foi um dos primeiros professores a dar aulas em alemão em vez de latim, aproximando a universidade do público. Separou o direito da teologia e combateu os processos por bruxaria e o uso da tortura nos tribunais. Ajudou a fundar a Universidade de Halle, berço da Aufklärung, e é considerado seu precursor.",
      works: ["Sobre o crime de magia (De crimine magiae, 1701)", "Fundamentos do direito natural e das gentes (1705)"],
      wikipedia: "https://pt.wikipedia.org/wiki/Christian_Thomasius",
      image: {
        file: "thomasius.jpg",
        author: "Johann Christian Heinrich Sporleder",
        license: "Domínio público",
        source: "https://commons.wikimedia.org/wiki/File:Christian_Thomasius.jpg"
      }
    },
    {
      id: "herder",
      profile: "aufklarung",
      name: "Johann Gottfried Herder",
      dates: "1744–1803",
      origin: "Mohrungen, Prússia Oriental",
      role: "filósofo, teólogo e crítico literário",
      summary:
        "Aluno de Kant em Königsberg, defendeu que cada povo tem língua, poesia e modo de pensar próprios, que não devem ser medidos por um padrão único. Como pregador em Weimar, influenciou Goethe e o romantismo. Pertence à Aufklärung pela confiança na formação da humanidade, mas criticou o universalismo abstrato de muitos contemporâneos, o que faz dele uma figura de transição.",
      works: ["Tratado sobre a origem da linguagem (1772)", "Ideias para a filosofia da história da humanidade (1784–1791)"],
      wikipedia: "https://pt.wikipedia.org/wiki/Johann_Gottfried_von_Herder",
      image: {
        file: "herder.jpg",
        author: "Anton Graff",
        license: "Domínio público",
        source: "https://commons.wikimedia.org/wiki/File:Johann_Gottfried_Herder_2.jpg"
      }
    },

    {
      id: "espinosa",
      profile: "radical",
      name: "Baruch Espinosa",
      dates: "1632–1677",
      origin: "Amsterdã, de família judaico-portuguesa",
      role: "filósofo",
      summary:
        "Filho de judeus portugueses refugiados em Amsterdã, foi expulso da sinagoga aos 23 anos. Identificou Deus com a natureza, negou os milagres e um Deus pessoal e leu a Bíblia como documento histórico. Defendeu a liberdade de pensamento e viu na democracia o regime mais natural. Para muitos historiadores, é o fundador do Iluminismo radical.",
      works: ["Tratado teológico-político (1670)", "Ética (1677, póstuma)"],
      wikipedia: "https://pt.wikipedia.org/wiki/Baruch_Espinoza",
      teaser:
        "Expulso da sinagoga aos 23 anos, identificou Deus com a natureza e fez da liberdade de pensar a finalidade do Estado.",
      sources: [
        { title: "Baruch Spinoza", language: "inglês", url: "https://en.wikipedia.org/wiki/Baruch_Spinoza" },
        { title: "Baruch Espinoza", language: "português", url: "https://pt.wikipedia.org/wiki/Baruch_Espinoza" }
      ],
      image: {
        file: "espinosa.jpg",
        author: "Autor anônimo",
        license: "Domínio público",
        source: "https://commons.wikimedia.org/wiki/File:Spinoza.jpg"
      }
    },
    {
      id: "bayle",
      profile: "radical",
      name: "Pierre Bayle",
      dates: "1647–1706",
      origin: "Carla, França",
      role: "filósofo e crítico",
      summary:
        "Protestante francês exilado em Roterdã, fez da dúvida um método. No Dicionário histórico e crítico, escondeu em longas notas de rodapé argumentos contra dogmas e superstições e sustentou que uma sociedade de ateus poderia ser virtuosa. Defendeu a tolerância até para quem erra de boa-fé. Seu dicionário foi leitura obrigatória de philosophes e radicais.",
      works: ["Pensamentos diversos sobre o cometa (1682)", "Comentário filosófico (1686)", "Dicionário histórico e crítico (1697)"],
      wikipedia: "https://pt.wikipedia.org/wiki/Pierre_Bayle",
      image: {
        file: "bayle.jpg",
        author: "Atribuído a Louis Ferdinand Elle, o Jovem",
        license: "Domínio público",
        source: "https://commons.wikimedia.org/wiki/File:Pierre_Bayle_by_Louis_Ferdinand_Elle.jpg"
      }
    },
    {
      id: "holbach",
      profile: "radical",
      name: "Barão d'Holbach",
      dates: "1723–1789",
      origin: "Edesheim, Palatinado; viveu em Paris",
      role: "filósofo e enciclopedista",
      summary:
        "Barão de origem alemã instalado em Paris, escreveu centenas de verbetes para a Encyclopédie e manteve um salão frequentado por Diderot, Hume e Rousseau. Em livros publicados anonimamente, defendeu um materialismo completo: só existe matéria em movimento, a religião nasce da ignorância e do medo, e a moral deve se basear na utilidade social.",
      works: ["O cristianismo desvendado (1766)", "Sistema da natureza (1770)"],
      wikipedia: "https://pt.wikipedia.org/wiki/Bar%C3%A3o_d%27Holbach",
      image: {
        file: "holbach.jpg",
        author: "Alexander Roslin (recorte)",
        license: "Domínio público",
        source: "https://commons.wikimedia.org/wiki/File:Paul_Heinrich_Dietrich_Baron_d%27Holbach_Roslin.jpg"
      }
    },
    {
      id: "paine",
      profile: "radical",
      name: "Thomas Paine",
      dates: "1737–1809",
      origin: "Thetford, Inglaterra",
      role: "panfletário e revolucionário",
      summary:
        "Ex-cobrador de impostos inglês, emigrou para a América e, com o panfleto Senso comum, convenceu milhares de colonos a lutar pela independência. Depois defendeu a Revolução Francesa e foi eleito para a Convenção. Pregava república, direitos iguais, voto amplo e amparo público aos pobres e atacou as religiões reveladas, sempre em linguagem acessível ao grande público.",
      works: ["Senso comum (1776)", "Os direitos do homem (1791–1792)", "A idade da razão (1794–1807)"],
      wikipedia: "https://pt.wikipedia.org/wiki/Thomas_Paine",
      image: {
        file: "paine.jpg",
        author: "Laurent Dabos",
        license: "Domínio público",
        source: "https://commons.wikimedia.org/wiki/File:Laurent_Dabos_%E2%80%93_Thomas_Paine_%E2%80%93_Google_Art_Project.jpg"
      }
    },
    {
      id: "helvetius",
      profile: "radical",
      name: "Claude-Adrien Helvétius",
      dates: "1715–1771",
      origin: "Paris, França",
      role: "filósofo",
      summary:
        "Rico coletor de impostos que deixou o cargo para se dedicar à filosofia, sustentou que todas as pessoas nascem com capacidades iguais e que as diferenças vêm da educação e das leis. Fez do interesse e da busca do prazer a base da moral. Seu livro Do espírito foi condenado pela Sorbonne, pelo Parlamento de Paris e pelo papa e queimado em público.",
      works: ["Do espírito (1758)", "Do homem (1773, póstumo)"],
      wikipedia: "https://pt.wikipedia.org/wiki/Claude-Adrien_Helv%C3%A9tius",
      image: {
        file: "helvetius.jpg",
        author: "Pierre Michel Alix (gravura)",
        license: "CC0",
        source: "https://commons.wikimedia.org/wiki/File:Portrait_de_Claude_Adrien_Helvetius,_Collection_des_Grands_Hommes,_G.4189(3).jpg"
      }
    },
    {
      id: "wollstonecraft",
      profile: "radical",
      name: "Mary Wollstonecraft",
      dates: "1759–1797",
      origin: "Londres, Inglaterra",
      role: "escritora e filósofa",
      summary:
        "Escritora praticamente autodidata, respondeu a Edmund Burke em defesa da Revolução Francesa e, logo depois, estendeu às mulheres a lógica dos direitos naturais. Argumentou que as mulheres não são inferiores por natureza, mas por falta de educação, e exigiu para elas instrução racional e independência. Viveu em Paris durante o Terror. É considerada uma das fundadoras do feminismo.",
      works: ["Reivindicação dos direitos dos homens (1790)", "Reivindicação dos direitos da mulher (1792)"],
      wikipedia: "https://pt.wikipedia.org/wiki/Mary_Wollstonecraft",
      image: {
        file: "wollstonecraft.jpg",
        author: "John Opie",
        license: "Domínio público",
        source: "https://commons.wikimedia.org/wiki/File:Mary_Wollstonecraft_by_John_Opie_(c._1797).jpg"
      }
    },

    {
      id: "frederico",
      profile: "despotism",
      name: "Frederico II da Prússia",
      dates: "1712–1786",
      origin: "Berlim, Prússia",
      role: "rei da Prússia (1740–1786)",
      summary:
        "O rei filósofo correspondia-se com Voltaire, que chegou a viver em sua corte, e escrevia sobre política, música e história. Aboliu a tortura judicial na maior parte dos casos, reformou o direito, ampliou a tolerância religiosa e dizia ser o primeiro servidor do Estado. Ao mesmo tempo, governou de modo absoluto, manteve a servidão e fez da Prússia uma potência militar.",
      works: ["Anti-Maquiavel (1740)", "Restrição da tortura judicial (1740)", "Código Geral Prussiano (preparado em seu reinado, promulgado em 1794)"],
      wikipedia: "https://pt.wikipedia.org/wiki/Frederico_II_da_Pr%C3%BAssia",
      image: {
        file: "frederico.jpg",
        author: "Johann Georg Ziesenis (recorte)",
        license: "Domínio público",
        source: "https://commons.wikimedia.org/wiki/File:Friedrich_der_Gro%C3%9Fe_-_Johann_Georg_Ziesenis_-_Google_Cultural_Institute_(cropped_2).jpg"
      }
    },
    {
      id: "catarina",
      profile: "despotism",
      name: "Catarina II da Rússia",
      dates: "1729–1796",
      origin: "Stettin, Pomerânia",
      role: "imperatriz da Rússia (1762–1796)",
      summary:
        "Princesa alemã que chegou ao trono russo por um golpe contra o próprio marido, trocava cartas com Voltaire e comprou a biblioteca de Diderot, sustentando-o em vida. Redigiu uma Instrução para reformar as leis, inspirada em Montesquieu e Beccaria, e fundou escolas, entre elas o Instituto Smolny para moças. Mas ampliou a servidão e reprimiu duramente a revolta de Pugatchov.",
      works: ["Instituto Smolny (1764)", "Instrução à Comissão Legislativa (1767)", "Carta da Nobreza (1785)"],
      wikipedia: "https://pt.wikipedia.org/wiki/Catarina_II_da_R%C3%BAssia",
      image: {
        file: "catarina.jpg",
        author: "Vigilius Eriksen",
        license: "Domínio público",
        source: "https://commons.wikimedia.org/wiki/File:Catherine_II_by_Vigilius_Eriksen.jpg"
      }
    },
    {
      id: "jose",
      profile: "despotism",
      name: "José II",
      dates: "1741–1790",
      origin: "Viena, Áustria",
      role: "imperador do Sacro Império e soberano dos Habsburgo",
      summary:
        "Filho de Maria Teresa, governou sozinho os domínios dos Habsburgo a partir de 1780 e tentou reformá-los de cima para baixo, em ritmo acelerado. Concedeu tolerância a protestantes e judeus, aboliu a servidão pessoal, fechou centenas de mosteiros e impôs o alemão na administração. A resistência foi tão grande que, pouco antes de morrer, revogou parte das reformas.",
      works: ["Édito de Tolerância (1781)", "Abolição da servidão pessoal (1781)", "Fechamento dos mosteiros contemplativos (a partir de 1782)"],
      wikipedia: "https://pt.wikipedia.org/wiki/Jos%C3%A9_II_do_Sacro_Imp%C3%A9rio_Romano-Germ%C3%A2nico",
      image: {
        file: "jose.jpg",
        author: "Anton von Maron (recorte)",
        license: "Domínio público",
        source: "https://commons.wikimedia.org/wiki/File:Anton_von_Maron_006.png"
      }
    },
    {
      id: "pombal",
      profile: "despotism",
      name: "Marquês de Pombal",
      dates: "1699–1782",
      origin: "Lisboa, Portugal",
      role: "secretário de Estado de D. José I (1750–1777)",
      summary:
        "Ministro todo-poderoso de D. José I, comandou a reconstrução de Lisboa depois do terremoto de 1755, com um traçado urbano racional. Expulsou os jesuítas, reformou a Universidade de Coimbra, criou companhias de comércio e acabou com a distinção entre cristãos-velhos e cristãos-novos. Não foi monarca, mas é o grande exemplo português do despotismo esclarecido, e governou com dureza contra opositores.",
      works: ["Reconstrução da Baixa de Lisboa (após 1755)", "Expulsão dos jesuítas (1759)", "Reforma da Universidade de Coimbra (1772)"],
      wikipedia: "https://pt.wikipedia.org/wiki/Sebasti%C3%A3o_Jos%C3%A9_de_Carvalho_e_Melo",
      image: {
        file: "pombal.jpg",
        author: "Pintor não identificado, escola portuguesa",
        license: "Domínio público",
        source: "https://commons.wikimedia.org/wiki/File:Retrato_do_Marqu%C3%AAs_de_Pombal_-_escola_portuguesa,_s%C3%A9c._XVIII.png"
      }
    },
    {
      id: "carlos",
      profile: "despotism",
      name: "Carlos III da Espanha",
      dates: "1716–1788",
      origin: "Madri, Espanha",
      role: "rei da Espanha (1759–1788)",
      summary:
        "Antes de reinar na Espanha, foi rei de Nápoles e da Sicília, onde patrocinou as escavações de Herculano e Pompeia. Em Madri, cercou-se de ministros reformistas, expulsou os jesuítas, limitou o poder da Igreja, abriu o comércio com a América a mais portos e promoveu obras públicas, academias e sociedades econômicas, sempre a partir da autoridade do rei.",
      works: ["Expulsão dos jesuítas (1767)", "Regulamento de livre comércio com a América (1778)", "Edifício do futuro Museu do Prado (iniciado em 1785)"],
      wikipedia: "https://pt.wikipedia.org/wiki/Carlos_III_de_Espanha",
      image: {
        file: "carlos.jpg",
        author: "Anton Raphael Mengs (recorte)",
        license: "Domínio público",
        source: "https://commons.wikimedia.org/wiki/File:Portrait_of_King_Charles_III_of_Spain_(by_Anton_Raphael_Mengs).jpg"
      }
    },
    {
      id: "leopoldo",
      profile: "despotism",
      name: "Leopoldo II da Toscana",
      dates: "1747–1792",
      origin: "Viena, Áustria",
      role: "grão-duque da Toscana (1765–1790) e imperador (1790–1792)",
      summary:
        "Como grão-duque da Toscana por 25 anos, fez do pequeno Estado um laboratório de reformas. Em 1786, a Toscana tornou-se o primeiro Estado moderno a abolir a pena de morte e a tortura, seguindo as ideias de Beccaria. Liberou o comércio de grãos e chegou a esboçar uma constituição. Mais prudente que o irmão José II, reformava depois de ouvir conselheiros.",
      works: ["Liberalização do comércio de grãos (1767)", "Código penal toscano, a Leopoldina (1786)", "Projeto de constituição para a Toscana (década de 1780)"],
      wikipedia: "https://pt.wikipedia.org/wiki/Leopoldo_II_do_Sacro_Imp%C3%A9rio_Romano-Germ%C3%A2nico",
      image: {
        file: "leopoldo.jpg",
        author: "Anton Hickel (recorte)",
        license: "Domínio público",
        source: "https://commons.wikimedia.org/wiki/File:Anton_Hickel_-_Portrait_of_Emperor_Leopold_II,_formerly_identified_as_Joseph_II.jpg"
      }
    }
  ];
});
