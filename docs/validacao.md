# Validação e controle de qualidade

## Situação da versão 2.0.0

A versão 2.0.0 substituiu integralmente o instrumento anterior (36 afirmações Likert, 12 dilemas e 4 prioridades) por **28 cenários contemporâneos com escolha melhor/pior** e **8 tensões entre pares confundíveis**. Motivos registrados no redesenho:

- perguntas abstratas e longas, em linguagem de manual;
- baixa separação: 41,6% de resultados sensíveis e 20,2% de troca do top 3 por uma única resposta em padrões aleatórios;
- fluxo burocrático (tela de identidade separada, três avisos no resultado);
- visual sem personalidade.

Esta versão passou por validação técnica automatizada e revisão interna de conteúdo. Continua sendo um instrumento exploratório e educativo, sem amostra normativa nem validade psicométrica demonstrada.

## Testes determinísticos

Comando:

```sh
node tests/scoring.test.js
node tests/storage.test.js
```

Resultado em 22 de setembro de 2026: **24 testes aprovados e nenhum reprovado** — 19 de pontuação e 5 de armazenamento. O mesmo conjunto de pontuação roda no navegador em `tests/scoring.test.html`.

Os testes de pontuação verificam:

- 28 cenários com 4 reações e 8 tensões; IDs únicos;
- pesos de bloco somando 1, com 80% para os cenários;
- cada reação com exatamente um perfil principal (+2) e no máximo um secundário (+1); os quatro principais de um cenário são distintos;
- cada perfil principal em ≥ 10 cenários e presente em ≥ 1 tensão;
- cada par confundível junto em ≥ 4 cenários e com uma tensão dedicada;
- redação: reações com ≤ 18 palavras, dispersão ≤ 5 palavras dentro do cenário, sem adjetivos valorativos, nomes, países ou termos técnicos (listas em `tests/scoring.test.js`);
- limites teóricos finitos, simétricos e não vazios;
- detecção de respostas incompletas e da escolha da mesma reação como mais próxima e mais distante;
- direção da pontuação (mais próxima soma, mais distante subtrai; tensão negativa favorece a primeira posição);
- índices finitos em `[0,100]` e determinismo;
- alcance do máximo teórico por todos os perfis;
- **respondente coerente com cada perfil coloca o perfil em 1º com margem ≥ 10 pontos**;
- análise de estabilidade com uma variante por bloco;
- diferenciação entre empate exato, proximidade e corte entre 3º e 4º;
- perfis com síntese de 8–16 palavras, fragmento combinável e descrição de 60–100 palavras.

## Balanceamento verificado

| Perfil | Cenários (principal) |
|---|---:|
| Philosophes | 10 |
| Escocês | 13 |
| Aufklärung | 10 |
| Italiano | 13 |
| Americano | 13 |
| Ibérico | 10 |
| Radical | 12 |
| Moderado | 11 |
| Despotismo | 10 |
| Fisiocracia | 10 |

Coocorrência dos pares confundíveis (mínimo 4): Ibérico×Despotismo 4, Moderado×Aufklärung 5, Philosophes×Radical 5, Americano×Radical 5, Italiano×Despotismo 5, Escocês×Fisiocracia 6, Italiano×Fisiocracia 6, Ibérico×Moderado 5. A matriz completa está em `docs/matriz-de-conteudo.md`.

## Simulação Monte Carlo

Comando:

```sh
node scripts/simulate.js
```

Foram executados **50.000 padrões aleatórios** e **10.000 respondentes realistas**, com semente reproduzível `11002026`. O script encerra com código 1 se qualquer critério de aceite falhar. Resultado em 22 de setembro de 2026: **nenhuma falha**.

### Critérios de aceite e resultados

| Critério | Meta | Resultado |
|---|---|---|
| Arquétipo coerente de cada perfil em 1º | margem ≥ 10 | margens de **17,4 a 29,0** (mínimo: Americano sobre Escocês) |
| Arquétipo maximizador alcança o próprio máximo | 100/100 | 10 de 10 |
| Resultado sensível em padrões aleatórios | < 25% | **16,50%** (antes: 41,62%) |
| Troca do top 3 por uma resposta alterada (respondentes realistas) | < 10% | **8,52%** |
| Frequência de 1º lugar em padrões aleatórios | 7–13% por perfil | **8,36% a 12,14%** |
| Perfil pretendido em 1º (respondentes realistas) | ≥ 85% | **88,49%** |
| Perfil pretendido no top 3 (respondentes realistas) | ≥ 98% | **98,75%** |

### Neutralidade estrutural

- Médias dos dez índices sob respostas aleatórias: entre **49,94 e 50,10**.
- Desvios-padrão: entre **9,32 e 11,46** pontos. Perfis com 10 cenários (Philosophes, Aufklärung) variam um pouco mais que os com 13; o efeito fica dentro da faixa de 7–13% de primeiro lugar.
- Presença no top 3: entre **28,81% e 32,01%**.

### Separação dos pares confundíveis

Diferença, em pontos, entre o perfil-alvo e o perfil confundível quando o respondente coerente é do perfil-alvo (A→B / B→A): Ibérico×Despotismo 25,8/26,5; Moderado×Aufklärung 40,0/30,7; Philosophes×Radical 29,2/40,0; Americano×Radical 62,7/45,2; Italiano×Despotismo 76,5/31,0; Escocês×Fisiocracia 36,5/38,5; Italiano×Fisiocracia 81,5/57,5; Ibérico×Moderado 30,7/54,5.

