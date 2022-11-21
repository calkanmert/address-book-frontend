import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-router.module';
import { HttpClientModule } from '@angular/common/http';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

import { AppComponent } from './app.component';
import { ContactListComponent } from './contact-list/contact-list.component';
import { EditContactComponent } from './edit-contact/edit-contact.component';
import { NewContactComponent } from './new-contact/new-contact.component';
import { ShowContactComponent } from './show-contact/show-contact.component';

@NgModule({
  declarations: [
    AppComponent,
    ContactListComponent,
    EditContactComponent,
    NewContactComponent,
    ShowContactComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [{provide: LocationStrategy, useClass: HashLocationStrategy}],
  bootstrap: [AppComponent]
})
export class AppModule { }
