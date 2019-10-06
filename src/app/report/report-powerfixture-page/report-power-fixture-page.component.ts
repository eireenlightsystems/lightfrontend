// angular lib
import {AfterViewInit, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {isUndefined} from 'util';
import {Subscription} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';
// jqwidgets
// app interfaces
import {ReportPowerFixture} from '../../shared/interfaces';
// app services
import {ReportFixtureService} from '../../shared/services/report/report-fixture.service';
// app components
import {JqxpivotgridComponent} from '../../shared/components/jqxpivotgrid/jqxpivotgrid.component';
import {MatTabChangeEvent, MatTabGroup} from '@angular/material/tabs';

@Component({
  selector: 'app-report-powerfixture-page',
  templateUrl: './report-power-fixture-page.component.html',
  styleUrls: ['./report-power-fixture-page.component.css']
})
export class ReportPowerFixturePageComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {

  // variables from parent component
  @Input() currentLang_: string;

  // determine the functions that need to be performed in the parent component
  @ViewChild('matTabGroup', {static: false}) matTabGroup: MatTabGroup;

  // define variables - link to view objects
  @ViewChild('jqxpivotgrid', {static: false}) jqxpivotgrid: JqxpivotgridComponent;

  // other variables
  oSubReportPowerFixtures: Subscription;
  reportPowerFixtures: ReportPowerFixture[] = [];
  currDatafields: any;
  currRows: any;
  currColumns: any;
  currFilters: any;
  currValues: any;

  constructor(
    // service
    public translate: TranslateService,
    private reportFixtureService: ReportFixtureService
  ) {
  }

  ngOnInit() {
    this.currDatafields = [
      {name: 'year', type: 'number'},
      {name: 'monthName', type: 'string'},
      {name: 'fixtureId', type: 'number'},
      {name: 'hours', type: 'number'},
      {name: 'kw', type: 'number'},
      {name: 'rub', type: 'number'}
    ];
  }

  ngAfterViewInit() {
    this.getReportPowerFixtures();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.currentLang_) {
      if (changes.currentLang_.currentValue === 'ru') {
        this.currRows = [
          {dataField: 'year', text: 'Год', width: 150},
          {dataField: 'fixtureId', text: 'ID'}
        ];
        this.currColumns = [{dataField: 'monthName', text: 'Месяц', width: 100}];
        this.currFilters = [];
        this.currValues = [
          {
            dataField: 'hours',
            'function': 'sum',
            text: 'Часы',
            align: 'left'
          },
          {
            dataField: 'kw',
            'function': 'sum',
            text: 'кВт',
            align: 'left'
          },
          {
            dataField: 'rub',
            'function': 'sum',
            text: 'Руб.',
            align: 'left'
          },
        ];
      } else {
        this.currRows = [
          {dataField: 'year', text: 'Year', width: 150},
          {dataField: 'fixtureId', text: 'ID'}
        ];
        this.currColumns = [{dataField: 'monthName', text: 'Month', width: 100}];
        this.currFilters = [];
        this.currValues = [
          {
            dataField: 'hours',
            'function': 'sum',
            text: 'Hour',
            align: 'left'
          },
          {
            dataField: 'kw',
            'function': 'sum',
            text: 'Kw',
            align: 'left'
          },
          {
            dataField: 'rub',
            'function': 'sum',
            text: 'Rub',
            align: 'left'
          },
        ];
      }
      this.getSourceForJqxPivotGrid();
    }
  }

  ngOnDestroy(): void {
    if (this.oSubReportPowerFixtures) {
      this.oSubReportPowerFixtures.unsubscribe();
    }
  }

  getReportPowerFixtures() {
    this.oSubReportPowerFixtures = this.reportFixtureService.getReportPowerFixture().subscribe(items => {
      this.reportPowerFixtures = items;
      this.getSourceForJqxPivotGrid();
    });
  }

  getSourceForJqxPivotGrid() {
    if (!isUndefined(this.jqxpivotgrid)) {
      this.jqxpivotgrid.pivotDataSource = this.jqxpivotgrid.createPivotDataSource(
        this.reportPowerFixtures,
        this.currDatafields,
        this.currRows,
        this.currColumns,
        this.currFilters,
        this.currValues,
      );
      setTimeout(() => {
        this.jqxpivotgrid.pivotDesigner.refresh();
        this.jqxpivotgrid.pivotGrid.refresh();
      }, 1000);
    }
  }

  selectedTabChange(event: MatTabChangeEvent) {
    switch (event.index) {
      case 0:
        break;
      default:
        break;
    }
  }
}
