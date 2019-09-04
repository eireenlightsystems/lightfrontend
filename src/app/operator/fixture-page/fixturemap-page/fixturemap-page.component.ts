// angular lib
import {AfterViewInit, Component, EventEmitter, Input, NgZone, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription, timer} from 'rxjs';
import {isUndefined} from 'util';
import {MatSnackBar} from '@angular/material/snack-bar';
import {TranslateService} from '@ngx-translate/core';
// jqwidgets
// app interfaces
import {
  Fixture, Contract, EquipmentType, HeightType, Installer, Substation,
  FilterFixtureGroup, FixtureGroup, SettingWinForEditForm, SourceForEditForm, NavItem
} from '../../../shared/interfaces';
// app services
import {FixtureService} from '../../../shared/services/fixture/fixture.service';
import {FixtureGroupService} from '../../../shared/services/fixture/fixtureGroup.service';
// app components
import {EventWindowComponent} from '../../../shared/components/event-window/event-window.component';
import {
  FixturecomeditFormComponent
} from '../fixture-masterdetails-page/fixturecomlist-page/fixturecomedit-form/fixturecomedit-form.component';
import {
  FixturecomeditSwitchoffFormComponent
} from '../fixture-masterdetails-page/fixturecomlist-page/fixturecomedit-switchoff-form/fixturecomedit-switchoff-form.component';
import {EditFormComponent} from '../../../shared/components/edit-form/edit-form.component';


declare var ymaps: any;


@Component({
  selector: 'app-fixturemap-page',
  templateUrl: './fixturemap-page.component.html',
  styleUrls: ['./fixturemap-page.component.css']
})
export class FixturemapPageComponent implements OnInit, OnDestroy, AfterViewInit {

  // variables from parent component
  @Input() siteMap: NavItem[];
  @Input() fixtureTypes: EquipmentType[];
  @Input() substations: Substation[];
  @Input() contractFixtures: Contract[];
  @Input() installers: Installer[];
  @Input() heightTypes: HeightType[];

  // determine the functions that need to be performed in the parent component
  @Output() onRefreshGrid = new EventEmitter();

  // define variables - link to view objects
  @ViewChild('editForm', {static: false}) editForm: EditFormComponent;
  @ViewChild('editFormSwitchOn', {static: false}) editFormSwitchOn: FixturecomeditFormComponent;
  @ViewChild('editFormSwitchOff', {static: false}) editFormSwitchOff: FixturecomeditSwitchoffFormComponent;
  @ViewChild('eventWindow', {static: false}) eventWindow: EventWindowComponent;
  @ViewChild('warningEventWindow', {static: false}) warningEventWindow: string;

  // other variables
  myMap: any;
  nCoord = 60.0503;
  eCoord = 30.4269;
  zoom = 17;
  fixtures: Fixture[];
  saveFixture: Fixture = new Fixture;
  selectFixture: Fixture = new Fixture;
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
  // edit form
  settingWinForEditForm: SettingWinForEditForm;
  sourceForEditForm: SourceForEditForm[];
  sourceForEditFormEng: SourceForEditForm[];
  isEditFormInit = false;
  isEditFormSwitchOnInit = false;
  isEditFormSwitchOffInit = false;
  fixtureIds: number[] = [];
  typeEditWindow = '';

  constructor(private _snackBar: MatSnackBar,
              private zone: NgZone,
              public router: Router,
              public route: ActivatedRoute,
              // service
              public translate: TranslateService,
              private fixtureGroupService: FixtureGroupService,
              private fixtureService: FixtureService) {
  }

