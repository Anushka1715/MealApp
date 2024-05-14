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

  constructor(private fb: FormBuilder, 
    private auth: AuthServiceService,
    private router:Router) {}

  ngOnInit(): void {
    this.signUpForm = this.fb.group(
      {
        role: ['', Validators.required],
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        emailId: ['', [Validators.email, Validators.required]],
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
      // this.signUpForm.get('empId')!.clearValidators();
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
          alert(res.message);
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
    }
  }
}