### Estabilidade e o que muda em relação ao plano

- Em padrões aleatórios, 94,6% dos resultados têm alguma diferença inferior a 4 pontos entre posições adjacentes do top 3 (ou entre 3º e 4º); 4,95% têm empate exato visível. A diferença média entre 3º e 4º é de ~3 pontos, e uma única resposta desloca um índice em 3–4 pontos. Por isso a **troca do top 3 por resposta única em padrões puramente aleatórios ficou em 17,98%** — abaixo dos 20,15% anteriores, mas acima dos 10% pretendidos. Esse teto é estrutural: com 36 itens, respostas sem preferência produzem um ranking que nenhum algoritmo torna estável.
- O critério de 10% foi então aplicado a **respondentes realistas**: coerentes com um perfil (ordem de parentesco em `tests/scoring.test.js`), com 30% das respostas substituídas por aleatórias. Nessa população, a troca do top 3 por resposta única é de 8,52%, a taxa de resultado sensível de 13,89% e a diferença média entre 3º e 4º de 5,2 pontos.
- A definição de "resultado sensível" foi mantida da versão anterior: um perfil do top 3 sai do top 3 em pelo menos duas variantes de remoção de bloco (com dois blocos, em todas). Uma definição mais dura (qualquer mudança ao remover as tensões) marcaria 75% dos padrões aleatórios e foi descartada por não distinguir ruído de resultado.
- Mudar os pesos para 90/10 ou 70/30 altera o top 3 de 47,0% e 43,9% dos padrões aleatórios, o que confirma que o bloco de tensões atua como desempate relevante.

### Estilos de resposta mecânicos

Padrões em ordem de arquivo (a ordem real das reações é sorteada por sessão): sempre primeira/última reação, sempre última/primeira, sempre as do meio e alternância. Todos produziram índices válidos em `[0,100]`. Como a ordem exibida é embaralhada por cenário e por sessão, um respondente que clique sempre na mesma posição não favorece um perfil fixo.

## Interface e acessibilidade (verificação automatizada parcial)

Capturas em Chrome headless (1200 px e, via iframe, 320 px) confirmaram capa, cenário com marcações "mais próxima"/"mais distante", tensões e resultado sem transbordamento. Ainda exigem verificação manual: leitor de tela, teclado ponta a ponta, modo escuro em dispositivo real e impressão.

## Revisão de conteúdo

- Situações ambientadas em prefeitura, escola, tribunal, empresa, cooperativa, biblioteca, hospital e imprensa, sem nomes de autores, países ou escolas.
- Nenhuma reação apresentada como obviamente correta; reações do mesmo cenário com comprimento semelhante.
- Chaves documentadas em `docs/matriz-de-conteudo.md`; definição dos perfis em `docs/modelo-conceitual.md`.
- Ajustes feitos durante a validação, com motivo:
  - c03: reação de Despotismo trocada por Escocês para aumentar a coocorrência Americano×Escocês (margem do arquétipo americano subiu de 9,0 para 11,9).
  - c13 e c22: reações de Despotismo e Escocês trocadas por Italiano para aumentar a coocorrência Italiano×Philosophes (o respondente italiano com ruído era superado por Philosophes em 25% dos casos).
  - c27 e c28: reações de Despotismo e Moderado trocadas por Escocês para reforçar Americano×Escocês (margem final 17,4).
  - Pesos secundários removidos de c09, c19 e c23 porque recaíam sobre pares confundíveis (Escocês×Fisiocracia, Escocês×Moderado).

Alterações futuras de um cenário ou chave devem registrar versão anterior, motivo, impacto sobre cobertura e simulação, e versão do instrumento em que a mudança entrou.

## Protocolo de entrevistas cognitivas

Antes de expor o formulário ao grupo definitivo, conduzir uma rodada com 8–12 pessoas semelhantes ao público-alvo:

1. selecionar participantes que não sejam especialistas em Iluminismo;
2. pedir que respondam individualmente em celular ou computador;
3. em 8–10 cenários previamente selecionados, pedir que expliquem em voz alta por que uma reação é a mais próxima e outra a mais distante;
4. registrar reações percebidas como "a certa", termos difíceis e cenários em que a pessoa quis marcar duas reações como próximas;
5. medir tempo total, tempo por cenário, abandono e uso do avanço automático;
6. revisar qualquer cenário interpretado de modo diferente do previsto por mais de 20% dos participantes;
7. repetir testes e simulação após cada alteração.

Metas: mediana de conclusão ≤ 25 minutos; percentil 90 ≤ 30 minutos; abandono ≤ 10%; nenhum cenário com interpretação divergente acima de 20%.

Essa etapa exige participantes reais e consentimento; não pode ser substituída pelos testes automatizados. Até sua execução, o questionário deve ser apresentado como **versão exploratória em piloto**.

## Matriz de compatibilidade manual

Verificar antes da publicação:

- Safari, Chrome e Firefox desktop por `file://`;
- Safari iOS e Chrome Android por HTTPS;
- navegação integral por teclado (cartões e botões "mais próxima"/"mais distante");
- leitor de tela em pelo menos uma combinação disponível;
- largura de 320 px e zoom de 200%;
- modo escuro e impressão em preto e branco;
- armazenamento permitido, bloqueado, corrompido e expirado;
- retomada preservando ordem de cenários, ordem de reações e respostas;
- ausência de solicitações de rede.
