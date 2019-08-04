// @ts-ignore
import {AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {isUndefined} from 'util';

import {jqxDateTimeInputComponent} from 'jqwidgets-scripts/jqwidgets-ng/jqxdatetimeinput';
import {jqxComboBoxComponent} from 'jqwidgets-scripts/jqwidgets-ng/jqxcombobox';
import {DateTimeFormat} from '../../../classes/DateTimeFormat';
import {jqxTextAreaComponent} from 'jqwidgets-scripts/jqwidgets-ng/jqxtextarea';
import {jqxNumberInputComponent} from 'jqwidgets-scripts/jqwidgets-ng/jqxnumberinput';
import {Subscription} from 'rxjs';
import {GeographService} from '../../../services/geograph/geograph.service';
import {GeographFias} from '../../../interfaces';
import {MaterializeService} from '../../../classes/materialize.service';

@Component({
  selector: 'app-edit-form-item',
  templateUrl: './edit-form-item.component.html',
  styleUrls: ['./edit-form-item.component.css']
})
export class EditFormItemComponent implements OnInit, AfterViewInit, OnDestroy {

  // variables from master component
  @Input() itemEditForm;

  // determine the functions that need to be performed in the parent component

  // define variables - link to view objects
  @ViewChild('jqxDateTimeInput', {static: false}) jqxDateTimeInput: jqxDateTimeInputComponent;
  @ViewChild('jqxComboBox', {static: false}) jqxComboBox: jqxComboBoxComponent;
  @ViewChild('jqxTextArea', {static: false}) jqxTextArea: jqxTextAreaComponent;
  @ViewChild('jqxNumberInput', {static: false}) jqxNumberInput: jqxNumberInputComponent;

  // other variables
  oSubGeographFias: Subscription;

  constructor(
    // service
    private geographService: GeographService) {
  }

  ngOnInit() {

  }

  ngAfterViewInit() {
    switch (this.itemEditForm.type) {
      case 'jqxDateTimeInput':
        setTimeout(_ => this.jqxDateTimeInput.setDate(this.itemEditForm.defaultValue));
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
    if (this.jqxTextArea) {
      this.jqxTextArea.destroy();
    }
    if (this.jqxNumberInput) {
      this.jqxNumberInput.destroy();
    }
    if (this.oSubGeographFias) {
      this.oSubGeographFias.unsubscribe();
    }
  }

  OnSelect(event: any) {
    if (!isUndefined(event.args)) {
      this.itemEditForm.selectId = event.args.item.value;
      this.itemEditForm.selectCode = !isUndefined(event.args.item.originalItem.code) ? event.args.item.originalItem.code : '';
      this.itemEditForm.selectName = !isUndefined(event.args.item.originalItem.name) ? event.args.item.originalItem.name : '';
    } else {
      this.itemEditForm.selectId = '';
    }
  }

  onValueChanged(event: any) {
    if (!isUndefined(event.args)) {
      this.itemEditForm.selectId = new DateTimeFormat().fromDataPickerString(event.args.date);
    } else {
      this.itemEditForm.selectId = '';
    }
  }

  selectedAddress(fiasAddress: any) {
    let geographFias: GeographFias = new GeographFias();
    let geographID: any;

    // !isNullOrUndefined(fiasAddress.data.area_fias_id) ? fiasAddress.data.area_fias_id : 'null';
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
    //+ ' ' + fiasAddress.data.block_type + ' ' + fiasAddress.data.block + ', ' + fiasAddress.data.flat_type + ' ' + fiasAddress.data.flat;

    // ins
    this.oSubGeographFias = this.geographService.insFias(geographFias).subscribe(
      response => {
        MaterializeService.toast(`Географич. понятие id = ${+response} было добавлено.`);
        geographID = +response;
      },
      error => MaterializeService.toast(error.error.message),
      () => {
        this.itemEditForm.selectId = !isUndefined(geographID) ? geographID : '1';
        this.itemEditForm.selectCode = !isUndefined(fiasAddress.data.fias_id) ? fiasAddress.data.fias_id : '';
        this.itemEditForm.selectName = !isUndefined(fiasAddress.value) ? fiasAddress.value : '';
      }
    );
  }
}
