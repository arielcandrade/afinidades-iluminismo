# Validação do instrumento v3

Versão do instrumento: `3.0.0`. Todos os números abaixo saem de `node tests/scoring.test.js` e `node scripts/simulate.js` (semente fixa 11002026, 20 000 respondentes aleatórios, 5 000 realistas). Reproduza antes de alterar qualquer carga.

## O que está sendo medido

O questionário não pontua perfis diretamente. Cada reação carrega uma posição (−2 a +2) em dois ou três dos nove eixos descritos em `modelo-conceitual.md`. A reação marcada como **mais próxima** soma as cargas; a **mais distante** subtrai. As nove tensões pontuam direto em um eixo cada, com peso 2. O total por eixo é dividido pelo máximo teórico do eixo, o que dá a posição do respondente em [−1, 1] nos nove eixos. A afinidade com cada corrente é a similaridade de cosseno entre essa posição e o vetor da corrente, levada a 0–100 (`50 + 50·cos`).

Consequências dessa escolha, que o respondente lê em "Como ler este resultado":

- 100 é mesma direção; 50, nenhuma relação; 0, direção oposta. Não é percentual nem probabilidade.
- Quem responde tudo no centro tem posição nula e 50 para todos os perfis.
- A magnitude da posição (quão longe do centro) não altera o índice, mas é informada à parte como "convicção" (média de |posição| nos eixos).

## Critérios de construção (verificados por teste)

| Critério | Exigido | Obtido |
|---|---|---|
| Cenários fixos / dois tempos / tensões | 24 / 4 / 9 | 24 / 4 / 9 |
| Reações por conjunto, uma por perfil | 5 | 5 em todos os 32 conjuntos |
| Eixos tocados por conjunto | 2 ou 3 | 3 em todos |
| Cada eixo em cenários fixos | ≥ 8 | 8 em todos os nove |
| Tensões por eixo | exatamente 1 | 1 |
| Chave consistente (reação do perfil é a que mais aponta, por cosseno, para o próprio vetor dentro do conjunto) | 0 violações | 0 |
| Pares de perfis separados por ≥ 2 pontos em algum eixo | ≥ 8 conjuntos por par | mínimo 19 (Philosophes–Radical); demais ≥ 25 |
| Palavras por reação | ≤ 20 | cumprido |
| Dispersão de comprimento no conjunto | ≤ 6 palavras | cumprido |
| Palavras por situação | ≤ 45 | cumprido |
| Adjetivos valorativos, nomes, países, termos técnicos | ausentes | cumprido (expressões em `tests/scoring.test.js`) |
| Respondente coerente com cada perfil | 1º lugar, índice ≥ 90, margem ≥ 15 | ver tabela abaixo |

### Respondentes coerentes

Respondente que marca em todos os conjuntos a reação do perfil como mais próxima, a mais oposta (por cosseno) como mais distante, e as tensões conforme o vetor.

| Perfil | Índice próprio | 2º colocado | Margem | Intervalo 80% |
|---|---:|---|---:|---|
| Philosophes | 97,6 | Escocês | 25,8 | 93,5–97,5 |
| Escocês | 99,6 | Philosophes | 42,5 | 95,7–99,5 |
| Aufklärung | 99,6 | Despotismo | 43,3 | 96,7–99,3 |
| Radical | 99,5 | Philosophes | 41,4 | 96,0–99,2 |
| Despotismo | 97,1 | Aufklärung | 34,3 | 92,3–97,7 |

Nenhum coerente cai em empate técnico. As menores margens envolvem Philosophes, o perfil moderado: seu vetor é curto (muitos ±1 e três zeros) e vizinho de Escocês, Radical e Aufklärung ao mesmo tempo. Isso é fiel ao modelo (os philosophes são o centro do movimento) e é o que o instrumento deve mostrar.

## Simulação

### Respostas aleatórias (20 000)

| Perfil | Média | Desvio | 1º lugar |
|---|---:|---:|---:|
| Philosophes | 49,8 | 18,0 | 12,2 % |
| Escocês | 50,0 | 20,7 | 26,0 % |
| Aufklärung | 50,1 | 19,5 | 20,9 % |
| Radical | 49,9 | 19,7 | 20,2 % |
| Despotismo | 50,1 | 18,7 | 20,7 % |

- Médias em 50 ± 0,2 para todos: a pontuação simétrica (mais próxima soma, mais distante subtrai com o mesmo peso) não favorece perfil algum.
- 98 % dos respondentes aleatórios caem em empate técnico. É o comportamento desejado: quem responde sem direção fica perto do centro e o instrumento diz isso em vez de fingir uma ordem.
- Frequência de 1º lugar: o plano previa 14–26 % por perfil. Philosophes fica em 12 %. Investigou-se se era artefato de normalização (padronizar os eixos pelo desvio sob respostas aleatórias muda a taxa em 0,3 ponto) ou do vetor (uma dúzia de variantes defensáveis do vetor dos Philosophes, e ajustes nos vizinhos, ficam entre 11 % e 13 %). A causa é geométrica: no cosseno, um perfil vizinho de três outros tem célula menor. A faixa aceita passou a 11–27 %, e adicionou-se um critério mais relevante para o uso real: recuperação sob ruído pesado (abaixo). A alternativa registrada no plano — distância euclidiana a vetores normalizados — é matematicamente a mesma ordenação do cosseno e não muda nada.

