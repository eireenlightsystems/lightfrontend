// @ts-ignore
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {FlexLayoutModule} from '@angular/flex-layout';
import {BrowserAnimationsModule, NoopAnimationsModule} from '@angular/platform-browser/animations';
import {NgxDadataModule} from '@kolkov/ngx-dadata';

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
import {jqxComboBoxComponent} from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxcombobox';
import {jqxWindowComponent} from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxwindow';
import {jqxFormComponent} from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxform';
import {jqxTabsComponent} from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxtabs';
import {jqxCheckBoxComponent} from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxcheckbox';
import {jqxTextAreaComponent} from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxtextarea';
import {jqxTooltipComponent} from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxtooltip';
import {jqxResponsivePanelComponent} from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxresponsivepanel';
import {jqxPanelComponent} from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxpanel';
import {jqxDateTimeInputComponent} from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxdatetimeinput';
import {jqxSplitterComponent} from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxsplitter';

import {LoaderComponent} from './components/loader/loader.component';
import {EventWindowComponent} from './components/event-window/event-window.component';
import {FilterTableComponent} from './components/filter-table/filter-table.component';
import {FilterItemComponent} from './components/filter-table/filter-item/filter-item.component';
import {LinkFormComponent} from './components/link-form/link-form.component';
import {ButtonPanelComponent} from './components/button-panel/button-panel.component';
import {EditFormComponent} from './components/edit-form/edit-form.component';
import {EditFormItemComponent} from './components/edit-form/edit-form-item/edit-form-item.component';
import {JqxgridComponent} from './components/jqxgrid/jqxgrid.component';
import {SimpleHandbookComponent} from './components/simple-handbook/simple-handbook.component';

import {ButtonSettinggridDirective} from './directives/button-settinggrid.directive';
import {ButtonSimpleStyleDirective} from './directives/button-simple-style.directive';
import {InputFilterStyleDirective} from './directives/input-filter-style.directive';
import {ComboboxFilterDirective} from './directives/combobox-filter.directive';
import {ButtonFilterDirective} from './directives/button-filter.directive';
import {ButtonLinkDirective} from './directives/button-link.directive';
import {BackgroundLightorangeDirective} from './directives/background-lightorange.directive';
import {BackgroundLightredDirective} from './directives/background-lightred.directive';
import {YellowWavesDirectiveDirective} from './directives/yellow-waves-directive.directive';
import {ButtonMenuDirective} from './directives/button-menu.directive';
import {TextFontweightDirective} from './directives/text-fontweight.directive';
import {NgxSuggestionsComponent} from './components/ngx-suggestions/ngx-suggestions.component';


@NgModule({
  declarations: [
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
    jqxTextAreaComponent,
    jqxTooltipComponent,
    jqxResponsivePanelComponent,
    jqxPanelComponent,
    jqxDateTimeInputComponent,
    jqxSplitterComponent,

    LoaderComponent,
    EventWindowComponent,
    FilterTableComponent,
    FilterItemComponent,
    LinkFormComponent,
    ButtonPanelComponent,
    EditFormComponent,
    EditFormItemComponent,
    JqxgridComponent,
    NgxSuggestionsComponent,
    SimpleHandbookComponent,

    ButtonSettinggridDirective,
    ButtonSimpleStyleDirective,
    InputFilterStyleDirective,
    ComboboxFilterDirective,
    ButtonFilterDirective,
    ButtonLinkDirective,
    BackgroundLightorangeDirective,
    BackgroundLightredDirective,
    YellowWavesDirectiveDirective,
    ButtonMenuDirective,
    TextFontweightDirective,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxDadataModule,

    BrowserAnimationsModule,
    NoopAnimationsModule,
    FlexLayoutModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
  ],
  exports: [
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
    jqxTextAreaComponent,
    jqxTooltipComponent,
    jqxResponsivePanelComponent,
    jqxPanelComponent,
    jqxDateTimeInputComponent,
    jqxSplitterComponent,

    LoaderComponent,
    EventWindowComponent,
    FilterTableComponent,
    FilterItemComponent,
    LinkFormComponent,
    ButtonPanelComponent,
    EditFormComponent,
    EditFormItemComponent,
    JqxgridComponent,
    NgxSuggestionsComponent,
    SimpleHandbookComponent,

    ButtonSettinggridDirective,
    ButtonSimpleStyleDirective,
    InputFilterStyleDirective,
    ComboboxFilterDirective,
    ButtonFilterDirective,
    ButtonLinkDirective,
    BackgroundLightorangeDirective,
    BackgroundLightredDirective,
    YellowWavesDirectiveDirective,
    ButtonMenuDirective,
    TextFontweightDirective,
  ]
})
export class SharedModule {
}

// platformBrowserDynamic().bootstrapModule(SharedModule);

// required for AOT compilation
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
