# Matriz de conteúdo

Versão do instrumento: `3.0.0`. Gerado por `node scripts/generate-blueprint.js`.

Esta matriz documenta as cargas usadas pelo algoritmo. Não deve ser entregue aos respondentes antes da conclusão: tornaria transparentes as associações que o questionário procura medir de forma indireta.

Cada conjunto de reações toca dois ou três eixos. Cada reação carrega valores de −2 a +2 nesses eixos (positivo = segundo polo do eixo). A reação **mais próxima** soma as cargas; a **mais distante** subtrai. As tensões pontuam direto no eixo, de −2 a +2, multiplicadas por 2. A posição do respondente em cada eixo é normalizada pelo máximo teórico e comparada por cosseno com o vetor de cada perfil.

## Eixos e vetores dos perfis

| Eixo | Polo − | Polo + | Philosophes | Escocês | Aufklärung | Radical | Despotismo Esclarecido |
|---|---|---|---:|---:|---:|---:|---:|
| Fonte do juízo | Princípio | Experiência | 0 | +2 | -2 | -1 | 0 |
| Religião na vida pública | Laicidade | Acomodação | -1 | +1 | +1 | -2 | 0 |
| Direção da mudança | De cima | De baixo | +1 | 0 | 0 | +2 | -2 |
| Ritmo da mudança | Ruptura | Gradualismo | +1 | +2 | +1 | -2 | -1 |
| Última palavra | Direitos e princípios | Vontade coletiva | -1 | 0 | -2 | +2 | 0 |
| Origem da boa ordem | Desenho deliberado | Ordem espontânea | 0 | +2 | -1 | -1 | -2 |
| Alcance das regras | Universal | Local | 0 | +2 | -2 | -1 | -1 |
| Motor da moral | Dever e razão | Sentimento e utilidade | +1 | +2 | -2 | +1 | 0 |
| Papel da publicidade | Discrição | Publicidade | +2 | 0 | +1 | +1 | -2 |

## Cobertura por eixo

| Eixo | Cenários fixos | Dois tempos | Tensões | Máximo bruto |
|---|---:|---:|---:|---:|
| Fonte do juízo | 8 | 3 | 1 | 60 |
| Religião na vida pública | 8 | 1 | 1 | 34 |
| Direção da mudança | 8 | 1 | 1 | 44 |
| Ritmo da mudança | 8 | 1 | 1 | 44 |
| Última palavra | 8 | 1 | 1 | 44 |
| Origem da boa ordem | 8 | 1 | 1 | 44 |
| Alcance das regras | 8 | 1 | 1 | 44 |
| Motor da moral | 8 | 1 | 1 | 44 |
| Papel da publicidade | 8 | 2 | 1 | 52 |

## Separação par a par

Número de conjuntos de reações (fixos e dois tempos, contando cada tempo) em que as reações dos dois perfis diferem em pelo menos 2 pontos em algum eixo. Mínimo exigido: 8.

| | Philosophes | Escocês | Aufklärung | Radical | Despotismo Esclarecido |
|---|---:|---:|---:|---:|---:|
| Philosophes | · | 32 | 28 | 19 | 25 |
| Escocês | 32 | · | 30 | 32 | 32 |
| Aufklärung | 28 | 30 | · | 32 | 32 |
| Radical | 19 | 32 | 32 | · | 25 |
| Despotismo Esclarecido | 25 | 32 | 32 | 25 | · |

## Cenários fixos

### c01 — Reforma da praça

Eixos: Direção da mudança, Ritmo da mudança, Origem da boa ordem.

A praça central será reformada. A secretaria de obras tem um projeto pronto; o conselho de moradores quer decidir o desenho em assembleia. A verba vence em três meses.

| Reação | Perfil | Texto | Cargas |
|---|---|---|---|
| a | Philosophes | Expor o projeto e as alternativas em audiências abertas e decidir depois, mesmo que a verba atrase. | Direção +1; Ritmo +1; Origem 0 |
| b | Escocês | Fazer só o reparo urgente e ver como as pessoas usam a praça antes de redesenhar qualquer coisa. | Direção 0; Ritmo +2; Origem +2 |
| c | Aufklärung | Definir primeiro o critério que decidirá esta e qualquer outra obra da cidade; a praça espera. | Direção 0; Ritmo +1; Origem -1 |
| d | Radical | A assembleia decide tudo agora e a secretaria executa o que for votado, mesmo sem projeto técnico. | Direção +2; Ritmo -2; Origem -1 |
| e | Despotismo Esclarecido | Executar já o projeto da secretaria; quem estudou o assunto decide, e o conselho é informado depois. | Direção -2; Ritmo -1; Origem -2 |

### c02 — Símbolo religioso no tribunal

Eixos: Religião na vida pública, Última palavra, Alcance das regras.

A sala de audiências do fórum da cidade exibe há décadas um símbolo religioso. Um advogado pede a retirada. A maioria dos servidores quer manter.

| Reação | Perfil | Texto | Cargas |
|---|---|---|---|
| a | Philosophes | Retirar: um tribunal não pode parecer tomar partido de uma crença, ainda que a maioria se ofenda. | Religião -1; Última -1; Alcance 0 |
| b | Escocês | Manter: o símbolo faz parte da história daquela casa, e cada cidade resolve isso do seu jeito. | Religião +1; Última 0; Alcance +2 |
| c | Aufklärung | Decidir por um princípio que valha em qualquer tribunal do país, e não pelo que esta cidade prefere. | Religião 0; Última -2; Alcance -2 |
| d | Radical | Retirar todos os símbolos de fé dos prédios públicos de uma vez; quem decide são os cidadãos, não os juízes. | Religião -2; Última +2; Alcance -1 |
| e | Despotismo Esclarecido | A administração do tribunal decide sozinha, com discrição, e padroniza a regra para todas as salas. | Religião 0; Última 0; Alcance -1 |

