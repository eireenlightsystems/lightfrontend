// @ts-ignore
import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {MaterializeService} from '../../shared/classes/materialize.service';

import {AuthService} from '../../shared/services/auth.service';


@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit, OnDestroy {

  form: FormGroup;
  aSub: Subscription;

  constructor(private router: Router,
              private route: ActivatedRoute,
              // service
              private auth: AuthService,
              ) {
  }

  ngOnInit() {
    this.form = new FormGroup({
      login: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required, Validators.minLength(3)])
    });

    this.route.queryParams.subscribe((params: Params) => {
      if (params['registered']) {
        MaterializeService.toast('Теперь вы можете зайти в систему используя свои данные');
      } else if (params['accessDenied']) {
        MaterializeService.toast('Для начала авторизуйтесь в системе');
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
        console.warn(error.error.message);
        MaterializeService.toast(error.error.message);
        this.form.enable();
      }
    );
  }
}
