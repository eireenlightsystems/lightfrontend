// angular lib
import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {MaterializeService} from '../../shared/classes/materialize.service';
import {TranslateService} from '@ngx-translate/core';
// jqwidgets
// app interfaces
// app services
import {AuthService} from '../../shared/services/auth.service';

// app components

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit, OnDestroy {

  // variables from parent component

  // determine the functions that need to be performed in the parent component

  // define variables - link to view objects

  // other variables
  form: FormGroup;
  aSub: Subscription;


  constructor(private router: Router,
              private route: ActivatedRoute,
              // service
              private auth: AuthService,
              public translate: TranslateService,
  ) {
  }

  ngOnInit() {
    this.form = new FormGroup({
      login: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required, Validators.minLength(3)])
    });

    this.route.queryParams.subscribe((params: Params) => {
      if (params['registered']) {
        MaterializeService.toast(this.translate.instant('site.auth.registered'));
      } else if (params['accessDenied']) {
        MaterializeService.toast(this.translate.instant('site.auth.accessDenied'));
      }
    });
  }

  ngOnDestroy() {
    if (this.aSub) {
      this.aSub.unsubscribe();
    }
  }

  onSubmit() {
    this.form.disable();
    this.aSub = this.auth.login(this.form.value).subscribe(
      () => {
        this.router.navigate(['/operator']);
      },
      error => {
        this.form.enable();
        console.warn(error.message);
        MaterializeService.toast(error.message);
      }
    );
  }
}
