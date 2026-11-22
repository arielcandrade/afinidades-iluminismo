(function (root, factory) {
  "use strict";

  var groups = factory();

  if (typeof module === "object" && module.exports) {
    module.exports = groups;
  }

  root.IdeiasIluministas = root.IdeiasIluministas || {};
  root.IdeiasIluministas.groups = groups;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  // Verbetes consultados para os textos de content/grupos/<id>.md, por id de perfil.
  return {
    scottish: {
      sources: [
        { title: "Scottish Enlightenment", language: "inglês", url: "https://en.wikipedia.org/wiki/Scottish_Enlightenment" },
        { title: "Conjectural history", language: "inglês", url: "https://en.wikipedia.org/wiki/Conjectural_history" },
        { title: "Scottish common sense realism", language: "inglês", url: "https://en.wikipedia.org/wiki/Scottish_common_sense_realism" },
        { title: "Spontaneous order", language: "inglês", url: "https://en.wikipedia.org/wiki/Spontaneous_order" },
        { title: "The Select Society", language: "inglês", url: "https://en.wikipedia.org/wiki/The_Select_Society" },
        { title: "The Poker Club", language: "inglês", url: "https://en.wikipedia.org/wiki/The_Poker_Club" },
        { title: "John Millar (philosopher)", language: "inglês", url: "https://en.wikipedia.org/wiki/John_Millar_(philosopher)" },
        { title: "Iluminismo escocês", language: "português", url: "https://pt.wikipedia.org/wiki/Iluminismo_escoc%C3%AAs" }
      ]
    }
  };
});
