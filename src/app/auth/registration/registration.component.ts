import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import ValidateForm from '../helpers/validateForm';
import { AuthServiceService } from '../services/auth-service.service';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { faEye,faEyeSlash } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
})
export class RegistrationComponent implements OnInit {
  //   roles=['Employee','Intern','Guest']

  //   signUpForm!:FormGroup

  //   showEmployeeIdField: boolean = false;

  //   constructor(private fb:FormBuilder){

  //   }

  //   static validate(control: FormControl) {
  //     const phoneRegex = /^\d{10}$/;
  //     if (!phoneRegex.test(control.value)) {
  //         return {
  //             phoneNumberInvalid: true
  //         };
  //     }
  //     return null;
  // }

  //   ngOnInit(): void {
  //     this.signUpForm = this.fb.group({
  //       role:['',Validators.required],
  //       empId:[''],
  //       firstName:['',Validators.required],
  //       lastName:['',Validators.required],
  //       emailId:['',Validators.email],
  //       phoneNumber:['',[Validators.required, RegistrationComponent.validate]]

  //     })
  //   }

  //   this.signUpForm.valueChanges.subscribe(value => {
  //     if (this.signUpForm.controls.phoneNumber.invalid) {
  //         console.log('Phone number is invalid');
  //     } else {
  //         console.log('Phone number is valid');
  //     }
  // });

  roles = ['Employee', 'Intern', 'Guest'];
  signUpForm!: FormGroup;
  showEmployeeIdField: boolean = false;
  faEye = faEye;
  faEyeSlash = faEyeSlash;
  passwordVisible = false;
  confirmPasswordVisible=false;

  constructor(private fb: FormBuilder, 
    private auth: AuthServiceService,
    private router:Router,
    private toast:NgToastService) {}

    togglePasswordVisibility() {
      this.passwordVisible = !this.passwordVisible;
    }

    toggleConfirmPasswordVisibility() {
      this.confirmPasswordVisible = !this.confirmPasswordVisible;
    }
    

  ngOnInit(): void {
    this.signUpForm = this.fb.group(
      {
        role: ['', Validators.required],
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        emailId: ['', [Validators.required,this.customEmailValidator]],
        phoneNumber: ['', [Validators.required, this.phoneNumberValidator]],
        password: ['', Validators.required],
        confirmPassword: ['', Validators.required],
        token:['']
      },
      {
        validator: this.passwordMatchValidator,
      }
    );
  }

  

  customEmailValidator(control: FormControl): { [key: string]: any } | null {
    const pattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    const valid = pattern.test(control.value);
    return valid ? null : { 'invalidEmail': true };
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

  onRoleSelectionChange(event: any) {
    const selectedRole = event.value;
    if (selectedRole === 'Employee') {
      this.signUpForm.addControl(
        'empId',
        new FormControl('', Validators.required)
      );
      this.showEmployeeIdField = true;
    } else {
      this.showEmployeeIdField = false;
      this.signUpForm.removeControl('empId');
      //  this.signUpForm.get('empId')!.clearValidators();
    }
    // this.signUpForm.get('empId')!.updateValueAndValidity();
  }

  phoneNumberValidator(
    control: FormControl
  ): { [key: string]: boolean } | null {
    const phoneNumberRegex = /^\d{10}$/;
    if (!phoneNumberRegex.test(control.value)) {
      return { invalidPhoneNumber: true };
    }
    return null;
  }

  onRegisteration() {
    console.log(this.signUpForm);
    if (this.signUpForm.valid) {
      console.log(this.signUpForm.value);

      // Exclude confirm password field from data to be sent to backend
      const formData = { ...this.signUpForm.value };
      delete formData.confirmPassword;

      // logic of signup
      this.auth.register(this.signUpForm.value).subscribe({
        next: (res) => {
          // alert(res.message);
          this.toast.success({detail:"SUCCESS",summary:"User Registered Sucessfully!",duration:5000})
          this.signUpForm.reset();
          this.router.navigate(['login']);
        },
        error: (err) => {
          alert(err.error.message);
        },
      });
    } else {
      //logic for throwing errors
      ValidateForm.validateallFormFields(this.signUpForm);
      this.toast.error({detail:"ERROR",summary:"Invalid Form Fields!",duration:3000});
    }
  }
}
