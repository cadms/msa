import MenuBuilder from "../menubuilder";

const SelectionMenu = MenuBuilder.extend({

  initialize(data) {
    this.g = data.g;
    return this.el.style.display = "inline-block";
  },

  render() {
    this.setName("Selection");

    this.addNode("Edit", () => {
      const t = this
      const selcol = t.g.selcol
      const firstSel = selcol.models[0]
      const row = firstSel.get('seqId')
      const col = firstSel.get('xStart')
      const seq = t.g.stats.seqs[row]
      const char = seq.substr(col, 1)
      const type = firstSel.get('type')

      if (type === 'pos') {
        Ext.GlobalEvents.fireEvent('msa_edit', char, row, col)
      } else {
        Ext.GlobalEvents.fireEvent('msa_edit', seq, row)
      }
    });

    this.addNode("Rename", () => {
      const t = this
      const selcol = t.g.selcol
      const firstSel = selcol.models[0]
      const row = firstSel.get('seqId')
      const seqLabel = t.g.stats.mseqs.at(row).get('name')

      Ext.Msg.show({
        title: 'Rename Label',
        prompt: true,
        value: seqLabel,
        buttons: Ext.Msg.OKCANCEL,
        scope: this,
        fn: function(btnText, val) {
          t.g.stats.mseqs.at(row).set('name', val)
        }
      });

      // return t.g.stats.mseqs.at(row).set('name', 'xyz')
      // debugger
    });

    // this.addNode("Invert columns", () => {
    //   return this.g.selcol.invertCol(((() => {
    //     const result = [];
    //     const end = this.model.getMaxLength();
    //     let i = 0;
    //     if (0 <= end) {
    //       while (i <= end) {
    //         result.push(i++);
    //       }
    //     } else {
    //       while (i >= end) {
    //         result.push(i--);
    //       }
    //     }
    //     return result;
    //   })()));
    // });
    // this.addNode("Invert rows", () => {
    //   return this.g.selcol.invertRow(this.model.pluck("id"));
    // });
    this.addNode("Reset", () => {
      const t = this
      const selcol = t.g.selcol
      const firstSel = selcol.models[0]
      const row = firstSel.get('seqId')
      const oldSeq = t.g.stats.mseqs.at(row).previous('seq')

      return t.g.stats.mseqs.at(row).set('seq', oldSeq)
    });
    this.el.appendChild(this.buildDOM());
    return this;
  }
});
export default SelectionMenu;
