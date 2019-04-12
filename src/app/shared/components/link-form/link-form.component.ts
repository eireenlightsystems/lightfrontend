import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';

import {jqxWindowComponent} from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxwindow';
import {jqxGridComponent} from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxgrid';

import {ItemsLinkForm, SourceForLinkForm} from '../../../shared/interfaces';

@Component({
  selector: 'app-link-form',
  templateUrl: './link-form.component.html',
  styleUrls: ['./link-form.component.css']
})
export class LinkFormComponent implements OnInit, OnDestroy, AfterViewInit {

  // variables from master component
  @Input() sourceForLinkForm: SourceForLinkForm;

  // determine the functions that need to be performed in the parent component
  @Output() onSaveLinkwinBtn = new EventEmitter<ItemsLinkForm>();
  @Output() onGetSourceForLinkForm = new EventEmitter();

  // define variables - link to view objects
  @ViewChild('linkWindow') linkWindow: jqxWindowComponent;
  @ViewChild('myGrid') myGrid: jqxGridComponent;
  @ViewChild('windowHeader') windowHeader: ElementRef;

  // define the data source for the table
  source_jqxgrid: any;
  dataAdapter_jqxgrid: any;
  itemsLinkForm: ItemsLinkForm = new ItemsLinkForm();


  constructor() {
  }

  ngOnInit() {
    this.source_jqxgrid =
      {
        datatype: 'array',
        localdata: this.sourceForLinkForm.grid.source,
        id: this.sourceForLinkForm.grid.valueMember,
        sortcolumn: this.sourceForLinkForm.grid.sortcolumn,
        sortdirection: this.sourceForLinkForm.grid.sortdirection
      };
    this.dataAdapter_jqxgrid = new jqx.dataAdapter(this.source_jqxgrid);
    this.myGrid.selectedrowindexes([]);
    this.windowHeader.nativeElement.value = this.sourceForLinkForm.window.name;
  }

  ngAfterViewInit() {

  }

  ngOnDestroy(): void {
    if (this.linkWindow) {
      this.linkWindow.destroy();
    }
    if (this.myGrid) {
      this.myGrid.destroy();
    }
  }

  // refresh table
  refreshGrid() {
    this.source_jqxgrid.localdata = this.sourceForLinkForm.grid.source;
    this.myGrid.selectedrowindexes([]);
    this.myGrid.updatebounddata('data');

    this.linkWindow.open();
  }

  getAll() {
    this.onGetSourceForLinkForm.emit();
  }

  saveBtn() {
    const Ids = [];
    for (let i = 0; i < this.myGrid.widgetObject.selectedrowindexes.length; i++) {
      Ids[i] = this.source_jqxgrid.localdata[this.myGrid.widgetObject.selectedrowindexes[i]][this.sourceForLinkForm.grid.valueMember];
    }
    this.sourceForLinkForm.grid.selectId = Ids;
    this.itemsLinkForm.code = this.sourceForLinkForm.window.code;
    this.itemsLinkForm.Ids = Ids;
    this.onSaveLinkwinBtn.emit(this.itemsLinkForm);
  }

  cancelBtn() {
    this.hideWindow();
  }

  openWindow() {
    this.getAll();
  }

  destroyWindow() {
    if (this.linkWindow) {
      this.linkWindow.destroy();
    }
    if (this.myGrid) {
      this.myGrid.destroy();
    }
  }

  hideWindow() {
    this.linkWindow.hide();
  }

  positionWindow(coord: any) {
    this.linkWindow.position({x: coord.x, y: coord.y});
  }
}
