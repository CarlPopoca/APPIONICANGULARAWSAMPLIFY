import { Injectable } from '@angular/core';
import { AmplifyService } from 'aws-amplify-angular';
import {Gender} from '../shared/model/gender';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
  })

  export class GenderService{

  amplifyService: AmplifyService;

  constructor(amplify: AmplifyService,private httpclient: HttpClient) {
      this.amplifyService = amplify;
  }

 getGender()
  {
    const obj = this.amplifyService.api().get('ApiGender', '/Gender', {}).then((res)=>{
        return res.data;
    });
     return obj;
  }
      
}