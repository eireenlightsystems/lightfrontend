import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs/index';
import {isUndefined} from 'util';

import {
  CommandStatus, CommandType, CommandSpeedSwitch,
  FilterCommandSpeedSwitch, SourceForFilter, CommandSpeedSwitchDflt,
  SettingButtonPanel,
  SourceForJqxGrid,
  SettingWinForEditForm, SourceForEditForm
} from '../../../../shared/interfaces';
import {CommandSpeedSwitchService} from '../../../../shared/services/command/commandSpeedSwitch.service';
import {DateTimeFormat} from '../../../../shared/classes/DateTimeFormat';
import {JqxgridComponent} from '../../../../shared/components/jqxgrid/jqxgrid.component';
import {ButtonPanelComponent} from '../../../../shared/components/button-panel/button-panel.component';
import {FilterTableComponent} from '../../../../shared/components/filter-table/filter-table.component';
import {EditFormComponent} from '../../../../shared/components/edit-form/edit-form.component';
import {LinkFormComponent} from '../../../../shared/components/link-form/link-form.component';
import {EventWindowComponent} from '../../../../shared/components/event-window/event-window.component';
import {FixturecomspeededitFormComponent} from './fixturecomspeededit-form/fixturecomspeededit-form.component';
import {MaterialService} from '../../../../shared/classes/material.service';


const STEP = 1000000000000;


@Component({
  selector: 'app-fixturecomspeedlist-page',
  templateUrl: './fixturecomspeedlist-page.component.html',
  styleUrls: ['./fixturecomspeedlist-page.component.css']
})
export class FixturecomspeedlistPageComponent implements OnInit, OnDestroy {

  // variables from master component
  @Input() commandTypes: CommandType[];
  @Input() commandStatuses: CommandStatus[];
  @Input() speedDirectiones: CommandType[];

  @Input() selectFixtureId: number;

  @Input() heightGrid: number;
  @Input() isMasterGrid: any;
  @Input() selectionmode: string;

  @Input() settingButtonPanel: SettingButtonPanel;

  // determine the functions that need to be performed in the parent component
  @Output() onRefreshChildGrid = new EventEmitter<number>();

  // define variables - link to view objects
  @ViewChild('jqxgridComponent') jqxgridComponent: JqxgridComponent;
  @ViewChild('buttonPanel') buttonPanel: ButtonPanelComponent;
  @ViewChild('filterTable') filterTable: FilterTableComponent;
  @ViewChild('editWindow') editWindow: EditFormComponent;
  @ViewChild('linkWindow') linkWindow: LinkFormComponent;
  @ViewChild('eventWindow') eventWindow: EventWindowComponent;

  @ViewChild('editSpeedComWindow') editSpeedComWindow: FixturecomspeededitFormComponent;

  // other variables
  offset = 0;
  limit = STEP;
  loading = false;
  reloading = false;
  noMoreItems = false;
  columnsGrid: any[];
  listBoxSource: any[];
  // main
  items: CommandSpeedSwitch[] = [];
  ids: number[] = [];
  commandSpeedSwitchDflt: CommandSpeedSwitchDflt = this.commandSpeedSwitchService.dfltParams();
  todayEndStart = {
    iso8601TZ: {
      start: () => new DateTimeFormat().toIso8601TZString(new Date(new Date().setHours(0, 0, 0, 0))),
      end: () => new DateTimeFormat().toIso8601TZString(new Date(new Date().setHours(23, 59, 59, 999)))
    }
  };
  filter: FilterCommandSpeedSwitch = {
    startDateTime: this.todayEndStart.iso8601TZ.start(),
    endDateTime: this.todayEndStart.iso8601TZ.end(),
    fixtureId: '',
    statusId: this.commandSpeedSwitchDflt.statusId.toString(),
    // значение получать из интерфейсного пакета (из таблицы значений по умолчанию) из БД
    speedDirectionId: ''
  };
  // grid
  oSub: Subscription;
  selectItemId = 0;
  sourceForJqxGrid: SourceForJqxGrid;
  // filter
  sourceForFilter: SourceForFilter[];
  isFilterVisible = false;
  // edit form
  settingWinForEditFormSwitchOff: SettingWinForEditForm;
  sourceForEditFormSwitchOff: SourceForEditForm[];
  isEditFormVisible = false;
  typeEditWindow = '';
  // event form
  warningEventWindow = '';
  actionEventWindow = '';


