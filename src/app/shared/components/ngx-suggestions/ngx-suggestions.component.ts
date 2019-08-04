import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {NgxDadataModule, DadataConfig, DadataType} from '@kolkov/ngx-dadata';
import {SimpleDictionaryComponent} from '../simple-dictionary/simple-dictionary.component';
import {MaterializeService} from '../../classes/materialize.service';

@Component({
  selector: 'app-ngx-suggestions',
  templateUrl: './ngx-suggestions.component.html',
  styleUrls: ['./ngx-suggestions.component.css']
})
export class NgxSuggestionsComponent implements OnInit {

  // variables from master component
  @Input() placeholder: string;

  // determine the functions that need to be performed in the parent component
  @Output() onSelectedAddress = new EventEmitter<any>();
  @Output() onInputAddress = new EventEmitter<any>();

  // define variables - link to view objects

  // other variables
  // main
  token = 'token 6197e3632a0d2b801da8e1ac9a92e48567c9ed92';
  configAddress: DadataConfig = {
    apiKey: this.token,
    type: DadataType.address,

  };
  currentAddress: any;
  // grid
  // filter
  // edit form
  // link form
  // event form

  constructor() {
  }

  ngOnInit() {
    localStorage.setItem('suggestions-token', this.token);

  }

  selectedAddress(event: any) {
    this.currentAddress = event;
    this.onSelectedAddress.emit(this.currentAddress);
  }

  inputAddress(event: any) {
    this.onInputAddress.emit(event.data);
  }
}
