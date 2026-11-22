"use strict";

// Cálculos e figuras de mapa.html: os cinco perfis do questionário e os cinco grupos de
// js/data/map-groups.js nos nove eixos. Tudo é recalculado a cada geração da página.

var axes = require("../js/data/axes.js");
var profiles = require("../js/data/profiles.js");
var mapGroups = require("../js/data/map-groups.js");

var AXIS_IDS = axes.map(function (axis) {
  return axis.id;
});

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function round(value) {
  return Math.round(value * 10) / 10;
}

function groups() {
  var chosen = profiles.map(function (profile) {
    return { id: profile.id, label: profile.shortName, name: profile.name, chosen: true, vector: profile.vector };
  });
  var others = mapGroups.map(function (group) {
    return { id: group.id, label: group.shortName, name: group.name, chosen: false, vector: group.vector };
  });
  return chosen.concat(others).map(function (group) {
    group.values = AXIS_IDS.map(function (axisId) {
      return group.vector[axisId];
    });
    return group;
  });
}

/* ---------- álgebra ---------- */

function dot(a, b) {
  return a.reduce(function (sum, value, index) {
    return sum + value * b[index];
  }, 0);
}

function norm(a) {
  return Math.sqrt(dot(a, a));
}

function affinity(a, b) {
  return 50 + 50 * (dot(a, b) / (norm(a) * norm(b)));
}

// Componentes principais da matriz centrada, por iteração de potência com deflação.
function principalComponents(list) {
  var size = AXIS_IDS.length;
  var mean = AXIS_IDS.map(function (_, column) {
    return list.reduce(function (sum, group) {
      return sum + group.values[column];
    }, 0) / list.length;
  });
  var centered = list.map(function (group) {
    return group.values.map(function (value, column) {
      return value - mean[column];
    });
  });
  var covariance = AXIS_IDS.map(function (_, row) {
    return AXIS_IDS.map(function (__, column) {
      return centered.reduce(function (sum, values) {
        return sum + values[row] * values[column];
      }, 0);
    });
  });
  var total = covariance.reduce(function (sum, row, index) {
    return sum + row[index];
  }, 0);
  var components = [];
  for (var k = 0; k < 2; k += 1) {
    var vector = AXIS_IDS.map(function (_, index) {
      return 1 + index / size;
    });
    for (var step = 0; step < 2000; step += 1) {
      var next = covariance.map(function (row) {
        return dot(row, vector);
      });
      components.forEach(function (component) {
        var projection = dot(next, component.loadings);
        next = next.map(function (value, index) {
          return value - projection * component.loadings[index];
        });
      });
      var length = norm(next);
      vector = next.map(function (value) {
        return value / length;
      });
    }
    var variance = dot(
      vector,
      covariance.map(function (row) {
        return dot(row, vector);
      })
    );
    components.push({ loadings: vector, share: variance / total });
  }
  // Sinal fixo para a figura não espelhar de uma geração para outra:
  // experiência à direita no primeiro componente, sentimento e utilidade no alto no segundo.
  [AXIS_IDS.indexOf("judgment"), AXIS_IDS.indexOf("moral")].forEach(function (axisIndex, k) {
    if (components[k].loadings[axisIndex] < 0) {
      components[k].loadings = components[k].loadings.map(function (value) {
        return -value;
      });
    }
  });
  var scores = centered.map(function (values) {
    return components.map(function (component) {
      return dot(values, component.loadings);
    });
  });
  return { components: components, scores: scores };
}

