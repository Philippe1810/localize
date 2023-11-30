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
    const mensagem = 'Teste';
    
    for (const contact of this.contacts) {
      const numeroDestino = contact.phoneNumber;
    
      if (numeroDestino) {
        try {
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
  
  async obterLocalizacao() {
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                console.log('Latitude:', position.coords.latitude);
                console.log('Longitude:', position.coords.longitude);
                // Aqui você pode usar os dados da localização
            },
            (error) => {
                console.error('Erro ao obter a localização:', error);
                // Trate os erros adequadamente
            }
        );
    } else {
        console.log('Geolocalização não é suportada neste navegador.');
        // Forneça uma mensagem ao usuário informando que a geolocalização não é suportada.
    }
}
}
