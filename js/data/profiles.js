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

  // `synthesis`: frase curta exibida no cartão do perfil.
  // `essence`: fragmento nominal usado na frase que combina os três perfis.
  return [
    {
      id: "philosophes",
      name: "Philosophes e Enciclopedistas",
      shortName: "Philosophes",
      period: "França e redes europeias, sobretudo 1715–1789",
      synthesis: "Mudar leis e costumes expondo tudo ao exame público e ao debate.",
      essence: "a crítica pública dos philosophes",
      description:
        "Este perfil transforma a razão em crítica pública. Leis, costumes e autoridades devem ser expostos ao exame de todos, e a opinião informada é o motor da mudança. Valoriza a circulação ampla do conhecimento, a tolerância e a redução do poder coercitivo das igrejas, mas raramente propõe romper com tudo: prefere convencer, satirizar e pressionar governantes a derrubá-los. A proximidade sugere gosto por debate aberto, imprensa livre e reforma pela persuasão, sem implicar concordância com cada autor do círculo.",
      ideas: [
        "Razão crítica e opinião pública",
        "Tolerância e liberdade de expressão",
        "Difusão do conhecimento",
        "Reforma de leis e poderes"
      ]
    },
    {
      id: "scottish",
      name: "Iluminismo Escocês",
      shortName: "Escocês",
      period: "Escócia, aproximadamente 1730–1800",
      synthesis: "Confiar na experiência, nos hábitos e no ajuste gradual do que já funciona.",
      essence: "o gradualismo empírico escocês",
      description:
        "Este perfil parte da experiência, não de princípios abstratos. Hábitos, comércio e milhares de decisões individuais produzem ordens que ninguém planejou, e por isso reformas devem observar antes de intervir e ajustar aos poucos. Desconfia de projetos que pretendem reconstruir a sociedade de uma vez; prefere testar, comparar e conservar o que provou funcionar. Reconhece que mercados e divisão do trabalho geram prosperidade, mas também registra seus custos. A proximidade indica gradualismo e confiança moderada em processos espontâneos, não defesa de um mercado sem regras.",
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
      synthesis: "Pensar por conta própria e agir por princípios que valeriam para qualquer pessoa.",
      essence: "a autonomia de princípios da Aufklärung",
      description:
        "Este perfil entende o esclarecimento como autonomia intelectual e formação do caráter. Agir bem não é só produzir bons resultados nem seguir sentimentos: é adotar princípios que qualquer pessoa razoável poderia aceitar e assumir a responsabilidade pelo que se decide. Educação, dever e coerência ocupam o centro, assim como a liberdade pública de argumentar dentro de instituições estáveis. A proximidade sugere valorização de fundamentos, maturidade de julgamento e regras universalizáveis, mais do que adesão a uma política específica.",
      ideas: [
        "Autonomia da razão",
        "Dever e princípios morais",
        "Educação e formação",
        "Liberdade pública de pensar"
      ]
    },
    {
      id: "italian",
      name: "Iluminismo Italiano",
      shortName: "Italiano",
      period: "Milão, Nápoles, Toscana e outros centros, 1720–1790",
      synthesis: "Regras escritas, penas proporcionais e instituições que se possam verificar.",
      essence: "o pragmatismo institucional italiano",
      description:
        "Este perfil aplica as luzes ao direito, à economia civil e à administração. Sua marca é a defesa de leis públicas e proporcionais, da limitação do arbítrio de quem julga ou governa e da confiança recíproca como base da prosperidade. Em vez de perguntar apenas o que é verdadeiro, pergunta como tribunais, impostos e serviços podem funcionar melhor para a felicidade pública. Colaborou com governos reformadores sem lhes conceder poder ilimitado. A proximidade sugere preferência por legalidade, transparência e reformas cujos efeitos possam ser verificados.",
      ideas: [
        "Legalidade e proporcionalidade",
        "Humanização das penas",
        "Felicidade pública",
        "Economia civil e confiança"
      ]
    },
    {
      id: "american",
      name: "Iluminismo Americano",
      shortName: "Americano",
      period: "América britânica e Estados Unidos, 1740–1800",
      synthesis: "Direitos que limitam qualquer maioria e poder dividido para conter abusos.",
      essence: "o constitucionalismo de direitos americano",
      description:
        "Este perfil traduz direitos em instituições. Governos legítimos dependem do consentimento; certos direitos valem contra qualquer maioria; e o poder deve ser dividido e fiscalizado para conter abusos. Regras escritas, representação, tribunais independentes e liberdade religiosa aparecem como respostas realistas a interesses e facções. A corrente histórica carregou contradições profundas, como a escravidão, e a proximidade não implica aprová-las. Indica, sim, preferência por participação mediada por regras, garantias individuais e freios institucionais.",
      ideas: [
        "Consentimento dos governados",
        "Direitos anteriores ao Estado",
        "Freios constitucionais",
        "Liberdade religiosa"
      ]
    },
    {
      id: "iberian",
      name: "Iluminismo Ibérico e Ibero-americano",
      shortName: "Ibérico",
      period: "Espanha, Portugal e Américas ibéricas, 1720–1820",
      synthesis: "Modernizar pelo alto com escolas, ciência útil e religião reformada.",
      essence: "o reformismo modernizador ibérico",
      description:
        "Este perfil combina modernização conduzida pelo Estado, ciência útil e religião depurada. Diante do diagnóstico de atraso, aposta em ensino renovado, formação técnica, fomento à produção e controle público de privilégios, inclusive eclesiásticos. A religião não precisa desaparecer: deve servir ao interesse público e livrar-se do que atrasa. Nas Américas, a mesma linguagem de utilidade passou a sustentar críticas aos monopólios. A proximidade sugere confiança em educação, planejamento público e regeneração gradual, com atenção à cultura local.",
      ideas: [
        "Ciência e educação úteis",
        "Catolicismo reformado",
        "Fomento econômico estatal",
        "Modernização administrativa"
      ]
    },
    {
      id: "radical",
      name: "Iluminismo Radical",
      shortName: "Radical",
      period: "Redes europeias, do fim do século XVII à Revolução Francesa",
      synthesis: "Igualdade sem privilégios, decisão pela maioria e explicação natural do mundo.",
      essence: "o igualitarismo radical",
      description:
        "Este perfil leva a crítica racional às últimas consequências: explicações naturais bastam para entender o mundo, a moral não depende de revelação, e hierarquias sociais ou políticas não têm fundamento sagrado. Por isso, reformas parciais parecem insuficientes diante de instituições que preservam privilégios; a vontade popular deve ter a última palavra. A categoria é debatida entre historiadores e reúne autores que divergiam entre si. A proximidade indica afinidade com igualdade, soberania popular e crítica religiosa ampla, não adesão a um programa único.",
      ideas: [
        "Naturalismo e crítica religiosa",
        "Igualdade civil ampliada",
        "Soberania popular",
        "Liberdade de pensamento abrangente"
      ]
    },
    {
      id: "moderate",
      name: "Iluminismo Moderado e Religioso",
      shortName: "Moderado/Religioso",
      period: "Europa e Atlântico, do fim do século XVII ao XVIII",
      synthesis: "Razão e fé lado a lado, com mudanças que preservem os laços da comunidade.",
      essence: "a conciliação moderada entre razão e fé",
      description:
        "Este perfil busca conciliar ciência, razão e uma ordem transcendente. A religião deve tornar-se mais racional e tolerante, mas continua oferecendo linguagem moral, sentido e continuidade. Reformas são graduais, conduzidas por educação e melhoria dos costumes, evitando rupturas que destruam vínculos úteis. A categoria abriga deístas, protestantes, católicos e judeus com diferenças profundas e funciona aqui como um denominador comum. A proximidade sugere que progresso e crença podem cooperar e que tolerância não exige retirar toda religião da vida pública.",
      ideas: [
        "Compatibilidade entre razão e fé",
        "Religião racional e tolerante",
        "Continuidade social",
        "Reforma moral gradual"
      ]
    },
    {
      id: "despotism",
      name: "Despotismo Esclarecido",
      shortName: "Despotismo Esclarecido",
      period: "Estados europeus, principalmente 1740–1790",
      synthesis: "Reforma decidida por quem sabe e executada de cima, sem esperar consulta.",
      essence: "a reforma centralizada do despotismo esclarecido",
      description:
        "Este perfil confia na reforma racional conduzida por um poder central forte. Governantes e administradores especializados podem uniformizar leis, impostos e educação, enfrentar privilégios e elevar o bem-estar sem depender de participação popular; tolerância e secularização aparecem como instrumentos de boa administração. O modelo produziu reformas reais, mas preservou censura e hierarquias, e não significa ausência de leis: muitos reformadores buscaram codificação e previsibilidade. A proximidade indica prioridade à capacidade de executar, com o risco conhecido de baixa prestação de contas.",
      ideas: [
        "Reforma pelo alto",
        "Centralização administrativa",
        "Bem-estar como dever do soberano",
        "Tolerância por utilidade pública"
      ]
    },
    {
      id: "physiocracy",
      name: "Fisiocracia e Economia Política",
      shortName: "Fisiocracia",
      period: "França e redes europeias, sobretudo 1750–1780",
      synthesis: "Proteger a propriedade e a produção e deixar a economia seguir suas próprias leis.",
      essence: "a confiança fisiocrática na ordem econômica",
      description:
        "Este perfil entende que a economia tem regularidades próprias que governos devem conhecer e respeitar. Liberdade de produção e circulação, proteção da propriedade e impostos simples são preferíveis a monopólios, corporações e controles minuciosos. Em sua forma estrita, atribui à terra e à produção primária o papel central na geração de riqueza e admite autoridade forte para proteger essa ordem. A economia política posterior reformulou parte dessas teses. A proximidade sugere confiança em regras econômicas gerais e baixa intervenção cotidiana.",
      ideas: [
        "Ordem econômica natural",
        "Liberdade de produção e circulação",
        "Primazia agrária",
        "Tributação simples da renda da terra"
      ]
    }
  ];
});