// Agrupamento hierárquico por média (UPGMA) do índice de afinidade entre pares.
function clusterTree(list) {
  var clusters = list.map(function (group, index) {
    return { members: [index], leaf: index, height: 100 };
  });
  function linkage(a, b) {
    var sum = 0;
    a.members.forEach(function (i) {
      b.members.forEach(function (j) {
        sum += affinity(list[i].values, list[j].values);
      });
    });
    return sum / (a.members.length * b.members.length);
  }
  while (clusters.length > 1) {
    var best = null;
    for (var i = 0; i < clusters.length; i += 1) {
      for (var j = i + 1; j < clusters.length; j += 1) {
        var value = linkage(clusters[i], clusters[j]);
        if (!best || value > best.value) {
          best = { i: i, j: j, value: value };
        }
      }
    }
    var merged = {
      members: clusters[best.i].members.concat(clusters[best.j].members),
      children: [clusters[best.i], clusters[best.j]],
      height: best.value
    };
    clusters = clusters.filter(function (_, index) {
      return index !== best.i && index !== best.j;
    });
    clusters.push(merged);
  }
  return clusters[0];
}

function leafOrder(tree) {
  if (tree.children) {
    return leafOrder(tree.children[0]).concat(leafOrder(tree.children[1]));
  }
  return [tree.leaf];
}

/* ---------- desenho ---------- */

function textWidth(text, size) {
  return text.length * size * 0.56;
}

function overlaps(a, b) {
  return a.x < b.x + b.width && b.x < a.x + a.width && a.y - a.height < b.y && b.y - b.height < a.y;
}

// Desloca na vertical rótulos que se sobrepõem, na ordem em que foram pedidos.
function placeLabels(labels) {
  var placed = [];
  labels.forEach(function (label) {
    var box = labelBox(label);
    var tries = 0;
    while (
      tries < 12 &&
      placed.some(function (other) {
        return overlaps(box, other);
      })
    ) {
      box.y += label.size + 1;
      tries += 1;
    }
    label.y = box.y;
    placed.push(box);
  });
  return labels;
}

function labelBox(label) {
  var box = { x: label.x, y: label.y, width: textWidth(label.text, label.size), height: label.size };
  if (label.anchor === "end") {
    box.x -= box.width;
  } else if (label.anchor === "middle") {
    box.x -= box.width / 2;
  }
  return box;
}

var DIRECTIONS = [0, 180, -40, 40, -140, 140, -90, 90, -20, 20, -160, 160].map(function (degrees) {
  var radians = (degrees * Math.PI) / 180;
  return { x: Math.cos(radians), y: Math.sin(radians) };
});

// Procura, para cada ponto, uma posição livre ao redor dele, afastando-se aos poucos; quando o
// rótulo fica longe do ponto, uma linha fina liga os dois.
function placeAround(points, taken, bounds) {
  var boxes = taken.slice().concat(
    points.map(function (item) {
      return { x: item.x - 7, y: item.y + 7, width: 14, height: 14 };
    })
  );
  return points.map(function (item) {
    var size = item.size || 13;
    var fallback = null;
    for (var distance = 10; distance <= 70; distance += 12) {
      for (var index = 0; index < DIRECTIONS.length; index += 1) {
        var unit = DIRECTIONS[index];
        var label = {
          x: item.x + unit.x * distance,
          y: item.y + unit.y * distance + (unit.y > 0.3 ? size * 0.8 : unit.y < -0.3 ? 0 : size * 0.35),
          text: item.text,
          size: size,
          anchor: unit.x > 0.3 ? "start" : unit.x < -0.3 ? "end" : "middle",
          chosen: item.chosen,
          point: item,
          distance: distance
        };
        var box = labelBox(label);
        var inside =
          box.x >= bounds.left && box.x + box.width <= bounds.right && box.y - box.height >= bounds.top && box.y <= bounds.bottom;
        if (!fallback && inside) {
          fallback = { label: label, box: box };
        }
        if (
          inside &&
          !boxes.some(function (other) {
            return overlaps(box, other);
          })
        ) {
          boxes.push(box);
          return label;
        }
      }
    }
    boxes.push(fallback.box);
    return fallback.label;
  });
}

