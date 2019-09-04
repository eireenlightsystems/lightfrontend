// angular lib
import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs/index';
import {isUndefined} from 'util';
import {MatSnackBar} from '@angular/material/snack-bar';
import {TranslateService} from '@ngx-translate/core';
// jqwidgets
// app interfaces
import {
  CommandSwitch, CommandType, CommandStatus,
  FilterCommandSwitch, CommandSwitchDflt, SourceForFilter,
  SettingButtonPanel,
  SourceForJqxGrid,
  NavItem
} from '../../../../shared/interfaces';
// app services
import {CommandSwitchService} from '../../../../shared/services/command/commandSwitch.service';
// app components
import {DateTimeFormat} from '../../../../shared/classes/DateTimeFormat';
import {JqxgridComponent} from '../../../../shared/components/jqxgrid/jqxgrid.component';
import {ButtonPanelComponent} from '../../../../shared/components/button-panel/button-panel.component';
import {FilterTableComponent} from '../../../../shared/components/filter-table/filter-table.component';
import {EventWindowComponent} from '../../../../shared/components/event-window/event-window.component';
import {FixturecomeditFormComponent} from './fixturecomedit-form/fixturecomedit-form.component';
import {FixturecomeditSwitchoffFormComponent} from './fixturecomedit-switchoff-form/fixturecomedit-switchoff-form.component';


const STEP = 1000000000000;


@Component({
  selector: 'app-fixturecomlist-page',
  templateUrl: './fixturecomlist-page.component.html',
  styleUrls: ['./fixturecomlist-page.component.css']
})
export class FixturecomlistPageComponent implements OnInit, OnDestroy {

  // variables from parent component
  @Input() siteMap: NavItem[];
  @Input() commandTypes: CommandType[];
  @Input() commandStatuses: CommandStatus[];
  @Input() selectFixtureId: number;
  @Input() heightGrid: number;
  @Input() isMasterGrid: boolean;
  @Input() selectionmode: string;
  @Input() settingButtonPanel: SettingButtonPanel;

  // determine the functions that need to be performed in the parent component
  @Output() onRefreshChildGrid = new EventEmitter<number>();

  // define variables - link to view objects
  @ViewChild('jqxgridComponent', {static: false}) jqxgridComponent: JqxgridComponent;
  @ViewChild('buttonPanel', {static: false}) buttonPanel: ButtonPanelComponent;
  @ViewChild('filterTable', {static: false}) filterTable: FilterTableComponent;
  @ViewChild('editFormSwitchOn', {static: false}) editFormSwitchOn: FixturecomeditFormComponent;
  @ViewChild('editFormSwitchOff', {static: false}) editFormSwitchOff: FixturecomeditSwitchoffFormComponent;
  @ViewChild('eventWindow', {static: false}) eventWindow: EventWindowComponent;

  // other variables
  offset = 0;
  limit = STEP;
  loading = false;
  reloading = false;
  noMoreItems = false;
  columnsGrid: any[];
  listBoxSource: any[];
  columnsGridEng: any[];
  listBoxSourceEng: any[];
  // main
  items: CommandSwitch[] = [];
  ids: number[] = [];
  commandSwitchDflt: CommandSwitchDflt = this.commandSwitchService.dfltParams();
  todayEndStart = {
    iso8601TZ: {
      start: () => new DateTimeFormat().toIso8601TZString(new Date(new Date().setHours(0, 0, 0, 0))),
      end: () => new DateTimeFormat().toIso8601TZString(new Date(new Date().setHours(23, 59, 59, 999)))
    }
  };
  // grid
  oSub: Subscription;
  selectItemId = 0;
  sourceForJqxGrid: SourceForJqxGrid;
  // filter
  filter: FilterCommandSwitch = {
    startDateTime: this.todayEndStart.iso8601TZ.start(),
    endDateTime: this.todayEndStart.iso8601TZ.end(),
    fixtureId: '',
    statusId: this.commandSwitchDflt.statusId.toString()
    // значение получать из интерфейсного пакета (из таблицы значений по умолчанию) из БД
  };
  sourceForFilter: SourceForFilter[];
  sourceForFilterEng: SourceForFilter[];
  isFilterVisible = false;
  filterSelect = '';
  // edit form
  isEditFormSwitchOnInit = false;
  isEditFormSwitchOffInit = false;
  typeEditWindow = '';
  // event form
  warningEventWindow = '';
  actionEventWindow = '';

