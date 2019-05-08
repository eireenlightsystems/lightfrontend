import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';

import {jqxGridComponent} from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxgrid';
import {jqxPivotGridComponent} from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxpivotgrid';
import {jqxPivotDesignerComponent} from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxpivotdesigner';
import {jqxDataTableComponent} from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxdatatable';
import {jqxListBoxComponent} from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxlistbox';
import {jqxInputComponent} from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxinput';
import {jqxNumberInputComponent} from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxnumberinput';
import {jqxButtonComponent} from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxbuttons';
import {jqxSliderComponent} from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxslider';
import {jqxDropDownListComponent} from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxdropdownlist';
import {jqxWindowComponent} from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxwindow';
import {jqxFormComponent} from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxform';
import {jqxTabsComponent} from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxtabs';
import {jqxCheckBoxComponent} from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxcheckbox';
import {jqxTextAreaComponent} from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxtextarea';
import {jqxTooltipComponent} from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxtooltip';
import {jqxResponsivePanelComponent} from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxresponsivepanel';
import {jqxPanelComponent} from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxpanel';
import {jqxDateTimeInputComponent} from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxdatetimeinput';
import {jqxComboBoxComponent} from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxcombobox';
import {jqxSplitterComponent} from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxsplitter';

import {AppComponent} from './app.component';
import {LoginPageComponent} from './auth/login-page/login-page.component';
import {AppRoutingModule} from './app-routing.module';
import {AuthLayoutComponent} from './shared/layouts/auth-layout/auth-layout.component';
import {SiteLayoutComponent} from './shared/layouts/site-layout/site-layout.component';
import {RegisterPageComponent} from './auth/register-page/register-page.component';
import {TokenInterceptor} from './shared/classes/token.interceptor';
import {LoaderComponent} from './shared/components/loader/loader.component';
import {OperatorLayoutComponent} from './shared/layouts/site-layout/operator-layout/operator-layout.component';
import {AdminLayoutComponent} from './shared/layouts/site-layout/admin-layout/admin-layout.component';
import {FixturemapPageComponent} from './fixture/fixture-page/fixturemap-page/fixturemap-page.component';
import {FixturelistPageComponent} from './fixture/fixture-page/fixture-masterdetails-page/fixturelist-page/fixturelist-page.component';
import {HandbookLayoutComponent} from './shared/layouts/site-layout/handbook-layout/handbook-layout.component';
import {FixturePageComponent} from './fixture/fixture-page/fixture-page.component';
import {EventWindowComponent} from './shared/components/event-window/event-window.component';
import {NodePageComponent} from './node/node-page/node-page.component';
import {NodelistPageComponent} from './node/node-page/node-masterdetails-page/nodelist-page/nodelist-page.component';
import {NodemapPageComponent} from './node/node-page/nodemap-page/nodemap-page.component';
import {NodeMasterdetailsPageComponent} from './node/node-page/node-masterdetails-page/node-masterdetails-page.component';
import {GatewayPageComponent} from './gateway/gateway-page/gateway-page.component';
import {GatewayMasterdetailsPageComponent} from './gateway/gateway-page/gateway-masterdetails-page/gateway-masterdetails-page.component';
import {GatewaylistPageComponent} from './gateway/gateway-page/gateway-masterdetails-page/gatewaylist-page/gatewaylist-page.component';
import {GatewaymapPageComponent} from './gateway/gateway-page/gatewaymap-page/gatewaymap-page.component';
import {FixturecomeditFormComponent} from './fixture/fixture-page/fixture-masterdetails-page/fixturecomlist-page/fixturecomedit-form/fixturecomedit-form.component';
import {FixturecomlistPageComponent} from './fixture/fixture-page/fixture-masterdetails-page/fixturecomlist-page/fixturecomlist-page.component';
import {FixtureMasterdetailsPageComponent} from './fixture/fixture-page/fixture-masterdetails-page/fixture-masterdetails-page.component';
import {FixturecomeditSwitchoffFormComponent} from './fixture/fixture-page/fixture-masterdetails-page/fixturecomlist-page/fixturecomedit-switchoff-form/fixturecomedit-switchoff-form.component';
import {FixturecomspeedlistPageComponent} from './fixture/fixture-page/fixture-masterdetails-page/fixturecomspeedlist-page/fixturecomspeedlist-page.component';
import {FixturecomspeededitFormComponent} from './fixture/fixture-page/fixture-masterdetails-page/fixturecomspeedlist-page/fixturecomspeededit-form/fixturecomspeededit-form.component';
import {NotFoundComponent} from './shared/components/not-found/not-found.component';
import {FixturegroupMdPageComponent} from './fixture/fixture-page/fixturegroup-md-page/fixturegroup-md-page.component';
import {FixtureGrlistPageComponent} from './fixture/fixture-page/fixturegroup-md-page/fixture-grlist-page/fixture-grlist-page.component';
import {SensorPageComponent} from './sensor/sensor-page/sensor-page.component';
import {SensorMdPageComponent} from './sensor/sensor-page/sensor-md-page/sensor-md-page.component';
import {SensorlistPageComponent} from './sensor/sensor-page/sensor-md-page/sensorlist-page/sensorlist-page.component';
import {ButtonSimpleStyleDirective} from './shared/directives/button-simple-style.directive';
import {InputFilterStyleDirective} from './shared/directives/input-filter-style.directive';
import {ComboboxFilterDirective} from './shared/directives/combobox-filter.directive';
import {ButtonFilterDirective} from './shared/directives/button-filter.directive';
import {FilterTableComponent} from './shared/components/filter-table/filter-table.component';
import {FilterItemComponent} from './shared/components/filter-table/filter-item/filter-item.component';
import {LinkFormComponent} from './shared/components/link-form/link-form.component';
import {ButtonLinkDirective} from './shared/directives/button-link.directive';
import {ButtonPanelComponent} from './shared/components/button-panel/button-panel.component';
import {EditFormComponent} from './shared/components/edit-form/edit-form.component';
import {EditFormItemComponent} from './shared/components/edit-form/edit-form-item/edit-form-item.component';
import {JqxgridComponent} from './shared/components/jqxgrid/jqxgrid.component';
import {ButtonSettinggridDirective} from './shared/directives/button-settinggrid.directive';


