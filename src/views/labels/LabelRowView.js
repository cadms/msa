const boneView = require("backbone-childs");
import LabelView from "./LabelView";
import MetaView from "./MetaView";

const View = boneView.extend({

  initialize: function (data) {
    this.g = data.g;
    this.draw();

    this.listenTo(this.g.vis, "change:labels", this.drawR);
    this.listenTo(this.g.vis, "change:metacell", this.drawR);
    this.listenTo(this.g.zoomer, "change:rowHeight", function () {
      return this.el.style.height = this.g.zoomer.get("rowHeight") + "px";
    });

    return this.listenTo(this.g.selcol, "change reset add remove", this.setSelection);
  },

  draw: function () {
    this.removeViews();
    if (this.g.vis.get("labels")) {
      this.addView("labels", new LabelView({ model: this.model, g: this.g }));
    }
    if (this.g.vis.get("metacell")) {
      var meta = new MetaView({ model: this.model, g: this.g });
      return this.addView("metacell", meta);
    }
  },

  drawR: function () {
    this.draw();
    return this.render();
  },

  render: function () {
    this.renderSubviews();

    this.el.setAttribute("class", "biojs_msa_labelrow");
    this.el.style.height = this.g.zoomer.get("rowHeight") * (this.model.attributes.height || 1) + "px";

    this.setSelection();
    return this;
  },

  setSelection: function () {
    var sel = this.g.selcol.getSelForRow(this.model.id);
    if (sel.length > 0) {
      this.el.style.fontWeight = "900";
      this.el.style.color = "red";

    } else {
      this.el.style.fontWeight = "normal";
      this.el.style.color = "black";
    }
  }
});
export default View;
