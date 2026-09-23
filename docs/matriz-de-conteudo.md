# Matriz de conteúdo

Versão do instrumento: `2.0.0`. Gerado por `node scripts/generate-blueprint.js`.

Esta matriz documenta as chaves históricas usadas pelo algoritmo. Ela não deve ser entregue aos respondentes antes da conclusão, pois tornaria transparentes as associações que o questionário procura medir de forma indireta.

Cada cenário tem quatro reações, cada uma ligada a um perfil principal (+2) e, em alguns casos, a um perfil secundário (+1). A reação marcada como **mais próxima** soma seus pesos; a marcada como **mais distante** subtrai os pesos dela. As tensões valem de −2 a +2 na direção da segunda posição. O algoritmo normaliza cada perfil pelos próprios limites teóricos e combina 80% cenários e 20% tensões.

## Cobertura por perfil

| Perfil | Cenários (principal) | Cenários (qualquer peso) | Tensões | Máx. bruto cenários | Máx. bruto tensões |
|---|---:|---:|---:|---:|---:|
| Philosophes | 10 | 10 | 1 | 20 | 2 |
| Escocês | 13 | 13 | 1 | 26 | 2 |
| Aufklärung | 10 | 10 | 1 | 20 | 2 |
| Italiano | 13 | 13 | 2 | 26 | 4 |
| Americano | 13 | 14 | 1 | 27 | 2 |
| Ibérico | 10 | 10 | 2 | 20 | 4 |
| Radical | 12 | 12 | 2 | 24 | 4 |
| Moderado | 11 | 11 | 2 | 22 | 4 |
| Despotismo | 10 | 11 | 2 | 21 | 4 |
| Fisiocracia | 10 | 10 | 2 | 20 | 4 |

## Coocorrência par a par

Número de cenários em que os dois perfis aparecem como reações principais. Pares confundíveis (em negrito) precisam de pelo menos 4.

| | Philosophes | Escocês | Aufklärung | Italiano | Americano | Ibérico | Radical | Moderado | Despotismo | Fisiocracia |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Philosophes | · | 0 | 1 | 4 | 5 | 3 | **5** | 4 | 5 | 3 |
| Escocês | 0 | · | 6 | 7 | 5 | 4 | 4 | 5 | 2 | **6** |
| Aufklärung | 1 | 6 | · | 4 | 3 | 3 | 4 | **5** | 3 | 1 |
| Italiano | 4 | 7 | 4 | · | 5 | 2 | 3 | 3 | **5** | **6** |
| Americano | 5 | 5 | 3 | 5 | · | 4 | **5** | 3 | 5 | 4 |
| Ibérico | 3 | 4 | 3 | 2 | 4 | · | 3 | **5** | **4** | 2 |
| Radical | **5** | 4 | 4 | 3 | **5** | 3 | · | 6 | 2 | 4 |
| Moderado | 4 | 5 | **5** | 3 | 3 | **5** | 6 | · | 1 | 1 |
| Despotismo | 5 | 2 | 3 | **5** | 5 | **4** | 2 | 1 | · | 3 |
| Fisiocracia | 3 | **6** | 1 | **6** | 4 | 2 | 4 | 1 | 3 | · |

## Cenários

### c01 — Livro polêmico na biblioteca

A biblioteca do bairro recebeu um livro que ataca duramente a religião mais seguida na cidade. Um grupo de frequentadores pede que ele seja retirado da estante. A direção pergunta sua opinião.

| Reação | Texto | Chave |
|---|---|---|
| a | Manter o livro e organizar uma roda de conversa aberta sobre ele. | Philosophes +2 |
| b | Manter o livro: ninguém pode retirar uma publicação porque a maioria se ofendeu. | Americano +2 |
| c | Manter o livro, mas sem destaque, para não ferir a convivência do bairro. | Moderado +2 |
| d | Manter o livro e revisar também o espaço dado ao material religioso. | Radical +2 |

### c02 — Verba de fomento econômico

A prefeitura recebeu um repasse único para movimentar a economia da cidade. Não há consenso sobre onde aplicar. Você foi chamado a opinar.

