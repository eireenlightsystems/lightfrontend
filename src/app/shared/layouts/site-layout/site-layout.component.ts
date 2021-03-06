// angular lib
import {AfterViewInit, ChangeDetectorRef, Component, NgZone, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {FlatTreeControl} from '@angular/cdk/tree';
import {MatSidenav, MatTree, MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material';
import {MediaMatcher} from '@angular/cdk/layout';
import {TranslateService} from '@ngx-translate/core';
import {isUndefined} from 'util';
import {NgxUiLoaderService} from 'ngx-ui-loader';
import {HttpClient} from '@angular/common/http';
// jqwidgets
// app interfaces
import {
  CompanyDepartment,
  Components,
  Contract,
  ContractType,
  FixtureType,
  GatewayType,
  NavItem,
  NodeType,
  Person,
  SensorType, Substation,
  User
} from '../../interfaces';

// flat node with expandable and level information
interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  disabled?: boolean;
  iconName: string;
  route?: string;
  level: number;
}

// app services
import {AuthService} from '../../services/auth.service';
import {UserService} from '../../services/admin/user.service';
import {ComponentService} from '../../services/admin/component.service';
import {ContractService} from '../../services/contract/contract.service';
import {ContractTypeService} from '../../services/contract/contractType.service';
import {FixtureTypeService} from '../../services/fixture/fixtureType.service';
import {NodeTypeService} from '../../services/node/nodeType.service';
import {GatewayTypeService} from '../../services/gateway/gatewayType.service';
import {SensorTypeService} from '../../services/sensor/sensorType.service';
import {CompanyService} from '../../services/contragent/company.service';
import {PersonService} from '../../services/contragent/person.service';
import {SubstationService} from '../../services/contragent/substation.service';
// app components
import {AdminLayoutComponent} from './admin-layout/admin-layout.component';
import {DictionaryLayoutComponent} from './dictionary-layout/dictionary-layout.component';
import {MatSnackBar} from '@angular/material/snack-bar';


@Component({
  selector: 'app-site-layout',
  templateUrl: './site-layout.component.html',
  styleUrls: ['./site-layout.component.css']
})
export class SiteLayoutComponent implements OnInit, AfterViewInit, OnDestroy {

  // variables from parent component

  // determine the functions that need to be performed in the parent component

  // define variables - link to view objects
  @ViewChild('snav', {static: false}) snav: MatSidenav;
  @ViewChild('matTtree', {static: false}) matTtree: MatTree<any>;
  @ViewChild('adminLayoutComponent', {static: false}) adminLayoutComponent: AdminLayoutComponent;
  @ViewChild('dictionaryLayout', {static: false}) dictionaryLayout: DictionaryLayoutComponent;

  // other variables
  version = '1.0.0';
  language = 'en';
  aSub: Subscription;
  offset = 0;
  limit = 100000;
  mobileQuery: MediaQueryList;
  private mobileQueryListener: () => void;
  changeMenu = 1320; // 960
  // dictionary
  userSub: Subscription;
  componentSub: Subscription;
  oSubContracts: Subscription;
  oSubContractTypes: Subscription;
  oSubFixtureType: Subscription;
  oSubNodeType: Subscription;
  oSubGatewayType: Subscription;
  oSubSensorType: Subscription;
  oSubCompanies: Subscription;
  oSubPersons: Subscription;
  oSubSubstations: Subscription;

  users: User[] = [];
  user: User = new User();
  components: Components[] = [];
  contracts: Contract[] = [];
  contractTypes: ContractType[] = [];
  fixtureTypes: FixtureType[] = [];
  nodeTypes: NodeType[] = [];
  gatewayTypes: GatewayType[] = [];
  sensorTypes: SensorType[] = [];
  companies: CompanyDepartment[] = [];
  persons: Person[] = [];
  substations: Substation[] = [];

  // sidenav param
  sidenavWidth = 70;
  sidenavWidthMin = 70;
  sidenavWidthMax = 230;
  sidenavContentMarginLeft = 0;
  isSidenavMax = false;
  screenHeight: number;
  screenWidth: number;
  tabsWidth = 99.9;
  // Left tree-menu in mat-sidenav
  siteMap: NavItem[];
  navItems: NavItem[];
  navItemsOperator: NavItem[];
  navItemsEquipment: NavItem[];
  navItemsContragent: NavItem[];
  navItemsContract: NavItem[];
  navItemsAdmin: NavItem[];
  navItemsReport: NavItem[];
  private transformer = (node: NavItem, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0 && node.expandable === true,
      name: node.displayName,
      disabled: node.disabled,
      iconName: node.iconName,
      route: node.route,
      level: level
    };
  };
  treeControl: any = new FlatTreeControl<ExampleFlatNode>(
    node => node.level, node => node.expandable);
  treeFlattener = new MatTreeFlattener(
    this.transformer, node => node.level, node => node.expandable, node => node.children);
  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  dataSourceOnMobile = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);


  constructor(private router: Router,
              changeDetectorRef: ChangeDetectorRef,
              media: MediaMatcher,
              private ngZone: NgZone,
              private _snackBar: MatSnackBar,
              // service
              private auth: AuthService,
              public translate: TranslateService,
              private http: HttpClient,
              private ngxLoader: NgxUiLoaderService,
              // get rights info
              private userService: UserService,
              private componentService: ComponentService,
              // get dictionary
              private contractService: ContractService,
              private contractTypeService: ContractTypeService,
              private fixtureTypeService: FixtureTypeService,
              private nodeTypeService: NodeTypeService,
              private gatewayTypeService: GatewayTypeService,
              private sensorTypeService: SensorTypeService,
              private companyService: CompanyService,
              private personService: PersonService,
              private substationService: SubstationService
  ) {
    this.mobileQuery = media.matchMedia(`(max-width: ${this.changeMenu}px)`);
    this.mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this.mobileQueryListener);

    // translate instructions
    // translate.addLangs(['en', 'ru']);
    // translate.setDefaultLang('en');

    // screen change
    window.onresize = (e) => {
      ngZone.run(() => {
        // console.log(window.innerWidth);
        // console.log(window.innerHeight);
        this.screenHeight = window.innerHeight;
        this.screenWidth = window.innerWidth;
        if (this.screenWidth < 1300) {
          this.tabsWidth = 99.9;
        }
      });
    };
  }

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;

  ngOnInit(): void {
    // get user list
    this.getUsers();

    // set current language
    this.language = !isUndefined(this.translate.currentLang) ? this.translate.currentLang : 'en';
    this.translate.use(this.language);

    this.siteMap = [
      {
        displayName: 'site.menu.operator.operation',
        rolerightId: 0,
        componentName: 'operator-layout',
        disabled: true,
        expandable: true,
        iconName: 'touch_app',
        route: '/operator',
        children: [
          {
            displayName: 'site.menu.operator.fixture-page.fixture-page',
            rolerightId: 0,
            componentName: 'fixture-page',
            disabled: true,
            expandable: false,
            iconName: 'lightbulb_outline',
            route: '/operator/fixture',
            children: [
              {
                displayName: 'site.menu.operator.fixture-page.fixture-masterdetails-page.fixture-masterdetails-page',
                rolerightId: 0,
                componentName: 'fixture-masterdetails-page',
                disabled: true,
                expandable: false,
                iconName: '',
                route: '',
                children: [
                  {
                    displayName: 'site.menu.operator.fixture-page.fixture-masterdetails-page.fixturelist-page.fixturelist-page',
                    rolerightId: 0,
                    componentName: 'fixturelist-page',
                    disabled: true,
                    expandable: false,
                    iconName: '',
                    route: '',
                    children: [
                      {
                        displayName: 'site.menu.operator.fixture-page.fixture-masterdetails-page.fixturelist-page.fixturelist-page-ins',
                        rolerightId: 0,
                        componentName: 'fixturelist-page-ins',
                        disabled: true,
                        expandable: false,
                        iconName: '',
                        route: '',
                        children: []
                      },
                      {
                        displayName: 'site.menu.operator.fixture-page.fixture-masterdetails-page.fixturelist-page.fixturelist-page-upd',
                        rolerightId: 0,
                        componentName: 'fixturelist-page-upd',
                        disabled: true,
                        expandable: false,
                        iconName: '',
                        route: '',
                        children: []
                      },
                      {
                        displayName: 'site.menu.operator.fixture-page.fixture-masterdetails-page.fixturelist-page.fixturelist-page-del',
                        rolerightId: 0,
                        componentName: 'fixturelist-page-del',
                        disabled: true,
                        expandable: false,
                        iconName: '',
                        route: '',
                        children: []
                      },

                      {
                        displayName: 'site.menu.operator.fixture-page.fixture-masterdetails-page.fixturelist-page.fixturelist-page-groupIn',
                        rolerightId: 0,
                        componentName: 'fixturelist-page-groupIn',
                        disabled: true,
                        expandable: false,
                        iconName: '',
                        route: '',
                        children: []
                      },
                      {
                        displayName: 'site.menu.operator.fixture-page.fixture-masterdetails-page.fixturelist-page.fixturelist-page-groupOut',
                        rolerightId: 0,
                        componentName: 'fixturelist-page-groupOut',
                        disabled: true,
                        expandable: false,
                        iconName: '',
                        route: '',
                        children: []
                      },
                      {
                        displayName: 'site.menu.operator.fixture-page.fixture-masterdetails-page.fixturelist-page.fixturelist-page-place',
                        rolerightId: 0,
                        componentName: 'fixturelist-page-place',
                        disabled: true,
                        expandable: false,
                        iconName: '',
                        route: '',
                        children: []
                      },
                      {
                        displayName: 'site.menu.operator.fixture-page.fixture-masterdetails-page.fixturelist-page.fixturelist-page-pinDrop',
                        rolerightId: 0,
                        componentName: 'fixturelist-page-pinDrop',
                        disabled: true,
                        expandable: false,
                        iconName: '',
                        route: '',
                        children: []
                      },
                    ]
                  },
                  {
                    displayName: 'site.menu.operator.fixture-page.fixture-masterdetails-page.fixturecomlist-page.fixturecomlist-page',
                    rolerightId: 0,
                    componentName: 'fixturecomlist-page',
                    disabled: true,
                    expandable: false,
                    iconName: '',
                    route: '',
                    children: [
                      {
                        displayName: 'site.menu.operator.fixture-page.fixture-masterdetails-page.fixturecomlist-page.fixturecomlist-page-del',
                        rolerightId: 0,
                        componentName: 'fixturecomlist-page-del',
                        disabled: true,
                        expandable: false,
                        iconName: '',
                        route: '',
                        children: []
                      },
                      {
                        displayName: 'site.menu.operator.fixture-page.fixture-masterdetails-page.fixturecomlist-page.fixturecomlist-page-switchOn',
                        rolerightId: 0,
                        componentName: 'fixturecomlist-page-switchOn',
                        disabled: true,
                        expandable: false,
                        iconName: '',
                        route: '',
                        children: []
                      },
                      {
                        displayName: 'site.menu.operator.fixture-page.fixture-masterdetails-page.fixturecomlist-page.fixturecomlist-page-switchOff',
                        rolerightId: 0,
                        componentName: 'fixturecomlist-page-switchOff',
                        disabled: true,
                        expandable: false,
                        iconName: '',
                        route: '',
                        children: []
                      },
                    ]
                  },
                  {
                    displayName: 'site.menu.operator.fixture-page.fixture-masterdetails-page.fixturecomspeedlist-page.fixturecomspeedlist-page',
                    rolerightId: 0,
                    componentName: 'fixturecomspeedlist-page',
                    disabled: true,
                    expandable: false,
                    iconName: '',
                    route: '',
                    children: [
                      {
                        displayName: 'site.menu.operator.fixture-page.fixture-masterdetails-page.fixturecomspeedlist-page.fixturecomspeedlist-page-ins',
                        rolerightId: 0,
                        componentName: 'fixturecomspeedlist-page-ins',
                        disabled: true,
                        expandable: false,
                        iconName: '',
                        route: '',
                        children: []
                      },
                      {
                        displayName: 'site.menu.operator.fixture-page.fixture-masterdetails-page.fixturecomspeedlist-page.fixturecomspeedlist-page-del',
                        rolerightId: 0,
                        componentName: 'fixturecomspeedlist-page-del',
                        disabled: true,
                        expandable: false,
                        iconName: '',
                        route: '',
                        children: []
                      },
                    ]
                  },
                ]
              },
              {
                displayName: 'site.menu.operator.fixture-page.fixturegroup-md-page.fixturegroup-md-page',
                rolerightId: 0,
                componentName: 'fixturegroup-md-page',
                disabled: true,
                expandable: false,
                iconName: '',
                route: '',
                children: [
                  {
                    displayName: 'site.menu.operator.fixture-page.fixturegroup-md-page.fixture-grlist-page.fixture-grlist-page',
                    rolerightId: 0,
                    componentName: 'fixture-grlist-page',
                    disabled: true,
                    expandable: false,
                    iconName: '',
                    route: '',
                    children: [
                      {
                        displayName: 'site.menu.operator.fixture-page.fixturegroup-md-page.fixture-grlist-page.fixture-grlist-page-ins',
                        rolerightId: 0,
                        componentName: 'fixture-grlist-page-ins',
                        disabled: true,
                        expandable: false,
                        iconName: '',
                        route: '',
                        children: []
                      },
                      {
                        displayName: 'site.menu.operator.fixture-page.fixturegroup-md-page.fixture-grlist-page.fixture-grlist-page-upd',
                        rolerightId: 0,
                        componentName: 'fixture-grlist-page-upd',
                        disabled: true,
                        expandable: false,
                        iconName: '',
                        route: '',
                        children: []
                      },
                      {
                        displayName: 'site.menu.operator.fixture-page.fixturegroup-md-page.fixture-grlist-page.fixture-grlist-page-del',
                        rolerightId: 0,
                        componentName: 'fixture-grlist-page-del',
                        disabled: true,
                        expandable: false,
                        iconName: '',
                        route: '',
                        children: []
                      },
                      {
                        displayName: 'site.menu.operator.fixture-page.fixturegroup-md-page.fixture-grlist-page.fixture-grlist-page-switchOn',
                        rolerightId: 0,
                        componentName: 'fixture-grlist-page-switchOn',
                        disabled: true,
                        expandable: false,
                        iconName: '',
                        route: '',
                        children: []
                      },
                      {
                        displayName: 'site.menu.operator.fixture-page.fixturegroup-md-page.fixture-grlist-page.fixture-grlist-page-switchOff',
                        rolerightId: 0,
                        componentName: 'fixture-grlist-page-switchOff',
                        disabled: true,
                        expandable: false,
                        iconName: '',
                        route: '',
                        children: []
                      },
                    ]
                  }
                ]
              },
              {
                displayName: 'site.menu.operator.fixture-page.fixturemap-page.fixturemap-page',
                rolerightId: 0,
                componentName: 'fixturemap-page',
                disabled: true,
                expandable: false,
                iconName: '',
                route: '',
                children: []
              },
            ]
          },
          {
            displayName: 'site.menu.operator.node-page.node-page',
            rolerightId: 0,
            componentName: 'node-page',
            disabled: true,
            iconName: 'assistant_photo',
            route: '/operator/node',
            children: [
              {
                displayName: 'site.menu.operator.node-page.node-masterdetails-page.node-masterdetails-page',
                rolerightId: 0,
                componentName: 'node-masterdetails-page',
                disabled: true,
                expandable: false,
                iconName: '',
                route: '',
                children: [
                  {
                    displayName: 'site.menu.operator.node-page.node-masterdetails-page.nodelist-page.nodelist-page',
                    rolerightId: 0,
                    componentName: 'nodelist-page',
                    disabled: true,
                    expandable: false,
                    iconName: '',
                    route: '',
                    children: [
                      {
                        displayName: 'site.menu.operator.node-page.node-masterdetails-page.nodelist-page.nodelist-page-ins',
                        rolerightId: 0,
                        componentName: 'nodelist-page-ins',
                        disabled: true,
                        expandable: false,
                        iconName: '',
                        route: '',
                        children: []
                      },
                      {
                        displayName: 'site.menu.operator.node-page.node-masterdetails-page.nodelist-page.nodelist-page-upd',
                        rolerightId: 0,
                        componentName: 'nodelist-page-upd',
                        disabled: true,
                        expandable: false,
                        iconName: '',
                        route: '',
                        children: []
                      },
                      {
                        displayName: 'site.menu.operator.node-page.node-masterdetails-page.nodelist-page.nodelist-page-del',
                        rolerightId: 0,
                        componentName: 'nodelist-page-del',
                        disabled: true,
                        expandable: false,
                        iconName: '',
                        route: '',
                        children: []
                      },
                      {
                        displayName: 'site.menu.operator.node-page.node-masterdetails-page.nodelist-page.nodelist-page-groupIn',
                        rolerightId: 0,
                        componentName: 'nodelist-page-groupIn',
                        disabled: true,
                        expandable: false,
                        iconName: '',
                        route: '',
                        children: []
                      },
                      {
                        displayName: 'site.menu.operator.node-page.node-masterdetails-page.nodelist-page.nodelist-page-groupOut',
                        rolerightId: 0,
                        componentName: 'nodelist-page-groupOut',
                        disabled: true,
                        expandable: false,
                        iconName: '',
                        route: '',
                        children: []
                      },
                    ]
                  },
                ]
              },
              {
                displayName: 'site.menu.operator.node-page.nodemap-page.nodemap-page',
                rolerightId: 0,
                componentName: 'nodemap-page',
                disabled: true,
                expandable: false,
                iconName: '',
                route: '',
                children: []
              },
            ]
          },
          {
            displayName: 'site.menu.operator.gateway-page.gateway-page',
            rolerightId: 0,
            componentName: 'gateway-page',
            disabled: true,
            iconName: 'router',
            route: '/operator/gateway',
            children: [
              {
                displayName: 'site.menu.operator.gateway-page.gateway-masterdetails-page.gateway-masterdetails-page',
                rolerightId: 0,
                componentName: 'gateway-masterdetails-page',
                disabled: true,
                expandable: false,
                iconName: '',
                route: '',
                children: [
                  {
                    displayName: 'site.menu.operator.gateway-page.gateway-masterdetails-page.gatewaylist-page.gatewaylist-page',
                    rolerightId: 0,
                    componentName: 'gatewaylist-page',
                    disabled: true,
                    expandable: false,
                    iconName: '',
                    route: '',
                    children: [
                      {
                        displayName: 'site.menu.operator.gateway-page.gateway-masterdetails-page.gatewaylist-page.gatewaylist-page-ins',
                        rolerightId: 0,
                        componentName: 'gatewaylist-page-ins',
                        disabled: true,
                        expandable: false,
                        iconName: '',
                        route: '',
                        children: []
                      },
                      {
                        displayName: 'site.menu.operator.gateway-page.gateway-masterdetails-page.gatewaylist-page.gatewaylist-page-upd',
                        rolerightId: 0,
                        componentName: 'gatewaylist-page-upd',
                        disabled: true,
                        expandable: false,
                        iconName: '',
                        route: '',
                        children: []
                      },
                      {
                        displayName: 'site.menu.operator.gateway-page.gateway-masterdetails-page.gatewaylist-page.gatewaylist-page-del',
                        rolerightId: 0,
                        componentName: 'gatewaylist-page-del',
                        disabled: true,
                        expandable: false,
                        iconName: '',
                        route: '',
                        children: []
                      },
                      {
                        displayName: 'site.menu.operator.gateway-page.gateway-masterdetails-page.gatewaylist-page.gatewaylist-page-place',
                        rolerightId: 0,
                        componentName: 'gatewaylist-page-place',
                        disabled: true,
                        expandable: false,
                        iconName: '',
                        route: '',
                        children: []
                      },
                      {
                        displayName: 'site.menu.operator.gateway-page.gateway-masterdetails-page.gatewaylist-page.gatewaylist-page-pinDrop',
                        rolerightId: 0,
                        componentName: 'gatewaylist-page-pinDrop',
                        disabled: true,
                        expandable: false,
                        iconName: '',
                        route: '',
                        children: []
                      },
                    ]
                  },
                ]
              },
              {
                displayName: 'site.menu.operator.gateway-page.gatewaymap-page.gatewaymap-page',
                rolerightId: 0,
                componentName: 'gatewaymap-page',
                disabled: true,
                expandable: false,
                iconName: '',
                route: '',
                children: []
              },
            ]
          },
          {
            displayName: 'site.menu.operator.sensor-page.sensor-page',
            rolerightId: 0,
            componentName: 'sensor-page',
            disabled: true,
            iconName: 'hearing',
            route: '/operator/sensor',
            children: [
              {
                displayName: 'site.menu.operator.sensor-page.sensor-md-page.sensor-md-page',
                rolerightId: 0,
                componentName: 'sensor-md-page',
                disabled: true,
                expandable: false,
                iconName: '',
                route: '',
                children: [
                  {
                    displayName: 'site.menu.operator.sensor-page.sensor-md-page.sensorlist-page.sensorlist-page',
                    rolerightId: 0,
                    componentName: 'sensorlist-page',
                    disabled: true,
                    expandable: false,
                    iconName: '',
                    route: '',
                    children: [
                      {
                        displayName: 'site.menu.operator.sensor-page.sensor-md-page.sensorlist-page.sensorlist-page-ins',
                        rolerightId: 0,
                        componentName: 'sensorlist-page-ins',
                        disabled: true,
                        expandable: false,
                        iconName: '',
                        route: '',
                        children: []
                      },
                      {
                        displayName: 'site.menu.operator.sensor-page.sensor-md-page.sensorlist-page.sensorlist-page-upd',
                        rolerightId: 0,
                        componentName: 'sensorlist-page-upd',
                        disabled: true,
                        expandable: false,
                        iconName: '',
                        route: '',
                        children: []
                      },
                      {
                        displayName: 'site.menu.operator.sensor-page.sensor-md-page.sensorlist-page.sensorlist-page-del',
                        rolerightId: 0,
                        componentName: 'sensorlist-page-del',
                        disabled: true,
                        expandable: false,
                        iconName: '',
                        route: '',
                        children: []
                      },
                      {
                        displayName: 'site.menu.operator.sensor-page.sensor-md-page.sensorlist-page.sensorlist-page-place',
                        rolerightId: 0,
                        componentName: 'sensorlist-page-place',
                        disabled: true,
                        expandable: false,
                        iconName: '',
                        route: '',
                        children: []
                      },
                      {
                        displayName: 'site.menu.operator.sensor-page.sensor-md-page.sensorlist-page.sensorlist-page-pinDrop',
                        rolerightId: 0,
                        componentName: 'sensorlist-page-pinDrop',
                        disabled: true,
                        expandable: false,
                        iconName: '',
                        route: '',
                        children: []
                      },
                    ]
                  },
                ]
              },
            ]
          },
        ]
      },
      {
        displayName: 'site.menu.dictionarys.dictionarys',
        rolerightId: 0,
        componentName: 'dictionary-layout',
        disabled: true,
        expandable: true,
        iconName: 'import_contacts',
        route: '/dictionary',
        children: [
          {
            displayName: 'site.menu.dictionarys.equipment-page.equipments',
            rolerightId: 0,
            componentName: 'equipment-type',
            disabled: true,
            expandable: true,
            iconName: 'build',
            route: '/dictionary/equipment',
            children: [
              {
                displayName: 'site.menu.dictionarys.equipment-page.fixturetype.fixturetypes',
                rolerightId: 0,
                componentName: 'fixturetypes',
                disabled: true,
                iconName: 'lightbulb_outline',
                route: '/dictionary/equipment/fixturetype',
                children: []
              },
              {
                displayName: 'site.menu.dictionarys.equipment-page.nodetype.nodetypes',
                rolerightId: 0,
                componentName: 'nodetypes',
                disabled: true,
                iconName: 'assistant_photo',
                route: '/dictionary/equipment/nodetype',
                children: []
              },
              {
                displayName: 'site.menu.dictionarys.equipment-page.gatewaytype.gatewaytypes',
                rolerightId: 0,
                componentName: 'gatewaytypes',
                disabled: true,
                iconName: 'router',
                route: '/dictionary/equipment/gatewaytype',
                children: []
              },
              {
                displayName: 'site.menu.dictionarys.equipment-page.sensortype.sensortypes',
                rolerightId: 0,
                componentName: 'sensortypes',
                disabled: true,
                iconName: 'hearing',
                route: '/dictionary/equipment/sensortype',
                children: []
              },
            ]
          },
          {
            displayName: 'site.menu.dictionarys.contragent-page.contragents',
            rolerightId: 0,
            componentName: 'contragent',
            disabled: true,
            expandable: true,
            iconName: 'group',
            route: '/dictionary/contragent',
            children: [
              {
                displayName: 'site.menu.dictionarys.contragent-page.company.companies',
                rolerightId: 0,
                componentName: 'companies',
                disabled: true,
                iconName: 'business',
                route: '/dictionary/contragent/companies',
                children: []
              },
              {
                displayName: 'site.menu.dictionarys.contragent-page.substation.substations',
                rolerightId: 0,
                componentName: 'substations',
                disabled: true,
                iconName: 'flash_on',
                route: '/dictionary/contragent/substations',
                children: []
              },
              {
                displayName: 'site.menu.dictionarys.contragent-page.person.persons',
                rolerightId: 0,
                componentName: 'persons',
                disabled: true,
                iconName: 'face',
                route: '/dictionary/contragent/persons',
                children: []
              },
            ]
          },
          {
            displayName: 'site.menu.dictionarys.contract-page.contracts',
            rolerightId: 0,
            componentName: 'contract',
            disabled: true,
            expandable: true,
            iconName: 'list_alt',
            route: '/dictionary/contract',
            children: [
              {
                displayName: 'site.menu.dictionarys.contract-page.contract.contracts',
                rolerightId: 0,
                componentName: 'contracts',
                disabled: true,
                iconName: 'list_alt',
                route: '/dictionary/contract/contracts',
                children: []
              },
              {
                displayName: 'site.menu.dictionarys.contract-page.contracttype.contracttypes',
                rolerightId: 0,
                componentName: 'contracttypes',
                disabled: true,
                iconName: 'insert_drive_file',
                route: '/dictionary/contract/contracts-types',
                children: []
              },
            ]
          }
        ]
      },
      {
        displayName: 'site.menu.administration.administration',
        componentName: 'admin-layout',
        disabled: true,
        expandable: true,
        iconName: 'settings',
        route: '/admin',
        children: [
          {
            displayName: 'site.menu.administration.right-page.right-page',
            componentName: 'right-page',
            disabled: true,
            expandable: false,
            iconName: 'thumb_up',
            route: '/admin/right',
            children: [
              {
                displayName: 'site.menu.administration.right-page.roleright-page.roleright-page',
                componentName: 'roleright-page',
                disabled: true,
                expandable: false,
                iconName: 'settings',
                route: '/admin/right/rolerights',
                children: []
              },
              {
                displayName: 'site.menu.administration.right-page.user-page.user-page',
                componentName: 'user-page',
                disabled: true,
                expandable: false,
                iconName: 'settings',
                route: '/admin/right/users',
                children: []
              },
              {
                displayName: 'site.menu.administration.right-page.role-page.role-page',
                componentName: 'role-page',
                disabled: true,
                expandable: false,
                iconName: 'settings',
                route: '/admin/right/roles',
                children: []
              },
              {
                displayName: 'site.menu.administration.right-page.component-page.component-page',
                componentName: 'component-page',
                disabled: true,
                expandable: false,
                iconName: 'settings',
                route: '/admin/right/components',
                children: []
              }
            ]
          },
        ]
      },
      {
        displayName: 'site.menu.report.report',
        componentName: 'report-layout',
        disabled: true,
        expandable: true,
        iconName: 'report',
        route: '/report',
        children: [
          {
            displayName: 'site.menu.report.report-countfixture-page.report-countfixture-page',
            componentName: 'report-countfixture-page',
            disabled: true,
            expandable: false,
            iconName: 'lightbulb_outline',
            route: '/report/countfixture',
            children: []
          },
          {
            displayName: 'site.menu.report.report-powerfixture-page.report-powerfixture-page',
            componentName: 'report-powerfixture-page',
            disabled: true,
            expandable: false,
            iconName: 'flash_on',
            route: '/report/powerfixture',
            children: []
          },
        ]
      },
    ];

    this.navItemsOperator = this.siteMap[0].children;

    this.navItemsEquipment = this.siteMap[1].children[0].children;

    this.navItemsContragent = this.siteMap[1].children[1].children;

    this.navItemsContract = this.siteMap[1].children[2].children;

    this.navItemsAdmin = this.siteMap[2].children;

    this.navItemsReport = this.siteMap[3].children;

    this.dataSourceOnMobile.data = this.siteMap;

    // loading process
    this.ngxLoader.start();
    setTimeout(() => {
      this.ngxLoader.stop();
    }, 1500);
  }

  ngAfterViewInit() {

  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this.mobileQueryListener);
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
    if (this.componentSub) {
      this.componentSub.unsubscribe();
    }
    //
    if (this.oSubContracts) {
      this.oSubContracts.unsubscribe();
    }
    if (this.oSubContractTypes) {
      this.oSubContractTypes.unsubscribe();
    }
    if (this.oSubFixtureType) {
      this.oSubFixtureType.unsubscribe();
    }
    if (this.oSubNodeType) {
      this.oSubNodeType.unsubscribe();
    }
    if (this.oSubGatewayType) {
      this.oSubGatewayType.unsubscribe();
    }
    if (this.oSubSensorType) {
      this.oSubSensorType.unsubscribe();
    }
  }

  switchLanguage() {
    if (this.language === 'en') {
      this.language = 'ru';
      this.translate.use(this.language);
    } else {
      this.language = 'en';
      this.translate.use(this.language);
    }
  }

  logout(event: Event) {
    event.preventDefault();
    // this.aSub need to remove a component from memory
    this.aSub = this.auth.logout().subscribe(
      () => this.router.navigate(['/login']),
    );
    // it is necessary to clear the token
    this.auth.clearToken();
  }

  onItemSelected(item: NavItem) {
    this.router.navigate([item.route]);
  }

  chooseNavMenuItem(rout: string) {
    this.chooseNavMenuItemByRout(rout);
    this.snav.toggle();
    this.snav.open();
  }

  chooseNavMenuItemByRout(rout: string) {
    switch (rout) {
      case '/operator':
        this.navItems = this.navItemsOperator;
        break;
      case '/operator/fixture':
        this.navItems = this.navItemsOperator;
        break;
      case '/operator/node':
        this.navItems = this.navItemsOperator;
        break;
      case '/operator/gateway':
        this.navItems = this.navItemsOperator;
        break;
      case '/operator/sensor':
        this.navItems = this.navItemsOperator;
        break;

      case '/dictionary/equipment':
        this.navItems = this.navItemsEquipment;
        break;
      case '/dictionary/equipment/fixturetype':
        this.navItems = this.navItemsEquipment;
        break;
      case '/dictionary/equipment/nodetype':
        this.navItems = this.navItemsEquipment;
        break;
      case '/dictionary/equipment/gatewaytype':
        this.navItems = this.navItemsEquipment;
        break;
      case '/dictionary/equipment/sensortype':
        this.navItems = this.navItemsEquipment;
        break;

      case '/dictionary/contragent':
        this.navItems = this.navItemsContragent;
        break;
      case '/dictionary/contragent/companies':
        this.navItems = this.navItemsContragent;
        break;
      case '/dictionary/contragent/substations':
        this.navItems = this.navItemsContragent;
        break;
      case '/dictionary/contragent/persons':
        this.navItems = this.navItemsContragent;
        break;

      case '/dictionary/contract':
        this.navItems = this.navItemsContract;
        break;
      case '/dictionary/contract/contracts-types':
        this.navItems = this.navItemsContract;
        break;
      case '/dictionary/contract/contracts':
        this.navItems = this.navItemsContract;
        break;

      case '/admin/right':
        this.navItems = this.navItemsAdmin;
        break;
      case '/report':
        this.navItems = this.navItemsReport;
        break;
      case '/report/countfixture':
        this.navItems = this.navItemsReport;
        break;
      case '/report/powerfixture':
        this.navItems = this.navItemsReport;
        break;
      default:
        this.navItems = [{
          displayName: '',
          disabled: false,
          iconName: '',
          route: '',
          children: []
        }];
        break;
    }
  }

  getSnavWidth() {
    if (this.sidenavWidth === this.sidenavWidthMax) {
      this.sidenavWidth = this.sidenavWidthMin;
      this.sidenavContentMarginLeft = 0;
    } else {
      this.sidenavWidth = this.sidenavWidthMax;
      this.sidenavContentMarginLeft = this.sidenavWidthMax === null ? this.snav._width : this.sidenavWidthMax - this.sidenavWidthMin;
    }
    this.isSidenavMax = !this.isSidenavMax;

    // change width sidenav-content
    this.tabsWidth = 100 - (((this.sidenavWidthMin + 2) / this.screenWidth * 100));
  }

  toggle() {
    this.sidenavWidth = this.sidenavWidthMin;
    this.snav.toggle();
    this.sidenavContentMarginLeft = 0;
    this.isSidenavMax = false;

    // change width sidenav-content
    this.tabsWidth = this.tabsWidth === 99.9 ? 100 - (((this.sidenavWidthMin + 2) / this.screenWidth * 100)) : 99.9;
  }

  getUsers() {
    const params = Object.assign({}, {
        offset: this.offset,
        limit: this.limit
      },
      {
        contragentId: '',
        roleId: '',
        notRoleId: ''
      });

    this.userSub = this.userService.getAll(params).subscribe(
      users => {
        this.users = users;
        this.user = users.find((one: User) => one.login === localStorage.getItem('login'));
      },
      error => {
        this.openSnackBar(error.error.message, this.translate.instant('site.forms.editforms.ok'));
        console.log(error.error.message);
      },
      () => {
        this.getComponents();

        // choose items for sidenav
        // this.navItems = this.navItemsOperator;
        // open min sidenav
        this.toggle();
        // update NavMenuItems
        this.chooseNavMenuItemByRout(this.router.url);

        // load dictionary
        this.getContracts();
        this.getContractTypes();
        this.getFixtureTypes();
        this.getNodeTypes();
        this.getGatewayTypes();
        this.getSensorTypes();
        this.getCompanies();
        this.getPersons();
        this.getSubstations();
      }
    );
  }

  // get all components with rights of user
  getComponents() {
    const params = Object.assign({}, {
        offset: this.offset,
        limit: this.limit
      },
      {
        roleId: '',
        userId: this.user.userId,
      });

    this.componentSub = this.componentService.getAll(params).subscribe(components => {
        this.components = components;
      },
      error => {
        this.openSnackBar(error.error.message, this.translate.instant('site.forms.editforms.ok'));
        console.log(error.error.message);
      },
      () => {
        this.updRights();
      }
    );
  }

  // update rights
  updRights() {
    for (let i = 0; i < this.siteMap.length; i++) {
      this.updRightSiteMap(this.siteMap[i]);
    }
  }

  // update rights in SiteMap
  updRightSiteMap(node: NavItem) {
    node.disabled = !JSON.parse(this.components.find(
      (one: Components) => one.code === node.componentName).rights);
    for (let i = 0; i < node.children.length; i++) {
      this.updRightSiteMap(node.children[i]);
    }
  }

  // GET DICTIONARY

  getContracts() {
    this.oSubContracts = this.contractService.getAll().subscribe(items => {
        this.contracts = items;
        this.dictionaryLayout.contractComponent.sourceForJqxGridContracts.grid.source = items;
        if (!isUndefined(this.dictionaryLayout)
          && !isUndefined(this.dictionaryLayout.contractComponent)
          && !isUndefined(this.dictionaryLayout.contractComponent.contractSimpleDictionary)) {
          this.dictionaryLayout.contractComponent.contractSimpleDictionary.jqxgridComponent.refresh_jqxgGrid();
        }
      },
      error => {
        console.log(error.error.message);
      }
    );
  }

  getContractTypes() {
    this.oSubContractTypes = this.contractTypeService.getAll().subscribe(items => {
        this.contractTypes = items;
        this.dictionaryLayout.contractComponent.sourceForJqxGridContractTypes.grid.source = items;
        if (!isUndefined(this.dictionaryLayout.contractComponent.contractTypeSimpleDictionary)) {
          this.dictionaryLayout.contractComponent.contractTypeSimpleDictionary.jqxgridComponent.refresh_jqxgGrid();
        }
      },
      error => {
        console.log(error.error.message);
      });
  }

  getFixtureTypes() {
    this.oSubFixtureType = this.fixtureTypeService.getAll().subscribe(items => {
        this.fixtureTypes = items;
        this.dictionaryLayout.equipmentTypeComponent.sourceForJqxGridFixtureType.grid.source = items;
        if (!isUndefined(this.dictionaryLayout.equipmentTypeComponent.fixtureTypeSimpleDictionary)) {
          this.dictionaryLayout.equipmentTypeComponent.fixtureTypeSimpleDictionary.jqxgridComponent.refresh_jqxgGrid();
        }
      },
      error => {
        console.log(error.error.message);
      });
  }

  getNodeTypes() {
    this.oSubNodeType = this.nodeTypeService.getAll().subscribe(items => {
        this.nodeTypes = items;
        this.dictionaryLayout.equipmentTypeComponent.sourceForJqxGridNodeType.grid.source = items;
        if (!isUndefined(this.dictionaryLayout.equipmentTypeComponent.nodeTypeSimpleDictionary)) {
          this.dictionaryLayout.equipmentTypeComponent.nodeTypeSimpleDictionary.jqxgridComponent.refresh_jqxgGrid();
        }
      },
      error => {
        console.log(error.error.message);
      });
  }

  getGatewayTypes() {
    this.oSubGatewayType = this.gatewayTypeService.getAll().subscribe(items => {
        this.gatewayTypes = items;
        this.dictionaryLayout.equipmentTypeComponent.sourceForJqxGridGatewayType.grid.source = items;
        if (!isUndefined(this.dictionaryLayout.equipmentTypeComponent.gatewayTypeSimpleDictionary)) {
          this.dictionaryLayout.equipmentTypeComponent.gatewayTypeSimpleDictionary.jqxgridComponent.refresh_jqxgGrid();
        }
      },
      error => {
        console.log(error.error.message);
      });
  }

  getSensorTypes() {
    this.oSubSensorType = this.sensorTypeService.getAll().subscribe(items => {
        this.sensorTypes = items;
        this.dictionaryLayout.equipmentTypeComponent.sourceForJqxGridSensorType.grid.source = items;
        if (!isUndefined(this.dictionaryLayout.equipmentTypeComponent.sensorTypeSimpleDictionary)) {
          this.dictionaryLayout.equipmentTypeComponent.sensorTypeSimpleDictionary.jqxgridComponent.refresh_jqxgGrid();
        }
      },
      error => {
        console.log(error.error.message);
      });
  }

  getCompanies() {
    this.oSubCompanies = this.companyService.getAll().subscribe(items => {
        this.companies = items;
        this.dictionaryLayout.contragentComponent.sourceForJqxGridCompanies.grid.source = items;
        if (!isUndefined(this.dictionaryLayout.contragentComponent.companiesSimpleDictionary)) {
          this.dictionaryLayout.contragentComponent.companiesSimpleDictionary.jqxgridComponent.refresh_jqxgGrid();
        }
      },
      error => {
        console.log(error.error.message);
      });
  }

  getPersons() {
    this.oSubPersons = this.personService.getAll().subscribe(items => {
        this.persons = items;
        this.dictionaryLayout.contragentComponent.sourceForJqxGridPersons.grid.source = items;
        if (!isUndefined(this.dictionaryLayout.contragentComponent.personsSimpleDictionary)) {
          this.dictionaryLayout.contragentComponent.personsSimpleDictionary.jqxgridComponent.refresh_jqxgGrid();
        }
      },
      error => {
        console.log(error.error.message);
      });
  }

  getSubstations() {
    this.oSubSubstations = this.substationService.getAll().subscribe(items => {
        this.substations = items;
        this.dictionaryLayout.contragentComponent.sourceForJqxGridSubstations.grid.source = items;
        if (!isUndefined(this.dictionaryLayout.contragentComponent.substationsSimpleDictionary)) {
          this.dictionaryLayout.contragentComponent.substationsSimpleDictionary.jqxgridComponent.refresh_jqxgGrid();
        }
      },
      error => {
        console.log(error.error.message);
      });
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 10000,
    });
  }
}
