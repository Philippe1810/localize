import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Contact } from '../shared/contact';
import { ContactService } from './../shared/contact.service';
import { SMS } from '@ionic-native/sms/ngx';
import { Platform, AlertController } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';


declare var cordova: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  contacts: Contact[] = [];
  isTrackingEnabled = false;
  confirmationTimeout: any;

  constructor(
    private contactService: ContactService,
    private router: Router,
    private sms: SMS,
    private platform: Platform,
    private geolocation: Geolocation,
    private alertController: AlertController
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
    let temNumero = false;
  
    for (const contact of this.contacts) {
      const numeroDestino = contact.phoneNumber;
  
      if (numeroDestino) {
        temNumero = true;
  
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
  
    if (!temNumero) {
      console.log('Nenhum número de telefone disponível para enviar SMS.');
      // Adicione aqui o código para lidar com a falta de número de telefone, se necessário.
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
  
            console.log('Link de Localização:', link);
  
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

  async iniciarRastreamento() {
    if (!this.isTrackingEnabled) {
      this.isTrackingEnabled = true;
      let shouldPrompt = true;
  
      while (this.isTrackingEnabled) {
        if (shouldPrompt) {
          await this.mostrarPopupConfirmacao();
          shouldPrompt = false; // Mostra o popup apenas uma vez por ciclo
        }
  
        await this.delay(10000); // Espera 10 segundos antes de perguntar novamente
  
        // Verifica se o popup ainda está aberto após 10 segundos
        await this.enviarSMSSeTimeoutExpirar();
        shouldPrompt = true; // Habilita o popup para o próximo ciclo
      }
    }
  }

  async delay(ms: number): Promise<void> {
    return new Promise<void>(resolve => setTimeout(resolve, ms));
  }
  
  async mostrarPopupConfirmacao() {
    const alert = await this.alertController.create({
      header: 'Confirmação',
      message: 'Você está seguro?',
      buttons: [
        {
          text: 'Não',
          handler: async () => {
            clearTimeout(this.confirmationTimeout);
            this.isTrackingEnabled = false;
            await this.enviarSMS();
          }
        },
        {
          text: 'Sim',
          handler: () => {
            clearTimeout(this.confirmationTimeout);
            this.iniciarRastreamento(); // Reinicia o rastreamento após 10 segundos
          }
        }
      ]
    });
  
    await alert.present();
  
    // Após 10 segundos, verifica se o popup ainda está aberto e envia SMS se não houver resposta
    this.confirmationTimeout = setTimeout(async () => {
      await this.enviarSMSSeTimeoutExpirar();
    }, 10000);
  }

  async enviarSMSSeTimeoutExpirar() {
    if (this.isTrackingEnabled) {
      const alert = await this.alertController.getTop();
  
      if (alert) {
        clearTimeout(this.confirmationTimeout);
        this.isTrackingEnabled = false;
        await this.enviarSMS();
        await alert.dismiss(); // Fecha o popup
      }
    }
  }

  rastreamentoAtivado(): boolean {
    // Suponha que 'isTrackingEnabled' é a variável que controla o estado de rastreamento
    return this.isTrackingEnabled;
  }

  async desativarRastreamento() {
    if (this.isTrackingEnabled) {
      this.isTrackingEnabled = false;
      clearTimeout(this.confirmationTimeout); // Limpa o timeout do popup, se houver
      const alert = await this.alertController.getTop();
      if (alert) {
        await alert.dismiss(); // Fecha o popup, se estiver aberto
      }
    } else {
      console.log('O rastreamento já está desativado.');
    }
  }

  async obterLocalizacaoEIniciarRastreamento() {
    try {
      await this.obterLocalizacao();

      if (this.rastreamentoAtivado()) {
        console.log('Rastreamento já ativado.');
      } else {
        this.iniciarRastreamento();
      }
    } catch (error) {
      console.error('Erro ao obter localização:', error);
    }
    } 
  }
