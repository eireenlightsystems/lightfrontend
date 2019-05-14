import {Component, OnInit, OnDestroy, ViewChild, Input} from '@angular/core';

import {Contract, Geograph, Owner, EquipmentType, HeightType, Installer, Substation} from '../../shared/interfaces';
import {NodeMasterdetailsPageComponent} from './node-masterdetails-page/node-masterdetails-page.component';
import {NodemapPageComponent} from './nodemap-page/nodemap-page.component';


@Component({
  selector: 'app-node-page',
  templateUrl: './node-page.component.html',
  styleUrls: ['./node-page.component.css']
})

export class NodePageComponent implements OnInit, OnDestroy {

  // variables from master component
  @Input() geographs: Geograph[];
  // fixture source
  @Input() ownerFixtures: Owner[];
  @Input() fixtureTypes: EquipmentType[];
  @Input() substations: Substation[];
  @Input() contractFixtures: Contract[];
  @Input() installers: Installer[];
  @Input() heightTypes: HeightType[];
  // node source
  @Input() ownerNodes: Owner[];
  @Input() nodeTypes: EquipmentType[];
  @Input() contractNodes: Contract[];
  // gateway source
  @Input() ownerGateways: Owner[];
  @Input() gatewayTypes: EquipmentType[];
  @Input() contractGateways: Contract[];
  // sensor source
  @Input() ownerSensors: Owner[];
  @Input() sensorTypes: EquipmentType[];
  @Input() contractSensors: Contract[];

  // define variables - link to view objects
  @ViewChild('nodeMasterdetailsPageComponent') nodeMasterdetailsPageComponent: NodeMasterdetailsPageComponent;
  @ViewChild('nodemapPageComponent') nodemapPageComponent: NodemapPageComponent;

  isSourceChangeTab0: boolean;
  isSourceChangeTab1: boolean;


  constructor() {
  }

  ngOnInit() {
    this.isSourceChangeTab0 = true;
    this.isSourceChangeTab1 = false;
  }

  ngOnDestroy() {
  }

  selected(event: any): void {
    if (event.args.item === 0 && this.isSourceChangeTab1) {
      this.refreshTab0();
    }
    if (event.args.item === 1 && this.isSourceChangeTab0) {
      this.refreshTab1();
    }
  }

  refreshTab0() {
    this.nodeMasterdetailsPageComponent.refreshGrid();
    this.isSourceChangeTab1 = false;
  }

  refreshTab1() {
    this.nodemapPageComponent.refreshMap();
    this.isSourceChangeTab0 = false;
  }

  refreshGrid() {
    this.isSourceChangeTab1 = true;
  }

  refreshMap() {
    this.isSourceChangeTab0 = true;
  }

}
