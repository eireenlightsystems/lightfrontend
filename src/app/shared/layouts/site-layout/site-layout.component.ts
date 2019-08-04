// @ts-ignore
import {AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {FlatTreeControl} from '@angular/cdk/tree';
import {MatSidenav, MatTree, MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material';
import {MediaMatcher} from '@angular/cdk/layout';
import {TranslateService} from '@ngx-translate/core';

import {AuthService} from '../../services/auth.service';
import {NavItem} from '../../interfaces';

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

  aSub: Subscription;

  mobileQuery: MediaQueryList;
  private mobileQueryListener: () => void;
  language = 'ru';
  sidenavWidth = 85;
  sidenavWidthMin = 85;
  sidenavWidthMax = 230;
  sidenavContentMarginLeft = 0;
  isSidenavMax = false;
  tabsWidth = 99.9;

  // Left tree-menu in mat-sidenav
  navItems: NavItem[];
  navItemsOperator: NavItem[];
  navItemsEquipment: NavItem[];
  navItemsContragent: NavItem[];
  navItemsContract: NavItem[];
  navItemsAdmin: NavItem[];
  menuItems: NavItem[];
  private transformer = (node: NavItem, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
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

  constructor(private auth: AuthService,
              private router: Router,
              changeDetectorRef: ChangeDetectorRef,
              media: MediaMatcher,
              public translate: TranslateService) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this.mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this.mobileQueryListener);
    // translate instructions
    translate.addLangs(['en', 'ru']);
    translate.setDefaultLang('ru');
  }

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;

  ngOnInit(): void {

    this.translate.use(this.language);

    this.menuItems = [
      {
        displayName: 'site.menu.operator.management',
        iconName: 'touch_app',
        route: '/operator',
        children: [
          {
            displayName: 'site.menu.operator.fixture',
            iconName: 'lightbulb_outline',
            route: '/operator/fixture',
            children: []
          },
          {
            displayName: 'site.menu.operator.node',
            iconName: 'assistant_photo',
            route: '/operator/node',
            children: []
          },
          {
            displayName: 'site.menu.operator.gateway',
            iconName: 'router',
            route: '/operator/gateway',
            children: []
          },
          {
            displayName: 'site.menu.operator.sensor',
            iconName: 'hearing',
            route: '/operator/sensor',
            children: []
          },
        ]
      },
      {
        displayName: 'site.menu.dictionarys.dictionarys',
        iconName: 'import_contacts',
        route: '/dictionary',
        children: [
          {
            displayName: 'site.menu.dictionarys.equipments',
            iconName: 'build',
            route: '/dictionary/equipment',
            children: [
              {
                displayName: 'site.menu.dictionarys.fixturetype',
                iconName: 'lightbulb_outline',
                route: '/dictionary/equipment/fixturetype',
                children: []
              },
              {
                displayName: 'site.menu.dictionarys.nodetype',
                iconName: 'assistant_photo',
                route: '/dictionary/equipment/nodetype',
                children: []
              },
              {
                displayName: 'site.menu.dictionarys.gatewaytype',
                iconName: 'router',
                route: '/dictionary/equipment/gatewaytype',
                children: []
              },
              {
                displayName: 'site.menu.dictionarys.sensortype',
                iconName: 'hearing',
                route: '/dictionary/equipment/sensortype',
                children: []
              },
            ]
          },
          {
            displayName: 'site.menu.dictionarys.contragents',
            iconName: 'group',
            route: '/dictionary/contragent',
            children: [
              {
                displayName: 'site.menu.dictionarys.companies',
                iconName: 'business',
                route: '/dictionary/contragent/companies',
                children: []
              },
              {
                displayName: 'site.menu.dictionarys.substations',
                iconName: 'flash_on',
                route: '/dictionary/contragent/substations',
                children: []
              },
              {
                displayName: 'site.menu.dictionarys.persons',
                iconName: 'face',
                route: '/dictionary/contragent/persons',
                children: []
              },
            ]
          },
          {
            displayName: 'site.menu.dictionarys.contract.contracts',
            iconName: 'list_alt',
            route: '/dictionary/contract',
            children: [
              {
                displayName: 'site.menu.dictionarys.contract.contracts-types',
                iconName: 'insert_drive_file',
                route: '/dictionary/contract/contracts-types',
                children: []
              },
              {
                displayName: 'site.menu.dictionarys.contract.contracts',
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
        iconName: 'settings',
        route: '/admin',
        children: []
      },
    ];

    this.navItemsOperator = this.menuItems[0].children;

    this.navItemsEquipment = this.menuItems[1].children[0].children;

    this.navItemsContragent = this.menuItems[1].children[1].children;

    this.navItemsContract = this.menuItems[1].children[2].children;

    this.navItemsAdmin = this.menuItems[2].children;

    this.dataSourceOnMobile.data = this.menuItems;

    // choose items for sidenav
    this.navItems = this.navItemsOperator;
  }

  ngAfterViewInit() {

  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this.mobileQueryListener);
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

  chooseMenuItem(route) {
    switch (route.substring(0, 5)) {
      case '/oper':
        this.navItems = this.navItemsOperator;
        break;
      case '/equi':
        this.navItems = this.navItemsEquipment;
        break;
      case '/cont':
        this.navItems = this.navItemsContragent;
        break;
      case '/cntr':
        this.navItems = this.navItemsContract;
        break;
      case '/admi':
        this.navItems = this.navItemsAdmin;
        break;
      default:
        this.navItems = [{
          displayName: '',
          iconName: '',
          route: '',
          children: []
        }];
    }
    this.snav.toggle();
    this.snav.open();
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

}
