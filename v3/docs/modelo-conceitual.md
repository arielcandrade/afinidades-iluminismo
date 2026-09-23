# Modelo conceitual — versão 3

## Do que se trata

A versão 3 mede a afinidade de uma pessoa com **cinco correntes do Iluminismo** a partir de **nove eixos** que atravessam todas elas. As correntes não são medidas diretamente: as respostas produzem uma posição em cada eixo, e a afinidade com cada corrente é a semelhança entre a posição da pessoa e a posição da corrente nesse espaço.

Essa mudança em relação à versão 2 tem três consequências:

- toda resposta informa todos os perfis, e não apenas o perfil "dono" da reação;
- o resultado pode ser explicado ("você está perto dos escoceses porque pontua alto em experiência e gradualismo, mas se afasta deles em religião");
- a escolha dos cinco perfis foi feita por **separabilidade** (discordam entre si no maior número possível de eixos), não por importância histórica.

## Os cinco perfis

| Perfil | Assinatura distintiva | Figuras de referência |
|---|---|---|
| Philosophes | Reforma pela opinião pública; crítica à religião; gradualismo persuasivo | Voltaire, Diderot, Montesquieu, Condorcet |
| Escocês | Experiência e costume acima do princípio; comércio; ceticismo com planos | Hume, Adam Smith, Ferguson, Hutcheson |
| Aufklärung | Princípio universal e autonomia; dever; lei que valeria para todos | Kant, Lessing, Wolff, Mendelssohn |
| Radical | Soberania da maioria; laicidade total; ruptura com privilégios | Espinosa, Bayle, d'Holbach, Paine |
| Despotismo esclarecido | Reforma de cima; eficiência e mérito; tolerância imposta | Frederico II, Catarina II, José II, Pombal |

Ficaram de fora Italiano, Americano, Ibérico, Moderado/Religioso e Fisiocracia, presentes na versão 2. Em situações cotidianas, eles se confundem com os cinco escolhidos (Italiano e Americano com Aufklärung e Philosophes; Ibérico com Despotismo; Moderado com Escocês e Aufklärung; Fisiocracia com Escocês), o que tornava a diferença entre suas pontuações ruído.

## Os nove eixos

Escala de −2 a +2. O polo negativo está à esquerda.

| ID | Eixo | Polo − | Polo + |
|---|---|---|---|
| `judgment` | Fonte do juízo | Princípio | Experiência |
| `religion` | Religião na vida pública | Laicidade | Acomodação |
| `direction` | Direção da mudança | De cima | De baixo |
| `pace` | Ritmo da mudança | Ruptura | Gradualismo |
| `lastword` | Última palavra | Direitos e princípios | Vontade coletiva |
| `order` | Origem da boa ordem | Desenho deliberado | Ordem espontânea |
| `scope` | Alcance das regras | Universal | Local |
| `moral` | Motor da moral | Dever e razão | Sentimento e utilidade |
| `publicity` | Papel da publicidade | Discrição | Publicidade |

## Matriz de vetores

| Eixo | Philosophes | Escocês | Aufklärung | Radical | Despotismo |
|---|---:|---:|---:|---:|---:|
| Fonte do juízo | 0 | +2 | −2 | −1 | 0 |
| Religião | −1 | +1 | +1 | −2 | 0 |
| Direção | +1 | 0 | 0 | +2 | −2 |
| Ritmo | +1 | +2 | +1 | −2 | −1 |
| Última palavra | −1 | 0 | −2 | +2 | 0 |
| Origem da ordem | 0 | +2 | −1 | −1 | −2 |
| Alcance | 0 | +2 | −2 | −1 | −1 |
| Motor da moral | +1 | +2 | −2 | +1 | 0 |
| Publicidade | +2 | 0 | +1 | +1 | −2 |

Distância L1 entre pares (soma das diferenças absolutas): Philosophes–Escocês 13, Philosophes–Aufklärung 12, Philosophes–Radical 12, Philosophes–Despotismo 15, Escocês–Aufklärung 19, Escocês–Radical 19, Escocês–Despotismo 19, Aufklärung–Radical 17, Aufklärung–Despotismo 14, Radical–Despotismo 21. Philosophes é o centro histórico do movimento e, coerentemente, o perfil mais próximo de todos os outros; o eixo da publicidade foi acrescentado justamente para dar a esse perfil um traço extremo e distintivo, sem o qual sua região no espaço de eixos ficava pequena demais. Todo par difere em pelo menos 2 pontos em pelo menos dois eixos.

