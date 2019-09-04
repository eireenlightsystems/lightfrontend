// angular lib
import {Component, OnInit, OnDestroy, ViewChild, Input} from '@angular/core';
// jqwidgets
// app interfaces
import {Contract, Owner, EquipmentType, HeightType, Installer, Substation, NavItem} from '../../shared/interfaces';
// app services
// app components
import {NodeMasterdetailsPageComponent} from './node-masterdetails-page/node-masterdetails-page.component';
import {NodemapPageComponent} from './nodemap-page/nodemap-page.component';


@Component({
  selector: 'app-node-page',
  templateUrl: './node-page.component.html',
  styleUrls: ['./node-page.component.css']
})

export class NodePageComponent implements OnInit, OnDestroy {

  // variables from parent component
  @Input() siteMap: NavItem[];
  @Input() tabsWidth: number;
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

  // determine the functions that need to be performed in the parent component

  // define variables - link to view objects
  @ViewChild('nodeMasterdetailsPageComponent', {static: false}) nodeMasterdetailsPageComponent: NodeMasterdetailsPageComponent;
  @ViewChild('nodemapPageComponent', {static: false}) nodemapPageComponent: NodemapPageComponent;

  // other variables


  constructor() {
  }

  ngOnInit() {

  }

  ngOnDestroy() {

  }

  refreshGrid() {

  }

  refreshMap() {

  }
}