### c03 — Promessa a um amigo

Eixos: Fonte do juízo, Motor da moral, Origem da boa ordem.

Você prometeu ajudar um amigo a se mudar no sábado. Na sexta, surge um trabalho pago de que você precisa, no mesmo horário. O amigo diz que dá um jeito.

| Reação | Perfil | Texto | Cargas |
|---|---|---|---|
| a | Philosophes | Conversar com franqueza e decidir junto com ele o que faz menos mal aos dois. | Fonte 0; Motor +1; Origem 0 |
| b | Escocês | Ir ao trabalho: entre amigos, isso se acerta na hora, como sempre se acertou. | Fonte +2; Motor +2; Origem +2 |
| c | Aufklärung | Cumprir a promessa e perder o trabalho: uma promessa que cede à conveniência não é promessa. | Fonte -2; Motor -2; Origem -1 |
| d | Radical | Ir ao trabalho; obrigações por costume não valem, e é isso que eu diria a qualquer um. | Fonte -1; Motor +1; Origem -1 |
| e | Despotismo Esclarecido | Ir ao trabalho e resolver a mudança com um plano: pagar carregadores e organizar tudo por ele. | Fonte 0; Motor 0; Origem -2 |

### c04 — Fechamento de uma escola

Eixos: Direção da mudança, Papel da publicidade, Ritmo da mudança.

A prefeitura vai fechar uma escola pequena com poucos alunos e transferir as crianças para outra maior. As famílias souberam pela imprensa.

| Reação | Perfil | Texto | Cargas |
|---|---|---|---|
| a | Philosophes | Publicar os números e as alternativas e debater em audiência antes de fechar, mesmo adiando um ano. | Direção +1; Papel +2; Ritmo +1 |
| b | Escocês | Manter a escola aberta mais um tempo e reduzir aos poucos, observando o que acontece com as famílias. | Direção 0; Papel 0; Ritmo +2 |
| c | Aufklärung | Definir e divulgar o critério que fecha ou mantém qualquer escola do município; só então aplicar aqui. | Direção 0; Papel +1; Ritmo +1 |
| d | Radical | As famílias decidem em assembleia se a escola fecha; a prefeitura executa o que for decidido, já. | Direção +2; Papel +1; Ritmo -2 |
| e | Despotismo Esclarecido | Fechar conforme o plano da secretaria, sem consulta; anunciar só depois de resolver as transferências. | Direção -2; Papel -2; Ritmo -1 |

### c05 — Novas linhas de ônibus

Eixos: Fonte do juízo, Origem da boa ordem, Direção da mudança.

A cidade vai redesenhar as linhas de ônibus. Há um estudo técnico completo e um pedido de motoristas e passageiros para testar as mudanças aos poucos.

| Reação | Perfil | Texto | Cargas |
|---|---|---|---|
| a | Philosophes | Levar o estudo aos bairros, ouvir quem usa o ônibus e ajustar com eles antes de mudar. | Fonte 0; Origem 0; Direção +1 |
| b | Escocês | Mudar uma linha por vez e observar; o que os passageiros fizerem mostra o desenho que serve. | Fonte +2; Origem +2; Direção 0 |
| c | Aufklärung | Partir do princípio de que cada bairro tem direito ao mesmo acesso e desenhar tudo a partir daí. | Fonte -2; Origem -1; Direção 0 |
| d | Radical | Passageiros e motoristas desenham as linhas em assembleias; o estudo técnico é apenas um insumo. | Fonte -1; Origem -1; Direção +2 |
| e | Despotismo Esclarecido | Implantar o estudo inteiro de uma vez; redesenho por partes vira remendo, e quem entende já decidiu. | Fonte 0; Origem -2; Direção -2 |

### c06 — Celebração religiosa na empresa

Eixos: Religião na vida pública, Motor da moral, Ritmo da mudança.

Uma empresa faz todo fim de ano uma celebração religiosa. Funcionários de outras crenças pediram mudança. A diretoria pergunta sua opinião.

| Reação | Perfil | Texto | Cargas |
|---|---|---|---|
| a | Philosophes | Trocar aos poucos por uma festa sem culto; explicar o motivo e aceitar que alguns fiquem chateados. | Religião -1; Motor +1; Ritmo +1 |
| b | Escocês | Manter a celebração como está: ela une a equipe há anos, e mudar por queixa de poucos custa mais. | Religião +1; Motor +2; Ritmo +2 |
| c | Aufklärung | Manter, desde que ninguém seja obrigado a participar; a regra vale para qualquer fé que peça o mesmo. | Religião +1; Motor -2; Ritmo +1 |
| d | Radical | Encerrar toda celebração religiosa já; empresa não é lugar de culto, e quem quiser reza fora dela. | Religião -2; Motor +1; Ritmo -2 |
| e | Despotismo Esclarecido | A diretoria decide o formato deste ano e comunica; não é assunto para consulta interna. | Religião 0; Motor 0; Ritmo -1 |

### c07 — Costume da filial no exterior

Eixos: Última palavra, Alcance das regras, Motor da moral.

Uma empresa abre uma filial em outro país, onde é costume dar presentes a fiscais. A matriz proíbe. A equipe local diz que sem isso nada anda.

