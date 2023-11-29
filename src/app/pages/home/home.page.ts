import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Contact } from '../shared/contact';
import { ContactService } from './../shared/contact.service';
import { Geolocation } from '@awesome-cordova-plugins/geolocation';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  contacts: Contact[] = [];


  constructor(private contactService: ContactService, private router: Router) {}

  ngOnInit() {
    this.contactService.getAll().then(contacts => {
      this.contacts = contacts;
    });
  }

  navigateToContactList() {
    this.router.navigate(['/contacts']);
  }

  async startLocationTracking() {
    try {
      const position = await Geolocation.getCurrentPosition();
      console.log('Latitude:', position.coords.latitude);
      console.log('Longitude:', position.coords.longitude);
      // Processamento ou uso da localização
    } catch (error) {
      console.error('Erro ao capturar a localização:', error);
      // Trate ou exiba uma mensagem de erro, se necessário
    }
  }
}
