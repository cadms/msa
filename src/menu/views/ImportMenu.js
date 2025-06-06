import MenuBuilder from "../menubuilder";
const k = require("koala-js");

const ImportMenu = MenuBuilder.extend({

  initialize: function (data) {
    this.g = data.g;
    this.el.style.display = "inline-block";
    return this.msa = data.msa;
  },

  render: function () {
    var msa = this.msa;
    var uploader = k.mk("input");
    uploader.type = "file";
    uploader.style.display = "none";
    //uploader.accept
    // http://www.w3schools.com/jsref/prop_fileupload_accept.asp
    // for now we allow multiple files
    uploader.multiple = true;
    uploader.addEventListener("change", () => {
      var files = uploader.files || [];
      return msa.u.file.importFiles(files);
    });

    this.el.appendChild(uploader);

    var filetypes = "Fasta, Clustal, GFF, Jalview features, Newick";

    this.setName("Import");
    this.addNode("URL", (e) => {
      var url = prompt("Import files from URL" + "\nSupported file types: " + filetypes);
      if (url.length > 5) {
        return this.msa.u.file.importURL(url, function () { });
      }
    });
    // mass update on zoomer
    //zoomer = @g.zoomer.toJSON()
    //#zoomer.textVisible = false
    //#zoomer.columnWidth = 4
    //zoomer.boxRectHeight = 2
    //zoomer.boxRectWidth = 2
    //@g.zoomer.set zoomer

    this.addNode("From file " + filetypes, () => {
      return uploader.click();
    });

    this.addNode("Drag & Drop", () => {
      return alert("Yep. Just drag & drop your file " + filetypes);
    });

    this.el.appendChild(this.buildDOM());
    return this;
  }
});
export default ImportMenu;