| Reação | Texto | Chave |
|---|---|---|
| a | Estradas e crédito para quem produz no campo; é dali que sai a riqueza. | Fisiocracia +2 |
| b | Uma escola técnica e apoio direto a três setores escolhidos pela prefeitura. | Ibérico +2; Despotismo +1 |
| c | Cortar taxas e burocracia e deixar os negócios decidirem onde crescer. | Escocês +2 |
| d | Um fundo administrado em conjunto por comerciantes, moradores e prefeitura. | Italiano +2 |

### c03 — Reforma penal após crime violento

Um crime violento abalou a cidade. A câmara discute mudar as penas com urgência. Há várias propostas na mesa.

| Reação | Texto | Chave |
|---|---|---|
| a | Penas previstas em lei, proporcionais ao dano, iguais para qualquer acusado. | Italiano +2 |
| b | Antes de mudar penas, ver o que deu resultado em cidades parecidas com a nossa. | Escocês +2 |
| c | Reforço ao trabalho de igrejas e comunidades na recuperação de quem errou. | Moderado +2 |
| d | Nenhuma mudança apressada: garantias de defesa e julgamento valem em qualquer clima. | Americano +2 |

### c04 — Feriado religioso em escola pública

Uma escola pública sempre fez uma celebração na data religiosa mais tradicional da cidade. Famílias de outras crenças pediram mudança. A direção precisa decidir.

| Reação | Texto | Chave |
|---|---|---|
| a | Manter a celebração e convidar as outras famílias a apresentarem suas tradições. | Moderado +2 |
| b | Encerrar celebrações religiosas na escola; a data vira dia comum de aula. | Radical +2 |
| c | Manter a celebração como parte da cultura local, com conteúdo revisado pelos professores. | Ibérico +2 |
| d | Deixar a participação livre e garantir por escrito que ninguém será obrigado. | Americano +2 |

### c05 — Reforma de impostos sem consulta

O prefeito preparou uma reforma dos impostos municipais com uma equipe técnica. Ele quer aprovar em uma semana, sem audiências. Perguntam sua posição.

| Reação | Texto | Chave |
|---|---|---|
| a | Se a equipe fez bem o trabalho, aprovar logo; audiência só atrasa. | Despotismo +2 |
| b | Nenhum imposto novo sem passar pela câmara e por audiência pública. | Americano +2 |
| c | Aceitar apenas se simplificar as taxas e deixar de punir quem produz. | Fisiocracia +2 |
| d | Publicar a proposta inteira e dar prazo para que todos leiam e comentem. | Italiano +2 |

### c06 — Conselho de bairro e secretaria técnica

Uma praça será reformada. A secretaria de obras já tem um projeto pronto. O conselho de moradores quer decidir o desenho em assembleia.

| Reação | Texto | Chave |
|---|---|---|
| a | Executar o projeto da secretaria; quem estudou o assunto é quem deve decidir. | Despotismo +2 |
| b | Expor o projeto e as alternativas em público e deixar a discussão amadurecer. | Philosophes +2 |
| c | A assembleia dos moradores decide; a secretaria executa o que for votado. | Radical +2 |
| d | Consultar primeiro os donos dos imóveis ao redor, que arcam com os efeitos. | Fisiocracia +2 |

### c07 — Imprensa critica servidores

Um jornal local publicou uma série de reportagens criticando servidores da prefeitura pelo nome. Parte da câmara quer limitar esse tipo de publicação.

| Reação | Texto | Chave |
|---|---|---|
| a | Nada de limite; criticar quem exerce poder é justamente o papel de um jornal. | Philosophes +2 |
| b | Limitar: a crítica constante trava a administração e desanima quem trabalha. | Despotismo +2 |
| c | Nada de limite, desde que o jornal assine, fundamente e aceite responder pelo que publica. | Aufklärung +2 |
| d | Nada de limite; quem se sentir lesado recorre ao tribunal, não à câmara. | Americano +2 |

### c08 — Currículo escolar

A rede municipal vai redesenhar o currículo do ensino fundamental. Há disputa sobre o que deve ter mais espaço.

