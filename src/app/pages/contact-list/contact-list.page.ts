import { Component, OnInit } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { Contact } from '../shared/contact';
import { ContactService } from './../shared/contact.service';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.page.html',
  styleUrls: ['./contact-list.page.scss'],
})
export class ContactListPage implements OnInit {
  contacts: Contact[] = [];

  constructor(
    private contactService: ContactService,
    private toasCtrl: ToastController,
    private alertCtrl: AlertController) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.loadContacts();
  }

  async loadContacts() {
    this.contacts = await this.contactService.getAll();
  }

  doSearchClear() {
    this.loadContacts();
  }

  async doSearchChange($event: any) {
    const value = $event.target.value;
    if (value && value.length >= 2) {
      this.contacts = await this.contactService.filter(value);
    }
  }

  async delete(contact: Contact) {
    const alert = await this.alertCtrl.create({
      header: 'Deletar?',
      message: `Desejar excluir o contato: ${contact.name}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Excluir',
          handler: () => {
            this.executeDelete(contact);
          }
        }
      ]
    });

    await alert.present();
  }

  async executeDelete(contact: Contact) {
    try {
      await this.contactService.delete(Number(contact.id));

      const index = this.contacts.indexOf(contact);
      this.contacts.splice(index, 1);

      const toast = await this.toasCtrl.create({
        header: 'Sucesso',
        message: 'Contato excluído com sucesso',
        color: 'success',
        duration: 3000
      });
      toast.present();

    } catch (error) {
      const toast = await this.toasCtrl.create({
        header: 'Erro',
        message: 'Ocorreu um erro ao tentar excluir o contato',
        color: 'danger',
        duration: 3000
      });
      toast.present();
    }
  }

  toggleSelect(contact: Contact) {
    contact.selected = !contact.selected;
  }
}
