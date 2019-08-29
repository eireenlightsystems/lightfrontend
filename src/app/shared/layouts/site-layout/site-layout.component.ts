// angular lib
import {AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {FlatTreeControl} from '@angular/cdk/tree';
import {MatSidenav, MatTree, MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material';
import {MediaMatcher} from '@angular/cdk/layout';
import {TranslateService} from '@ngx-translate/core';
import {isUndefined} from 'util';
// jqwidgets
// app interfaces
import {Components, NavItem, User} from '../../interfaces';
// app services
import {AuthService} from '../../services/auth.service';
import {UserService} from '../../services/admin/user.service';
import {ComponentService} from '../../services/admin/component.service';
// app components
import {AdminLayoutComponent} from './admin-layout/admin-layout.component';


/** Flat node with expandable and level information */
interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  disabled?: boolean;
  iconName: string;
  route?: string;
  level: number;
}


@Component({
  selector: 'app-site-layout',
  templateUrl: './site-layout.component.html',
  styleUrls: ['./site-layout.component.css']
})
export class SiteLayoutComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('snav', {static: false}) snav: MatSidenav;
  @ViewChild('matTtree', {static: false}) matTtree: MatTree<any>;
  @ViewChild('adminLayoutComponent', {static: false}) adminLayoutComponent: AdminLayoutComponent;

  aSub: Subscription;
  userSub: Subscription;
  componentSub: Subscription;

  users: User[] = [];
  user: User = new User();
  components: Components[] = [];
  offset = 0;
  limit = 100000;

  mobileQuery: MediaQueryList;
  private mobileQueryListener: () => void;
  language = 'ru';
  sidenavWidth = 70;
  sidenavWidthMin = 70;
  sidenavWidthMax = 230;
  sidenavContentMarginLeft = 0;
  isSidenavMax = false;
  tabsWidth = 99.9;

  // Left tree-menu in mat-sidenav
  siteMap: NavItem[];
  navItems: NavItem[];
  navItemsOperator: NavItem[];
  navItemsEquipment: NavItem[];
  navItemsContragent: NavItem[];
  navItemsContract: NavItem[];
  navItemsAdmin: NavItem[];

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
              // service
              private auth: AuthService,
              public translate: TranslateService,
              private userService: UserService,
              private componentService: ComponentService) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this.mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this.mobileQueryListener);
    // translate instructions
    translate.addLangs(['en', 'ru']);
    translate.setDefaultLang('ru');
  }

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;

  ngOnInit(): void {
    // get user list
    this.getUsers();
    // set current language
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
            displayName: 'site.menu.operator.fixture-page.fixtures',
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
                    children: []
                  },
                  {
                    displayName: 'site.menu.operator.fixture-page.fixture-masterdetails-page.fixturecomspeedlist-page.fixturecomspeedlist-page',
                    rolerightId: 0,
                    componentName: 'fixturecomspeedlist-page',
                    disabled: true,
                    expandable: false,
                    iconName: '',
                    route: '',
                    children: []
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
                children: []
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
            displayName: 'site.menu.operator.node',
            rolerightId: 0,
            componentName: 'node-page',
            disabled: true,
            iconName: 'assistant_photo',
            route: '/operator/node',
            children: []
          },
          {
            displayName: 'site.menu.operator.gateway',
            rolerightId: 0,
            componentName: 'gateway-page',
            disabled: true,
            iconName: 'router',
            route: '/operator/gateway',
            children: []
          },
          {
            displayName: 'site.menu.operator.sensor',
            rolerightId: 0,
            componentName: 'sensor-page',
            disabled: true,
            iconName: 'hearing',
            route: '/operator/sensor',
            children: []
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
                displayName: 'site.menu.dictionarys.contract-page.contracttype.contracttypes',
                rolerightId: 0,
                componentName: 'contracttypes',
                disabled: true,
                iconName: 'insert_drive_file',
                route: '/dictionary/contract/contracts-types',
                children: []
              },
              {
                displayName: 'site.menu.dictionarys.contract-page.contract.contracts',
                rolerightId: 0,
                componentName: 'contracts',
                disabled: true,
                iconName: 'list_alt',
                route: '/dictionary/contract/contracts',
                children: []
              },
            ]
          }
        ]
      },
      {
        displayName: 'site.menu.administration.administration',
        componentName: 'admin-layout',
        disabled: false,
        expandable: true,
        iconName: 'settings',
        route: '/admin',
        children: [
          {
            displayName: 'site.menu.administration.right-page.right-page',
            componentName: 'right-page',
            disabled: false,
            expandable: false,
            iconName: 'thumb_up',
            route: '/admin/right',
            children: [
              {
                displayName: 'site.menu.administration.right-page.roleright-page.roleright-page',
                componentName: 'roleright-page',
                disabled: false,
                expandable: false,
                iconName: 'settings',
                route: '/admin/right/rolerights',
                children: []
              },
              {
                displayName: 'site.menu.administration.right-page.user-page.user-page',
                componentName: 'user-page',
                disabled: false,
                expandable: false,
                iconName: 'settings',
                route: '/admin/right/users',
                children: []
              },
              {
                displayName: 'site.menu.administration.right-page.role-page.role-page',
                componentName: 'role-page',
                disabled: false,
                expandable: false,
                iconName: 'settings',
                route: '/admin/right/roles',
                children: []
              },
              {
                displayName: 'site.menu.administration.right-page.component-page.component-page',
                componentName: 'component-page',
                disabled: false,
                expandable: false,
                iconName: 'settings',
                route: '/admin/right/components',
                children: []
              }
            ]
          },
        ]
      },
    ];

    this.navItemsOperator = this.siteMap[0].children;

    this.navItemsEquipment = this.siteMap[1].children[0].children;

    this.navItemsContragent = this.siteMap[1].children[1].children;

    this.navItemsContract = this.siteMap[1].children[2].children;

    this.navItemsAdmin = this.siteMap[2].children;

    this.dataSourceOnMobile.data = this.siteMap;

    // choose items for sidenav
    this.navItems = this.navItemsOperator;
  }

  ngAfterViewInit() {
    // open min sidenav
    this.toggle();
    // update NavMenuItems
    this.chooseNavMenuItemByRout(this.router.url);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this.mobileQueryListener);
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
    if (this.componentSub) {
      this.componentSub.unsubscribe();
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
    this.tabsWidth = 100 - (((this.sidenavWidthMin + 2) / window.innerWidth * 100));
  }

  toggle() {
    this.sidenavWidth = this.sidenavWidthMin;
    this.snav.toggle();
    this.sidenavContentMarginLeft = 0;
    this.isSidenavMax = false;

    // change width sidenav-content
    this.tabsWidth = this.tabsWidth === 99.9 ? 100 - (((this.sidenavWidthMin + 2) / window.innerWidth * 100)) : 99.9;
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

    this.userSub = this.userService.getAll(params).subscribe(users => {
      this.users = users;
      this.user = users.find((one: User) => one.login === localStorage.getItem('login'));
      this.getComponents();
    });
  }

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
      // .filter((one: Components) => one.rights === 'false')
      // update rights siteMap
      this.updRights();
    });
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
}
