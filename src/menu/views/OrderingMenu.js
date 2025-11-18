import MenuBuilder from "../menubuilder";
const dom = require("dom-helper");

const OrderingMenu = MenuBuilder.extend({

  initialize: function (data) {
    this.g = data.g;
    this.order = 0;
    return;
  },

  setOrder: function (order) {
    this.order = order;
    return this.render();
  },

  // TODO: make more generic
  render: function () {
    this.setName("Sorting");
    this.removeAllNodes();

    var comps = this.getComparators();
    for (var i = 0, m; i < comps.length; i++) {
      m = comps[i];
      if (i % 2 == 0 && i !== 0 && i !== comps.length) {
        this.addDivider();

      }
      this._addNode(m);
    }

    var el = this.buildDOM();

    // TODO: make more efficient
    dom.removeAllChilds(this.el);
    this.el.appendChild(el);
    return this;
  },

  _addNode(m) {
    var { text, prefix, order } = m;

    var style = {};
    if (order === this.order) {
      style.backgroundColor = "#5FA2DD";
      style.color = "#FFFFFF";
    }
    return this.addNode({
      label: text,
      callback: (() => {
        if ((m.precode != null)) { m.precode(); }
        this.model.comparator = m.comparator;
        this.model.sort();
        return this.setOrder(order);
      }),
      style: style,
      prefix: prefix,
    });
  },

  getComparators: function () {
    var models = [];

    models.push({
      text: "ID",
      order: 0,
      comparator: "id",
      prefix: {
        className: "fal fa-arrow-up",
      },
    });

    models.push({
      text: "ID",
      order: 1,
      comparator: function (a, b) {
        return - ("" + a.get("id")).localeCompare("" + b.get("id"), [], { numeric: true });
      },
      prefix: {
        className: "fal fa-arrow-down",
      },
    });


    models.push({
      text: "Label",
      order: 2,
      comparator: "name",
      prefix: {
        className: "fal fa-arrow-up",
      },
    });

    models.push({
      text: "Label",
      order: 3,
      comparator: function (a, b) {
        return - a.get("name").localeCompare(b.get("name"));
      },
      prefix: {
        className: "fal fa-arrow-down",
      },
    });

    models.push({
      text: "Seq",
      order: 4,
      comparator: "seq",
      prefix: {
        className: "fal fa-arrow-up",
      },
    });

    models.push({
      text: "Seq",
      order: 5,
      comparator: function (a, b) {
        return - a.get("seq").localeCompare(b.get("seq"));
      },
      prefix: {
        className: "fal fa-arrow-down",
      },
    });

    var setIdent = () => {
      return this.ident = this.g.stats.identity();
    };

    var setGaps = () => {
      this.gaps = {};
      return this.model.each((el) => {
        var seq = el.attributes.seq;
        return this.gaps[el.id] = (seq.reduce(function (memo, c) { return c === '-' ? ++memo : undefined; }), 0) / seq.length;
      });
    };

    models.push({
      text: "Identity",
      order: 6,
      comparator: ((a, b) => {
        var val = this.ident[a.id] - this.ident[b.id];
        if (val > 0) { return 1; }
        if (val < 0) { return -1; }
        return 0;
      }
      ), precode: setIdent,
      prefix: {
        className: "fal fa-arrow-up",
      },
    });

    models.push({
      text: "Identity",
      order: 7,
      comparator: ((a, b) => {
        var val = this.ident[a.id] - this.ident[b.id];
        if (val > 0) { return -1; }
        if (val < 0) { return 1; }
        return 0;
      }
      ),
      prefix: {
        className: "fal fa-arrow-down",
      },
    });

    models.push({
      text: "Matches",
      order: 8,
      comparator: function (a, b) {
        return - ("" + a.get("matchCount")).localeCompare("" + b.get("matchCount"), [], { numeric: true });
      },
      prefix: {
        className: "fal fa-arrow-up",
      },
    });

    models.push({
      text: "Matches",
      order: 9,
      comparator: 'matchCount',
      prefix: {
        className: "fal fa-arrow-down",
      },
    });



    models.push({
      prefix: {},
      text: "Consensus to top",
      order: 10,
      comparator(seq) {
        return !seq.get("ref");
      }
    });

    return models;
  }
});
export default OrderingMenu;
