const boneView = require("backbone-childs");

// menu views
import ImportMenu from "./views/ImportMenu";
import FilterMenu from "./views/FilterMenu";
import SelectionMenu from "./views/SelectionMenu";
import VisMenu from "./views/VisMenu";
import ColorMenu from "./views/ColorMenu";
import VerticalDivider from "./views/VerticalDivider";

import OrderingMenu from "./views/OrderingMenu";
import ExtraMenu from "./views/ExtraMenu";
import ExportMenu from "./views/ExportMenu";
import MenuSettings from "./settings";

// this very basic menu demonstrates calls to the MSA component
const MenuView = boneView.extend({

  initialize: function (data) {
    if (!data.msa) {
      throw new Error("No msa instance provided. Please provide .msa");
    }
    this.msa = data.msa;

    // add menu config to the global object
    this.msa.g.menuconfig = new MenuSettings(data.menu);
    this.addView("10_import", new ImportMenu({ model: this.msa.seqs, g: this.msa.g, msa: this.msa }));
    this.addView("15_divider", new VerticalDivider());
    this.addView("20_ordering", new OrderingMenu({ model: this.msa.seqs, g: this.msa.g }));
    this.addView("25_filter", new FilterMenu({ model: this.msa.seqs, g: this.msa.g }));
    this.addView("30_selection", new SelectionMenu({ model: this.msa.seqs, g: this.msa.g }));
    this.addView("35_divider", new VerticalDivider());
    this.addView("40_vis", new VisMenu({ model: this.msa.seqs, g: this.msa.g }));
    this.addView("45_color", new ColorMenu({ model: this.msa.seqs, g: this.msa.g }));

  },

  render: function () {
    this.renderSubviews();
    // other
    this.el.setAttribute("class", "smenubar");
    return this.el.appendChild(document.createElement("p"));
  }
});
export default MenuView;