  ngOnInit() {
    // definde edit form
    this.settingWinForEditForm = {
      code: 'editFormFixture',
      name: 'Add / edit fixtures',
      theme: 'material',
      isModal: true,
      modalOpacity: 0.3,
      width: 450,
      maxWidth: 500,
      minWidth: 460,
      height: 550,
      maxHeight: 550,
      minHeight: 550,
      coordX: 500,
      coordY: 65
    };
    this.sourceForEditForm = [
      {
        nameField: 'contractFixtures',
        type: 'jqxComboBox',
        source: this.contractFixtures,
        theme: 'material',
        width: '285',
        height: '20',
        placeHolder: 'Договор:',
        displayMember: 'code',
        valueMember: 'id',
        selectedIndex: null,
        selectId: '',
        selectCode: '',
        selectName: ''
      },
      {
        nameField: 'fixtureTypes',
        type: 'jqxComboBox',
        source: this.fixtureTypes,
        theme: 'material',
        width: '285',
        height: '20',
        placeHolder: 'Тип светильника:',
        displayMember: 'code',
        valueMember: 'id',
        selectedIndex: null,
        selectId: '',
        selectCode: '',
        selectName: ''
      },
      {
        nameField: 'substations',
        type: 'jqxComboBox',
        source: this.substations,
        theme: 'material',
        width: '285',
        height: '20',
        placeHolder: 'Подстанция:',
        displayMember: 'code',
        valueMember: 'id',
        selectedIndex: null,
        selectId: '',
        selectCode: '',
        selectName: ''
      },
      {
        nameField: 'installers',
        type: 'jqxComboBox',
        source: this.installers,
        theme: 'material',
        width: '285',
        height: '20',
        placeHolder: 'Установщик:',
        displayMember: 'code',
        valueMember: 'id',
        selectedIndex: null,
        selectId: '',
        selectCode: '',
        selectName: ''
      },
      {
        nameField: 'heightTypes',
        type: 'jqxComboBox',
        source: this.heightTypes,
        theme: 'material',
        width: '285',
        height: '20',
        placeHolder: 'Тип высоты:',
        displayMember: 'code',
        valueMember: 'id',
        selectedIndex: null,
        selectId: '',
        selectCode: '',
        selectName: ''
      },
      {
        nameField: 'serialNumber',
        type: 'jqxTextArea',
        source: [],
        theme: 'material',
        width: '280',
        height: '20',
        placeHolder: 'Серийный номер:',
        displayMember: 'code',
        valueMember: 'id',
        selectedIndex: null,
        selectId: '',
        selectCode: '',
        selectName: ''
      },
      {
        nameField: 'comment',
        type: 'jqxTextArea',
        source: [],
        theme: 'material',
        width: '280',
        height: '100',
        placeHolder: 'Комментарий:',
        displayMember: 'code',
        valueMember: 'id',
        selectedIndex: null,
        selectId: '',
        selectCode: '',
        selectName: ''
      }
    ];
    this.sourceForEditFormEng = [
      {
        nameField: 'contractFixtures',
        type: 'jqxComboBox',
        source: this.contractFixtures,
        theme: 'material',
        width: '285',
        height: '20',
        placeHolder: 'Contract:',
        displayMember: 'code',
        valueMember: 'id',
        selectedIndex: null,
        selectId: '',
        selectCode: '',
        selectName: ''
      },
      {
        nameField: 'fixtureTypes',
        type: 'jqxComboBox',
        source: this.fixtureTypes,
        theme: 'material',
        width: '285',
        height: '20',
        placeHolder: 'Fixture type:',
        displayMember: 'code',
        valueMember: 'id',
        selectedIndex: null,
        selectId: '',
        selectCode: '',
        selectName: ''
      },
      {
        nameField: 'substations',
        type: 'jqxComboBox',
        source: this.substations,
        theme: 'material',
        width: '285',
        height: '20',
        placeHolder: 'Substation:',
        displayMember: 'code',
        valueMember: 'id',
        selectedIndex: null,
        selectId: '',
        selectCode: '',
        selectName: ''
      },
      {
        nameField: 'installers',
        type: 'jqxComboBox',
        source: this.installers,
        theme: 'material',
        width: '285',
        height: '20',
        placeHolder: 'Installer:',
        displayMember: 'code',
        valueMember: 'id',
        selectedIndex: null,
        selectId: '',
        selectCode: '',
        selectName: ''
      },
      {
        nameField: 'heightTypes',
        type: 'jqxComboBox',
        source: this.heightTypes,
        theme: 'material',
        width: '285',
        height: '20',
        placeHolder: 'Height:',
        displayMember: 'code',
        valueMember: 'id',
        selectedIndex: null,
        selectId: '',
        selectCode: '',
        selectName: ''
      },
      {
        nameField: 'serialNumber',
        type: 'jqxTextArea',
        source: [],
        theme: 'material',
        width: '280',
        height: '20',
        placeHolder: 'Serial number:',
        displayMember: 'code',
        valueMember: 'id',
        selectedIndex: null,
        selectId: '',
        selectCode: '',
        selectName: ''
      },
      {
        nameField: 'comment',
        type: 'jqxTextArea',
        source: [],
        theme: 'material',
        width: '280',
        height: '100',
        placeHolder: 'Comments:',
        displayMember: 'code',
        valueMember: 'id',
        selectedIndex: null,
        selectId: '',
        selectCode: '',
        selectName: ''
      }
    ];

    // get all fixtures
    this.getAll();

    // Timer refresh map: 0,10,20,...
    this.timerSource = timer(1000, 10000);
    this.timerRefreshMapSub();
  }