| Reação | Perfil | Texto | Cargas |
|---|---|---|---|
| a | Philosophes | Não dar presentes e tornar público o atraso que isso causa, para pressionar por mudança lá. | Última -1; Alcance 0; Motor +1 |
| b | Escocês | Seguir o costume local dentro de limites; quem vive lá sabe o que funciona e o que ofende. | Última 0; Alcance +2; Motor +2 |
| c | Aufklärung | Não dar presentes em nenhuma circunstância, mesmo que a filial feche; o que é suborno aqui é suborno lá. | Última -2; Alcance -2; Motor -2 |
| d | Radical | A equipe local vota e decide como agir; a matriz não tem autoridade sobre quem vive as consequências. | Última +2; Alcance -1; Motor +1 |
| e | Despotismo Esclarecido | A matriz define uma regra única para todas as filiais e a impõe, sem discutir com a equipe local. | Última 0; Alcance -1; Motor 0 |

### c08 — Horário do comércio

Eixos: Direção da mudança, Origem da boa ordem, Alcance das regras.

Uma lei nacional padroniza o horário do comércio. A cidade fecha ao meio-dia há gerações. Os comerciantes estão divididos.

| Reação | Perfil | Texto | Cargas |
|---|---|---|---|
| a | Philosophes | Abrir o debate na cidade e levar a posição dos comerciantes a quem fez a lei, para revê-la. | Direção +1; Origem 0; Alcance 0 |
| b | Escocês | Manter o costume; ele funciona aqui há gerações, e a lei que ignorar isso será ignorada. | Direção 0; Origem +2; Alcance +2 |
| c | Aufklärung | Cumprir a regra nacional: uma lei que vale para todos não pode ter exceção por costume local. | Direção 0; Origem -1; Alcance -2 |
| d | Radical | Comerciantes e moradores votam o horário; nem a tradição nem a lei decidem por eles. | Direção +2; Origem -1; Alcance -1 |
| e | Despotismo Esclarecido | Aplicar a lei de imediato e fiscalizar; padronizar o país exige que cada cidade ceda um pouco. | Direção -2; Origem -2; Alcance -1 |

### c09 — Erro de um colega

Eixos: Fonte do juízo, Ritmo da mudança, Papel da publicidade.

Um colega cometeu um erro que custou caro à equipe, e ninguém fora do grupo sabe. O chefe pergunta como tratar o caso.

| Reação | Perfil | Texto | Cargas |
|---|---|---|---|
| a | Philosophes | Relatar o erro abertamente a toda a equipe, para que sirva de aprendizado, mesmo constrangendo o colega. | Fonte 0; Ritmo +1; Papel +2 |
| b | Escocês | Resolver em conversa reservada; a experiência mostra que expor erros gera mais medo do que cuidado. | Fonte +2; Ritmo +2; Papel 0 |
| c | Aufklärung | Aplicar a regra que valeria para qualquer um, sem exceção por simpatia, e registrar o que foi feito. | Fonte -2; Ritmo +1; Papel +1 |
| d | Radical | Levar ao grupo agora e decidir juntos a consequência; ninguém acima da equipe, chefe incluído. | Fonte -1; Ritmo -2; Papel +1 |
| e | Despotismo Esclarecido | O chefe decide a consequência sozinho, com discrição, e comunica só ao colega; o resto segue. | Fonte 0; Ritmo -1; Papel -2 |

### c10 — Ensino religioso na escola pública

Eixos: Religião na vida pública, Direção da mudança, Última palavra.

Uma escola pública recebe pedido de pais para incluir ensino religioso no horário regular. Professores e outros pais se opõem.

| Reação | Perfil | Texto | Cargas |
|---|---|---|---|
| a | Philosophes | Não incluir no horário regular; abrir o debate na escola e defender essa posição em público. | Religião -1; Direção +1; Última -1 |
| b | Escocês | Manter o que a escola já faz; em questão de fé, o costume da comunidade pesa mais que argumentos. | Religião +1; Direção 0; Última 0 |
| c | Aufklärung | Permitir como disciplina optativa sob regra igual para toda fé; ninguém obrigado, ninguém excluído. | Religião +1; Direção 0; Última -2 |
| d | Radical | Nenhum ensino religioso em escola pública; as demais regras da escola, os pais votam. | Religião -2; Direção +2; Última +2 |
| e | Despotismo Esclarecido | A secretaria de educação decide para toda a rede e não abre consulta; escola não é lugar de disputa. | Religião 0; Direção -2; Última 0 |

### c11 — Infecções em uma ala do hospital

Eixos: Papel da publicidade, Alcance das regras, Ritmo da mudança.

Um hospital descobre que uma de suas alas tem taxa de infecção acima da média. A direção discute o que fazer com a informação.

| Reação | Perfil | Texto | Cargas |
|---|---|---|---|
| a | Philosophes | Divulgar os números e o plano de correção, mesmo assustando pacientes; a pressão pública acelera. | Papel +2; Alcance 0; Ritmo +1 |
| b | Escocês | Corrigir por dentro, ala por ala, como já se fez em outros casos; alarde não cura ninguém. | Papel 0; Alcance +2; Ritmo +2 |
| c | Aufklärung | Seguir o protocolo que qualquer hospital deveria seguir: informar quem foi afetado e o órgão regulador. | Papel +1; Alcance -2; Ritmo +1 |
| d | Radical | Divulgar tudo agora e afastar de imediato os responsáveis; os pacientes têm direito de saber hoje. | Papel +1; Alcance -1; Ritmo -2 |
| e | Despotismo Esclarecido | Resolver em silêncio e rápido, com uma equipe designada; divulgar só depois de corrigido. | Papel -2; Alcance -1; Ritmo -1 |

### c12 — Fila da cirurgia

Eixos: Fonte do juízo, Última palavra, Alcance das regras.

