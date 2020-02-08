import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TabsPageRoutingModule } from './tabs-routing.module';
import { TabsPage } from './tabs.page';
import { HomePageModule } from '../../home/home.module';
import {ContactsListModule} from '../../pages/contacts/contacts-list/contacts-list.module';
import {ContactPageModule} from '../../pages/contact/contact.module';
import {ContactsListPage} from '../contacts/contacts-list/contacts-list.page';
import {ContactsItemModalPage} from '../contacts/contacts-item-modal/contacts-item-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TabsPageRoutingModule,
    HomePageModule,
    ContactsListModule,
    ContactPageModule
  ],
  declarations: [TabsPage, ContactsListPage, ContactsItemModalPage],
   providers: []
})
export class TabsPageModule {}
