import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';

import {
  Contract, GatewayGroup,
  GatewayType,
  Geograph,
  NodeInGroup,
  Owner_gateway,
} from '../../../shared/interfaces';
import {GatewayService} from '../../../shared/services/gateway/gateway.service';
import {MaterialService} from '../../../shared/classes/material.service';
import {GatewayNode} from '../../../shared/models/gatewayNode';
import {NodeService} from '../../../shared/services/node/node.service';
import {EventWindowComponent} from '../../../shared/components/event-window/event-window.component';
import {NodelinkFormComponent} from '../../../node/node-page/node-masterdetails-page/nodelist-page/nodelink-form/nodelink-form.component';


declare var ymaps: any;

@Component({
  selector: 'app-gatewaymap-page',
  templateUrl: './gatewaymap-page.component.html',
  styleUrls: ['./gatewaymap-page.component.css']
})
export class GatewaymapPageComponent implements OnInit, OnDestroy, AfterViewInit {

  // variables from master component
  @Input() geographs: Geograph[];
  @Input() owner_gateways: Owner_gateway[];
  @Input() gatewayTypes: GatewayType[];
  @Input() contract_gateways: Contract[];

  @Input() nodeColumns: any[];

  // determine the functions that need to be performed in the parent component
  @Output() onRefreshGrid = new EventEmitter();

  // define variables - link to view objects
  @ViewChild('eventWindow') eventWindow: EventWindowComponent;
  @ViewChild('warningEventWindow') warningEventWindow: string;
  @ViewChild('linkWindow') linkWindow: NodelinkFormComponent;

  // other variables
  gatewayGroups: GatewayGroup[];
  nodeInGroups: NodeInGroup[];
  pindropGatewayNode: GatewayNode = new GatewayNode();
  selectGatewayId: number;
  selectNodeId: number;
  selectGatewayNodeId: number;
  myMap: any;
  actionEventWindow: string = '';
  //
  oSub: Subscription;
  oSubGatewayGroups: Subscription;
  oSubNodesInGroup: Subscription;
  //
  draggableIcon: boolean = false;

  constructor(private zone: NgZone,
              private gatewayService: GatewayService,
              private nodeService: NodeService,
              public router: Router,
              public route: ActivatedRoute) {
  }

  ngOnInit() {
    this.getGatewayGroups();
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
    if (this.myMap) {
      this.myMap.destroy();
    }
  }

  // get gateway groups
  getGatewayGroups() {
    this.oSubGatewayGroups = this.gatewayService.getGatewayGroups(1).subscribe(gatewayGroups => {
      this.gatewayGroups = gatewayGroups;
      this.listBoxInit();
    });
  }

  // get nodes ib gateway group
  getNodesInGroup(id_gateway: number) {
    this.oSubNodesInGroup = this.gatewayService.getNodesInGroup(id_gateway).subscribe(nodeInGroups => {
      this.nodeInGroups = nodeInGroups;
      this.addItemsToMap();
      this.selectGatewayId = id_gateway;
    });
  }

  // refresh Map
  refreshMap() {
    this.getNodesInGroup(this.selectGatewayId);
    // refresh grid
    // this.onRefreshGrid.emit()
  }

  // map initialization
  mapInit() {
    ymaps.ready().then(() => {
      this.myMap = new ymaps.Map('node_yamaps', {
        center: [60.0503, 30.4269],
        zoom: 17,
        controls: ['zoomControl']
      });
    });
  }