function leader(label) {
  if (label.distance <= 10) {
    return "";
  }
  var box = labelBox(label);
  var tx = Math.max(box.x, Math.min(label.point.x, box.x + box.width));
  var ty = Math.max(box.y - box.height, Math.min(label.point.y, box.y));
  var dx = tx - label.point.x;
  var dy = ty - label.point.y;
  var length = Math.sqrt(dx * dx + dy * dy) || 1;
  return (
    '<line class="map-leader" x1="' + round(label.point.x + (dx / length) * 7) + '" y1="' + round(label.point.y + (dy / length) * 7) +
    '" x2="' + round(tx - (dx / length) * 2) + '" y2="' + round(ty - (dy / length) * 2) + '"/>'
  );
}

function pointLabelSvg(labels) {
  return labels
    .map(function (label) {
      return leader(label) + svgText(label, label.chosen ? "map-label map-label-chosen" : "map-label");
    })
    .join("");
}

function svgText(label, className) {
  return (
    '<text class="' + className + '" x="' + round(label.x) + '" y="' + round(label.y) + '" text-anchor="' +
    (label.anchor || "start") + '">' + escapeHtml(label.text) + "</text>"
  );
}

function point(x, y, chosen) {
  return '<circle class="' + (chosen ? "map-point map-point-chosen" : "map-point map-point-other") + '" cx="' +
    round(x) + '" cy="' + round(y) + '" r="6"/>';
}

function figure(id, svg, caption) {
  return [
    '<figure class="map-figure" id="' + id + '">',
    '  <div class="map-scroll">',
    "    " + svg,
    "  </div>",
    "  <figcaption>" + caption + "</figcaption>",
    "</figure>"
  ];
}

function legend() {
  return (
    '<p class="map-legend"><span class="map-key map-key-chosen" aria-hidden="true"></span> no questionário ' +
    '<span class="map-key map-key-other" aria-hidden="true"></span> fora do questionário</p>'
  );
}

function biplot(list) {
  var analysis = principalComponents(list);
  var width = 760;
  var height = 580;
  var cx = width / 2;
  var cy = height / 2;
  var radius = 235;
  var maxScore = Math.max.apply(
    null,
    analysis.scores.map(function (score) {
      return Math.sqrt(score[0] * score[0] + score[1] * score[1]);
    })
  );
  var pointScale = (radius * 0.85) / maxScore;
  var arrows = AXIS_IDS.map(function (axisId, index) {
    return [analysis.components[0].loadings[index], analysis.components[1].loadings[index]];
  });
  var maxArrow = Math.max.apply(
    null,
    arrows.map(function (arrow) {
      return Math.sqrt(arrow[0] * arrow[0] + arrow[1] * arrow[1]);
    })
  );
  var arrowScale = radius / maxArrow;
  var parts = [];
  var axisLabels = [];

  parts.push('<line class="map-grid" x1="' + (cx - radius) + '" y1="' + cy + '" x2="' + (cx + radius) + '" y2="' + cy + '"/>');
  parts.push('<line class="map-grid" x1="' + cx + '" y1="' + (cy - radius) + '" x2="' + cx + '" y2="' + (cy + radius) + '"/>');

  axes.forEach(function (axis, index) {
    var dx = arrows[index][0] * arrowScale;
    var dy = -arrows[index][1] * arrowScale;
    parts.push(
      '<line class="map-arrow" x1="' + round(cx - dx) + '" y1="' + round(cy - dy) + '" x2="' + round(cx + dx) + '" y2="' + round(cy + dy) + '"/>'
    );
    [
      { sign: 1, text: axis.positive.label },
      { sign: -1, text: axis.negative.label }
    ].forEach(function (end) {
      var length = Math.sqrt(dx * dx + dy * dy) || 1;
      var ux = (end.sign * dx) / length;
      var uy = (end.sign * dy) / length;
      if (length < radius - 4) {
        parts.push(
          '<line class="map-grid" x1="' + round(cx + ux * length) + '" y1="' + round(cy + uy * length) + '" x2="' +
            round(cx + ux * radius) + '" y2="' + round(cy + uy * radius) + '"/>'
        );
      }
      axisLabels.push({
        x: cx + ux * (radius + 6),
        y: cy + uy * (radius + 6) + (uy > 0.3 ? 10 : uy < -0.3 ? -2 : 4),
        text: end.text,
        size: 11,
        anchor: ux > 0.3 ? "start" : ux < -0.3 ? "end" : "middle"
      });
    });
  });

  placeLabels(axisLabels);
  axisLabels.forEach(function (label) {
    parts.push(svgText(label, "map-axis-label"));
  });

  var points = list.map(function (group, index) {
    return {
      x: cx + analysis.scores[index][0] * pointScale,
      y: cy - analysis.scores[index][1] * pointScale,
      text: group.label,
      chosen: group.chosen
    };
  });
  var labels = placeAround(points, axisLabels.map(labelBox), { left: 0, right: width, top: 0, bottom: height });
  points.forEach(function (item) {
    parts.push(point(item.x, item.y, item.chosen));
  });
  parts.push(pointLabelSvg(labels));

  var first = Math.round(analysis.components[0].share * 100);
  var second = Math.round(analysis.components[1].share * 100);
  var svg =
    '<svg viewBox="0 0 ' + width + " " + height + '" role="img" aria-label="Mapa de semelhança dos dez grupos, com as direções dos nove eixos">' +
    parts.join("") + "</svg>";
  return {
    lines: figure(
      "figura-mapa",
      svg,
      legend() +
        "Cada grupo é um ponto; grupos com posições parecidas nos nove eixos ficam perto. Cada linha cinza é um eixo, com seus dois polos nas pontas: quanto mais longo o traço contínuo, melhor o plano representa aquele eixo, e o pontilhado só leva ao nome do polo. O plano mostra " +
        (first + second) + "% das diferenças entre os grupos (" + first + "% na horizontal e " + second + "% na vertical)."
    ),
    share: first + second
  };
}

