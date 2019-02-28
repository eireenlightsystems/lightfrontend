import {AfterViewInit, Component, Input, OnInit, OnDestroy, ViewChild, EventEmitter, Output} from '@angular/core'
import {Subscription} from 'rxjs/index'
import jqxTooltip = jqwidgets.jqxTooltip;

import {FixtureService} from '../../../../shared/services/fixture/fixture.service'
import {
  FilterFixture,
  Fixture,
  FixtureType,
  Geograph,
  Owner_fixture,
  Substation,
  Contract,
  Installer,
  HeightType
} from '../../../../shared/interfaces'
import {FixturelistJqxgridComponent} from "./fixturelist-jqxgrid/fixturelist-jqxgrid.component";


const STEP = 1000000000000


@Component({
  selector: 'app-fixturelist-page',
  templateUrl: './fixturelist-page.component.html',
  styleUrls: ['./fixturelist-page.component.css']
})
export class FixturelistPageComponent implements OnInit, OnDestroy, AfterViewInit {

  //variables from master component
  @Input() geographs: Geograph[]
  @Input() owner_fixtures: Owner_fixture[]
  @Input() fixtureTypes: FixtureType[]
  @Input() substations: Substation[]
  @Input() contract_fixtures: Contract[]
  @Input() installers: Installer[]
  @Input() heightTypes: HeightType[]

  @Input() heightGrid: number
  @Input() id_contract_select: number
  @Input() id_node_select: number
  @Input() selectionmode: string
  @Input() isMasterGrid: boolean

  @Input() isAdd: boolean
  @Input() isUpdate: boolean
  @Input() isDelete: boolean
  @Input() isRefresh: boolean
  @Input() isFilter_none: boolean
  @Input() isFilter_list: boolean
  @Input() isPlace: boolean
  @Input() isPin_drop: boolean

  //determine the functions that need to be performed in the parent component
  @Output() onRefreshChildGrid = new EventEmitter<number>()

  //define variables - link to view objects
  @ViewChild("fixturelistJqxgridComponent") fixturelistJqxgridComponent: FixturelistJqxgridComponent;
  // @ViewChild('tooltip_refresh') tooltipRef_refresh: ElementRef
  // @ViewChild('tooltip_filter') tooltipRef_filter: ElementRef

  //other variables
  fixtures: Fixture[] = []
  filter: FilterFixture = {
    id_geograph: -1,
    id_owner: -1,
    id_fixture_type: -1,
    id_substation: -1,
    id_mode: -1,

    id_contract: -1,
    id_node: -1
  }
  oSub: Subscription
  isFilterVisible = false
  //
  offset = 0
  limit = STEP
  //
  loading = false
  reloading = false
  noMoreFixtures = false
  id_fixture_select: number = 0;
  // tooltip_refresh: MaterialInstance
  // tooltip_filter: MaterialInstance
  //
  isAddBtnDisabled: boolean
  isEditBtnDisabled: boolean
  isDeleteBtnDisabled: boolean
  isRefreshBtnDisabled: boolean
  isFilter_noneBtnDisabled: boolean
  isFilter_listBtnDisabled: boolean
  isPlaceBtnDisabled: boolean
  isPin_dropBtnDisabled: boolean

  constructor(private fixtureService: FixtureService) {
  }

  ngOnInit() {
    this.filter.id_node = this.id_node_select
    this.filter.id_contract = this.id_contract_select
    this.getAll()
    this.reloading = true
  }

  ngOnDestroy(): void {
    // this.tooltip_refresh.destroy()
    // this.tooltip_filter.destroy()
    this.oSub.unsubscribe()
  }

  ngAfterViewInit(): void {
    // this.tooltip_refresh = MaterialService.initTooltip(this.tooltipRef_refresh)
    // this.tooltip_filter = MaterialService.initTooltip(this.tooltipRef_filter)
  }

  refreshGrid() {
    this.fixtures = []
    this.getAll()
    this.reloading = true
    this.id_fixture_select = 0

    //if this.nodes id master grid, then we need refresh child grid
    if (this.isMasterGrid) this.refreshChildGrid(this.id_fixture_select)

  }

  refreshChildGrid(id_fixture: number) {
    this.id_fixture_select = id_fixture
    //refresh child grid
    this.onRefreshChildGrid.emit(id_fixture)
  }

  getAll() {

    //Disabled/available buttons
    if (!this.isMasterGrid && this.filter.id_node <= 0) {
      this.isAddBtnDisabled = true
      this.isEditBtnDisabled = true
      this.isDeleteBtnDisabled = true
      this.isRefreshBtnDisabled = true
      this.isFilter_noneBtnDisabled = true
      this.isFilter_listBtnDisabled = true
      this.isPlaceBtnDisabled = true
      this.isPin_dropBtnDisabled = true
    }else {
      this.isAddBtnDisabled = false
      this.isEditBtnDisabled = false
      this.isDeleteBtnDisabled = false
      this.isRefreshBtnDisabled = false
      this.isFilter_noneBtnDisabled = false
      this.isFilter_listBtnDisabled = false
      this.isPlaceBtnDisabled = false
      this.isPin_dropBtnDisabled = false
    }

    const params = Object.assign({}, {
        offset: this.offset,
        limit: this.limit
      },
      this.filter)

    this.oSub = this.fixtureService.getAll(params).subscribe(fixtures => {
      this.fixtures = this.fixtures.concat(fixtures)
      this.noMoreFixtures = fixtures.length < STEP
      this.loading = false
      this.reloading = false
    })
  }

  loadMore() {
    this.offset += STEP
    this.loading = true
    this.getAll()
  }

  applyFilter(filter: FilterFixture) {
    this.fixtures = []
    this.offset = 0
    this.filter = filter
    this.reloading = true
    this.getAll()
  }

  ins() {
    this.fixturelistJqxgridComponent.ins()
  }

  upd() {
    this.fixturelistJqxgridComponent.upd()
  }

  del() {
    this.fixturelistJqxgridComponent.del()
  }

  place() {
    this.fixturelistJqxgridComponent.place()
  }

  pin_drop() {
    this.fixturelistJqxgridComponent.pin_drop()
  }
}
