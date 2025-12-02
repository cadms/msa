const boneView = require("backbone-childs");
import SeqBlock from "./canvas/NewSeqBlock";
import RightLabelHeader from "./header/RightHeaderBlock"
const View = boneView.extend({

  initialize: function (data) {
    this.g = data.g;

    if (true) {
      var rHeader = new RightLabelHeader({ model: this.model, g: this.g });
      rHeader.ordering = -1;
      this.addView("rHeader", rHeader);
    }

    if (this.g.vis.get("sequences")) {

      const seqblock = new SeqBlock({
        model: this.model,
        g: this.g,
        el: document.createElement("div"),
      });


      this.addView("seqblock", seqblock);
    }

    this.listenTo(this.g.zoomer, "change:alignmentHeight", this.adjustHeight);
    this.listenTo(this.g.zoomer, "change:alignmentWidth", this.adjustWidth);
    this.listenTo(this.g.columns, "change:hidden", this.adjustHeight);
    return this;
  },

  render: function () {
    this.renderSubviews();
    this.el.className = "biojs_msa_albody";
    this.el.style.whiteSpace = "nowrap";
    this.el.style.display = "flex";
    this.el.style.flexDirection = "column";
    this.el.style.height = 'fit-content'
    this.el.style.overflowX = 'scroll';
    this.adjustHeight();
    this.adjustWidth();
    return this;
  },

  adjustHeight: function () {
    if (this.g.zoomer.get("alignmentHeight") === "auto") {
      // TODO: fix the magic 5
      return this.el.style.height = (this.g.zoomer.get("rowHeight") * this.model.length) + 5;
    } else {
      return this.el.style.height = this.g.zoomer.get("alignmentHeight");
    }
  },

  adjustWidth: function () {
    // TODO: 15 is the width of the scrollbar
    return this.el.style.width = this.getWidth();
  },

  getWidth: function () {
    var width = 0;
    width += this.g.zoomer.getLeftBlockWidth();
    if (this.g.vis.get("sequences")) {
      width += this.g.zoomer.get("alignmentWidth");
    }
    return width;
  }
});
export default View;
