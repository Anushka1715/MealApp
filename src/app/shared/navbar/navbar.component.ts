import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from 'src/app/auth/services/auth-service.service';
import { ApiService } from 'src/app/services/api.service';
import { UsersService } from '../services/users.service';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit{

  // public users:any=[];

  public fullName:string ="";


  constructor(private api:ApiService,
    private auth:AuthServiceService,
    private userStore:UsersService,
    private toast:NgToastService){

  }

  ngOnInit(): void {
  //  this.api.getUsers().subscribe(res => {
  //   this.users = res;
  //   console.log(this.users);
  //  });

   this.userStore.getFullNameFromUser()
   .subscribe(val => {
    let fullNameFromToken = this.auth.getFullNameFromToken();
    this.fullName = val || fullNameFromToken

    console.log("FullName:",this.fullName);
   })
  }

  logout(){
    this.toast.success({detail:"SUCCESS",summary:"logged out Successfully!",duration:5000});
    this.auth.logOut();
  }


}
