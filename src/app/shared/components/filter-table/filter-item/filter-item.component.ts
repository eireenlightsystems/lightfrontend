// angular lib
import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';
import {isNull, isUndefined} from 'util';
import {formatDate} from '@angular/common';
import {MatSnackBar} from '@angular/material';
import {TranslateService} from '@ngx-translate/core';
// jqwidgets
import {jqxDateTimeInputComponent} from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxdatetimeinput';
import {jqxComboBoxComponent} from 'jqwidgets-scripts/jqwidgets-ng/jqxcombobox';
// app interfaces
import {GeographFias} from '../../../interfaces';
// app services
import {GeographService} from '../../../services/geograph/geograph.service';
// app components
import {DateTimeFormat} from '../../../classes/DateTimeFormat';


@Component({
  selector: 'app-filter-item',
  templateUrl: './filter-item.component.html',
  styleUrls: ['./filter-item.component.css']
})
export class FilterItemComponent implements OnInit, OnDestroy {

  // variables from parent component
  @Input() itemFilter;

  // determine the functions that need to be performed in the parent component

  // define variables - link to view objects
  @ViewChild('jqxDateTimeInput', {static: false}) jqxDateTimeInput: jqxDateTimeInputComponent;
  @ViewChild('jqxComboBox', {static: false}) jqxComboBox: jqxComboBoxComponent;

  // other variables
  oSubGeographFias: Subscription;


  constructor(
    private _snackBar: MatSnackBar,
    // service
    public translate: TranslateService,
    private geographService: GeographService) {
  }

  ngOnInit() {
    switch (this.itemFilter.type) {
      case 'jqxComboBox':

        break;
      case 'jqxDateTimeInput':
        setTimeout(_ => this.jqxDateTimeInput.setDate(this.itemFilter.defaultValue));
        break;
      default:
        break;
    }
  }

  ngOnDestroy() {
    if (this.jqxDateTimeInput) {
      this.jqxDateTimeInput.destroy();
    }
    if (this.jqxComboBox) {
      this.jqxComboBox.destroy();
    }
    if (this.oSubGeographFias) {
      this.oSubGeographFias.unsubscribe();
    }
  }

  OnSelect(event: any) {
    this.itemFilter.selectId = '';
    this.itemFilter.defaultValue = '';
    if (!isUndefined(event)
      && !isUndefined(event.args)
      && !isUndefined(event.args.item)
      && !isUndefined(event.args.item.value)
      && !isUndefined(event.args.item.index)) {
      this.itemFilter.selectId = event.args.item.value;
      this.itemFilter.defaultValue = event.args.item.index;
    }
  }

  onValueChanged(event: any) {
    this.itemFilter.selectId = '';
    if (!isUndefined(event.args)) {
      this.itemFilter.selectId = new DateTimeFormat().fromDataPickerString(event.args.date);
      this.itemFilter.defaultValue = formatDate(event.args.date, 'yyyy-MM-dd HH:mm', 'en');
    }
  }

  selectedAddress(fiasAddress: any) {
    const geographFias: GeographFias = new GeographFias();
    let geographID: any;

    geographFias.postalCode = fiasAddress.data.postal_code;
    geographFias.okato = fiasAddress.data.okato;
    geographFias.fiasLevel = fiasAddress.data.fias_level;
    geographFias.regionFiasId = fiasAddress.data.region_fias_id;
    geographFias.regionWithType = fiasAddress.data.region_with_type;
    geographFias.areaFiasId = fiasAddress.data.area_fias_id;
    geographFias.areaWithType = fiasAddress.data.area_with_type;
    geographFias.cityFiasId = fiasAddress.data.city_fias_id;
    geographFias.cityWithType = fiasAddress.data.city_with_type;
    geographFias.cityDistrictFiasId = fiasAddress.data.city_district_fias_id;
    geographFias.cityDistrictWithType = fiasAddress.data.city_district_with_type;
    geographFias.settlementFiasId = fiasAddress.data.settlement_fias_id;
    geographFias.settlementWithType = fiasAddress.data.settlement_with_type;
    geographFias.streetFiasId = fiasAddress.data.street_fias_id;
    geographFias.streetWithType = fiasAddress.data.street_with_type;
    geographFias.houseFiasId = fiasAddress.data.house_fias_id;
    geographFias.houseWithType = fiasAddress.data.house_type + ' ' + fiasAddress.data.house;
    geographFias.geoLat = fiasAddress.data.geo_lat;
    geographFias.geoLon = fiasAddress.data.geo_lon;

    // ins
    this.oSubGeographFias = this.geographService.insFias(geographFias).subscribe(
      response => {
        geographID = +response;
      },
      error => this.openSnackBar(error.error.message, this.translate.instant('site.forms.editforms.ok')),
      () => {
        this.itemFilter.selectId = !isUndefined(geographID) ? geographID : '1';
        this.itemFilter.defaultValue = !isUndefined(fiasAddress.value) ? fiasAddress.value : '';
      }
    );
  }

  inputAddress(event: any) {
    if (isNull(event)) {
      this.itemFilter.selectId = '';
      this.itemFilter.defaultValue = '';
    }
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
    });
  }
}
