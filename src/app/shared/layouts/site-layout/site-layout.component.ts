import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
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

  @ViewChild('snav') snav: MatSidenav;
  @ViewChild('matTtree') matTtree: MatTree<any>;

  aSub: Subscription;

  mobileQuery: MediaQueryList;
  private mobileQueryListener: () => void;
  language = 'en';
  sidenavWidth = 85;
  sidenavWidthMin = 85;
  sidenavWidthMax = 200;
  sidenavContentMarginLeft = 0;
  isSidenavMax = false;

  // Left tree-menu in mat-sidenav
  // navItems: NavItem[];
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
    translate.setDefaultLang('en');
  }

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;

  ngOnInit(): void {
    // this.itemMenu = 'Управление оборудованием';
    // this.sidenavLinks = this.sidenavDefaultLinks;
    // MaterialService.initDropdown();

    this.translate.use(this.language);

    this.menuItems = [
      {
        displayName: 'site.menu.operator.management',
        iconName: 'touch_app',
        route: '/operator',
        children: []
      },
      {
        displayName: 'site.menu.handbooks.handbooks',
        iconName: 'import_contacts',
        route: '/handbook',
        children: []
      },
      {
        displayName: 'site.menu.administration.administration',
        iconName: 'settings',
        route: '/admin',
        children: []
      },
    ];

    this.navItemsOperator = [
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
    ];

    this.navItemsEquipment = [
      {
        displayName: 'site.menu.handbooks.fixturetype',
        iconName: 'lightbulb_outline',
        route: '/handbook/equipment/fixturetype',
        children: []
      },
      {
        displayName: 'site.menu.handbooks.nodetype',
        iconName: 'assistant_photo',
        route: '/handbook/equipment/nodetype',
        children: []
      },
      {
        displayName: 'site.menu.handbooks.gatewaytype',
        iconName: 'router',
        route: '/handbook/equipment/gatewaytype',
        children: []
      },
      {
        displayName: 'site.menu.handbooks.sensortype',
        iconName: 'hearing',
        route: '/handbook/equipment/sensortype',
        children: []
      },
    ];

    this.navItemsContragent = [
      {
        displayName: 'site.menu.handbooks.companies',
        iconName: 'business',
        route: '/handbook/contragent/companies',
        children: []
      },
      {
        displayName: 'site.menu.handbooks.substations',
        iconName: 'flash_on',
        route: '/handbook/contragent/substations',
        children: []
      },
      {
        displayName: 'site.menu.handbooks.persons',
        iconName: 'face',
        route: '/handbook/contragent/persons',
        children: []
      },
    ];

    this.navItemsContract = [
      {
        displayName: 'site.menu.handbooks.contract.contracts',
        iconName: 'list_alt',
        route: '/handbook/contract/contracts',
        children: []
      },
      {
        displayName: 'site.menu.handbooks.contract.contracts-types',
        iconName: 'list_alt',
        route: '/handbook/contract/contracts-types',
        children: []
      },
    ];

    this.navItemsAdmin = [
      {
        displayName: 'site.menu.administration.administration',
        iconName: 'assistant_photo',
        route: '/admin',
        children: []
      }
    ];

    // this.navItems = this.navItemsEquipment;
    this.chooseMenuItem(this.router.url);
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
        this.dataSource.data = this.navItemsOperator;
        break;
      case '/equi':
        this.dataSource.data = this.navItemsEquipment;
        break;
      case '/cont':
        this.dataSource.data = this.navItemsContragent;
        break;
      case '/cntr':
        this.dataSource.data = this.navItemsContract;
        break;
      case '/admi':
        this.dataSource.data = this.navItemsAdmin;
        break;
      default:
        this.dataSource.data = [{
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
    } else {
      this.sidenavWidth = this.sidenavWidthMax;
    }
    this.isSidenavMax = !this.isSidenavMax;
    this.sidenavContentMarginLeft = this.sidenavWidth - this.sidenavWidthMin;
  }

  toggle() {
    this.sidenavWidth = this.sidenavWidthMin;
    this.snav.toggle();
    this.sidenavContentMarginLeft = 0;
    this.isSidenavMax = false;
  }

}
