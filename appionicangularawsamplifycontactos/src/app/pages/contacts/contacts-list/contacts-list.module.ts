import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ContactsListPage } from './contacts-list.page';
import { ContactsItemModalPage } from '../contacts-item-modal/contacts-item-modal.page';

@NgModule({
  imports: [
    CommonModule,
    IonicModule.forRoot(),
    FormsModule
  ],
  declarations: [
    ContactsListPage,
    ContactsItemModalPage
  ],
  entryComponents: [
    ContactsItemModalPage
  ],
  providers: []
})
export class ContactsListModule {}
