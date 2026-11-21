(function (root, factory) {
  "use strict";

  var storage = factory(root);

  if (typeof module === "object" && module.exports) {
    module.exports = storage;
  }

  root.IdeiasIluministas = root.IdeiasIluministas || {};
  root.IdeiasIluministas.storage = storage;
})(typeof globalThis !== "undefined" ? globalThis : this, function (root) {
  "use strict";

  var KEY = "afinidade-iluminista:v3:session";
  var SCHEMA_VERSION = 1;
  var TTL_MS = 48 * 60 * 60 * 1000;
  var memoryValue = null;

  function getLocalStorage() {
    try {
      var candidate = root.localStorage;
      var probeKey = KEY + ":probe";
      candidate.setItem(probeKey, "1");
      candidate.removeItem(probeKey);
      return candidate;
    } catch (error) {
      return null;
    }
  }

  function validEnvelope(envelope) {
    return Boolean(
      envelope &&
      envelope.schemaVersion === SCHEMA_VERSION &&
      Number.isFinite(envelope.expiresAt) &&
      envelope.state &&
      typeof envelope.state === "object"
    );
  }

  function clear() {
    memoryValue = null;
    var local = getLocalStorage();
    if (local) {
      try {
        local.removeItem(KEY);
      } catch (error) {
        // A sessão em memória continua funcionando quando o navegador bloqueia storage.
      }
    }
  }

  function save(state, persist) {
    var envelope = {
      schemaVersion: SCHEMA_VERSION,
      expiresAt: Date.now() + TTL_MS,
      state: state
    };

    memoryValue = envelope;

    if (!persist) {
      var localForRemoval = getLocalStorage();
      if (localForRemoval) {
        try {
          localForRemoval.removeItem(KEY);
        } catch (error) {
          // Sem efeito sobre a cópia em memória.
        }
      }
      return { persisted: false };
    }

    var local = getLocalStorage();
    if (!local) {
      return { persisted: false };
    }

    try {
      local.setItem(KEY, JSON.stringify(envelope));
      return { persisted: true };
    } catch (error) {
      return { persisted: false };
    }
  }

  function readEnvelope() {
    var local = getLocalStorage();

    if (local) {
      try {
        var raw = local.getItem(KEY);
        if (raw) {
          return JSON.parse(raw);
        }
      } catch (error) {
        memoryValue = null;
        try {
          local.removeItem(KEY);
        } catch (removalError) {
          // O valor inválido será ignorado.
        }
        return null;
      }
    }

    return memoryValue;
  }

  function load() {
    var envelope = readEnvelope();

    if (!validEnvelope(envelope) || envelope.expiresAt <= Date.now()) {
      clear();
      return null;
    }

    memoryValue = envelope;
    return envelope.state;
  }

  function isAvailable() {
    return Boolean(getLocalStorage());
  }

  return {
    key: KEY,
    schemaVersion: SCHEMA_VERSION,
    ttlMs: TTL_MS,
    save: save,
    load: load,
    clear: clear,
    isAvailable: isAvailable
  };
});

