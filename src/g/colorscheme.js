var Colorscheme;
var Colors = require("msa-colorschemes");

var Model = require("backbone-thin").Model;

// this is an example of how one could color the MSA
// feel free to create your own color scheme in the /css/schemes folder
module.exports = Colorscheme = Model.extend({

  defaults: {
    scheme: "mismatch", // name of your color scheme
    colorBackground: true, // otherwise only the text will be colored
    showLowerCase: true, // used to hide and show lowercase chars in the overviewbox
    opacity: 0.6, // opacity for the residues
  },

  initialize: function(data,seqs, stat) {
    this.colors = new Colors(
      {seqs: seqs,
      conservation: function() {
        return stat.scale(stat.conservation());
      }}
    );
    // the stats module sends an event every time it is refreshed
    return stat.on( "reset", (function() {
      // some dynamic modules might require a redraw
      if (this.getSelectedScheme().type === "dyn") {
        var ref;
        // this line causes an error when using a dynamic seq and may need to be revisited
        // this.getSelectedScheme().indexOf is not an array
        // used .opt.seqs in the interim 
        if (ref = "reset", this.getSelectedScheme().opt.seqs.indexOf(ref) >= 0) {
          return this.getSelectedScheme().reset();
        }
      }
    }
    ),this);
  },

  // You can enter your own color scheme here
  addStaticScheme: function(name, dict) {
    return this.colors.addStaticScheme(name,dict);
  },

  addDynScheme: function(name, fun) {
    return this.colors.addDynScheme(name,fun);
  },

  getScheme: function(name) {
    return this.colors.getScheme(name);
  },

  getSelectedScheme: function() {
    return this.colors.getScheme(this.get("scheme"));
  }
});