  ngAfterViewInit() {
    // init map
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
      if (!isUndefined(this.myMap)) {
        // init list box fixture groups
        this.listBoxInit();
      }
    });
  }

  // get nodes in gateway group
  getFixturesInGroup(fixtureGroupId: number) {
    this.oSub = this.fixtureService.getFixtureInGroup(fixtureGroupId.toString()).subscribe(fixtures => {
      this.fixtures = fixtures;
      this.selectFixtureGroupId = fixtureGroupId;
      if (!isUndefined(this.myMap)) {
        // place the objects
        this.addItemsToMap();
      }
    });
  }

  // get a set of objects
  getAll() {
    this.oSub = this.fixtureService.getAll({}).subscribe(fixtures => {
      this.fixtures = fixtures;
      if (!isUndefined(this.myMap)) {
        this.myMap.setCenter([fixtures[0].n_coordinate, fixtures[0].e_coordinate], this.zoom);
        // place the objects
        this.addItemsToMap();
      }
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
        zoom: this.zoom,
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
              class="btn btn-small waves-effect waves-yellow white blue-text"
            >
              <a><i class='material-icons'>refresh</i></a>
            </Div>
            <Button id="switchOnBtn"
              class="button_margin btn btn-small waves-effect waves-yellow white blue-text"
              style="margin-left: 10px"
            >
              <i class="material-icons" style="color: orange">highlight</i>
            </Button>
            <Button id="switchOffBtn"
              class="button_margin btn btn-small waves-effect waves-yellow white blue-text"
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
              mapComponent.fixtureIds = [];
              for (let i = 0; i < mapComponent.fixtures.length; i++) {
                mapComponent.fixtureIds[i] = +mapComponent.fixtures[i].fixtureId;
              }
              mapComponent.isEditFormSwitchOnInit = true;
            };
          };
        }).call(this),

        switchOffBtn: (function () {
          const mapComponent: FixturemapPageComponent = this;
          return function (properties: any) {
            return function () {
              mapComponent.fixtureIds = [];
              for (let i = 0; i < mapComponent.fixtures.length; i++) {
                mapComponent.fixtureIds[i] = +mapComponent.fixtures[i].fixtureId;
              }
              mapComponent.isEditFormSwitchOffInit = true;
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
      '<button id=\'fixture-listbox-header\' class=\'dropdown-toggle btn btn-small waves-effect waves-yellow white blue-text\' data-toggle=\'dropdown\'>' +
      '{{data.title}} <span class=\'caret\'></span>' +
      '</button>' +
      // Этот элемент будет служить контейнером для элементов списка.
      // В зависимости от того, свернут или развернут список, этот контейнер будет
      // скрываться или показываться вместе с дочерними элементами.
      '<ul id=\'fixture-listbox\'' +
      ' class=\'dropdown-menu\' role=\'menu\' aria-labelledby=\'dropdownMenu\'' +
      ' style=\'display: {% if state.expanded %}block{% else %}none{% endif %};\'></ul>'
      ,
      {
        build: function () {
          // Вызываем метод build родительского класса перед выполнением
          // дополнительных действий.
          ListBoxLayout.superclass.build.call(this);
          this.childContainerElement = $('#fixture-listbox').get(0);
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
        '<li><a class=\'waves-effect waves-yellow white blue-text\'>' +
        '<i class=\'material-icons\'>lightbulb_outline</i> {{data.content}}</a></li>'
      ),
      // Создадим 2 пункта выпадающего списка
      listBoxItems = this.getlistBoxItemGroups(),
      // Теперь создадим список, содержащий 2 пункта.
      listBox = new ymaps.control.ListBox({
        items: listBoxItems,
        data: {
          title: this.translate.instant('site.menu.operator.fixture-page.fixturemap-page.select')
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
          center: [+this.fixtureGroups[i].n_coordinate === 0
            ? this.nCoord
            : this.fixtureGroups[i].n_coordinate, +this.fixtureGroups[i].e_coordinate === 0
            ? this.eCoord
            : this.fixtureGroups[i].e_coordinate],
          zoom: 17,
          fixtureGroupId: this.fixtureGroups[i].fixtureGroupId
        }
      });
    }
    return listBoxItemGroups;
  }

  // place the objects from the set "getAll()" on the map
  addItemsToMap() {
    const collection = new ymaps.GeoObjectCollection(null, {});
    const BalloonContentLayout = ymaps.templateLayoutFactory.createClass(
      this.translate.currentLang === 'ru'
        ?
        `<div class="fr">
        <button id="comItems"
          class="btn btn-small waves-effect waves-yellow white blue-text"
          style="margin: 2px 2px 2px 2px;"
        >
          <i class="material-icons" style="color: orange">highlight</i>
        </button>
        <button id="updItems"
          class="btn btn-small waves-effect waves-yellow white blue-text"
          style="margin: 2px 2px 2px 25px;"
        >
          <i class="material-icons">edit</i>
        </button>
      </div>
      <table class="table table-sm">
        <tbody>
          <!--<tr><th>Режимы рабочий/дежурный, %</th><td>{{properties.work_level}}/{{properties.standby_level}}</td></tr>-->
          <!--<tr>
          <th>Время перехода 0-100/100-0, сек</th>
          <td>{{properties.speed_zero_to_full}}/{{properties.speed_full_to_zero}}</td>
          </tr>-->
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
      </table>`
        :
        `<div class="fr">
        <button id="comItems"
          class="btn btn-small waves-effect waves-yellow white blue-text"
          style="margin: 2px 2px 2px 2px;"
        >
          <i class="material-icons" style="color: orange">highlight</i>
        </button>
        <button id="updItems"
          class="btn btn-small waves-effect waves-yellow white blue-text"
          style="margin: 2px 2px 2px 25px;"
        >
          <i class="material-icons">edit</i>
        </button>
      </div>
      <table class="table table-sm">
        <tbody>
          <tr><th>Work mode, %</th><td>{{properties.fixture.work_level}}</td></tr>
          <tr><th>Standby mode, %</th><td>{{properties.fixture.standby_level}}</td></tr>
          <tr><th>Transition time 0-100, сек</th><td>{{properties.fixture.speed_zero_to_full}}</td></tr>
          <tr><th>Transition time 100-0, сек</th><td>{{properties.fixture.speed_full_to_zero}}</td></tr>
        </tbody>
      </table>`
      ,
      {
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
              mapComponent.fixtureIds = [];
              mapComponent.fixtureIds[0] = properties._data.fixture.fixtureId;
              mapComponent.isEditFormSwitchOnInit = true;
            };
          };
        }).call(this),
        updItems: (function () {
          const mapComponent: FixturemapPageComponent = this;
          return function (properties: any) {
            return function () {
              mapComponent.selectFixture = properties._data.fixture;
              mapComponent.typeEditWindow = 'upd';
              mapComponent.getSourceForEditForm();
              mapComponent.isEditFormInit = true;
            };
          };
        }).call(this),
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

  // EDIT FORM

  saveEditFormBtn() {
    let selectObject: Fixture = new Fixture();
    selectObject = this.selectFixture;
    for (let i = 0; i < this.editForm.sourceForEditForm.length; i++) {
      switch (this.editForm.sourceForEditForm[i].nameField) {
        case 'contractFixtures':
          selectObject.contractId = +this.editForm.sourceForEditForm[i].selectId;
          selectObject.contractCode = this.editForm.sourceForEditForm[i].selectCode;
          break;
        case 'fixtureTypes':
          selectObject.fixtureTypeId = +this.editForm.sourceForEditForm[i].selectId;
          selectObject.fixtureTypeCode = this.editForm.sourceForEditForm[i].selectCode;
          break;
        case 'substations':
          selectObject.substationId = +this.editForm.sourceForEditForm[i].selectId;
          selectObject.substationCode = this.editForm.sourceForEditForm[i].selectCode;
          break;
        case 'installers':
          selectObject.installerId = +this.editForm.sourceForEditForm[i].selectId;
          selectObject.installerCode = this.editForm.sourceForEditForm[i].selectCode;
          break;
        case 'heightTypes':
          selectObject.heightTypeId = +this.editForm.sourceForEditForm[i].selectId;
          selectObject.heightTypeCode = this.editForm.sourceForEditForm[i].selectCode;
          break;
        case 'serialNumber':
          selectObject.serialNumber = this.editForm.sourceForEditForm[i].selectCode;
          break;
        case 'comment':
          selectObject.comment = this.editForm.sourceForEditForm[i].selectCode;
          break;
        default:
          break;
      }
    }
    if (this.typeEditWindow === 'upd') {
      // upd
      this.oSub = this.fixtureService.upd(selectObject).subscribe(
        response => {
          this.openSnackBar(this.translate.instant('site.menu.operator.fixture-page.fixture-masterdetails-page.fixturelist-page.upd')
            + selectObject.fixtureId, this.translate.instant('site.forms.editforms.ok'));
        },
        error =>
          this.openSnackBar(error.error.message, this.translate.instant('site.forms.editforms.ok')),
        () => {
          // close edit window
          this.editForm.closeDestroy();
          // update data source
          this.refreshMap();
        }
      );
    }
  }

  getSourceForEditForm() {
    let sourceForEditForm: any[];
    if (this.translate.currentLang === 'ru') {
      sourceForEditForm = this.sourceForEditForm;
    }
    if (this.translate.currentLang === 'en') {
      sourceForEditForm = this.sourceForEditFormEng;
    }

    for (let i = 0; i < sourceForEditForm.length; i++) {
      if (this.typeEditWindow === 'ins') {
        sourceForEditForm[i].selectedIndex = 0;
        sourceForEditForm[i].selectId = '1';
        sourceForEditForm[i].selectCode = this.translate.instant('site.forms.editforms.empty');
        sourceForEditForm[i].selectName = this.translate.instant('site.forms.editforms.empty');
      }
      switch (sourceForEditForm[i].nameField) {
        case 'contractFixtures':
          sourceForEditForm[i].source = this.contractFixtures;
          if (this.typeEditWindow === 'ins') {
            sourceForEditForm[i].selectId = this.contractFixtures[0].id.toString();
            sourceForEditForm[i].selectCode = this.contractFixtures.find(
              (one: Contract) => one.id === +sourceForEditForm[i].selectId).code;
            sourceForEditForm[i].selectName = this.contractFixtures.find(
              (one: Contract) => one.id === +sourceForEditForm[i].selectId).name;
          }
          if (this.typeEditWindow === 'upd') {
            sourceForEditForm[i].selectId = this.selectFixture.contractId.toString();
            sourceForEditForm[i].selectCode = this.contractFixtures.find(
              (contractOne: Contract) => contractOne.id === +this.selectFixture.contractId).code;
            sourceForEditForm[i].selectName = this.contractFixtures.find(
              (contractOne: Contract) => contractOne.id === +this.selectFixture.contractId).name;
            for (let j = 0; j < this.contractFixtures.length; j++) {
              if (+this.contractFixtures[j].id === +this.selectFixture.contractId) {
                sourceForEditForm[i].selectedIndex = j;
                break;
              }
            }
          }
          break;
        case 'fixtureTypes':
          sourceForEditForm[i].source = this.fixtureTypes;
          if (this.typeEditWindow === 'ins') {
            sourceForEditForm[i].selectId = this.fixtureTypes[0].id.toString();
            sourceForEditForm[i].selectCode = this.fixtureTypes.find(
              (one: EquipmentType) => one.id === +sourceForEditForm[i].selectId).code;
            sourceForEditForm[i].selectName = this.fixtureTypes.find(
              (one: EquipmentType) => one.id === +sourceForEditForm[i].selectId).name;
          }
          if (this.typeEditWindow === 'upd') {
            sourceForEditForm[i].selectId = this.selectFixture.fixtureTypeId.toString();
            sourceForEditForm[i].selectCode = this.fixtureTypes.find(
              (sensorType: EquipmentType) => sensorType.id === +this.selectFixture.fixtureTypeId).code;
            sourceForEditForm[i].selectName = this.fixtureTypes.find(
              (sensorType: EquipmentType) => sensorType.id === +this.selectFixture.fixtureTypeId).name;
            for (let j = 0; j < this.fixtureTypes.length; j++) {
              if (+this.fixtureTypes[j].id === +this.selectFixture.fixtureTypeId) {
                sourceForEditForm[i].selectedIndex = j;
                break;
              }
            }
          }
          break;
        case 'substations':
          sourceForEditForm[i].source = this.substations;
          if (this.typeEditWindow === 'ins') {
            sourceForEditForm[i].selectId = this.substations[0].id.toString();
            sourceForEditForm[i].selectCode = this.substations.find(
              (one: Substation) => one.id === +sourceForEditForm[i].selectId).code;
            sourceForEditForm[i].selectName = this.substations.find(
              (one: Substation) => one.id === +sourceForEditForm[i].selectId).name;
          }
          if (this.typeEditWindow === 'upd') {
            sourceForEditForm[i].selectId = this.selectFixture.substationId.toString();
            sourceForEditForm[i].selectCode = this.substations.find(
              (substation: Substation) => substation.id === +this.selectFixture.substationId).code;
            sourceForEditForm[i].selectName = this.substations.find(
              (substation: Substation) => substation.id === +this.selectFixture.substationId).name;
            for (let j = 0; j < this.substations.length; j++) {
              if (+this.substations[j].id === +this.selectFixture.substationId) {
                sourceForEditForm[i].selectedIndex = j;
                break;
              }
            }
          }
          break;
        case 'installers':
          sourceForEditForm[i].source = this.installers;
          if (this.typeEditWindow === 'ins') {
            sourceForEditForm[i].selectId = this.installers[0].id.toString();
            sourceForEditForm[i].selectCode = this.installers.find(
              (one: Installer) => one.id === +sourceForEditForm[i].selectId).code;
            sourceForEditForm[i].selectName = this.installers.find(
              (one: Installer) => one.id === +sourceForEditForm[i].selectId).name;
          }
          if (this.typeEditWindow === 'upd') {
            sourceForEditForm[i].selectId = this.selectFixture.installerId.toString();
            sourceForEditForm[i].selectCode = this.installers.find(
              (installer: Installer) => installer.id === +this.selectFixture.installerId).code;
            sourceForEditForm[i].selectName = this.installers.find(
              (installer: Installer) => installer.id === +this.selectFixture.installerId).name;
            for (let j = 0; j < this.installers.length; j++) {
              if (+this.installers[j].id === +this.selectFixture.installerId) {
                sourceForEditForm[i].selectedIndex = j;
                break;
              }
            }
          }
          break;
        case 'heightTypes':
          sourceForEditForm[i].source = this.heightTypes;
          if (this.typeEditWindow === 'ins') {
            sourceForEditForm[i].selectId = this.heightTypes[0].id.toString();
            sourceForEditForm[i].selectCode = this.heightTypes.find(
              (one: HeightType) => one.id === +sourceForEditForm[i].selectId).code;
            sourceForEditForm[i].selectName = this.heightTypes.find(
              (one: HeightType) => one.id === +sourceForEditForm[i].selectId).name;
          }
          if (this.typeEditWindow === 'upd') {
            sourceForEditForm[i].selectId = this.selectFixture.heightTypeId.toString();
            sourceForEditForm[i].selectCode = this.heightTypes.find(
              (heightType: HeightType) => heightType.id === +this.selectFixture.heightTypeId).code;
            sourceForEditForm[i].selectName = this.heightTypes.find(
              (heightType: HeightType) => heightType.id === +this.selectFixture.heightTypeId).name;
            for (let j = 0; j < this.heightTypes.length; j++) {
              if (+this.heightTypes[j].id === +this.selectFixture.heightTypeId) {
                sourceForEditForm[i].selectedIndex = j;
                break;
              }
            }
          }
          break;
        case 'serialNumber':
          if (this.typeEditWindow === 'upd') {
            sourceForEditForm[i].selectCode = this.selectFixture.serialNumber;
          }
          break;
        case 'comment':
          if (this.typeEditWindow === 'upd') {
            sourceForEditForm[i].selectCode = this.selectFixture.comment;
          }
          break;
        default:
          break;
      }
    }
  }

  destroyEditForm() {
    this.isEditFormInit = !this.isEditFormInit;
  }

  saveEditFormSwitchOnBtn() {
    this.refreshMap();
  }

  saveEditFormSwitchOffBtn() {
    this.refreshMap();
  }

  destroyEditFormSwitchOn() {
    this.isEditFormSwitchOnInit = false;
  }

  destroyEditFormSwitchOff() {
    this.isEditFormSwitchOffInit = false;
  }

  // EVENT FORM
  okEvenwinBtn() {

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

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
    });
  }
}