O hospital municipal tem fila para uma cirurgia que não é urgente e não vai atender todos este ano. É preciso definir a ordem.

| Reação | Perfil | Texto | Cargas |
|---|---|---|---|
| a | Philosophes | Um critério anunciado e justificado a todos, que ninguém possa mudar depois por pressão de grupos. | Fonte 0; Última -1; Alcance 0 |
| b | Escocês | Seguir a ordem que os médicos daqui já usam; ela vem de anos de prática e as pessoas a conhecem. | Fonte +2; Última 0; Alcance +2 |
| c | Aufklärung | A ordem que qualquer pessoa aceitaria sem saber sua posição na fila, igual em qualquer hospital. | Fonte -2; Última -2; Alcance -2 |
| d | Radical | Sorteio entre todos os inscritos, decidido em assembleia; ninguém tem mais direito do que outro. | Fonte -1; Última +2; Alcance -1 |
| e | Despotismo Esclarecido | Uma equipe técnica ordena os casos por um padrão único e não recebe recursos nem pressão. | Fonte 0; Última 0; Alcance -1 |

### c13 — Igreja em terreno público

Eixos: Direção da mudança, Papel da publicidade, Religião na vida pública.

Uma igreja usa há anos um terreno público para seus eventos. A prefeitura quer retomá-lo para construir um posto de saúde. Fiéis protestam.

| Reação | Perfil | Texto | Cargas |
|---|---|---|---|
| a | Philosophes | Publicar o contrato e os custos e debater em audiência; um culto não tem prioridade sobre um posto. | Direção +1; Papel +2; Religião -1 |
| b | Escocês | Buscar um acordo com a igreja que preserve os eventos; ela faz parte da vida do bairro. | Direção 0; Papel 0; Religião +1 |
| c | Aufklärung | Aplicar a regra de uso de terrenos públicos igual para qualquer grupo, religioso ou não, e explicá-la. | Direção 0; Papel +1; Religião +1 |
| d | Radical | Retomar o terreno agora; os moradores votam o uso, e nenhuma igreja tem privilégio sobre bem público. | Direção +2; Papel +1; Religião -2 |
| e | Despotismo Esclarecido | A prefeitura retoma por decisão administrativa, sem audiência; o posto é prioridade e ponto final. | Direção -2; Papel -2; Religião 0 |

### c14 — Código de ética

Eixos: Origem da boa ordem, Motor da moral, Religião na vida pública.

Uma empresa média teve casos de desvio de conduta. A diretoria quer criar um código de ética e discute em que ele deve se apoiar.

| Reação | Perfil | Texto | Cargas |
|---|---|---|---|
| a | Philosophes | Princípios discutidos abertamente por todos, sem apelo a crenças, e revistos quando causarem dano. | Origem 0; Motor +1; Religião -1 |
| b | Escocês | Poucas regras e muito exemplo dos mais antigos; conduta se aprende observando, não lendo. | Origem +2; Motor +2; Religião +1 |
| c | Aufklärung | Deveres que qualquer funcionário reconheceria como válidos mesmo sem ninguém vigiando, escritos com clareza. | Origem -1; Motor -2; Religião +1 |
| d | Radical | Regras iguais do estagiário ao diretor, votadas por todos, sem referência a valores religiosos. | Origem -1; Motor +1; Religião -2 |
| e | Despotismo Esclarecido | Um código redigido pela diretoria com consultoria, imposto de cima e fiscalizado com rigor. | Origem -2; Motor 0; Religião 0 |

### c15 — Modelo de gestão de outro país

Eixos: Fonte do juízo, Alcance das regras, Ritmo da mudança.

A prefeitura quer copiar um modelo de gestão escolar que deu resultado em outro país. Muitos professores desconfiam.

| Reação | Perfil | Texto | Cargas |
|---|---|---|---|
| a | Philosophes | Traduzir as pesquisas, divulgar tudo e debater com os professores antes de decidir qualquer coisa. | Fonte 0; Alcance 0; Ritmo +1 |
| b | Escocês | Não copiar; o que funcionou lá nasceu de outra história. Ajustar aos poucos o que já existe aqui. | Fonte +2; Alcance +2; Ritmo +2 |
| c | Aufklärung | Adotar o que se justifica por princípios válidos em qualquer escola, em etapas, com metas claras. | Fonte -2; Alcance -2; Ritmo +1 |
| d | Radical | Adotar inteiro e já, se os professores votarem a favor; o que serve às crianças de lá serve aqui. | Fonte -1; Alcance -1; Ritmo -2 |
| e | Despotismo Esclarecido | Adotar o modelo inteiro por decisão da secretaria; adaptação demais é desculpa para não mudar nada. | Fonte 0; Alcance -1; Ritmo -1 |

### c16 — Poderes de emergência

Eixos: Última palavra, Direção da mudança, Origem da boa ordem.

Uma enchente atingiu a cidade. O prefeito pede poderes para gastar e desapropriar sem passar pela câmara durante seis meses.

| Reação | Perfil | Texto | Cargas |
|---|---|---|---|
| a | Philosophes | Negar; a câmara vota cada medida em regime de urgência, em sessão aberta, mesmo que atrase. | Última -1; Direção +1; Origem 0 |
| b | Escocês | Apoiar quem já está se organizando nos bairros; o socorro espontâneo chega antes de qualquer decreto. | Última 0; Direção 0; Origem +2 |
| c | Aufklärung | Conceder só o que a lei de emergência já previa antes da enchente; nada de poderes criados na hora. | Última -2; Direção 0; Origem -1 |
| d | Radical | Os atingidos formam um comitê e decidem onde gastar; nem prefeito nem câmara acima deles. | Última +2; Direção +2; Origem -1 |
| e | Despotismo Esclarecido | Conceder os poderes; em emergência, quem executa precisa decidir sem esperar votação nem consulta. | Última 0; Direção -2; Origem -2 |

