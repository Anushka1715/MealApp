import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';
import { NgToastService } from 'ng-angular-popup';
import { TokenApiModel } from 'src/app/models/token-api.model';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  private userPayload:any;

  constructor(private http:HttpClient,
    private router:Router,
    private toast:NgToastService) {
      this.userPayload = this.decodeToken();
     }

  register(userObj:any){
    return this.http.post<any>(`${environment.apiBaseurl}/User/register`,userObj);
  }

  login(loginObj:any){
    return this.http.post<any>(`${environment.apiBaseurl}/User/authenticate`,loginObj);

  }

  logOut(){

    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    // this.toast.success({detail:"SUCCESS",summary:"Logged Out Successfully!",duration:5000})
    this.router.navigate(['login']);
  }

  storeToken(tokenValue:string){
    localStorage.setItem('token',tokenValue);
  }

  storeRefreshToken(tokenValue:string){
    localStorage.setItem('refreshToken',tokenValue);
  }

  getToken(){
    const token= localStorage.getItem('token');
    // console.log("hi:",token);
    return token;
  }

  getRefreshToken(){
   return localStorage.getItem('refreshToken'); 
  }

  isLoggedIn():boolean{
    return !!localStorage.getItem('token');
  }

  decodeToken(){
    const jwtHelper = new JwtHelperService();
    const token = this.getToken()!;
    // console.log(jwtHelper.decodeToken(token));
    return jwtHelper.decodeToken(token);
  }

  getFullNameFromToken(){
    if(this.userPayload)
    return this.userPayload.unique_name;
  }

  getRoleNameFromToken(){
    if(this.userPayload)
    return this.userPayload.role;
  }

  renewToken(tokenApi :TokenApiModel){
    return this.http.post<any>(`${environment.apiBaseurl}/User/refresh`,tokenApi);
  }
 
}