## Justificativa célula a célula

### Fonte do juízo (princípio − / experiência +)

- **Philosophes 0.** Voltaire e Diderot admiram Locke e Newton (experiência) mas argumentam por princípios de tolerância e justiça; Montesquieu funda a política na observação dos costumes. A corrente oscila e fica no centro.
- **Escocês +2.** Hume: "a razão é escrava das paixões"; o conhecimento vem do hábito. Smith e Ferguson explicam instituições como resultados da experiência acumulada, não de projetos.
- **Aufklärung −2.** Kant funda a moral e o direito em princípios a priori; Wolff constrói sistemas dedutivos. A experiência informa, mas o critério do que é certo vem antes dela.
- **Radical −1.** Espinosa deduz a ética geometricamente; d'Holbach e Helvétius são materialistas empíricos. Pende ao princípio pela confiança na razão que desmonta tradições, sem o sistematismo alemão.
- **Despotismo 0.** Frederico II e José II usam tanto a razão de Estado quanto o levantamento de dados (cadastros, censos). O critério é o que funciona para o Estado.

### Religião na vida pública (laicidade − / acomodação +)

- **Philosophes −1.** Anticlericais e críticos da Igreja, mas em geral deístas que aceitam uma religião "razoável" e útil ao povo (Voltaire: "se Deus não existisse, seria preciso inventá-lo").
- **Escocês +1.** Hume é cético, mas Smith, Hutcheson, Reid e Ferguson são presbiterianos moderados; a religião é parte do tecido social e não deve ser arrancada dele.
- **Aufklärung +1.** Kant, Lessing e Mendelssohn buscam uma religião da razão; a fé tem lugar público desde que dentro dos limites da razão. Não é laicidade, é religião depurada.
- **Radical −2.** Espinosa, Bayle, d'Holbach: a moral não depende de revelação; igrejas não têm autoridade civil. É o traço mais distintivo do grupo segundo Jonathan Israel.
- **Despotismo 0.** José II fecha conventos e decreta tolerância; Pombal expulsa os jesuítas; mas a religião de Estado permanece como instrumento de ordem. Indiferença instrumental.

### Direção da mudança (de cima − / de baixo +)

- **Philosophes +1.** A mudança vem da opinião pública esclarecida, mas eles cortejam soberanos (Voltaire em Potsdam, Diderot em São Petersburgo). Preferem de baixo, aceitam de cima.
- **Escocês 0.** Instituições mudam por acumulação de práticas, nem por decreto nem por assembleia. A direção não é a pergunta relevante para eles.
- **Aufklärung 0.** Kant: liberdade pública de argumentar, obediência ao soberano ("argumentai quanto quiserdes, mas obedecei"). O esclarecimento é individual; a reforma política, gradual e institucional.
- **Radical +2.** Soberania popular, democracia, direito de resistência (Espinosa, Paine). A legitimidade vem exclusivamente de quem é governado.
- **Despotismo −2.** Definição do grupo: "tudo para o povo, nada pelo povo".

### Ritmo da mudança (ruptura − / gradualismo +)

- **Philosophes +1.** Reforma, não revolução; Voltaire teme a multidão; Condorcet apoia a Revolução mas pela via constitucional.
- **Escocês +2.** Hume e Smith desconfiam de qualquer reconstrução súbita; Ferguson alerta para consequências não intencionais.
- **Aufklärung +1.** Kant condena a revolução como meio, mesmo aprovando fins; a reforma cabe ao legislador e ao amadurecimento público.
- **Radical −2.** Privilégios e dogmas não se reformam; substituem-se. Paine: "temos o poder de recomeçar o mundo".
- **Despotismo −1.** José II reforma por decreto, rápido e em bloco; Frederico é mais cauteloso. Pende à ruptura administrativa, sem o conteúdo igualitário.

### Última palavra (direitos e princípios − / vontade coletiva +)

- **Philosophes −1.** Direitos à tolerância e à expressão valem contra maiorias intolerantes; mas a opinião pública é o tribunal.
- **Escocês 0.** Nem direitos naturais abstratos (Hume os critica) nem vontade popular; a autoridade vem da utilidade e do hábito.
- **Aufklärung −2.** O imperativo categórico e o direito racional não se votam. Regra é o que qualquer ser racional aceitaria, não o que a maioria quer.
- **Radical +2.** A vontade do povo é a fonte de toda regra; direitos anteriores à decisão coletiva são suspeitos de esconder privilégios.
- **Despotismo 0.** A última palavra é do soberano esclarecido, nem princípio abstrato nem maioria. No eixo, fica neutro.

