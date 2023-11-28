import { Component } from '@angular/core';
import { BackgroundGeolocation } from '@awesome-cordova-plugins/background-geolocation/ngx';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import { SMS } from '@awesome-cordova-plugins/sms/ngx';
import { NavController } from '@ionic/angular';
import { ContactService } from '../shared/contact.service';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  localizacao: any = null;
  contatos: any[] = [];

  constructor(
    private geolocation: Geolocation,
    private sms: SMS,
    private navCtrl: NavController,
    private contactService: ContactService,
    private backgroundGeolocation: BackgroundGeolocation
  ) {}

  ionViewWillEnter() {
    const config = {
      desiredAccuracy: 10,
      stationaryRadius: 20,
      distanceFilter: 30,
      debug: true,
      interval: 2000
    };
  
    this.backgroundGeolocation.configure(config).then(() => {
      this.backgroundGeolocation.start();
    });

    this.contactService.getAll().then(contacts => {
      this.contatos = contacts;
    });
  }

  capturarLocalizacao() {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.localizacao = {
        latitude: resp.coords.latitude,
        longitude: resp.coords.longitude
      };
    }).catch((error) => {
      console.error('Erro ao obter a localização:', error);
    });
  }

  gerarUrlLocalizacao() {
    if (this.localizacao) {
      return `https://maps.google.com/?q=${this.localizacao.latitude},${this.localizacao.longitude}`;
    }
    return null;
  }

  obterLocalizacaoContinua() {
    this.backgroundGeolocation.getCurrentLocation().then((location) => {
      console.log('Latitude: ' + location.latitude + ', Longitude: ' + location.longitude);
    });
  }

  enviarSMS() {
    const urlLocalizacao = this.gerarUrlLocalizacao();

    if (urlLocalizacao) {
      this.contatos.forEach(contact => {
        const mensagem = `Confira minha localização: ${urlLocalizacao}`;
        const numeroDestino = contact.phoneNumber;

        this.sms.send(numeroDestino, mensagem).then(() => {
          console.log(`SMS enviado para ${contact.name}`);
        }).catch((error) => {
          console.error(`Erro ao enviar SMS para ${contact.name}:`, error);
        });
      });
    } else {
      console.error('Localização não capturada. Pressione o botão "Ativar Rastreamento" antes de enviar o SMS.');
    }
  }

  editarContato(id: number) {
    this.navCtrl.navigateForward(['/contact-list/edit', id]);
  }
}