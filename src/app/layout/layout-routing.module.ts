import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../components/home/home.component';
import { LayoutComponent } from './layout.component';
import { authGuard } from '../guards/auth.guard';
import { AboutUsComponent } from '../components/about-us/about-us.component';
import { TermsAndConditionsComponent } from '../components/terms-and-conditions/terms-and-conditions.component';
import { PrivacyPolicyComponent } from '../components/privacy-policy/privacy-policy.component';
import { ContactUsComponent } from '../components/contact-us/contact-us.component';

const routes: Routes = [{
  path:'',
  component:LayoutComponent,
  children:[{
    path:'home',
    component:HomeComponent,
    canActivate:[authGuard]
  },{
    path:'aboutUs',
    component:AboutUsComponent
  },{
    path:'termsAndConditions',
    component:TermsAndConditionsComponent
  },{
    path:'privacyPolicy',
    component:PrivacyPolicyComponent
  },{
    path:'contactUs',
    component:ContactUsComponent
  }]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
