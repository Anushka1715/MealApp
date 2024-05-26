import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import ValidateForm from '../helpers/validateForm';
import { AuthServiceService } from '../services/auth-service.service';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/shared/services/users.service';
import { NgToastService } from 'ng-angular-popup';
import { faEye,faEyeSlash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{

  loginForm!:FormGroup;
  faEye = faEye;
  faEyeSlash = faEyeSlash;
  passwordVisible = false;

  constructor(private fb:FormBuilder,
    private auth:AuthServiceService,
    private router: Router,
    private userStore:UsersService,
    private toast:NgToastService){

  }
  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email:['',[Validators.required,this.customEmailValidator]],
      password:['',Validators.required]
    })
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  customEmailValidator(control: FormControl): { [key: string]: any } | null {
    const pattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    const valid = pattern.test(control.value);
    return valid ? null : { 'invalidEmail': true };
  }


  onLogin(){
    if(this.loginForm.valid){
    console.log(this.loginForm.value);
    console.log(this.loginForm);

    //send obj to database
    this.auth.login(this.loginForm.value).
    subscribe({
      next:(res) =>{

        // alert("login Success!");

        this.toast.success({detail:"SUCCESS",summary:"Login Sucessful",duration:5000});

        console.log(res);
        this.auth.storeToken(res.accessToken);
        this.auth.storeRefreshToken(res.refreshToken);
        const tokenPayload = this.auth.decodeToken();
        this.userStore.setFullNameForUser(tokenPayload.unique_name);
        // console.log(tokenPayload);
        this.userStore.setRoleForUser(tokenPayload.role);
        this.userStore.setEmailForUser(tokenPayload.email);
        this.router.navigate(['app/home']);
      },
      error:(err) => {
        this.toast.error({detail:"ERROR",summary:"Something went wrong!",duration:5000});
        
        console.log(err.error.message)
      } 
    })

    }
    else{
      
      //throw error using toaster and required fields
      ValidateForm.validateallFormFields(this.loginForm);
      this.toast.error({detail:"ERROR",summary:"Invalid Form fields!",duration:3000});
    }
  }

}
