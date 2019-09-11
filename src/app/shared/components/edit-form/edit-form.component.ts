// angular lib
import {AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
// jqwidgets
import {jqxWindowComponent} from 'jqwidgets-scripts/jqwidgets-ng/jqxwindow';
import jqxButton = jqwidgets.jqxButton;
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
  @Output() onDestroyEditForm = new EventEmitter();
  @Output() onGetSourceForEditForm = new EventEmitter();

  // define variables - link to view objects
  @ViewChild('editWindow', {static: false}) editWindow: jqxWindowComponent;
  @ViewChild('okButton', {static: false}) okButton: jqxButton;
  @ViewChild('cancelButton', {static: false}) cancelButton: jqxButton;

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

  closeDestroy() {
    this.onDestroyEditForm.emit();
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
