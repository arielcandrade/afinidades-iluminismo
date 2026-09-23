# Afinidades com o Iluminismo — v3, edição em eixos

Versão nova do questionário, independente da versão da raiz (que permanece intacta). Mede a afinidade de uma pessoa com **cinco correntes** do Iluminismo — Philosophes, Escocês, Aufklärung, Radical e Despotismo esclarecido — a partir de sua posição em **nove eixos** de pensamento, e não por contagem direta de perfis. Versão 3.0.0 do instrumento.

HTML estático, sem dependências, sem servidor e sem envio de dados. Funciona no navegador do celular e do computador.

## Como executar

Na pasta `v3/`:

```sh
python3 -m http.server 8000
```

Acesse `http://localhost:8000`. Para publicação, basta servir a pasta em qualquer hospedagem estática HTTPS (GitHub Pages: `https://arielcandrade.github.io/afinidades-iluminismo/v3/`). Também abre via `index.html` no computador.

## Como funciona para quem responde

1. **Capa** — nome ou apelido opcional; opção de lembrar o progresso neste aparelho por 24 horas.
2. **24 situações**, uma por tela — situação curta e cinco reações. A pessoa marca a **mais próxima** e a **mais distante**. Cada reação nomeia um custo; não há alternativa obviamente correta.
3. **4 situações em dois tempos** — depois da primeira escolha, aparece um **novo fato** e a pessoa decide de novo entre cinco reações reformuladas.
4. **9 tensões**, três por tela — duas posições e uma escala de cinco pontos.
5. **Resultado** — frase de abertura com o perfil principal e o intervalo ("índice 74, entre 49 e 80"); cinco barras com faixa de 80 %; réguas dos nove eixos com a posição da pessoa e a do perfil principal; leituras "Onde você se parece e onde se afasta", "A tensão que você carrega" e "Convicção"; cartões dos cinco perfis; "Como ler"; botões Imprimir, Copiar respostas (JSON) e Refazer.

Duração prevista: cerca de 25 minutos. Ordem de situações e reações sorteada a cada sessão.

## Pontuação, em uma frase

Cada reação carrega uma posição (−2 a +2) em dois ou três eixos; a mais próxima soma, a mais distante subtrai; as tensões pontuam direto no eixo; a posição resultante nos nove eixos é comparada por cosseno com o vetor de cada corrente e levada a 0–100. O intervalo vem de reamostragem dos itens respondidos (bootstrap, 300 vezes, semente derivada das respostas). Detalhes em `docs/validacao.md`.

## Documentação

- `docs/modelo-conceitual.md` — as cinco correntes, os nove eixos e a justificativa de cada célula da matriz.
- `docs/matriz-de-conteudo.md` — todos os itens com suas cargas (gerado; não mostrar aos respondentes antes do fim).
- `docs/validacao.md` — critérios de construção, simulação, decisões registradas e protocolo de piloto.

## Alterar itens ou cargas

1. Edite `js/data/items.js` (cenários, dois tempos, tensões), `js/data/profiles.js` (vetores e textos) ou `js/data/axes.js` (nomes dos polos).
2. Incremente `instrument.version` se respostas salvas ficarem incompatíveis.
3. Registre a justificativa em `docs/validacao.md`.
4. Rode tudo e regenere a matriz:

```sh
node tests/scoring.test.js
node tests/storage.test.js
node scripts/simulate.js
node scripts/generate-blueprint.js > docs/matriz-de-conteudo.md
```

`simulate.js` encerra com código 1 quando um critério falha. Simulação mais curta: `SIMULATIONS=5000 node scripts/simulate.js`. No navegador, abra `tests/scoring.test.html`.

## Estrutura

```text
index.html
css/styles.css          sistema visual da raiz + faixas de intervalo, réguas, "novo fato"
js/
  namespace.js
  scoring.js            cargas por eixo, normalização, cosseno, bootstrap, leituras, verificações
  storage.js            progresso opcional em localStorage (chave própria da v3)
  app.js                capa, cenários, dois tempos, tensões, resultado
  data/
    axes.js             nove eixos com polos
    profiles.js         cinco perfis com vetor nos nove eixos
    items.js            24 cenários, 4 em dois tempos, 9 tensões
tests/                  scoring.test.js, storage.test.js, scoring.test.html
scripts/                simulate.js, generate-blueprint.js
docs/                   modelo-conceitual.md, matriz-de-conteudo.md, validacao.md
```

## Antes do uso público

Os testes verificam matemática, cobertura, chave, redação e comportamento sob simulação. Não substituem revisão por especialistas, entrevistas cognitivas e um piloto com pessoas reais. Até então, apresente o questionário como piloto educativo.