### Origem da boa ordem (desenho deliberado − / ordem espontânea +)

- **Philosophes 0.** Admiram tanto a ordem newtoniana quanto o legislador sábio; a Enciclopédia é um projeto deliberado de organizar o saber.
- **Escocês +2.** Mão invisível, ordem que resulta da ação humana mas não do desenho humano (Ferguson). Traço definidor.
- **Aufklärung −1.** Kant pensa a constituição como projeto racional, mas reconhece a "insociável sociabilidade" que faz progresso sem intenção.
- **Radical −1.** Uma sociedade justa se constrói por decisão consciente; mas o materialismo vê na natureza uma ordem sem desenhista.
- **Despotismo −2.** O Estado desenha, codifica e executa. Nada de deixar acontecer.

### Alcance das regras (universal − / local +)

- **Philosophes 0.** Voltaire e Condorcet são universalistas; Montesquieu insiste que leis dependem de clima, costumes e história. O grupo se divide.
- **Escocês +2.** Hume e Smith explicam instituições pela história de cada povo; Ferguson compara sociedades sem hierarquizá-las como Voltaire faria.
- **Aufklärung −2.** Kant: a lei moral vale para todo ser racional; a paz perpétua é um projeto cosmopolita. Herder é a exceção que já anuncia outra coisa.
- **Radical −1.** Direitos do homem universais, mas com ênfase na autodeterminação de cada povo.
- **Despotismo −1.** Códigos uniformes para todo o território (José II, Frederico), contra particularismos locais e privilégios regionais.

### Motor da moral (dever e razão − / sentimento e utilidade +)

- **Philosophes +1.** Voltaire e Diderot são hedonistas moderados e utilitaristas avant la lettre; a virtude é o que faz bem aos outros.
- **Escocês +2.** Hutcheson, Hume e Smith: a moral nasce do sentimento e da simpatia. Traço definidor.
- **Aufklärung −2.** Kant: agir por dever, não por inclinação. Traço definidor.
- **Radical +1.** Helvétius e d'Holbach são utilitaristas materialistas; Espinosa fala em conatus e utilidade racional.
- **Despotismo 0.** O critério é a utilidade pública administrada; não há teoria moral própria.

### Papel da publicidade (discrição − / publicidade +)

- **Philosophes +2.** É o traço definidor: a *Encyclopédie*, os panfletos, o caso Calas, a "república das letras". A opinião pública informada é o tribunal e o motor da reforma.
- **Escocês 0.** Hume e Smith defendem a liberdade de imprensa, mas a mudança vem do hábito e do comércio, não da exposição pública; o Hume tardio desconfia da agitação impressa.
- **Aufklärung +1.** Kant: o "uso público da razão" é a condição do esclarecimento; mas dentro dos limites da obediência civil, e com o funcionário calando no exercício do cargo.
- **Radical +1.** Panfletagem clandestina, Paine e a imprensa revolucionária; publicidade como arma, mas subordinada à decisão popular.
- **Despotismo −2.** Censura, gabinete e razão de Estado: reformas se anunciam prontas. Frederico tolera a discussão apenas enquanto não incomoda a administração.

## Como as reações dos cenários usam os eixos

Cada cenário toca dois ou três eixos. As cinco reações (uma por perfil) recebem cargas nesses eixos derivadas da assinatura do perfil, com liberdade de ±1 para que o texto faça sentido na situação, sob a condição verificada por teste de que **a reação de cada perfil seja a mais parecida com o próprio perfil** nos eixos tocados (`keyConsistency`). As nove tensões tocam um eixo cada, diretamente. Nos cenários em dois tempos, as reações da segunda fase são escritas como respostas ao fato novo, umas mantendo a linha e outras adaptando-a, e essa diferença entra nas cargas do eixo `judgment`; o número de vezes em que a pessoa manteve a mesma reação é apresentado no resultado apenas como leitura.

## Limites

Os vetores são estilizações de correntes internamente diversas; um autor concreto pode contradizer a célula do seu grupo. O índice 0–100 é uma medida de semelhança de direção no espaço de eixos, não uma probabilidade nem um percentil. O instrumento é exploratório e educativo.
