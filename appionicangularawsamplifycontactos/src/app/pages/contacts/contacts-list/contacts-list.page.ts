import { Component, OnInit, Input } from '@angular/core';
import { ModalController, Events } from '@ionic/angular';
import { AmplifyService } from 'aws-amplify-angular';
 import { ContactsItemModalPage } from '../contacts-item-modal/contacts-item-modal.page';
import { ContactItem, ContactList } from '../../../shared/model/contact';

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
  itemList: ContactList|any;
  signedIn: boolean;
 //Se pasa por inyección de dependencía:
 //ModalController: Para poder hacer que una vista se interponga
 //AmplifyService: Para obtener información de un usuario, nos ayudara tambíen a saber si hay esta logeado
  constructor(
    public modalController: ModalController,
    amplify: AmplifyService,
    events: Events

  ) {
  
    this.amplifyService = amplify;
    
    //Se obtienen los datos del AuthState para ver si hay un usuario logeado para obtener su infrmación
    // y luego mostrar la lista de contactos
    events.subscribe('data:AuthState', async (data) => {
      //Si hay datos en la variable user se obtienen lso datos y luego la lista de contactos
      if (data.user){
        this.user = await this.amplifyService.auth().currentUserInfo();
        this.getItems();
      } else {
        this.itemList = [];
        this.user = null;
      }
    })
 
  }

  async ngOnInit(){
    //Se obtienen los datos del usaurio actualmente logeado
    this.user = await this.amplifyService.auth().currentUserInfo();
    //Se obtiene la lista de contactos
    this.getItems();
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
            this.itemList = new ContactList({userId: this.user.id, items: []});
          }
        })
        .catch((err) => {
          console.log(`There was an error getting contacts: ${err}`)
        })
      } else {
        console.log('There is no active user');
      }
    }
  async modify(item, i) {
    //Se llena el props con la variable itemsList o la instancia de la clase ConstactList cuyo constructor
    //espera recibir conuna variable generica el userId y/o los items
    let props = {
      itemList: this.itemList || new ContactList({userId: this.user.id}),
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
    console.log(i);
    //Borra el item en la variable itemList por medio del método splice y el index en i 
    this.itemList.items.splice(i, 1);
    //Pasa al método save la variable itemList para que se guarden lso cambios
    console.log(this.itemList);
    this.save(this.itemList);
  }
  
  save(list){
     
   //Se ejecuta el método post para guardar la lista de contactos
    this.amplifyService.api().post('ApiContacts', '/Contacts', {body: list}).then((i) => {
     //Se obtienen los items
      this.getItems();
    })
    .catch((err) => {
      console.log(`There was an error while saving: ${err}`)
    })
  }

}