function plane(list) {
  var horizontal = ["direction", "publicity"];
  var vertical = ["judgment", "order", "scope"];
  function mean(group, ids) {
    return ids.reduce(function (sum, axisId) {
      return sum + group.vector[axisId];
    }, 0) / ids.length;
  }
  var width = 720;
  var height = 560;
  var left = 150;
  var right = 570;
  var top = 70;
  var bottom = 490;
  var pad = 24;
  function px(value) {
    return left + pad + ((value + 2) / 4) * (right - left - 2 * pad);
  }
  function py(value) {
    return bottom - pad - ((value + 2) / 4) * (bottom - top - 2 * pad);
  }
  var parts = [];
  parts.push('<rect class="map-frame" x="' + left + '" y="' + top + '" width="' + (right - left) + '" height="' + (bottom - top) + '"/>');
  parts.push('<line class="map-grid" x1="' + px(0) + '" y1="' + top + '" x2="' + px(0) + '" y2="' + bottom + '"/>');
  parts.push('<line class="map-grid" x1="' + left + '" y1="' + py(0) + '" x2="' + right + '" y2="' + py(0) + '"/>');
  parts.push(svgText({ x: left - 8, y: py(0) - 6, text: "De cima e", anchor: "end" }, "map-axis-label"));
  parts.push(svgText({ x: left - 8, y: py(0) + 8, text: "com discrição", anchor: "end" }, "map-axis-label"));
  parts.push(svgText({ x: right + 8, y: py(0) - 6, text: "De baixo e", anchor: "start" }, "map-axis-label"));
  parts.push(svgText({ x: right + 8, y: py(0) + 8, text: "em público", anchor: "start" }, "map-axis-label"));
  parts.push(svgText({ x: px(0), y: top - 26, text: "Experiência, ajuste espontâneo", anchor: "middle" }, "map-axis-label"));
  parts.push(svgText({ x: px(0), y: top - 12, text: "e regra local", anchor: "middle" }, "map-axis-label"));
  parts.push(svgText({ x: px(0), y: bottom + 20, text: "Princípio, plano deliberado", anchor: "middle" }, "map-axis-label"));
  parts.push(svgText({ x: px(0), y: bottom + 34, text: "e regra universal", anchor: "middle" }, "map-axis-label"));

  var points = list.map(function (group) {
    return { x: px(mean(group, horizontal)), y: py(mean(group, vertical)), text: group.label, chosen: group.chosen };
  });
  points.forEach(function (item) {
    parts.push(point(item.x, item.y, item.chosen));
  });
  parts.push(pointLabelSvg(placeAround(points, [], { left: left + 2, right: right - 2, top: top + 2, bottom: bottom - 2 })));

  var svg =
    '<svg viewBox="0 0 ' + width + " " + height + '" role="img" aria-label="Plano quem decide e como se decide com os dez grupos">' +
    parts.join("") + "</svg>";
  return figure(
    "figura-plano",
    svg,
    legend() +
      "Horizontal: média da Direção da mudança e do Papel da publicidade. Vertical: média da Fonte do juízo, da Origem da boa ordem e do Alcance das regras. Os outros quatro eixos não entram neste plano."
  );
}

