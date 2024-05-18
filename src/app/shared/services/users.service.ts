import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private fullName$ = new BehaviorSubject<string>("");
  private role$ = new BehaviorSubject<string>("");

  constructor() { }

  
  public getRoleFromUser(){
    return this.role$.asObservable();
  }

  public setRoleForUser(role:string){
    this.role$.next(role);
  }

  public getFullNameFromUser(){
    return this.fullName$.asObservable();
  }

  public setFullNameForUser(fullName:string){
    this.fullName$.next(fullName);
  }
}
