// @ts-ignore
import {Component, OnInit} from '@angular/core';
import {NgxUiLoaderService} from 'ngx-ui-loader';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent implements OnInit {

  constructor(
    private ngxLoader: NgxUiLoaderService
  ) {
  }

  ngOnInit(): void {
    // loading process
    // this.ngxLoader.start();
    // setTimeout(() => {
    //   this.ngxLoader.stop();
    // }, 1500);
  }
}
