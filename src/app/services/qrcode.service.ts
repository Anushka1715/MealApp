import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class QRCodeService {

  constructor(private http:HttpClient) { }

  getQrCodeByBookingId(bookingId:string):Observable<any>{
    return this.http.get<any>(`${environment.apiBaseurl}/Coupon/${bookingId}`)
  }

  redeemCoupon(couponId:string):Observable<boolean>{
    return this.http.post<boolean>(`${environment.apiBaseurl}/Coupon/redeem/${couponId}`,{})
  }
}
