import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IContact } from '../interfaces/contact.interface';
import { ContactService } from '../services/contact.service';

@Component({
  selector: 'app-show-contact',
  templateUrl: './show-contact.component.html',
  styleUrls: ['./show-contact.component.css'],
  providers: [ContactService]
})
export class ShowContactComponent implements OnInit {

  contact_id = '';

  constructor(private route: ActivatedRoute, private contactService: ContactService, private router: Router) {
    this.route.params.subscribe(params => {
      this.contact_id = params['id'];
    })
  }

  contact: IContact | null = null;

  ngOnInit(): void {
    this.contactService.getContact(this.contact_id).subscribe((contact) => {
      this.contact = contact
    }, (err) => {
      if (err.status == 404)
        this.router.navigate([''])
    })
  }

  deleteContact() {
    const isConfirmed = confirm('Are you sure?');
    if (isConfirmed) {
      this.contactService.deleteContact(this.contact_id).subscribe(message => {
        if (message == 'removed')
          this.router.navigate([''])
      }, (err) => {
        if (err)
          this.router.navigate(['']);
      })
    }
  }

}
