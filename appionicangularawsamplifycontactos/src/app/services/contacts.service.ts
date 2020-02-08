import { Injectable } from '@angular/core';
import { Observable, of, from} from 'rxjs';
import { AmplifyService } from 'aws-amplify-angular';
import {ContactItem} from '../shared/model/contactItem';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
  })

  export class ContactsService{

  amplifyService: AmplifyService;

  constructor(amplify: AmplifyService,private httpclient: HttpClient) {
      this.amplifyService = amplify;
  }

 getContacts(id)
  {
    
      var obj = this.amplifyService.api().get('ApiContacts', `/Contacts/${id}`, {}).then((res) => {
      var contactItem: ContactItem;
      if (res && res.length > 0){
        contactItem = new ContactItem();
        contactItem.items = res[0].items;
        contactItem.userId = res[0].userId;
      }
      return contactItem;
    });
     return obj;

  }

  saveContacts(list){
      return this.amplifyService.api().post('ApiContacts', '/Contacts', {body: list});
  }
      
}