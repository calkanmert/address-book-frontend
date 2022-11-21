import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { IEmailType } from 'src/app/interfaces/email-type.interface';
import { IPhoneType } from 'src/app/interfaces/phone-type.interface';
import { ContactService } from 'src/app/services/contact.service';
import { ErrorService } from 'src/app/services/error.service';
import { IEmail } from '../interfaces/email.interace';
import { IPhone } from '../interfaces/phone.interface';

@Component({
  selector: 'app-edit-contact',
  templateUrl: './edit-contact.component.html',
  styleUrls: ['./edit-contact.component.css'],
  providers: [ContactService, ErrorService]
})
export class EditContactComponent implements OnInit {

  contact_id = '';

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
    phones: new FormArray<FormGroup>([]),
    emails: new FormArray<FormGroup>([])
  });

  constructor(private contactService: ContactService, 
              private errorService: ErrorService, 
              private router: Router, private activatedRoute: ActivatedRoute) { 
    this.contactService.getPhoneTypes().subscribe(phoneTypes => {
      this.phoneTypes = phoneTypes;
    });

    this.contactService.getEmailTypes().subscribe(emailTypes => {
      this.emailTypes = emailTypes;
    });

    this.activatedRoute.params.subscribe((params) => {
      this.contact_id = params['id']; 
      this.contactService.getContact(params['id']).subscribe((contact) => {
        this.newContactForm.controls.name.setValue(contact.name);
        this.newContactForm.controls.address.setValue(contact.address);
        this.newContactForm.controls.note.setValue(contact.note);
        contact.phones.forEach((phone: IPhone, index: number) => {
          this.addPhoneField({ phoneType: phone.phone_type._id, value: phone.value });
        })

        contact.emails.forEach((email: IEmail, index: number) => {
          this.addEmailField({
            emailType: email.email_type._id,
            value: email.value
          })
        })
      })
    })
  }
  
  get phones() {
    return this.newContactForm.get('phones') as any;
  }

  get emails() {
    return this.newContactForm.controls["emails"] as any;
  }

  ngOnInit(): void {
  }

  addPhoneField({ phoneType, value } = { phoneType: this.phoneTypes[0]._id, value: '' }) {
    this.resetError('phones');
    this.newContactForm.controls["phones"].push(new FormGroup({
      phone_type: new FormControl(phoneType),
      value: new FormControl(value),
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

  addEmailField({ emailType, value } = { emailType: this.emailTypes[0]._id, value: '' }) {
    this.newContactForm.controls["emails"].push(new FormGroup({
      email_type: new FormControl(emailType),
      value: new FormControl(value),
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
    
    this.contactService.editContact(this.contact_id, data).subscribe(contact => {
      this.router.navigate(['/show', contact._id])
    }, async (error) => {
      if (error.error.message === 'contact_already_exists')
        this.errors.name = 'Contact already exists!'
      else if (error.error.message === 'invalid_phone_type')
        alert('Invalid phone type!');
      else if (error.error.message === 'invalid_email_type')
        alert('Invalid email type!');
      else if (error.error.status = 'validation_error')
        this.errors = await this.errorService.validationError(error);
    });
  }
}
