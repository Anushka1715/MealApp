import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  constructor(private http:HttpClient,
    private router:Router) { }

  register(userObj:any){
    return this.http.post<any>(`${environment.apiBaseurl}/User/register`,userObj);
  }

  login(loginObj:any){
    return this.http.post<any>(`${environment.apiBaseurl}/User/authenticate`,loginObj);

  }

  logOut(){
    localStorage.removeItem('token');
    this.router.navigate(['login']);
  }

  storeToken(tokenValue:string){
    localStorage.setItem('token',tokenValue);
  }

  getToken(){
    const token= localStorage.getItem('token');
    return token;
  }

  isLoggedIn():boolean{
    return !!localStorage.getItem('token');
  }

 
}
