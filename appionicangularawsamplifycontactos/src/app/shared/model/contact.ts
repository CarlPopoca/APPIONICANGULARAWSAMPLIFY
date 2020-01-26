import { v4 as uuid } from 'uuid';

export interface Contacts {
    //contacts: Contact[];
    contacts: Array<Contact>;
    error: string;
  }
  
export interface Contact {
    id: string;
    name: string;
    mobile: number;
    gender: string;
  }
  
 

export  class ContactList {
  userId: any;
  items: Array<ContactItem>

  constructor(params){
    //Setea los items si contienen datos, de los contrario inicializa la variable con []
    this.items = params.items || [];
    //Setea el id del usuario
    this.userId = params.userId;
  }
}

export  class ContactItem {
  id: string;
  name: string;
  gender: string;
  mobile: number;

  constructor(params){
    this.id = uuid();
    this.name = params.name;
    this.gender = params.gender;
    this.mobile = params.mobile;
  }
}