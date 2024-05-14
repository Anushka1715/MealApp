import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import ValidateForm from '../helpers/validateForm';
import { AuthServiceService } from '../services/auth-service.service';
import { Route, Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{

  loginForm!:FormGroup;

  constructor(private fb:FormBuilder,
    private auth:AuthServiceService,
    private router: Router){

  }
  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email:['',Validators.required],
      password:['',Validators.required]
    })
  }

  onLogin(){
    if(this.loginForm.valid){
    console.log(this.loginForm.value);
    console.log(this.loginForm);

    //send obj to database
    this.auth.login(this.loginForm.value).
    subscribe({
      next:(res) =>{

        alert(res.message);
        // console.log(res);
        this.auth.storeToken(res.token);
        this.router.navigate(['home']);
      },
      error:(err) => {
        alert(err.error.message)
      } 
    })

    }
    else{
      
      //throw error using toaster and required fields
      ValidateForm.validateallFormFields(this.loginForm);
      alert("Your form is invalid!")
    }
  }

  
}