  constructor(private commandSpeedSwitchService: CommandSpeedSwitchService) {
  }

  ngOnInit() {
    // define columns for table
    this.columnsGrid =
      [
        {text: 'commandId', datafield: 'commandId', width: 150, hidden: true},
        {text: 'Время начала', datafield: 'startDateTime', width: 150},

        {text: 'Скорость, сек', datafield: 'speed', width: 200},
        {text: 'Статус', datafield: 'statusName', width: 200},
        {text: 'Тип команды', datafield: 'speedDirectionName', width: 300},
      ];
    this.listBoxSource =
      [
        {label: 'commandId', value: 'commandId', checked: false},
        {label: 'Время начала', value: 'startDateTime', checked: true},

        {label: 'Скорость, сек', value: 'speed', checked: true},
        {label: 'Статус', value: 'statusName', checked: true},
        {label: 'Тип команды', value: 'speedDirectionName', checked: true},
      ];

    // define filter
    this.commandSpeedSwitchDflt = this.commandSpeedSwitchService.dfltParams();
    this.sourceForFilter = [
      {
        name: 'commandStatuses',
        type: 'jqxComboBox',
        source: this.commandStatuses,
        theme: 'material',
        width: '200',
        height: '43',
        placeHolder: 'Статус комманды:',
        displayMember: 'name',
        valueMember: 'id',
        defaultValue: '',
        selectId: ''
      },
      {
        name: 'speedDirectiones',
        type: 'jqxComboBox',
        source: this.speedDirectiones,
        theme: 'material',
        width: '400',
        height: '43',
        placeHolder: 'Режим скорости:',
        displayMember: 'name',
        valueMember: 'id',
        defaultValue: '',
        selectId: ''
      },
      {
        name: 'startDateTime',
        type: 'jqxDateTimeInput',
        source: [],
        theme: 'material',
        width: '200',
        height: '43',
        placeHolder: 'Дата нач. интер.:',
        displayMember: 'code',
        valueMember: 'id',
        defaultValue: new DateTimeFormat().toDataPickerString(new Date(new Date().setHours(0, 0, 0, 0))),
        selectId: new DateTimeFormat().toIso8601TZString(new Date(new Date().setHours(0, 0, 0, 0)))
      },
      {
        name: 'endDateTime',
        type: 'jqxDateTimeInput',
        source: [],
        theme: 'material',
        width: '200',
        height: '43',
        placeHolder: 'Дата заве. интерв.:',
        displayMember: 'code',
        valueMember: 'id',
        defaultValue: new DateTimeFormat().toDataPickerString(new Date(new Date().setHours(23, 59, 59, 999))),
        selectId: new DateTimeFormat().toIso8601TZString(new Date(new Date().setHours(23, 59, 59, 999)))
      }
    ];

    // define window edit form

    // define edit form

    // jqxgrid
    this.sourceForJqxGrid = {
      listbox: {
        source: this.listBoxSource,
        theme: 'material',
        width: 150,
        height: this.heightGrid,
        checkboxes: true,
        filterable: true,
        allowDrag: true
      },
      grid: {
        source: this.items,
        columns: this.columnsGrid,
        theme: 'material',
        width: 0,
        height: this.heightGrid,
        columnsresize: true,
        sortable: true,
        filterable: true,
        altrows: true,
        selectionmode: this.selectionmode,
        isMasterGrid: this.isMasterGrid,

        valueMember: 'commandId',
        sortcolumn: ['commandId'],
        sortdirection: 'desc',
        selectId: []
      }
    };

    // if this.node is child grid, then we need update this.filter.fixtureId
    if (!this.isMasterGrid) {
      this.filter.fixtureId = this.selectFixtureId.toString();
    }

    this.getAll();
    this.reloading = true;
  }