function dendrogram(list) {
  var tree = clusterTree(list);
  var order = leafOrder(tree);
  var width = 760;
  var rowHeight = 40;
  var top = 30;
  var labelWidth = 180;
  var left = labelWidth + 20;
  var right = 730;
  var heights = [];
  (function collect(node) {
    if (node.children) {
      heights.push(node.height);
      node.children.forEach(collect);
    }
  })(tree);
  var minimum = Math.floor(Math.min.apply(null, heights) / 10) * 10;
  var bottom = top + (order.length - 1) * rowHeight;
  var height = bottom + 60;
  function px(value) {
    return left + ((100 - value) / (100 - minimum)) * (right - left);
  }
  var parts = [];
  for (var tick = 100; tick >= minimum; tick -= 10) {
    parts.push('<line class="map-grid" x1="' + round(px(tick)) + '" y1="' + (top - 12) + '" x2="' + round(px(tick)) + '" y2="' + (bottom + 12) + '"/>');
    parts.push(svgText({ x: px(tick), y: bottom + 30, text: String(tick), anchor: "middle" }, "map-axis-label"));
  }
  parts.push(svgText({ x: (left + right) / 2, y: bottom + 50, text: "afinidade em que os grupos se juntam (0 a 100)", anchor: "middle" }, "map-axis-label"));

  var leaves = [];
  function draw(node) {
    if (!node.children) {
      var y = top + order.indexOf(node.leaf) * rowHeight;
      var group = list[node.leaf];
      leaves.push(point(left, y, group.chosen));
      leaves.push(svgText({ x: left - 14, y: y + 4, text: group.label, anchor: "end" }, group.chosen ? "map-label map-label-chosen" : "map-label"));
      return { x: left, y: y };
    }
    var a = draw(node.children[0]);
    var b = draw(node.children[1]);
    var x = px(node.height);
    parts.push(
      '<path class="map-tree" d="M' + round(a.x) + " " + round(a.y) + "H" + round(x) + "V" + round(b.y) + "H" + round(b.x) + '"/>'
    );
    return { x: x, y: (a.y + b.y) / 2 };
  }
  var rootPoint = draw(tree);
  parts.push('<path class="map-tree" d="M' + round(rootPoint.x) + " " + round(rootPoint.y) + "H" + round(Math.min(right, rootPoint.x + 16)) + '"/>');
  parts = parts.concat(leaves);

  var svg =
    '<svg viewBox="0 0 ' + width + " " + height + '" role="img" aria-label="Árvore de semelhança dos dez grupos">' +
    parts.join("") + "</svg>";
  return {
    lines: figure(
      "figura-arvore",
      svg,
      legend() +
        "Os grupos mais parecidos se juntam primeiro, à esquerda. A posição de cada junção é a afinidade média entre os membros dos dois ramos, medida com o mesmo índice de 0 a 100 do resultado do questionário."
    ),
    order: order
  };
}

function signed(value) {
  return value > 0 ? "+" + value : value < 0 ? "−" + Math.abs(value) : "0";
}

