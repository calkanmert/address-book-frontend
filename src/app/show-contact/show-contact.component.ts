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

  constructor(private route: ActivatedRoute, private contactService: ContactService, private router: Router) {}

  contact: IContact | null = null;

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.contactService.getContact(params['id']).subscribe((contact) => {
        this.contact = contact
      }, (err) => {
        if (err.status == 404)
          this.router.navigate([''])
      })
    })
  }

}
