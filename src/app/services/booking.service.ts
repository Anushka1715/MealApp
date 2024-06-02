import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthServiceService } from '../auth/services/auth-service.service';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  constructor(private http:HttpClient,
    private auth:AuthServiceService) {}

  createBooking(data:any){
    const userId = this.auth.getUserIdOfUserFromToken();
    const requestData = {...data,userId};
    //console.log("Booking data:",requestData);
    return this.http.post<any>(`${environment.apiBaseurl}/Booking`,requestData);
  }

  quickBooking(data:any){
    const userId = this.auth.getUserIdOfUserFromToken();
    const requestData = {...data,userId};
    //console.log("Booking data:",requestData);
    return this.http.post<any>(`${environment.apiBaseurl}/Booking/quick-booking`,requestData);
  }

  getBookingsByUserId(){
    const userId = this.auth.getUserIdOfUserFromToken();
    console.log(typeof(userId));
    return this.http.get<any[]>(`${environment.apiBaseurl}/Booking/user/${userId}`);
  }

  cancelBooking(bookingDate:string,mealType:string):Observable<any>{
    const userId = this.auth.getUserIdOfUserFromToken();
    const params = {
      userId:userId,
      bookingDate:bookingDate,
      mealType:mealType
    };

    return this.http.delete(`${environment.apiBaseurl}/Booking`,{params});
  }

  addFeedback(data:any){
    const userId = this.auth.getUserIdOfUserFromToken();
    const requestData = {...data,userId};
    return this.http.post<any>(`${environment.apiBaseurl}/FeedbackControllercs`, data);
  }
}