function heatmap(list, order) {
  var header = axes.map(function (axis) {
    return (
      '<th scope="col"><span class="heat-axis">' + escapeHtml(axis.name) + '</span><span class="heat-poles"><span>−&nbsp;' +
      escapeHtml(axis.negative.label) + "</span><span>+&nbsp;" + escapeHtml(axis.positive.label) + "</span></span></th>"
    );
  });
  var rows = order.map(function (index) {
    var group = list[index];
    var cells = group.values.map(function (value) {
      var tone = value === 0 ? "heat-zero" : (value < 0 ? "heat-neg-" : "heat-pos-") + Math.abs(value);
      return '<td class="' + tone + '">' + signed(value) + "</td>";
    });
    return (
      '<tr class="' + (group.chosen ? "heat-chosen" : "heat-other") + '"><th scope="row">' + escapeHtml(group.label) +
      (group.chosen ? "" : ' <span class="heat-note">fora</span>') + "</th>" + cells.join("") + "</tr>"
    );
  });
  return [
    '<figure class="map-figure" id="figura-calor">',
    '  <div class="map-scroll">',
    '    <table class="heat-table">',
    "      <caption class=\"sr-only\">Posição dos dez grupos nos nove eixos, de −2 a +2</caption>",
    '      <thead><tr><th scope="col">Grupo</th>' + header.join("") + "</tr></thead>",
    "      <tbody>"
  ]
    .concat(
      rows.map(function (row) {
        return "        " + row;
      })
    )
    .concat([
      "      </tbody>",
      "    </table>",
      "  </div>",
      "  <figcaption>Valores de −2 a +2. As cores mostram para que polo cada grupo pende: uma cor para o polo negativo, outra para o positivo, mais forte na ponta. Os grupos estão na ordem da árvore de semelhança, e os marcados com “fora” não fazem parte do questionário.</figcaption>",
      "</figure>"
    ]);
}

function similarityTable(list) {
  var chosen = list.filter(function (group) {
    return group.chosen;
  });
  var header = chosen.map(function (group) {
    return '<th scope="col">' + escapeHtml(group.label) + "</th>";
  });
  var rows = list
    .filter(function (group) {
      return !group.chosen;
    })
    .map(function (group) {
      var values = chosen.map(function (other) {
        return Math.round(affinity(group.values, other.values));
      });
      var best = Math.max.apply(null, values);
      return (
        '<tr><th scope="row">' + escapeHtml(group.label) + "</th>" +
        values
          .map(function (value) {
            return value === best ? '<td class="sim-best">' + value + "</td>" : "<td>" + value + "</td>";
          })
          .join("") +
        "</tr>"
      );
    });
  return [
    '<figure class="map-figure" id="figura-semelhanca">',
    '  <div class="map-scroll">',
    '    <table class="sim-table">',
    '      <caption class="sr-only">Afinidade de cada grupo fora do questionário com os cinco perfis</caption>',
    '      <thead><tr><th scope="col">Grupo fora</th>' + header.join("") + "</tr></thead>",
    "      <tbody>"
  ]
    .concat(
      rows.map(function (row) {
        return "        " + row;
      })
    )
    .concat([
      "      </tbody>",
      "    </table>",
      "  </div>",
      "  <figcaption>Índice de afinidade de 0 a 100, o mesmo do resultado do questionário, calculado entre as posições dos grupos. Em destaque, o perfil mais próximo de cada grupo.</figcaption>",
      "</figure>"
    ]);
}

function figures() {
  var list = groups();
  var tree = dendrogram(list);
  var map = biplot(list);
  return {
    biplot: map.lines,
    share: map.share,
    calor: heatmap(list, tree.order),
    plano: plane(list),
    arvore: tree.lines,
    semelhanca: similarityTable(list)
  };
}

module.exports = {
  groups: groups,
  affinity: affinity,
  principalComponents: principalComponents,
  clusterTree: clusterTree,
  leafOrder: leafOrder,
  figures: figures
};
