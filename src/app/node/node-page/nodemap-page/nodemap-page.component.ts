import {Component, EventEmitter, Input, NgZone, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {MaterialService} from '../../../shared/classes/material.service';

import {Node} from '../../../shared/models/node';
import {NodeService} from '../../../shared/services/node/node.service';
import {EventWindowComponent} from '../../../shared/components/event-window/event-window.component';
import {Contract, Geograph, NodeType, Owner_node} from '../../../shared/interfaces';
import {NodeeditFormComponent} from '../node-masterdetails-page/nodelist-page/nodeedit-form/nodeedit-form.component';
import {Fixture} from '../../../shared/models/fixture';
import {FixtureService} from '../../../shared/services/fixture/fixture.service';


declare var ymaps: any;


@Component({
  selector: 'app-nodemap-page',
  templateUrl: './nodemap-page.component.html',
  styleUrls: ['./nodemap-page.component.css']
})

export class NodemapPageComponent implements OnInit, OnDestroy {

  // variables from master component
  @Input() geographs: Geograph[];
  @Input() owner_nodes: Owner_node[];
  @Input() nodeTypes: NodeType[];
  @Input() contract_nodes: Contract[];

  // determine the functions that need to be performed in the parent component
  @Output() onRefreshGrid = new EventEmitter();

  // define variables - link to view objects
  @ViewChild('editWindow') editWindow: NodeeditFormComponent;
  @ViewChild('eventWindow') eventWindow: EventWindowComponent;
  @ViewChild('warningEventWindow') warningEventWindow: string;

  // other variables
  nodes: Node[];
  node: Node = new Node();
  id_node_del: number;
  id_node_move: number;
  n_coord: number;
  e_coord: number;
  saveNode: Node = new Node();
  saveFixture: Fixture = new Fixture();
  map: any;
  actionEventWindow = '';
  //
  oSub: Subscription;
  //
  private errorText: string;
  offset = 0;
  limit = 1000000000000;
  draggableIcon = false;

  constructor(private zone: NgZone,
              public router: Router,
              public route: ActivatedRoute,
              private nodeService: NodeService,
              private fixtureService: FixtureService) {
  }

  ngOnInit() {
    this.mapInit();
  }

  ngOnDestroy() {
    if (this.oSub) {
      this.oSub.unsubscribe();
    }
    if (this.map) {
      this.map.destroy();
    }
    if (this.eventWindow) {
      this.eventWindow.destroyEventWindow();
    }
  }

  // map initialization
  mapInit(): void {
    ymaps.ready().then(() => {
      this.map = new ymaps.Map('node_yamaps', {
        center: [60.0503, 30.4269],
        zoom: 17,
        controls: ['zoomControl']
      });

      let ButtonLayout = ymaps.templateLayoutFactory.createClass([
          `<div class="fr">
                  <Button id="insItem"
                    class="btn btn-small waves-effect waves-orange white blue-text"
                    style="margin: 2px 2px 2px 2px;"
                  >
                    <i class="material-icons">add</i>
                  </Button>
                  <Button id="refreshMap"
                    class="btn btn-small waves-effect waves-orange white blue-text"
                    style="margin: 2px 2px 2px 2px;"
                  >
                    <i class="material-icons">refresh</i>
                  </Button>
                  <Button 
                    class="btn btn-small waves-effect waves-orange white blue-text"
                    style="margin: 2px 2px 2px 2px;"
                  >
                    <label class="blue-text">
                      <input type="checkbox" id="moveIcons"/>
                      <span>Двигать узлы</span>
                    </label>
                  </Button>
        
              </div>`
        ].join(''),
        {
          build: function () {
            ButtonLayout.superclass.build.call(this);
            $('#insItem').bind('click', this.insItem(this.getData().properties));
            $('#refreshMap').bind('click', this.refreshMap(this.getData().properties));
            $('#moveIcons').bind('click', this.moveIcons(this.getData().properties));
          },

          insItem: (function () {
            const mapComponent: NodemapPageComponent = this;
            return function (properties: any) {
              return function () {
                mapComponent.insItem();
              };
            };
          }).call(this),

          refreshMap: (function () {
            const mapComponent: NodemapPageComponent = this;
            return function (properties: any) {
              return function () {
                mapComponent.refreshMap();
              };
            };
          }).call(this),

          moveIcons: (function () {
            const mapComponent: NodemapPageComponent = this;
            return function (properties: any) {
              return function () {
                // change options - move icon
                mapComponent.draggableIcon = !mapComponent.draggableIcon;
                // refresh map
                mapComponent.refreshMap();
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

      this.map.controls.add(buttonIns, {
        right: 5,
        top: 5
      });

      // Refresh map
      this.getAll();
    });
  }

  // get a set of objects
  getAll() {
    const params = Object.assign({}, {
        offset: this.offset,
        limit: this.limit
      },
      {
        id_geograph: -1,
        id_owner: -1,
        id_node_type: -1,
        id_contract: -1,
        id_gateway: -1
      });

    this.oSub = this.nodeService.getAll(params).subscribe(nodes => {
      this.nodes = nodes;
      this.addItemsToMap();
    });
  }

  // refresh Map
  refreshMap() {
    this.getAll();
    // refresh grid
    // this.onRefreshGrid.emit()
  }

  // place the object from the set "getAll()" on the map
  addItemsToMap() {
    const collection = new ymaps.GeoObjectCollection(null, {});

    const BalloonContentLayout = ymaps.templateLayoutFactory.createClass(
      `<div class="fr">
        <jqxTooltip [position]="'bottom'" [name]="'updTooltip'"
                    [content]="'Редактировать узел'">
          <Button id="updItems"
            class="btn btn-small waves-effect waves-orange white blue-text"
            style="margin: 2px 2px 2px 2px;"
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
        
        <jqxTooltip [position]="'bottom'" [name]="'delTooltip'"
                    [content]="'Удалить узел с карты'">
          <Button id="visibilityItems"
            class="btn btn-small waves-effect waves-orange white blue-text"
            style="margin: 2px 2px 2px 25px;"
          >
            <i class="material-icons">pin_drop</i>
          </Button>
        </jqxTooltip>
        
        
      </div>
            
      <table class="table table-sm">
      <tbody>
      <tr><th>Договор</th><td>{{properties.code_contract}}</td></tr>
      <tr><th>Географическое понятие</th><td>{{properties.code_geograph}}</td></tr>
      <tr><th>Тип узла</th><td>{{properties.code_node_type}}</td></tr>
      <tr><th>Владелец</th><td>{{properties.code_owner}}</td></tr>
      <tr><th>Широта</th><td>{{properties.n_coordinate}}</td></tr>
      <tr><th>Долгота</th><td>{{properties.e_coordinate}}</td></tr>
      <tr><th>Цена</th><td>{{properties.price}}</td></tr>
      <tr><th>Коментарий</th><td>{{properties.comments}}</td></tr>
      </tbody>
      </table>`, {
        build: function () {
          BalloonContentLayout.superclass.build.call(this);
          $('#updItems').bind('click', this.updItems(this.getData().properties));
          $('#visibilityItems').bind('click', this.visibilityItems(this.getData().properties));
          $('#delItems').bind('click', this.delItems(this.getData().properties));
        },

        clear: function () {
          // $('#fixtureLightSwitcher').unbind('click', this.toggle);
          BalloonContentLayout.superclass.clear.call(this);
        },

        updItems: (function () {
          const mapComponent: NodemapPageComponent = this;
          return function (properties: any) {
            return function () {
              mapComponent.editWindow.positionWindow({x: 600, y: 90});
              mapComponent.editWindow.openWindow(properties._data, 'upd');
            };
          };
        }).call(this),

        visibilityItems: (function () {
          const mapComponent: NodemapPageComponent = this;
          return function (properties: any) {
            return function () {
              mapComponent.warningEventWindow = 'Очистить координаты узла (убрать с карты)?';
              mapComponent.actionEventWindow = 'visibility';
              mapComponent.eventWindow.openEventWindow();
              mapComponent.id_node_del = properties._data.id_node;
            };
          };
        }).call(this),

        delItems: (function () {
          const mapComponent: NodemapPageComponent = this;
          return function (properties: any) {
            return function () {
              mapComponent.warningEventWindow = 'Удалить узел?';
              mapComponent.actionEventWindow = 'del';
              mapComponent.eventWindow.openEventWindow();
              mapComponent.id_node_del = properties._data.id_node;
            };
          };
        }).call(this)
      }
    );

    this.map.geoObjects.removeAll();
    this.map.geoObjects.add(collection);
    for (const node of this.nodes) {
      const myGeoObject = new ymaps.GeoObject(
        {
          // description geometry
          geometry: {
            type: 'Point',
            coordinates: [node.n_coordinate, node.e_coordinate]
          },
          // properties
          properties: {
            // Content of icon
            iconContent: node.id_node,
            id_node: node.id_node,
            id_geograph: node.id_geograph,
            id_node_type: node.id_node_type,
            id_contract: node.id_contract,
            code_contract: node.code_contract,
            code_geograph: node.code_geograph,
            code_node_type: node.code_node_type,
            code_owner: node.code_owner,
            n_coordinate: node.n_coordinate,
            e_coordinate: node.e_coordinate,
            price: node.price,
            comments: node.comments
          }
        },
        {
          // options
          balloonContentLayout: BalloonContentLayout,
          balloonPanelMaxMapArea: 0,
          // icon will be change width
          preset: 'islands#blackStretchyIcon',
          // icon move
          draggable: this.draggableIcon
        });

      const changeCoords = function (mapComponent) {
        return function (e) {
          const cord = e.get('target').geometry.getCoordinates();
          mapComponent.id_node_move = e.get('target').properties._data.id_node;
          mapComponent.n_coord = cord[0];
          mapComponent.e_coord = cord[1];

          mapComponent.warningEventWindow = 'Вы уверены, что требуется изменить координаты узла?';
          mapComponent.actionEventWindow = 'move';
          mapComponent.eventWindow.openEventWindow();
        };
      }(this);

      // event dragend - getting new coordinates
      myGeoObject.events.add('dragend', changeCoords);

      collection.add(myGeoObject);
    }
  }

  // add empty object with coordinates
  insItem() {
    this.map.events.add('click', this.mapClickIns, this);
  }

  mapClickIns(event: any) {
    this.map.events.remove('click', this.mapClickIns, this);
    const coords = event.get('coords');

    this.saveNode.id_node = -1;
    this.saveNode.id_contract = 1;
    this.saveNode.id_node_type = 1;
    this.saveNode.id_geograph = 1;
    this.saveNode.n_coordinate = coords[0];
    this.saveNode.e_coordinate = coords[1];
    this.saveNode.comments = 'пусто';
    this.saveNode.price = 0;

    this.oSub = this.nodeService.ins(this.saveNode).subscribe(
      response => {
        this.saveNode.id_node = response.id_node;
        MaterialService.toast(`Узел/столб c id = ${response.id_node} был добавлен.`);
      },
      error => MaterialService.toast(error.error.message),
      () => {
        // insert fixture
        this.mapClickInsFixture(this.saveNode.id_node);
        // refresh map
        this.refreshMap();
        // refresh grid
        this.onRefreshGrid.emit();
      }
    );
  }

  // insert fixture
  mapClickInsFixture(id_node: any) {
    if (this.saveNode.id_node > 0) {
      this.saveFixture.id_contract = 1;
      this.saveFixture.id_fixture_type = 1;
      this.saveFixture.id_geograph = 1;
      this.saveFixture.id_installer = 1;
      this.saveFixture.id_substation = 1;
      this.saveFixture.id_height_type = 1;
      this.saveFixture.numline = 1;
      this.saveFixture.side = '1';

      this.saveFixture.id_fixture = 0;
      this.saveFixture.flg_chief = false;
      this.saveFixture.price = 0;
      this.saveFixture.comments = 'пусто';

      this.saveFixture.id_node = this.saveNode.id_node;

      this.oSub = this.fixtureService.ins(this.saveFixture).subscribe(
        response => {
          this.saveFixture.id_fixture = response.id_fixture;
          MaterialService.toast(`Светильник c id = ${response.id_fixture} был добавлен.`);
        },
        error => MaterialService.toast(error.message),
        () => {
        }
      );
    }
  }

  // change of coordinates
  changeCoords(id_node: number, n_coord: number, e_coord: number) {
    this.node.id_node = id_node;
    this.node.n_coordinate = n_coord;
    this.node.e_coordinate = e_coord;

    this.oSub = this.nodeService.set_coords(this.node).subscribe(
      response => {
        MaterialService.toast(`Место положения узла/столба c id = ${response.id_node} изменилось.`);
      },
      error => MaterialService.toast(error.error.message),
      () => {
        // refresh grid
        this.onRefreshGrid.emit();
      }
    );
  }

  // untie the node from the map
  visibilityItem(id: number) {
    this.clearErrorText();

    if (+id >= 0) {
      this.saveNode.id_node = id;
      this.saveNode.n_coordinate = 0;
      this.saveNode.e_coordinate = 0;

      this.oSub = this.nodeService.set_coords(this.saveNode).subscribe(
        response => {
          MaterialService.toast(`Узел/столб c id = ${response.id_node} был убран с карты.`);
        },
        error => MaterialService.toast(error.error.message),
        () => {
          // hide event window
          this.eventWindow.hideEventWindow();
          // refresh map
          this.refreshMap();
          // refresh grid
          this.onRefreshGrid.emit();
        }
      );
    }
  }

  // untie the node from the map
  delItem(id: number) {
    this.clearErrorText();

    if (+id >= 0) {
      this.nodeService.del(+id).subscribe(
        response => {
          MaterialService.toast(response.message);
        },
        error => MaterialService.toast(error.error.message),
        () => {
          // hide event window
          this.eventWindow.hideEventWindow();
          // refresh map
          this.refreshMap();
          // refresh grid
          this.onRefreshGrid.emit();
        }
      );
    }
  }

  // event window
  okEvenwinBtn() {
    if (this.actionEventWindow === 'move') {
      this.changeCoords(this.id_node_move, this.n_coord, this.e_coord);
    }
    if (this.actionEventWindow === 'visibility') {
      this.visibilityItem(this.id_node_del);
    }
    if (this.actionEventWindow === 'del') {
      this.delItem(this.id_node_del);
    }
  }

  // save result edit window
  saveEditwinBtn() {
    // refresh map
    this.refreshMap();
    // refresh grid
    this.onRefreshGrid.emit();
  }

  // error message
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
