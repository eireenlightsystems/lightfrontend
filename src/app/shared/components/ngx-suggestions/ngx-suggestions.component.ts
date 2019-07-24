import {Component, OnInit, ViewChild} from '@angular/core';
import {NgxDadataModule, DadataConfig, DadataType} from '@kolkov/ngx-dadata';
import {SimpleHandbookComponent} from '../simple-handbook/simple-handbook.component';

@Component({
  selector: 'app-ngx-suggestions',
  templateUrl: './ngx-suggestions.component.html',
  styleUrls: ['./ngx-suggestions.component.css']
})
export class NgxSuggestionsComponent implements OnInit {

  token = 'token 6197e3632a0d2b801da8e1ac9a92e48567c9ed92';

  configAddress: DadataConfig = {
    apiKey: this.token,
    type: DadataType.address
  };
  currentAddress: any;

  constructor() {
  }

  ngOnInit() {
    localStorage.setItem('suggestions-token', this.token);

  }

  setCurrAddress(event: any) {
    this.currentAddress = event;
  }
}
