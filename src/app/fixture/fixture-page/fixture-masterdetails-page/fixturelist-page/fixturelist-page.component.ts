import {AfterViewInit, Component, Input, OnInit, OnDestroy, ViewChild, EventEmitter, Output} from '@angular/core';
import {Subscription} from 'rxjs/index';

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
  HeightType, SourceForFilter
} from '../../../../shared/interfaces';
import {FixturelistJqxgridComponent} from './fixturelist-jqxgrid/fixturelist-jqxgrid.component';
import {EventWindowComponent} from '../../../../shared/components/event-window/event-window.component';
import {jqxButtonComponent} from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxbuttons';

import {isUndefined} from 'util';
import {LinkFormComponent} from '../../../../shared/components/link-form/link-form.component';


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

  @Input() isAdd: boolean;
  @Input() isUpdate: boolean;
  @Input() isDelete: boolean;
  @Input() isRefresh: boolean;
  @Input() isFilter_none: boolean;
  @Input() isFilter_list: boolean;
  @Input() isPlace: boolean;
  @Input() isPin_drop: boolean;
  @Input() isGroup_in: boolean;
  @Input() isGroup_out: boolean;

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
  //
  isAddBtnDisabled = false;
  isEditBtnDisabled = false;
  isDeleteBtnDisabled = false;
  isRefreshBtnDisabled = false;
  isFilter_noneBtnDisabled = false;
  isFilter_listBtnDisabled = false;
  isPlaceBtnDisabled = false;
  isPin_dropBtnDisabled = false;
  isGroup_outBtnDisabled = false;
  isGroup_inBtnDisabled = false;

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
      this.isAddBtnDisabled = true;
      this.isEditBtnDisabled = true;
      this.isDeleteBtnDisabled = true;
      this.isRefreshBtnDisabled = true;
      this.isFilter_noneBtnDisabled = true;
      this.isFilter_listBtnDisabled = true;
      this.isPlaceBtnDisabled = true;
      this.isPin_dropBtnDisabled = true;
      this.isGroup_outBtnDisabled = true;
      this.isGroup_outBtnDisabled = true;
    } else {
      this.isAddBtnDisabled = false;
      this.isEditBtnDisabled = false;
      this.isDeleteBtnDisabled = false;
      this.isRefreshBtnDisabled = false;
      this.isFilter_noneBtnDisabled = false;
      this.isFilter_listBtnDisabled = false;
      this.isPlaceBtnDisabled = false;
      this.isPin_dropBtnDisabled = false;
      this.isGroup_outBtnDisabled = false;
      this.isGroup_outBtnDisabled = false;
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

  place() {
    this.fixturelistJqxgridComponent.place();
  }

  pin_drop() {
    this.fixturelistJqxgridComponent.pin_drop();
  }

  group_in() {
    this.fixturelistJqxgridComponent.group_in();
  }

  group_out() {
    this.fixturelistJqxgridComponent.group_out();
  }
}
