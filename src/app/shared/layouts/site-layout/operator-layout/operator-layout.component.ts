// angular lib
import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {MaterializeService} from '../../../classes/materialize.service';
// jqwidgets
// app interfaces
import {
  CommandStatus,
  CommandType, CompanyDepartment,
  Contract,
  EquipmentType,
  FixtureGroupType, FixtureType, GatewayType,
  HeightType,
  Installer, NavItem, NodeType,
  Owner, Person, SensorType,
  Substation
} from '../../../interfaces';
// app services
import {OwnerFixtureService} from '../../../services/fixture/ownerFixture.service';
import {SubstationService} from '../../../services/fixture/substation.service';
import {ContractFixtureService} from '../../../services/fixture/contractFixture.service';
import {InstallerFixtureService} from '../../../services/fixture/installerFixture.service';
import {HeightTypeService} from '../../../services/fixture/heightType.service';
import {FixtureGroupService} from '../../../services/fixture/fixtureGroup.service';
import {CommandSwitchTypeService} from '../../../services/command/commandSwitchType.service';
import {CommandSpeedTypeService} from '../../../services/command/commandSpeedType.service';
import {CommandStatusService} from '../../../services/command/commandStatus.service';
import {SpeedDirectionService} from '../../../services/command/speedDirection';
import {OwnerNodeService} from '../../../services/node/ownerNode';
import {ContractNodeService} from '../../../services/node/contractNode.service';
import {OwnerGatewayService} from '../../../services/gateway/ownerGateway';
import {GatewayTypeService} from '../../../services/gateway/gatewayType.service';
import {ContractGatewayService} from '../../../services/gateway/contractGateway.service';
import {OwnerSensorService} from '../../../services/sensor/ownerSensor';
import {ContractSensorService} from '../../../services/sensor/contractSensor.service';
import {NodeService} from '../../../services/node/node.service';
import {SensorService} from '../../../services/sensor/sensor.service';
import {GatewayService} from '../../../services/gateway/gateway.service';
import {FixtureService} from '../../../services/fixture/fixture.service';
import {MediaMatcher} from '@angular/cdk/layout';

// app components


@Component({
  selector: 'app-operator-layout',
  templateUrl: './operator-layout.component.html',
  styleUrls: ['./operator-layout.component.css']
})
export class OperatorLayoutComponent implements OnInit, OnDestroy, AfterViewInit {

  // variables from parent component
  @Input() siteMap: NavItem[];
  @Input() tabsWidth: number;
  @Input() contracts: Contract[];
  @Input() fixtureTypes: FixtureType[];
  @Input() nodeTypes: NodeType[];
  @Input() gatewayTypes: GatewayType[];
  @Input() sensorTypes: SensorType[];
  @Input() companies: CompanyDepartment[];
  @Input() persons: Person[];
  @Input() substations: Substation[];

  // determine the functions that need to be performed in the parent component

  // define variables - link to view objects
  @ViewChild('floating', {static: false}) floatingRef: ElementRef;

  // other variables
  mobileQuery: MediaQueryList;
  private mobileQueryListener: () => void;
  // subscription
  // geographSub: Subscription;
  // fixture subscription
  ownerFixtureSub: Subscription;
  // fixtureTypeSub: Subscription;
  // substationSub: Subscription;
  // contractFixtureSub: Subscription;
  // installerSub: Subscription;
  heightTypeSub: Subscription;
  // fixture group subscription
  fixtureGroupTypeSub: Subscription;
  fixtureGroupOwnerSub: Subscription;
  // fixturecom subscription
  commandTypeSub: Subscription;
  commandStatusSub: Subscription;
  speedDirectionSub: Subscription;
  // node subscription
  ownerSub: Subscription;
  // nodeTypeSub: Subscription;
  // contractSub: Subscription;
  // gateway subscription
  ownerGatewaySub: Subscription;
  // gatewayTypeSub: Subscription;
  // contractGatewaySub: Subscription;
  // sensor subscription
  ownerSensorSub: Subscription;
  // sensorTypeSub: Subscription;
  // contractSensorSub: Subscription;

