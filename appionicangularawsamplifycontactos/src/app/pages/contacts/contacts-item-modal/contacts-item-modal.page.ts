import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import {ContactItem} from '../../../shared/model/contactItem';
import {Items} from '../../../shared/model/items';
import {Gender} from '../../../shared/model/gender';

@Component({
  selector: 'app-contacts-item-modal',
  templateUrl: './contacts-item-modal.page.html',
  styleUrls: [],
})
export class ContactsItemModalPage implements OnInit {

  itemList: ContactItem;
  genderList: Gender[]=[];
  editItem: Items;
  newItem: Items;
  user: any;
  item: Items;

  
  constructor(private modalController: ModalController) {}

  ngOnInit(){

   //Si la variable editItem tiene valor, se seteara a la variable item para que se refleje en la vista
   // de lo contrario se setea a item con los valores inicializados de la clase ContactItem
    this.item = this.editItem ? Object.assign({}, this.editItem) : new Items()
    console.log(this.genderList);
  }

  save() {
    
    this.modalController.dismiss({
      itemList: this.itemList,
      /* 
       Retornamos un valor newItem o editItem dependiendo de si se está llevando a cabo una operación de edición
         para que el módulo de lista pueda decidir si se inserta en la matriz de elementos o se empalma en ella.
      */
     //Si this.editItem no tiene valor se retorna el valor de la variable item
      newItem: !this.editItem ? this.item : null,
      //Si this.editItem tiene valor se retorna el valor de la variable item
      editItem: this.editItem ? this.item : null
    });

  };

  cancel(){
    this.modalController.dismiss({itemList: this.itemList})
  }
}