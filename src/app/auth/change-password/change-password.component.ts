import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { ChangePasswordService } from '../services/change-password.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent {

  changePasswordForm!: FormGroup;
  hideOld = true;
  hideNew = true;
  hideConfirm = true;
  faEye = faEye;
  faEyeSlash = faEyeSlash;

  constructor(private fb: FormBuilder,private changePasswordService:ChangePasswordService) {
    this.changePasswordForm = this.fb.group({
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator });
  }


  passwordMatchValidator(formGroup: FormGroup) {
    const newPasswordControl = formGroup.get('newPassword');
    const confirmPasswordControl = formGroup.get('confirmPassword');
  
    if (confirmPasswordControl !== null && confirmPasswordControl !== undefined) {
      if (newPasswordControl?.value !== confirmPasswordControl?.value) {
        confirmPasswordControl.setErrors({ passwordMismatch: true });
      } else {
        confirmPasswordControl.setErrors(null);
      }
    }
  }
  onSubmit() {
    if (this.changePasswordForm.valid) {
        this.changePasswordService.changePassword(this.changePasswordForm.value)
            .subscribe({
                next: (res) => {
                this.changePasswordForm.reset();
                    console.log('Success:', res);
                },
                error: (err) => {
                    console.error('Error:', err);
                    if (err.error) {
                        console.error('Error details:', err.error);
                    }
                }
            });
    }
}
}
