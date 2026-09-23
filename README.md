# Afinidades com o Iluminismo — um questionário em situações

Aplicação estática, sem dependências e sem servidor, que compara as reações de uma pessoa a 28 situações do dia a dia de uma cidade com dez perfis históricos prototípicos do Iluminismo. Versão 2.0.0 do instrumento.

## Como executar

### Opção recomendada

Na pasta do projeto:

```sh
python3 -m http.server 8000
```

Acesse `http://localhost:8000`.

Para publicação, envie todos os arquivos para qualquer hospedagem estática HTTPS (GitHub Pages, Netlify, servidor institucional).

### Abrir diretamente

Também é possível abrir `index.html` pelo gerenciador de arquivos em Safari, Chrome ou Firefox no computador. Não há requisições externas nem fontes baixadas: tudo funciona offline. A abertura via `file://` em celulares não é oficialmente suportada.

## Como funciona para quem responde

1. **Capa** — um parágrafo, nome ou apelido opcional, botão Começar. Um link discreto permite lembrar o progresso neste aparelho por 24 horas.
2. **28 situações**, uma por tela — situação curta e quatro reações em linguagem cotidiana. A pessoa marca a reação **mais próxima** da sua e a **mais distante**: o primeiro toque marca a mais próxima, o segundo, em outra reação, a mais distante; cada cartão também tem botões explícitos para teclado. O avanço automático pode ser desligado; Voltar está sempre presente.
3. **8 tensões**, duas por tela — duas posições e uma escala de cinco pontos entre elas.
4. **Resultado** — uma frase de síntese combinando os três perfis mais próximos, três barras com o índice `0–100` de cada um, cartão do 1º aberto e dos outros dois recolhidos, seção "Como ler" recolhida, botões Imprimir e Refazer. Empate exato ou diferença menor que 4 pontos aparece como uma única frase no rodapé.

Duração prevista: cerca de 25 minutos. A ordem das situações e das reações é sorteada a cada sessão.

## Pontuação

Cada reação tem um perfil principal (+2) e, em alguns casos, um secundário (+1).

- **Situação**: a reação mais próxima soma seus pesos; a mais distante subtrai os pesos dela.
- **Tensão**: valor de `−2` a `+2`, somado ao perfil da segunda posição e subtraído do da primeira.

Cada perfil é normalizado pelos limites teóricos do próprio bloco. O índice final usa:

```text
100 × (0,80 × situações + 0,20 × tensões)
```

Diferenças menores que 4 pontos são tratadas como empate técnico. A estabilidade é testada removendo cada bloco uma vez; se um perfil do top 3 sai do top 3 em todas as variantes, o resultado recebe uma nota discreta.

## Privacidade

Nenhuma resposta é enviada para rede. Por padrão, o estado existe apenas na memória da página. Se a pessoa ativar "Lembrar meu progresso neste aparelho", nome, ordem e respostas ficam no `localStorage` até 24 horas após a última alteração; dados vencidos são removidos na próxima abertura. Refazer ou voltar à capa apaga o registro imediatamente. O nome é opcional, usado só no título do resultado e inserido com `textContent`.

## Interpretação

Os dez perfis não são categorias mutuamente exclusivas: misturam tradições regionais, correntes filosóficas, uma doutrina econômica e uma prática de governo. O índice `0–100` é uma escala interna do questionário, não uma probabilidade, percentil ou diagnóstico.

Consulte:

- `docs/modelo-conceitual.md` — definições, autores, proposições e limites dos perfis;
- `docs/matriz-de-conteudo.md` — cenários, reações, chaves e matriz de coocorrência (não mostrar aos respondentes antes do fim);
- `docs/validacao.md` — testes, simulação, critérios de aceite e protocolo de piloto humano.

## Alterar cenários, tensões ou pesos

1. Edite `js/data/items.js` (cenários e tensões) ou `js/data/profiles.js` (textos dos perfis).
2. Preserve IDs quando a semântica não mudar; incremente `instrument.version` quando respostas salvas ficarem incompatíveis.
3. Registre a justificativa em `docs/validacao.md`.
4. Regenere a matriz:

   ```sh
   node scripts/generate-blueprint.js > docs/matriz-de-conteudo.md
   ```

5. Execute testes e simulação:

   ```sh
   node tests/scoring.test.js
   node tests/storage.test.js
   node scripts/simulate.js
   ```

Uma mudança é aceitável somente se todos os testes passarem (cada perfil principal em ≥ 10 cenários, cada par confundível junto em ≥ 4 e com tensão dedicada, redação dentro das regras) e se `simulate.js` encerrar sem falhas: arquétipo de cada perfil em 1º com margem ≥ 10, resultado sensível < 25% em padrões aleatórios, troca do top 3 por resposta única < 10% em respondentes realistas e frequência de 1º lugar entre 7% e 13% por perfil.

## Testes

### Terminal

```sh
node tests/scoring.test.js
node tests/storage.test.js
node scripts/simulate.js
```

Para uma simulação mais curta durante o desenvolvimento:

```sh
SIMULATIONS=5000 node scripts/simulate.js
```

### Navegador

Abra `tests/scoring.test.html`. A página funciona em hospedagem local e via `file://`.

## Estrutura

```text
index.html
css/
  styles.css          sistema visual editorial (papel, tinta, oxblood; serifa; filetes)
js/
  namespace.js
  scoring.js          pontuação melhor/pior, tensões, normalização, ranking, estabilidade
  storage.js          progresso opcional em localStorage (24 h)
  app.js              capa, cenários, tensões, resultado
  data/
    profiles.js       dez perfis: nome, síntese, descrição, ideias
    items.js          28 cenários e 8 tensões
tests/
  scoring.test.html
  scoring.test.js
  storage.test.js
scripts/
  generate-blueprint.js
  simulate.js
docs/
  modelo-conceitual.md
  matriz-de-conteudo.md
  validacao.md
```

## Validação antes do uso público

Os testes automatizados verificam consistência matemática, cobertura, balanceamento, redação, neutralidade aleatória e separação entre perfis. Eles não substituem:

- revisão por especialistas independentes;
- entrevistas cognitivas com 8–12 pessoas;
- piloto de duração em celular e computador;
- verificação manual de acessibilidade (teclado, leitor de tela, modo escuro, impressão).

Até a conclusão dessas etapas, apresente o questionário como piloto educativo.
