import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthServiceService } from '../auth/services/auth-service.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  constructor(private http:HttpClient,
    private auth:AuthServiceService) {}

  createBooking(data:any){
    const userId = this.auth.getUserIdOfUserFromToken();
    const requestData = {...data,userId};
    console.log("Booking data:",requestData);
    return this.http.post<any>(`${environment.apiBaseurl}/Booking`,requestData);
  }

  getBookingsByUserId(date:string){
    const userId = this.auth.getUserIdOfUserFromToken();
    return this.http.get<any[]>(`${environment.apiBaseurl}/Booking/user/${userId}?date=${date}`);
  }
}
