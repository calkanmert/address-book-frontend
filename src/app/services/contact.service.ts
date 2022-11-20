import { Injectable } from "@angular/core";
import { environment } from '../../environments/environment';
import { IPhoneType } from "../interfaces/phone-type.interface";
import { IEmailType } from "../interfaces/email-type.interface";
import { HttpClient } from "@angular/common/http";
import { IContact } from "../interfaces/contact.interface";
import { map } from "rxjs";

@Injectable()
export class ContactService {

  constructor(private http: HttpClient) {}

  getPhoneTypes() {
    return this.http.get<IPhoneType[]>(`${environment.apiUrl}/types/phone`);
  }

  getEmailTypes() {
    return this.http.get<IEmailType[]>(`${environment.apiUrl}/types/email`);
  }

  createContact(contact: IContact) {
    return this.http.post<IContact>(`${environment.apiUrl}/contacts`, contact);
  }

  getContacts() {
    return this.http.get<IContact[]>(`${environment.apiUrl}/contacts`);
  }

  getContact(id: string) {
    return this.http.get<IContact>(`${environment.apiUrl}/contacts/${id}`);
  }

  deleteContact(id: string) {
    return this.http.delete<string>(`${environment.apiUrl}/contacts/${id}`).pipe(map((response: any) => response.message));
  }
}