### c17 — Objeto sagrado no museu

Eixos: Religião na vida pública, Alcance das regras, Motor da moral.

Um museu exibe um objeto considerado sagrado por uma comunidade religiosa, que pede a devolução. O museu diz que o objeto é patrimônio de todos.

| Reação | Perfil | Texto | Cargas |
|---|---|---|---|
| a | Philosophes | Manter em exposição, explicando sua história como a de qualquer objeto, e ouvir a comunidade em público. | Religião -1; Alcance 0; Motor +1 |
| b | Escocês | Devolver; o que o objeto significa para os fiéis daquele lugar pesa mais que o interesse de visitantes. | Religião +1; Alcance +2; Motor +2 |
| c | Aufklärung | Decidir pela regra que valeria para qualquer objeto sagrado de qualquer povo, e aplicá-la sem exceção. | Religião +1; Alcance -2; Motor -2 |
| d | Radical | Manter; nenhum objeto merece tratamento diferente por ser chamado de sagrado, aqui ou em qualquer lugar. | Religião -2; Alcance -1; Motor +1 |
| e | Despotismo Esclarecido | A direção do museu decide conforme a política nacional de acervos e não negocia caso a caso. | Religião 0; Alcance -1; Motor 0 |

### c18 — Vantagem antiga de um grupo

Eixos: Ritmo da mudança, Última palavra, Origem da boa ordem.

Um grupo da cidade tem há décadas uma isenção que os outros não têm. Um movimento pede o fim imediato; outros propõem uma transição de dez anos.

| Reação | Perfil | Texto | Cargas |
|---|---|---|---|
| a | Philosophes | Expor a vantagem em números e argumentos; transição curta, mas sem depender de quem grita mais. | Ritmo +1; Última -1; Origem 0 |
| b | Escocês | Transição longa; a cidade se arranjou em torno dessa vantagem, e romper de uma vez desorganiza tudo. | Ritmo +2; Última 0; Origem +2 |
| c | Aufklärung | Acabar por uma regra que proíba qualquer vantagem desse tipo, com prazo fixo e igual para todos. | Ritmo +1; Última -2; Origem -1 |
| d | Radical | Fim imediato, decidido em plebiscito; privilégio não fica menos privilégio por ser antigo. | Ritmo -2; Última +2; Origem -1 |
| e | Despotismo Esclarecido | A prefeitura acaba com a vantagem por decreto, dentro de um plano geral de reorganização das isenções. | Ritmo -1; Última 0; Origem -2 |

### c19 — Jovem contra o plano da família

Eixos: Fonte do juízo, Alcance das regras, Motor da moral.

Um jovem de dezenove anos quer abandonar a carreira que a família planejou e seguir outra. Os pais pedem que você converse com ele.

| Reação | Perfil | Texto | Cargas |
|---|---|---|---|
| a | Philosophes | Ouvir os dois lados e ajudar a conversa a acontecer; o que preserva os laços e evita sofrimento inútil. | Fonte 0; Alcance 0; Motor +1 |
| b | Escocês | Que experimente por um tempo antes de romper; em famílias como a dele, a prática costuma mostrar o rumo. | Fonte +2; Alcance +2; Motor +2 |
| c | Aufklärung | Ele tem idade para decidir por si e deve fazê-lo por princípio, como qualquer adulto, doa a quem doer. | Fonte -2; Alcance -2; Motor -2 |
| d | Radical | Ninguém tem autoridade sobre a vida de um adulto, em família alguma; que siga o que lhe faz bem. | Fonte -1; Alcance -1; Motor +1 |
| e | Despotismo Esclarecido | Quem sustenta a casa decide; a regra é a mesma em qualquer família até ele se sustentar sozinho. | Fonte 0; Alcance -1; Motor 0 |

### c20 — Campanha para reconstruir a escola

Eixos: Motor da moral, Papel da publicidade, Religião na vida pública.

A cidade organiza uma campanha para reconstruir uma escola incendiada. Discute-se se a lista de doadores será pública e se igrejas podem coordenar a coleta.

| Reação | Perfil | Texto | Cargas |
|---|---|---|---|
| a | Philosophes | Lista pública de doadores e contas abertas; coleta sem igrejas, para não misturar fé e obra pública. | Motor +1; Papel +2; Religião -1 |
| b | Escocês | Deixar as igrejas coordenarem, como sempre fizeram por aqui; elas chegam onde a prefeitura não chega. | Motor +2; Papel 0; Religião +1 |
| c | Aufklärung | Doar é dever, não gesto para plateia; publicar só os valores, e igrejas com as mesmas regras que os demais. | Motor -2; Papel +1; Religião +1 |
| d | Radical | Coleta pública e igual para todos, sem igreja no comando; prestação de contas aberta em assembleia. | Motor +1; Papel +1; Religião -2 |
| e | Despotismo Esclarecido | A prefeitura centraliza a coleta e não divulga doadores; quem doa quer resultado, não exposição. | Motor 0; Papel -2; Religião 0 |

### c21 — Desvio na prefeitura

Eixos: Fonte do juízo, Papel da publicidade, Direção da mudança.

Descobre-se um esquema de desvio de dinheiro em um setor da prefeitura. Discute-se quem conduz a apuração e se ela será pública.

