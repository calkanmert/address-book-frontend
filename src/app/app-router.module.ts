import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ContactListComponent } from './contact-list/contact-list.component';
import { NewContactComponent } from './new-contact/new-contact.component';
import { ShowContactComponent } from './show-contact/show-contact.component';
import { EditContactComponent } from './edit-contact/edit-contact.component';

const routes: Routes = [
  { path: '', component: ContactListComponent },
  { path: 'new', component: NewContactComponent },
  { path: 'show/:id', component: ShowContactComponent },
  { path: 'edit/:id', component: EditContactComponent },
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes, { useHash: true })
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }