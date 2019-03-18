import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';

import {
  Contract,
  FixtureType, GatewayType,
  Geograph, HeightType, Installer,
  NodeType,
  Owner_fixture, Owner_gateway,
  Owner_node, OwnerSensor, SensorType, Substation
} from '../../shared/interfaces';
import {GeographService} from '../../shared/services/geograph/geograph.service';
import {Owner_nodeService} from '../../shared/services/node/owner_node';
import {NodeTypeService} from '../../shared/services/node/nodeType.service';
import {Contract_nodeService} from '../../shared/services/node/contract_node.service';
import {Owner_fixtureService} from '../../shared/services/fixture/owner_fixture.service';
import {FixtureTypeService} from '../../shared/services/fixture/fixtureType.service';
import {SubstationService} from '../../shared/services/fixture/substation.service';
import {NodeMasterdetailsPageComponent} from './node-masterdetails-page/node-masterdetails-page.component';
import {NodemapPageComponent} from './nodemap-page/nodemap-page.component';
import {Contract_fixtureService} from '../../shared/services/fixture/contract_fixture.service';
import {Installer_fixtureService} from '../../shared/services/fixture/installer_fixture.service';
import {HeightTypeService} from '../../shared/services/fixture/heightType.service';
import {Owner_gatewayService} from '../../shared/services/gateway/owner_gateway';
import {GatewayTypeService} from '../../shared/services/gateway/gatewayType.service';
import {Contract_gatewayService} from '../../shared/services/gateway/contract_gateway.service';
import {OwnerSensorService} from '../../shared/services/sensor/ownerSensor';
import {SensorTypeService} from '../../shared/services/sensor/sensorType.service';
import {ContractSensorService} from '../../shared/services/sensor/contractSensor.service';

@Component({
  selector: 'app-node-page',
  templateUrl: './node-page.component.html',
  styleUrls: ['./node-page.component.css']
})

export class NodePageComponent implements OnInit, OnDestroy {

  // define variables - link to view objects
  @ViewChild('nodeMasterdetailsPageComponent') nodeMasterdetailsPageComponent: NodeMasterdetailsPageComponent;
  @ViewChild('nodemapPageComponent') nodemapPageComponent: NodemapPageComponent;

  isSourceChangeTab0: boolean;
  isSourceChangeTab1: boolean;

  // node subscription
  geographSub: Subscription;
  ownerSub: Subscription;
  nodeTypeSub: Subscription;
  contractSub: Subscription;

  // fixture subscription
  owner_fixtureSub: Subscription;
  fixtureTypeSub: Subscription;
  substationSub: Subscription;
  contract_fixtureSub: Subscription;
  installerSub: Subscription;
  heightTypeSub: Subscription;

  // gateway subscription
  owner_gatewaySub: Subscription;
  gatewayTypeSub: Subscription;
  contract_gatewaySub: Subscription;

  // sensor subscription
  ownerSensorSub: Subscription;
  sensorTypeSub: Subscription;
  contractSensorSub: Subscription;

  // node source
  geographs: Geograph[];
  owner_nodes: Owner_node[];
  nodeTypes: NodeType[];
  contract_nodes: Contract[];

  // fixture source
  owner_fixtures: Owner_fixture[];
  fixtureTypes: FixtureType[];
  substations: Substation[];
  contract_fixtures: Contract[];
  installers: Installer[];
  heightTypes: HeightType[];

  // gateway source
  owner_gateways: Owner_gateway[];
  gatewayTypes: GatewayType[];
  contract_gateways: Contract[];

  // sensor source
  ownerSensors: OwnerSensor[];
  sensorTypes: SensorType[];
  contractSensors: Contract[];

  constructor(
    // node service
    private geographService: GeographService,
    private owner_nodeService: Owner_nodeService,
    private nodeTypeService: NodeTypeService,
    private contract_nodeService: Contract_nodeService,
    // fixture service
    private owner_fixtureService: Owner_fixtureService,
    private fixtureTypeService: FixtureTypeService,
    private substationService: SubstationService,
    private contract_fixtureService: Contract_fixtureService,
    private installerService: Installer_fixtureService,
    private heightTypeService: HeightTypeService,
    // gateway service
    private owner_gatewayService: Owner_gatewayService,
    private gatewayTypeService: GatewayTypeService,
    private contract_gatewayService: Contract_gatewayService,
    // sensor service
    private ownerSensorService: OwnerSensorService,
    private sensorTypeService: SensorTypeService,
    private contractSensorService: ContractSensorService,
  ) {
  }

  ngOnInit() {
    this.isSourceChangeTab0 = false;
    this.isSourceChangeTab1 = false;
    this.fetch_refbook();
  }

  ngOnDestroy() {
    // node subscription
    this.geographSub.unsubscribe();
    this.ownerSub.unsubscribe();
    this.nodeTypeSub.unsubscribe();
    this.contractSub.unsubscribe();

    // fixture subscription
    this.owner_fixtureSub.unsubscribe();
    this.fixtureTypeSub.unsubscribe();
    this.substationSub.unsubscribe();
    this.contract_fixtureSub.unsubscribe();
    this.installerSub.unsubscribe();
    this.heightTypeSub.unsubscribe();

    // gateway subscription
    this.owner_gatewaySub.unsubscribe();
    this.gatewayTypeSub.unsubscribe();
    this.contract_gatewaySub.unsubscribe();

    // sensor subscription
    this.ownerSensorSub.unsubscribe();
    this.sensorTypeSub.unsubscribe();
    this.contractSensorSub.unsubscribe();
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

  fetch_refbook() {
    // node refbook
    this.geographSub = this.geographService.fetch().subscribe(geographs => this.geographs = geographs);
    this.ownerSub = this.owner_nodeService.fetch().subscribe(owners => this.owner_nodes = owners);
    this.nodeTypeSub = this.nodeTypeService.fetch().subscribe(nodeTypes => this.nodeTypes = nodeTypes);
    this.contractSub = this.contract_nodeService.fetch().subscribe(contracts => this.contract_nodes = contracts);

    // fixture refbook
    this.owner_fixtureSub = this.owner_fixtureService.fetch().subscribe(owners => this.owner_fixtures = owners);
    this.fixtureTypeSub = this.fixtureTypeService.fetch().subscribe(fixtureTypes => this.fixtureTypes = fixtureTypes);
    this.substationSub = this.substationService.fetch().subscribe(substations => this.substations = substations);
    this.contract_fixtureSub = this.contract_fixtureService.fetch().subscribe(contracts => this.contract_fixtures = contracts);
    this.installerSub = this.installerService.fetch().subscribe(installers => this.installers = installers);
    this.heightTypeSub = this.heightTypeService.fetch().subscribe(heightTypes => this.heightTypes = heightTypes);

    // gateway refbook
    this.owner_gatewaySub = this.owner_gatewayService.fetch().subscribe(owners => this.owner_gateways = owners);
    this.gatewayTypeSub = this.gatewayTypeService.fetch().subscribe(gatewayTypes => this.gatewayTypes = gatewayTypes);
    this.contract_gatewaySub = this.contract_gatewayService.fetch().subscribe(contracts => this.contract_gateways = contracts);

    // sensor refbook
    this.ownerSensorSub = this.ownerSensorService.fetch().subscribe(owners => this.ownerSensors = owners);
    this.sensorTypeSub = this.sensorTypeService.fetch().subscribe(sensorTypes => this.sensorTypes = sensorTypes);
    this.contractSensorSub = this.contractSensorService.fetch().subscribe(contracts => this.contractSensors = contracts);
  }
}
