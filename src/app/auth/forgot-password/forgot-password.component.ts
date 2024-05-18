import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { NgToastService } from 'ng-angular-popup';
import { ResetPasswordService } from '../services/reset-password.service';


@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {

  constructor(private toast:NgToastService,
    private resetService:ResetPasswordService){

  }

  resetPasswordEmail = new FormControl('', [Validators.required, this.customEmailValidator]);
  isValidEmail = true;

  checkValidEmail(){
    this.isValidEmail = this.resetPasswordEmail.valid;
    return this.isValidEmail
  }

  customEmailValidator(control: FormControl): { [key: string]: any } | null {
    const pattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    const valid = pattern.test(control.value);
    return valid ? null : { 'invalidEmail': true };
  }

  confirmToSend(){
    if(this.checkValidEmail()){
      const emailValue = this.resetPasswordEmail.value ?? '';
      console.log(emailValue);
      //api call to be done

      if (emailValue) {
        this.resetService.sendResetPasswordLink(emailValue)
          .subscribe({
            next: (res) => {
              let email = res;
              console.log(email);
              this.resetPasswordEmail.reset();
              this.toast.success({ detail: "SUCCESS", summary: "Sent an email to reset password!", duration: 5000 });
            },
            error: (err) => {
              console.error(err);
              this.toast.error({ detail: "ERROR", summary: "Failed to send reset email. Please try again.", duration: 5000 });
            }
          });
      } 
    }

  }

}
