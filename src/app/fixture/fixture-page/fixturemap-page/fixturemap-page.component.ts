import {Component, EventEmitter, Input, NgZone, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Observable, Subscription, timer} from "rxjs";
import {MaterialService} from "../../../shared/classes/material.service";

import {
  Contract, FilterFixture,
  FixtureType,
  Geograph, HeightType,
  Installer,
  Owner_fixture,
  Substation
} from "../../../shared/interfaces";
import {FixtureService} from "../../../shared/services/fixture/fixture.service";
import {EventWindowComponent} from "../../../shared/components/event-window/event-window.component";
import {Fixture} from 'src/app/shared/models/fixture';
import {FixtureeditFormComponent} from "../fixture-masterdetails-page/fixturelist-page/fixtureedit-form/fixtureedit-form.component";
import {FixturecomeditFormComponent} from "../fixture-masterdetails-page/fixturecomlist-page/fixturecomedit-form/fixturecomedit-form.component";


declare var ymaps: any;


@Component({
  selector: 'app-fixturemap-page',
  templateUrl: './fixturemap-page.component.html',
  styleUrls: ['./fixturemap-page.component.css']
})
export class FixturemapPageComponent implements OnInit, OnDestroy {

  //variables from master component
  @Input() geographs: Geograph[]
  @Input() owner_fixtures: Owner_fixture[]
  @Input() fixtureTypes: FixtureType[]
  @Input() substations: Substation[]
  @Input() contract_fixtures: Contract[]
  @Input() installers: Installer[]
  @Input() heightTypes: HeightType[]

  //determine the functions that need to be performed in the parent component
  @Output() onRefreshGrid = new EventEmitter()

  //define variables - link to view objects
  @ViewChild('editWindow') editWindow: FixtureeditFormComponent
  @ViewChild('comWindow') comWindow: FixturecomeditFormComponent
  @ViewChild('eventWindow') eventWindow: EventWindowComponent
  @ViewChild('warningEventWindow') warningEventWindow: string

  //other variables
  fixtures: Fixture[]
  fixture: Fixture = new Fixture()
  id_fixture_del: number
  map: any
  actionEventWindow: string = ""
  //
  oSub: Subscription
  timerSub: Subscription
  //
  timerSource: any
  private errorText: string;
  offset = 0
  limit = 1000000000000
  // draggableIcon: boolean = false
  filter: FilterFixture = {
    id_geograph: -1,
    id_owner: -1,
    id_fixture_type: -1,
    id_substation: -1,
    id_mode: -1,

    id_contract: -1,
    id_node: -1
  }

  constructor(private zone: NgZone, private fixtureService: FixtureService, public router: Router, public route: ActivatedRoute) {
  }

  ngOnInit() {
    this.mapInit();

    //Timer refresh map: 0,10,20,...
    this.timerSource = timer(1000, 10000);
    this.timerRefreshMapSub()
  }

  ngOnDestroy() {
    if (this.oSub) {
      this.oSub.unsubscribe()
    }
    this.timerRefreshMapUbsub()
    if (this.map) {
      this.map.destroy();
    }
    if (this.eventWindow) {
      this.eventWindow.destroyEventWindow();
    }
  }

  //map initialization
  mapInit(): void {
    ymaps.ready().then(() => {
      this.map = new ymaps.Map('fixture_yamaps', {
        center: [60.0503, 30.4269],
        zoom: 17,
        controls: ['zoomControl']
      });

      let ButtonLayout = ymaps.templateLayoutFactory.createClass([
          `<div class="fr">
            <Button id="refreshMap"
              class="btn btn-small waves-effect waves-orange white blue-text"
              style="margin: 2px 2px 2px 2px;"
            >
              <i class="material-icons">refresh</i>
            </Button>
          </div>`
        ].join(''),
        {
          build: function () {
            ButtonLayout.superclass.build.call(this);
            $('#refreshMap').bind('click', this.refreshMap(this.getData().properties));
          },

          refreshMap: (function () {
            let mapComponent: FixturemapPageComponent = this;
            return function (properties: any) {
              return function () {
                mapComponent.refreshMap();
              }
            };
          }).call(this)

        },
        ),

        buttonIns = new ymaps.control.Button({
          data: {
            content: "Жмак-жмак-жмак",
            image: 'images/pen.png',
            title: "Жмак-жмак-жмак"
          },
          options: {
            layout: ButtonLayout,
            maxWidth: [170, 190, 220]
          }
        });

      this.map.controls.add(buttonIns, {
        right: 5,
        top: 5
      });

      //Refresh map
      this.getAll()
    });
  }

