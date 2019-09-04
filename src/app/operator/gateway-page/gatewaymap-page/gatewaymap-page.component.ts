// angular lib
import {AfterViewInit, Component, EventEmitter, Input, NgZone, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {isUndefined} from 'util';
import {TranslateService} from '@ngx-translate/core';
import {MatSnackBar} from '@angular/material/snack-bar';
// jqwidgets
// app interfaces
import {Gateway, Node, Contract, EquipmentType, Owner, SourceForLinkForm, ItemsLinkForm} from '../../../shared/interfaces';
// app services
import {GatewayService} from '../../../shared/services/gateway/gateway.service';
import {NodeService} from '../../../shared/services/node/node.service';
// app components
import {EventWindowComponent} from '../../../shared/components/event-window/event-window.component';
import {LinkFormComponent} from '../../../shared/components/link-form/link-form.component';


declare var ymaps: any;


@Component({
  selector: 'app-gatewaymap-page',
  templateUrl: './gatewaymap-page.component.html',
  styleUrls: ['./gatewaymap-page.component.css']
})
export class GatewaymapPageComponent implements OnInit, OnDestroy, AfterViewInit {

  // variables from parent component
  @Input() ownerGateways: Owner[];
  @Input() gatewayTypes: EquipmentType[];
  @Input() contractGateways: Contract[];

  // determine the functions that need to be performed in the parent component
  @Output() onRefreshGrid = new EventEmitter();

  // define variables - link to view objects
  @ViewChild('linkForm', {static: false}) linkForm: LinkFormComponent;
  @ViewChild('eventWindow', {static: false}) eventWindow: EventWindowComponent;

  // other variables
  myMap: any;
  nCoord = 60.0503;
  eCoord = 30.4269;
  zoom = 17;
  draggableIcon = false;
  nodeColumns: any[];
  nodeColumnsEng: any[];
  //
  oSub: Subscription;
  oSubGatewayGroups: Subscription;
  oSubNodesInGroup: Subscription;
  gatewayGroups: Gateway[];
  nodeInGroups: Node[];
  selectGatewayId: number;
  selectNodeId: number;
  selectGatewayNodeId: number;
  // link form
  oSubForLinkWin: Subscription;
  oSubLink: Subscription;
  sourceForLinkForm: SourceForLinkForm;
  sourceForLinkFormEng: SourceForLinkForm;
  isLinkFormInit = false;
  // event form
  actionEventWindow = '';
  warningEventWindow = '';


  constructor(private _snackBar: MatSnackBar,
              private zone: NgZone,
              public router: Router,
              public route: ActivatedRoute,
              // service
              public translate: TranslateService,
              private gatewayService: GatewayService,
              private nodeService: NodeService) {
  }

  ngOnInit() {
    // definde columns
    this.nodeColumns =
      [
        {text: 'nodeId', datafield: 'nodeId', width: 150},
        {text: 'Договор', datafield: 'contractCode', width: 150},
        {text: 'Адрес', datafield: 'geographFullName', width: 400},
        {text: 'Тип узла', datafield: 'nodeTypeCode', width: 150},
        {text: 'Владелец', datafield: 'ownerCode', width: 150},
        {text: 'Широта', datafield: 'n_coordinate', width: 150},
        {text: 'Долгота', datafield: 'e_coordinate', width: 150},
        {text: 'Серийный номер', datafield: 'serialNumber', width: 150},
        {text: 'Коментарий', datafield: 'comment', width: 150},
      ];
    this.nodeColumnsEng =
      [
        {text: 'nodeId', datafield: 'nodeId', width: 150},
        {text: 'Contract', datafield: 'contractCode', width: 150},
        {text: 'Address', datafield: 'geographFullName', width: 400},
        {text: 'Node type', datafield: 'nodeTypeCode', width: 150},
        {text: 'Owner', datafield: 'ownerCode', width: 150},
        {text: 'Latitude', datafield: 'n_coordinate', width: 150},
        {text: 'Longitude', datafield: 'e_coordinate', width: 150},
        {text: 'Serial number', datafield: 'serialNumber', width: 150},
        {text: 'Comments', datafield: 'comment', width: 150},
      ];

    // Definde filter
    this.sourceForLinkForm = {
      window: {
        code: 'linkGatewayNodes',
        name: 'Выбрать узлы',
        theme: 'material',
        autoOpen: true,
        isModal: true,
        modalOpacity: 0.3,
        width: 1200,
        maxWidth: 1200,
        minWidth: 500,
        height: 500,
        maxHeight: 800,
        minHeight: 600

      },
      grid: {
        source: [],
        columns: this.nodeColumns,
        theme: 'material',
        width: 1186,
        height: 485,
        columnsresize: true,
        sortable: true,
        filterable: true,
        altrows: true,
        selectionmode: 'checkbox',
        valueMember: 'nodeId',
        sortcolumn: ['nodeId'],
        sortdirection: 'desc',
        selectId: []
      }
    };
    this.sourceForLinkFormEng = {
      window: {
        code: 'linkGatewayNodes',
        name: 'Choose nodes',
        theme: 'material',
        autoOpen: true,
        isModal: true,
        modalOpacity: 0.3,
        width: 1200,
        maxWidth: 1200,
        minWidth: 500,
        height: 500,
        maxHeight: 800,
        minHeight: 600

      },
      grid: {
        source: [],
        columns: this.nodeColumnsEng,
        theme: 'material',
        width: 1186,
        height: 485,
        columnsresize: true,
        sortable: true,
        filterable: true,
        altrows: true,
        selectionmode: 'checkbox',
        valueMember: 'nodeId',
        sortcolumn: ['nodeId'],
        sortdirection: 'desc',
        selectId: []
      }
    };
  }

  ngAfterViewInit() {
    this.mapInit();
  }

  ngOnDestroy() {
    if (this.oSub) {
      this.oSub.unsubscribe();
    }
    if (this.oSubGatewayGroups) {
      this.oSubGatewayGroups.unsubscribe();
    }
    if (this.oSubNodesInGroup) {
      this.oSubNodesInGroup.unsubscribe();
    }
    if (this.oSubForLinkWin) {
      this.oSubForLinkWin.unsubscribe();
    }
    if (this.oSubLink) {
      this.oSubLink.unsubscribe();
    }
    if (this.myMap) {
      this.myMap.destroy();
    }
  }

  // get gateway groups
  getGatewayGroups() {
    this.oSubGatewayGroups = this.gatewayService.getAllWithoutParam().subscribe(gateways => {
      this.gatewayGroups = gateways;
      if (!isUndefined(this.myMap)) {
        // init list box gateway groups
        this.listBoxInit();
      }
    });
  }

  // get nodes in gateway group
  getNodesInGroup(gatewayId: number) {
    this.oSubNodesInGroup = this.nodeService.getNodeInGroup(gatewayId).subscribe(nodes => {
      this.nodeInGroups = nodes;
      this.selectGatewayId = gatewayId;
      if (!isUndefined(this.myMap)) {
        this.addItemsToMap();
      }
    });
  }

  // refresh Map
  refreshMap() {
    this.getNodesInGroup(this.selectGatewayId);
  }

  // map initialization
  mapInit() {
    ymaps.ready().then(() => {
      this.myMap = new ymaps.Map('gateway_yamaps', {
        center: [this.nCoord, this.eCoord],
        zoom: this.zoom,
        controls: ['zoomControl']
      });
    });
    // get gatway groups
    this.getGatewayGroups();
  }

  // buttons on the map init
  buttonsInit() {
    const ButtonLayout = ymaps.templateLayoutFactory.createClass([
        `<div class="fr">
                  <button id="linkNodesInGroup"
                    class="btn btn-small waves-effect waves-yellow white blue-text"
                  >
                    <i class="material-icons">file_download</i>
                  </button>
              </div>`
      ].join(''),
      {
        build: function () {
          ButtonLayout.superclass.build.call(this);
          $('#linkNodesInGroup').bind('click', this.linkNodesInGroup(this.getData().properties));
        },
        linkNodesInGroup: (function () {
          const mapComponent: GatewaymapPageComponent = this;
          return function (properties: any) {
            return function () {
              mapComponent.linkNodesInGroup();
            };
          };
        }).call(this),
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
      '<button id=\'gateway-listbox-header\' class=\'dropdown-toggle btn btn-small waves-effect waves-yellow white blue-text\' data-toggle=\'dropdown\'>' +
      '{{data.title}} <span class=\'caret\'></span>' +
      '</button>' +
      // Этот элемент будет служить контейнером для элементов списка.
      // В зависимости от того, свернут или развернут список, этот контейнер будет
      // скрываться или показываться вместе с дочерними элементами.
      '<ul id=\'gateway-listbox\'' +
      ' class=\'dropdown-menu\' role=\'menu\' aria-labelledby=\'dropdownMenu\'' +
      ' style=\'display: {% if state.expanded %}block{% else %}none{% endif %};\'></ul>'
      ,
      {
        build: function () {
          // Вызываем метод build родительского класса перед выполнением
          // дополнительных действий.
          ListBoxLayout.superclass.build.call(this);
          this.childContainerElement = $('#gateway-listbox').get(0);
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
        '<li><a class=\'waves-effect waves-yellow white blue-text\'><i class=\'material-icons\'>router</i> {{data.content}}</a></li>'
      ),
      // Создадим 2 пункта выпадающего списка
      listBoxItems = this.getlistBoxItemGroups(),
      // Теперь создадим список, содержащий 2 пункта.
      listBox = new ymaps.control.ListBox({
        items: listBoxItems,
        data: {
          title: this.translate.instant('site.menu.operator.gateway-page.gatewaymap-page.select')
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
        const mapComponent: GatewaymapPageComponent = this;
        return function (e) {
          // Получаем ссылку на объект, по которому кликнули.
          // События элементов списка пропагируются
          // и их можно слушать на родительском элементе.
          const item = e.get('target');
          // Клик на заголовке выпадающего списка обрабатывать не надо.
          if (item !== listBox) {
            mapComponent.myMap.setCenter(item.data.get('center'), item.data.get('zoom'));
            mapComponent.getNodesInGroup(item.data.get('gatewayId'));
            mapComponent.selectGatewayNodeId = item.data.get('nodeId');
          }
        };
      }).call(this)
    );
    this.myMap.controls.add(listBox, {float: 'left'});

    this.buttonsInit();
  }

  // get gateway groups for listBox
  getlistBoxItemGroups(): any {
    const listBoxItemGroups: any[] = [];
    for (let i = 0; i < this.gatewayGroups.length; i++) {
      listBoxItemGroups[i] = new ymaps.control.ListBoxItem({
        data: {
          content: this.gatewayGroups[i].nodeGroupName,
          center: [this.gatewayGroups[i].n_coordinate, this.gatewayGroups[i].e_coordinate],
          zoom: 17,
          gatewayId: this.gatewayGroups[i].gatewayId,
          nodeId: this.gatewayGroups[i].nodeId
        }
      });
    }
    return listBoxItemGroups;
  }

  // place the object from the set "getAll()" on the map
  addItemsToMap() {
    const collection = new ymaps.GeoObjectCollection(null, {});
    const BalloonContentLayout =
      ymaps.templateLayoutFactory.createClass(
        this.translate.currentLang === 'ru'
          ?
          `<div class="fr">
            <button id="visibilityItems"
              class="btn btn-small waves-effect waves-yellow white blue-text"
              style="margin: 2px 2px 2px 2px;"
            >
              <i class="material-icons">pin_drop</i>
            </button>
          </div>
          <table class="table table-sm">
            <tbody>
              <tr><th>ID узла</th><td>{{properties.nodeId}}</td></tr>
              <tr><th>Широта</th><td>{{properties.n_coordinate}}</td></tr>
              <tr><th>Долгота</th><td>{{properties.e_coordinate}}</td></tr>
            </tbody>
          </table>`
          :
          `<div class="fr">
            <button id="visibilityItems"
              class="btn btn-small waves-effect waves-yellow white blue-text"
              style="margin: 2px 2px 2px 2px;"
            >
              <i class="material-icons">pin_drop</i>
            </button>
          </div>
          <table class="table table-sm">
            <tbody>
              <tr><th>ID node</th><td>{{properties.nodeId}}</td></tr>
              <tr><th>Latitude</th><td>{{properties.n_coordinate}}</td></tr>
              <tr><th>Longitude</th><td>{{properties.e_coordinate}}</td></tr>
            </tbody>
          </table>`
        ,
        {
          build: function () {
            BalloonContentLayout.superclass.build.call(this);
            $('#visibilityItems').bind('click', this.visibilityItems(this.getData().properties));
          },
          clear: function () {
            BalloonContentLayout.superclass.clear.call(this);
          },
          visibilityItems: (function () {
            const mapComponent: GatewaymapPageComponent = this;
            return function (properties: any) {
              return function () {
                mapComponent.selectNodeId = properties._data.nodeId;
                mapComponent.eventWindow.okButtonDisabled(false);
                mapComponent.warningEventWindow =
                  mapComponent.translate.instant('site.menu.operator.node-page.node-masterdetails-page.nodelist-page.groupOut-question');
                mapComponent.actionEventWindow = 'visibility';
                mapComponent.eventWindow.openEventWindow();
              };
            };
          }).call(this),
        }
      );
    this.myMap.geoObjects.removeAll();
    this.myMap.geoObjects.add(collection);
    for (const node of this.nodeInGroups) {
      const myGeoObject = new ymaps.GeoObject(
        { // description geometry
          geometry: {
            type: 'Point',
            coordinates: [node.n_coordinate, node.e_coordinate]
          },
          // properties
          properties: {
            // Content of icon
            iconContent: node.numberInGroup,
            nodeId: node.nodeId,
            n_coordinate: node.n_coordinate,
            e_coordinate: node.e_coordinate
          }
        },
        { // options
          balloonContentLayout: BalloonContentLayout,
          balloonPanelMaxMapArea: 0,
          // icon will be change width
          preset: node.nodeId === this.selectGatewayNodeId ? 'islands#redStretchyIcon' : 'islands#blackStretchyIcon',
          // icon move
          draggable: this.draggableIcon
        });
      collection.add(myGeoObject);
    }
  }

  // LINK FORM

  pinDropNode() {
    const nodeIds = [];
    nodeIds[0] = this.selectNodeId;
    this.oSub = this.nodeService.delNodeInGatewayGr(this.selectGatewayId, nodeIds).subscribe(
      response => {
        this.openSnackBar(this.translate.instant('site.menu.operator.node-page.node-masterdetails-page.nodelist-page.groupOut'),
          this.translate.instant('site.forms.editforms.ok'));
      },
      error => {
        this.openSnackBar(error.error.message, this.translate.instant('site.forms.editforms.ok'));
      },
      () => {
        // refresh map
        this.refreshMap();
      }
    );
  }

  linkNodesInGroup() {
    if (this.selectGatewayId > 1) {
      this.isLinkFormInit = true;
    } else {
      this.eventWindow.okButtonDisabled(true);
      this.warningEventWindow =
        this.translate.instant('site.menu.operator.node-page.node-masterdetails-page.nodelist-page.groupIn-warning');
      this.eventWindow.openEventWindow();
    }
  }

  saveLinkFormBtn(event: ItemsLinkForm) {
    if (event.code === this.sourceForLinkForm.window.code) {
      this.oSubLink = this.nodeService.setNodeInGatewayGr(this.selectGatewayId, event.Ids).subscribe(
        response => {
          this.openSnackBar(this.translate.instant('site.menu.operator.node-page.node-masterdetails-page.nodelist-page.groupIn'),
            this.translate.instant('site.forms.editforms.ok'));
        },
        error => {
          this.openSnackBar(error.error.message, this.translate.instant('site.forms.editforms.ok'));
        },
        () => {
          this.linkForm.closeDestroy();
          this.refreshMap();
        }
      );
    }
  }

  getSourceForLinkForm() {
    this.oSubForLinkWin = this.nodeService.getNodeInGroup(1).subscribe(
      response => {
        this.sourceForLinkForm.grid.source = response;
        this.sourceForLinkFormEng.grid.source = response;
        this.linkForm.refreshGrid();
      },
      error => {
        this.openSnackBar(error.error.message, this.translate.instant('site.forms.editforms.ok'));
      }
    );
  }

  destroyLinkForm() {
    this.isLinkFormInit = false;
  }

  // EVENT FORM

  okEvenwinBtn() {
    if (this.actionEventWindow === 'visibility') {
      this.pinDropNode();
    }
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
    });
  }
}
