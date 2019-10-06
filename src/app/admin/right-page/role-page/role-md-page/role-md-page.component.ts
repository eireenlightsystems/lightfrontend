// angular lib
import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {isUndefined} from 'util';
import {TranslateService} from '@ngx-translate/core';
// jqwidgets
import {jqxSplitterComponent} from 'jqwidgets-scripts/jqwidgets-ng/jqxsplitter';
// app interfaces
import {
  CompanyDepartment,
  FilterComponent,
  FilterRole,
  FilterUser,
  NavItem,
  Person,
  SettingButtonPanel
} from '../../../../shared/interfaces';
// app services
// app components
import {UserlistPageComponent} from '../../user-page/user-md-page/userlist-page/userlist-page.component';
import {RolelistPageComponent} from './rolelist-page/rolelist-page.component';
import {ComponentlistPageComponent} from '../../component-page/componentlist-page/componentlist-page.component';


@Component({
  selector: 'app-role-md-page',
  templateUrl: './role-md-page.component.html',
  styleUrls: ['./role-md-page.component.css']
})
export class RoleMdPageComponent implements OnInit {

  // variables from parent component
  @Input() siteMap: NavItem[];
  @Input() tabsWidth: number;
  // role source
  @Input() companies: CompanyDepartment[];
  // user source
  @Input() persons: Person[];
  @Input() userSortcolumn: any[];
  @Input() userColumns: any[];
  @Input() userListBoxSource: any[];

  // determine the functions that need to be performed in the parent component

  // define variables - link to view objects
  @ViewChild('rolelistPageComponent', {static: false}) rolelistPageComponent: RolelistPageComponent;
  @ViewChild('userlistPageComponent', {static: false}) userlistPageComponent: UserlistPageComponent;
  @ViewChild('componentlistPageComponent', {static: false}) componentlistPageComponent: ComponentlistPageComponent;
  @ViewChild('mainSplitter', {static: false}) mainSplitter: jqxSplitterComponent;

  // other variables
  settingRoleButtonPanel: SettingButtonPanel;
  settingUserButtonPanel: SettingButtonPanel;
  settingComponentButtonPanel: SettingButtonPanel;
  selectRoleId = 0;
  filterRole: FilterRole = {
    userId: '',
    notUserId: ''
  };
  filterUser: FilterUser = {
    contragentId: '',
    roleId: '',
    notRoleId: ''
  };
  filterComponent: FilterComponent = {
    roleId: '',
    userId: '',
  };
  heightDeltaParentGrid = 55;
  heightDeltaChildGrid = 110;
  sizeParentSplitter: any;
  sizeChildSplitter: any;

  constructor(
    // service
    public translate: TranslateService) {
  }

  ngOnInit() {
    // init role button panel
    this.settingRoleButtonPanel = {
      add: {
        visible: true,
        disabled: false,
      },
      upd: {
        visible: true,
        disabled: false,
      },
      del: {
        visible: true,
        disabled: false,
      },
      refresh: {
        visible: true,
        disabled: false,
      },
      setting: {
        visible: true,
        disabled: false,
      },
      filterList: {
        visible: false,
        disabled: false,
      },
      place: {
        visible: false,
        disabled: false,
      },
      pinDrop: {
        visible: false,
        disabled: false,
      },
      groupIn: {
        visible: false,
        disabled: false,
      },
      groupOut: {
        visible: false,
        disabled: false,
      },
      switchOn: {
        visible: false,
        disabled: false,
      },
      switchOff: {
        visible: false,
        disabled: false,
      }
    };
    // init user button panel
    this.settingUserButtonPanel = {
      add: {
        visible: false,
        disabled: false,
      },
      upd: {
        visible: false,
        disabled: false,
      },
      del: {
        visible: false,
        disabled: false,
      },
      refresh: {
        visible: true,
        disabled: false,
      },
      setting: {
        visible: true,
        disabled: false,
      },
      filterList: {
        visible: false,
        disabled: false,
      },
      place: {
        visible: false,
        disabled: false,
      },
      pinDrop: {
        visible: false,
        disabled: false,
      },
      groupIn: {
        visible: true,
        disabled: false,
      },
      groupOut: {
        visible: true,
        disabled: false,
      },
      switchOn: {
        visible: false,
        disabled: false,
      },
      switchOff: {
        visible: false,
        disabled: false,
      }
    };
    // init component button panel
    this.settingComponentButtonPanel = {
      add: {
        visible: false,
        disabled: false,
      },
      upd: {
        visible: false,
        disabled: false,
      },
      del: {
        visible: false,
        disabled: false,
      },
      refresh: {
        visible: true,
        disabled: false,
      },
      setting: {
        visible: true,
        disabled: false,
      },
      filterList: {
        visible: false,
        disabled: false,
      },
      place: {
        visible: false,
        disabled: false,
      },
      pinDrop: {
        visible: false,
        disabled: false,
      },
      groupIn: {
        visible: false,
        disabled: false,
      },
      groupOut: {
        visible: false,
        disabled: false,
      },
      switchOn: {
        visible: false,
        disabled: false,
      },
      switchOff: {
        visible: false,
        disabled: false,
      }
    };
  }

