import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';

import {jqxWindowComponent} from 'jqwidgets-scripts/jqwidgets-ng/jqxwindow';

import {EditFormItemComponent} from './edit-form-item/edit-form-item.component';

@Component({
  selector: 'app-edit-form',
  templateUrl: './edit-form.component.html',
  styleUrls: ['./edit-form.component.css']
})
export class EditFormComponent implements OnInit, AfterViewInit, OnDestroy {

  // variables from master component
  @Input() sourceForEditForm;
  @Input() settingWinForEditForm;


  // determine the functions that need to be performed in the parent component
  @Output() onSaveEditwinBtn = new EventEmitter<any>();
  @Output() onSetEditFormVisible = new EventEmitter();

  // define variables - link to view objects
  @ViewChild('editWindow') editWindow: jqxWindowComponent;
  @ViewChild('windowHeader') windowHeader: ElementRef;
  @ViewChild('editFormItemComponent') editFormItemComponent: EditFormItemComponent;

  // other variables


  constructor() {
  }

  ngOnInit() {

  }

  ngAfterViewInit() {

  }

  ngOnDestroy() {
    this.destroyWindow();
  }

  saveBtn() {
    this.onSaveEditwinBtn.emit();
  }

  cancelBtn() {
    this.closeDestroyWindow();
  }

  destroyWindow() {
    if (this.editWindow) {
      this.editWindow.destroy();
    }
  }

  closeDestroyWindow() {
    this.onSetEditFormVisible.emit();
    this.destroyWindow();
  }

  positionWindow(coord: any) {
    this.editWindow.position({x: coord.x, y: coord.y});
  }

  eventWindowClose(event: any): void {
    this.closeDestroyWindow();
  }
}
