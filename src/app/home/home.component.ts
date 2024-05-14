import { Component } from '@angular/core';
import { AuthServiceService } from '../auth/services/auth-service.service';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  public users:any = [];

  constructor(private auth:AuthServiceService,
    private api:ApiService){

  }
  ngOnInit(){
    this.getUsers()
  }

  getUsers(){
    this.api.getUsers()
    .subscribe(res => {
      this.users = res;
    })
  }

  logout(){
    this.auth.logOut();
  }
}
