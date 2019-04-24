import {AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';

import {jqxGridComponent} from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxgrid';
import {jqxListBoxComponent} from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxlistbox';

import {SourceForJqxGrid} from '../../interfaces';


@Component({
  selector: 'app-jqxgrid',
  templateUrl: './jqxgrid.component.html',
  styleUrls: ['./jqxgrid.component.css']
})
export class JqxgridComponent implements OnInit, OnDestroy, AfterViewInit {

  // variables from master component
  @Input() sourceForJqxGrid: SourceForJqxGrid;

  // determine the functions that need to be performed in the parent component
  @Output() onRefreshChildGrid = new EventEmitter<any>();
  @Output() onGetSourceForJqxGrid = new EventEmitter();

  // define variables - link to view objects
  @ViewChild('myListBox') myListBox: jqxListBoxComponent;
  @ViewChild('myGrid') myGrid: jqxGridComponent;

  // other variables
  selectRow: any;
  islistBoxVisible = false;

  // define the data source for the table
  source_jqxgrid: any;
  dataAdapter_jqxgrid: any;

  constructor() {
  }

  ngOnInit() {
    this.onGetSourceForJqxGrid.emit();

    // define the data source for the table
    this.source_jqxgrid =
      {
        datatype: 'array',
        localdata: this.sourceForJqxGrid.grid.source,
        id: this.sourceForJqxGrid.grid.valueMember,

        sortcolumn: this.sourceForJqxGrid.grid.sortcolumn,
        sortdirection: this.sourceForJqxGrid.grid.sortdirection
      };
    this.dataAdapter_jqxgrid = new jqx.dataAdapter(this.source_jqxgrid);

    this.refresh_jqxgGrid();
  }

  ngAfterViewInit() {
    // this.refreshListBox();
  }

  ngOnDestroy() {
    this.destroyGrid();
  }

  destroyGrid() {
    if (this.myListBox) {
      this.myListBox.destroy();
    }
    if (this.myGrid) {
      this.myGrid.destroy();
    }
  }

  // define width of table
  getWidth(): any {
    if (document.body.offsetWidth > 1600) {
      if (this.islistBoxVisible) {
        return '85%';
      } else {
        return '99.8%';
      }
    } else if (document.body.offsetWidth > 1400) {
      if (this.islistBoxVisible) {
        return '85%';
      } else {
        return '99.8%';
      }
    } else if (document.body.offsetWidth > 1200) {
      if (this.islistBoxVisible) {
        return '80%';
      } else {
        return '99.8%';
      }
    } else if (document.body.offsetWidth > 1000) {
      if (this.islistBoxVisible) {
        return '75%';
      } else {
        return '99.8%';
      }
    } else if (document.body.offsetWidth > 800) {
      if (this.islistBoxVisible) {
        return '70%';
      } else {
        return '99.8%';
      }
    } else if (document.body.offsetWidth > 600) {
      if (this.islistBoxVisible) {
        return '65%';
      } else {
        return '99.8%';
      }
    } else {
      if (this.islistBoxVisible) {
        return '40%';
      } else {
        return '99.8%';
      }
    }
  }

  // refresh table
  refresh_jqxgGrid() {
    this.source_jqxgrid.localdata = this.sourceForJqxGrid.grid.source;
    // this.myGrid.refresh();
    // this.myGrid.refreshdata();
    // this.myGrid.updatebounddata('cells');
    this.myGrid.updatebounddata('data');
  }

  refresh_del(ids: any[]) {
    this.myGrid.deleterow(ids);
    this.selectRow = undefined;
  }

  refresh_ins(id: any, row: any) {
    this.myGrid.addrow(id, row);
  }

  refresh_upd(id: any, row: any) {
    this.myGrid.updaterow(id, row);
  }

  onRowSelect(event: any) {
    if (event.args.row) {
      this.selectRow = event.args.row;

      // refresh child grid
      if (this.sourceForJqxGrid.grid.isMasterGrid) {
        this.onRefreshChildGrid.emit(this.selectRow);
      }
    }
  }

  // table field filtering
  myListBoxOnCheckChange(event: any) {

    let listboxSource: any;
    for (let i = 0; i < this.sourceForJqxGrid.listbox.source.length; i++) {
      if (this.sourceForJqxGrid.listbox.source[i].value === event.args.value) {
        listboxSource = this.sourceForJqxGrid.listbox.source[i];
        break;
      }
    }

    this.myGrid.beginupdate();
    if (event.args.checked) {
      this.myGrid.showcolumn(event.args.value);
      listboxSource.checked = true;
    } else {
      this.myGrid.hidecolumn(event.args.value);
      listboxSource.checked = false;
    }
    this.myGrid.endupdate();
  }

  // refreshListBox() {
  //   this.myGrid.beginupdate();
  //   for (let i = 0; i < this.myListBox.attrSource.length; i++) {
  //     if (this.myListBox.attrSource[i].checked) {
  //       try {
  //         this.myGrid.showcolumn(this.myListBox.attrSource[i].value);
  //       } catch (e) {
  //         console.log('refreshListBox');
  //       }
  //     } else {
  //       this.myGrid.hidecolumn(this.myListBox.attrSource[i].value);
  //     }
  //   }
  //   this.myGrid.endupdate();
  // }

}