  refreshGrid() {
    this.rolelistPageComponent.applyFilter(this.filterRole);
    this.refreshChildGrid(0);
  }

  refreshChildGrid(roleId: number) {
    this.selectRoleId = roleId;
    this.filterUser.roleId = roleId.toString();
    this.filterComponent.roleId = roleId.toString();

    if (roleId === 0) {
      // Users
      if (!isUndefined(this.userlistPageComponent)) {
        this.userlistPageComponent.items = [];
        if (!isUndefined(this.userlistPageComponent.jqxgridComponent)) {
          this.userlistPageComponent.jqxgridComponent.empty_jqxgGrid();
        }
        this.userlistPageComponent.getDisabledButtons();
      }
      // Components
      if (!isUndefined(this.componentlistPageComponent)) {
        this.componentlistPageComponent.items = [];
        if (!isUndefined(this.componentlistPageComponent.jqxgridComponent)) {
          this.componentlistPageComponent.jqxgridComponent.empty_jqxgGrid();
        }
        this.componentlistPageComponent.getDisabledButtons();
      }
    } else {
      // Users
      if (!isUndefined(this.userlistPageComponent)) {
        this.userlistPageComponent.applyFilter(this.filterUser);
      }
      // Components
      if (!isUndefined(this.componentlistPageComponent)) {
        this.componentlistPageComponent.applyFilter(this.filterComponent);
      }
    }
  }

  resize(sizeParent: any, sizeChild: any) {
    const sizeParentGrid = sizeParent - this.heightDeltaParentGrid;
    const sizeChildGrid = sizeChild - this.heightDeltaChildGrid;

    this.rolelistPageComponent.jqxgridComponent.myGrid.height(sizeParentGrid);
    this.rolelistPageComponent.sourceForJqxGrid.grid.height = sizeParentGrid;

    if (!isUndefined(this.userlistPageComponent)) {
      this.userlistPageComponent.jqxgridComponent.myGrid.height(sizeChildGrid);
      this.userlistPageComponent.sourceForJqxGrid.grid.height = sizeChildGrid;
    }

    if (!isUndefined(this.componentlistPageComponent)) {
      this.componentlistPageComponent.jqxgridComponent.myGrid.height(sizeChildGrid);
      this.componentlistPageComponent.sourceForJqxGrid.grid.height = sizeChildGrid;
    }
  }

  collapsed(sizeParent: any, sizeChild: any) {
    this.sizeParentSplitter = sizeParent;
    this.sizeChildSplitter = sizeChild;

    this.mainSplitter.attrPanels[0].size = this.getHeightSplitter();
  }

  expanded() {
    this.mainSplitter.attrPanels[0].size = this.sizeParentSplitter;
    this.mainSplitter.attrPanels[1].size = this.sizeChildSplitter;
  }

  getHeightSplitter() {
    return 785;
  }

}
