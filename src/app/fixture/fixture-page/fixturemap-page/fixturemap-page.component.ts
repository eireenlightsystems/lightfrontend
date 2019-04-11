import {AfterViewInit, Component, EventEmitter, Input, NgZone, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable, Subscription, timer} from 'rxjs';
import {MaterialService} from '../../../shared/classes/material.service';
import {isUndefined} from 'util';

import {
  Contract, FilterFixture, FilterFixtureGroup, FixtureGroup,
  EquipmentType,
  HeightType,
  Installer,
  Substation
} from '../../../shared/interfaces';
import {FixtureService} from '../../../shared/services/fixture/fixture.service';
import {EventWindowComponent} from '../../../shared/components/event-window/event-window.component';
import {Fixture} from 'src/app/shared/models/fixture';
import {FixtureeditFormComponent} from '../fixture-masterdetails-page/fixturelist-page/fixtureedit-form/fixtureedit-form.component';
import {FixturecomeditFormComponent} from '../fixture-masterdetails-page/fixturecomlist-page/fixturecomedit-form/fixturecomedit-form.component';
import {FixtureGroupService} from '../../../shared/services/fixture/fixtureGroup.service';
import {FixturecomeditSwitchoffFormComponent} from '../fixture-masterdetails-page/fixturecomlist-page/fixturecomedit-switchoff-form/fixturecomedit-switchoff-form.component';


declare var ymaps: any;


@Component({
  selector: 'app-fixturemap-page',
  templateUrl: './fixturemap-page.component.html',
  styleUrls: ['./fixturemap-page.component.css']
})
export class FixturemapPageComponent implements OnInit, OnDestroy, AfterViewInit {

  // variables from master component
  @Input() fixtureTypes: EquipmentType[];
  @Input() substations: Substation[];
  @Input() contractFixtures: Contract[];
  @Input() installers: Installer[];
  @Input() heightTypes: HeightType[];

  // determine the functions that need to be performed in the parent component
  @Output() onRefreshGrid = new EventEmitter();

  // define variables - link to view objects
  @ViewChild('editWindow') editWindow: FixtureeditFormComponent;
  @ViewChild('editSwitchOnWindow') editSwitchOnWindow: FixturecomeditFormComponent;
  @ViewChild('editSwitchOffWindow') editSwitchOffWindow: FixturecomeditSwitchoffFormComponent;
  @ViewChild('eventWindow') eventWindow: EventWindowComponent;
  @ViewChild('warningEventWindow') warningEventWindow: string;

  // other variables
  nCoord = 60.0503;
  eCoord = 30.4269;

  fixtures: Fixture[];
  fixture: Fixture = new Fixture;
  myMap: any;
  //
  oSub: Subscription;
  oSubFixtureGroups: Subscription;
  timerSub: Subscription;
  //
  timerSource: any;
  private errorText: string;
  offset = 0;
  limit = 1000000000000;
  //
  fixtureGroups: FixtureGroup[] = [];
  selectFixtureGroupId = 0;
  filterFixtureGroups: FilterFixtureGroup = {
    ownerId: '',
    fixtureGroupTypeId: '',
  };

  constructor(private zone: NgZone,
              public router: Router,
              public route: ActivatedRoute,
              private fixtureGroupService: FixtureGroupService,
              private fixtureService: FixtureService) {
  }

  ngOnInit() {
    // this.mapInit();

    // get all fixtures
    this.getAll();

    // // get fixture groups
    // this.getFixtureGroups();

    // Timer refresh map: 0,10,20,...
    this.timerSource = timer(1000, 10000);
    this.timerRefreshMapSub();
  }

  ngAfterViewInit() {
    this.mapInit();
  }

  ngOnDestroy() {
    if (this.oSub) {
      this.oSub.unsubscribe();
    }
    if (this.oSubFixtureGroups) {
      this.oSubFixtureGroups.unsubscribe();
    }
    this.timerRefreshMapUbsub();
    if (this.myMap) {
      this.myMap.destroy();
    }
    if (this.eventWindow) {
      this.eventWindow.destroyEventWindow();
    }
  }

  // get fixture groups
  getFixtureGroups() {
    this.oSubFixtureGroups = this.fixtureGroupService.getAll(this.filterFixtureGroups).subscribe(fixtureGroups => {
      this.fixtureGroups = fixtureGroups;
      // init list box fixture groups
      this.listBoxInit();
    });
  }

  // get nodes ib gateway group
  getFixturesInGroup(fixtureGroupId: number) {
    this.oSub = this.fixtureService.getFixtureInGroup(fixtureGroupId.toString()).subscribe(fixtures => {
      this.fixtures = fixtures;
        this.addItemsToMap();
        this.selectFixtureGroupId = fixtureGroupId;
    });
  }