@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    AuthLayoutComponent,
    SiteLayoutComponent,
    RegisterPageComponent,
    LoaderComponent,
    OperatorLayoutComponent,
    AdminLayoutComponent,
    FixturemapPageComponent,
    FixturelistPageComponent,
    HandbookLayoutComponent,

    jqxGridComponent,
    jqxPivotGridComponent,
    jqxPivotDesignerComponent,
    jqxDataTableComponent,
    jqxListBoxComponent,
    jqxInputComponent,
    jqxNumberInputComponent,
    jqxButtonComponent,
    jqxSliderComponent,
    jqxDropDownListComponent,
    jqxComboBoxComponent,
    jqxWindowComponent,
    jqxFormComponent,
    jqxTabsComponent,
    jqxCheckBoxComponent,
    jqxCheckBoxComponent,
    jqxTextAreaComponent,
    jqxTooltipComponent,
    jqxResponsivePanelComponent,
    jqxPanelComponent,
    jqxDateTimeInputComponent,
    jqxSplitterComponent,

    FixturePageComponent,
    EventWindowComponent,
    NodePageComponent,
    NodelistPageComponent,
    NodemapPageComponent,
    NodeMasterdetailsPageComponent,
    GatewayPageComponent,
    GatewayMasterdetailsPageComponent,
    GatewaylistPageComponent,
    GatewaymapPageComponent,
    FixturecomeditFormComponent,
    FixturecomlistPageComponent,
    FixtureMasterdetailsPageComponent,
    FixturecomeditSwitchoffFormComponent,
    FixturecomspeedlistPageComponent,
    FixturecomspeededitFormComponent,
    NotFoundComponent,
    FixturegroupMdPageComponent,
    FixtureGrlistPageComponent,
    SensorPageComponent,
    SensorMdPageComponent,
    SensorlistPageComponent,
    FilterTableComponent,
    FilterItemComponent,
    LinkFormComponent,
    ButtonPanelComponent,
    EditFormComponent,

    ButtonSimpleStyleDirective,
    InputFilterStyleDirective,
    ComboboxFilterDirective,
    ButtonFilterDirective,
    ButtonLinkDirective,
    EditFormItemComponent,
    JqxgridComponent,
    ButtonSettinggridDirective

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      multi: true,
      useClass: TokenInterceptor
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
