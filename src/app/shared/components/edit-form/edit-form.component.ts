// angular lib
import {AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
// jqwidgets
import {jqxWindowComponent} from 'jqwidgets-scripts/jqwidgets-ng/jqxwindow';
// app interfaces
import {SettingWinForEditForm, SourceForEditForm} from '../../interfaces';
// app services
// app components


@Component({
  selector: 'app-edit-form',
  templateUrl: './edit-form.component.html',
  styleUrls: ['./edit-form.component.css']
})
export class EditFormComponent implements OnInit, AfterViewInit, OnDestroy {

  // variables from parent component
  @Input() settingWinForEditForm: SettingWinForEditForm;
  @Input() sourceForEditForm: SourceForEditForm[];

  // determine the functions that need to be performed in the parent component
  @Output() onSaveEditFormBtn = new EventEmitter();
  @Output() onInitEditForm = new EventEmitter();
  @Output() onGetSourceForEditForm = new EventEmitter();

  // define variables - link to view objects
  @ViewChild('editWindow', {static: false}) editWindow: jqxWindowComponent;

  // other variables


  constructor(
    // service
    public translate: TranslateService) {
  }

  ngOnInit() {

  }

  ngAfterViewInit() {

  }

  ngOnDestroy() {
    this.destroy();
  }

  destroy() {
    if (this.editWindow) {
      this.editWindow.destroy();
    }
  }

  open() {
    this.editWindow.open();
  }

  close() {
    this.editWindow.close();
  }

  closeDestroy() {
    this.onInitEditForm.emit();
    this.destroy();
  }

  hide() {
    this.editWindow.hide();
  }

  position(coord: any) {
    this.editWindow.position({x: coord.x, y: coord.y});
  }

  saveBtn() {
    this.onSaveEditFormBtn.emit();
  }

  cancelBtn() {
    this.closeDestroy();
  }
}