  ngOnDestroy() {
    if (this.oSub) {
      this.oSub.unsubscribe();
    }
    if (this.jqxgridComponent) {
      this.jqxgridComponent.destroyGrid();
    }
    // if (this.filterTable) {
    //   this.filterTable.destroy();
    // }
    if (this.buttonPanel) {
      this.buttonPanel.destroy();
    }
    if (this.editWindow) {
      this.editWindow.destroyWindow();
    }
    if (this.editSpeedComWindow) {
      this.editSpeedComWindow.destroyWindow();
    }
    if (this.linkWindow) {
      this.linkWindow.destroyWindow();
    }
  }

  // GRID

  getSourceForJqxGrid() {
    this.sourceForJqxGrid.grid.source = this.items;
  }

  refreshGrid() {
    this.items = [];
    this.getAll();
    this.reloading = true;
    this.selectItemId = 0;

    // if this.nodes id master grid, then we need refresh child grid
    if (this.isMasterGrid && !isUndefined(this.jqxgridComponent.selectRow)) {
      this.refreshChildGrid(this.jqxgridComponent.selectRow);
    }
  }

  refreshChildGrid(selectRow: any) {
    this.selectItemId = selectRow.commandId;
    // refresh child grid
    this.onRefreshChildGrid.emit(selectRow.commandId);
  }

  getAll() {
    // Disabled/available buttons
    if (!this.isMasterGrid && +this.filter.fixtureId <= 0) {
      this.settingButtonPanel.add.disabled = true;
      this.settingButtonPanel.upd.disabled = true;
      this.settingButtonPanel.del.disabled = true;
      this.settingButtonPanel.refresh.disabled = true;
      this.settingButtonPanel.filterNone.disabled = true;
      this.settingButtonPanel.filterList.disabled = true;
      this.settingButtonPanel.place.disabled = true;
      this.settingButtonPanel.pinDrop.disabled = true;
      this.settingButtonPanel.groupIn.disabled = true;
      this.settingButtonPanel.groupOut.disabled = true;
      this.settingButtonPanel.switchOn.disabled = true;
      this.settingButtonPanel.switchOff.disabled = true;
    } else {
      this.settingButtonPanel.add.disabled = false;
      this.settingButtonPanel.upd.disabled = false;
      this.settingButtonPanel.del.disabled = false;
      this.settingButtonPanel.refresh.disabled = false;
      this.settingButtonPanel.filterNone.disabled = false;
      this.settingButtonPanel.filterList.disabled = false;
      this.settingButtonPanel.place.disabled = false;
      this.settingButtonPanel.pinDrop.disabled = false;
      this.settingButtonPanel.groupIn.disabled = false;
      this.settingButtonPanel.groupOut.disabled = false;
      this.settingButtonPanel.switchOn.disabled = false;
      this.settingButtonPanel.switchOff.disabled = false;
    }

    const params = Object.assign({}, {
        offset: this.offset,
        limit: this.limit
      },
      this.filter
    );
    this.oSub = this.commandSpeedSwitchService.getAll(params).subscribe(commandSpeeds => {
      // Link statusName
      const commandSpeedName = commandSpeeds;
      commandSpeedName.forEach(currentCommand => {
        currentCommand.statusName = this.commandStatuses.find(
          (currentStatus: CommandStatus) => currentStatus.id === currentCommand.statusId).name;
      });
      // Link speedDirectionsName
      commandSpeedName.forEach(currentCommand => {
        currentCommand.speedDirectionName = this.speedDirectiones.find(
          (currentSpeedDirection: CommandType) => currentSpeedDirection.id === currentCommand.speedDirectionId).name;
      });
      this.items = this.items.concat(commandSpeedName);
      this.noMoreItems = commandSpeeds.length < STEP;
      this.loading = false;
      this.reloading = false;
    });
  }

