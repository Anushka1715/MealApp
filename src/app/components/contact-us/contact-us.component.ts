import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgToastService } from 'ng-angular-popup';
import { ContactUsService } from 'src/app/services/contact-us.service';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent {

  contactUsForm!:FormGroup;

  constructor(private fb:FormBuilder,
    private contactService:ContactUsService,
    private toast:NgToastService){

    this.contactUsForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, this.customEmailValidator]],
      subject: ['', Validators.required],
      message: ['', Validators.required]
    });
  }

  customEmailValidator(control: FormControl): { [key: string]: any } | null {
    const pattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    const valid = pattern.test(control.value);
    return valid ? null : { 'invalidEmail': true };
  }

  OnSend():void{
    if(this.contactUsForm.valid){}
    this.contactService.postQueries(this.contactUsForm.value)
    .subscribe({
      next: (res) => {
        console.log(res);
        this.toast.success({detail:"SUCCESS",summary:"Your message sent successfully!",duration:3000});
        this.contactUsForm.reset();
      },
      error:(err) =>{
        console.log(err);
      }
    })
   
  }

}
