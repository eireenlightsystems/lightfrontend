// @ts-ignore
import {AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';

import {jqxGridComponent} from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxgrid';
import {jqxListBoxComponent} from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxlistbox';
import {jqxWindowComponent} from 'jqwidgets-scripts/jqwidgets-ng/jqxwindow';

import {SourceForJqxGrid} from '../../interfaces';
import {DateTimeFormat} from '../../classes/DateTimeFormat';
import {isNull, isUndefined} from 'util';


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
  @ViewChild('myListBox', {static: false}) myListBox: jqxListBoxComponent;
  @ViewChild('myGrid', {static: true}) myGrid: jqxGridComponent;
  @ViewChild('settingWindow', {static: false}) settingWindow: jqxWindowComponent;

  // other variables
  selectRow: any;
  // islistBoxVisible = false;
  widthDefined: any;
  heightDefined: any;

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
    // if (this.myListBox) {
    //   this.myListBox.destroy();
    // }
    if (this.myGrid) {
      this.myGrid.destroy();
    }
    if (this.settingWindow) {
      this.settingWindow.destroy();
    }
  }

  // refresh table
  refresh_jqxgGrid() {
    this.source_jqxgrid.localdata = this.sourceForJqxGrid.grid.source;
    // this.myGrid.refresh();
    // this.myGrid.refreshdata();
    // this.myGrid.updatebounddata('cells');
    this.myGrid.updatebounddata('data');

    this.widthDefined = !isNull(this.sourceForJqxGrid.grid.width) ? this.sourceForJqxGrid.grid.width : '100%';
    this.heightDefined = !isNull(this.sourceForJqxGrid.grid.height) ? this.sourceForJqxGrid.grid.height : '100%';
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

  empty_jqxgGrid() {
    this.source_jqxgrid.localdata = [];
    this.myGrid.updatebounddata('data');
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

  openSettinWin() {
    this.settingWindow.open();
  }

  excelBtnOnClick() {
    this.myGrid.exportdata('xls', new DateTimeFormat().toDataPickerString(new Date()));
  }

  xmlBtnOnClick() {
    this.myGrid.exportdata('xml', new DateTimeFormat().toDataPickerString(new Date()));
  }

  csvBtnOnClick() {
    this.myGrid.exportdata('csv', new DateTimeFormat().toDataPickerString(new Date()));
  }

  tsvBtnOnClick() {
    this.myGrid.exportdata('tsv', new DateTimeFormat().toDataPickerString(new Date()));
  }

  htmlBtnOnClick() {
    this.myGrid.exportdata('html', new DateTimeFormat().toDataPickerString(new Date()));
  }

  jsonBtnOnClick() {
    this.myGrid.exportdata('json', new DateTimeFormat().toDataPickerString(new Date()));
  }

  pdfBtnOnClick() {
    this.myGrid.exportdata('pdf', new DateTimeFormat().toDataPickerString(new Date()));
  }

  btnPrint() {
    const gridContent = this.myGrid.exportdata('html');
    const newWindow = window.open('', '', 'width=800, height=500'),
      document = newWindow.document.open(),
      pageContent =
        '<!DOCTYPE html>\n' +
        '<html>\n' +
        '<head>\n' +
        '<meta charset="utf-8" />\n' +
        '<title>jQWidgets Grid</title>\n' +
        '</head>\n' +
        '<body>\n' + gridContent + '\n</body>\n</html>';
    document.write(pageContent);
    document.close();
    newWindow.print();
  }
}
