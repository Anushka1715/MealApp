import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContactUsService {

  constructor(private http:HttpClient) { }

  postQueries(contactData:any){
   return this.http.post<any>(`${environment.apiBaseurl}/Contact`,contactData);
  }
}