| Reação | Perfil | Texto | Cargas |
|---|---|---|---|
| a | Philosophes | Apuração com sessões abertas e relatórios publicados; a cidade acompanha e cobra, mesmo que atrapalhe. | Fonte 0; Papel +2; Direção +1 |
| b | Escocês | Seguir o procedimento que a casa já usa em casos assim; ele existe porque funcionou, e mudar agora improvisa. | Fonte +2; Papel 0; Direção 0 |
| c | Aufklärung | Aplicar o rito previsto em lei sem exceção, com relatório final público, sejam quais forem os envolvidos. | Fonte -2; Papel +1; Direção 0 |
| d | Radical | Uma comissão de cidadãos sorteados conduz a apuração e divulga tudo; servidores não julgam servidores. | Fonte -1; Papel +1; Direção +2 |
| e | Despotismo Esclarecido | O prefeito nomeia alguém de confiança, apura em sigilo e afasta quem for preciso; divulgação depois. | Fonte 0; Papel -2; Direção -2 |

### c22 — Juíza diante de uma lei dura

Eixos: Última palavra, Fonte do juízo, Origem da boa ordem.

Uma juíza deve aplicar uma lei que prevê pena pesada para um caso pequeno. A lei é clara. Ela tem alguma margem para decidir.

| Reação | Perfil | Texto | Cargas |
|---|---|---|---|
| a | Philosophes | Aplicar a lei e escrever na sentença, para quem quiser ler, por que ela deveria mudar. | Última -1; Fonte 0; Origem 0 |
| b | Escocês | Ver como casos parecidos foram tratados nesta comarca e seguir o que a prática consolidou. | Última 0; Fonte +2; Origem +2 |
| c | Aufklärung | Julgar pelo princípio que valeria para todos os casos iguais, mesmo contrariando a letra da lei. | Última -2; Fonte -2; Origem -1 |
| d | Radical | Aplicar a pena mínima possível; leis feitas contra o povo se contornam até que o povo as mude. | Última +2; Fonte -1; Origem -1 |
| e | Despotismo Esclarecido | Aplicar a lei como está; juiz que ajusta pena por consciência desorganiza o sistema inteiro. | Última 0; Fonte 0; Origem -2 |

### c23 — Corte de funcionários

Eixos: Papel da publicidade, Motor da moral, Ritmo da mudança.

Uma empresa precisa cortar um quinto dos funcionários. A diretoria discute como e quando comunicar.

| Reação | Perfil | Texto | Cargas |
|---|---|---|---|
| a | Philosophes | Anunciar a todos agora, com os números, e abrir um período de conversa antes de definir nomes. | Papel +2; Motor +1; Ritmo +1 |
| b | Escocês | Cortar aos poucos, começando por quem já está saindo; cada gerente conversa com sua equipe do seu jeito. | Papel 0; Motor +2; Ritmo +2 |
| c | Aufklärung | Definir o critério de corte antes de olhar nomes, publicá-lo e aplicá-lo mesmo que atinja quem se gosta. | Papel +1; Motor -2; Ritmo +1 |
| d | Radical | Comunicar tudo hoje, de uma vez, e deixar que os funcionários decidam em conjunto como dividir o corte. | Papel +1; Motor +1; Ritmo -2 |
| e | Despotismo Esclarecido | Decidir em sigilo, cortar tudo num dia e comunicar cada um individualmente; arrastar só agrava. | Papel -2; Motor 0; Ritmo -1 |

### c24 — Templo de uma religião recém-chegada

Eixos: Religião na vida pública, Papel da publicidade, Última palavra.

Um grupo religioso recém-chegado quer construir um templo. Vizinhos protestam e pedem consulta popular. A prefeitura pede pareceres.

| Reação | Perfil | Texto | Cargas |
|---|---|---|---|
| a | Philosophes | Autorizar; debater em público o que a cidade entende por convivência, mas o direito não depende de votação. | Religião -1; Papel +2; Última -1 |
| b | Escocês | Autorizar com diálogo entre as lideranças religiosas do bairro, para que o templo entre na vida local. | Religião +1; Papel 0; Última 0 |
| c | Aufklärung | Autorizar pelo princípio de que qualquer culto tem o mesmo direito; vizinhos ofendidos não são argumento. | Religião +1; Papel +1; Última -2 |
| d | Radical | Fazer a consulta popular e cumprir o resultado; e discutir também os privilégios das igrejas já instaladas. | Religião -2; Papel +1; Última +2 |
| e | Despotismo Esclarecido | A prefeitura decide sozinha e sem consulta; a paz entre crenças é assunto de administração, não de plebiscito. | Religião 0; Papel -2; Última 0 |

## Cenários em dois tempos

### d01 — Aplicativo de denúncias

Eixos: Fonte do juízo, Direção da mudança, Papel da publicidade.

**Parte 1.** A prefeitura lança um aplicativo para moradores denunciarem problemas nas ruas. Discute-se se denúncias e respostas serão públicas e quem define as prioridades.

| Reação | Perfil | Texto | Cargas |
|---|---|---|---|
| a | Philosophes | Tudo público: cada denúncia, cada resposta e o tempo que levou; a pressão de todos organiza a fila. | Fonte 0; Direção +1; Papel +2 |
| b | Escocês | Começar pequeno, em um bairro, ver o que os moradores fazem com a ferramenta e ajustar depois. | Fonte +2; Direção 0; Papel 0 |
| c | Aufklärung | Definir antes o critério de prioridade que valeria para qualquer cidade e publicá-lo; depois lançar. | Fonte -2; Direção 0; Papel +1 |
| d | Radical | Os moradores votam no aplicativo o que vem primeiro; a prefeitura executa a ordem votada, às claras. | Fonte -1; Direção +2; Papel +1 |
| e | Despotismo Esclarecido | A secretaria define prioridades por critérios técnicos internos e publica só o que foi resolvido. | Fonte 0; Direção -2; Papel -2 |

