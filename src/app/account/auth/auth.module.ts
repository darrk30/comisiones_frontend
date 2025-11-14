import { NgModule } from '@angular/core';

import { AuthRoutingModule } from './auth-routing';
import { SsoComponent } from './sso/sso.component';

@NgModule({
  declarations: [
  ],
  imports: [
    AuthRoutingModule,
  ]
})
export class AuthModule { }
