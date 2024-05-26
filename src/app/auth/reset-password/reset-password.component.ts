import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ResetPassword } from 'src/app/models/reset-password.model';
import ValidateForm from '../helpers/validateForm';
import { ResetPasswordService } from '../services/reset-password.service';
import { NgToastService } from 'ng-angular-popup';
import { faEye,faEyeSlash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit{

  resetPasswordForm!:FormGroup;
  emailToReset!:string;
  emailToken!:string;
  resetPasswordObj = new ResetPassword();
  faEye = faEye;
  faEyeSlash = faEyeSlash;
  passwordVisible = false;
  confirmPasswordVisible=false;


  constructor(private fb:FormBuilder,
    private activatedRoute:ActivatedRoute,
    private resetService:ResetPasswordService,
    private toast:NgToastService,
    private router:Router){}

  ngOnInit(): void {
   this.resetPasswordForm = this.fb.group({
    password:[null,Validators.required],
    confirmPassword:[null,Validators.required]
   },
   {
    validator: this.passwordMatchValidator,
  });

  

  this.activatedRoute.queryParams.subscribe(val => {
    this.emailToReset= val['email'];
    let uriToken = val['code'];

    this.emailToken = uriToken.replace(/ /g,'+');
    console.log(this.emailToReset);
    console.log(this.emailToken);
  });
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

 toggleConfirmPasswordVisibility() {
    this.confirmPasswordVisible = !this.confirmPasswordVisible;
  }
  

  reset(){
    if(this.resetPasswordForm.valid){
      this.resetPasswordObj.email = this.emailToReset;
      this.resetPasswordObj.newPassword = this.resetPasswordForm.value.password;
      this.resetPasswordObj.confirmPassword = this.resetPasswordForm.value.confirmPassword;
      this.resetPasswordObj.emailToken = this.emailToken;

      console.log(this.resetPasswordObj)

      this.resetService.resetPassword(this.resetPasswordObj)
      .subscribe({
        next:(res)=>{
          this.toast.success({detail:"SUCCESS",summary:res.message,duration:5000});
          this.router.navigate(['login']);
        },
        error:(err) => {
          this.toast.error({detail:"ERROR",summary:err.message,duration:5000});
        }
      })
    }else{
      ValidateForm.validateallFormFields(this.resetPasswordForm);
    }
  }

  
  passwordMatchValidator(formGroup: FormGroup) {
    const passwordControl = formGroup.get('password');
    const confirmPasswordControl = formGroup.get('confirmPassword');

    if (
      passwordControl &&
      confirmPasswordControl &&
      passwordControl.value !== confirmPasswordControl.value
    ) {
      return { passwordMismatch: true };
    }
    return null;
  }
}