| Reação | Texto | Chave |
|---|---|---|
| a | Formar pessoas capazes de pensar por conta própria e sustentar as próprias escolhas. | Aufklärung +2 |
| b | Ciências, ofícios e técnicas de que a cidade precisa para se desenvolver. | Ibérico +2 |
| c | Convivência, hábitos e experiência prática; o resto a vida ensina aos poucos. | Escocês +2 |
| d | Valores, tradição e conhecimento juntos, para formar caráter e não só cabeça. | Moderado +2 |

### c09 — Monopólio de uma associação de comerciantes

Uma associação de comerciantes controla quem pode abrir loja no centro da cidade há décadas. Novos comerciantes reclamam. A câmara discute o que fazer.

| Reação | Texto | Chave |
|---|---|---|
| a | Acabar com o controle: qualquer um abre loja onde quiser e o mercado se ajusta. | Fisiocracia +2 |
| b | Abrir gradualmente, observando o que acontece, sem desmontar de uma vez o que funciona. | Escocês +2 |
| c | Regras públicas e iguais para todos, escritas em lei, no lugar de acordos fechados. | Italiano +2 |
| d | A prefeitura assume o controle e define ela mesma quem entra e quanto cobra. | Despotismo +2 |

### c10 — Juiz diante de lei dura

Uma juíza deve aplicar uma lei que prevê pena pesada para um caso pequeno. A lei é clara. Ela tem alguma margem para decidir.

| Reação | Texto | Chave |
|---|---|---|
| a | Aplicar a lei como está e pedir publicamente que ela seja mudada. | Italiano +2; Americano +1 |
| b | Julgar pelo princípio que valeria para todos os casos iguais, mesmo contrariando a letra. | Aufklärung +2 |
| c | Olhar como casos parecidos foram tratados e seguir o que a prática consolidou. | Escocês +2 |
| d | Aplicar a pena menor que a consciência permitir; leis servem às pessoas. | Moderado +2 |

### c11 — Sucessão em empresa familiar

O fundador de uma empresa familiar vai se aposentar. Há filhos, sócios antigos e funcionários de confiança. Ninguém sabe quem deve assumir.

| Reação | Texto | Chave |
|---|---|---|
| a | Seguir o costume da família e ajustar aos poucos, conforme a nova gestão for se provando. | Escocês +2 |
| b | Escolher pelo critério que todos aceitariam de antemão, mesmo que desagrade alguém. | Aufklärung +2 |
| c | Escrever antes as regras da sucessão e submeter a escolha a um conselho. | Americano +2 |
| d | Todos que trabalham na empresa votam, com o mesmo peso, quem assume. | Radical +2 |

### c12 — Templo de uma nova religião

Um grupo religioso recém-chegado quer construir um templo em um bairro tradicional. Vizinhos protestam. A prefeitura pede pareceres.

| Reação | Texto | Chave |
|---|---|---|
| a | Autorizar e aproveitar para debater em público o que a cidade entende por convivência. | Philosophes +2 |
| b | Autorizar, com diálogo entre as lideranças religiosas para evitar rupturas no bairro. | Moderado +2 |
| c | Autorizar, desde que o grupo siga as normas da cidade e não pregue contra elas. | Ibérico +2 |
| d | Autorizar por decisão da prefeitura; a paz entre crenças é questão de administração. | Despotismo +2; Ibérico +1 |

### c13 — Plebiscito ou comissão de especialistas

A cidade precisa decidir se muda o sistema de transporte. Alguns querem plebiscito; outros, uma comissão de especialistas.

| Reação | Texto | Chave |
|---|---|---|
| a | Plebiscito: quem usa o transporte decide, e a comissão obedece ao resultado. | Radical +2 |
| b | Primeiro uma lei fixando como se decide; depois plebiscito ou comissão, conforme ela disser. | Italiano +2 |
| c | Plebiscito, mas com limites prévios: a comissão define o que pode ser votado. | Americano +2 |
| d | Primeiro divulgar os estudos em linguagem simples e debater; votar só depois. | Philosophes +2 |

### c14 — Costume local e regra nacional

Uma lei nacional padroniza o horário do comércio em todo o país. A cidade tem um costume antigo de fechar ao meio-dia. Pedem sua opinião.

