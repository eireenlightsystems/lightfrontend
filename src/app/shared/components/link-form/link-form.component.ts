// angular lib
import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
// jqwidgets
import {jqxWindowComponent} from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxwindow';
import {jqxGridComponent} from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxgrid';
// app interfaces
import {ItemsLinkForm, SourceForLinkForm} from '../../../shared/interfaces';
import {isUndefined} from 'util';
// app services
// app components


@Component({
  selector: 'app-link-form',
  templateUrl: './link-form.component.html',
  styleUrls: ['./link-form.component.css']
})
export class LinkFormComponent implements OnInit, OnDestroy, AfterViewInit {

  // variables from parent component
  @Input() sourceForLinkForm: SourceForLinkForm;

  // determine the functions that need to be performed in the parent component
  @Output() onSaveLinkFormBtn = new EventEmitter<ItemsLinkForm>();
  @Output() onDestroyLinkForm = new EventEmitter();
  @Output() onGetSourceForLinkForm = new EventEmitter();

  // define variables - link to view objects
  @ViewChild('linkWindow', {static: false}) linkWindow: jqxWindowComponent;
  @ViewChild('myGrid', {static: true}) myGrid: jqxGridComponent;

  // define the data source for the table
  source_jqxgrid: any;
  dataAdapter_jqxgrid: any;
  itemsLinkForm: ItemsLinkForm = new ItemsLinkForm();


  constructor(
    // service
    public translate: TranslateService) {
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
    if (!isUndefined(this.myGrid)) {
      this.myGrid.selectedrowindexes([]);
    }
  }

  ngAfterViewInit() {
    if (this.sourceForLinkForm.window.autoOpen === true) {
      this.getAll();
    }
  }

  ngOnDestroy(): void {
    this.destroy();
  }

  destroy() {
    if (this.linkWindow) {
      this.linkWindow.destroy();
    }
    if (this.myGrid) {
      this.myGrid.destroy();
    }
  }

  closeDestroy() {
    this.onDestroyLinkForm.emit();
  }

  position(coord: any) {
    this.linkWindow.position({x: coord.x, y: coord.y});
  }

  refreshGrid() {
    this.source_jqxgrid.localdata = this.sourceForLinkForm.grid.source;
    if (!isUndefined(this.myGrid)) {
      this.myGrid.selectedrowindexes([]);
      this.myGrid.updatebounddata('data');
    }
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
    this.onSaveLinkFormBtn.emit(this.itemsLinkForm);
  }

  cancelBtn() {
    this.closeDestroy();
  }
}
