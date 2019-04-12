import {AfterViewInit, Component, Input, OnInit, OnDestroy, ViewChild, EventEmitter, Output} from '@angular/core';
import {Subscription} from 'rxjs/index';
import {isUndefined} from 'util';

import {MaterialService} from '../../../../shared/classes/material.service';
import jqxTooltip = jqwidgets.jqxTooltip;

import {FixtureService} from '../../../../shared/services/fixture/fixture.service';
import {
  FilterFixture,
  Fixture,
  EquipmentType,
  Geograph,
  Owner,
  Substation,
  Contract,
  Installer,
  HeightType, SourceForFilter, SettingButtonPanel
} from '../../../../shared/interfaces';
import {FixturelistJqxgridComponent} from './fixturelist-jqxgrid/fixturelist-jqxgrid.component';


const STEP = 1000000000000;


@Component({
  selector: 'app-fixturelist-page',
  templateUrl: './fixturelist-page.component.html',
  styleUrls: ['./fixturelist-page.component.css']
})
export class FixturelistPageComponent implements OnInit, OnDestroy, AfterViewInit {

  // variables from master component
  @Input() geographs: Geograph[];
  @Input() ownerFixtures: Owner[];
  @Input() fixtureTypes: EquipmentType[];
  @Input() substations: Substation[];
  @Input() contractFixtures: Contract[];
  @Input() installers: Installer[];
  @Input() heightTypes: HeightType[];

  @Input() heightGrid: number;
  @Input() selectionmode: string;
  @Input() isMasterGrid: boolean;

  @Input() selectContractId: string;
  @Input() selectNodeId: string;
  @Input() fixtureGroupId: string;

  @Input() settingButtonPanel: SettingButtonPanel;

  // determine the functions that need to be performed in the parent component
  @Output() onRefreshChildGrid = new EventEmitter<number>();
  @Output() onGetFixtures = new EventEmitter<Fixture[]>();

  // define variables - link to view objects
  @ViewChild('fixturelistJqxgridComponent') fixturelistJqxgridComponent: FixturelistJqxgridComponent;
  // @ViewChild('tooltip_refresh') tooltipRef_refresh: ElementRef
  // @ViewChild('tooltip_filter') tooltipRef_filter: ElementRef

  // other variables
  fixtures: Fixture[] = [];
  filter: FilterFixture = {
    geographId: '',
    ownerId: '',
    fixtureTypeId: '',
    substationId: '',
    modeId: '',

    contractId: '',
    nodeId: ''
  };
  sourceForFilter: SourceForFilter[];
  oSub: Subscription;
  isFilterVisible = false;
  //
  offset = 0;
  limit = STEP;
  //
  loading = false;
  reloading = false;
  noMoreFixtures = false;
  selectFixtureId: number;
  // tooltip_refresh: MaterialInstance
  // tooltip_filter: MaterialInstance

  // define columns for table
  columnsFixture: any[] =
    [
      {text: 'fixtureId', datafield: 'fixtureId', width: 150},

      {text: 'Географическое понятие', datafield: 'geographCode', width: 150},
      {text: 'Договор', datafield: 'contractCode', width: 150, hidden: true},
      {text: 'Владелец', datafield: 'ownerCode', width: 150},
      {text: 'Тип светильника', datafield: 'fixtureTypeCode', width: 150},
      {text: 'Подстанция', datafield: 'substationCode', width: 150},
      {text: 'Установщик', datafield: 'installerCode', width: 150, hidden: true},
      {text: 'Код высоты', datafield: 'heightTypeCode', width: 150},

      {text: 'Серийный номер', datafield: 'serialNumber', width: 150},
      {text: 'Коментарий', datafield: 'comment', width: 150},

      {text: 'Режим', datafield: 'flgLight', width: 150, hidden: true},
    ];

  // define a data source for filtering table columns
  listBoxSourceFixture: any[] =
    [
      {label: 'fixtureId', value: 'fixtureId', checked: true},

      {label: 'Географическое понятие', value: 'geographCode', checked: true},
      {label: 'Договор', value: 'contractCode', checked: false},
      {label: 'Владелец', value: 'ownerCode', checked: true},
      {label: 'Тип светильника', value: 'fixtureTypeCode', checked: true},
      {label: 'Подстанция', value: 'substationCode', checked: true},
      {label: 'Установщик', value: 'installerCode', checked: false},
      {label: 'Код высоты', value: 'heightTypeCode', checked: true},

      {label: 'Серийный номер', value: 'serialNumber', checked: true},
      {label: 'Коментарий', value: 'comment', checked: true},

      {label: 'Режим', value: 'flgLight', checked: false},
    ];

  modes = [
    {
      id: 0,
      code: 'Выкл.'
    },
    {
      id: 1,
      code: 'Вкл.'
    }
  ];


  constructor(private fixtureService: FixtureService) {
  }

