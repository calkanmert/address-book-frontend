import { Component, OnInit } from '@angular/core';
import { IContact } from '../interfaces/contact.interface';
import { ContactService } from '../services/contact.service';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css'],
  providers: [ContactService]
})
export class ContactListComponent implements OnInit {

  contacts: IContact[] = [];
  
  filteredContacts: IContact[] = [];
  
  searchText = '';

  constructor(private contactService: ContactService) { }

  ngOnInit(): void {
    this.contactService.getContacts().subscribe((contacts: IContact[]) => {
      this.contacts = contacts;
      this.filteredContacts = contacts;
    });
  }

  search() {
    if (this.searchText.trim().length > 0) {
      this.filteredContacts = this.contacts.filter(items => {
        const phones: any = [];
        const emails: any = [];
  
        items.phones.forEach((phone: any) => {
          if (phone.value.includes(this.searchText))
            phones.push(phone.value)
        })
  
        items.emails.forEach((email: any) => {
          if (email.value.includes(this.searchText))
            emails.push(email.value)
        })
  
        return items.name.toLocaleLowerCase('tr').includes(this.searchText.toLocaleLowerCase('tr')) 
               || items.address.includes(this.searchText)
               || phones.length > 0
               || emails.length > 0
      })
    } else {
      this.filteredContacts = this.contacts;
    }
  }

}