  // buttons on the map init
  buttonsInit() {
    let ButtonLayout = ymaps.templateLayoutFactory.createClass([
        `<div class="fr">
                  <Button id="placeNodesInGroup"
                    class="btn btn-small waves-effect waves-orange white blue-text"

                  >
                    <i class="material-icons">place</i>
                  </Button>
              </div>`
      ].join(''),
      {
        build: function () {
          ButtonLayout.superclass.build.call(this);
          $('#placeNodesInGroup').bind('click', this.placeNodesInGroup(this.getData().properties));
        },

        placeNodesInGroup: (function () {
          let mapComponent: GatewaymapPageComponent = this;
          return function (properties: any) {
            return function () {
              mapComponent.placeNodesInGroup();
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
    let ListBoxLayout = ymaps.templateLayoutFactory.createClass(
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
        '<li><a class=\'waves-effect waves-orange white blue-text\'><i class=\'material-icons\'>router</i> {{data.content}}</a></li>'
      ),

      // Создадим 2 пункта выпадающего списка
      listBoxItems = this.getlistBoxItemGroups(),

      // Теперь создадим список, содержащий 2 пункта.
      listBox = new ymaps.control.ListBox({
        items: listBoxItems,
        data: {
          title: 'Выберите группу узлов'
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
        let mapComponent: GatewaymapPageComponent = this;
        return function (e) {
          // Получаем ссылку на объект, по которому кликнули.
          // События элементов списка пропагируются
          // и их можно слушать на родительском элементе.
          var item = e.get('target');
          // Клик на заголовке выпадающего списка обрабатывать не надо.
          if (item != listBox) {
            mapComponent.myMap.setCenter(item.data.get('center'), item.data.get('zoom'));
            mapComponent.getNodesInGroup(item.data.get('id_gateway'));
            mapComponent.selectGatewayNodeId = item.data.get('id_node');
          }
        };
      }).call(this)
    );
    this.myMap.controls.add(listBox, {float: 'left'});

    this.buttonsInit();
  }

  // get gateway groups for listBox
  getlistBoxItemGroups(): any {
    let listBoxItemGroups: any[] = [];
    for (var i = 0; i < this.gatewayGroups.length; i++) {
      listBoxItemGroups[i] = new ymaps.control.ListBoxItem({
        data: {
          content: this.gatewayGroups[i].name_group,
          center: [this.gatewayGroups[i].n_coordinate, this.gatewayGroups[i].e_coordinate],
          zoom: 17,
          id_gateway: this.gatewayGroups[i].id_gateway,
          id_node: this.gatewayGroups[i].id_node
        }
      });
    }
    return listBoxItemGroups;
  }

  // place the object from the set "getAll()" on the map
  addItemsToMap() {
    let collection = new ymaps.GeoObjectCollection(null, {});

    let BalloonContentLayout = ymaps.templateLayoutFactory.createClass(
      `<div class="fr">
        <jqxTooltip [position]="'bottom'" [name]="'delTooltip'"
                    [content]="'Удалить узел с карты'">
          <Button id="visibilityItems"
            class="btn btn-small waves-effect waves-orange white blue-text"
            style="margin: 2px 2px 2px 2px;"
          >
            <i class="material-icons">pin_drop</i>
          </Button>
        </jqxTooltip>
      </div>
            
      <table class="table table-sm">
      <tbody>

      <tr><th>ID узла</th><td>{{properties.id_node}}</td></tr>
      <tr><th>Широта</th><td>{{properties.n_coordinate}}</td></tr>
      <tr><th>Долгота</th><td>{{properties.e_coordinate}}</td></tr>

      </tbody>
      </table>`, {
        build: function () {
          BalloonContentLayout.superclass.build.call(this);
          $('#visibilityItems').bind('click', this.visibilityItems(this.getData().properties));
        },

        clear: function () {
          BalloonContentLayout.superclass.clear.call(this);
        },

        visibilityItems: (function () {
          let mapComponent: GatewaymapPageComponent = this;
          return function (properties: any) {
            return function () {
              mapComponent.selectNodeId = properties._data.id_node;
              mapComponent.eventWindow.okButtonDisabled(false);
              mapComponent.warningEventWindow = 'Исключить узел из группы?';
              mapComponent.actionEventWindow = 'visibility';
              mapComponent.eventWindow.openEventWindow();
            };
          };
        }).call(this),
      }
    );

    this.myMap.geoObjects.removeAll();
    this.myMap.geoObjects.add(collection);
    for (let node of this.nodeInGroups) {
      let myGeoObject = new ymaps.GeoObject(
        { // description geometry
          geometry: {
            type: 'Point',
            coordinates: [node.n_coordinate, node.e_coordinate]
          },
          // properties
          properties: {
            // Content of icon
            iconContent: node.num_node,
            id_node: node.id_node,
            n_coordinate: node.n_coordinate,
            e_coordinate: node.e_coordinate
          }
        },
        { // options
          balloonContentLayout: BalloonContentLayout,
          balloonPanelMaxMapArea: 0,
          // icon will be change width
          preset: node.id_node === this.selectGatewayNodeId ? 'islands#redStretchyIcon' : 'islands#blackStretchyIcon',
          // icon move
          draggable: this.draggableIcon
        });

      collection.add(myGeoObject);
    }
  }

  // event window
  okEvenwinBtn() {
    if (this.actionEventWindow === 'visibility') {
      this.pinDropNode();
    }
  }

  pinDropNode() {
    this.pindropGatewayNode.gatewayId = this.selectGatewayId;
    this.pindropGatewayNode.nodeId = this.selectNodeId;

    this.oSub = this.nodeService.del_gateway_node(this.pindropGatewayNode).subscribe(
      response => {
        // MaterialService.toast(`Светильник c id = ${response.id_fixture} был отвязан от столба.`)
      },
      error => MaterialService.toast(error.message),
      () => {
        // refresh map
        this.refreshMap();
      }
    );
  }

  placeNodesInGroup() {
    if (this.selectGatewayId > 1) {
      this.eventWindow.okButtonDisabled(false);
      this.linkWindow.openWindow();
    } else {
      this.eventWindow.okButtonDisabled(true);
      this.warningEventWindow = `Вам следует выбрать шлюз для привязки узлов`;
      this.eventWindow.openEventWindow();
    }
  }

  saveLinkwinBtn() {
    // refresh map
    this.refreshMap();
    // refresh table
    // this.onRefreshGrid.emit()
  }
}