  loadMore() {
    this.offset += STEP;
    this.loading = true;
    this.getAll();
  }

  ins() {
    this.editSpeedComWindow.positionWindow({x: 600, y: 90});
    this.editSpeedComWindow.openWindow(this.selectFixtureId, 'ins');
  }

  upd() {
    this.editSpeedComWindow.positionWindow({x: 600, y: 90});
    this.editSpeedComWindow.openWindow(this.selectFixtureId, 'upd');
  }

  del() {
    if (!isUndefined(this.jqxgridComponent.selectRow)) {
      this.ids = [];
      for (let i = 0; i < this.jqxgridComponent.myGrid.widgetObject.selectedrowindexes.length; i++) {
        this.ids[i] = this.jqxgridComponent.source_jqxgrid.localdata[
          this.jqxgridComponent.myGrid.widgetObject.selectedrowindexes[i]].commandId;
      }

      this.eventWindow.okButtonDisabled(false);
      this.actionEventWindow = 'del';
      if (this.ids.length > 1) {
        this.warningEventWindow = `Удалить команды?`;
      } else {
        this.warningEventWindow = `Удалить команду id = "${this.jqxgridComponent.selectRow.commandId}"?`;
      }
    } else {
      this.eventWindow.okButtonDisabled(true);
      this.warningEventWindow = `Вам следует выбрать команду для удаления`;
    }
    this.eventWindow.openEventWindow();
  }

  refresh() {
    this.refreshGrid();
  }

  filterNone() {
    this.jqxgridComponent.islistBoxVisible = !this.jqxgridComponent.islistBoxVisible;
  }

  filterList() {
    this.isFilterVisible = !this.isFilterVisible;
  }

  place() {

  }

  pinDrop() {

  }

  groupIn() {

  }

  groupOut() {

  }

  switchOn() {

  }

  switchOff() {

  }

  // FILTER

  applyFilter(filter: FilterCommandSpeedSwitch) {
    this.items = [];
    this.offset = 0;
    this.filter = filter;
    this.reloading = true;
    this.getAll();
  }

  applyFilterFromFilter(event: any) {
    this.items = [];
    this.offset = 0;
    this.reloading = true;
    for (let i = 0; i < event.length; i++) {
      switch (event[i].name) {
        case 'commandStatuses':
          this.filter.statusId = event[i].id;
          break;
        case 'speedDirectiones':
          this.filter.speedDirectionId = event[i].id;
          break;
        case 'startDateTime':
          this.filter.startDateTime = event[i].id;
          break;
        case 'endDateTime':
          this.filter.endDateTime = event[i].id;
          break;
        default:
          break;
      }
    }
    this.getAll();
  }

  initSourceFilter() {
    for (let i = 0; i < this.sourceForFilter.length; i++) {
      switch (this.sourceForFilter[i].name) {
        case 'commandStatuses':
          this.sourceForFilter[i].source = this.commandStatuses;
          this.sourceForFilter[i].defaultValue = this.commandStatuses.indexOf(this.commandStatuses.find(
            (currentStatus: CommandStatus) => currentStatus.id === this.commandSpeedSwitchDflt.statusId)).toString();
          this.sourceForFilter[i].selectId = this.commandSpeedSwitchDflt.statusId.toString();
          break;
        default:
          break;
      }
    }
  }

  // EDIT FORM

  saveSpeedEditwinBtn() {
    // refresh table
    this.refreshGrid();
  }

  // EVENT FORM

  okEvenwinBtn() {
    if (this.actionEventWindow === 'del') {
      if (this.ids.length >= 0) {
        this.commandSpeedSwitchService.del(this.ids).subscribe(
          response => {
            MaterialService.toast('Комманды удалены!');
          },
          error => MaterialService.toast(error.error.message),
          () => {
            this.jqxgridComponent.refresh_del(this.ids);
          }
        );
      }
    }
  }
}
