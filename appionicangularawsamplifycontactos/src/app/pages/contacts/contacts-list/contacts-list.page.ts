import { Component, OnInit } from '@angular/core';
import { ModalController, Events } from '@ionic/angular';
import { AmplifyService } from 'aws-amplify-angular';
 import { ContactsItemModalPage } from '../contacts-item-modal/contacts-item-modal.page';
import { ContactItem } from '../../../shared/model/contactItem';
import * as Messages from '../../../shared/utils/constants'
import { AlertController } from '@ionic/angular';
import { v4 as uuid } from 'uuid';
import { Gender } from '../../../shared/model/gender';
import {Items} from '../../../shared/model/items';

@Component({
  selector: 'app-contacts-list',
  templateUrl: './contacts-list.page.html',
  styleUrls: [],
})
export class ContactsListPage implements OnInit {

  amplifyService: AmplifyService;
  modal: any;
  data: any;
  user: any;
  signedIn: boolean;

  //Contactos
  itemList: ContactItem|any;
  //Genero
  genderList: Gender[]=[];

 //Se pasa por inyección de dependencía:
 //ModalController: Para poder hacer que una vista se interponga
 //AmplifyService: Para obtener información de un usuario, nos ayudara tambíen a saber si hay esta logeado
  constructor(
    public modalController: ModalController,
    amplify: AmplifyService,
    events: Events,
    public alertController: AlertController
  ) {
    this.amplifyService = amplify;
    //Se obtienen los datos del AuthState para ver si hay un usuario logeado para obtener su infrmación
    // y luego mostrar la lista de contactos
    events.subscribe('data:AuthState', async (data) => {
      //Si hay datos en la variable user se obtienen lso datos y luego la lista de contactos
      if (data.user){
        this.user = await this.amplifyService.auth().currentUserInfo();
        this.getItems();
      }
    })
    
  }

  async ngOnInit(){
    //Se obtienen los datos del usuario actualmente logeado
    this.user = await this.amplifyService.auth().currentUserInfo();
    //Se obtiene la lista de contactos
    this.getItems();
    this.getGender();

  }

  //Porporciona los contactos
  getItems(){
    //Si esta variable tiene datos, es que hay un usuario 
    if (this.user){
      // Obtiene lso contactos ejecutando el método get pasando como parametro el id del usuario logeado,
      // para que traiga solo la información que es suya
      this.amplifyService.api().get('ApiContacts', `/Contacts/${this.user.id}`, {}).then((res) => {
        //Si la promesa tiene datos se procede a setearlos a la variable itemList y que servira para 
        //mostrarlos en la vista
        if (res && res.length > 0){
          this.itemList = res[0];
        } else {
          //Si no hay datos inicializa la variable itemList con el id sel usuario logueado
          this.itemList = new ContactItem()
          this.itemList.userId = this.user.id;
          this.itemList.items = new Array<Items>();
          
        }
      })
      .catch((err) => {
        //console.log(`There was an error getting contacts: ${err}`)
        var message:string;
        message.concat(Messages.MESSAGE_ERROR, err);
        this.displayErrorAlert(message);
      })
    } else {
      this.displayErrorAlert(Messages.MESSAGE_NO_ACTIVE_USER);
    }
  }
      
  getGender()
  {
    this.amplifyService.api().get('ApiGender', '/Gender', {}).then((res)=>{
      this.genderList= res.data;
    })
    .catch((err) => {
      var message:string;
      message.concat(Messages.MESSAGE_ERROR, err);
    });
  }   

  async deleteConfirm(i) {
    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: 'Perform the transaction?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Okay',
          handler: () => {
            this.delete(i)
            console.log('Confirm Okay');
          }
        }
      ]
    });
    await alert.present();
  }

  async displayErrorAlert(error:string)
  {
    const alert = await this.alertController.create({
      header: 'error',
      message: error,
      cssClass: 'alert-danger',
      buttons: [
      {
        text: "Ok",
        handler: data => {
          console.log("Ok Clicked")
        }
      }]
    });
    await alert.present();
  }

  async modify(item, i) {
    //Se llena el props con la variable itemsList o la instancia de la clase ConstactList cuyo constructor
    //espera recibir conuna variable generica el userId y/o los items
    console.log(this.genderList);
      var itemContact:ContactItem;
      if (this.itemList)
      {
        itemContact = this.itemList;
      }else
      {
        itemContact = new ContactItem();
        itemContact.userId = this.user.id;
        itemContact.items = new Array<Items>();
      }

    let props = {

      itemList: itemContact,
      genderList: this.genderList,
      //Asigna los valores a la variable editItem o asigna undefined
      editItem: item || undefined
    };

    //Crea el modal con el ContactsItemModalPage y pasa a su props lo que asignamos a la variable props
    const modal = await this.modalController.create({
      component: ContactsItemModalPage,
      componentProps: props
    });
    //Escucha si el modal ya fue cerrado para ejecutar las acciones de crear un registro o guardar los cambios 
    // a un registro
    modal.onDidDismiss()
    .then((result) => {
      //Si la promesa se cumplio se valida si se realizo una alta o modificación en el modal
      if (result.data.newItem){
        //Si se fue uan alta se agrega al array con el método push
        result.data.newItem.id = uuid();

        console.log(result.data.itemList.items);
        result.data.itemList.items.push(result.data.newItem)

      } else if (result.data.editItem){
        //Si es modificación de acuerdo al index pasado como parametro con i se reemplazan
        // los datos del contacto
        result.data.itemList.items[i] = result.data.editItem
      }
      //Se pasa al método save la variable itemList para que se realice la transacción
      this.save(result.data.itemList);
    });
    return await modal.present();
  }

  delete(i){
    var contact:ContactItem;
    contact = this.itemList;
    contact.items.splice(i, 1);
    this.save(contact);
  }
  
  save(list){
     //Se ejecuta el método post para guardar la lista de contactos
     this.amplifyService.api().post('ApiContacts', '/Contacts', {body: list}).then((i) => {
      //Se obtienen los items
       this.getItems();
     })
     .catch((err) => {
        this.displayErrorAlert(err);
     })
   }
  
}