**Novo fato.** Três meses depois, descobre-se que um bairro rico concentra a maioria das denúncias e das respostas, enquanto bairros pobres quase não aparecem.

| Reação | Perfil | Texto | Cargas |
|---|---|---|---|
| a | Philosophes | Publicar o desequilíbrio com mapas e números; a cidade inteira precisa ver para onde a atenção está indo. | Fonte 0; Direção +1; Papel +2 |
| b | Escocês | Levar a ferramenta aos bairros que não a usam, com quem conhece cada um; corrigir pelo uso, não por regra. | Fonte +2; Direção 0; Papel 0 |
| c | Aufklärung | Manter o critério publicado; se ele produz esse resultado, estava mal formulado e deve ser refeito. | Fonte -2; Direção 0; Papel +1 |
| d | Radical | Os moradores dos bairros esquecidos decidem as prioridades agora; a votação geral inteira estava viciada. | Fonte -1; Direção +2; Papel +1 |
| e | Despotismo Esclarecido | A secretaria redistribui as equipes por conta própria, sem anunciar; corrigir em silêncio evita disputa entre bairros. | Fonte 0; Direção -2; Papel -2 |

### d02 — Feriado religioso municipal

Eixos: Religião na vida pública, Última palavra, Papel da publicidade.

**Parte 1.** A câmara discute transformar a data de uma festa religiosa tradicional em feriado municipal. Uma pesquisa mostra que a maioria apoia; comerciantes e fiéis de outras crenças se opõem.

| Reação | Perfil | Texto | Cargas |
|---|---|---|---|
| a | Philosophes | Não criar feriado de uma fé, mesmo com maioria a favor; levar o debate à praça e propor data civil. | Religião -1; Última -1; Papel +2 |
| b | Escocês | Criar; a festa organiza o ano da cidade há gerações, e a lei apenas reconhece o que já existe. | Religião +1; Última 0; Papel 0 |
| c | Aufklärung | Criar apenas se qualquer fé com festa tradicional puder pedir o mesmo pela mesma regra, publicada. | Religião +1; Última -2; Papel +1 |
| d | Radical | A população decide em consulta e a câmara cumpre; e que se revejam em público os apoios a festas. | Religião -2; Última +2; Papel +1 |
| e | Despotismo Esclarecido | O prefeito decide sozinho e sem alarde, pelo que servir à economia; consulta e debate só atrasam. | Religião 0; Última 0; Papel -2 |

**Novo fato.** Uma nova pesquisa mostra que a maioria, na verdade, se opõe ao feriado, por causa do impacto no comércio.

| Reação | Perfil | Texto | Cargas |
|---|---|---|---|
| a | Philosophes | Mantenho: não criar; a razão nunca foi a pesquisa, e o debate público continua exatamente igual. | Religião -1; Última -1; Papel +2 |
| b | Escocês | Se a cidade não quer, não há o que reconhecer; a festa segue como sempre foi, sem feriado. | Religião +1; Última 0; Papel 0 |
| c | Aufklärung | Mantenho a regra: feriado para uma fé só se para todas; o que a maioria pensa não entra na conta. | Religião +1; Última -2; Papel +1 |
| d | Radical | A maioria decidiu contra, e a maioria manda: não criar; a revisão pública dos apoios às festas segue. | Religião -2; Última +2; Papel +1 |
| e | Despotismo Esclarecido | O prefeito decide pelo que servir à economia; a pesquisa é uma informação a mais, não uma ordem. | Religião 0; Última 0; Papel -2 |

### d03 — Atrasos na cooperativa

Eixos: Fonte do juízo, Ritmo da mudança, Origem da boa ordem.

**Parte 1.** Uma cooperativa cresceu e alguns sócios começaram a atrasar entregas. Os fundadores discutem como manter o grupo unido.

| Reação | Perfil | Texto | Cargas |
|---|---|---|---|
| a | Philosophes | Reunir todos, pôr os números na mesa e combinar mudanças aos poucos, com os atrasados presentes. | Fonte 0; Ritmo +1; Origem 0 |
| b | Escocês | Conversar caso a caso; confiança se reconstrói na convivência, como sempre foi, não em regulamento. | Fonte +2; Ritmo +2; Origem +2 |
| c | Aufklärung | Fixar uma regra de contribuição que todos aceitariam de antemão e aplicá-la a cada um, sem exceção. | Fonte -2; Ritmo +1; Origem -1 |
| d | Radical | Assembleia geral já: quem atrasa sem motivo sai; a cooperativa é de todos ou não é de ninguém. | Fonte -1; Ritmo -2; Origem -1 |
| e | Despotismo Esclarecido | A diretoria redesenha entregas e cobranças e impõe o novo modelo; discutir só atrasa mais. | Fonte 0; Ritmo -1; Origem -2 |

**Novo fato.** Descobre-se que os atrasos vêm de dois sócios que enfrentam doença na família e não quiseram contar a ninguém.

| Reação | Perfil | Texto | Cargas |
|---|---|---|---|
| a | Philosophes | Trazer o caso ao grupo, com o consentimento dos dois, e combinar apoio; as regras podem esperar um pouco. | Fonte 0; Ritmo +1; Origem 0 |
| b | Escocês | Era isso que a conversa teria mostrado; ajudar os dois e seguir sem regra nova, cada caso é um caso. | Fonte +2; Ritmo +2; Origem +2 |
| c | Aufklärung | A regra vale igual, mas pode prever exceção por motivo grave; o que não pode é decidir por simpatia. | Fonte -2; Ritmo +1; Origem -1 |
| d | Radical | A assembleia decide agora se o motivo justifica; a regra é da assembleia, não de quem sente pena. | Fonte -1; Ritmo -2; Origem -1 |
| e | Despotismo Esclarecido | A diretoria cobre os dois com uma reserva e mantém o novo sistema; o plano não muda por casos pessoais. | Fonte 0; Ritmo -1; Origem -2 |

