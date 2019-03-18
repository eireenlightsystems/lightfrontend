import {AfterViewInit, Component, Input, OnInit, OnDestroy, ViewChild, EventEmitter, Output} from '@angular/core';
import {Subscription} from 'rxjs/index';
import jqxTooltip = jqwidgets.jqxTooltip;

import {FixtureService} from '../../../../shared/services/fixture/fixture.service';
import {
  FilterFixture,
  Fixture,
  FixtureType,
  Geograph,
  Owner_fixture,
  Substation,
  Contract,
  Installer,
  HeightType, FilterFixtureInGroup
} from '../../../../shared/interfaces';
import {FixturelistJqxgridComponent} from './fixturelist-jqxgrid/fixturelist-jqxgrid.component';
import {EventWindowComponent} from '../../../../shared/components/event-window/event-window.component';
import {jqxButtonComponent} from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxbuttons';
import {NodelinkFormComponent} from '../../../../node/node-page/node-masterdetails-page/nodelist-page/nodelink-form/nodelink-form.component';
import {MaterialService} from '../../../../shared/classes/material.service';
import {isUndefined} from 'util';


const STEP = 1000000000000;


@Component({
  selector: 'app-fixturelist-page',
  templateUrl: './fixturelist-page.component.html',
  styleUrls: ['./fixturelist-page.component.css']
})
export class FixturelistPageComponent implements OnInit, OnDestroy, AfterViewInit {

  // variables from master component
  @Input() geographs: Geograph[];
  @Input() owner_fixtures: Owner_fixture[];
  @Input() fixtureTypes: FixtureType[];
  @Input() substations: Substation[];
  @Input() contract_fixtures: Contract[];
  @Input() installers: Installer[];
  @Input() heightTypes: HeightType[];

  @Input() heightGrid: number;
  @Input() selectionmode: string;
  @Input() isMasterGrid: boolean;

  @Input() id_contract_select: number;
  @Input() id_node_select: number;
  @Input() fixtureGroupId: number;

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
  @ViewChild('eventWindow') eventWindow: EventWindowComponent;
  @ViewChild('warningEventWindow') warningEventWindow: string;
  @ViewChild('okButton') okButton: jqxButtonComponent;
  @ViewChild('linkWindow') linkWindow: NodelinkFormComponent;
  // @ViewChild('tooltip_refresh') tooltipRef_refresh: ElementRef
  // @ViewChild('tooltip_filter') tooltipRef_filter: ElementRef

  // other variables
  fixtures: Fixture[] = [];
  filter: FilterFixture = {
    id_geograph: -1,
    id_owner: -1,
    id_fixture_type: -1,
    id_substation: -1,
    id_mode: -1,

    id_contract: -1,
    id_node: -1
  };
  filterFixtureInGroup: FilterFixtureInGroup = {
    id_geograph: -1,
    id_owner: -1,
    id_fixture_type: -1,
    id_substation: -1,
    id_mode: -1,

    id_contract: -1,
    id_node: -1,
    id_fixture_group: -2
  };
  oSub: Subscription;
  isFilterVisible = false;
  //
  offset = 0;
  limit = STEP;
  //
  loading = false;
  reloading = false;
  noMoreFixtures = false;
  id_fixture_select: number;
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

  constructor(private fixtureService: FixtureService) {
  }

  ngOnInit() {
    this.filter.id_node = this.id_node_select;
    this.filter.id_contract = this.id_contract_select;

    // this.getAll();

    this.reloading = true;
  }

  ngOnDestroy(): void {
    // this.tooltip_refresh.destroy()
    // this.tooltip_filter.destroy()
    if (this.oSub) {
      this.oSub.unsubscribe();
    }
  }

  ngAfterViewInit(): void {

    this.refreshGrid();

    // this.tooltip_refresh = MaterialService.initTooltip(this.tooltipRef_refresh)
    // this.tooltip_filter = MaterialService.initTooltip(this.tooltipRef_filter)
  }

  // define columns for table
  columnsFixture: any[] =
    [
      {text: 'id_fixture', datafield: 'id_fixture', width: 150},

      {text: 'Географическое понятие', datafield: 'code_geograph', width: 150},
      {text: 'Договор', datafield: 'code_contract', width: 150},
      {text: 'Владелец', datafield: 'code_owner', width: 150},
      {text: 'Тип светильника', datafield: 'code_fixture_type', width: 150},
      {text: 'Подстанция', datafield: 'code_substation', width: 150},
      {text: 'Установщик', datafield: 'code_installer', width: 150},
      {text: 'Код высоты', datafield: 'code_height_type', width: 150},

      {text: 'Номер полосы', datafield: 'numline', width: 140},
      {text: 'Сторона', datafield: 'side', width: 140},
      {text: 'Признак главного светильника', datafield: 'flg_chief', width: 150},
      {text: 'Цена', datafield: 'price', width: 150},
      {text: 'Коментарий', datafield: 'comments', width: 150},

      {text: 'Режим', datafield: 'flg_light', width: 150},

      {text: 'Дата (редак.)', datafield: 'dateedit', width: 150},
      {text: 'Польз-ль (редак.)', datafield: 'useredit', width: 150},
    ];