  // get a set of objects
  getAll() {
    this.oSub = this.fixtureService.getAll({}).subscribe(fixtures => {
      this.fixtures = fixtures;
      this.addItemsToMap();
    });
  }

  // refresh Map
  refreshMap() {
    if (this.selectFixtureGroupId === 0) {
      this.getAll();
    } else {
      this.getFixturesInGroup(this.selectFixtureGroupId);
    }
  }

  // map initialization
  mapInit(): void {
    ymaps.ready().then(() => {
      this.myMap = new ymaps.Map('fixture_yamaps', {
        center: [this.nCoord, this.eCoord],
        zoom: 17,
        controls: ['zoomControl']
      });
      // get fixture groups
      this.getFixtureGroups();
    });
  }

  // buttons on the map init
  buttonsInit() {
    const ButtonLayout = ymaps.templateLayoutFactory.createClass([
        `<div class="fr">
            <Div id="refreshMap"
              class="btn btn-small waves-effect waves-orange white blue-text"
            >
              <a><i class='material-icons'>refresh</i>  все светильники</a>
            </Div>
          
            <Button id="switchOnBtn"
              class="button_margin btn btn-small waves-effect waves-orange white blue-text"
              style="margin-left: 10px"
            >
              <i class="material-icons" style="color: orange">highlight</i>
            </Button>
            
            <Button id="switchOffBtn"
              class="button_margin btn btn-small waves-effect waves-orange white blue-text"
              style="margin-left: 10px"
            >
              <i class="material-icons" >highlight</i>
            </Button>
          </div>
        `
      ].join(''),
      {
        build: function () {
          ButtonLayout.superclass.build.call(this);
          $('#refreshMap').bind('click', this.refreshMap(this.getData().properties));
          $('#switchOnBtn').bind('click', this.switchOnBtn(this.getData().properties));
          $('#switchOffBtn').bind('click', this.switchOffBtn(this.getData().properties));
        },

        refreshMap: (function () {
          const mapComponent: FixturemapPageComponent = this;
          return function (properties: any) {
            return function () {
              mapComponent.selectFixtureGroupId = 0;
              mapComponent.refreshMap();
            };
          };
        }).call(this),

        switchOnBtn: (function () {
          const mapComponent: FixturemapPageComponent = this;
          return function (properties: any) {
            return function () {
              const fixtureIds: number[] = [];
              for (var i = 0; i < mapComponent.fixtures.length; i++) {
                fixtureIds[i] = +mapComponent.fixtures[i].fixtureId;
              }
              mapComponent.editSwitchOnWindow.positionWindow({x: 600, y: 90});
              mapComponent.editSwitchOnWindow.openWindow(fixtureIds, 'ins');
            };
          };
        }).call(this),

        switchOffBtn: (function () {
          const mapComponent: FixturemapPageComponent = this;
          return function (properties: any) {
            return function () {
              const fixtureIds: number[] = [];
              for (var i = 0; i < mapComponent.fixtures.length; i++) {
                fixtureIds[i] = +mapComponent.fixtures[i].fixtureId;
              }
              mapComponent.editSwitchOffWindow.positionWindow({x: 600, y: 90});
              mapComponent.editSwitchOffWindow.openWindow(fixtureIds, 'ins');
            };
          };
        }).call(this)
      },
      ),

      buttonIns = new ymaps.control.Button({
        data: {
          content: 'Жмак-жмак-жмак',
          image: 'images/pen.png',
          title: 'Жмак-жмак-жмак'
        },
        options: {
          layout: ButtonLayout,
          maxWidth: [170, 190, 220]
        }
      });

    this.myMap.controls.add(buttonIns, {
      right: 1,
      top: 1
    });
  }

