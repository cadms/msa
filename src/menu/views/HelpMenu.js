import MenuBuilder from "../menubuilder";

const HelpMenu = MenuBuilder.extend({

  initialize: function (data) {
    return this.g = data.g;
  },

  render: function () {
    this.setName("Help");
    this.addNode({
      label: "About the project",
      callback: () => {
        return window.open("https://github.com/wilzbach/msa");
      }
    });
    this.addNode({
      label: "Report issues",
      callback: () => {
        return window.open("https://github.com/wilzbach/msa/issues");
      }
    });
    this.addNode({
      label: "User manual",
      callback: () => {
        return window.open("https://github.com/wilzbach/msa/wiki/User-manual");
      }
    });
    this.el.style.display = "inline-block";
    this.el.appendChild(this.buildDOM());
    return this;
  }
});
export default HelpMenu;