  //get a set of objects
  getAll() {
    const params = Object.assign({}, {
        offset: this.offset,
        limit: this.limit
      },
      this.filter)

    this.oSub = this.fixtureService.getAll(params).subscribe(fixtures => {
      this.fixtures = fixtures
      this.addItemsToMap()
    })
  }

  //refresh Map
  refreshMap() {
    this.getAll();
    //refresh grid
    // this.onRefreshGrid.emit()
  }

  //timer refresh map subscribe
  timerRefreshMapSub() {
    if (!this.timerSub) {
      this.timerSub = this.timerSource.subscribe(function () {
        let mapComponent: FixturemapPageComponent = this;
        return (val) => {
          mapComponent.refreshMap()
        }
      }.call(this));
    }
  }

  //timer refresh map unsubscribe
  timerRefreshMapUbsub() {
    if (this.timerSub) {
      this.timerSub.unsubscribe()
      this.timerSub = undefined
    }
  }

  //place the object from the set "getAll()" on the map
  addItemsToMap() {
    let collection = new ymaps.GeoObjectCollection(null, {});

    let BalloonContentLayout = ymaps.templateLayoutFactory.createClass(
      `<div class="fr">
        <jqxTooltip [position]="'bottom'" [name]="'comTooltip'"
                    [content]="'Вкл./выкл.'">
          <Button id="comItems"
            class="btn btn-small waves-effect waves-yellow orange blue-text"
            style="margin: 2px 2px 2px 2px;"
          >
            <i class="material-icons">lightbulb_outline</i>
          </Button>
        </jqxTooltip>
        
        <jqxTooltip [position]="'bottom'" [name]="'updTooltip'"
                    [content]="'Редактировать узел'">
          <Button id="updItems"
            class="btn btn-small waves-effect waves-orange white blue-text"
            style="margin: 2px 2px 2px 25px;"
          >
            <i class="material-icons">edit</i>
          </Button>
        </jqxTooltip>
        
        <jqxTooltip [position]="'bottom'" [name]="'delTooltip'"
                    [content]="'Удалить узел'">
          <Button id="delItems"
            class="btn btn-small waves-effect waves-orange white blue-text"
            style="margin: 2px 2px 2px 2px;"
          >
            <i class="material-icons">delete</i>
          </Button>
        </jqxTooltip>
      </div>
            
      <table class="table table-sm">
      <tbody>
      
      <!--<tr><th>Режимы рабочий/дежурный, %</th><td>{{properties.work_level}}/{{properties.standby_level}}</td></tr>-->
      <!--<tr><th>Время перехода 0-100/100-0, сек</th><td>{{properties.speed_zero_to_full}}/{{properties.speed_full_to_zero}}</td></tr>-->
      
      <tr><th>Рабочий режим, %</th><td>{{properties.work_level}}</td></tr>
      <tr><th>Дежурный режим, %</th><td>{{properties.standby_level}}</td></tr>
      <tr><th>Время перехода 0-100, сек</th><td>{{properties.speed_zero_to_full}}</td></tr>
      <tr><th>Время перехода 100-0, сек</th><td>{{properties.speed_full_to_zero}}</td></tr>
      
      <!--<tr><th>Договор</th><td>{{properties.code_contract}}</td></tr>-->
      <!--<tr><th>Географическое понятие</th><td>{{properties.code_geograph}}</td></tr>-->
      <!--<tr><th>Тип светильника</th><td>{{properties.code_fixture_type}}</td></tr>-->
      <!--<tr><th>Владелец</th><td>{{properties.code_owner}}</td></tr>-->
      <!--<tr><th>Широта</th><td>{{properties.n_coordinate}}</td></tr>-->
      <!--<tr><th>Долгота</th><td>{{properties.e_coordinate}}</td></tr>-->
       
      </tbody>
      </table>`, {
        build: (function () {
          let mapComponent: FixturemapPageComponent = this;
          return function () {

            //timer refresh map unsubscribe
            mapComponent.timerRefreshMapUbsub();

            BalloonContentLayout.superclass.build.call(this);
            $('#comItems').bind('click', this.comItems(this.getData().properties));
            $('#updItems').bind('click', this.updItems(this.getData().properties));
            $('#delItems').bind('click', this.delItems(this.getData().properties));
          }
        }).call(this),

        clear: (function () {
          let mapComponent: FixturemapPageComponent = this;
          return function () {

            //timer refresh map subscribe
            mapComponent.timerRefreshMapSub();

            BalloonContentLayout.superclass.clear.call(this);
          }
        }).call(this),

        comItems: (function () {
          let mapComponent: FixturemapPageComponent = this;
          return function (properties: any) {
            return function () {
              mapComponent.comWindow.positionWindow({x: 600, y: 90})
              mapComponent.comWindow.openWindow(properties._data.id_fixture, "ins")
            }
          };
        }).call(this),

        updItems: (function () {
          let mapComponent: FixturemapPageComponent = this;
          return function (properties: any) {
            return function () {
              mapComponent.editWindow.positionWindow({x: 600, y: 90})
              mapComponent.editWindow.openWindow(properties._data, properties._data.id_node, "upd")
            }
          };
        }).call(this),

        delItems: (function () {
          let mapComponent: FixturemapPageComponent = this;
          return function (properties: any) {
            return function () {
              mapComponent.warningEventWindow = "Удалить узел?"
              mapComponent.actionEventWindow = "del"
              mapComponent.eventWindow.openEventWindow()
              mapComponent.id_fixture_del = properties._data.id_fixture
            }
          };
        }).call(this)
      }
    );

    this.map.geoObjects.removeAll();
    this.map.geoObjects.add(collection);
    for (let fixture of this.fixtures) {
      let myGeoObject = new ymaps.GeoObject(
        {
          //description geometry
          geometry: {
            type: "Point",
            coordinates: [fixture.n_coordinate, fixture.e_coordinate]
          },
          //properties
          properties: {
            // Content of icon
            iconContent: fixture.id_fixture,
            id_node: fixture.id_node,
            id_fixture: fixture.id_fixture,
            id_geograph: fixture.id_geograph,
            id_fixture_type: fixture.id_fixture_type,
            id_contract: fixture.id_contract,
            id_installer: fixture.id_installer,
            id_substation: fixture.id_substation,
            id_height_type: fixture.id_height_type,
            id_owner: fixture.id_owner,

            code_contract: fixture.code_contract,
            code_geograph: fixture.code_geograph,
            code_fixture_type: fixture.code_fixture_type,
            code_owner: fixture.code_owner,
            n_coordinate: fixture.n_coordinate,
            e_coordinate: fixture.e_coordinate,

            flg_chief: fixture.flg_chief,
            price: fixture.price,
            comments: fixture.comments,

            work_level: fixture.work_level,
            standby_level: fixture.standby_level,
            speed_zero_to_full: fixture.speed_zero_to_full,
            speed_full_to_zero: fixture.speed_full_to_zero
          }
        },
        {
          //options
          balloonContentLayout: BalloonContentLayout,
          balloonPanelMaxMapArea: 0,
          //icon will be change width
          preset: 'islands#circleIcon',
          iconColor: fixture.flg_light ? '#FFCF40'
            : '#000000'
        })

      collection.add(myGeoObject);
    }
  }

  //untie the fixture from the map
  delItem(id: number) {
    this.clearErrorText();

    if (+id >= 0) {
      this.fixtureService.del(+id).subscribe(
        response => {
          MaterialService.toast(response.message)
        },
        response => MaterialService.toast(response.error.message),
        () => {
          //hide event window
          this.eventWindow.hideEventWindow();
          //refresh map
          this.refreshMap();
          //refresh grid
          this.onRefreshGrid.emit()
        }
      )
    }
  }

  //event window
  okEvenwinBtn() {
    if (this.actionEventWindow === "del") {
      this.delItem(this.id_fixture_del)
    }
  }

  //save result edit window
  saveEditwinBtn() {
    //refresh map
    this.refreshMap();
    //refresh grid
    // this.onRefreshGrid.emit()
  }

  //save result com window
  saveComwinBtn() {

  }

  //error message
  errorHandler(response: any) {
    this.zone.run(() => {
      this.errorText = response.json().error;
    });
  }

  setErrorText(errorText: string) {
    this.zone.run(() => {
      this.errorText = errorText;
    });
  }

  clearErrorText() {
    this.zone.run(() => {
      this.errorText = '';
    });
  }

}
