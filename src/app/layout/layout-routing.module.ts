import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../home/home.component';
import { LayoutComponent } from './layout.component';
import { authGuard } from '../guards/auth.guard';

const routes: Routes = [{
  path:'',
  component:LayoutComponent,
  children:[{
    path:'home',
    component:HomeComponent,
    canActivate:[authGuard]
  }]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
