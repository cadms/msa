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
      const seq = t.model.at(row).get('seq')
      const char = seq.substr(col, 1)
      const type = firstSel.get('type')

      if (type === 'pos') {
        Ext.GlobalEvents.fireEvent('msa_edit', char, row, col)
      } else {
        Ext.GlobalEvents.fireEvent('msa_edit', seq, row)
      }
    });

    this.addNode("Edit by seq position", () => {
      const t = this
      const selcol = t.g.selcol
      const firstSel = selcol.models[0]
      const row = firstSel.get('seqId')
      let seq = t.model.at(row).get('seq')
      const selRange = selcol.models.map(m => m.get('xStart'))
      const startCol = Math.min(...selRange)
      const endCol = Math.max(...selRange)
      const oldVal = seq.substring(startCol, endCol + 1) // selected chars

      Ext.Msg.show({
        title: 'Edit',
        prompt: true,
        value: oldVal,
        buttons: Ext.Msg.OKCANCEL,
        scope: this,
        fn: function(btnText, val) {

          // check if the user has clicked on positions that are not in the same seq/row
          function checkSeqId(arr) {
            const uniqueSeqIds = new Set()
            for (const obj of arr) {
              uniqueSeqIds.add(obj.get('seqId'))
            }
            return uniqueSeqIds.size > 1
          }

          if (btnText !== 'ok' || val === '' || val === oldVal) return

          if (val.length > oldVal.length || val.length < oldVal.length) {
            Ext.Msg.alert('Invalid Character Length', 'Please enter a replacement value of the same length.')
            return
          }

          if (checkSeqId(selcol.models)) {
            Ext.Msg.alert('Invalid Selection', 'Please select values that are of the same sequence.')
            return
          }

          seq = `${seq.substring(0, startCol)}${val}${seq.substring(endCol + 1)}`
          t.model.at(row).set('seq', seq)
          
        }
      });

    });

    this.addNode("Remove selected seq", () => {
      const t = this
      const selcol = t.g.selcol
      const firstSel = selcol.models[0]
      const row = firstSel.get('seqId')
      t.model.remove(row)
    });

    this.addNode("Rename", () => {
      const t = this
      const selcol = t.g.selcol
      const firstSel = selcol.models[0]
      const row = firstSel.get('seqId')
      const seqLabel = t.model.at(row).get('name')

      Ext.Msg.show({
        title: 'Rename Label',
        prompt: true,
        value: seqLabel,
        buttons: Ext.Msg.OKCANCEL,
        scope: this,
        fn: function(btnText, val) {
          if (btnText !== 'ok' || val === '' || val === seqLabel) return
          t.model.at(row).set('name', val)
        }
      });
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
      const oldSeq = t.model.at(row).previous('seq')

      return t.model.at(row).set('seq', oldSeq)
    });
    this.el.appendChild(this.buildDOM());
    return this;
  }
});
export default SelectionMenu;
