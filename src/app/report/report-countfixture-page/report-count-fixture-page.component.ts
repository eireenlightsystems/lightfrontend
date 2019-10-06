// angular lib
import {AfterViewInit, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {isUndefined} from 'util';
import {Subscription} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';
import {MatTabChangeEvent, MatTabGroup} from '@angular/material/tabs';
// jqwidgets
// app interfaces
import {ReportCountFixture} from '../../shared/interfaces';
// app services
import {ReportFixtureService} from '../../shared/services/report/report-fixture.service';
// app components
import {JqxpivotgridComponent} from '../../shared/components/jqxpivotgrid/jqxpivotgrid.component';


@Component({
  selector: 'app-report-countfixture-page',
  templateUrl: './report-count-fixture-page.component.html',
  styleUrls: ['./report-count-fixture-page.component.css']
})
export class ReportCountFixturePageComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {

  // variables from parent component
  @Input() currentLang_: string;

  // determine the functions that need to be performed in the parent component
  @ViewChild('matTabGroup', {static: false}) matTabGroup: MatTabGroup;

  // define variables - link to view objects
  @ViewChild('jqxpivotgrid1', {static: false}) jqxpivotgrid1: JqxpivotgridComponent;
  @ViewChild('jqxpivotgrid2', {static: false}) jqxpivotgrid2: JqxpivotgridComponent;
  @ViewChild('jqxpivotgrid3', {static: false}) jqxpivotgrid3: JqxpivotgridComponent;
  @ViewChild('jqxpivotgrid4', {static: false}) jqxpivotgrid4: JqxpivotgridComponent;
  @ViewChild('jqxpivotgrid5', {static: false}) jqxpivotgrid5: JqxpivotgridComponent;
  @ViewChild('jqxpivotgrid6', {static: false}) jqxpivotgrid6: JqxpivotgridComponent;
  @ViewChild('jqxpivotgrid7', {static: false}) jqxpivotgrid7: JqxpivotgridComponent;

  // other variables
  oSubReportCountFixtures: Subscription;
  reportCountFixtures: ReportCountFixture[] = [];
  // by adress
  currDatafields1: any;
  currRows1 = [];
  currColumns1 = [];
  currFilters1 = [];
  currValues1 = [];
  // by owner
  currDatafields2: any;
  currRows2 = [];
  currColumns2 = [];
  currFilters2 = [];
  currValues2 = [];
  // by type
  currDatafields3: any;
  currRows3 = [];
  currColumns3 = [];
  currFilters3 = [];
  currValues3 = [];
  // by contract
  currDatafields4: any;
  currRows4 = [];
  currColumns4 = [];
  currFilters4 = [];
  currValues4 = [];
  // by installer
  currDatafields5: any;
  currRows5 = [];
  currColumns5 = [];
  currFilters5 = [];
  currValues5 = [];
  // by substation
  currDatafields6: any;
  currRows6 = [];
  currColumns6 = [];
  currFilters6 = [];
  currValues6 = [];
  // by height
  currDatafields7: any;
  currRows7 = [];
  currColumns7 = [];
  currFilters7 = [];
  currValues7 = [];


  constructor(
    // service
    public translate: TranslateService,
    private reportFixtureService: ReportFixtureService
  ) {
  }

  ngOnInit() {
    // {name: 'region', type: 'string'},
    // {name: 'area', type: 'string'},
    // {name: 'city', type: 'string'},
    // {name: 'cityDistrict', type: 'string'},
    // {name: 'settlement', type: 'string'},
    // {name: 'street', type: 'string'},
    // {name: 'house', type: 'string'},
    // {name: 'codeContract', type: 'string'},
    // {name: 'codeFixtureType', type: 'string'},
    // {name: 'codeInstaller', type: 'string'},
    // {name: 'codeSubstation', type: 'string'},
    // {name: 'codeHeightType', type: 'string'},
    // {name: 'codeOwner', type: 'string'},
    // {name: 'fixtureId', type: 'number'},
    // {name: 'countFixture', type: 'number'}

    // by adress
    this.currDatafields1 = [
      {name: 'city', type: 'string'},
      {name: 'street', type: 'string'},
      {name: 'fixtureId', type: 'number'},
      {name: 'countFixture', type: 'number'}
    ];
    // by owner
    this.currDatafields2 = [
      {name: 'codeOwner', type: 'string'},
      {name: 'fixtureId', type: 'number'},
      {name: 'countFixture', type: 'number'}
    ];
    // by type
    this.currDatafields3 = [
      {name: 'codeFixtureType', type: 'string'},
      {name: 'fixtureId', type: 'number'},
      {name: 'countFixture', type: 'number'}
    ];
    // by contract
    this.currDatafields4 = [
      {name: 'codeContract', type: 'string'},
      {name: 'fixtureId', type: 'number'},
      {name: 'countFixture', type: 'number'}
    ];
    // by installer
    this.currDatafields5 = [
      {name: 'codeInstaller', type: 'string'},
      {name: 'fixtureId', type: 'number'},
      {name: 'countFixture', type: 'number'}
    ];
    // by substation
    this.currDatafields6 = [
      {name: 'codeSubstation', type: 'string'},
      {name: 'fixtureId', type: 'number'},
      {name: 'countFixture', type: 'number'}
    ];
    // by height
    this.currDatafields7 = [
      {name: 'codeHeightType', type: 'string'},
      {name: 'fixtureId', type: 'number'},
      {name: 'countFixture', type: 'number'}
    ];
  }

  ngAfterViewInit() {
    this.getReportCountFixtures();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.currentLang_) {
      if (changes.currentLang_.currentValue === 'ru') {
        // by adress
        this.currRows1 = [
          {dataField: 'city', text: 'Город', width: 150},
          {dataField: 'street', text: 'Улица', width: 200},
          {dataField: 'fixtureId', text: 'ID'}
        ];
        this.currColumns1 = [];
        this.currFilters1 = [];
        this.currValues1 = [
          {
            dataField: 'countFixture',
            'function': 'count',
            text: 'Кол-во',
            align: 'left',
            cellsClassName: 'myItemStyle',
            cellsClassNameSelected: 'myItemStyleSelected'
          },
        ];
        // by owner
        this.currRows2 = [
          {dataField: 'codeOwner', text: 'Владелец', width: 150},
          {dataField: 'fixtureId', text: 'ID'}
        ];
        this.currColumns2 = [];
        this.currFilters2 = [];
        this.currValues2 = [
          {
            dataField: 'countFixture',
            'function': 'count',
            text: 'Кол-во',
            align: 'left',
            cellsClassName: 'myItemStyle',
            cellsClassNameSelected: 'myItemStyleSelected'
          },
        ];
        // by type
        this.currRows3 = [
          {dataField: 'codeFixtureType', text: 'Тип светильника', width: 150},
          {dataField: 'fixtureId', text: 'ID'}
        ];
        this.currColumns3 = [];
        this.currFilters3 = [];
        this.currValues3 = [
          {
            dataField: 'countFixture',
            'function': 'count',
            text: 'Кол-во',
            align: 'left',
            cellsClassName: 'myItemStyle',
            cellsClassNameSelected: 'myItemStyleSelected'
          },
        ];
        // by contract
        this.currRows4 = [
          {dataField: 'codeContract', text: 'Контракт', width: 150},
          {dataField: 'fixtureId', text: 'ID'}
        ];
        this.currColumns4 = [];
        this.currFilters4 = [];
        this.currValues4 = [
          {
            dataField: 'countFixture',
            'function': 'count',
            text: 'Кол-во',
            align: 'left',
            cellsClassName: 'myItemStyle',
            cellsClassNameSelected: 'myItemStyleSelected'
          },
        ];
        // by installer
        this.currRows5 = [
          {dataField: 'codeInstaller', text: 'Установщик', width: 150},
          {dataField: 'fixtureId', text: 'ID'}
        ];
        this.currColumns5 = [];
        this.currFilters5 = [];
        this.currValues5 = [
          {
            dataField: 'countFixture',
            'function': 'count',
            text: 'Кол-во',
            align: 'left',
            cellsClassName: 'myItemStyle',
            cellsClassNameSelected: 'myItemStyleSelected'
          },
        ];
        // by substation
        this.currRows6 = [
          {dataField: 'codeSubstation', text: 'Подстанция', width: 150},
          {dataField: 'fixtureId', text: 'ID'}
        ];
        this.currColumns6 = [];
        this.currFilters6 = [];
        this.currValues6 = [
          {
            dataField: 'countFixture',
            'function': 'count',
            text: 'Кол-во',
            align: 'left',
            cellsClassName: 'myItemStyle',
            cellsClassNameSelected: 'myItemStyleSelected'
          },
        ];
        // by height
        this.currRows7 = [
          {dataField: 'codeHeightType', text: 'Высота', width: 150},
          {dataField: 'fixtureId', text: 'ID'}
        ];
        this.currColumns7 = [];
        this.currFilters7 = [];
        this.currValues7 = [
          {
            dataField: 'countFixture',
            'function': 'count',
            text: 'Кол-во',
            align: 'left',
            cellsClassName: 'myItemStyle',
            cellsClassNameSelected: 'myItemStyleSelected'
          },
        ];
      } else {
        // by adress
        this.currRows1 = [
          {dataField: 'city', text: 'Сity', width: 150},
          {dataField: 'street', text: 'Street', width: 200},
          {dataField: 'fixtureId', text: 'ID'}
        ];
        this.currColumns1 = [];
        this.currFilters1 = [];
        this.currValues1 = [
          {
            dataField: 'countFixture',
            'function': 'count',
            text: 'Count',
            align: 'left',
            cellsClassName: 'myItemStyle',
            cellsClassNameSelected: 'myItemStyleSelected'
          },
        ];
        // by owner
        this.currRows2 = [
          {dataField: 'codeOwner', text: 'Owner', width: 150},
          {dataField: 'fixtureId', text: 'ID'}
        ];
        this.currColumns2 = [];
        this.currFilters2 = [];
        this.currValues2 = [
          {
            dataField: 'countFixture',
            'function': 'count',
            text: 'Count',
            align: 'left',
            cellsClassName: 'myItemStyle',
            cellsClassNameSelected: 'myItemStyleSelected'
          },
        ];
        // by type
        this.currRows3 = [
          {dataField: 'codeFixtureType', text: 'FixtureType', width: 150},
          {dataField: 'fixtureId', text: 'ID'}
        ];
        this.currColumns3 = [];
        this.currFilters3 = [];
        this.currValues3 = [
          {
            dataField: 'countFixture',
            'function': 'count',
            text: 'Count',
            align: 'left',
            cellsClassName: 'myItemStyle',
            cellsClassNameSelected: 'myItemStyleSelected'
          },
        ];
        // by contract
        this.currRows4 = [
          {dataField: 'codeContract', text: 'Contract', width: 150},
          {dataField: 'fixtureId', text: 'ID'}
        ];
        this.currColumns4 = [];
        this.currFilters4 = [];
        this.currValues4 = [
          {
            dataField: 'countFixture',
            'function': 'count',
            text: 'Count',
            align: 'left',
            cellsClassName: 'myItemStyle',
            cellsClassNameSelected: 'myItemStyleSelected'
          },
        ];
        // by installer
        this.currRows5 = [
          {dataField: 'codeInstaller', text: 'Installer', width: 150},
          {dataField: 'fixtureId', text: 'ID'}
        ];
        this.currColumns5 = [];
        this.currFilters5 = [];
        this.currValues5 = [
          {
            dataField: 'countFixture',
            'function': 'count',
            text: 'Count',
            align: 'left',
            cellsClassName: 'myItemStyle',
            cellsClassNameSelected: 'myItemStyleSelected'
          },
        ];
        // by substation
        this.currRows6 = [
          {dataField: 'codeSubstation', text: 'Substation', width: 150},
          {dataField: 'fixtureId', text: 'ID'}
        ];
        this.currColumns6 = [];
        this.currFilters6 = [];
        this.currValues6 = [
          {
            dataField: 'countFixture',
            'function': 'count',
            text: 'Count',
            align: 'left',
            cellsClassName: 'myItemStyle',
            cellsClassNameSelected: 'myItemStyleSelected'
          },
        ];
        // by height
        this.currRows7 = [
          {dataField: 'codeHeightType', text: 'Height of installation', width: 150},
          {dataField: 'fixtureId', text: 'ID'}
        ];
        this.currColumns7 = [];
        this.currFilters7 = [];
        this.currValues7 = [
          {
            dataField: 'countFixture',
            'function': 'count',
            text: 'Count',
            align: 'left',
            cellsClassName: 'myItemStyle',
            cellsClassNameSelected: 'myItemStyleSelected'
          },
        ];
      }
      this.getSourceForJqxPivotGrid();
    }
  }

  ngOnDestroy(): void {
    if (this.oSubReportCountFixtures) {
      this.oSubReportCountFixtures.unsubscribe();
    }
  }

  getReportCountFixtures() {
    this.oSubReportCountFixtures = this.reportFixtureService.getReportCountFixture().subscribe(items => {
      this.reportCountFixtures = items;
      this.getSourceForJqxPivotGrid1();
    });
  }

  getSourceForJqxPivotGrid() {
    // by adress
    this.getSourceForJqxPivotGrid1();

    // by owner
    this.getSourceForJqxPivotGrid2();

    // by type
    this.getSourceForJqxPivotGrid3();

    // by contract
    this.getSourceForJqxPivotGrid4();

    // by installer
    this.getSourceForJqxPivotGrid5();

    // by substation
    this.getSourceForJqxPivotGrid6();

    // by height
    this.getSourceForJqxPivotGrid7();
  }

  getSourceForJqxPivotGrid1() {
    // by adress
    if (!isUndefined(this.jqxpivotgrid1)) {
      this.jqxpivotgrid1.pivotDataSource = this.jqxpivotgrid1.createPivotDataSource(
        this.reportCountFixtures,
        this.currDatafields1,
        this.currRows1,
        this.currColumns1,
        this.currFilters1,
        this.currValues1,
      );
      setTimeout(() => {
        this.jqxpivotgrid1.pivotDesigner.refresh();
        this.jqxpivotgrid1.pivotGrid.refresh();
      }, 1000);
    }
  }

  getSourceForJqxPivotGrid2() {
    // by owner
    if (!isUndefined(this.jqxpivotgrid2)) {
      this.jqxpivotgrid2.pivotDataSource = this.jqxpivotgrid2.createPivotDataSource(
        this.reportCountFixtures,
        this.currDatafields2,
        this.currRows2,
        this.currColumns2,
        this.currFilters2,
        this.currValues2,
      );
      setTimeout(() => {
        this.jqxpivotgrid2.pivotDesigner.refresh();
        this.jqxpivotgrid2.pivotGrid.refresh();
      }, 1000);
    }
  }

  getSourceForJqxPivotGrid3() {
    // by type
    if (!isUndefined(this.jqxpivotgrid3)) {
      this.jqxpivotgrid3.pivotDataSource = this.jqxpivotgrid3.createPivotDataSource(
        this.reportCountFixtures,
        this.currDatafields3,
        this.currRows3,
        this.currColumns3,
        this.currFilters3,
        this.currValues3,
      );
      setTimeout(() => {
        this.jqxpivotgrid3.pivotDesigner.refresh();
        this.jqxpivotgrid3.pivotGrid.refresh();
      }, 1000);
    }
  }

  getSourceForJqxPivotGrid4() {
    if (!isUndefined(this.jqxpivotgrid4)) {
      this.jqxpivotgrid4.pivotDataSource = this.jqxpivotgrid4.createPivotDataSource(
        this.reportCountFixtures,
        this.currDatafields4,
        this.currRows4,
        this.currColumns4,
        this.currFilters4,
        this.currValues4,
      );
      setTimeout(() => {
        this.jqxpivotgrid4.pivotDesigner.refresh();
        this.jqxpivotgrid4.pivotGrid.refresh();
      }, 1000);
    }
  }

  getSourceForJqxPivotGrid5() {
    if (!isUndefined(this.jqxpivotgrid5)) {
      this.jqxpivotgrid5.pivotDataSource = this.jqxpivotgrid5.createPivotDataSource(
        this.reportCountFixtures,
        this.currDatafields5,
        this.currRows5,
        this.currColumns5,
        this.currFilters5,
        this.currValues5,
      );
      setTimeout(() => {
        this.jqxpivotgrid5.pivotDesigner.refresh();
        this.jqxpivotgrid5.pivotGrid.refresh();
      }, 1000);
    }
  }

  getSourceForJqxPivotGrid6() {
    if (!isUndefined(this.jqxpivotgrid6)) {
      this.jqxpivotgrid6.pivotDataSource = this.jqxpivotgrid6.createPivotDataSource(
        this.reportCountFixtures,
        this.currDatafields6,
        this.currRows6,
        this.currColumns6,
        this.currFilters6,
        this.currValues6,
      );
      setTimeout(() => {
        this.jqxpivotgrid6.pivotDesigner.refresh();
        this.jqxpivotgrid6.pivotGrid.refresh();
      }, 1000);
    }
  }

  getSourceForJqxPivotGrid7() {
    // by type
    if (!isUndefined(this.jqxpivotgrid7)) {
      this.jqxpivotgrid7.pivotDataSource = this.jqxpivotgrid7.createPivotDataSource(
        this.reportCountFixtures,
        this.currDatafields7,
        this.currRows7,
        this.currColumns7,
        this.currFilters7,
        this.currValues7,
      );
      setTimeout(() => {
        this.jqxpivotgrid7.pivotDesigner.refresh();
        this.jqxpivotgrid7.pivotGrid.refresh();
      }, 1000);
    }
  }

  selectedTabChange(event: MatTabChangeEvent) {
    switch (event.index) {
      case 0:

        break;
      case 1:
        this.getSourceForJqxPivotGrid2();
        break;
      case 2:
        this.getSourceForJqxPivotGrid3();
        break;
      case 3:
        this.getSourceForJqxPivotGrid4();
        break;
      case 4:
        this.getSourceForJqxPivotGrid5();
        break;
      case 5:
        this.getSourceForJqxPivotGrid6();
        break;
      case 6:
        this.getSourceForJqxPivotGrid7();
        break;
      default:
        break;
    }
  }
}
