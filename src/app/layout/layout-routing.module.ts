import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../components/home/home.component';
import { LayoutComponent } from './layout.component';
import { authGuard } from '../guards/auth.guard';
import { AboutUsComponent } from '../components/about-us/about-us.component';
import { TermsAndConditionsComponent } from '../components/terms-and-conditions/terms-and-conditions.component';
import { PrivacyPolicyComponent } from '../components/privacy-policy/privacy-policy.component';
import { ContactUsComponent } from '../components/contact-us/contact-us.component';
import { ChangePasswordComponent } from '../auth/change-password/change-password.component';

const routes: Routes = [{
  path: '',
  component: LayoutComponent,
  children: [{
    path: 'home',
    component: HomeComponent,
    canActivate: [authGuard]
  }, {
    path: 'aboutUs',
    component: AboutUsComponent,
    canActivate: [authGuard]
  }, {
    path: 'termsAndConditions',
    component: TermsAndConditionsComponent,
    canActivate: [authGuard]
  }, {
    path: 'privacyPolicy',
    component: PrivacyPolicyComponent,
    canActivate: [authGuard]
  }, {
    path: 'contactUs',
    component: ContactUsComponent,
    canActivate: [authGuard]
  },
  {
    path: 'change-password',
    component: ChangePasswordComponent,
    canActivate: [authGuard]
  }]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
