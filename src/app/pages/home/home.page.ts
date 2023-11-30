import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Contact } from '../shared/contact';
import { ContactService } from './../shared/contact.service';
import { SMS } from '@ionic-native/sms/ngx';
import { Platform } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';


declare var cordova: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  contacts: Contact[] = [];

  constructor(
    private contactService: ContactService,
    private router: Router,
    private sms: SMS,
    private platform: Platform,
    private geolocation: Geolocation
  ) {}

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.contactService.getAll().then(contacts => {
      this.contacts = contacts;
    });
  }

  async loadContacts() {
    this.contacts = await this.contactService.getAll();
    console.log('Contatos obtidos:', this.contacts);
  }

  navigateToContactList() {
    this.router.navigate(['/contacts']);
  }

  async enviarSMS() {
    for (const contact of this.contacts) {
      const numeroDestino = contact.phoneNumber;
  
      if (numeroDestino) {
        try {
          const linkLocalizacao = await this.obterLocalizacao();
          const mensagem = `Talvez eu esteja precisando de ajuda. Essa é minha localização atual: ${linkLocalizacao}`;
  
          await this.sms.send(numeroDestino, mensagem);
          console.log('SMS enviado com sucesso para:', numeroDestino);
        } catch (error) {
          console.error('Erro ao enviar SMS para', numeroDestino, error);
        }
      }
    }
  }

  async sendSMSPlugin(destinationNumber: string, message: string) {
    return new Promise<void>((resolve, reject) => {
      cordova.plugins.diagnostic.requestRuntimePermission(
        cordova.plugins.diagnostic.permission.SEND_SMS,
        async (status: any) => {
          if (status === cordova.plugins.diagnostic.permissionStatus.GRANTED) {
            try {
              await this.sms.send(destinationNumber, message);
              resolve();
            } catch (error) {
              reject(error);
            }
          } else {
            reject('Permissão para enviar SMS não concedida.');
          }
        },
        (error: any) => {
          reject(error);
        }
      );
    });
  }

  async checkAndRequestPermission() {
    return new Promise<void>((resolve, reject) => {
      cordova.plugins.diagnostic.requestRuntimePermission(
        cordova.plugins.diagnostic.permission.SEND_SMS,
        (status: any) => {
          if (status === cordova.plugins.diagnostic.permissionStatus.GRANTED) {
            resolve();
          } else {
            reject('Permissão para enviar SMS não concedida.');
          }
        },
        (error: any) => {
          reject(error);
        }
      );
    });
  }
  
  async obterLocalizacao(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
  
            // Construir o link com a latitude e longitude
            const link = `http://maps.google.com/?q=${latitude},${longitude}`;
  
            console.log('Link de Localização:', link); // Mostra o link no console
  
            resolve(link);
          },
          (error) => {
            console.error('Erro ao obter a localização:', error);
            reject(error);
          }
        );
      } else {
        console.log('Geolocalização não é suportada neste navegador.');
        reject('Geolocalização não suportada');
      }
    });
  }
  
}