  // define a data source for filtering table columns
  listBoxSourceFixture: any[] =
    [
      {label: 'id_fixture', value: 'id_fixture', checked: true},

      {label: 'Географическое понятие', value: 'code_geograph', checked: true},
      {label: 'Договор', value: 'code_contract', checked: false},
      {label: 'Владелец', value: 'id_owner', checked: true},
      {label: 'Тип светильника', value: 'code_fixture_type', checked: true},
      {label: 'Подстанция', value: 'code_substation', checked: true},
      {label: 'Установщик', value: 'code_installer', checked: false},
      {label: 'Код высоты', value: 'code_height_type', checked: true},

      {label: 'Номер полосы', value: 'numline', checked: true},
      {label: 'Сторона', value: 'side', checked: true},
      {label: 'Признак главного светильника', value: 'flg_chief', checked: true},
      {label: 'Цена', value: 'price', checked: true},
      {label: 'Коментарий', value: 'comments', checked: true},

      {label: 'Режим', value: 'flg_light', checked: false},

      {label: 'Дата (редак.)', value: 'dateedit', checked: false},
      {label: 'Польз-ль (редак.)', value: 'useredit', checked: false}
    ];

  refreshGrid() {
    this.fixtures = [];
    this.getAll();
    this.reloading = true;
    if (!isUndefined(this.fixturelistJqxgridComponent)) {
      this.fixturelistJqxgridComponent.refresh_jqxgGrid();
    }

    this.id_fixture_select = 0;
    // if this.nodes id master grid, then we need refresh child grid
    if (this.isMasterGrid) {
      this.refreshChildGrid(this.id_fixture_select);
    }
  }

  refreshChildGrid(id_fixture: number) {
    this.id_fixture_select = id_fixture;
    // refresh child grid
    this.onRefreshChildGrid.emit(id_fixture);
  }

  getAll() {
    // Disabled/available buttons
    if (!this.isMasterGrid && this.filter.id_node <= 0) {
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

    if (isUndefined(this.fixtureGroupId) || this.fixtureGroupId === 0) {
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
      const params = Object.assign({}, {
          offset: this.offset,
          limit: this.limit
        },
        this.filterFixtureInGroup);

      this.oSub = this.fixtureService.getFixtureInGroupAll(params).subscribe(fixtures => {
        this.fixtures = this.fixtures.concat(fixtures);
        this.noMoreFixtures = fixtures.length < STEP;
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

  applyFilter(filter: FilterFixture) {
    this.fixtures = [];
    this.offset = 0;
    this.filter = filter;
    this.reloading = true;

    // this.getAll();
    this.refreshGrid();
  }

  applyFilterFixtureInGroup(filterFixtureInGroup: FilterFixtureInGroup) {
    this.fixtures = [];
    this.offset = 0;
    this.filterFixtureInGroup = filterFixtureInGroup;
    this.fixtureGroupId = this.filterFixtureInGroup.id_fixture_group;
    this.reloading = true;

    // this.getAll();
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
    if (this.fixtureGroupId > 1) {
      this.linkWindow.getAll();
      // this.linkWindow.openWindow();
    } else {
      this.eventWindow.okButtonDisabled(true);
      this.warningEventWindow = `Вам следует выбрать ГРУППУ для привязки светильников`;
      this.eventWindow.openEventWindow();
    }
  }

  group_out() {
    if (this.fixturelistJqxgridComponent.selectFixture.id_fixture) {
      this.eventWindow.okButtonDisabled(false);
      this.warningEventWindow = `Исключить светильники из группы?`;
    } else {
      this.eventWindow.okButtonDisabled(true);
      this.warningEventWindow = `Вам следует выбрать светильники для исключения из группы`;
    }
    this.eventWindow.openEventWindow();
  }

  okEvenwinBtn() {
    const fixtureIds = [];
    for (let i = 0; i < this.fixturelistJqxgridComponent.myGrid.widgetObject.selectedrowindexes.length; i++) {
      fixtureIds[i] = this.fixturelistJqxgridComponent.source_jqxgrid.localdata[this.fixturelistJqxgridComponent.myGrid.widgetObject.selectedrowindexes[i]].id_fixture;
    }
    this.oSub = this.fixtureService.delFixtureInGroup(this.fixtureGroupId, fixtureIds).subscribe(
      response => {
        MaterialService.toast('Светильники удалены из группы!');
      },
      error => MaterialService.toast(error.message),
      () => {
        this.refreshGrid();
      }
    );
  }

  saveLinkwinBtn() {
    // refresh table
    this.refreshGrid();
  }

}
