import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthServiceService } from './auth-service.service';

@Injectable({
  providedIn: 'root'
})
export class ChangePasswordService {

  constructor(private http:HttpClient,private authService:AuthServiceService) { }

  changePassword(data:any){
    const email = this.authService.getEmailOfUserFromToken(); // Assuming you have this method in your auth service
  const requestData = { ...data, email }; // Merge the email with the data object
    return this.http.post<any>(`${environment.apiBaseurl}/User/change-password`,requestData);
  }
}