### d04 — Pedido na porta do mercado

Eixos: Fonte do juízo, Alcance das regras, Motor da moral.

**Parte 1.** Na porta do mercado, um homem pede dinheiro dizendo que precisa comprar um remédio. Você tem pouco dinheiro e pressa.

| Reação | Perfil | Texto | Cargas |
|---|---|---|---|
| a | Philosophes | Perguntar o que ele precisa e, se fizer sentido, comprar o remédio com ele; dinheiro em si não resolve. | Fonte 0; Alcance 0; Motor +1 |
| b | Escocês | Dar o que se costuma dar por aqui e seguir; a gente sente quando é caso de ajudar. | Fonte +2; Alcance +2; Motor +2 |
| c | Aufklärung | Ajudar como você exigiria que qualquer pessoa ajudasse qualquer outra, sem depender do que sente na hora. | Fonte -2; Alcance -2; Motor -2 |
| d | Radical | Dar; ninguém pede remédio por gosto, e o que faz alguém precisar disso é problema de todos, em qualquer lugar. | Fonte -1; Alcance -1; Motor +1 |
| e | Despotismo Esclarecido | Não dar; indicar o posto de saúde, que é para isso que existe um sistema, aqui e em qualquer cidade. | Fonte 0; Alcance -1; Motor 0 |

**Novo fato.** Você percebe que ele pede a mesma coisa a todos que saem, e alguém comenta que ele faz isso há meses.

| Reação | Perfil | Texto | Cargas |
|---|---|---|---|
| a | Philosophes | Ainda assim conversar; se for golpe, a conversa mostra, e se não for, alguém precisava mesmo. | Fonte 0; Alcance 0; Motor +1 |
| b | Escocês | Seguir sem dar; a experiência de quem passa ali todo dia vale mais do que a história de hoje. | Fonte +2; Alcance +2; Motor +2 |
| c | Aufklärung | O que você faria em qualquer caso igual continua valendo; a decisão não muda por suspeita. | Fonte -2; Alcance -2; Motor -2 |
| d | Radical | Dar mesmo assim; se alguém pede há meses, é porque há meses falta algo, e a culpa não é dele. | Fonte -1; Alcance -1; Motor +1 |
| e | Despotismo Esclarecido | Não dar e avisar a assistência social; um problema que se repete pede uma solução do sistema. | Fonte 0; Alcance -1; Motor 0 |

## Tensões

A resposta vai de −2 (muito mais a primeira frase) a +2 (muito mais a segunda). A primeira frase corresponde ao polo negativo do eixo; a segunda, ao polo positivo.

| ID | Eixo | Primeira frase | Segunda frase |
|---|---|---|---|
| t01 | Fonte do juízo | Antes de decidir, procuro o princípio que deveria valer em qualquer caso. | Antes de decidir, procuro o que já deu resultado em casos parecidos. |
| t02 | Religião na vida pública | Decisões públicas não devem se apoiar em crenças religiosas, mesmo quando a maioria as tem. | Crenças religiosas fazem parte da vida comum e podem ter lugar nas decisões públicas. |
| t03 | Direção da mudança | Mudanças duráveis vêm de quem tem preparo e responsabilidade para decidir e executar. | Mudanças duráveis vêm de quem vive a situação e a discute entre si. |
| t04 | Ritmo da mudança | O que causa dano deve acabar agora, mesmo que custe caro. | O que causa dano deve mudar em etapas, preservando o que ainda funciona. |
| t05 | Última palavra | Há regras que valem mesmo quando a maioria quer o contrário. | A decisão da maioria é a última palavra sobre qualquer regra. |
| t06 | Origem da boa ordem | Uma cidade funciona quando alguém desenha o conjunto e faz cumprir. | Uma cidade funciona por ajustes que ninguém desenhou e ninguém controla. |
| t07 | Alcance das regras | O que vale aqui deveria valer em qualquer lugar do mundo. | Cada lugar tem história própria e precisa de regras próprias. |
| t08 | Motor da moral | Agir bem é cumprir o dever, mesmo contra o que se sente. | Agir bem é responder ao que se sente e ao que faz bem a quem está perto. |
| t09 | Papel da publicidade | Decisões delicadas se resolvem entre quem tem responsabilidade, sem plateia. | Decisões delicadas devem ser expostas e discutidas à vista de todos. |

## Regras editoriais

- Situações contemporâneas (prefeitura, escola, tribunal, empresa, cooperativa, condomínio), sem nomes de autores, países ou escolas.
- Cinco reações por conjunto, uma por perfil, com até 20 palavras e dispersão de comprimento de até 6 palavras; sem adjetivos valorativos e sem alternativa obviamente "correta". Cada reação nomeia um custo ou renúncia.
- A reação de cada perfil deve ser, por cosseno, a que mais aponta para o próprio vetor dentro do conjunto (verificado por `tests/scoring.test.js`).
- Cada eixo aparece em pelo menos 8 cenários fixos e tem exatamente uma tensão; cada par de perfis é separado em pelo menos 8 conjuntos.
- Alterar uma carga somente com justificativa registrada em `docs/validacao.md` e nova rodada de `node tests/scoring.test.js` e `node scripts/simulate.js`.
