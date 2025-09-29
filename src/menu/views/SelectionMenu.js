import MenuBuilder from "../menubuilder";
const SelectionMenu = MenuBuilder.extend({

  initialize(data) {
    this.g = data.g;
    this.removed_arr = []
    return this.el.style.display = "inline-block";
  },

  render() {
    this.setName("Selection");

    this.addNode({
      label: "Edit",
      callback: () => {
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
      }
    });

    this.addNode({
      label: "Edit by seq position",
      callback: () => {
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
          fn: function (btnText, val) {

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

      }
    });

    this.addNode({
      label: "Rename",
      callback: () => {
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
          fn: function (btnText, val) {
            if (btnText !== 'ok' || val === '' || val === seqLabel) return
            t.model.at(row).set('name', val)
          }
        });
      }
    });

    this.addDivider();

    this.addNode({
      label: 'Strict Comparison',
      callback: () => {
        this.g.comparisontype = 'strict';
        setTimeout(() => {
          this.g.selcol.renderComparisonColumns();
        }, 50);
        Ext.toast({
          html: `Comparison type changed`,
          title: `Strict Comparison Selected`,
          width: 300,
          align: 'br'
        });
        this._nodes = [];
        this.$el.empty();
        this.render();
      },
      suffix: {
        className: this.g.comparisontype == 'strict' && "fa fa-check"
      },
    });

    this.addNode({
      label: "Loose Comparison",
      callback: () => {
        this.g.comparisontype = 'loose';
        setTimeout(() => {
          this.g.selcol.renderComparisonColumns();
        }, 50);
        Ext.toast({
          html: `Comparison type changed`,
          title: `Loose Comparison Selected`,
          width: 300,
          align: 'br'
        });

        this._nodes = [];
        this.$el.empty();
        this.render();
      },
      suffix: {
        className: this.g.comparisontype == 'loose' && "fa fa-check"
      },
    });

    this.addDivider();

    this.addNode({
      label: "Remove selected seq",
      callback: () => {
        const t = this
        const selcol = t.g.selcol
        const firstSel = selcol.models[0]
        const row = firstSel.get('seqId')
        const removed = t.model.at(row).set('hidden', true)

        this.removed_arr.push(removed)

      }
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
    this.addDivider();

    this.addNode({
      label: "Reset",
      callback: () => {
        const t = this
        const selcol = t.g.selcol
        const firstSel = selcol.models[0]
        const row = firstSel.get('seqId')
        const oldSeq = t.model.at(row).previous('seq')

        t.model.at(row).set('seq', oldSeq)
        this.removed_arr.forEach(el => el.set('hidden', false))
        this.removed_arr = []
      }
    });
    this.el.appendChild(this.buildDOM());
    return this;
  }
});
export default SelectionMenu;