  listBoxInit() {
    // Создадим собственный макет выпадающего списка.
    const ListBoxLayout = ymaps.templateLayoutFactory.createClass(
      // "<ul id='my-listbox' class='dropdown-content' style='display: {% if state.expanded %}block{% else %}none{% endif %};' role='menu' aria-labelledby='dropdownMenu'>\n" +
      // "</ul>"
      // +
      // "<a id='my-listbox-header' class='dropdown-trigger' data-target='my-listbox'>{{data.title}}<i class='material-icons right'>arrow_drop_down</i></a>"
      // +
      '<button id=\'my-listbox-header\' class=\'dropdown-toggle btn btn-small waves-effect waves-orange white blue-text\' data-toggle=\'dropdown\'>' +
      '{{data.title}} <span class=\'caret\'></span>' +
      '</button>' +
      // Этот элемент будет служить контейнером для элементов списка.
      // В зависимости от того, свернут или развернут список, этот контейнер будет
      // скрываться или показываться вместе с дочерними элементами.
      '<ul id=\'my-listbox\'' +
      ' class=\'dropdown-menu\' role=\'menu\' aria-labelledby=\'dropdownMenu\'' +
      ' style=\'display: {% if state.expanded %}block{% else %}none{% endif %};\'></ul>'
      ,
      {
        build: function () {
          // Вызываем метод build родительского класса перед выполнением
          // дополнительных действий.
          ListBoxLayout.superclass.build.call(this);

          this.childContainerElement = $('#my-listbox').get(0);
          // Генерируем специальное событие, оповещающее элемент управления
          // о смене контейнера дочерних элементов.
          this.events.fire('childcontainerchange', {
            newChildContainerElement: this.childContainerElement,
            oldChildContainerElement: null
          });
        },

        // Переопределяем интерфейсный метод, возвращающий ссылку на
        // контейнер дочерних элементов.
        getChildContainerElement: function () {
          return this.childContainerElement;
        },

        clear: function () {
          // Заставим элемент управления перед очисткой макета
          // откреплять дочерние элементы от родительского.
          // Это защитит нас от неожиданных ошибок,
          // связанных с уничтожением dom-элементов в ранних версиях ie.
          this.events.fire('childcontainerchange', {
            newChildContainerElement: null,
            oldChildContainerElement: this.childContainerElement
          });
          this.childContainerElement = null;
          // Вызываем метод clear родительского класса после выполнения
          // дополнительных действий.
          ListBoxLayout.superclass.clear.call(this);
        }
      }),

      // Также создадим макет для отдельного элемента списка.
      ListBoxItemLayout = ymaps.templateLayoutFactory.createClass(
        '<li><a class=\'waves-effect waves-orange white blue-text\'><i class=\'material-icons\'>lightbulb_outline</i> {{data.content}}</a></li>'
      ),

      // Создадим 2 пункта выпадающего списка
      listBoxItems = this.getlistBoxItemGroups(),

      // Теперь создадим список, содержащий 2 пункта.
      listBox = new ymaps.control.ListBox({
        items: listBoxItems,
        data: {
          title: 'Выберите группу светильников'
        },
        options: {
          // С помощью опций можно задать как макет непосредственно для списка,
          layout: ListBoxLayout,
          // так и макет для дочерних элементов списка. Для задания опций дочерних
          // элементов через родительский элемент необходимо добавлять префикс
          // 'item' к названиям опций.
          itemLayout: ListBoxItemLayout
        }
      });

    listBox.events.add('click',
      (function () {
        // var map = this.myMap;
        const mapComponent: FixturemapPageComponent = this;
        return function (e) {
          // Получаем ссылку на объект, по которому кликнули.
          // События элементов списка пропагируются
          // и их можно слушать на родительском элементе.
          const item = e.get('target');
          // Клик на заголовке выпадающего списка обрабатывать не надо.
          if (item != listBox) {
            mapComponent.myMap.setCenter(item.data.get('center'), item.data.get('zoom'));
            mapComponent.getFixturesInGroup(item.data.get('fixtureGroupId'));
          }
        };
      }).call(this)
    );
    this.myMap.controls.add(listBox, {float: 'left'});

    // buttons on the map init
    this.buttonsInit();
  }

  // get gateway groups for listBox
  getlistBoxItemGroups(): any {
    const listBoxItemGroups: any[] = [];
    for (let i = 0; i < this.fixtureGroups.length; i++) {
      listBoxItemGroups[i] = new ymaps.control.ListBoxItem({
        data: {
          content: this.fixtureGroups[i].fixtureGroupName,
          center: [+this.fixtureGroups[i].n_coordinate === 0 ? this.nCoord : this.fixtureGroups[i].n_coordinate, +this.fixtureGroups[i].e_coordinate === 0 ? this.eCoord : this.fixtureGroups[i].e_coordinate],
          zoom: 17,
          fixtureGroupId: this.fixtureGroups[i].fixtureGroupId
        }
      });
    }
    return listBoxItemGroups;
  }

