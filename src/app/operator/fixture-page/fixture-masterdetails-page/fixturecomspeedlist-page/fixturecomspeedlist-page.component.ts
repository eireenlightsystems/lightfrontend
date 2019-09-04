// angular lib
import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs/index';
import {isUndefined} from 'util';
import {MatSnackBar} from '@angular/material/snack-bar';
import {TranslateService} from '@ngx-translate/core';
// jqwidgets
// app interfaces
import {
  CommandStatus, CommandType, CommandSpeedSwitch,
  FilterCommandSpeedSwitch, SourceForFilter, CommandSpeedSwitchDflt,
  SettingButtonPanel,
  SourceForJqxGrid,
  NavItem
} from '../../../../shared/interfaces';
// app services
import {CommandSpeedSwitchService} from '../../../../shared/services/command/commandSpeedSwitch.service';
// app components
import {DateTimeFormat} from '../../../../shared/classes/DateTimeFormat';
import {JqxgridComponent} from '../../../../shared/components/jqxgrid/jqxgrid.component';
import {ButtonPanelComponent} from '../../../../shared/components/button-panel/button-panel.component';
import {FilterTableComponent} from '../../../../shared/components/filter-table/filter-table.component';
import {EventWindowComponent} from '../../../../shared/components/event-window/event-window.component';
import {FixturecomspeededitFormComponent} from './fixturecomspeededit-form/fixturecomspeededit-form.component';


const STEP = 1000000000000;


@Component({
  selector: 'app-fixturecomspeedlist-page',
  templateUrl: './fixturecomspeedlist-page.component.html',
  styleUrls: ['./fixturecomspeedlist-page.component.css']
})
export class FixturecomspeedlistPageComponent implements OnInit, OnDestroy {

  // variables from parent component
  @Input() siteMap: NavItem[];
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
  @ViewChild('jqxgridComponent', {static: false}) jqxgridComponent: JqxgridComponent;
  @ViewChild('buttonPanel', {static: false}) buttonPanel: ButtonPanelComponent;
  @ViewChild('filterTable', {static: false}) filterTable: FilterTableComponent;
  @ViewChild('editFormSpeed', {static: false}) editFormSpeed: FixturecomspeededitFormComponent;
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
  items: CommandSpeedSwitch[] = [];
  ids: number[] = [];
  commandSpeedSwitchDflt: CommandSpeedSwitchDflt = this.commandSpeedSwitchService.dfltParams();
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
  filter: FilterCommandSpeedSwitch = {
    startDateTime: this.todayEndStart.iso8601TZ.start(),
    endDateTime: this.todayEndStart.iso8601TZ.end(),
    fixtureId: '',
    statusId: this.commandSpeedSwitchDflt.statusId.toString(),
    // get the value from the interface package (from the table of default values) from the database
    speedDirectionId: ''
  };
  sourceForFilter: SourceForFilter[];
  sourceForFilterEng: SourceForFilter[];
  isFilterVisible = false;
  filterSelect = '';
  // edit form
  isEditFormSpeedInit: any;
  // event form
  warningEventWindow = '';
  actionEventWindow = '';


  constructor(private _snackBar: MatSnackBar,
              // service
              public translate: TranslateService,
              private commandSpeedSwitchService: CommandSpeedSwitchService) {
  }

  ngOnInit() {
    // define columns
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
    this.columnsGridEng =
      [
        {text: 'commandId', datafield: 'commandId', width: 150, hidden: true},
        {text: 'Start date / time', datafield: 'startDateTime', width: 150},
        {text: 'Speed, sec', datafield: 'speed', width: 200},
        {text: 'Status', datafield: 'statusName', width: 200},
        {text: 'Command type', datafield: 'speedDirectionName', width: 300},
      ];
    this.listBoxSourceEng =
      [
        {label: 'commandId', value: 'commandId', checked: false},
        {label: 'Start date / time', value: 'startDateTime', checked: true},
        {label: 'Speed, sec', value: 'speed', checked: true},
        {label: 'Status', value: 'statusName', checked: true},
        {label: 'Command type', value: 'speedDirectionName', checked: true},
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
    this.commandSpeedSwitchDflt = this.commandSpeedSwitchService.dfltParams();
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
        name: 'speedDirectiones',
        type: 'jqxComboBox',
        source: this.speedDirectiones,
        theme: 'material',
        width: '380',
        height: '45',
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
        placeHolder: 'Command status:',
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
        width: '380',
        height: '45',
        placeHolder: 'Speed mode:',
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
    if (this.editFormSpeed) {
      this.editFormSpeed.destroy();
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
      this.initSourceFilter();
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
    this.isEditFormSpeedInit = true;
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
      this.translate.instant('site.menu.operator.fixture-page.fixture-masterdetails-page.fixturecomspeedlist-page.del-question');
    } else {
      this.eventWindow.okButtonDisabled(true);
      this.warningEventWindow =
        this.translate.instant('site.menu.operator.fixture-page.fixture-masterdetails-page.fixturecomspeedlist-page.del-warning');
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
      this.initSourceFilter();
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

  }

  switchOff() {

  }

  // FILTER

  applyFilter(filter: FilterCommandSpeedSwitch) {
    this.filter = filter;
    this.refreshGrid();
  }

  applyFilterFromFilter(event: any) {
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
    this.refreshGrid();
  }

  initSourceFilter() {
    if (!this.isFilterVisible
      && !isUndefined(this.commandStatuses)) {
      this.isFilterVisible = true;
      if (this.translate.currentLang === 'ru') {
        for (let i = 0; i < this.sourceForFilter.length; i++) {
          switch (this.sourceForFilter[i].name) {
            case 'commandStatuses':
              this.sourceForFilter[i].source = this.commandStatuses;
              this.sourceForFilter[i].defaultValue = this.commandStatuses.indexOf(this.commandStatuses.find(
                (currentStatus: CommandStatus) => currentStatus.id === this.commandSpeedSwitchDflt.statusId)).toString();
              this.sourceForFilter[i].selectId = this.commandSpeedSwitchDflt.statusId.toString();
              break;
            case 'speedDirectiones':
              this.sourceForFilter[i].source = this.speedDirectiones;
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
                (currentStatus: CommandStatus) => currentStatus.id === this.commandSpeedSwitchDflt.statusId)).toString();
              this.sourceForFilterEng[i].selectId = this.commandSpeedSwitchDflt.statusId.toString();
              break;
            case 'speedDirectiones':
              this.sourceForFilterEng[i].source = this.speedDirectiones;
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

  saveEditFormSpeedBtn() {
    // refresh table
    this.refreshGrid();
  }

  destroyEditFormSpeed() {
    this.isEditFormSpeedInit = false;
  }

  // EVENT FORM

  okEvenwinBtn() {
    if (this.actionEventWindow === 'del') {
      if (this.ids.length >= 0) {
        this.commandSpeedSwitchService.del(this.ids).subscribe(
          response => {
            this.openSnackBar(this.translate.instant(
              'site.menu.operator.fixture-page.fixture-masterdetails-page.fixturecomspeedlist-page.del'),
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
