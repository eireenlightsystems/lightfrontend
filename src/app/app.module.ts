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
import {FixturelistFilterComponent} from './fixture/fixture-page/fixture-masterdetails-page/fixturelist-page/fixturelist-filter/fixturelist-filter.component';
import {HandbookLayoutComponent} from './shared/layouts/site-layout/handbook-layout/handbook-layout.component';
import {FixturelistJqxgridComponent} from './fixture/fixture-page/fixture-masterdetails-page/fixturelist-page/fixturelist-jqxgrid/fixturelist-jqxgrid.component';
import {FixturePageComponent} from './fixture/fixture-page/fixture-page.component';
import {EventWindowComponent} from './shared/components/event-window/event-window.component';
import {NodePageComponent} from './node/node-page/node-page.component';
import {NodelistPageComponent} from './node/node-page/node-masterdetails-page/nodelist-page/nodelist-page.component';
import {NodemapPageComponent} from './node/node-page/nodemap-page/nodemap-page.component';
import {NodelistFilterComponent} from './node/node-page/node-masterdetails-page/nodelist-page/nodelist-filter/nodelist-filter.component';
import {NodelistJqxgridComponent} from './node/node-page/node-masterdetails-page/nodelist-page/nodelist-jqxgrid/nodelist-jqxgrid.component';
import {NodeMasterdetailsPageComponent} from './node/node-page/node-masterdetails-page/node-masterdetails-page.component';
import {NodeeditFormComponent} from './node/node-page/node-masterdetails-page/nodelist-page/nodeedit-form/nodeedit-form.component';
import {FixtureeditFormComponent} from './fixture/fixture-page/fixture-masterdetails-page/fixturelist-page/fixtureedit-form/fixtureedit-form.component';
import {FixturelinkFormComponent} from './fixture/fixture-page/fixture-masterdetails-page/fixturelist-page/fixturelink-form/fixturelink-form.component';
import {GatewayPageComponent} from './gateway/gateway-page/gateway-page.component';
import {GatewayMasterdetailsPageComponent} from './gateway/gateway-page/gateway-masterdetails-page/gateway-masterdetails-page.component';
import {GatewaylistPageComponent} from './gateway/gateway-page/gateway-masterdetails-page/gatewaylist-page/gatewaylist-page.component';
import {GatewayeditFormComponent} from './gateway/gateway-page/gateway-masterdetails-page/gatewaylist-page/gatewayedit-form/gatewayedit-form.component';
import {GatewaylistFilterComponent} from './gateway/gateway-page/gateway-masterdetails-page/gatewaylist-page/gatewaylist-filter/gatewaylist-filter.component';
import {GatewaylistJqxgridComponent} from './gateway/gateway-page/gateway-masterdetails-page/gatewaylist-page/gatewaylist-jqxgrid/gatewaylist-jqxgrid.component';
import {GatewaymapPageComponent} from './gateway/gateway-page/gatewaymap-page/gatewaymap-page.component';
import {GatewaylinkFormComponent} from './gateway/gateway-page/gateway-masterdetails-page/gatewaylist-page/gatewaylink-form/gatewaylink-form.component';
import {FixturecomeditFormComponent} from './fixture/fixture-page/fixture-masterdetails-page/fixturecomlist-page/fixturecomedit-form/fixturecomedit-form.component';
import {FixturecomlistPageComponent} from './fixture/fixture-page/fixture-masterdetails-page/fixturecomlist-page/fixturecomlist-page.component';
import {FixturecomlistFilterComponent} from './fixture/fixture-page/fixture-masterdetails-page/fixturecomlist-page/fixturecomlist-filter/fixturecomlist-filter.component';
import {FixturecomlistJqxgridComponent} from './fixture/fixture-page/fixture-masterdetails-page/fixturecomlist-page/fixturecomlist-jqxgrid/fixturecomlist-jqxgrid.component';
import {FixtureMasterdetailsPageComponent} from './fixture/fixture-page/fixture-masterdetails-page/fixture-masterdetails-page.component';
import {FixturecomeditSwitchoffFormComponent} from './fixture/fixture-page/fixture-masterdetails-page/fixturecomlist-page/fixturecomedit-switchoff-form/fixturecomedit-switchoff-form.component';
import {FixturecomspeedlistPageComponent} from './fixture/fixture-page/fixture-masterdetails-page/fixturecomspeedlist-page/fixturecomspeedlist-page.component';
import {FixturecomspeededitFormComponent} from './fixture/fixture-page/fixture-masterdetails-page/fixturecomspeedlist-page/fixturecomspeededit-form/fixturecomspeededit-form.component';
import {FixturecomspeedlistFilterComponent} from './fixture/fixture-page/fixture-masterdetails-page/fixturecomspeedlist-page/fixturecomspeedlist-filter/fixturecomspeedlist-filter.component';
import {FixturecomspeedlistJqxgridComponent} from './fixture/fixture-page/fixture-masterdetails-page/fixturecomspeedlist-page/fixturecomspeedlist-jqxgrid/fixturecomspeedlist-jqxgrid.component';
import {LimitedSliderComponent} from './shared/components/limited-slider/limited-slider.component';
import {NotFoundComponent} from './shared/components/not-found/not-found.component';
import {NodelinkFormComponent} from './node/node-page/node-masterdetails-page/nodelist-page/nodelink-form/nodelink-form.component';
import {FixturegroupMdPageComponent} from './fixture/fixture-page/fixturegroup-md-page/fixturegroup-md-page.component';
import {FixtureGrlistPageComponent} from './fixture/fixture-page/fixturegroup-md-page/fixture-grlist-page/fixture-grlist-page.component';
import {FixtureGrlistJqxgridComponent} from './fixture/fixture-page/fixturegroup-md-page/fixture-grlist-page/fixture-grlist-jqxgrid/fixture-grlist-jqxgrid.component';
import {FixtureGrlinkFormComponent} from './fixture/fixture-page/fixturegroup-md-page/fixture-grlist-page/fixture-grlink-form/fixture-grlink-form.component';
import {FixtureGreditFormComponent} from './fixture/fixture-page/fixturegroup-md-page/fixture-grlist-page/fixture-gredit-form/fixture-gredit-form.component';
import {SensorPageComponent} from './sensor/sensor-page/sensor-page.component';
import {SensorMdPageComponent} from './sensor/sensor-page/sensor-md-page/sensor-md-page.component';
import {SensorlistPageComponent} from './sensor/sensor-page/sensor-md-page/sensorlist-page/sensorlist-page.component';
import {SensorlistJqxgridComponent} from './sensor/sensor-page/sensor-md-page/sensorlist-page/sensorlist-jqxgrid/sensorlist-jqxgrid.component';
import {SensoreditFormComponent} from './sensor/sensor-page/sensor-md-page/sensorlist-page/sensoredit-form/sensoredit-form.component';

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
    FixturelistFilterComponent,
    HandbookLayoutComponent,

    jqxGridComponent,
    jqxPivotGridComponent,
    jqxPivotDesignerComponent,
    jqxDataTableComponent,
    jqxListBoxComponent,
    FixturelistJqxgridComponent,
    jqxInputComponent,
    jqxNumberInputComponent,
    jqxButtonComponent,
    jqxSliderComponent,
    jqxDropDownListComponent,
    jqxWindowComponent,
    jqxFormComponent,
    jqxTabsComponent,
    FixturePageComponent,
    EventWindowComponent,
    jqxCheckBoxComponent,
    jqxCheckBoxComponent,
    jqxTextAreaComponent,
    jqxTooltipComponent,
    jqxResponsivePanelComponent,
    jqxPanelComponent,
    jqxDateTimeInputComponent,

    NodePageComponent,
    NodelistPageComponent,
    NodemapPageComponent,
    NodelistFilterComponent,
    NodelistJqxgridComponent,
    NodeMasterdetailsPageComponent,
    NodeeditFormComponent,
    FixtureeditFormComponent,
    FixturelinkFormComponent,
    GatewayPageComponent,
    GatewayMasterdetailsPageComponent,
    GatewaylistPageComponent,
    GatewayeditFormComponent,
    GatewaylistFilterComponent,
    GatewaylistJqxgridComponent,
    GatewaymapPageComponent,
    GatewaylinkFormComponent,
    FixturecomeditFormComponent,
    FixturecomlistPageComponent,
    FixturecomlistFilterComponent,
    FixturecomlistJqxgridComponent,
    FixtureMasterdetailsPageComponent,
    FixturecomeditSwitchoffFormComponent,
    FixturecomspeedlistPageComponent,
    FixturecomspeededitFormComponent,
    FixturecomspeedlistFilterComponent,
    FixturecomspeedlistJqxgridComponent,
    LimitedSliderComponent,
    NotFoundComponent,
    NodelinkFormComponent,
    FixturegroupMdPageComponent,
    FixtureGrlistPageComponent,
    FixtureGrlistJqxgridComponent,
    FixtureGrlinkFormComponent,
    FixtureGreditFormComponent,
    SensorPageComponent,
    SensorMdPageComponent,
    SensorlistPageComponent,
    SensorlistJqxgridComponent,
    SensoreditFormComponent

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
