const boneView = require("backbone-childs");
import LabelHeader from "./LabelHeader";
// import RightLabelHeader from "./RightHeaderBlock";
import LabelBlock from "../labels/LabelBlock";

const View = boneView.extend({

  initialize: function (data) {
    this.g = data.g;
    this.draw();
    return this.listenTo(this.g.vis, "change:labels change:metacell change:leftHeader", () => {
      this.draw();
      return this.render();
    });
  },

  draw: function () {
    this.removeViews();

    if (this.g.vis.get("leftHeader") && (this.g.vis.get("labels") || this.g.vis.get("metacell"))) {
      var lHeader = new LabelHeader({ model: this.model, g: this.g });
      lHeader.ordering = -50;
      this.addView("lHeader", lHeader);
    }

    var labelBlock = new LabelBlock({ model: this.model, g: this.g });

    labelBlock.ordering = 0;
    return this.addView("labelblock", labelBlock);
  },

  render: function () {
    this.renderSubviews();

    return this.el.className = "table_header_wrapper";
  }
});
export default View;
