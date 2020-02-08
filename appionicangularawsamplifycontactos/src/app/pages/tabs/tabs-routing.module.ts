import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TabsPage } from './tabs.page';
import { HomePage } from '../../home/home.page';
import {ContactsListPage} from '../../pages/contacts/contacts-list/contacts-list.page';
import {ContactPage} from '../../pages/contact/contact.page';
import { AuthGuardService } from '../../services/auth-guard.service';
import {ContactsItemModalPage} from '../../pages/contacts/contacts-item-modal/contacts-item-modal.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'home',
        component: HomePage
      },
      {
        path: 'contactslist',
        component: ContactsListPage,
        canActivate: [AuthGuardService]
      },
      {
        path: 'contact',
        component: ContactPage
      },
      {
        path: 'contactsitem',
        component: ContactsItemModalPage
      }
      
    ]
  },
  {
    path:'',
    redirectTo: '/tabs/home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