  // place the object from the set "getAll()" on the map
  addItemsToMap() {
    const collection = new ymaps.GeoObjectCollection(null, {});

    const BalloonContentLayout = ymaps.templateLayoutFactory.createClass(
      `<div class="fr">
        <jqxTooltip [position]="'bottom'" [name]="'comTooltip'"
                    [content]="'Вкл./выкл.'">
          <Button id="comItems"
            class="btn btn-small waves-effect waves-orange white blue-text"
            style="margin: 2px 2px 2px 2px;"
          >
            <i class="material-icons" style="color: orange">highlight</i>
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
        
      </div>
            
      <table class="table table-sm">
      <tbody>
      
      <!--<tr><th>Режимы рабочий/дежурный, %</th><td>{{properties.work_level}}/{{properties.standby_level}}</td></tr>-->
      <!--<tr><th>Время перехода 0-100/100-0, сек</th><td>{{properties.speed_zero_to_full}}/{{properties.speed_full_to_zero}}</td></tr>-->
      
      <tr><th>Рабочий режим, %</th><td>{{properties.fixture.work_level}}</td></tr>
      <tr><th>Дежурный режим, %</th><td>{{properties.fixture.standby_level}}</td></tr>
      <tr><th>Время перехода 0-100, сек</th><td>{{properties.fixture.speed_zero_to_full}}</td></tr>
      <tr><th>Время перехода 100-0, сек</th><td>{{properties.fixture.speed_full_to_zero}}</td></tr>
      
      <!--<tr><th>Договор</th><td>{{properties.code_contract}}</td></tr>-->
      <!--<tr><th>Географическое понятие</th><td>{{properties.code_geograph}}</td></tr>-->
      <!--<tr><th>Тип светильника</th><td>{{properties.code_fixture_type}}</td></tr>-->
      <!--<tr><th>Владелец</th><td>{{properties.code_owner}}</td></tr>-->
      <!--<tr><th>Широта</th><td>{{properties.n_coordinate}}</td></tr>-->
      <!--<tr><th>Долгота</th><td>{{properties.e_coordinate}}</td></tr>-->
       
      </tbody>
      </table>`, {
        build: (function () {
          const mapComponent: FixturemapPageComponent = this;
          return function () {

            // timer refresh map unsubscribe
            mapComponent.timerRefreshMapUbsub();

            BalloonContentLayout.superclass.build.call(this);
            $('#comItems').bind('click', this.comItems(this.getData().properties));
            $('#updItems').bind('click', this.updItems(this.getData().properties));
          };
        }).call(this),

        clear: (function () {
          const mapComponent: FixturemapPageComponent = this;
          return function () {

            // timer refresh map subscribe
            mapComponent.timerRefreshMapSub();

            BalloonContentLayout.superclass.clear.call(this);
          };
        }).call(this),

        comItems: (function () {
          const mapComponent: FixturemapPageComponent = this;
          return function (properties: any) {
            return function () {
              const fixtureIds: number[] = [];
              fixtureIds[0] = properties._data.fixture.fixtureId;
              mapComponent.editSwitchOnWindow.positionWindow({x: 600, y: 90});
              mapComponent.editSwitchOnWindow.openWindow(fixtureIds, 'ins');
            };
          };
        }).call(this),

        updItems: (function () {
          const mapComponent: FixturemapPageComponent = this;
          return function (properties: any) {
            return function () {
              mapComponent.editWindow.positionWindow({x: 600, y: 90});
              mapComponent.editWindow.openWindow(properties._data.fixture, properties._data.fixture.nodeId, 'upd');
            };
          };
        }).call(this),

        // delItems: (function () {
        //   const mapComponent: FixturemapPageComponent = this;
        //   return function (properties: any) {
        //     return function () {
        //       mapComponent.warningEventWindow = 'Удалить светильник?';
        //       mapComponent.actionEventWindow = 'del';
        //       mapComponent.eventWindow.openEventWindow();
        //       mapComponent.id_fixture_del = properties._data.fixtureId;
        //     };
        //   };
        // }).call(this)
      }
    );

    this.myMap.geoObjects.removeAll();
    this.myMap.geoObjects.add(collection);
    for (const fixture of this.fixtures) {
      const myGeoObject = new ymaps.GeoObject(
        {
          // description geometry
          geometry: {
            type: 'Point',
            coordinates: [fixture.n_coordinate, fixture.e_coordinate]
          },
          // properties
          properties: {
            // Content of icon
            iconContent: fixture.fixtureId,
            fixture: fixture
          }
        },
        {
          // options
          balloonContentLayout: BalloonContentLayout,
          balloonPanelMaxMapArea: 0,
          // icon will be change width
          preset: 'islands#circleIcon',
          iconColor: fixture.flgLight ? '#FFCF40'
            : '#000000'
        });

      collection.add(myGeoObject);
    }
  }

  // event window
  okEvenwinBtn() {

  }

  // save result edit window
  saveEditwinBtn() {
    // refresh map
    this.refreshMap();
  }

  // save result com window
  saveComwinBtn() {

  }

  // timer refresh map subscribe
  timerRefreshMapSub() {
    if (!this.timerSub) {
      this.timerSub = this.timerSource.subscribe(function () {
        const mapComponent: FixturemapPageComponent = this;
        return (val) => {
          mapComponent.refreshMap();
        };
      }.call(this));
    }
  }

  // timer refresh map unsubscribe
  timerRefreshMapUbsub() {
    if (this.timerSub) {
      this.timerSub.unsubscribe();
      this.timerSub = undefined;
    }
  }

  saveSwitchOnEditwinBtn() {
    this.refreshMap();
  }

  saveEditSwitchOffwinBtn() {
    this.refreshMap();
  }

}