  // source
  // geographs: Geograph[];
  // fixture source
  ownerFixtures: Owner[];
  // fixtureTypes: EquipmentType[];
  // substations: Substation[];
  // contractFixtures: Contract[];
  // installers: Installer[];
  heightTypes: HeightType[];
  // fixture group source
  fixtureGroupTypes: FixtureGroupType[];
  fixtureGroupOwners: Owner[];
  // fixturecom source
  commandTypes: CommandType[];
  commandStatuses: CommandStatus[];
  speedDirectiones: CommandType[];
  // node source
  ownerNodes: Owner[];
  // nodeTypes: EquipmentType[];
  // contractNodes: Contract[];
  // gateway source
  ownerGateways: Owner[];
  // gatewayTypes: EquipmentType[];
  // contractGateways: Contract[];
  // sensor source
  ownerSensors: Owner[];
  // sensorTypes: EquipmentType[];
  // contractSensors: Contract[];


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    // service
    // fixture service
    private fixtureService: FixtureService,
    private ownerFixtureService: OwnerFixtureService,
    // private substationService: SubstationService,
    // private contractFixtureService: ContractFixtureService,
    // private installerService: InstallerFixtureService,
    private heightTypeService: HeightTypeService,
    // fixture group service
    private fixtureGroupService: FixtureGroupService,
    // fixturecom service
    private commandTypeService: CommandSwitchTypeService,
    private commandSpeedTypeService: CommandSpeedTypeService,
    private commandStatusService: CommandStatusService,
    private speedDirectionService: SpeedDirectionService,
    // node service
    private nodeService: NodeService,
    private ownerNodeService: OwnerNodeService,
    // private contractNodeService: ContractNodeService,
    // gateway service
    private gatewayService: GatewayService,
    private ownerGatewayService: OwnerGatewayService,
    // private gatewayTypeService: GatewayTypeService,
    // private contractGatewayService: ContractGatewayService,
    // sensor service
    private sensorService: SensorService,
    private ownerSensorService: OwnerSensorService,
    // private contractSensorService: ContractSensorService,
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 1320px)');
    this.mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this.mobileQueryListener);
  }

  ngOnInit() {
    this.fetch_refbook();
  }

  ngAfterViewInit() {
    if (this.mobileQuery.matches === true) {
      MaterializeService.initializeFloatingButton(this.floatingRef);
    }
  }

  ngOnDestroy(): void {
    // subscription
    // fixture subscription
    this.ownerFixtureSub.unsubscribe();
    // this.fixtureTypeSub.unsubscribe();
    // this.substationSub.unsubscribe();
    // this.contractFixtureSub.unsubscribe();
    // this.installerSub.unsubscribe();
    this.heightTypeSub.unsubscribe();
    // fixture group subscription
    this.fixtureGroupTypeSub.unsubscribe();
    this.fixtureGroupOwnerSub.unsubscribe();
    // fixturecom subscription
    this.commandTypeSub.unsubscribe();
    this.commandStatusSub.unsubscribe();
    this.speedDirectionSub.unsubscribe();
    // node subscription
    this.ownerSub.unsubscribe();
    // this.nodeTypeSub.unsubscribe();
    // this.contractSub.unsubscribe();
    // gateway subscription
    this.ownerGatewaySub.unsubscribe();
    // this.gatewayTypeSub.unsubscribe();
    // this.contractGatewaySub.unsubscribe();
    // sensor subscription
    this.ownerSensorSub.unsubscribe();
    // this.sensorTypeSub.unsubscribe();
    // this.contractSensorSub.unsubscribe();
  }

  fetch_refbook() {
    // refbook

    // fixture refbook
    this.ownerFixtureSub = this.ownerFixtureService.fetch().subscribe(owners => this.ownerFixtures = owners);
    // this.fixtureTypeSub = this.fixtureService.getFixtureTypes().subscribe(fixtureTypes => this.fixtureTypes = fixtureTypes);
    // this.substationSub = this.substationService.fetch().subscribe(substations => this.substations = substations);
    // this.contractFixtureSub = this.contractFixtureService.fetch().subscribe(contracts => this.contractFixtures = contracts);
    // this.installerSub = this.installerService.fetch().subscribe(installers => this.installers = installers);
    this.heightTypeSub = this.heightTypeService.fetch().subscribe(heightTypes => this.heightTypes = heightTypes);

    // fixture group
    this.fixtureGroupTypeSub = this.fixtureGroupService.getFixtureGroupTypeAll().subscribe(
      fixtureGroupTypes => this.fixtureGroupTypes = fixtureGroupTypes);
    this.fixtureGroupOwnerSub = this.fixtureGroupService.getFixtureGroupOwnerAll().subscribe(
      fixtureGroupOwners => this.fixtureGroupOwners = fixtureGroupOwners);

    // fixturecom refbook
    this.commandTypeSub = this.commandTypeService.fetch().subscribe(commandTypes => this.commandTypes = commandTypes);
    this.commandStatusSub = this.commandStatusService.fetch().subscribe(commandStatuses => this.commandStatuses = commandStatuses);
    this.speedDirectionSub = this.speedDirectionService.fetch().subscribe(speedDirectiones => this.speedDirectiones = speedDirectiones);

    // node refbook
    this.ownerSub = this.ownerNodeService.fetch().subscribe(owners => this.ownerNodes = owners);
    // this.nodeTypeSub = this.nodeService.getNodeTypes().subscribe(nodeTypes => this.nodeTypes = nodeTypes);
    // this.contractSub = this.contractNodeService.fetch().subscribe(contracts => this.contractNodes = contracts);

    // gateway refbook
    this.ownerGatewaySub = this.ownerGatewayService.fetch().subscribe(owners => this.ownerGateways = owners);
    // this.gatewayTypeSub = this.gatewayService.getGatewayTypes().subscribe(gatewayTypes => this.gatewayTypes = gatewayTypes);
    // this.contractGatewaySub = this.contractGatewayService.fetch().subscribe(contracts => this.contractGateways = contracts);

    // sensor refbook
    this.ownerSensorSub = this.ownerSensorService.fetch().subscribe(owners => this.ownerSensors = owners);
    // this.sensorTypeSub = this.sensorService.getSensorTypes().subscribe(sensorTypes => this.sensorTypes = sensorTypes);
    // this.contractSensorSub = this.contractSensorService.fetch().subscribe(contracts => this.contractSensors = contracts);
  }

  isFixtureVisible() {
    return !(this.router.url === '/operator/fixture');
  }

  isNodeVisible() {
    return !(this.router.url === '/operator/node');
  }

  isGatewayVisible() {
    return !(this.router.url === '/operator/gateway');
  }

  isSensorVisible() {
    return !(this.router.url === '/operator/sensor');
  }
}
