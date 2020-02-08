import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TabsPageRoutingModule } from './tabs-routing.module';
import { TabsPage } from './tabs.page';
import { HomePageModule } from '../../home/home.module';
import { AuthGuardService} from '../../services/auth-guard.service';
import { AmplifyAngularModule, AmplifyIonicModule, AmplifyService } from 'aws-amplify-angular';
import {ContactsListModule} from '../../pages/contacts/contacts-list/contacts-list.module';
import {ContactPageModule} from '../../pages/contact/contact.module';
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
  declarations: [TabsPage],
   providers: [AuthGuardService]
})
export class TabsPageModule {}
