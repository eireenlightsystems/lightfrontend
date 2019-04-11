import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';

import {Contract, Geograph, Owner, EquipmentType, HeightType, Installer, Substation} from '../../shared/interfaces';
import {GeographService} from '../../shared/services/geograph/geograph.service';
import {OwnerNodeService} from '../../shared/services/node/ownerNode';
import {NodeTypeService} from '../../shared/services/node/nodeType.service';
import {ContractNodeService} from '../../shared/services/node/contractNode.service';
import {OwnerFixtureService} from '../../shared/services/fixture/ownerFixture.service';
import {FixtureTypeService} from '../../shared/services/fixture/fixtureType.service';
import {SubstationService} from '../../shared/services/fixture/substation.service';
import {NodeMasterdetailsPageComponent} from './node-masterdetails-page/node-masterdetails-page.component';
import {NodemapPageComponent} from './nodemap-page/nodemap-page.component';
import {ContractFixtureService} from '../../shared/services/fixture/contractFixture.service';
import {InstallerFixtureService} from '../../shared/services/fixture/installerFixture.service';
import {HeightTypeService} from '../../shared/services/fixture/heightType.service';
import {OwnerGatewayService} from '../../shared/services/gateway/ownerGateway';
import {GatewayTypeService} from '../../shared/services/gateway/gatewayType.service';
import {ContractGatewayService} from '../../shared/services/gateway/contractGateway.service';
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
  ownerGatewaySub: Subscription;
  gatewayTypeSub: Subscription;
  contractGatewaySub: Subscription;

  // sensor subscription
  ownerSensorSub: Subscription;
  sensorTypeSub: Subscription;
  contractSensorSub: Subscription;

  // node source
  geographs: Geograph[];
  ownerNodes: Owner[];
  nodeTypes: EquipmentType[];
  contractNodes: Contract[];

  // fixture source
  owner_fixtures: Owner[];
  fixtureTypes: EquipmentType[];
  substations: Substation[];
  contract_fixtures: Contract[];
  installers: Installer[];
  heightTypes: HeightType[];

  // gateway source
  ownerGateways: Owner[];
  gatewayTypes: EquipmentType[];
  contractGateways: Contract[];

  // sensor source
  ownerSensors: Owner[];
  sensorTypes: EquipmentType[];
  contractSensors: Contract[];

  constructor(
    // node service
    private geographService: GeographService,
    private ownerNodeService: OwnerNodeService,
    private nodeTypeService: NodeTypeService,
    private contractNodeService: ContractNodeService,
    // fixture service
    private owner_fixtureService: OwnerFixtureService,
    private fixtureTypeService: FixtureTypeService,
    private substationService: SubstationService,
    private contract_fixtureService: ContractFixtureService,
    private installerService: InstallerFixtureService,
    private heightTypeService: HeightTypeService,
    // gateway service
    private ownerGatewayService: OwnerGatewayService,
    private gatewayTypeService: GatewayTypeService,
    private contractGatewayService: ContractGatewayService,
    // sensor service
    private ownerSensorService: OwnerSensorService,
    private sensorTypeService: SensorTypeService,
    private contractSensorService: ContractSensorService,
  ) {
  }

  ngOnInit() {
    this.isSourceChangeTab0 = true;
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
    this.ownerGatewaySub.unsubscribe();
    this.gatewayTypeSub.unsubscribe();
    this.contractGatewaySub.unsubscribe();

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
    this.ownerSub = this.ownerNodeService.fetch().subscribe(owners => this.ownerNodes = owners);
    this.nodeTypeSub = this.nodeTypeService.fetch().subscribe(nodeTypes => this.nodeTypes = nodeTypes);
    this.contractSub = this.contractNodeService.fetch().subscribe(contracts => this.contractNodes = contracts);

    // fixture refbook
    this.owner_fixtureSub = this.owner_fixtureService.fetch().subscribe(owners => this.owner_fixtures = owners);
    this.fixtureTypeSub = this.fixtureTypeService.fetch().subscribe(fixtureTypes => this.fixtureTypes = fixtureTypes);
    this.substationSub = this.substationService.fetch().subscribe(substations => this.substations = substations);
    this.contract_fixtureSub = this.contract_fixtureService.fetch().subscribe(contracts => this.contract_fixtures = contracts);
    this.installerSub = this.installerService.fetch().subscribe(installers => this.installers = installers);
    this.heightTypeSub = this.heightTypeService.fetch().subscribe(heightTypes => this.heightTypes = heightTypes);

    // gateway refbook
    this.ownerGatewaySub = this.ownerGatewayService.fetch().subscribe(owners => this.ownerGateways = owners);
    this.gatewayTypeSub = this.gatewayTypeService.fetch().subscribe(gatewayTypes => this.gatewayTypes = gatewayTypes);
    this.contractGatewaySub = this.contractGatewayService.fetch().subscribe(contracts => this.contractGateways = contracts);

    // sensor refbook
    this.ownerSensorSub = this.ownerSensorService.fetch().subscribe(owners => this.ownerSensors = owners);
    this.sensorTypeSub = this.sensorTypeService.fetch().subscribe(sensorTypes => this.sensorTypes = sensorTypes);
    this.contractSensorSub = this.contractSensorService.fetch().subscribe(contracts => this.contractSensors = contracts);
  }
}
