import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {SharedModule} from './shared/shared.module';
import {SiteModule} from './shared/layouts/site-layout/site.module';

import {AppComponent} from './app.component';
import {LoginPageComponent} from './auth/login-page/login-page.component';
import {AppRoutingModule} from './app-routing.module';
import {AuthLayoutComponent} from './shared/layouts/auth-layout/auth-layout.component';
import {RegisterPageComponent} from './auth/register-page/register-page.component';
import {TokenInterceptor} from './shared/classes/token.interceptor';
import {NotFoundComponent} from './shared/components/not-found/not-found.component';
import {MaterialModule} from './shared/material-module';
// import {NgxDadataModule} from '@kolkov/ngx-dadata';


@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    AuthLayoutComponent,
    RegisterPageComponent,
    NotFoundComponent,


  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    // NgxDadataModule,

    AppRoutingModule,
    SharedModule,
    MaterialModule,
    SiteModule,
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