  constructor(private _snackBar: MatSnackBar,
              // service
              public translate: TranslateService,
              private commandSwitchService: CommandSwitchService) {
  }

  ngOnInit() {
    // definde columns
    this.columnsGrid =
      [
        {text: 'commandId', datafield: 'commandId', width: 150, hidden: true},
        {text: 'Время начала', datafield: 'startDateTime', width: 150},
        {text: 'Рабочий режим', datafield: 'workLevel', width: 150},
        {text: 'Дежурный режим', datafield: 'standbyLevel', width: 150},
        {text: 'Статус', datafield: 'statusName', width: 200},

      ];
    this.listBoxSource =
      [
        {label: 'commandId', value: 'commandId', checked: false},
        {label: 'Время начала', value: 'startDateTime', checked: true},
        {label: 'Рабочий режим', value: 'workLevel', checked: true},
        {label: 'Дежурный режим', value: 'standbyLevel', checked: true},
        {label: 'Статус', value: 'statusName', checked: true},
      ];
    this.columnsGridEng =
      [
        {text: 'commandId', datafield: 'commandId', width: 150, hidden: true},
        {text: 'Start date / time', datafield: 'startDateTime', width: 150},
        {text: 'Work level', datafield: 'workLevel', width: 150},
        {text: 'Standby level', datafield: 'standbyLevel', width: 150},
        {text: 'Status', datafield: 'statusName', width: 200},

      ];
    this.listBoxSourceEng =
      [
        {label: 'commandId', value: 'commandId', checked: false},
        {label: 'Start date / time', value: 'startDateTime', checked: true},
        {label: 'Work level', value: 'workLevel', checked: true},
        {label: 'Standby level', value: 'standbyLevel', checked: true},
        {label: 'Status', value: 'statusName', checked: true},
      ];

    // jqxgrid
    this.sourceForJqxGrid = {
      listbox: {
        theme: 'material',
        width: 150,
        height: this.heightGrid,
        checkboxes: true,
        filterable: true,
        allowDrag: true
      },
      grid: {
        source: this.items,
        theme: 'material',
        width: null,
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

    // define filter
    this.sourceForFilter = [
      {
        name: 'commandStatuses',
        type: 'jqxComboBox',
        source: this.commandStatuses,
        theme: 'material',
        width: '380',
        height: '45',
        placeHolder: 'Статус комманды:',
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
        width: '380',
        height: '45',
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
        width: '380',
        height: '45',
        placeHolder: 'Дата заве. интерв.:',
        displayMember: 'code',
        valueMember: 'id',
        defaultValue: new DateTimeFormat().toDataPickerString(new Date(new Date().setHours(23, 59, 59, 999))),
        selectId: new DateTimeFormat().toIso8601TZString(new Date(new Date().setHours(23, 59, 59, 999)))
      }
    ];
    this.sourceForFilterEng = [
      {
        name: 'commandStatuses',
        type: 'jqxComboBox',
        source: this.commandStatuses,
        theme: 'material',
        width: '380',
        height: '45',
        placeHolder: 'Status of command:',
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
        width: '380',
        height: '45',
        placeHolder: 'Start date inter.:',
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
        width: '380',
        height: '45',
        placeHolder: 'End date inter.:',
        displayMember: 'code',
        valueMember: 'id',
        defaultValue: new DateTimeFormat().toDataPickerString(new Date(new Date().setHours(23, 59, 59, 999))),
        selectId: new DateTimeFormat().toIso8601TZString(new Date(new Date().setHours(23, 59, 59, 999)))
      }
    ];

    // define edit form

    if (this.isMasterGrid) {
      this.refreshGrid();
    } else {
      // disabled/available buttons
      this.getAvailabilityButtons();
    }
  }

  ngOnDestroy() {
    if (this.oSub) {
      this.oSub.unsubscribe();
    }
    if (this.jqxgridComponent) {
      this.jqxgridComponent.destroyGrid();
    }
    if (this.filterTable) {
      this.filterTable.destroy();
    }
    if (this.buttonPanel) {
      this.buttonPanel.destroy();
    }
    if (this.editFormSwitchOn) {
      this.editFormSwitchOn.destroy();
    }
    if (this.editFormSwitchOff) {
      this.editFormSwitchOff.destroy();
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

    // initialization source for filter
    setTimeout(() => {
      this.getSourceForFilter();
    }, 1000);

    // disabled/available buttons
    this.getAvailabilityButtons();

    // if it is master grid, then we need refresh child grid
    if (this.isMasterGrid) {
      this.onRefreshChildGrid.emit(this.selectItemId);
    }
  }

  refreshChildGrid(selectRow: any) {
    this.selectItemId = selectRow.commandId;
    // refresh child grid
    this.onRefreshChildGrid.emit(selectRow.commandId);
  }

  getAll() {
    const params = Object.assign({}, {
        offset: this.offset,
        limit: this.limit
      },
      this.filter
    );
    this.oSub = this.commandSwitchService.getAll(params).subscribe(commandSwitches => {
      // Link statusName
      const commandSwitchesStatusName = commandSwitches;
      commandSwitchesStatusName.forEach(currentCommand => {
        currentCommand.statusName = this.commandStatuses.find(
          (currentStatus: CommandStatus) => currentStatus.id === currentCommand.statusId).name;
      });
      this.items = this.items.concat(commandSwitchesStatusName);
      this.noMoreItems = commandSwitches.length < STEP;
      this.loading = false;
      this.reloading = false;
    });
  }

  getAvailabilityButtons() {
    if (!this.isMasterGrid && +this.filter.fixtureId === 0) {
      this.getDisabledButtons();
    } else {
      this.getEnabledButtons();
    }
  }

  getDisabledButtons() {
    if (!isUndefined(this.settingButtonPanel)) {
      this.settingButtonPanel.add.disabled = true;
      this.settingButtonPanel.upd.disabled = true;
      this.settingButtonPanel.del.disabled = true;
      this.settingButtonPanel.refresh.disabled = true;
      this.settingButtonPanel.setting.disabled = true;
      this.settingButtonPanel.filterList.disabled = true;
      this.settingButtonPanel.place.disabled = true;
      this.settingButtonPanel.pinDrop.disabled = true;
      this.settingButtonPanel.groupIn.disabled = true;
      this.settingButtonPanel.groupOut.disabled = true;
      this.settingButtonPanel.switchOn.disabled = true;
      this.settingButtonPanel.switchOff.disabled = true;
    }
  }

  getEnabledButtons() {
    if (!isUndefined(this.settingButtonPanel)) {
      this.settingButtonPanel.add.disabled = false;
      this.settingButtonPanel.upd.disabled = false;
      this.settingButtonPanel.del.disabled = false;
      this.settingButtonPanel.refresh.disabled = false;
      this.settingButtonPanel.setting.disabled = false;
      this.settingButtonPanel.filterList.disabled = false;
      this.settingButtonPanel.place.disabled = false;
      this.settingButtonPanel.pinDrop.disabled = false;
      this.settingButtonPanel.groupIn.disabled = false;
      this.settingButtonPanel.groupOut.disabled = false;
      this.settingButtonPanel.switchOn.disabled = false;
      this.settingButtonPanel.switchOff.disabled = false;
    }
  }

  loadMore() {
    this.offset += STEP;
    this.loading = true;
    this.getAll();
  }

  ins() {

  }

  upd() {

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
      this.warningEventWindow =
        this.translate.instant('site.menu.operator.fixture-page.fixture-masterdetails-page.fixturecomlist-page.del-question');
    } else {
      this.eventWindow.okButtonDisabled(true);
      this.warningEventWindow =
        this.translate.instant('site.menu.operator.fixture-page.fixture-masterdetails-page.fixturecomlist-page.del-warning');
    }
    this.eventWindow.openEventWindow();
  }

  refresh() {
    this.refreshGrid();
  }

  setting() {
    this.jqxgridComponent.openSettinWin();
  }

  filterList() {
    if (this.filterTable.filtrWindow.isOpen()) {
      this.filterTable.close();
    } else {
      this.getSourceForFilter();
      this.filterTable.open();
    }
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
    this.isEditFormSwitchOnInit = true;
  }

  switchOff() {
    this.isEditFormSwitchOffInit = true;
  }

  // FILTER

  applyFilter(filter: FilterCommandSwitch) {
    this.filter = filter;
    this.refreshGrid();
  }

  applyFilterFromFilter(event: any) {
    for (let i = 0; i < event.length; i++) {
      switch (event[i].name) {
        case 'commandStatuses':
          this.filter.statusId = event[i].id;
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
    this.refreshGrid();
  }

  getSourceForFilter() {
    if (!this.isFilterVisible
      && !isUndefined(this.commandStatuses)) {
      this.isFilterVisible = true;
      if (this.translate.currentLang === 'ru') {
        for (let i = 0; i < this.sourceForFilter.length; i++) {
          switch (this.sourceForFilter[i].name) {
            case 'commandStatuses':
              this.sourceForFilter[i].source = this.commandStatuses;
              this.sourceForFilter[i].defaultValue = this.commandStatuses.indexOf(this.commandStatuses.find(
                (currentStatus: CommandStatus) => currentStatus.id === this.commandSwitchDflt.statusId)).toString();
              this.sourceForFilter[i].selectId = this.commandSwitchDflt.statusId.toString();
              break;
            default:
              break;
          }
        }
      }
      if (this.translate.currentLang === 'en') {
        for (let i = 0; i < this.sourceForFilterEng.length; i++) {
          switch (this.sourceForFilterEng[i].name) {
            case 'commandStatuses':
              this.sourceForFilterEng[i].source = this.commandStatuses;
              this.sourceForFilterEng[i].defaultValue = this.commandStatuses.indexOf(this.commandStatuses.find(
                (currentStatus: CommandStatus) => currentStatus.id === this.commandSwitchDflt.statusId)).toString();
              this.sourceForFilterEng[i].selectId = this.commandSwitchDflt.statusId.toString();
              break;
            default:
              break;
          }
        }
      }
    }
    // view select filter for user
    if (this.isFilterVisible === true) {
      this.filterSelect = this.filterTable.getFilterSelect();
    }
  }

  // EDIT FORM

  saveEditFormSwitchOnBtn() {
    // refresh table
    this.refreshGrid();
  }

  saveEditFormSwitchOffBtn() {
    // refresh table
    this.refreshGrid();
  }

  destroyEditFormSwitchOn() {
    this.isEditFormSwitchOnInit = false;
  }

  destroyEditFormSwitchOff() {
    this.isEditFormSwitchOffInit = false;
  }

  // EVENT FORM

  okEvenwinBtn() {
    if (this.actionEventWindow === 'del') {
      if (this.ids.length >= 0) {
        this.commandSwitchService.del(this.ids).subscribe(
          response => {
            this.openSnackBar(this.translate.instant('site.menu.operator.fixture-page.fixture-masterdetails-page.fixturecomlist-page.del'),
              this.translate.instant('site.forms.editforms.ok'));
          },
          error =>
            this.openSnackBar(error.error.message, this.translate.instant('site.forms.editforms.ok')),
          () => {
            this.jqxgridComponent.refresh_del(this.ids);
          }
        );
      }
    }
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
    });
  }
}