| Reação | Texto | Chave |
|---|---|---|
| a | Manter o costume; ele funciona aqui há gerações e ninguém pediu mudança. | Escocês +2 |
| b | Cumprir a regra nacional; padronizar evita confusão e faz o país andar junto. | Despotismo +2 |
| c | Adaptar aos poucos, com campanha explicando por que a mudança ajuda a cidade. | Ibérico +2 |
| d | A cidade deve poder decidir seu horário; a lei nacional foi longe demais. | Americano +2; Escocês +1 |

### c15 — Fila no hospital

O hospital municipal tem fila para uma cirurgia que não é urgente. Não dá para atender todos este ano. Como ordenar a fila?

| Reação | Texto | Chave |
|---|---|---|
| a | Um critério único escrito e publicado, aplicado igualmente, com direito a recurso. | Italiano +2 |
| b | A ordem que qualquer pessoa aceitaria se não soubesse sua posição na fila. | Aufklärung +2 |
| c | Uma equipe técnica ordena os casos pela gravidade, sem interferência externa. | Despotismo +2 |
| d | Sorteio entre todos os inscritos; ninguém tem mais direito do que outro. | Radical +2 |

### c16 — Cooperativa e confiança entre sócios

Uma cooperativa agrícola cresceu e alguns sócios começaram a atrasar entregas. Os fundadores discutem como manter o grupo unido.

| Reação | Texto | Chave |
|---|---|---|
| a | Regras claras de contribuição e um sistema em que quem cumpre é visto cumprindo. | Italiano +2 |
| b | Conversar caso a caso; a confiança se reconstrói na convivência, não em regulamento. | Escocês +2 |
| c | Pagar cada sócio pelo que produz; quem entrega mais ganha mais e o resto se resolve. | Fisiocracia +2 |
| d | Cada sócio assume por escrito o compromisso e responde por ele diante do grupo. | Aufklärung +2 |

### c17 — Jovem contra o plano da família

Um jovem de dezenove anos quer abandonar a carreira que a família planejou e seguir outra. Os pais pedem que você converse com ele.

| Reação | Texto | Chave |
|---|---|---|
| a | Ele tem idade para decidir; deve pensar bem e assumir as consequências. | Aufklärung +2 |
| b | Aconselhar respeito à família e buscar um acordo que preserve os laços. | Moderado +2 |
| c | A família não tem autoridade sobre a vida dele; que siga o próprio caminho. | Radical +2 |
| d | Sugerir que experimente por um tempo antes de romper; a prática vai mostrar o rumo. | Escocês +2 |

### c18 — Museu e objeto sagrado

Um museu exibe um objeto considerado sagrado por uma comunidade religiosa. A comunidade pede a devolução. O museu diz que o objeto é patrimônio de todos.

| Reação | Texto | Chave |
|---|---|---|
| a | Manter em exposição e explicar sua história com a mesma liberdade de qualquer outro objeto. | Philosophes +2 |
| b | Devolver; o valor que aquele objeto tem para os fiéis vale mais que a exposição. | Moderado +2 |
| c | Manter; nenhum objeto merece tratamento diferente por ser chamado de sagrado. | Radical +2 |
| d | Devolver com um acordo que garanta estudo, registro e visitas do museu. | Ibérico +2 |

### c19 — Código de ética em uma empresa

Uma empresa média teve casos de desvio de conduta. A diretoria quer criar um código de ética e discute em que ele deve se apoiar.

| Reação | Texto | Chave |
|---|---|---|
| a | Princípios que qualquer funcionário reconheceria como válidos, mesmo sem ninguém vigiando. | Aufklärung +2 |
| b | Poucas regras e muito exemplo dos mais antigos; conduta se aprende observando. | Escocês +2 |
| c | Regras escritas com consequências definidas, aplicadas do estagiário ao diretor. | Italiano +2 |
| d | Valores compartilhados e um espaço para a consciência de cada um, com apoio de mentores. | Moderado +2 |

### c20 — Lei ambiental e proprietários rurais

Uma nova lei ambiental limita o uso de parte das terras de pequenos e grandes proprietários rurais. Alguns ameaçam deixar de produzir.

