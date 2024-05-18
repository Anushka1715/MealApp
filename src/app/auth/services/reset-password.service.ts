import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResetPassword } from 'src/app/models/reset-password.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ResetPasswordService {

  constructor(private http:HttpClient) { }

  sendResetPasswordLink(email:string){
    return this.http.post<any>(`${environment.apiBaseurl}/User/send-reset-email/${email}`,{});
  }

  resetPassword(resetPasswordObj:ResetPassword){
    return this.http.post<any>(`${environment.apiBaseurl}/User/reset-password`,resetPasswordObj);
  }
}
