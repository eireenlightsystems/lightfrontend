import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-auth-layout',
  templateUrl: './auth-layout.component.html',
  styleUrls: ['./auth-layout.component.css']
})
export class AuthLayoutComponent implements OnInit {

  language = 'en';

  constructor(
    // service
    public translate: TranslateService) {
    // translate instructions
    translate.addLangs(['en', 'ru']);
    translate.setDefaultLang('en');
  }

  ngOnInit() {
    // set current language
    this.translate.use(this.language);
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
}