| Reação | Texto | Chave |
|---|---|---|
| a | Rever a lei; sem quem produz na terra, não há o que preservar nem o que arrecadar. | Fisiocracia +2 |
| b | Aplicar, mas com indenização; o direito sobre a terra não pode ser esvaziado sem compensação. | Americano +2 |
| c | Divulgar os dados sobre o dano ambiental e deixar a opinião pública pressionar. | Philosophes +2 |
| d | Manter a lei se ela for igual para todos, com fiscalização prevista e sem exceções. | Italiano +2 |

### c21 — Ciência e religião na sala de aula

Uma escola pública recebeu pedido para tratar a origem do mundo também pela perspectiva religiosa nas aulas de ciências. Os professores estão divididos.

| Reação | Texto | Chave |
|---|---|---|
| a | Não; a aula de ciências é lugar de explicações naturais, e só delas. | Radical +2 |
| b | Sim, deixando claro que fé e ciência respondem a perguntas diferentes e podem conviver. | Moderado +2 |
| c | Ensinar ciência na aula de ciências e criar espaço separado para o aluno examinar crenças. | Aufklärung +2 |
| d | Ensinar ciência com rigor e manter a formação religiosa como disciplina própria da escola. | Ibérico +2 |

### c22 — Copiar a reforma de outro país

A prefeitura quer copiar um modelo de gestão de escolas que deu resultado em outro país. Muitos professores desconfiam.

| Reação | Texto | Chave |
|---|---|---|
| a | Adotar o modelo inteiro e logo; adaptação demais é desculpa para não mudar. | Despotismo +2 |
| b | Adotar só as partes cujos resultados possam ser medidos aqui, com avaliação anual. | Italiano +2 |
| c | Adotar com apoio de formação para os professores e metas acompanhadas pela prefeitura. | Ibérico +2 |
| d | Traduzir e divulgar as pesquisas para todos e debater antes de qualquer decisão. | Philosophes +2 |

### c23 — Piso salarial municipal

A câmara discute criar um piso salarial municipal acima do nacional. Empregadores dizem que vão demitir; trabalhadores dizem que não dá para viver com menos.

| Reação | Texto | Chave |
|---|---|---|
| a | Não criar; salários se ajustam pela produção, e o piso só desanima quem emprega. | Fisiocracia +2 |
| b | Criar, com regras públicas e avaliação periódica dos efeitos sobre emprego e renda. | Italiano +2 |
| c | Criar e ir além: quem vive do trabalho deve ter parte no que a empresa ganha. | Radical +2 |
| d | Não criar por decreto; ver o que fizeram cidades parecidas e ajustar pela experiência. | Escocês +2 |

### c24 — Concurso ou indicação técnica

A prefeitura precisa preencher cargos de direção nas escolas. Há disputa entre fazer concurso e deixar a secretaria indicar pessoas de confiança técnica.

| Reação | Texto | Chave |
|---|---|---|
| a | Concurso com regras públicas; indicação abre espaço para favores que ninguém controla. | Americano +2 |
| b | Indicação pela secretaria; quem responde pelo resultado precisa escolher a própria equipe. | Despotismo +2 |
| c | Concurso, seguido de curso de formação obrigatório e acompanhamento da secretaria. | Ibérico +2; Despotismo +1 |
| d | Concurso que avalie também a capacidade de julgar situações, não só o conteúdo decorado. | Aufklärung +2 |

### c25 — Fim imediato ou transição

Um movimento pede o fim imediato de uma vantagem que um grupo da cidade tem há muito tempo. Outros propõem uma transição de dez anos.

| Reação | Texto | Chave |
|---|---|---|
| a | Fim imediato; um privilégio não fica menos privilégio por ser antigo e conhecido. | Radical +2 |
| b | Transição, cuidando para que a mudança não rompa os laços que sustentam a cidade. | Moderado +2 |
| c | Acabar com a vantagem, mas sem tocar no que cada um já tem de propriedade. | Fisiocracia +2 |
| d | Expor a vantagem em público; quando todos entenderem o que ela é, ela cai sozinha. | Philosophes +2 |

### c26 — Poderes do prefeito na emergência

Uma enchente atingiu a cidade. O prefeito pede poderes para gastar e desapropriar sem passar pela câmara durante seis meses.

