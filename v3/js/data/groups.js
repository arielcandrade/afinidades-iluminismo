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
    philosophes: {
      sources: [
        { title: "Philosophes", language: "inglês", url: "https://en.wikipedia.org/wiki/Philosophes" },
        { title: "Encyclopédie", language: "inglês", url: "https://en.wikipedia.org/wiki/Encyclop%C3%A9die" },
        { title: "Age of Enlightenment", language: "inglês", url: "https://en.wikipedia.org/wiki/Age_of_Enlightenment" },
        { title: "French Enlightenment", language: "inglês", url: "https://en.wikipedia.org/wiki/French_Enlightenment" },
        { title: "Salon (gathering)", language: "inglês", url: "https://en.wikipedia.org/wiki/Salon_(gathering)" },
        { title: "Jean Calas", language: "inglês", url: "https://en.wikipedia.org/wiki/Jean_Calas" },
        { title: "Physiocracy", language: "inglês", url: "https://en.wikipedia.org/wiki/Physiocracy" },
        { title: "Counter-Enlightenment", language: "inglês", url: "https://en.wikipedia.org/wiki/Counter-Enlightenment" },
        { title: "Iluminismo", language: "português", url: "https://pt.wikipedia.org/wiki/Iluminismo" }
      ]
    },
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
    },
    aufklarung: {
      sources: [
        { title: "Aufklärung", language: "alemão", url: "https://de.wikipedia.org/wiki/Aufkl%C3%A4rung" },
        { title: "Age of Enlightenment", language: "inglês", url: "https://en.wikipedia.org/wiki/Age_of_Enlightenment" },
        { title: "Beantwortung der Frage: Was ist Aufklärung?", language: "alemão", url: "https://de.wikipedia.org/wiki/Beantwortung_der_Frage:_Was_ist_Aufkl%C3%A4rung%3F" },
        { title: "Pantheismusstreit", language: "alemão", url: "https://de.wikipedia.org/wiki/Pantheismusstreit" },
        { title: "Berliner Mittwochsgesellschaft", language: "alemão", url: "https://de.wikipedia.org/wiki/Berliner_Mittwochsgesellschaft" },
        { title: "Haskalah", language: "inglês", url: "https://en.wikipedia.org/wiki/Haskalah" },
        { title: "Pietism", language: "inglês", url: "https://en.wikipedia.org/wiki/Pietism" },
        { title: "Counter-Enlightenment", language: "inglês", url: "https://en.wikipedia.org/wiki/Counter-Enlightenment" },
        { title: "Immanuel Kant", language: "inglês", url: "https://en.wikipedia.org/wiki/Immanuel_Kant" }
      ]
    },
    radical: {
      sources: [
        { title: "Lumières radicales", language: "francês", url: "https://fr.wikipedia.org/wiki/Lumi%C3%A8res_radicales" },
        { title: "Jonathan Israel", language: "inglês", url: "https://en.wikipedia.org/wiki/Jonathan_Israel" },
        { title: "Age of Enlightenment", language: "inglês", url: "https://en.wikipedia.org/wiki/Age_of_Enlightenment" },
        { title: "Treatise of the Three Impostors", language: "inglês", url: "https://en.wikipedia.org/wiki/Treatise_of_the_Three_Impostors" },
        { title: "Clandestine literature", language: "inglês", url: "https://en.wikipedia.org/wiki/Clandestine_literature" },
        { title: "Baron d'Holbach", language: "inglês", url: "https://en.wikipedia.org/wiki/Baron_d%27Holbach" },
        { title: "Rights of Man", language: "inglês", url: "https://en.wikipedia.org/wiki/Rights_of_Man" },
        { title: "John Toland", language: "inglês", url: "https://en.wikipedia.org/wiki/John_Toland" },
        { title: "Adriaan Koerbagh", language: "inglês", url: "https://en.wikipedia.org/wiki/Adriaan_Koerbagh" }
      ]
    },
    despotism: {
      sources: [
        { title: "Enlightened absolutism", language: "inglês", url: "https://en.wikipedia.org/wiki/Enlightened_absolutism" },
        { title: "Despotismo esclarecido", language: "português", url: "https://pt.wikipedia.org/wiki/Despotismo_esclarecido" },
        { title: "Reformas pombalinas", language: "português", url: "https://pt.wikipedia.org/wiki/Reformas_pombalinas" },
        { title: "Diretório dos Índios", language: "português", url: "https://pt.wikipedia.org/wiki/Diret%C3%B3rio_dos_%C3%8Dndios" },
        { title: "Josephinism", language: "inglês", url: "https://en.wikipedia.org/wiki/Josephinism" },
        { title: "Cameralism", language: "inglês", url: "https://en.wikipedia.org/wiki/Cameralism" },
        { title: "Bourbon Reforms", language: "inglês", url: "https://en.wikipedia.org/wiki/Bourbon_Reforms" },
        { title: "Suppression of the Society of Jesus", language: "inglês", url: "https://en.wikipedia.org/wiki/Suppression_of_the_Society_of_Jesus" },
        { title: "Nakaz", language: "inglês", url: "https://en.wikipedia.org/wiki/Nakaz" },
        { title: "On Crimes and Punishments", language: "inglês", url: "https://en.wikipedia.org/wiki/On_Crimes_and_Punishments" },
        { title: "Partitions of Poland", language: "inglês", url: "https://en.wikipedia.org/wiki/Partitions_of_Poland" },
        { title: "Pugachev's Rebellion", language: "inglês", url: "https://en.wikipedia.org/wiki/Pugachev%27s_Rebellion" },
        { title: "Beantwortung der Frage: Was ist Aufklärung?", language: "alemão", url: "https://de.wikipedia.org/wiki/Beantwortung_der_Frage:_Was_ist_Aufkl%C3%A4rung%3F" }
      ]
    }
  };
});