  ngOnInit() {
    this.filter.nodeId = this.selectNodeId;
    this.filter.contractId = this.selectContractId.toString();

    // Definde filter
    this.sourceForFilter = [
      {
        name: 'geographs',
        type: 'jqxComboBox',
        source: this.geographs,
        theme: 'material',
        width: '200',
        height: '43',
        placeHolder: 'Геогр. понятие:',
        displayMember: 'code',
        valueMember: 'id',
        defaultValue: '',
        selectId: ''
      },
      {
        name: 'ownerFixtures',
        type: 'jqxComboBox',
        source: this.ownerFixtures,
        theme: 'material',
        width: '200',
        height: '43',
        placeHolder: 'Владелец:',
        displayMember: 'code',
        valueMember: 'id',
        defaultValue: '',
        selectId: ''
      },
      {
        name: 'fixtureTypes',
        type: 'jqxComboBox',
        source: this.fixtureTypes,
        theme: 'material',
        width: '200',
        height: '43',
        placeHolder: 'Тип светильника:',
        displayMember: 'code',
        valueMember: 'id',
        defaultValue: '',
        selectId: ''
      },
      {
        name: 'substations',
        type: 'jqxComboBox',
        source: this.substations,
        theme: 'material',
        width: '200',
        height: '43',
        placeHolder: 'Подстанция:',
        displayMember: 'code',
        valueMember: 'id',
        defaultValue: '',
        selectId: ''
      },
      {
        name: 'modes',
        type: 'jqxComboBox',
        source: this.modes,
        theme: 'material',
        width: '200',
        height: '43',
        placeHolder: 'Вкл./выкл.:',
        displayMember: 'code',
        valueMember: 'id',
        defaultValue: '',
        selectId: ''
      }
    ];

    this.reloading = true;
    this.refreshGrid();
  }

  ngOnDestroy(): void {
    // this.tooltip_refresh.destroy()
    // this.tooltip_filter.destroy()
    if (this.oSub) {
      this.oSub.unsubscribe();
    }
  }

  ngAfterViewInit(): void {
    // this.refreshGrid();
    // this.tooltip_refresh = MaterialService.initTooltip(this.tooltipRef_refresh)
    // this.tooltip_filter = MaterialService.initTooltip(this.tooltipRef_filter)
  }

  refreshGrid() {
    this.fixtures = [];
    this.getAll();
    this.reloading = true;

    this.selectFixtureId = 0;
    // if this.nodes id master grid, then we need refresh child grid
    if (this.isMasterGrid) {
      this.refreshChildGrid(this.selectFixtureId);
    }
  }

  refreshChildGrid(id_fixture: number) {
    this.selectFixtureId = id_fixture;
    // refresh child grid
    this.onRefreshChildGrid.emit(id_fixture);
  }

  getAll() {
    // Disabled/available buttons
    if (!this.isMasterGrid && +this.filter.nodeId <= 0) {
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

    if (isUndefined(this.fixtureGroupId) || +this.fixtureGroupId === 0) {
      const params = Object.assign({}, {
          offset: this.offset,
          limit: this.limit
        },
        this.filter);

      this.oSub = this.fixtureService.getAll(params).subscribe(fixtures => {
        this.fixtures = this.fixtures.concat(fixtures);
        this.noMoreFixtures = fixtures.length < STEP;
        this.loading = false;
        this.reloading = false;
      });
    } else {
      this.oSub = this.fixtureService.getFixtureInGroup(this.fixtureGroupId).subscribe(fixtures => {
        this.fixtures = fixtures;
        this.loading = false;
        this.reloading = false;
        // Send array fixtures for the command switchOn/Off
        this.onGetFixtures.emit(this.fixtures);
      });
    }

    // fix fixture group id
    // this.fixtureGroupId = 0;
  }

  loadMore() {
    this.offset += STEP;
    this.loading = true;
    this.getAll();
  }

  applyFilter(event: any) {
    this.fixtures = [];
    this.offset = 0;
    this.reloading = true;
    this.filter = event;
    this.refreshGrid();
  }

  applyFilterFromFilter(event: any) {
    this.fixtures = [];
    this.offset = 0;
    this.reloading = true;
    for (let i = 0; i < event.length; i++) {
      switch (event[i].name) {
        case 'geographs':
          this.filter.geographId = event[i].id;
          break;
        case 'ownerFixtures':
          this.filter.ownerId = event[i].id;
          break;
        case 'fixtureTypes':
          this.filter.fixtureTypeId = event[i].id;
          break;
        case 'substations':
          this.filter.substationId = event[i].id;
          break;
        case 'modes':
          this.filter.modeId = event[i].id;
          break;
        default:
          break;
      }
    }
    this.refreshGrid();
  }

  initSourceFilter() {
    for (let i = 0; i < this.sourceForFilter.length; i++) {
      switch (this.sourceForFilter[i].name) {
        case 'geographs':
          this.sourceForFilter[i].source = this.geographs;
          break;
        case 'ownerFixtures':
          this.sourceForFilter[i].source = this.ownerFixtures;
          break;
        case 'fixtureTypes':
          this.sourceForFilter[i].source = this.fixtureTypes;
          break;
        case 'substations':
          this.sourceForFilter[i].source = this.substations;
          break;
        default:
          break;
      }
    }
  }

  applyFilterFixtureInGroup(fixtureGroupId: string) {
    this.fixtures = [];
    this.fixtureGroupId = fixtureGroupId;
    this.reloading = true;
    this.refreshGrid();
  }

  ins() {
    this.fixturelistJqxgridComponent.ins();
  }

  upd() {
    this.fixturelistJqxgridComponent.upd();
  }

  del() {
    this.fixturelistJqxgridComponent.del();
  }

  refresh() {
    this.refreshGrid();
  }

  filterNone() {
    this.fixturelistJqxgridComponent.islistBoxVisible = !this.fixturelistJqxgridComponent.islistBoxVisible;
  }

  filterList() {
    this.isFilterVisible = !this.isFilterVisible;
  }

  place() {
    this.fixturelistJqxgridComponent.place();
  }

  pinDrop() {
    this.fixturelistJqxgridComponent.pinDrop();
  }

  groupIn() {
    this.fixturelistJqxgridComponent.groupIn();
  }

  groupOut() {
    this.fixturelistJqxgridComponent.groupOut();
  }

  switchOn() {

  }

  switchOff() {

  }

}
