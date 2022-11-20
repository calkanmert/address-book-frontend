import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ContactListComponent } from './contact-list/contact-list.component';
import { NewContactComponent } from './new-contact/new-contact.component';
import { ShowContactComponent } from './show-contact/show-contact.component';

const routes: Routes = [
  { path: '', component: ContactListComponent },
  { path: 'new', component: NewContactComponent },
  { path: 'show/:id', component: ShowContactComponent },
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }