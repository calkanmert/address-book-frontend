import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { IEmailType } from 'src/app/interfaces/email-type.interface';
import { IPhoneType } from 'src/app/interfaces/phone-type.interface';
import { ContactService } from 'src/app/services/contact.service';
import { ErrorService } from 'src/app/services/error.service';

@Component({
  selector: 'app-new-contact',
  templateUrl: './new-contact.component.html',
  styleUrls: ['./new-contact.component.css'],
  providers: [ContactService, ErrorService]
})
export class NewContactComponent implements OnInit {
  
  phoneTypes: IPhoneType[] = [];
  emailTypes: IEmailType[] = [];

  errors: any = {
    name: '',
    address: '',
  };

  newContactForm = new FormGroup({
    name: new FormControl(''),
    address: new FormControl(''),
    note: new FormControl(''),
    phones: new FormArray([
      new FormGroup({
        phone_type: new FormControl(),
        value: new FormControl(''),
      })
    ]),
    emails: new FormArray<FormGroup>([])
  });

  constructor(private contactService: ContactService, private errorService: ErrorService) { 
    this.contactService.getPhoneTypes().subscribe(phoneTypes => {
      this.phoneTypes = phoneTypes;
      this.newContactForm.controls.phones.controls[0].controls['phone_type'].setValue(this.phoneTypes[0]._id)
    });

    this.contactService.getEmailTypes().subscribe(emailTypes => {
      this.emailTypes = emailTypes;
    });
  }
  
  get phones() {
    return this.newContactForm.get('phones') as any;
  }

  get emails() {
    return this.newContactForm.controls["emails"] as any;
  }

  ngOnInit(): void {
  }

  addPhoneField() {
    this.resetError('phones');
    this.newContactForm.controls["phones"].push(new FormGroup({
      phone_type: new FormControl(this.phoneTypes[0]._id),
      value: new FormControl(''),
    }));
  }

  async deletePhoneField() {
    let errorPhoneKeys = [];

    for(let [key,value] of Object.entries(this.errors)) {
      if(key.search('phones\\[(.*?)\\].value') == 0)
        errorPhoneKeys.push(key);
    }

    const lastErrorPhoneKey = errorPhoneKeys.slice(-1)[0];
    const lastPhoneKey = Object.keys(this.phones.controls).splice(-1)[0];

    if(`phones[${lastPhoneKey}].value` == lastErrorPhoneKey)
      this.resetError(lastErrorPhoneKey);
      
    this.newContactForm.controls["phones"].removeAt(this.phones.length-1);
  }

  addEmailField() {
    this.newContactForm.controls["emails"].push(new FormGroup({
      email_type: new FormControl(this.emailTypes[0]._id),
      value: new FormControl(''),
    }));
  }

  deleteEmailField() {
    let errorEmailKeys = [];
    
    for(let [key,value] of Object.entries(this.errors)) {
      if(key.search('emails\\[(.*?)\\].value') == 0)
        errorEmailKeys.push(key);
    }
    
    const lastErrorEmailKey = errorEmailKeys.slice(-1)[0];
    const lastEmailKey = Object.keys(this.emails.controls).splice(-1)[0];
    
    if(`emails[${lastEmailKey}].value` == lastErrorEmailKey)
      this.resetError(lastErrorEmailKey);
    this.newContactForm.controls["emails"].removeAt(this.emails.length-1);
  }

  resetError(property: any) {
    delete this.errors[property];
  }

  async onSubmit() {
    const data: any = {
      name: this.newContactForm.controls.name.value,
      address: this.newContactForm.controls.address.value,
      note: this.newContactForm.controls.note.value,
      phones: this.newContactForm.controls.phones.value,
      emails: this.newContactForm.controls.emails.value
    }

    if (data.emails.length < 1)
      delete data.emails;
    
    this.contactService.createContact(data).subscribe(test => {
      alert('Contact created')
    }, async (error) => {
      if (error.error.message === 'contact_already_exists')
        alert('Contact already exists!');
      else if (error.error.message === 'invalid_phone_type')
        alert('Invalid phone type!');
      else if (error.error.message === 'invalid_email_type')
        alert('Invalid email type!');
      else if (error.error.status = 'validation_error')
        this.errors = await this.errorService.validationError(error);
    });
  }

}