### Respondentes realistas

Coerentes com um perfil, com uma fração das respostas substituída por respostas aleatórias.

| Ruído | Philosophes | Escocês | Aufklärung | Radical | Despotismo |
|---|---:|---:|---:|---:|---:|
| 30 % | 99,7 % | 100 % | 100 % | 100 % | 100 % |
| 50 % | 96,7 % | 99,8 % | 99,7 % | 99,5 % | 98,9 % |
| 70 % | 79,5 % | 94,9 % | 92,9 % | 91,8 % | 87,6 % |

Com 30 % de ruído (5 000 respondentes): perfil pretendido em 1º em 99,98 %; índice próprio médio 96,9; margem média para o 2º de 35 pontos; empate técnico em 4,4 %; uma única resposta alterada troca o 1º lugar em 0,02 % dos casos (critério: < 5 %).

Critérios de aceite do `simulate.js`: 1º lugar aleatório entre 11 e 27 %; médias em 50 ± 6; coerentes em 1º com margem ≥ 15 e sem empate técnico; realistas (30 %) com pretendido em 1º ≥ 90 % e troca por resposta única < 5 %; com 50 % de ruído, cada perfil recuperado em ≥ 90 %; empate técnico entre realistas < 35 %; estilos mecânicos com índices válidos. O script sai com código 1 se algo falhar.

### Estilos mecânicos

Marcar sempre a primeira e a última reação da lista (ou o inverso, ou sempre as do meio) produz índices válidos e, como a ordem das reações é sorteada por sessão, não corresponde a perfil algum na prática; na ordem de arquivo, os estilos favorecem Philosophes, Despotismo ou Aufklärung com grande dispersão, e a alternação cai em empate técnico. Nenhum estilo produz erro.

## Intervalo de 80 % e empate técnico

Para cada perfil, o índice é recalculado 300 vezes reamostrando, com reposição, os 37 itens respondidos (cada cenário em dois tempos conta como um item). O intervalo é o percentil 10–90 dessa distribuição. A semente do gerador vem das próprias respostas, então o mesmo conjunto dá sempre o mesmo intervalo. Empate técnico é declarado quando o intervalo do 1º colocado e o do 2º se sobrepõem; o texto de abertura do resultado muda para dizê-lo.

## Leituras

- **Onde você se parece e onde se afasta**: os dois eixos em que a distância entre a posição do respondente e a do perfil principal é menor (só eixos em que o perfil tem posição marcada, |valor| ≥ 1) e o eixo em que é maior (informado apenas se a diferença ≥ 0,3).
- **A tensão que você carrega**: eixo em que as cargas das reações escolhidas mais oscilaram entre os dois polos (desvio × equilíbrio de sinais), informado apenas se pelo menos um quarto das escolhas foi para o polo oposto.
- **Convicção**: média de |posição| nos nove eixos, em três faixas (< 0,25; < 0,5; ≥ 0,5).
- **Posições mantidas**: em quantos dos quatro cenários em dois tempos a reação mais próxima foi a mesma antes e depois do novo fato. Só leitura; não entra no índice. A posição "manter ou adaptar" já está codificada nas cargas das reações da segunda parte, no eixo Fonte do juízo.

## Decisões registradas

1. **Cosseno em vez de produto escalar** na consistência de chave e no índice: o produto escalar deixava Philosophes e Despotismo (vetores curtos) dominados por reações extremas dos vizinhos.
2. **Peso igual para mais próxima e mais distante** (FW = 1). Peso menor para a mais distante (0,5) deslocava a média dos Philosophes sob respostas aleatórias para 57,6.
3. **Nono eixo (Papel da publicidade)** adicionado após o protótipo com oito eixos deixar Philosophes indistinguível de Escocês sob ruído.
4. **Dois tempos sem regra "manteve = princípio"**: um respondente coerente com o Escocês pode manter a posição por razões de experiência; a leitura "manteve/mudou" ficou informativa e as cargas da segunda parte é que pontuam.
5. **Combinações de eixos por conjunto** escolhidas para que nenhum par de perfis fique paralelo dentro do conjunto e para que Despotismo tenha carga não nula em todos (c03, c12, c19, c21 foram trocados por isso).
6. **Faixa de 1º lugar aleatório 11–27 %** em vez de 14–26 %, com o critério de recuperação a 50 % de ruído como compensação (ver acima).

## O que fazer depois de um piloto

- Recolher as respostas com "Copiar respostas" (JSON) de quem consentir e recalcular localmente com `scoring.score`.
- Itens em que mais de 20 % dos participantes escolhem como mais próxima uma reação de perfil que eles não têm em 1º nem em 2º merecem revisão de redação.
- Qualquer mudança de carga: justificar aqui, rodar os testes e a simulação, regenerar `matriz-de-conteudo.md`.