| Reação | Texto | Chave |
|---|---|---|
| a | Não; a câmara pode se reunir em regime de urgência e aprovar cada medida. | Americano +2 |
| b | Sim; em emergência, quem executa precisa decidir sem esperar votação. | Despotismo +2 |
| c | Sim, por prazo curto, com cada gasto publicado e revisado ao final. | Italiano +2 |
| d | Sim, desde que a imprensa e os moradores possam acompanhar tudo e cobrar. | Philosophes +2 |

### c27 — Dívida da prefeitura

A prefeitura acumulou uma dívida que compromete o orçamento. É preciso decidir quem vai arcar com o ajuste.

| Reação | Texto | Chave |
|---|---|---|
| a | Cortar o que não produz e cobrar mais de quem tem terra e patrimônio parados. | Fisiocracia +2 |
| b | Cortar aos poucos, começando pelo que a experiência mostrar que pesa menos. | Escocês +2 |
| c | Nenhum ajuste sem que a câmara aprove cada item e o eleitor saiba quem pagou. | Americano +2 |
| d | Cortar despesas e investir o que restar em ensino e produção, para a cidade crescer. | Ibérico +2 |

### c28 — Herança e desigualdade

Um vereador propõe um imposto alto sobre grandes heranças para financiar escolas. A proposta dividiu a cidade.

| Reação | Texto | Chave |
|---|---|---|
| a | Aprovar; ninguém nasce com direito a começar a vida muito acima dos outros. | Radical +2 |
| b | Rejeitar; patrimônio que passa de geração em geração é o que mantém a produção. | Fisiocracia +2 |
| c | Aceitar só com limite fixado em lei e sujeito a contestação nos tribunais. | Americano +2 |
| d | Não aprovar; com o tempo, famílias e fortunas se rearranjam por conta própria. | Escocês +2 |

## Tensões

A resposta vai de −2 (muito mais a primeira) a +2 (muito mais a segunda). O valor é somado ao perfil da segunda posição e subtraído do perfil da primeira.

| ID | Primeira posição | Perfil | Segunda posição | Perfil |
|---|---|---|---|---|
| t01 | O progresso vem de escolas, ofícios e ciência aplicada, ao longo de uma geração. | Ibérico | O progresso vem de um governo que concentra as decisões e executa rápido. | Despotismo |
| t02 | A moral se sustenta na fé e nos laços da comunidade. | Moderado | A moral se sustenta em princípios que cada pessoa pode examinar por si. | Aufklärung |
| t03 | Leis e costumes mudam convencendo a opinião pública, sem derrubar tudo. | Philosophes | Instituições que sustentam privilégios não se reformam; substituem-se. | Radical |
| t04 | Certos direitos valem mesmo contra a vontade da maioria. | Americano | A vontade da maioria é a última palavra sobre qualquer regra. | Radical |
| t05 | Regras escritas que valem inclusive para quem está no governo. | Italiano | Liberdade para quem governa agir rápido quando sabe o que faz. | Despotismo |
| t06 | A riqueza nasce da troca, do comércio e do trabalho dividido entre muitos. | Escocês | A riqueza nasce da terra e do que se produz nela; o resto só a movimenta. | Fisiocracia |
| t07 | Prosperidade depende de leis, confiança entre as pessoas e instituições que funcionem. | Italiano | Prosperidade depende de deixar a produção e a circulação livres de controles. | Fisiocracia |
| t08 | O governo pode e deve corrigir práticas religiosas que atrasam o país. | Ibérico | A renovação da religião cabe aos fiéis, não ao governo. | Moderado |

## Regras editoriais

- Situações contemporâneas (prefeitura, escola, tribunal, empresa, cooperativa), sem nomes de autores, países ou escolas.
- Quatro reações por cenário, de comprimento semelhante (±5 palavras, máximo 18), sem adjetivos valorativos e sem uma alternativa obviamente "correta".
- Cada perfil é principal em pelo menos 10 cenários; cada par confundível coocorre em pelo menos 4 e tem uma tensão dedicada.
- Alterar uma chave somente com justificativa registrada em `docs/validacao.md` e nova rodada de `node scripts/simulate.js`.
- Revisar itens que mais de 20% dos participantes do piloto interpretarem de modo diferente do previsto.
