import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';

import {EquipmentType, SettingButtonPanel, SettingWinForEditForm, SourceForEditForm, SourceForJqxGrid} from '../../interfaces';
import {EventWindowComponent} from '../event-window/event-window.component';
import {EditFormComponent} from '../edit-form/edit-form.component';
import {ButtonPanelComponent} from '../button-panel/button-panel.component';
import {JqxgridComponent} from '../jqxgrid/jqxgrid.component';
import {isUndefined} from 'util';

@Component({
  selector: 'app-simple-handbook',
  templateUrl: './simple-handbook.component.html',
  styleUrls: ['./simple-handbook.component.css']
})
export class SimpleHandbookComponent implements OnInit, OnDestroy {

  // variables from master component
  @Input() typeHandBook: string;
  @Input() settingButtonPanel: SettingButtonPanel;
  @Input() sourceForJqxGrid: SourceForJqxGrid;
  @Input() settingWinForEditForm: SettingWinForEditForm;
  @Input() sourceForEditForm: SourceForEditForm[];

  // determine the functions that need to be performed in the parent component
  @Output() onGetSourceForJqxGrid = new EventEmitter<any>();
  @Output() onSaveEditwinBtn = new EventEmitter<any>();
  @Output() onOkEvenwinBtn = new EventEmitter<any>();

  // define variables - link to view objects
  @ViewChild('jqxgridComponent') jqxgridComponent: JqxgridComponent;
  @ViewChild('buttonPanel') buttonPanel: ButtonPanelComponent;
  @ViewChild('editWindow') editWindow: EditFormComponent;
  @ViewChild('eventWindow') eventWindow: EventWindowComponent;

  // other variables
  loading = false;
  reloading = false;
  // main
  items: EquipmentType[] = [];
  // grid
  selectItemId = 0;
  // filter
  // edit form
  isEditFormVisible = false;
  typeEditWindow = '';
  // link form
  // event form
  warningEventWindow = '';
  actionEventWindow = '';

  constructor() {
  }

  ngOnInit() {
    // this.refreshGrid();
  }

  ngOnDestroy() {
    if (this.buttonPanel) {
      this.buttonPanel.destroy();
    }
    if (this.jqxgridComponent) {
      this.jqxgridComponent.destroyGrid();
    }
    if (this.editWindow) {
      this.editWindow.destroyWindow();
    }
  }

  // GRID

  getSourceForJqxGrid() {
    // this.getAll();
  }

  refreshGrid() {
    this.items = [];
    this.reloading = true;
    this.getAll();
    this.selectItemId = 0;

    // initialization source for filter

    // disabled/available buttons

    // if it is master grid, then we need refresh child grid

  }

  getAll() {
    this.onGetSourceForJqxGrid.emit(this.typeHandBook);
    // this.loading = false;
    // this.reloading = false;
  }

  ins() {
    this.typeEditWindow = 'ins';
    this.getSourceForEditForm();
    this.isEditFormVisible = !this.isEditFormVisible;
  }

  upd() {
    if (!isUndefined(this.jqxgridComponent.selectRow)) {
      this.typeEditWindow = 'upd';
      this.getSourceForEditForm();
      this.isEditFormVisible = !this.isEditFormVisible;
    } else {
      this.eventWindow.okButtonDisabled(true);
      this.warningEventWindow = `Вам следует выбрать тип оборудования для редактирования`;
      this.eventWindow.openEventWindow();
    }
  }

  del() {
    if (!isUndefined(this.jqxgridComponent.selectRow)) {
      this.eventWindow.okButtonDisabled(false);
      this.actionEventWindow = 'del';
      this.warningEventWindow = `Удалить тип оборудования id = "${this.jqxgridComponent.myGrid.getrowid(this.jqxgridComponent.myGrid.getselectedrowindex())}"?`;
    } else {
      this.eventWindow.okButtonDisabled(true);
      this.warningEventWindow = `Вам следует выбрать тип оборудования для удаления`;
    }
    this.eventWindow.openEventWindow();
  }

  refresh() {
    this.refreshGrid();
  }

  // FILTER


  // EDIT FORM

  saveEditwinBtn() {
    const saveEditwinObject = new Object();
    const selectObject = new Object();
    for (let i = 0; i < this.sourceForEditForm.length; i++) {
      selectObject[this.sourceForEditForm[i].nameField] = this.sourceForEditForm[i].selectCode;
    }
    saveEditwinObject['handBookType'] = this.typeHandBook;
    saveEditwinObject['typeEditWindow'] = this.typeEditWindow;
    saveEditwinObject['selectObject'] = selectObject;
    this.onSaveEditwinBtn.emit(saveEditwinObject);
  }

  getSourceForEditForm() {
    for (let i = 0; i < this.sourceForEditForm.length; i++) {
      if (this.typeEditWindow === 'ins') {
        this.sourceForEditForm[i].selectedIndex = 0;
        this.sourceForEditForm[i].selectId = '1';
        switch (this.sourceForEditForm[i].type) {
          case 'jqxTextArea':
            this.sourceForEditForm[i].selectCode = 'пусто';
            break;
          case 'jqxNumberInput':
            this.sourceForEditForm[i].selectCode = '0';
            break;
          default:
            this.sourceForEditForm[i].selectCode = '';
        }
      }
      if (this.typeEditWindow === 'upd') {
        this.sourceForEditForm[i].selectCode = this.jqxgridComponent.selectRow[this.sourceForEditForm[i].nameField];
      }
    }
  }

  setEditFormVisible() {
    this.isEditFormVisible = !this.isEditFormVisible;
  }

  // LINK FORM

  // EVENT FORM

  okEvenwinBtn() {
    const okEvenwinObject = new Object();
    const selectedrowindex = this.jqxgridComponent.myGrid.getselectedrowindex();
    const id = this.jqxgridComponent.myGrid.getrowid(selectedrowindex);
    okEvenwinObject['handBookType'] = this.typeHandBook;
    okEvenwinObject['actionEventWindow'] = 'del';
    okEvenwinObject['id'] = id;
    this.onOkEvenwinBtn.emit(okEvenwinObject);
  }

}
