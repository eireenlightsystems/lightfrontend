// @ts-ignore
import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';

import {jqxWindowComponent} from 'jqwidgets-scripts/jqwidgets-ng/jqxwindow';
import {TranslateService} from '@ngx-translate/core';

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
  @ViewChild('editWindow', {static: false}) editWindow: jqxWindowComponent;
  @ViewChild('windowHeader', {static: false}) windowHeader: ElementRef;
  @ViewChild('editFormItemComponent', {static: false}) editFormItemComponent: EditFormItemComponent;

  // other variables


  constructor(public translate: TranslateService) {
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
