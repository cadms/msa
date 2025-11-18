const view = require("backbone-viewj");
const dom = require("dom-helper");
import { seqs as st } from "bio.io";
import MenuBuilder from "../../menu/menubuilder";
import { reduce } from "lodash";

const MetaView = view.extend({

  className: "biojs_msa_metaview",

  initialize: function (data) {
    this.g = data.g;
    this.listenTo(this.g.vis, "change:metacell", this.render);
    return this.listenTo(this.g.zoomer, "change:metaWidth", this.render);
  },

  events:
  {
    click: "_onclick",
    mousein: "_onmousein",
    mouseout: "_onmouseout"
  },

  render: function () {
    dom.removeAllChilds(this.el);

    this.el.style.display = "flex";
    this.el.style.alignItems = "center";

    this.el.style.fontSize = `${this.g.zoomer.get('labelFontsize') - 2}px`;

    if (this.g.vis.get("metaGaps")) {
      var seq = this.model.get('seq');
      var gaps = [...seq].reduce((memo, c) => c === '-' ? ++memo : memo, 0);
      gaps = (gaps * 100 / seq.length).toFixed(0) + "%";

      // append gap count
      var gapSpan = document.createElement('div');
      gapSpan.className = 'comparison';
      gapSpan.textContent = gaps;
      this.el.appendChild(gapSpan);
    }


    if (this.g.vis.get("metaIdentity")) {
      // identity
      // TODO: there must be a better way to pass the id
      var ident = this.g.stats.identity()[this.model.id];
      var identSpan = document.createElement('div');
      identSpan.className = 'comparison';

      if (this.model.get("ref") && this.g.config.get("hasRef")) {
        identSpan.textContent = "ref.";
      } else if ((typeof ident !== "undefined" && ident !== null)) {
        identSpan.textContent = ident.toFixed(2);
      }
      this.el.appendChild(identSpan);
    }


  },


  _onclick: function (evt) {
    return this.g.trigger("meta:click", { seqId: this.model.get("id", { evt: evt }) });
  },

  _onmousein: function (evt) {
    return this.g.trigger("meta:mousein", { seqId: this.model.get("id", { evt: evt }) });
  },

  _onmouseout: function (evt) {
    return this.g.trigger("meta:mouseout", { seqId: this.model.get("id", { evt: evt }) });
  }
});

export default MetaView;
